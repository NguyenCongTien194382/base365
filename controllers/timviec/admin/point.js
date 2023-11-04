const PointCompanys = require('../../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany');
const Users = require('../../../models/Users');
const PointUsed = require('../../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointUsed');
const Points = require('../../../models/Timviec365/UserOnSite/Company/ManagerPoint/Point');
const AdminUser = require('../../../models/Timviec365/Admin/AdminUser');
const HistoryGhim = require('../../../models/Timviec365/UserOnSite/Company/GhimHistory');
const NewTV365 = require('../../../models/Timviec365/UserOnSite/Company/New');
const TBLBaoLuu = require('../../../models/Timviec365/UserOnSite/Company/TblBaoLuu');
const SaveExchangePointBuy = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveExchangePointBuy");
const ExcelJS = require('exceljs');

const functions = require('../../../services/functions');

exports.lt = async(req, res, next) => {
    try {
        const usc_id = Number(req.body.usc_id);
        const point_usc = Number(req.body.point_usc);
        const point = Number(req.body.point);

        const point_bao_luu = Number(req.body.point_bao_luu);

        const hetdate = Number(req.body.hetdate);

        const startdate = Number(req.body.startdate);
        const enddate = Number(req.body.enddate);
        const usc_email = req.body.usc_email;

        const page = Number(req.body.page) || 1;

        const promiseLists = PointCompanys.aggregate([{
                $match: {
                    ...(usc_id ? { usc_id: usc_id } : {}),
                    ...(point ? { point: point } : {}),
                    ...(point_usc ? { point_usc: point_usc } : {}),
                    ...(point_bao_luu ? { point_bao_luu: point_bao_luu } : {}),
                    ...(hetdate ? {
                        ngay_reset_diem_ve_0: {
                            $gte: hetdate,
                        },
                    } : {}),
                },
            },
            {
                $sort: {
                    usc_id: -1,
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'usc_id',
                    foreignField: 'idTimViec365',
                    pipeline: [{
                        $match: {
                            idTimViec365: { $ne: 0 },
                            type: 1,
                        },
                    }, ],
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $match: {
                    $or: [{ 'user.type': 1 }, { 'user.type': { $exists: false } }],
                },
            },
            {
                $match: {
                    ...(usc_email ? { 'user.email': { $regex: new RegExp(`^${usc_email}`, 'i') } } : {}),
                    ...(startdate ? { 'user.createdAt': { $gte: startdate } } : {}),
                    ...(enddate ? { 'user.createdAt': { $lte: enddate } } : {}),
                    ...(startdate && enddate ? {
                        'user.createdAt': {
                            $gte: startdate,
                            $lte: enddate,
                        },
                    } : {}),
                },
            },
            {
                $project: {
                    _id: 1,
                    usc_id: 1,
                    point: 1,
                    point_usc: 1,
                    point_bao_luu: 1,
                    chu_thich_bao_luu: 1,
                    day_reset_point: 1,
                    ngay_reset_diem_ve_0: 1,
                    money_usc: 1,
                    user: {
                        email: 1,
                        userName: 1,
                        phone: 1,
                    },
                },
            },
            {
                $skip: (page - 1) * 30,
            },
            {
                $limit: 30,
            },
        ]);

        const promiseCount = new Promise(async(resolve, reject) => {
            let userMatch = {
                idTimViec365: { $ne: 0 },
                type: 1,
                ...(startdate ? { createdAt: { $gte: startdate } } : {}),
                ...(enddate ? { createdAt: { $lte: enddate } } : {}),
                ...(startdate && enddate ? {
                    createdAt: {
                        $gte: startdate,
                        $lte: enddate,
                    },
                } : {}),
            };
            if (usc_email)
                userMatch['email'] = { $regex: new RegExp(`^${usc_email}`, 'i') };
            let pointCompanyIds = await PointCompanys.find({
                ...(usc_id ? { usc_id: usc_id } : {}),
                ...(point ? { point: point } : {}),
                ...(point_usc ? { point_usc: point_usc } : {}),
                ...(point_bao_luu ? { point_bao_luu: point_bao_luu } : {}),
                ...(hetdate ? {
                    ngay_reset_diem_ve_0: {
                        $gte: hetdate,
                    },
                } : {}),
            });
            pointCompanyIds = pointCompanyIds.map((d) => d.usc_id);
            userMatch['idTimViec365'] = { $in: pointCompanyIds };
            const count = await Users.find(userMatch).count();
            resolve(count);
        });

        const [lists, count] = await Promise.all([promiseLists, promiseCount]);

        return functions.success(res, 'get List point is successfully', {
            lists,
            count,
        });
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.listPointPlus = async(req, res, next) => {
    try {
        const usc_id = Number(req.body.usc_id);
        const startdate = Number(req.body.startdate);
        const enddate = Number(req.body.enddate);

        const page = Number(req.body.page) || 1;
        const promiseLists = PointUsed.aggregate([{
                $match: {
                    usc_id: { $ne: 0 },
                    use_id: 0,
                    ...(startdate ? { useday: { useday: { gte: startdate } } } : {}),
                    ...(enddate ? { enddate: { $lte: enddate } } : {}),
                    ...(usc_id ? { usc_id: usc_id } : {}),
                },
            },
            {
                $sort: {
                    used_day: -1,
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'usc_id',
                    foreignField: 'idTimViec365',
                    pipeline: [{
                        $match: {
                            idTimViec365: { $ne: 0 },
                            type: 1,
                        },
                    }, ],
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $match: {
                    $or: [{ 'user.type': 1 }, { 'user.type': { $exists: false } }],
                },
            },
            {
                $skip: (page - 1) * 30,
            },
            {
                $limit: 30,
            },
            {
                $lookup: {
                    from: 'AdminUser',
                    localField: 'admin_id',
                    foreignField: 'adm_id',
                    as: 'admin',
                },
            },
            {
                $lookup: {
                    from: 'Tv365PointCompany',
                    localField: 'usc_id',
                    foreignField: 'usc_id',
                    as: 'pointCompany',
                },
            },
            {
                $project: {
                    _id: 1,
                    usc_id: 1,
                    use_id: 1,
                    type: 1,
                    type_err: 1,
                    note_uv: 1,
                    used_day: 1,
                    point: 1,
                    return_point: 1,
                    admin_id: 1,
                    ip_user: 1,
                    user: {
                        email: 1,
                        userName: 1,
                        phone: 1,
                    },
                    admin: {
                        adm_loginname: 1,
                        adm_name: 1,
                        adm_email: 1,
                    },
                    pointCompany: {
                        ngay_reset_diem_ve_0: 1,
                    },
                },
            },
        ]);
        const promiseCount = new Promise(async(resolve, reject) => {
            // let userId = await Users.find(
            // 	{
            // 		idTimViec365: { $ne: 0 },
            // 		type: 1,
            // 		...(usc_id ? { idTimViec365: usc_id } : {}),
            // 	},
            // 	{ _id: 0, idTimViec365: 1 }
            // );
            // userId = userId.map((d) => d.idTimViec365);
            const count = await PointUsed.find({
                usc_id: { $ne: 0 },
                use_id: 0,
                ...(usc_id ? { usc_id: usc_id } : {}),
                ...(startdate ? { useday: { useday: { gte: startdate } } } : {}),
                ...(enddate ? { enddate: { $lte: enddate } } : {}),
            }).count();
            resolve(count);
        });

        const [count, lists] = await Promise.all([promiseCount, promiseLists]);

        return functions.success(
            res,
            'Get list history add point to successfully', {
                lists,
                count,
            }
        );
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.listHistory = async(req, res, next) => {
    try {
        const usc_email = req.body.usc_email;
        const usc_phone_tk = req.body.usc_phone_tk;
        const usc_id = req.body.usc_id;

        const page = Number(req.body.page) || 1;
        let match = {
            usc_id: { $ne: 0 },
        };

        if (usc_id) {
            match.usc_id = Number(usc_id);
        }

        const promiseCount = PointUsed.aggregate([{
                $match: match,
            },
            {
                $group: {
                    _id: '$usc_id',
                    total: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: '_id',
                    foreignField: 'idTimViec365',
                    pipeline: [{
                            $match: {
                                idTimViec365: { $ne: 0 },
                                type: 1,
                                ...(usc_email ? { email: { $regex: new RegExp(`^${usc_email}`, 'i') } } : {}),
                                ...(usc_phone_tk ? { phone_tk: { $regex: new RegExp(`^${usc_phone_tk}`, 'i') } } : {}),
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                            },
                        },
                    ],
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $group: {
                    _id: null,
                    sum: { $sum: 1 },
                },
            },
        ]);

        const promiseLists = PointUsed.aggregate([{
                $match: match,
            },
            {
                $sort: {
                    used_day: -1,
                },
            },
            {
                $group: {
                    _id: '$usc_id',
                    usc_id: { $first: '$usc_id' },
                    use_id: { $first: '$use_id' },
                    point: { $first: '$point' },
                    type: { $first: '$type' },
                    type_err: { $first: '$type_err' },
                    note_uv: { $first: '$note_uv' },
                    used_day: { $first: '$used_day' },
                    return_point: { $first: '$return_point' },
                    admin_id: { $first: '$admin_id' },
                    ip_user: { $first: '$ip_user' },
                    value_plus: {
                        $sum: {
                            $cond: {
                                if: { $eq: ['$use_id', 0] }, // Nếu use_id = 0
                                then: '$point', // Sử dụng point
                                else: 0, // Ngược lại, sử dụng 0
                            },
                        },
                    },
                    value_ex: {
                        $sum: {
                            $cond: {
                                if: { $ne: ['$use_id', 0] }, // Nếu use_id khác 0
                                then: '$point', // Sử dụng point
                                else: 0, // Ngược lại, sử dụng 0
                            },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'usc_id',
                    foreignField: 'idTimViec365',
                    pipeline: [{
                            $match: {
                                idTimViec365: { $ne: 0 },
                                type: 1,
                                ...(usc_email ? { email: { $regex: new RegExp(`^${usc_email}`, 'i') } } : {}),
                                ...(usc_phone_tk ? { usc_phone_tk: { $regex: new RegExp(`^${usc_phone_tk}`, 'i') } } : {}),
                            },
                        },
                        {
                            $project: {
                                email: 1,
                                userName: 1,
                                phone: 1,
                            },
                        },
                    ],
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $skip: (page - 1) * 30,
            },
            {
                $limit: 30,
            },
            {
                $project: {
                    _id: 1,
                    usc_id: 1,
                    use_id: 1,
                    type: 1,
                    type_err: 1,
                    note_uv: 1,
                    used_day: 1,
                    point: 1,
                    return_point: 1,
                    admin_id: 1,
                    ip_user: 1,
                    value_plus: 1,
                    value_ex: 1,
                    user: {
                        idTimViec365: 1,
                        email: 1,
                        userName: 1,
                        phone: 1,
                        phone_tk: 1
                    },
                },
            },
        ]);

        const [count, lists] = await Promise.all([promiseCount, promiseLists]);

        return functions.success(res, 'Get list history of point is successfully', {
            count: count[0] ? count[0].sum : 0,
            lists,
        });
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.listHistoryPin = async(req, res, next) => {
    try {
        const id_admin = Number(req.body.id_admin);
        const newid_g = Number(req.body.newid_g);
        const startdate = Number(req.body.startdate);
        const enddate = Number(req.body.enddate);
        const page = Number(req.body.page) || 1;

        const promiseCount = HistoryGhim.find({
            ...(newid_g ? { new_id: newid_g } : {}),
            ...(startdate ? { created_time: { $gte: startdate } } : {}),
            ...(enddate ? { created_time: { $lte: enddate } } : {}),
            ...(startdate && enddate ? { created_time: { $gte: startdate, $lte: enddate } } : {}),
            ...(id_admin ? { adm_id: id_admin } : {}),
        }).count();
        const promiseLists = HistoryGhim.aggregate([{
                $match: {
                    ...(newid_g ? { new_id: newid_g } : {}),
                    ...(startdate ? { created_time: { $gte: startdate } } : {}),
                    ...(enddate ? { created_time: { $lte: enddate } } : {}),
                    ...(startdate && enddate ? { created_time: { $gte: startdate, $lte: enddate } } : {}),
                    ...(id_admin ? { adm_id: id_admin } : {}),
                },
            },
            {
                $sort: {
                    created_time: -1,
                },
            },
            {
                $skip: (page - 1) * 30,
            },
            {
                $limit: 30,
            },
            {
                $lookup: {
                    from: 'AdminUser',
                    localField: 'adm_id',
                    foreignField: 'adm_id',
                    pipeline: [{
                        $project: {
                            adm_loginname: 1,
                        },
                    }, ],
                    as: 'admin',
                },
            },
        ]);

        const [count, lists] = await Promise.all([promiseCount, promiseLists]);
        return functions.success(res, 'Get list history pin is successfully', {
            lists,
            count,
        });
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.listReserve = async(req, res, next) => {
    try {
        const id_ntd_bl = Number(req.body.id_ntd_bl);
        const page = Number(req.body.page) || 1;

        const count = await TBLBaoLuu.find({
            ...(id_ntd_bl ? { id_ntd_bl: id_ntd_bl } : {}),
        }).count();
        const lists = await TBLBaoLuu.find({
                ...(id_ntd_bl ? { id_ntd_bl: id_ntd_bl } : {}),
            })
            .sort({ _id: -1 })
            .skip((page - 1) * 30)
            .limit(30);

        return functions.success(res, 'Get list table reserve is successfully', {
            lists,
            count,
        });
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.listPoint = async(req, res, next) => {
    try {
        const page = Number(req.body.page) || 1;
        const count = await Points.find().count();
        const lists = await Points.find()
            .skip((page - 1) * 30)
            .limit(30);

        return functions.success(res, 'Get list box point is successfully', {
            count,
            lists,
        });
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.listEx = async(req, res, next) => {
    try {
        const record_id = Number(req.body.record_id);
        const use_id = Number(req.body.use_id);
        const tt = Number(req.body.tt);
        const page = Number(req.body.page) || 1;

        if (!record_id) return functions.setError(res, 'Missing usc_id');
        const count = await PointUsed.aggregate([{
                $match: {
                    usc_id: record_id,
                    use_id: { $ne: 0 },
                    ...(tt ? { type_err: tt } : {}),
                    ...(use_id ? { use_id: use_id } : {}),
                },
            },
            {
                $count: 'total',
            },
        ]);

        const lists = await PointUsed.aggregate([{
                $match: {
                    usc_id: record_id,
                    use_id: { $ne: 0 },
                    ...(tt ? { type_err: tt } : {}),
                    ...(use_id ? { use_id: use_id } : {}),
                },
            },
            {
                $sort: {
                    used_day: -1,
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'use_id',
                    foreignField: 'idTimViec365',
                    pipeline: [{
                            $match: {
                                idTimViec365: { $ne: 0 },
                                type: 0,
                            },
                        },
                        {
                            $project: {
                                email: 1,
                                phone: 1,
                                userName: 1,
                            },
                        },
                    ],
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
        const user = await Users.findOne({
            type: 1,
            idTimViec365: record_id,
        }, { email: 1 });

        return functions.success(
            res,
            'Get list history minus point is successfully', { email: user.email, lists, count: count[0].total }
        );
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.listPlus = async(req, res, next) => {
    try {
        const page = Number(req.body.page) || 1;
        const record_id = Number(req.body.record_id);

        if (!record_id) return functions.setError(res, 'Missing usc_id');
        const count = await PointUsed.find({
            usc_id: record_id,
            use_id: 0,
        }).count();
        const lists = await PointUsed.aggregate([{
                $match: {
                    usc_id: record_id,
                    use_id: 0,
                },
            },
            {
                $sort: {
                    used_day: -1,
                },
            },
            {
                $lookup: {
                    from: 'AdminUser',
                    localField: 'admin_id',
                    foreignField: 'adm_id',
                    pipeline: [{
                        $project: {
                            adm_loginname: 1,
                            adm_name: 1,
                        },
                    }, ],
                    as: 'admin',
                },
            },
            {
                $skip: (page - 1) * 30,
            },
            {
                $limit: 30,
            },
        ]);

        return functions.success(
            res,
            'Get list history plus point by admin is successfully', { count, lists }
        );
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.addPoint = async(req, res, next) => {
    try {
        const name = req.body.name;
        const point = Number(req.body.point);

        if (!name || !point) return functions.setError(res, 'Missing params');

        const maxId = await functions.getMaxIdByField(Points, 'point_id');
        console.log(maxId);
        const pointSave = new Points({
            point_id: maxId,
            name: name,
            point: point,
        });
        await pointSave.save();

        return functions.success(res, 'Add point successfully');
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.addReverse = async(req, res, next) => {
    try {
        const usc_id = Number(req.body.usc_id);
        const goiBl = req.body.point;
        const so_luong_tin_bl = req.body.so_luong_tin_bl;
        const time_su_dung_bl = req.body.time_su_dung_bl;
        const so_tin_tang_bl = req.body.so_tin_tang_bl;
        const point_bl = req.body.point_bl;
        const han_bao_luu = req.body.han_bao_luu;

        if (!usc_id ||
            !goiBl ||
            !so_luong_tin_bl ||
            !time_su_dung_bl ||
            !so_tin_tang_bl ||
            !point_bl ||
            !han_bao_luu
        )
            return functions.setError(res, 'Missing params');
        await new TBLBaoLuu({
            id_ntd_bl: usc_id,
            goi_bl: goiBl,
            so_luong_tin_bl: so_luong_tin_bl,
            time_su_dung_bl: time_su_dung_bl,
            so_tin_tang_bl: so_tin_tang_bl,
            point_bl: point_bl,
            han_bao_luu: han_bao_luu,
        }).save();
        return functions.success(res, 'create new Bao luu successfully');
    } catch (e) {
        return functions.setError(res, e.message);
    }
};


exports.deleteReverse = async(req, res, next) => {
    try {
        const id = Number(req.body.id);
        if (!id) return functions.setError(res, 'Missing id');
        await TBLBaoLuu.deleteOne({
            id_ntd_bl: id,
        });

        return functions.success(
            res,
            'Delete TBL reverse have id: ' + id + ' is successfully'
        );
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.deletePoint = async(req, res, next) => {
    try {
        const id = Number(req.body.id);
        if (!id) return functions.setError(res, 'Missing id');

        await Points.deleteOne({
            point_id: id,
        });
        return functions.success(
            res,
            'Delete Point is successfully have id: ' + id
        );
    } catch (e) {
        return functions.setError(res, e.message);
    }
};


exports.deleteList = async(req, res, next) => {
    try {
        const id = Number(req.body.id);
        if (!id) return functions.setError(res, 'Missing id');
        await PointCompanys.deleteOne({
            usc_id: id,
        });
        return functions.success(
            res,
            'Delete City point is successfully city have id: ' + id
        );
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.deleteHistory = async(req, res, next) => {
    try {
        const id = Number(req.body.id);
        if (!id) return functions.setError(res, 'Missing id');
        await PointUsed.deleteMany({
            usc_id: id,
        });
        return functions.success(
            res,
            'Delete History is successfully city have id: ' + id
        );
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.deleteHistoryPlus = async(req, res, next) => {
    try {
        const id = req.body.id;
        if (!id) return functions.setError(res, 'Missing id');
        await PointUsed.deleteOne({
            use_id: 0,
            _id: id,
        });
        return functions.success(
            res,
            'Delete History plus is successfully city have id: ' + id
        );
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.deleteHistoryEx = async(req, res, next) => {
    try {
        const id = Number(req.body.id);
        if (!id) return functions.setError(res, 'Missing id');
        await PointUsed.deleteOne({
            _id: id,
        });
        return functions.success(
            res,
            'Delete History plus is successfully city have id: ' + id
        );
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.deleteHistoryPin = async(req, res, next) => {
    try {
        const id = req.body.id;
        if (!id) return functions.setError(res, 'Missing id');
        await HistoryGhim.deleteOne({
            _id: new ObjectId(id),
        });
        return functions.success(
            res,
            'Delete History plus is successfully city have id: ' +
            usc_id +
            'and user have id: ' +
            use_id
        );
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.getInfoUpdateLt = async(req, res, next) => {
    try {
        const id = Number(req.body.id);
        if (!id) return functions.setError(res, 'Missing id');

        const pointcompany = await PointCompanys.findOne({
            usc_id: id,
        });

        const baoluu = (
            await TBLBaoLuu.find({
                id_ntd_bl: id,
            })
            .sort({ _id: -1 })
            .limit(1)
        )[0];

        const user = await Users.findOne({
            idTimViec365: { $ne: 0 },
            type: 1,
            idTimViec365: id,
        }, {
            email: 1,
            phone: 1,
            userName: 1,
            emailContact: 1,
        });

        return functions.success(res, 'Get info is successfully', {
            pointcompany,
            baoluu,
            user,
        });
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.updateReverse = async(req, res, next) => {
    try {
        const usc_id = Number(req.body.usc_id);
        const goiBl = req.body.point || '0';
        const so_luong_tin_bl = req.body.so_luong_tin_bl || '0';
        const time_su_dung_bl = req.body.time_su_dung_bl || '';
        const so_tin_tang_bl = req.body.so_tin_tang_bl || '';
        const point_bl = req.body.point_bl || '0';
        const han_bao_luu = req.body.han_bao_luu || '';

        if (!usc_id ||
            !goiBl ||
            !so_luong_tin_bl ||
            !time_su_dung_bl ||
            !so_tin_tang_bl ||
            !point_bl ||
            !han_bao_luu
        )
            return functions.setError(res, 'Missing params');
        await TBLBaoLuu.updateOne({
            id_ntd_bl: usc_id,
        }, {
            goi_bl: goiBl,
            so_luong_tin_bl: so_luong_tin_bl,
            time_su_dung_bl: time_su_dung_bl,
            so_tin_tang_bl: so_tin_tang_bl,
            point_bl: point_bl,
            han_bao_luu: han_bao_luu,
        });
        return functions.success(res, 'update new Bao luu successfully ' + usc_id);
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.updateUserL = async(req, res, next) => {
    try {
        const id = Number(req.body.id);

        if (!id) return functions.setError(res, 'Missing id');

        await Users.updateOne({
            idTimViec365: { $ne: 0 },
            idTimViec365: id,
            type: 1,
        }, {
            'inForCompany.timviec365.usc_loc': 1,
        });
        return functions.success(
            res,
            'Update user to vip is successfully city have id: ' + id
        );
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.updatePointCompany = async(req, res, next) => {
    try {
        const id = Number(req.body.id);
        const point = Number(req.body.point) || 0;
        const point_usc = Number(req.body.point_usc) || 0;
        const ngay_reset_diem_ve_0 = Number(req.body.ngay_reset_diem_ve_0) || 0;

        if (!id) return functions.setError(res, 'Missing id');
        await PointCompanys.updateOne({
            usc_id: id,
        }, {
            point,
            point_usc,
            ngay_reset_diem_ve_0,
        });

        return functions.success(
            res,
            'updateList City point is successfully city have id: ' + id
        );
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.updatePoint = async(req, res, next) => {
    try {
        const id = req.body.id;
        const name = req.body.name;
        const point = Number(req.body.point);
        if (!id) return functions.setError(res, 'Missing params');
        await Points.updateOne({
            point_id: id,
        }, {
            name,
            point,
        });

        return functions.success(res, 'Update box is successfully have id: ' + id);
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.getInfoPoint = async(req, res, next) => {
    try {
        const id = Number(req.body.id);

        if (!id) return functions.setError(res, 'Missing id');
        const box = await Points.findOne({
            point_id: id,
        });
        return functions.success(res, 'Get info box is successfully', { box });
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.getListAdminUsers = async(req, res, next) => {
    try {
        const admin = await AdminUser.find({
            $and: [
                { adm_delete: 0 },
                {
                    $or: [{ adm_loginname: /^kd_/ }, { adm_loginname: 'admin' }],
                },
            ],
        }, { adm_id: 1, adm_name: 1 }).sort({ adm_id: 1 });

        return functions.success(res, 'get admin finance is successfully', {
            admin,
        });
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.updatePointUsedAndCompany = async(req, res, next) => {
    try {
        const id = req.body.id;
        const usc_id = Number(req.body.usc_id);
        const use_id = Number(req.body.use_id);
        if (!id || !usc_id || !use_id)
            return functions.setError(res, 'Missing usc_id or use_id');
        await PointUsed.updateOne({
            _id: id,
        }, {
            $set: { return_point: 1 },
        });

        // Lấy xem điểm đã sử dụng bao nhiêu thì hoàn từng ý
        const dataPoint = await PointUsed.findOne({ _id: id }, { point: 1 }).lean();
        const point = dataPoint.point;

        await PointUsed.updateOne({
            usc_id: usc_id,
            use_id: 0,
        }, {
            $inc: { point: point },
        });

        await PointCompanys.updateOne({
            usc_id: usc_id,
        }, {
            $inc: { point_usc: point },
        });

        return functions.success(res, 'refound point usc_id and use_id is complete : ' + usc_id + ': ' + use_id);
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.addPointCompany = async(req, res, next) => {
    try {
        const id = Number(req.body.id);
        const point = Number(req.body.point) || 0;
        const point_usc = Number(req.body.point_usc) || 0;
        const ngay_reset_diem_ve_0 = Number(req.body.ngay_reset_diem_ve_0) || 0;

        if (!id) return functions.setError(res, 'Missing id');
        await PointCompanys.updateOne({
            usc_id: id,
        }, {
            point,
            point_usc,
            ngay_reset_diem_ve_0,
        });

        return functions.success(
            res,
            'updateList City point is successfully city have id: ' + id
        );
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.exportExcel = async(req, res, next) => {
    try {
        const record_id = Number(req.query.record_id);
        const arr_err = {
            all: 'Tất cả',
            0: 'Trạng thái',
            1: 'Đã có việc',
            2: 'Không nghe máy',
            3: 'Sai thông tin',
            4: 'Khác',
        };

        if (!record_id) return functions.setError(res, 'Missing usc_id');
        const lists = await PointUsed.aggregate([{
                $match: {
                    usc_id: record_id,
                    use_id: { $ne: 0 },
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'use_id',
                    foreignField: 'idTimViec365',
                    pipeline: [{
                            $match: {
                                idTimViec365: { $ne: 0 },
                                type: 0,
                            },
                        },
                        {
                            $project: {
                                email: 1,
                                phone: 1,
                                userName: 1,
                            },
                        },
                    ],
                    as: 'user',
                },
            },
        ]);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Sheet1');
        sheet.addRow([
            'Stt',
            'ID uv',
            'Ứng viên đã xem',
            'SĐT',
            'Trạng thái',
            'Ghi chú',
            'Số điểm trừ',
            'Type',
            'Ngày',
            'Hoàn điểm',
        ]);
        lists.forEach((element, index) => {
            sheet.addRow([
                index + 1,
                element.use_id,
                element.user[0] ? element.user[0].userName : '',
                element.user[0] ? element.user[0].phone : '',
                arr_err[element.type_err],
                element.note_uv,
                element.point,
                element.type == 0 ? '-' : 'Mất Phí',
                functions.convertDateOtherType(element.used_day * 10),
                element.return_point == 0 ? 'Chưa Hoàn' : 'Đã Hoàn',
            ]);
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');

        workbook.xlsx
            .write(res)
            .then(function() {
                res.end();
            })
            .catch(function(error) {
                console.log('Error:', error);
                res.status(500).send('Internal Server Error');
            });
    } catch (e) {
        return functions.setError(res, e.message);
    }
};
exports.getInfoAllExp = async(req, res, next) => {
    try {
        const record_id = Number(req.body.record_id);

        if (!record_id) return functions.setError(res, 'Missing usc_id');

        const lists = await PointUsed.aggregate([{
                $match: {
                    usc_id: record_id,
                    use_id: { $gt: 0 },
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'use_id',
                    foreignField: 'idTimViec365',
                    pipeline: [{
                            $match: {
                                idTimViec365: { $gt: 0 },
                                type: 0,
                            },
                        },
                        {
                            $project: {
                                email: 1,
                                phone: 1,
                                userName: 1,
                            },
                        },
                    ],
                    as: 'user',
                },
            },
            {
                $limit: 2000,
            },
        ]);

        return functions.success(
            res,
            'Get list history minus point is successfully', { lists }
        );
    } catch (e) {
        return functions.setError(res, e.message);
    }
};
exports.addCompany = async(req, res, next) => {
    try {
        const usc_id = Number(req.body.usc_id);
        const point = Number(req.body.point) || 0;
        const point_usc = Number(req.body.point_usc) || 0;
        const ngayhhdiem = Number(req.body.ngayhhdiem) || 0;
        if (!usc_id) return functions.setError(res, 'Missing params');

        const isCreate = await PointCompanys.findOne({
            usc_id: usc_id,
        });

        if (!isCreate) {
            await new PointCompanys({
                usc_id,
                point,
                point_usc,
                ngay_reset_diem_ve_0: ngayhhdiem,
            }).save();
            return functions.success(res, 'add point company successfully');
        } else return functions.success(res, 'exist id in the table');
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.addPointUsed = async(req, res, next) => {
    try {
        const usc_id = Number(req.body.usc_id);
        const use_id = Number(req.body.use_id) || 0;
        const point = Number(req.body.point) || 0;
        const admin_id = Number(req.body.admin_id);
        const ngayhhdiem = Number(req.body.ngayhhdiem) || 0;
        if (!usc_id || !admin_id) return functions.setError(res, 'Missing params');
        await new PointUsed({
            usc_id,
            use_id,
            point,
            type: 1,
            admin_id,
            used_day: functions.getTimeNow(),
        }).save();
        if (point > 0) {
            await new SaveExchangePointBuy({
                userId: usc_id,
                type: 1,
                point: point,
                expiry_date: ngayhhdiem,
                time: functions.getTimeNow(),
            }).save();
        }
        return functions.success(res, 'add point used successfully');
    } catch (e) {
        return functions.setError(res, e.message);
    }
};