const CV365 = require('../../../models/Timviec365/CV/Cv365');
const UserUnset = require('../../../models/Timviec365/UserOnSite/Candicate/UserUnset');
const NewTV365 = require('../../../models/Timviec365/UserOnSite/Company/New');
const Users = require('../../../models/Users');
const VideoCompany = require('../../../models/Timviec365/UserOnSite/Company/VideoCompany');

const functions = require('../../../services/functions');
const serviceCompany = require('../../../services/timviec365/company');

exports.ListVideoCandidate = async(req, res, next) => {
    try {
        const status = Number(req.body.status) || 1;
        const startDate = req.body.startdate || functions.getTimeNow() - 3 * 86400;
        const endDate = req.body.enddate;
        const page = Number(req.body.page) || 1;
        let match = {
            type: 0,
            'inForPerson.candidate.cv_video': { $nin: ['', null] },
            idTimViec365: { $ne: 0 },
            ...(status ? { 'inForPerson.candidate.cv_video_active': status - 1 } : {}),
            ...(startDate ? { updatedAt: { $gte: Number(startDate) } } : {}),
            ...(endDate ? { updatedAt: { $lte: Number(endDate) } } : {}),
            ...(startDate && endDate ? { updatedAt: { $gte: Number(startDate), $lte: Number(endDate) } } : {}),
        }
        const promiseCount = Users.find(match)
            // .explain();
            .count();

        const promiseLists = Users.find(match)
            .sort({ updatedAt: -1 })
            .skip((page - 1) * 30)
            .limit(30);

        const [lists, count] = await Promise.all([promiseLists, promiseCount]);
        return functions.success(res, '', { lists, count });
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

exports.ListVideoCompany = async(req, res, next) => {
    try {
        const status = Number(req.body.status);
        const startDate = req.body.startdate;
        const endDate = req.body.enddate;
        const page = Number(req.body.page) || 1;
        const promiseCount = VideoCompany.find({
            ...(status ? { video_active: status - 1 } : {}),
            ...(startDate ? { video_created_at: { $gte: Number(startDate) } } : {}),
            ...(endDate ? { video_created_at: { $lte: Number(endDate) } } : {}),
            ...(startDate && endDate ? {
                video_created_at: {
                    $gte: Number(startDate),
                    $lte: Number(endDate),
                },
            } : {}),
        }).count();

        const promiseLists = VideoCompany.find({
                ...(status ? { video_active: status - 1 } : {}),
                ...(startDate ? { video_created_at: { $gte: Number(startDate) } } : {}),
                ...(endDate ? { video_created_at: { $lte: Number(endDate) } } : {}),
                ...(startDate && endDate ? {
                    video_created_at: {
                        $gte: Number(startDate),
                        $lte: Number(endDate),
                    },
                } : {}),
            })
            .sort({ video_created_at: -1 })
            .skip((page - 1) * 30)
            .limit(30);

        const [lists, count] = await Promise.all([promiseLists, promiseCount]);
        return functions.success(res, '', { lists, count });
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

exports.ListVideoNew = async(req, res, next) => {
    try {
        const status = Number(req.body.status);
        const startDate = req.body.startdate;
        const endDate = req.body.enddate;
        const page = Number(req.body.page) || 1;
        const promiseCount = NewTV365.aggregate([{
                $match: {
                    $and: [{ new_video: { $ne: '' } }, { new_video: { $ne: null } }],
                    new_user_id: { $gt: 0 },
                    ...(status ? { new_video_active: status - 1 } : {}),
                    ...(startDate ? { new_update_time: { $gte: Number(startDate) } } : {}),
                    ...(endDate ? { new_update_time: { $lte: Number(endDate) } } : {}),
                    ...(startDate && endDate ? {
                        new_update_time: {
                            $gte: Number(startDate),
                            $lte: Number(endDate),
                        },
                    } : {}),
                },
            },
            {
                $count: 'total',
            },
        ]);
        const promiseLists = NewTV365.aggregate([{
                $match: {
                    $and: [{ new_video: { $ne: '' } }, { new_video: { $ne: null } }],
                    new_user_id: { $gt: 0 },
                    ...(status ? { new_video_active: status - 1 } : {}),
                    ...(startDate ? { new_update_time: { $gte: Number(startDate) } } : {}),
                    ...(endDate ? { new_update_time: { $lte: Number(endDate) } } : {}),
                    ...(startDate && endDate ? {
                        new_update_time: {
                            $gte: Number(startDate),
                            $lte: Number(endDate),
                        },
                    } : {}),
                },
            },
            {
                $sort: {
                    new_update_time: -1,
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'new_user_id',
                    foreignField: 'idTimViec365',
                    pipeline: [{
                        $project: {
                            userName: 1,
                            phone: 1,
                            email: 1,
                            createdAt: 1,
                        },
                    }, ],
                    as: 'user',
                },
            },
            {
                $skip: (page - 1) * 30,
            },
            {
                $limit: 30,
            },
        ]);
        const [lists, count] = await Promise.all([promiseLists, promiseCount]);
        return functions.success(res, '', {
            lists,
            count: count[0] ? count[0].total : 0,
        });
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

exports.activeVideo = async(req, res, next) => {
    try {
        const id = req.body.id;
        const nameType = Number(req.body.nameType);
        if (!id) return functions.setError(res, 'Missing id');
        switch (nameType) {
            case 1:
                await NewTV365.updateOne({
                    new_id: Number(id),
                }, {
                    new_video_active: 1,
                });

                break;
            case 2:
                await VideoCompany.updateOne({
                    _id: id,
                }, {
                    video_active: 1,
                    // 'inForCompany.timviec365.usc_video_active': 1,
                });
                break;
            case 3:
                await Users.updateOne({
                    type: 0,
                    idTimViec365: Number(id),
                }, {
                    'inForPerson.candidate.cv_video_active': 1,
                });

                break;
            default:
                return functions.setError(res, 'Not valid input');
                break;
        }
        return functions.success(res, 'active video is successfully');
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.deleteVideo = async(req, res, next) => {
    try {
        const id = req.body.id;
        const nameType = Number(req.body.nameType);
        if (!id) return functions.setError(res, 'Missing id');
        switch (nameType) {
            case 1:
                const info = await NewTV365.findOne({
                    new_id: Number(id),
                });

                if (info['new_video_type'] === 1) {
                    const user1 = await Users.findOne({
                        type: 1,
                        idTimViec365: info['new_user_id'],
                    });
                    const time1 = user1['createdAt'];
                    const arrName = info['new_video'].split(',');
                    arrName.forEach((element) => {
                        let path = serviceCompany.geturlVideo(time1) + element;
                        functions.deleteFile(path);
                    });
                }
                await NewTV365.updateOne({
                    new_id: Number(id),
                }, {
                    new_video: '',
                    new_video_active: 0,
                });
                break;
            case 2:
                const video = await VideoCompany.findOne({
                    _id: id,
                });
                const time2 = video['company']['createdAt'];
                if (video['video_type'] == 1) {
                    let path = serviceCompany.geturlVideo(time2) + video['name_video'];
                    functions.deleteFile(path);
                }
                await VideoCompany.deleteOne({
                    _id: id,
                });
                break;
            case 3:
                const user3 = await Users.findOne({
                    type: 0,
                    idTimViec365: Number(id),
                });
                const time3 = user3['createdAt'];

                let arrName3 = user3['inForPerson']['candidate']['cv_video'].split(',');
                const dateTime = functions.convertDate(time3, true);
                arrName3.forEach((element) => {
                    let basePath = `../storage/base365/timviec365/pictures/cv/${dateTime}/`;
                    let path = basePath + element;
                    functions.deleteFile(path);
                });
                await Users.updateOne({
                    type: 0,
                    idTimViec365: Number(id),
                }, {
                    'inForPerson.candidate.cv_video': '',
                    'inForPerson.candidate.cv_video_active': 0,
                });
                break;
            default:
                return functions.setError(res, 'Not valid input');
                break;
        }
        return functions.success(res, 'delete video is successfully');
    } catch (e) {
        return functions.setError(res, e.message);
    }
};