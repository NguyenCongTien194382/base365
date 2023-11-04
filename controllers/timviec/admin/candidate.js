const Users = require('../../../models/Users');
const functions = require('../../../services/functions');
const service = require('../../../services/timviec365/candidate');
const Profile = require('../../../models/Timviec365/UserOnSite/Candicate/Profile');
const HistoryDeleteUser = require('../../../models/Timviec365/Admin/Candidate/HistoryDeleteUser');
const axios = require('axios');
const ApplyForJob = require('../../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');
const SaveCvCandi = require('../../../models/Timviec365/UserOnSite/Candicate/SaveCvCandi');
const UserAddFail = require('../../../models/Timviec365/Admin/Candidate/UserAddFail');
const News = require('../../../models/Timviec365/UserOnSite/Company/New');
const NewTV365 = require('../../../models/Timviec365/UserOnSite/Company/New');
const UserUnset = require('../../../models/Timviec365/UserOnSite/Candicate/UserUnset');
const serviceDataAI = require('../../../services/timviec365/dataAI');
const serviceCrm = require('../../../services/timviec365/crm');
const sendMail = require('../../../services/timviec365/sendMail');
const City = require('../../../models/City');
const CategoryJob = require('../../../models/Timviec365/CategoryJob');

const Customer = require('../../../models/crm/Customer/customer');
const Notification = require('../../../models/Timviec365/Notification');
const serviceSendMess = require('../../../services/timviec365/sendMess');
const Tv365PointUsed = require('../../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointUsed');
const fs = require('fs');
const md5 = require('md5');

// Ứng viên bị kinh doanh ẩn
exports.candi_hide_kd = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;
        const skip = (page - 1) * pageSize;
        let condition = {
            type: { $ne: 1 },
            $and: [{ 'inForPerson.candidate.use_show': 0 }, { 'inForPerson.candidate.cv_cate_id': 9 }],
            idTimViec365: { $gt: 0 },
        };
        if (req.body.start && !req.body.end) {
            condition.createdAt = { $gte: Number(req.body.start) };
        } else if (!req.body.start && req.body.end) {
            condition.createdAt = { $lte: Number(req.body.end) };
        } else if (req.body.start && req.body.end) {
            condition.createdAt = { $gte: Number(req.body.start), $lte: Number(req.body.end) };
        }

        if (req.body.userName) {
            condition.userName = { $regex: req.body.userName, $options: 'i' };
        }
        if (req.body.phoneTK) {
            condition.phone = req.body.phoneTK;
        }
        if (req.body.email) {
            condition.emailContact = { $regex: req.body.email, $options: 'i' };
        }
        let condition_2 = {};
        if (Number(req.body.cv) == 2) {
            condition_2['$or'] = [{ 'profile.hs_link': { $exists: true } }, { 'cv.name_img': { $exists: true } }];
        }

        let listUser = await Users.aggregate([{
                $match: condition,
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $lookup: {
                    from: 'SaveCvCandi',
                    localField: 'idTimViec365',
                    foreignField: 'uid',
                    as: 'cv',
                },
            },
            {
                $unwind: { path: '$cv', preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: 'Tv365Profile',
                    localField: 'idTimViec365',
                    foreignField: 'hs_use_id',
                    as: 'profile',
                },
            },
            {
                $unwind: { path: '$profile', preserveNullAndEmptyArrays: true },
            },
            {
                $match: condition_2,
            },
            {
                $skip: skip,
            },
            {
                $limit: pageSize,
            },
            {
                $project: {
                    userName: 1,
                    phone: 1,
                    phoneTk: 1,
                    email: 1,
                    avatarUser: 1,
                    emailContact: 1,
                    createdAt: 1,
                    profile_link: '$profile.hs_link',
                    cv_link: '$cv.name_img',
                    cv_time: '$cv.time_edit',
                    profile_time: '$profile.hs_create_time',
                    idTimViec365: 1,
                },
            },
        ]);

        listUser.map((item) => {
            if (item.createdAt && item.avatarUser)
                item.imagecdn = functions.getImageUv(item.createdAt, item.avatarUser);
            if (item.profile_link) item.profile_link = service.getUrlProfile(item.createdAt, item.profile_link);
            if (item.cv_link) item.cv_link = functions.imageCv(item.createdAt, item.cv_link);
            return item;
        });

        return functions.success(res, 'Danh sách', {
            data: {
                listUser,
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.count_candi_hide_kd = async(req, res) => {
    try {
        let condition = {
            type: { $ne: 1 },
            $and: [{ 'inForPerson.candidate.use_show': 0 }, { 'inForPerson.candidate.cv_cate_id': 9 }],
            idTimViec365: { $gt: 0 },
        };
        if (req.body.start && !req.body.end) {
            condition.createdAt = { $gte: Number(req.body.start) };
        } else if (!req.body.start && req.body.end) {
            condition.createdAt = { $lte: Number(req.body.end) };
        } else if (req.body.start && req.body.end) {
            condition.createdAt = { $gte: Number(req.body.start), $lte: Number(req.body.end) };
        }

        if (req.body.userName) {
            condition.userName = { $regex: req.body.userName, $options: 'i' };
        }
        if (req.body.phoneTK) {
            condition.phone = req.body.phoneTK;
        }
        if (req.body.email) {
            condition.emailContact = { $regex: req.body.email, $options: 'i' };
        }
        let condition_2 = {};
        if (Number(req.body.cv) == 2) {
            condition_2['$or'] = [{ 'profile.hs_link': { $exists: true } }, { 'cv.name_img': { $exists: true } }];
        }

        let totalCount = await Users.aggregate([{
                $match: condition,
            },
            {
                $lookup: {
                    from: 'SaveCvCandi',
                    localField: 'idTimViec365',
                    foreignField: 'uid',
                    as: 'cv',
                },
            },
            {
                $unwind: { path: '$cv', preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: 'Tv365Profile',
                    localField: 'idTimViec365',
                    foreignField: 'hs_use_id',
                    as: 'profile',
                },
            },
            {
                $unwind: { path: '$profile', preserveNullAndEmptyArrays: true },
            },
            {
                $match: condition_2,
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                },
            },
        ]);

        return functions.success(res, 'Tổng ứng viên', {
            data: {
                count: totalCount.length > 0 ? totalCount[0].count : 0,
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.candi_hide = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;
        const skip = (page - 1) * pageSize;
        let condition = {
            type: { $ne: 1 },
            $or: [{ 'inForPerson.candidate.use_check': 0 }, { 'inForPerson.candidate.cv_title': '' }, { userName: '' }],
            idTimViec365: { $gt: 0 },
        };
        if (req.body.start && !req.body.end) {
            condition.createdAt = { $gte: Number(req.body.start) };
        } else if (!req.body.start && req.body.end) {
            condition.createdAt = { $lte: Number(req.body.end) };
        } else if (req.body.start && req.body.end) {
            condition.createdAt = { $gte: Number(req.body.start), $lte: Number(req.body.end) };
        }

        if (req.body.userName) {
            condition.userName = { $regex: req.body.userName, $options: 'i' };
        }
        if (req.body.phoneTK) {
            condition.phone = req.body.phoneTK;
        }
        if (req.body.email) {
            condition.emailContact = { $regex: req.body.email, $options: 'i' };
        }
        let condition_2 = {};
        if (Number(req.body.cv) == 2) {
            condition_2['$or'] = [{ 'profile.hs_link': { $exists: true } }, { 'cv.name_img': { $exists: true } }];
        }

        let listUser = await Users.aggregate([{
                $match: condition,
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $lookup: {
                    from: 'SaveCvCandi',
                    localField: 'idTimViec365',
                    foreignField: 'uid',
                    as: 'cv',
                },
            },
            {
                $unwind: { path: '$cv', preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: 'Tv365Profile',
                    localField: 'idTimViec365',
                    foreignField: 'hs_use_id',
                    as: 'profile',
                },
            },
            {
                $unwind: { path: '$profile', preserveNullAndEmptyArrays: true },
            },
            {
                $match: condition_2,
            },
            {
                $skip: skip,
            },
            {
                $limit: pageSize,
            },
            {
                $project: {
                    userName: 1,
                    phone: 1,
                    phoneTk: 1,
                    email: 1,
                    avatarUser: 1,
                    emailContact: 1,
                    createdAt: 1,
                    profile_link: '$profile.hs_link',
                    cv_link: '$cv.name_img',
                    cv_time: '$cv.time_edit',
                    profile_time: '$profile.hs_create_time',
                    idTimViec365: 1,
                },
            },
        ]);

        listUser.map((item) => {
            if (item.createdAt && item.avatarUser)
                item.imagecdn = functions.getImageUv(item.createdAt, item.avatarUser);
            if (item.profile_link) item.profile_link = service.getUrlProfile(item.createdAt, item.profile_link);
            if (item.cv_link) item.cv_link = functions.imageCv(item.createdAt, item.cv_link);
            return item;
        });

        return functions.success(res, 'Danh sách', {
            data: {
                listUser,
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.count_candi_hide = async(req, res) => {
    try {
        let condition = {
            type: { $ne: 1 },
            $or: [{ 'inForPerson.candidate.use_check': 0 }, { 'inForPerson.candidate.cv_title': '' }, { userName: '' }],
            idTimViec365: { $gt: 0 },
        };
        if (req.body.start && !req.body.end) {
            condition.createdAt = { $gte: Number(req.body.start) };
        } else if (!req.body.start && req.body.end) {
            condition.createdAt = { $lte: Number(req.body.end) };
        } else if (req.body.start && req.body.end) {
            condition.createdAt = { $gte: Number(req.body.start), $lte: Number(req.body.end) };
        }

        if (req.body.userName) {
            condition.userName = { $regex: req.body.userName, $options: 'i' };
        }
        if (req.body.phoneTK) {
            condition.phone = req.body.phoneTK;
        }
        if (req.body.email) {
            condition.emailContact = { $regex: req.body.email, $options: 'i' };
        }
        let condition_2 = {};
        if (Number(req.body.cv) == 2) {
            condition_2['$or'] = [{ 'profile.hs_link': { $exists: true } }, { 'cv.name_img': { $exists: true } }];
        }

        let totalCount = await Users.aggregate([{
                $match: condition,
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $lookup: {
                    from: 'SaveCvCandi',
                    localField: 'idTimViec365',
                    foreignField: 'uid',
                    as: 'cv',
                },
            },
            {
                $unwind: { path: '$cv', preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: 'Tv365Profile',
                    localField: 'idTimViec365',
                    foreignField: 'hs_use_id',
                    as: 'profile',
                },
            },
            {
                $unwind: { path: '$profile', preserveNullAndEmptyArrays: true },
            },
            {
                $match: condition_2,
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                },
            },
        ]);

        return functions.success(res, 'Danh sách', {
            data: {
                totalCount,
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Ứng viên ứng tuyển sai
exports.candi_apply_wrong = async(req, res) => {
    try {
        const skip = Number(req.body.skip) || 0;
        const limit = Number(req.body.limit) || 30;
        let condition = { nhs_xn_uts: 1 };

        if (req.body.start_date && !req.body.end_date) {
            let start_date = Number(req.body.start_date);
            condition.nhs_time = { $gte: start_date };
        } else if (!req.body.start_date && req.body.end_date) {
            let end_date = Number(req.body.end_date);
            condition.nhs_time = { $lte: end_date };
        } else if (req.body.start_date && req.body.end_date) {
            let start_date = Number(req.body.start_date);
            let end_date = Number(req.body.end_date);
            condition.nhs_time = { $gte: start_date, $lte: end_date };
        }

        if (req.body.new_id) {
            condition.nhs_new_id = Number(req.body.new_id);
        }

        let conditionNews = [{}];

        if (req.body.new_title) {
            conditionNews.push({
                'new.new_title': new RegExp(String(req.body.new_title), 'i'),
            });
        }

        let listUser = await ApplyForJob.aggregate([{
                $sort: { nhs_new_id: -1 },
            },
            {
                $match: condition,
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'nhs_use_id',
                    foreignField: 'idTimViec365',
                    pipeline: [{
                        $match: {
                            idTimViec365: { $gt: 0 },
                            type: 0,
                        },
                    }, ],
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $lookup: {
                    from: 'NewTV365',
                    localField: 'nhs_new_id',
                    foreignField: 'new_id',
                    as: 'new',
                },
            },
            {
                $unwind: '$new',
            },
            {
                $match: {
                    $and: conditionNews,
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
            {
                $project: {
                    'user.password': 0,
                    'user.configChat': 0,
                },
            },
        ]);

        let listUserFinal = [];
        for (let i = 0; i < listUser.length; i++) {
            let obj = listUser[i];
            listUserFinal.push({
                ...obj,
                linkimgcdn: functions.getUrlLogoCompany(obj.user.createdAt, obj.user.avatarUser),
            });
        }

        return functions.success(res, 'Danh sách', {
            data: {
                listUserFinal,
                listUser,
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Ứng viên ứng tuyển sai
exports.count_candi_apply_wrong = async(req, res) => {
    try {
        let condition = { nhs_xn_uts: 1 };

        if (req.body.start_date && !req.body.end_date) {
            let start_date = Number(req.body.start_date);
            condition.nhs_time = { $gte: start_date };
        } else if (!req.body.start_date && req.body.end_date) {
            let end_date = Number(req.body.end_date);
            condition.nhs_time = { $lte: end_date };
        } else if (req.body.start_date && req.body.end_date) {
            let start_date = Number(req.body.start_date);
            let end_date = Number(req.body.end_date);
            condition.nhs_time = { $gte: start_date, $lte: end_date };
        }

        if (req.body.new_id) {
            condition.nhs_new_id = Number(req.body.new_id);
        }

        let conditionNews = [{}];

        if (req.body.new_title) {
            conditionNews.push({
                'new.new_title': new RegExp(String(req.body.new_title), 'i'),
            });
        }

        let totalCount = await ApplyForJob.aggregate([{
                $sort: { nhs_new_id: -1 },
            },
            {
                $match: condition,
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'nhs_use_id',
                    foreignField: 'idTimViec365',
                    pipeline: [{
                        $match: {
                            idTimViec365: { $gt: 0 },
                            type: 0,
                        },
                    }, ],
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $lookup: {
                    from: 'NewTV365',
                    localField: 'nhs_new_id',
                    foreignField: 'new_id',
                    as: 'new',
                },
            },
            {
                $unwind: '$new',
            },
            {
                $match: {
                    $and: conditionNews,
                },
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                },
            },
        ]);

        return functions.success(res, 'Danh sách', {
            data: {
                count: totalCount.length > 0 ? totalCount[0].count : 0,
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Ứng viên đăng ký mới
exports.candi_register = async(req, res) => {
    try {
        const date = new Date();
        const year = date.getFullYear();
        // const time = functions.getTimeNow() - 86400 * 30;
        const time = functions.convertTimestamp(`${year}-01-01 00:00`);
        let condition = {
            fromDevice: { $nin: [4] },
            type: 0,
            idTimViec365: { $gt: 0 },
            createdAt: { $gte: time },
            'inForPerson.candidate.percents': { $gte: 45 },
        };
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;
        const skip = (page - 1) * pageSize;
        //console.log("candi_register", req.body);
        let {
            use_id,
            use_first_name,
            use_phone,
            use_email,
            use_phone_tk,
            cv_title,
            use_email_lh,
            time_start,
            time_end,
            register,
            category,
            city,
            authentic,
            uv_time,
            gender
        } = req.body;
        // uv_time = uv_time ? uv_time : 1;
        if (use_id) {
            condition.idTimViec365 = Number(use_id);
        }
        if (use_first_name) {
            // condition.push({ userName: new RegExp(use_first_name, 'i') });
            condition.userName = new RegExp(use_first_name, 'i');
        }
        if (use_phone) {
            // condition.push({ phone: new RegExp(use_phone, 'i') });
            condition.phone = use_phone;
        }
        if (use_email) {
            // condition.push({ email: new RegExp(use_email, 'i') });
            condition.email = new RegExp(use_email, 'i');
        }
        if (use_phone_tk) {
            // condition.push({ phoneTK: new RegExp(use_phone_tk, 'i') });
            condition.phoneTK = use_phone_tk;
        }
        if (use_email_lh) {
            // condition.push({ emailContact: new RegExp(use_email_lh, 'i') });
            condition.emailContact = new RegExp(use_email_lh, 'i');;
        }
        if (cv_title) {
            // condition.push({ "inForPerson.candidate.cv_title": new RegExp(cv_title, 'i') });
            condition['inForPerson.candidate.cv_title'] = new RegExp(cv_title, 'i');
        }
        // Tìm theo ngày bắt đầu đăng ký
        if (uv_time) {
            // if (Number(uv_time) == 0) {
            //     const MonthsAgo = Math.floor(Number(new Date().getTime() / 1000) - (30 * 3 * 86400));
            //     condition.updatedAt = { "$gte": MonthsAgo };
            // } else
            if (Number(uv_time) == 1) {
                const MonthsAgo = Math.floor(Number(new Date().getTime() / 1000) - 30 * 6 * 86400);
                condition.createdAt = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 2) {
                const MonthsAgo = Math.floor(Number(new Date().getTime() / 1000) - 30 * 12 * 86400);
                condition.createdAt = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 3) {
                const MonthsAgo = Math.floor(Number(new Date().getTime() / 1000) - 30 * 24 * 86400);
                condition.createdAt = { $gte: MonthsAgo };
            }
        }
        if (time_start && !time_end) {
            condition.createdAt = { $gte: Number(time_start) };
        } else if (!time_start && time_end) {
            condition.createdAt = { $lte: Number(time_end) };
        } else if (time_start && time_end) {
            condition.createdAt = { $gte: Number(time_start), $lte: Number(time_end) };
        }
        if (register) condition.fromDevice = Number(register); // Tìm theo nguồn đăng ký
        if (category) condition['inForPerson.candidate.cv_cate_id'] = Number(category);
        if (city) condition['inForPerson.candidate.cv_city_id'] = Number(city);
        if (authentic) condition.authentic = Number(authentic);
        let time_level = new Date().getTime() / 1000 - 48 * 3600;
        if (req.body && req.body.level) {
            if (Number(req.body.level) == 1) {
                condition["inForPerson.candidate.anhsao_badge"] = 1;
                condition["inForPerson.candidate.star3"] = { $ne: 1 };
                condition["ApplyForJob.nhs_time"] = { $lte: time_level };
            };
            if (Number(req.body.level) == 2) {
                condition["inForPerson.candidate.star3"] = { $ne: 1 };
                condition["ApplyForJob.nhs_time"] = { $gte: time_level };
                condition["ApplyForJob.nhs_kq"] = { $nin: [10, 11] };
            };
            if (Number(req.body.level) == 3) {
                let timeago = new Date().getTime() / 1000 - 48 * 3600;
                condition["inForPerson.candidate.star3"] = 1;
                condition["inForPerson.candidate.time_active_star3"] = { $gte: timeago }
            };
        };
        if (Number(gender)) {
            // condition.push({ email: new RegExp(use_email, 'i') });
            condition["inForPerson.account.gender"] = Number(gender);
        }

        // console.log(condition)
        let aggregation = [{
                $lookup: {
                    from: 'ApplyForJob',
                    localField: 'idTimViec365',
                    foreignField: 'nhs_use_id',
                    as: 'ApplyForJob'
                }
            },
            {
                $match: condition,
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: pageSize },
            {
                $project: {
                    use_id: '$idTimViec365',
                    use_logo: '$avatarUser',
                    use_create_time: '$createdAt',
                    use_first_name: '$userName',
                    use_gioi_tinh: '$inForPerson.account.gender' || null,
                    use_phone: '$phone',
                    use_email: '$email',
                    cv_title: '$inForPerson.candidate.cv_title',
                    use_address: '$address',
                    dk: '$fromDevice',
                    use_view: '$inForPerson.candidate.use_view',
                    use_phone_tk: '$phoneTK',
                    user_xac_thuc: '$otp' || null,
                    use_authentic: '$authentic',
                    email_lh: '$emailContact',
                    star3: '$inForPerson.candidate.star3',
                    time_active_star3: '$inForPerson.candidate.time_active_star3'
                },
            },
        ]
        let list = await Users.aggregate(aggregation);

        // Tv365PointCompany
        let listUserId = [];
        for (let i = 0; i < list.length; i++) {
            listUserId.push(list[i].use_id);
        };
        let listUsedPoint = await Tv365PointUsed.find({ use_id: { $in: listUserId } }).lean();
        let list_temp = [];
        for (let i = 0; i < list.length; i++) {
            let obj = list[i];
            let array = listUsedPoint.filter((e) => e.use_id == obj.use_id);
            list_temp.push({...obj, use_view: array.length })
        };
        list = list_temp;
        let totalCount = await Users.aggregate([{
                $match: condition,
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                },
            },
        ]);
        let timeago = new Date().getTime() / 1000 - 48 * 3600;
        list.map((item) => {
            item.time_active_star3 = item.time_active_star3 ? item.time_active_star3 : 0;
            if (item.time_active_star3 < timeago) {
                item.star3 = 0;
            }
            if (item.use_logo && item.use_create_time) {
                item.use_logo = functions.getImageUv(item.use_create_time, item.use_logo);
            }
            return item;
        });

        return functions.success(res, 'Danh sách', {
            data: {
                list,
                count: totalCount.length > 0 ? totalCount[0].count : 0,
                condition,
                aggregation
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.candi_register_2 = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;
        let {
            use_id,
            use_first_name,
            use_phone,
            use_email,
            use_phone_tk,
            cv_title,
            use_email_lh,
            time_start,
            time_end,
            register,
            category,
            city,
            authentic,
            uv_time,
        } = req.body;
        let form = {};
        if (page) form.page = page;
        if (pageSize) form.pageSize = pageSize;
        if (use_id) form.use_id = Number(use_id);
        if (use_first_name) form.use_first_name = use_first_name;
        if (use_phone) form.use_phone = use_phone;
        if (use_email) form.use_email = use_email;
        if (use_phone_tk) form.use_phone_tk = use_phone_tk;
        if (use_email_lh) form.push.use_email_lh = use_email_lh;
        if (cv_title) form.cv_title = cv_title;
        if (uv_time) form.uv_time = uv_time;
        if (time_start) form.time_start = time_start;
        if (time_end) form.time_end = time_end;
        if (register) form.register = Number(register); // Tìm theo nguồn đăng ký
        if (category) form.cv_cate_id = category;
        if (city) form.cv_city_id = city;
        if (authentic) form.authentic = Number(authentic);
        form.uv_time = '0';
        // console.log("register form", form);
        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/candi_register_2',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        let array = response.data.data.listuser;
        let list = [];

        list = await Users.aggregate([{
                $sort: { createdAt: -1 },
            },
            {
                $match: {
                    idTimViec365: { $in: array },
                    type: { $ne: 1 },
                },
            },
            {
                $project: {
                    use_id: '$idTimViec365',
                    use_logo: '$avatarUser',
                    use_create_time: '$createdAt',
                    use_first_name: '$userName',
                    use_gioi_tinh: '$inForPerson.account.gender' || null,
                    use_phone: '$phone',
                    use_email: '$email',
                    cv_title: '$inForPerson.candidate.cv_title',
                    use_address: '$address',
                    dk: '$fromDevice',
                    use_view: '$inForPerson.candidate.use_view',
                    use_phone_tk: '$phoneTK',
                    user_xac_thuc: '$otp' || null,
                    use_authentic: '$authentic',
                    email_lh: '$emailContact',
                },
            },
        ]);

        list.map((item) => {
            if (item.use_logo && item.use_create_time) {
                item.use_logo = functions.getImageUv(item.use_create_time, item.use_logo);
            }
            return item;
        });

        return functions.success(res, 'Danh sách', {
            data: {
                list,
                count: Number(response.data.data.count),
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};
//đếm
exports.count_candi_register = async(req, res) => {
    try {
        let condition = {
            fromDevice: { $nin: [4, 7] },
            type: { $ne: 1 },
            idTimViec365: { $gt: 0 },
        };
        let {
            use_id,
            use_first_name,
            use_phone,
            use_email,
            use_phone_tk,
            cv_title,
            use_email_lh,
            time_start,
            time_end,
            register,
            category,
            city,
            authentic,
            uv_time,
        } = req.body;
        if (use_id) {
            condition.idTimViec365 = Number(use_id);
        }
        if (use_first_name) {
            // condition.push({ userName: new RegExp(use_first_name, 'i') });
            condition.userName = new RegExp(use_first_name, 'i');
        }
        if (use_phone) {
            // condition.push({ phone: new RegExp(use_phone, 'i') });
            condition.phone = use_phone;
        }
        if (use_email) {
            // condition.push({ email: new RegExp(use_email, 'i') });
            condition.email = { $regex: use_email, $options: 'i' };
        }
        if (use_phone_tk) {
            // condition.push({ phoneTK: new RegExp(use_phone_tk, 'i') });
            condition.phoneTK = use_phone_tk;
        }
        if (use_email_lh) {
            // condition.push({ emailContact: new RegExp(use_email_lh, 'i') });
            condition.push.emailContact = { $regex: use_email_lh, $options: 'i' };
        }
        if (cv_title) {
            // condition.push({ "inForPerson.candidate.cv_title": new RegExp(cv_title, 'i') });
            condition['inForPerson.candidate.cv_title'] = { $regex: cv_title, $options: 'i' };
        }
        // Tìm theo ngày bắt đầu đăng ký

        if (uv_time) {
            if (Number(uv_time) == 0) {
                const MonthsAgo = Math.floor(Number(new Date().getTime() / 1000) - 30 * 3 * 86400);
                condition.updatedAt = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 1) {
                const MonthsAgo = Math.floor(Number(new Date().getTime() / 1000) - 30 * 6 * 86400);
                condition.updatedAt = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 2) {
                const MonthsAgo = Math.floor(Number(new Date().getTime() / 1000) - 30 * 12 * 86400);
                condition.updatedAt = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 3) {
                const MonthsAgo = Math.floor(Number(new Date().getTime() / 1000) - 30 * 24 * 86400);
                condition.updatedAt = { $gte: MonthsAgo };
            }
        }
        if (time_start && !time_end) {
            condition.createdAt = { $gte: Number(time_start) };
        } else if (!time_start && time_end) {
            condition.createdAt = { $lte: Number(time_end) };
        } else if (time_start && time_end) {
            condition.createdAt = { $gte: Number(time_start), $lte: Number(time_end) };
        }
        if (register) condition.fromDevice = Number(register); // Tìm theo nguồn đăng ký
        if (category) condition['inForPerson.candidate.cv_cate_id'] = { $all: [Number(category)] };
        if (city) condition['inForPerson.candidate.cv_city_id'] = { $all: [Number(city)] };
        if (authentic) condition.authentic = Number(authentic);
        if (req.body && req.body.level) {
            if (Number(req.body.level) == 1) {
                condition["inForPerson.candidate.anhsao_badge"] = 1;
                condition["inForPerson.candidate.star3"] = { $ne: 1 };
                condition["ApplyForJob.nhs_time"] = { $lte: time_level };
            };
            if (Number(req.body.level) == 2) {
                condition["inForPerson.candidate.star3"] = { $ne: 1 };
                condition["ApplyForJob.nhs_time"] = { $gte: time_level };
                condition["ApplyForJob.nhs_kq"] = { $nin: [10, 11] };
            };
            if (Number(req.body.level) == 3) {
                let timeago = new Date().getDate() / 1000 - 48 * 3600;
                condition["inForPerson.candidate.star3"] = 1;
                condition["inForPerson.candidate.time_active_star3"] = { $gte: timeago }
            };
        };
        const totalCount = await Users.aggregate([{
                $match: condition,
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                },
            },
        ]);
        return functions.success(res, 'Tổng ứng viên đăng ký mới', {
            data: {
                count: totalCount.length > 0 ? totalCount[0].count : 0,
                condition,
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Ứng viên cập nhật hồ  sơ
exports.candi_update = async(req, res) => {
    try {
        const time = functions.getTimeNow() - 86400 * 30;
        let condition = {
            fromDevice: { $nin: [4, 7] },
            type: 0,
            idTimViec365: { $gt: 0 },
            updatedAt: { $gte: time },
            $and: [{
                    phone: { $ne: '' },
                },
                {
                    phone: { $ne: null },
                },
            ],
            // user_id: {  }
        };
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;

        let { use_first_name, use_phone, use_email, use_phone_tk, time_start, time_end } = req.body;
        if (use_first_name) condition.userName = { $regex: new RegExp(use_first_name, 'i') }; // Tìm theo tên
        if (use_phone) condition.phone = use_phone; // Tìm theo sđt
        if (use_email) condition.email = { $regex: new RegExp(use_email, 'i') }; // Tìm theo email đăng nhập
        if (use_phone_tk) condition.phoneTK = use_phone_tk; // Tìm theo sđt đăng nhập
        // Tìm theo ngày bắt đầu đăng ký
        if (time_start && !time_end) {
            condition.updatedAt = { $gte: Number(time_start) };
        } else if (!time_start && time_end) {
            condition.updatedAt = { $lte: Number(time_end) };
        } else if (time_start && time_end) {
            condition.updatedAt = { $gte: Number(time_start), $lte: Number(time_end) };
        }

        // let form = {
        //     page: page ? page : "1",
        //     pageSize: pageSize ? pageSize : "30",
        //     use_first_name: use_first_name ? use_first_name : "0",
        //     use_phone: use_phone ? use_phone : "0",
        //     use_email: use_email ? use_email : "0",
        //     use_phone_tk: use_phone_tk ? use_phone_tk : "0",

        //     time_start: time_start ? time_start : "0",
        //     time_end: time_end ? time_end : "0",
        // }

        // let response = await axios({
        //     method: "post",
        //     url: "http://43.239.223.57:9002/candi_update",
        //     data: form,
        //     headers: { "Content-Type": "multipart/form-data" }
        // });
        // let array = response.data.data.listuser;

        const list = await Users.aggregate([{
                $match: condition,
            },
            { $sort: { updatedAt: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $project: {
                    use_id: '$idTimViec365',
                    use_logo: '$avatarUser',
                    use_create_time: '$createdAt',
                    use_update_time: '$updatedAt',
                    use_first_name: '$userName',
                    use_gioi_tinh: '$inForPerson.account.gender' || null,
                    use_phone: '$phone',
                    use_email: '$email',
                    cv_title: '$inForPerson.candidate.cv_title',
                    use_address: '$address',
                    dk: '$fromDevice',
                    use_view: '$inForPerson.candidate.use_view',
                    use_phone_tk: '$phoneTK',
                    user_xac_thuc: '$otp' || null,
                    use_authentic: '$authentic',
                },
            },
        ]);

        list.map((item) => {
            if (item.use_logo && item.use_create_time) {
                item.use_logo = functions.getImageUv(item.use_create_time, item.use_logo);
            }
            return item;
        });

        const count = await Users.countDocuments(condition);
        return functions.success(res, 'Danh sách', {
            data: { list, count },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.candi_update_2 = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;

        let { use_first_name, use_phone, use_email, use_phone_tk, time_start, time_end } = req.body;
        let form = {};
        form.page = page;
        form.pageSize = pageSize;
        if (use_first_name) form.use_first_name = use_first_name; // Tìm theo tên
        if (use_phone) form.use_phone = use_phone; // Tìm theo sđt
        if (use_email) form.use_email = use_email; // Tìm theo email đăng nhập
        if (use_phone_tk) form.use_phone_tk = use_phone_tk; // Tìm theo sđt đăng nhập
        if (time_start) form.time_start = time_start;
        if (time_end) form.time_end = time_end;

        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/candi_update_2',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        let array = response.data.data.listuser;

        const list = await Users.aggregate([
            { $sort: { updatedAt: -1 } },
            {
                $match: {
                    idTimViec365: { $in: array },
                    type: { $ne: 1 },
                },
            },
            {
                $project: {
                    use_id: '$idTimViec365',
                    use_logo: '$avatarUser',
                    use_create_time: '$createdAt',
                    use_update_time: '$updatedAt',
                    use_first_name: '$userName',
                    use_gioi_tinh: '$inForPerson.account.gender' || null,
                    use_phone: '$phone',
                    use_email: '$email',
                    cv_title: '$inForPerson.candidate.cv_title',
                    use_address: '$address',
                    dk: '$fromDevice',
                    use_view: '$inForPerson.candidate.use_view',
                    use_phone_tk: '$phoneTK',
                    user_xac_thuc: '$otp' || null,
                    use_authentic: '$authentic',
                },
            },
        ]);

        list.map((item) => {
            if (item.use_logo && item.use_create_time) {
                item.use_logo = functions.getImageUv(item.use_create_time, item.use_logo);
            }
            return item;
        });
        return functions.success(res, 'Danh sách', {
            data: {
                list,
                count: Number(response.data.data.count),
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.count_candi_update_2 = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;

        let { use_first_name, use_phone, use_email, use_phone_tk, time_start, time_end } = req.body;
        let form = {};
        form.page = page;
        form.pageSize = pageSize;
        if (use_first_name) form.use_first_name = use_first_name; // Tìm theo tên
        if (use_phone) form.use_phone = use_phone; // Tìm theo sđt
        if (use_email) form.use_email = use_email; // Tìm theo email đăng nhập
        if (use_phone_tk) form.use_phone_tk = use_phone_tk; // Tìm theo sđt đăng nhập
        if (time_start) form.time_start = time_start;
        if (time_end) form.time_end = time_end;

        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/candi_update_2',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return functions.success(res, 'Tổng số ứng viên cập nhật hồ sơ', {
            data: {
                count: Number(response.data.data.count),
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.count_candi_update = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;
        let condition = {
            fromDevice: { $nin: [4, 7] },
            type: { $ne: 1 },
            idTimViec365: { $gt: 0 },
            updatedAt: { $gt: 0 },
            $and: [{
                    phone: { $ne: '' },
                },
                {
                    phone: { $ne: null },
                },
            ],
        };

        let { use_first_name, use_phone, use_email, use_phone_tk, time_start, time_end } = req.body;
        if (use_first_name) condition.userName = { $regex: new RegExp(use_first_name, 'i') }; // Tìm theo tên
        if (use_phone) condition.phone = use_phone; // Tìm theo sđt
        if (use_email) condition.email = { $regex: new RegExp(use_email, 'i') }; // Tìm theo email đăng nhập
        if (use_phone_tk) condition.phoneTK = use_phone_tk; // Tìm theo sđt đăng nhập
        // Tìm theo ngày bắt đầu đăng ký
        if (time_start && !time_end) {
            condition.updatedAt = { $gte: Number(time_start) };
        } else if (!time_start && time_end) {
            condition.updatedAt = { $lte: Number(time_end) };
        } else if (time_start && time_end) {
            condition.updatedAt = { $gte: Number(time_start), $lte: Number(time_end) };
        }

        let form = {
            page: page ? page : '1',
            pageSize: pageSize ? pageSize : '30',
            use_first_name: use_first_name ? use_first_name : '0',
            use_phone: use_phone ? use_phone : '0',
            use_email: use_email ? use_email : '0',
            use_phone_tk: use_phone_tk ? use_phone_tk : '0',

            time_start: time_start ? time_start : '0',
            time_end: time_end ? time_end : '0',
        };

        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/candi_update',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        // const count = await Users.countDocuments(condition);
        return functions.success(res, 'Tổng số ứng viên cập nhật hồ sơ', {
            data: {
                count: Number(response.data.data.count),
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Ứng viên cập nhật hồ  sơ
exports.candi_login = async(req, res) => {
    try {
        let now = new Date().getTime() / 1000 - 24 * 3600;

        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;

        let condition = [{ idTimViec365: { $gt: 0 } }, { type: { $ne: 1 } }, { updatedAt: { $gte: now } }];
        let { userName, phoneTK, email, phone, cv_title, cv_cate_id, cv_city_id, idTimViec365 } = req.body;
        if (req.body.userName) {
            new RegExp(String(req.body.userName), 'i');
            condition.push({
                userName: new RegExp(String(req.body.userName), 'i'),
            });
        }
        if (req.body.phoneTK) {
            condition.push({
                phoneTK: req.body.phoneTK,
            });
        }
        if (req.body.email) {
            condition.push({
                email: new RegExp(String(req.body.email), 'i'),
            });
        }
        if (req.body.phone) {
            condition.push({
                phone: req.body.phone,
            });
        }

        if (req.body.cv_title) {
            condition.push({
                'inForPerson.candidate.cv_title': new RegExp(String(req.body.cv_title), 'i'),
            });
        }

        if (req.body.cv_cate_id) {
            condition.push({
                'inForPerson.candidate.cv_cate_id': Number(req.body.cv_cate_id),
            });
        }
        if (req.body.cv_city_id) {
            condition.push({
                'inForPerson.candidate.cv_city_id': Number(req.body.cv_city_id),
            });
        }
        if (req.body.idTimViec365) {
            condition.push({
                idTimViec365: Number(req.body.idTimViec365),
            });
        }

        let form = {
            page: page,
            pageSize: pageSize,
            userName: userName ? userName : '0',
            phoneTK: phoneTK ? phoneTK : '-1',
            email: email ? email : '0',
            phone: phone ? phone : '-1',
            cv_title: cv_title ? cv_title : '0',
            cv_cate_id: cv_cate_id ? cv_cate_id : '-1',
            cv_city_id: cv_city_id ? cv_city_id : '-1',
            idTimViec365: idTimViec365 ? idTimViec365 : '0',
        };
        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/candi_login',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        let array = response.data.data.listuser;
        const list = await Users.aggregate([
            { $sort: { updatedAt: -1 } },
            {
                $match: {
                    idTimViec365: { $in: array },
                },
            },
            // { $skip: (page - 1) * pageSize },
            // { $limit: pageSize },
            {
                $project: {
                    password: 0,
                    configChat: 0,
                    inforRN365: 0,
                    'inForPerson.employee': 0,
                },
            },
        ]);
        // let list = await Users.find({ $and: condition }, { password: 0, configChat: 0, inforRN365: 0, "inForPerson.employee": 0 }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()

        list.map((item) => {
            if (item.avatarUser && item.createdAt) {
                item.use_logo = functions.getImageUv(item.createdAt, item.avatarUser);
            }
            return item;
        });

        return functions.success(res, 'Danh sách', {
            data: {
                list,
                count: Number(response.data.data.count),
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.candi_login_2 = async(req, res) => {
    try {
        let now = new Date().getTime() / 1000 - 24 * 3600;

        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;
        let form = {
            page: page,
            pageSize: pageSize,
        };
        let { userName, phoneTK, email, phone, cv_title, cv_cate_id, cv_city_id, idTimViec365 } = req.body;
        if (userName) form.userName = userName;
        if (phoneTK) form.phoneTK = phoneTK;
        if (email) form.email = email;
        if (phone) form.phone = phone;
        if (cv_title) form.cv_title = cv_title;
        if (cv_cate_id) form.cv_cate_id = cv_cate_id;
        if (cv_city_id) form.cv_city_id = cv_city_id;
        if (idTimViec365) form.idTimViec365 = idTimViec365;
        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/candi_login_2',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        let array = response.data.data.listuser;
        const list = await Users.aggregate([
            { $sort: { updatedAt: -1 } },
            {
                $match: {
                    idTimViec365: { $in: array },
                    type: { $ne: 1 },
                },
            },
            {
                $project: {
                    password: 0,
                    configChat: 0,
                    inforRN365: 0,
                    'inForPerson.employee': 0,
                },
            },
        ]);

        list.map((item) => {
            if (item.avatarUser && item.createdAt) {
                item.use_logo = functions.getImageUv(item.createdAt, item.avatarUser);
            }
            return item;
        });

        return functions.success(res, 'Danh sách', {
            data: {
                list,
                count: Number(response.data.data.count),
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Ứng viên tải cv từ máy tính cá nhân
exports.checkProfile = async(req, res) => {
    try {
        const data = req.body;
        const page = parseInt(req.body.page) || 1,
            pageSize = parseInt(req.body.pageSize) || 30;
        const use_check = Number(req.body.use_check) || 0;
        const { use_first_name, use_phone, use_email, startdate, enddate } = data;

        let condition = {
            type: 0,
            'inForPerson.candidate.use_check': Number(use_check),
            idTimViec365: { $gte: 1 },
        };

        if (use_first_name) {
            condition.userName = { $regex: new RegExp(use_first_name, 'i') };
        }
        if (use_phone) {
            condition.phone = use_phone;
        }
        if (use_email) {
            condition.email = { $regex: new RegExp(use_email, 'i') };
        }

        if (startdate && !enddate) {
            fromDate = parseInt(startdate);
            condition.createdAt = { $gte: fromDate };
        } else if (!startdate && enddate) {
            toDate = parseInt(enddate);
            condition.createdAt = { $lte: toDate };
        } else if (startdate && enddate) {
            fromDate = parseInt(startdate);
            toDate = parseInt(enddate);
            condition.createdAt = {
                $gte: fromDate,
                $lte: toDate,
            };
        }

        // let form = {
        //     page: page,
        //     pageSize: pageSize,
        //     use_first_name: use_first_name ? use_first_name : "0",
        //     use_phone: use_phone ? use_phone : "-1",
        //     use_email: use_email ? use_email : "0",
        //     startdate: startdate ? startdate : "0",
        //     enddate: enddate ? enddate : "0",
        //     use_check: use_check
        // }
        // let response = await axios({
        //     method: "post",
        //     url: "http://43.239.223.57:9002/checkProfile",
        //     data: form,
        //     headers: { "Content-Type": "multipart/form-data" }
        // });
        // let array = response.data.data.listuser;

        let list = await Users.aggregate([{
                $match: condition,
            },
            {
                $sort: { createdAt: -1 },
            },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $lookup: {
                    from: 'Tv365Profile',
                    localField: 'idTimViec365',
                    foreignField: 'hs_use_id',
                    pipeline: [{
                        $match: {
                            hs_link: { $ne: '' },
                            hs_link: { $ne: null },
                        },
                    }, ],
                    as: 'profile',
                },
            },
            {
                $unwind: '$profile',
            },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $project: {
                    use_id: '$idTimViec365',
                    use_logo: '$avatarUser',
                    use_create_time: '$createdAt',
                    use_first_name: '$userName',
                    use_phone: '$phone',
                    use_email: '$email',
                    use_gioi_tinh: '$inForPerson.account.gender',
                    hs_create_time: '$profile.hs_create_time',
                    hs_link: '$profile.hs_link',
                },
            },
        ]);

        let total = await Users.aggregate([{
                $match: condition,
            },
            {
                $lookup: {
                    from: 'Tv365Profile',
                    localField: 'idTimViec365',
                    foreignField: 'hs_use_id',
                    pipeline: [{
                        $match: {
                            hs_link: { $ne: '' },
                            hs_link: { $ne: null },
                        },
                    }, ],
                    as: 'profile',
                },
            },
            {
                $unwind: '$profile',
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                },
            },
        ]);

        list.map((item) => {
            if (item.use_logo && item.use_create_time) {
                item.avatarUser = functions.getImageUv(item.use_create_time, item.use_logo);
                item.use_logo = functions.getImageUv(item.use_create_time, item.use_logo);
            }
            return item;
        });

        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            element.hs_link = service.getUrlProfile(element.hs_create_time, element.hs_link);
        }

        return functions.success(res, 'Danh sách ứng viên tải CV từ máy tính cá nhân', {
            data: {
                list,
                count: total.length > 0 ? total[0].count : 0,
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.countCheckProfile = async(req, res) => {
    try {
        const data = req.body;
        const use_check = Number(req.body.use_check) || 0;
        const { use_first_name, use_phone, use_email, startdate, enddate } = data;

        let condition_1 = {
            type: { $ne: 1 },
            // "inForPerson.candidate.use_check": Number(use_check),
            idTimViec365: { $gt: 0 },
        };

        let condition_2 = {
            $and: [{ 'profile.hs_link': { $ne: '' } }, { 'profile.hs_link': { $ne: null } }],
        };

        if (use_first_name) {
            condition_1.userName = { $regex: new RegExp(use_first_name, 'i') };
        }
        if (use_phone) {
            condition_1.phone = use_phone;
        }
        if (use_email) {
            condition_1.email = { $regex: new RegExp(use_email, 'i') };
        }

        if (startdate && !enddate) {
            fromDate = parseInt(startdate);
            condition_1.createdAt = { $gte: fromDate };
        } else if (!startdate && enddate) {
            toDate = parseInt(enddate);
            condition_1.createdAt = { $lte: toDate };
        } else if (startdate && enddate) {
            fromDate = parseInt(startdate);
            toDate = parseInt(enddate);
            condition_1.createdAt = {
                $gte: fromDate,
                $lte: toDate,
            };
        }

        let totalCount = [{ count: 0 }];
        // if (use_check == 0) {
        condition_1['inForPerson.candidate.use_check'] = Number(use_check);
        totalCount = await Users.aggregate([{
                $match: condition_1,
            },
            {
                $lookup: {
                    from: 'Tv365Profile',
                    localField: 'idTimViec365',
                    foreignField: 'hs_use_id',
                    pipeline: [{
                        $match: {
                            hs_link: { $ne: '' },
                            hs_link: { $ne: null },
                        },
                    }, ],
                    as: 'profile',
                },
            },
            {
                $unwind: '$profile',
            },
            // {
            //     $match: condition_2
            // },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                },
            },
        ]);
        // }

        // if (use_check == 1) {
        //     condition_1["inForPerson.candidate.use_check"] = Number(use_check);
        //     totalCount = await Profile.aggregate([{
        //             $sort: {
        //                 hs_create_time: -1
        //             }
        //         },
        //         {
        //             $match: {
        //                 hs_link: { $ne: "" },
        //                 hs_link: { $ne: null }
        //             }
        //         },
        //         {
        //             $lookup: {
        //                 from: "Users",
        //                 localField: "hs_use_id",
        //                 foreignField: "idTimViec365",
        //                 as: "user",
        //                 pipeline: [{
        //                     $match: condition_1,
        //                 }]
        //             }
        //         },
        //         { $unwind: "$user" },
        //         {
        //             $group: {
        //                 _id: null,
        //                 count: { $sum: 1 }
        //             }
        //         }
        //     ])
        // }

        return functions.success(res, 'Danh sách ứng viên tải CV từ máy tính cá nhân', {
            count: totalCount.length > 0 ? totalCount[0].count : 0,
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Active hồ sơ ứng viên tải lên
exports.activeProfile = async(req, res) => {
    try {
        let { use_id } = req.body;

        if (use_id) {
            const user = await Users.findOne({ idTimViec365: use_id, type: 0 });
            if (user) {
                await Users.updateOne({ idTimViec365: use_id, type: 0 }, {
                    $set: { 'inForPerson.candidate.use_check': 1 },
                });
                return functions.success(res, 'Duyệt hồ sơ thành công');
            }
            return functions.setError(res, 'Ứng viên không tồn tại');
        }
        return functions.setError(res, 'Thông tin truyền lên chưa đầy đủ');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Xóa ứng viên
exports.delete = async(req, res) => {
    try {
        const { use_id } = req.body;
        if (use_id) {
            const user = await Users.findOne({ idTimViec365: use_id, type: 0 });
            if (user) {
                // Xóa hồ sơ
                await Users.deleteOne({ _id: user._id, type: { $ne: 1 } });
                const profile = await Profile.findOne({ hs_use_id: user.idTimViec365 });
                let item = new HistoryDeleteUser({
                    user_id: user.idTimViec365,
                    use_email: user.email,
                    use_phone_tk: user.phoneTK,
                    use_first_name: user.userName,
                    use_pass: user.password,
                    use_type: user.inForPerson.candidate.use_type,
                    use_create_time: user.createdAt,
                    use_update_time: user.updatedAt,
                    user_reset_time: user.inForPerson.candidate.user_reset_time,
                    use_logo: user.avatarUser,
                    use_phone: user.phone,
                    use_gioi_tinh: user.inForPerson.account.gender,
                    use_birth_day: user.inForPerson.account.birthday,
                    use_city: user.city,
                    use_quanhuyen: user.district,
                    use_address: user.address,
                    use_hon_nhan: user.inForPerson.account.married,
                    use_view: user.inForPerson.candidate.use_view,
                    use_noti: user.inForPerson.candidate.use_noti,
                    use_show: user.inForPerson.candidate.use_show,
                    use_show_cv: user.inForPerson.candidate.use_show_cv,
                    use_active: user.inForPerson.candidate.use_active,
                    use_authentic: user.inForPerson.candidate.use_authentic,
                    use_lat: user.latitude,
                    use_long: user.longtitude,
                    use_td: user.inForPerson.candidate.use_td,
                    usc_mail_app: user.inForPerson.candidate.usc_mail_app,
                    use_check: user.inForPerson.candidate.use_check,
                    user_xac_thuc: user.authentic,
                    dk: user.fromDevice,
                    chat365_id: user._id,
                    chat365_secret: user.chat365_secret,
                    cv_title: user.inForPerson.candidate.cv_title,
                    cv_hocvan: user.inForPerson.candidate.cv_hocvan,
                    cv_exp: user.inForPerson.account.experience,
                    cv_muctieu: user.inForPerson.candidate.cv_muctieu,
                    cv_cate_id: user.inForPerson.candidate.cv_cate_id.toString(),
                    cv_city_id: user.inForPerson.candidate.cv_city_id.toString(),
                    cv_capbac_id: user.inForPerson.candidate.cv_capbac_id,
                    cv_money_id: user.inForPerson.candidate.cv_money_id,
                    cv_loaihinh_id: user.inForPerson.candidate.cv_loaihinh_id,
                    cv_time: user.inForPerson.candidate.cv_time,
                    cv_time_dl: user.inForPerson.candidate.cv_time_dl,
                    cv_kynang: user.inForPerson.candidate.cv_kynang,
                    cv_tc_name: user.inForPerson.candidate.cv_tc_name,
                    cv_tc_cv: user.inForPerson.candidate.cv_tc_cv,
                    cv_tc_dc: user.inForPerson.candidate.cv_tc_dc,
                    cv_tc_phone: user.inForPerson.candidate.cv_tc_phone,
                    cv_tc_email: user.inForPerson.candidate.cv_tc_email,
                    cv_tc_company: user.inForPerson.candidate.cv_tc_company,
                    cv_video: user.inForPerson.candidate.cv_video,
                    cv_video_type: user.inForPerson.candidate.cv_video_type,
                    cv_video_active: user.inForPerson.candidate.cv_video_active,
                    delete_time: functions.getTimeNow(),
                });
                if (profile) {
                    item.hs_create_time = profile.hs_create_time;
                    item.hs_link = profile.hs_link;
                    item.hs_name = profile.hs_name;
                }
                await item.save();
                return functions.success(res, 'Xóa ứng viên thành công');
            }
            return functions.setError(res, 'Ứng viên không tồn tại');
        }
        return functions.setError(res, 'Thông tin truyền lên chưa đầy đủ');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Ứng viên có điểm hồ sơ < 45
exports.percents = async(req, res) => {
    try {
        const time = functions.getTimeNow() - 86400 * 30;
        const page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 30;
        let condition = {
            'inForPerson.candidate.percents': { $lt: 45 },
            idTimViec365: { $gt: 0 },
            type: 0,
            createdAt: { $gte: time },
        };

        let { idTimViec365, cv_city_id, cv_cate_id, email, phoneTK, userName, cv_title, start, end } = req.body;

        if (req.body.cv_city_id) {
            condition['inForPerson.candidate.cv_city_id'] = Number(req.body.cv_city_id);
        }
        if (req.body.cv_cate_id) {
            condition['inForPerson.candidate.cv_cate_id'] = Number(req.body.cv_cate_id);
        }
        if (req.body.idTimViec365) {
            condition.idTimViec365 = Number(req.body.idTimViec365);
        }
        if (req.body.email) {
            condition.email = { $regex: new RegExp(req.body.email, 'i') };
        }
        if (req.body.phoneTK) {
            condition.phone = req.body.phoneTK;
        }
        if (req.body.userName) {
            condition.userName = { $regex: new RegExp(req.body.userName, 'i') };
        }
        if (req.body.cv_title) {
            condition['inForPerson.candidate.cv_title'] = { $regex: new RegExp(req.body.cv_title, 'i') };
        }
        if (req.body.start && !req.body.end) {
            condition.createdAt = { $gte: Number(req.body.start) };
        }
        if (req.body.end && !req.body.start) {
            condition.createdAt = { $lte: Number(req.body.end) };
        }

        if (req.body.start && req.body.end) {
            condition.createdAt = { $gte: Number(req.body.start), $lte: Number(req.body.end) };
        }

        // let form = {
        //     page: page,
        //     pageSize: pageSize,
        //     idTimViec365: idTimViec365 ? idTimViec365 : "0",
        //     email: email ? email : "0",
        //     phoneTK: phoneTK ? phoneTK : "-1",
        //     userName: userName ? userName : "0",
        //     start: start ? start : "0",
        //     end: end ? end : "0",
        //     cv_cate_id: cv_cate_id ? cv_cate_id : "-1",
        //     cv_city_id: cv_city_id ? cv_city_id : "-1",
        //     cv_title: cv_title ? cv_title : "0",
        // }
        // let response = await axios({
        //     method: "post",
        //     url: "http://43.239.223.57:9002/list_percents",
        //     data: form,
        //     headers: { "Content-Type": "multipart/form-data" }
        // });
        // let array = response.data.data.listuser;

        const list = await Users.aggregate([{
                $match: condition,
            },
            { $sort: { createdAt: -1, idTimViec365: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $project: {
                    use_id: '$idTimViec365',
                    use_logo: '$avatarUser',
                    use_create_time: '$createdAt',
                    use_first_name: '$userName',
                    use_gioi_tinh: '$inForPerson.account.gender' || null,
                    use_phone: '$phone',
                    use_email: '$email',
                    cv_title: '$inForPerson.candidate.cv_title',
                    use_address: '$address',
                    dk: '$fromDevice',
                    use_view: '$inForPerson.candidate.use_view',
                    use_show: '$inForPerson.candidate.use_show',
                    use_phone_tk: '$phoneTK',
                    user_xac_thuc: '$otp' || null,
                    use_authentic: '$authentic',
                    percents: '$inForPerson.candidate.percents',
                    use_update_time: '$updatedAt',
                },
            },
        ]);

        const count = await Users.countDocuments(condition);

        list.map((item) => {
            if (item.use_logo && item.use_create_time) {
                item.use_logo = functions.getImageUv(item.use_create_time, item.use_logo);
            }
            return item;
        });

        return functions.success(res, 'Danh sách ứng viên', {
            data: { list, count },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};
exports.percents_2 = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 30;

        let {
            idTimViec365,
            cv_city_id,
            cv_cate_id,
            email,
            phoneTK,
            userName,
            cv_title,
            start,
            end,
            use_check,
            use_show,
        } = req.body;
        let form = {
            page: page,
            pageSize: pageSize,
        };
        if (cv_city_id) form.cv_city_id = cv_city_id;
        if (cv_cate_id) form.cv_cate_id = cv_cate_id;
        if (idTimViec365) form.idTimViec365 = idTimViec365;
        if (email) form.email = email;
        if (phoneTK) form.phoneTK = phoneTK;
        if (userName) form.userName = userName;
        if (cv_title) form.cv_title = cv_title;
        if (start) form.start = start;
        if (end) form.end = end;
        if (use_check) form.use_check = use_check;
        if (use_show) form.use_show = use_show;

        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/list_percents_2',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        let array = response.data.data.listuser;

        const list = await Users.aggregate([{
                $sort: { createdAt: -1 },
            },
            {
                $match: {
                    idTimViec365: { $in: array },
                    type: { $ne: 1 },
                },
            },
            {
                $project: {
                    use_id: '$idTimViec365',
                    use_logo: '$avatarUser',
                    use_create_time: '$createdAt',
                    use_first_name: '$userName',
                    use_gioi_tinh: '$inForPerson.account.gender' || null,
                    use_phone: '$phone',
                    use_email: '$email',
                    cv_title: '$inForPerson.candidate.cv_title',
                    use_address: '$address',
                    dk: '$fromDevice',
                    use_view: '$inForPerson.candidate.use_view',
                    use_show: '$inForPerson.candidate.use_show',
                    use_phone_tk: '$phoneTK',
                    user_xac_thuc: '$otp' || null,
                    use_authentic: '$authentic',
                    percents: '$inForPerson.candidate.percents',
                    use_update_time: '$updatedAt',
                },
            },
        ]);

        list.map((item) => {
            if (item.use_logo && item.use_create_time) {
                item.use_logo = functions.getImageUv(item.use_create_time, item.use_logo);
            }
            return item;
        });

        return functions.success(res, 'Danh sách ứng viên', {
            data: {
                list,
                count: Number(response.data.data.count),
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.countPercents = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 30;
        let {
            idTimViec365,
            cv_city_id,
            cv_cate_id,
            email,
            phoneTK,
            userName,
            cv_title,
            start,
            end,
            use_check,
            use_show,
        } = req.body;
        let condition = [
            { 'inForPerson.candidate.percents': { $lt: 45 } },
            { idTimViec365: { $gt: 0 } },
            { type: { $ne: 1 } },
        ];

        if (req.body.cv_city_id) {
            condition.push({
                'inForPerson.candidate.cv_city_id': Number(req.body.cv_city_id),
            });
        }
        if (req.body.cv_cate_id) {
            condition.push({
                'inForPerson.candidate.cv_cate_id': Number(req.body.cv_cate_id),
            });
        }
        if (req.body.idTimViec365) {
            condition.push({
                idTimViec365: Number(req.body.idTimViec365),
            });
        }
        if (req.body.email) {
            condition.push({
                email: { $regex: new RegExp(req.body.email, 'i') },
            });
        }
        if (req.body.phoneTK) {
            condition.push({
                phone: req.body.phoneTK,
            });
        }
        if (req.body.userName) {
            condition.push({
                userName: { $regex: new RegExp(req.body.userName, 'i') },
            });
        }
        if (req.body.cv_title) {
            condition.push({
                'inForPerson.candidate.cv_title': { $regex: new RegExp(req.body.cv_title, 'i') },
            });
        }
        if (req.body.start && !req.body.end) {
            condition.push({ createdAt: { $gte: Number(req.body.start) } });
        }
        if (req.body.end && !req.body.start) {
            condition.push({ createdAt: { $lte: Number(req.body.end) } });
        }

        if (req.body.start && req.body.end) {
            condition.push({ createdAt: { $gte: Number(req.body.start), $lte: Number(req.body.end) } });
        }

        let form = {
            page: page,
            pageSize: pageSize,
            idTimViec365: idTimViec365 ? idTimViec365 : '0',
            email: email ? email : '0',
            phoneTK: phoneTK ? phoneTK : '-1',
            userName: userName ? userName : '0',
            start: start ? start : '0',
            end: end ? end : '0',
            cv_cate_id: cv_cate_id ? cv_cate_id : '-1',
            cv_city_id: cv_city_id ? cv_city_id : '-1',
            cv_title: cv_title ? cv_title : '0',
        };
        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/list_percents',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        let array = response.data.data.listuser;

        // const count = await Users.countDocuments({ $and: condition });

        return functions.success(res, 'Danh sách ứng viên', {
            data: {
                count: Number(response.data.data.count),
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};
exports.countPercents_2 = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 30;

        let {
            idTimViec365,
            cv_city_id,
            cv_cate_id,
            email,
            phoneTK,
            userName,
            cv_title,
            start,
            end,
            use_check,
            use_show,
        } = req.body;
        let form = {
            page: page,
            pageSize: pageSize,
        };
        if (cv_city_id) form.cv_city_id = cv_city_id;
        if (cv_cate_id) form.cv_cate_id = cv_cate_id;
        if (idTimViec365) form.idTimViec365 = idTimViec365;
        if (email) form.email = email;
        if (phoneTK) form.phoneTK = phoneTK;
        if (userName) form.userName = userName;
        if (cv_title) form.cv_title = cv_title;
        if (start) form.start = start;
        if (end) form.end = end;
        if (use_check) form.use_check = use_check;
        if (use_show) form.use_show = use_show;

        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/list_percents_2',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return functions.success(res, 'Danh sách ứng viên', {
            data: {
                count: Number(response.data.data.count),
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// ứng viên ứng tuyển nhà tuyển dụng
exports.listApply = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;
        let {
            use_first_name,
            use_phone,
            usc_phone,
            new_title,
            new_han_nop,
            usc_company,
            usc_mail,
            startdate,
            enddate,
            uv_time,
            from,
            city_id,
            cate_id,
        } = req.body;
        let condition = {
            nhs_time: {
                $gte: functions.getTimeNow() - 86400 * 3,
            },
        };
        if (use_first_name) {
            condition['candidate.userName'] = { $regex: new RegExp(use_first_name, 'i') };
        }
        if (use_phone) {
            condition['candidate.phone'] = use_phone;
        }
        if (usc_phone) {
            condition['company.phone'] = usc_phone;
        }
        if (new_title) {
            condition['new.new_title'] = { $regex: new RegExp(new_title, 'i') };
        }
        if (new_han_nop) {
            condition['new.new_han_nop'] = { $gte: Number(new_han_nop) };
        }
        if (usc_company) {
            condition['company.userName'] = { $regex: new RegExp(usc_company, 'i') };
        }
        if (usc_mail) {
            condition['company.emailContact'] = { $regex: new RegExp(usc_mail, 'i') };
        }
        if (cate_id) condition['candidate.inForPerson.candidate.cv_cate_id'] = Number(cate_id);
        if (city_id) condition['candidate.inForPerson.candidate.cv_city_id'] = Number(city_id);
        if (uv_time) {
            if (Number(uv_time) == 0) {
                const MonthsAgo = Number(new Date() / 1000) - 30 * 3 * 86400;
                condition['candidate.createdAt'] = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 1) {
                const MonthsAgo = Number(new Date() / 1000) - 30 * 6 * 86400;
                condition['candidate.createdAt'] = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 2) {
                const MonthsAgo = Number(new Date() / 1000) - 30 * 12 * 86400;
                condition['candidate.createdAt'] = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 3) {
                const MonthsAgo = Number(new Date() / 1000) - 30 * 24 * 86400;
                condition['candidate.createdAt'] = { $gte: MonthsAgo };
            }
        }
        // Tìm theo ngày bắt đầu đăng ký
        if (startdate && !enddate) {
            condition.nhs_time = { $gte: Number(startdate) };
        } else if (!startdate && enddate) {
            condition.nhs_time = { $lte: Number(enddate) };
        } else if (startdate && enddate) {
            condition.nhs_time = { $gte: Number(startdate), $lte: Number(enddate) };
        }

        if (from && parseInt(from) == 1) {
            condition.nhs_kq = { $in: [10, 11, 12, 14] };
        }
        if (from && parseInt(from) == 2) {
            condition.nhs_kq = { $in: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 13] };
        }

        const list = await ApplyForJob.aggregate([
            { $match: condition },
            { $sort: { nhs_time: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'nhs_use_id',
                    foreignField: 'idTimViec365',
                    pipeline: [{
                        $match: {
                            type: { $ne: 1 },
                            idTimViec365: { $gt: 0 },
                        },
                    }, ],
                    as: 'candidate',
                },
            },
            {
                $unwind: { path: '$candidate' },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'nhs_com_id',
                    foreignField: 'idTimViec365',
                    pipeline: [{
                        $match: {
                            type: 1,
                            idTimViec365: { $gt: 0 },
                        },
                    }, ],
                    as: 'company',
                },
            },
            {
                $unwind: {
                    path: '$company',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'NewTV365',
                    localField: 'nhs_new_id',
                    foreignField: 'new_id',
                    as: 'new',
                },
            },
            {
                $unwind: {
                    path: '$new',
                },
            },
            {
                $match: condition,
            },

            {
                $project: {
                    nhs_id: 1,
                    nhs_kq: 1,
                    nhs_xn_uts: 1,
                    use_id: '$candidate.idTimViec365',
                    use_logo: '$candidate.avatarUser',
                    use_create_time: '$candidate.createdAt',
                    use_first_name: '$candidate.userName',
                    use_phone: '$candidate.phone',
                    use_phone_tk: '$candidate.phoneTK',
                    new_id: '$new.new_id',
                    new_title: '$new.new_title',
                    new_han_nop: '$new.new_han_nop',
                    usc_phone: '$company.phone',
                    usc_email: '$company.email',
                    usc_company: '$company.userName',
                    nhs_time: 1,
                },
            },
        ]);

        list.map((item) => {
            if (item.use_logo && item.use_create_time) {
                item.use_logo = functions.getImageUv(item.use_create_time, item.use_logo);
            }
            return item;
        });

        return functions.success(res, 'Danh sách ứng viên ứng tuyển', {
            list,
            condition,
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.countListApply = async(req, res) => {
    try {
        let {
            use_first_name,
            use_phone,
            usc_phone,
            new_title,
            new_han_nop,
            usc_company,
            usc_mail,
            startdate,
            enddate,
            uv_time,
            from,
            city_id,
            cate_id,
        } = req.body;
        let condition = {
            nhs_time: {
                $gte: functions.getTimeNow() - 86400 * 3,
            },
        };
        if (use_first_name) {
            condition['candidate.userName'] = { $regex: new RegExp(use_first_name, 'i') };
        }
        if (use_phone) {
            condition['candidate.phone'] = use_phone;
        }
        if (usc_phone) {
            condition['company.phone'] = usc_phone;
        }
        if (new_title) {
            condition['new.new_title'] = { $regex: new RegExp(new_title, 'i') };
        }
        if (new_han_nop) {
            condition['new.new_han_nop'] = { $gte: Number(new_han_nop) };
        }
        if (usc_company) {
            condition['company.userName'] = { $regex: new RegExp(usc_company, 'i') };
        }
        if (usc_mail) {
            condition['company.emailContact'] = { $regex: new RegExp(usc_mail, 'i') };
        }
        if (cate_id) condition['candidate.inForPerson.candidate.cv_cate_id'] = Number(cate_id);
        if (city_id) condition['candidate.inForPerson.candidate.cv_city_id'] = Number(city_id);
        if (uv_time) {
            if (Number(uv_time) == 0) {
                const MonthsAgo = Number(new Date() / 1000) - 30 * 3 * 86400;
                condition['candidate.createdAt'] = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 1) {
                const MonthsAgo = Number(new Date() / 1000) - 30 * 6 * 86400;
                condition['candidate.createdAt'] = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 2) {
                const MonthsAgo = Number(new Date() / 1000) - 30 * 12 * 86400;
                condition['candidate.createdAt'] = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 3) {
                const MonthsAgo = Number(new Date() / 1000) - 30 * 24 * 86400;
                condition['candidate.createdAt'] = { $gte: MonthsAgo };
            }
        }
        // Tìm theo ngày bắt đầu đăng ký
        if (startdate && !enddate) {
            condition.nhs_time = { $gte: Number(startdate) };
        } else if (!startdate && enddate) {
            condition.nhs_time = { $lte: Number(enddate) };
        } else if (startdate && enddate) {
            condition.nhs_time = { $gte: Number(startdate), $lte: Number(enddate) };
        }

        if (from && parseInt(from) == 1) {
            condition.nhs_kq = { $in: [10, 11, 12, 14] };
        }
        if (from && parseInt(from) == 2) {
            condition.nhs_kq = { $in: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 13] };
        }

        const totalCount = await ApplyForJob.aggregate([
            { $match: condition },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'nhs_use_id',
                    foreignField: 'idTimViec365',
                    pipeline: [{
                        $match: {
                            type: { $ne: 1 },
                            idTimViec365: { $gt: 0 },
                        },
                    }, ],
                    as: 'candidate',
                },
            },
            {
                $unwind: { path: '$candidate' },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'nhs_com_id',
                    foreignField: 'idTimViec365',
                    pipeline: [{
                        $match: {
                            type: 1,
                            idTimViec365: { $gt: 0 },
                        },
                    }, ],
                    as: 'company',
                },
            },
            {
                $unwind: {
                    path: '$company',
                },
            },
            {
                $lookup: {
                    from: 'NewTV365',
                    localField: 'nhs_new_id',
                    foreignField: 'new_id',
                    as: 'new',
                },
            },
            {
                $unwind: {
                    path: '$new',
                },
            },
            {
                $match: condition,
            },
            {
                $group: {
                    _id: 1,
                    count: { $sum: 1 },
                },
            },
        ]);

        return functions.success(res, 'Danh sách ứng viên ứng tuyển', {
            totalCount: totalCount.length > 0 ? totalCount[0].count : 0,
            condition,
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// ứng viên chưa hoàn thiện hồ sơ
exports.listAuthentic = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 30;
        let { use_id, use_first_name, use_phone, use_email, time_start, time_end, uv_time } = req.body;
        const condition = {
            idTimViec365: { $gt: 0 },
            type: { $ne: 1 },
            authentic: 0,
        };
        if (use_id) condition.idTimViec365 = Number(use_id); // Tìm theo id
        if (use_first_name) condition.userName = { $regex: new RegExp(use_first_name, 'i') }; // Tìm theo tên
        if (use_phone) condition.phone = use_phone; // Tìm theo sđt
        if (use_email) condition.email = { $regex: new RegExp(use_email, 'i') }; // Tìm theo email liên hệ
        // Tìm theo ngày bắt đầu đăng ký

        if (uv_time) {
            if (Number(uv_time) == 0) {
                const MonthsAgo = Number(new Date() / 1000) - 30 * 3 * 86400;
                condition.updatedAt = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 1) {
                const MonthsAgo = Number(new Date() / 1000) - 30 * 6 * 86400;
                condition.updatedAt = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 2) {
                const MonthsAgo = Number(new Date() / 1000) - 30 * 12 * 86400;
                condition.updatedAt = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 3) {
                const MonthsAgo = Number(new Date() / 1000) - 30 * 24 * 86400;
                condition.updatedAt = { $gte: MonthsAgo };
            }
        }
        if (time_start && !time_end) {
            condition.createdAt = { $gte: Number(time_start) };
        } else if (!time_start && time_end) {
            condition.createdAt = { $lte: Number(time_end) };
        } else if (time_start && time_end) {
            condition.createdAt = { $gte: Number(time_start), $lte: Number(time_end) };
        }

        let form = {
            page: page,
            pageSize: pageSize,
            use_id: use_id ? use_id : '0',
            use_first_name: use_first_name ? use_first_name : '0',
            use_phone: use_phone ? use_phone : '-1',
            use_email: use_email ? use_email : '0',
            uv_time: uv_time ? uv_time : '-1',
            time_start: time_start ? time_start : '0',
            time_end: time_end ? time_end : '0',
        };
        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/listAuthentic',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        let array = response.data.data.listuser;

        const list = await Users.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $match: {
                    idTimViec365: { $in: array },
                },
            },
            // { $skip: (page - 1) * pageSize },
            // { $limit: pageSize },
            {
                $project: {
                    use_id: '$idTimViec365',
                    use_logo: '$avatarUser',
                    use_create_time: '$createdAt',
                    use_first_name: '$userName',
                    use_gioi_tinh: '$inForPerson.account.gender' || null,
                    use_phone: '$phone',
                    use_email: '$email',
                    cv_title: '$inForPerson.candidate.cv_title',
                    use_address: '$address',
                    dk: '$fromDevice',
                    use_view: '$inForPerson.candidate.use_view',
                    use_phone_tk: '$phoneTK',
                    user_xac_thuc: '$otp' || null,
                    use_authentic: '$authentic',
                    percents: '$inForPerson.candidate.percents',
                    use_authentic: '$authentic',
                },
            },
        ]);

        list.map((item) => {
            if (item.use_logo && item.use_create_time) {
                item.use_logo = functions.getImageUv(item.use_create_time, item.use_logo);
            }
            return item;
        });

        return functions.success(res, 'Danh sách ứng viên', {
            list,
            data: {
                count: Number(response.data.data.count),
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// ứng viên chưa hoàn thiện hồ sơ
exports.listAuthentic_2 = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 30;
        let { use_id, use_first_name, use_phone, use_email, time_start, time_end, uv_time } = req.body;
        let form = {
            page: page,
            pageSize: pageSize,
        };
        if (use_id) form.use_id = Number(use_id); // Tìm theo id
        if (use_first_name) form.use_first_name = use_first_name; // Tìm theo tên
        if (use_phone) form.use_phone = use_phone; // Tìm theo sđt
        if (use_email) form.use_email = use_email; // Tìm theo email liên hệ
        if (uv_time) form.uv_time = uv_time;
        if (time_start) form.time_start = time_start;
        if (time_end) form.time_end = time_end;

        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/listAuthentic_2',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        let array = response.data.data.listuser;

        const list = await Users.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $match: {
                    idTimViec365: { $in: array },
                    type: { $ne: 1 },
                },
            },
            {
                $project: {
                    use_id: '$idTimViec365',
                    use_logo: '$avatarUser',
                    use_create_time: '$createdAt',
                    use_first_name: '$userName',
                    use_gioi_tinh: '$inForPerson.account.gender' || null,
                    use_phone: '$phone',
                    use_email: '$email',
                    cv_title: '$inForPerson.candidate.cv_title',
                    use_address: '$address',
                    dk: '$fromDevice',
                    use_view: '$inForPerson.candidate.use_view',
                    use_phone_tk: '$phoneTK',
                    user_xac_thuc: '$otp' || null,
                    use_authentic: '$authentic',
                    percents: '$inForPerson.candidate.percents',
                    use_authentic: '$authentic',
                },
            },
        ]);

        list.map((item) => {
            if (item.use_logo && item.use_create_time) {
                item.use_logo = functions.getImageUv(item.use_create_time, item.use_logo);
            }
            return item;
        });

        return functions.success(res, 'Danh sách ứng viên', {
            list,
            data: {
                count: Number(response.data.data.count),
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.countListAuthentic = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 30;
        let { use_id, use_first_name, use_phone, use_email, time_start, time_end, uv_time } = req.body;
        const condition = {
            idTimViec365: { $gt: 0 },
            type: { $ne: 1 },
            authentic: 0,
        };
        if (use_id) condition.idTimViec365 = Number(use_id); // Tìm theo id
        if (use_first_name) condition.userName = { $regex: new RegExp(use_first_name, 'i') }; // Tìm theo tên
        if (use_phone) condition.phone = use_phone; // Tìm theo sđt
        if (use_email) condition.email = { $regex: new RegExp(use_email, 'i') }; // Tìm theo email liên hệ
        // Tìm theo ngày bắt đầu đăng ký

        if (uv_time) {
            if (Number(uv_time) == 0) {
                const MonthsAgo = Number(new Date() / 1000) - 30 * 3 * 86400;
                condition.updatedAt = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 1) {
                const MonthsAgo = Number(new Date() / 1000) - 30 * 6 * 86400;
                condition.updatedAt = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 2) {
                const MonthsAgo = Number(new Date() / 1000) - 30 * 12 * 86400;
                condition.updatedAt = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 3) {
                const MonthsAgo = Number(new Date() / 1000) - 30 * 24 * 86400;
                condition.updatedAt = { $gte: MonthsAgo };
            }
        }
        if (time_start && !time_end) {
            condition.createdAt = { $gte: Number(time_start) };
        } else if (!time_start && time_end) {
            condition.createdAt = { $lte: Number(time_end) };
        } else if (time_start && time_end) {
            condition.createdAt = { $gte: Number(time_start), $lte: Number(time_end) };
        }

        let form = {
            page: page,
            pageSize: pageSize,
            use_id: use_id ? use_id : '0',
            use_first_name: use_first_name ? use_first_name : '0',
            use_phone: use_phone ? use_phone : '-1',
            use_email: use_email ? use_email : '0',
            uv_time: uv_time ? uv_time : '-1',
            time_start: time_start ? time_start : '0',
            time_end: time_end ? time_end : '0',
        };
        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/listAuthentic',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        // const totalCount = await Users.aggregate([
        //     { $sort: { createdAt: -1, idTimViec365: -1 } },
        //     {
        //         $match: condition
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             count: { $sum: 1 }
        //         }
        //     }
        // ]);

        return functions.success(res, 'Tổng ứng viên', {
            data: {
                count: Number(response.data.data.count),
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.countListAuthentic_2 = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 30;
        let { use_id, use_first_name, use_phone, use_email, time_start, time_end, uv_time } = req.body;
        let form = {
            page: page,
            pageSize: pageSize,
        };
        if (use_id) form.use_id = Number(use_id); // Tìm theo id
        if (use_first_name) form.use_first_name = use_first_name; // Tìm theo tên
        if (use_phone) form.use_phone = use_phone; // Tìm theo sđt
        if (use_email) form.use_email = use_email; // Tìm theo email liên hệ
        if (uv_time) form.uv_time = uv_time;
        if (time_start) form.time_start = time_start;
        if (time_end) form.time_end = time_end;

        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/listAuthentic_2',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return functions.success(res, 'Danh sách ứng viên', {
            data: {
                count: Number(response.data.data.count),
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};
// ứng viên cv
exports.listCandiSaveCv = async(req, res) => {
    try {
        const page = req.body.page || 1,
            pageSize = req.body.pageSize || 30;
        const list = await SaveCvCandi.aggregate([{
                $sort: { time_edit: -1 },
            },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'uid',
                    foreignField: 'idTimViec365',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            {
                $match: {
                    'user.type': 0,
                },
            },
            {
                $project: {
                    use_id: '$user.idTimViec365',
                    use_first_name: '$user.userName',
                    use_phone: '$user.phone',
                    use_email: '$user.email',
                    time_edit: 1,
                    html: 1,
                },
            },
        ]);
        return functions.success(res, 'Danh sách ứng viên', { list, count: 0 });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// ứng viên đã xóa
exports.listDeleted = async(req, res) => {
    try {
        const page = req.body.page || 1,
            pageSize = req.body.pageSize || 30;

        const list = await HistoryDeleteUser.find()
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort({ delete_time: -1 })
            .lean();
        const count = await HistoryDeleteUser.countDocuments();
        return functions.success(res, 'Danh sách ứng viên', { list, count });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// UserAddFails
exports.InsertUserAddFail = async(req, res) => {
    try {
        let newobj = new UserAddFail(req.body);
        await newobj.save();
        return functions.success(res, 'Danh sách', {
            data: {
                status: true,
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.InsertUserAddFail2 = async(req, res) => {
    try {
        let maxId = await UserAddFail.findOne({}, { uf_id: 1 }).sort({ uf_id: -1 }).lean();
        maxId = maxId.uf_id;

        let newobj = new UserAddFail({
            uf_id: maxId,
            uf_email: req.body.uf_email || '',
            uf_phone: req.body.uf_phone || '',
            uf_reason: req.body.uf_reason || '',
        });
        let savedobj = await newobj.save();
        return functions.success(res, 'Danh sách', {
            data: {
                status: true,
                savedobj,
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.takeListUserAddFail = async(req, res) => {
    try {
        let condition = [{ uf_id: { $gte: 0 } }];
        if (req.body.start && !req.body.end) {
            condition.push({ uf_time: { $gte: new Date(req.body.start) } });
        }
        if (!req.body.start && req.body.end) {
            condition.push({ uf_time: { $lte: new Date(req.body.end) } });
        }
        if (req.body.start && req.body.end) {
            condition.push({ uf_time: { $gte: new Date(req.body.start), $lte: new Date(req.body.end) } });
        }
        if (req.body.email) {
            condition.push({ uf_email: new RegExp(req.body.email, 'i') });
        }
        if (req.body.phone) {
            condition.push({ uf_phone: phone });
        }
        let skip = Number(req.body.skip);
        let limit = Number(req.body.limit);
        let listData = await UserAddFail.find({
                $and: condition,
            })
            .sort({ uf_id: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        let count = await UserAddFail.countDocuments({
            $and: condition,
        });
        return functions.success(res, 'Danh sách', {
            data: {
                listData,
                count,
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};
exports.refreshCandi = async(req, res) => {
    try {
        const userId = req.body.use_id;
        if (userId) {
            let checkUser = await Users.findOne({ idTimViec365: userId, type: { $ne: 1 } }).lean();
            if (checkUser) {
                await Users.updateOne({ _id: checkUser._id }, {
                    $set: {
                        updatedAt: functions.getTimeNow(),
                    },
                });
                return functions.success(res, 'Làm mới ứng viên thành công');
            }
            return functions.setError(res, 'Tài khoản không tồn tại');
        }
        return functions.setError(res, 'Thông tin truyền lên không đầy đủ');
    } catch (e) {
        console.log(e);
        return functions.setError(res, e);
    }
};

// Ứng viên chưa cập nhập hồ sơ
exports.candi_unseths = async(req, res) => {
    try {
        let condition = {
            type: 0,
        };
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;

        let { use_id, use_first_name, use_phone, use_email, time_start, time_end, category, city, use_delete, uType } =
        req.body;
        // Tìm theo id của ứng viên
        if (use_id) {
            condition.id = Number(use_id);
        }
        if (use_first_name) {
            condition.use_first_name = { $regex: use_first_name, $options: 'i' };
        }
        if (use_phone) {
            condition.use_phone = use_phone;
        }
        if (use_email) {
            condition.use_email = { $regex: use_email, $options: 'i' };
        }
        // Tìm theo ngày bắt đầu đăng ký
        if (time_start && !time_end) {
            time_start = Number(time_start);
            condition.use_create_time = { $gte: time_start };
        } else if (!time_start && time_end) {
            time_end = Number(time_end);
            condition.use_create_time = { $lte: time_end };
        } else if (time_start && time_end) {
            time_start = Number(time_start);
            time_end = Number(time_end);
            condition.use_create_time = { $gte: time_start, $lte: time_end };
        }
        if (category) condition.use_cv_cate = category;
        if (city) condition.use_cv_city = city;
        if (use_delete) condition.use_delete = Number(use_delete);
        switch (Number(uType)) {
            case 1:
                condition.use_pass = { $ne: '' };
                break;
            case 2:
                condition.use_pass = '';
                break;
            case 3:
                condition.u_regis = 1;
                break;
            default:
                break;
        }
        console.log('type:', condition);

        const list = await UserUnset.aggregate([
            { $match: condition },
            { $sort: { use_create_time: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $project: {
                    use_id: '$id',
                    use_first_name: '$use_first_name',
                    use_mail: '$use_mail',
                    use_phone: '$use_phone',
                    use_phone_tk: '$use_phone_tk',
                    use_email_lienhe: '$use_email_lienhe',
                    use_create_time: '$use_create_time',
                    use_pass: '$use_pass',
                    use_delete: '$use_delete',
                },
            },
        ]);
        const count = await UserUnset.countDocuments(condition);
        return functions.success(res, 'Danh sách', {
            data: {
                list,
                count,
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

//Tất cả ứng viên
exports.candiAll = async(req, res) => {
    try {
        const date = new Date();
        const year = date.getFullYear();
        // const time = functions.getTimeNow() - 86400 * 30;
        const time = functions.convertTimestamp(`${year}-01-01 00:00`);

        let condition = {
            fromDevice: { $nin: [4, 7] },
            type: 0,
            idTimViec365: { $gt: 0 },
            updatedAt: { $gte: time },
            'inForPerson.candidate.percents': { $gte: 45 },
        };
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;

        let {
            use_id,
            use_first_name,
            use_phone,
            use_address,
            use_email,
            use_phone_tk,
            cv_title,
            use_email_lh,
            time_start,
            time_end,
            register,
            category,
            city,
            authentic,
        } = req.body;
        if (use_id) condition.idTimViec365 = Number(use_id); // Tìm theo id của ứng viên
        if (use_first_name) condition.userName = { $regex: new RegExp(use_first_name, 'i') }; // Tìm theo tên
        if (use_phone) condition.phone = use_phone; // Tìm theo sđt
        if (use_email) condition.email = { $regex: new RegExp(use_email, 'i') }; // Tìm theo email đăng nhập
        if (use_address) condition.address = { $regex: new RegExp(use_address, 'i') };
        if (use_phone_tk) condition.phoneTK = use_phone_tk; // Tìm theo sđt đăng nhập
        if (use_email_lh) condition.emailContact = use_email_lh; // Tìm theo email liên hệ
        if (cv_title) condition['inForPerson.candidate.cv_title'] = { $regex: cv_title, $options: 'i' }; // Tìm theo công việc
        // Tìm theo ngày bắt đầu đăng ký

        if (time_start && !time_end) {
            condition.updatedAt = { $gte: Number(time_start) };
        } else if (!time_start && time_end) {
            condition.updatedAt = { $lte: Number(time_end) };
        } else if (time_start && time_end) {
            condition.updatedAt = { $gte: Number(time_start), $lte: Number(time_end) };
        }
        if (register) condition.fromDevice = Number(register); // Tìm theo nguồn đăng ký
        if (category) condition['inForPerson.candidate.cv_cate_id'] = Number(category);
        if (city) condition['inForPerson.candidate.cv_city_id'] = Number(city);
        if (authentic) condition.authentic = Number(authentic);

        // let form = {
        //     page: page,
        //     pageSize: pageSize,
        //     use_id: use_id ? use_id : "0",
        //     use_first_name: use_first_name ? use_first_name : "0",
        //     use_phone: use_phone ? use_phone : "-1",
        //     use_address: use_address ? use_address : "0",
        //     use_email: use_email ? use_email : "0",
        //     use_phone_tk: use_phone_tk ? use_phone_tk : "-1",
        //     use_email_lh: use_email_lh ? use_email_lh : "0",
        //     cv_title: cv_title ? cv_title : "0",
        //     time_start: time_start ? time_start : "0",
        //     time_end: time_end ? time_end : "0",
        //     register: register ? register : "-1",
        //     category: category ? category : "-1",
        //     city: city ? city : "-1",
        //     authentic: authentic ? authentic : "-1",
        // }
        // let response = await axios({
        //     method: "post",
        //     url: "http://43.239.223.57:9002/candi_all",
        //     data: form,
        //     headers: { "Content-Type": "multipart/form-data" }
        // });
        // let array = response.data.data.listuser;

        const list = await Users.aggregate([{
                $match: condition,
            },
            { $sort: { updatedAt: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $project: {
                    use_id: '$idTimViec365',
                    use_logo: '$avatarUser',
                    use_create_time: '$createdAt',
                    use_first_name: '$userName',
                    use_gioi_tinh: '$inForPerson.account.gender' || null,
                    use_phone: '$phone',
                    use_email: '$email',
                    cv_title: '$inForPerson.candidate.cv_title',
                    use_address: '$address',
                    dk: '$fromDevice',
                    use_view: '$inForPerson.candidate.use_view',
                    use_phone_tk: '$phoneTK',
                    user_xac_thuc: '$otp' || null,
                    use_authentic: '$authentic',
                    use_update_time: '$updatedAt',
                    email_lh: '$emailContact',
                    fromDevice: '$fromDevice',
                    star3: '$inForPerson.candidate.star3',
                    time_active_star3: '$inForPerson.candidate.time_active_star3'
                },
            },
        ]);
        const totalCount = await Users.aggregate([{
                $match: condition,
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                },
            },
        ]);
        let timeago = new Date().getTime() / 1000 - 24 * 3600;
        list.map((item) => {
            item.time_active_star3 = item.time_active_star3 ? item.time_active_star3 : 0;
            if (item.time_active_star3 < timeago) {
                item.star3 = 0;
            }
            if (item.use_logo && item.use_create_time) {
                item.use_logo = functions.getImageUv(item.use_create_time, item.use_logo);
            }
            return item;
        });

        return functions.success(res, 'Danh sách', {
            data: {
                list,
                count: totalCount.length > 0 ? totalCount[0].count : 0,
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.candiAll_2 = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;

        let {
            use_id,
            use_first_name,
            use_phone,
            use_address,
            use_email,
            use_phone_tk,
            cv_title,
            use_email_lh,
            time_start,
            time_end,
            register,
            category,
            city,
            authentic,
        } = req.body;
        let form = {
            page: page,
            pageSize: pageSize,
        };

        if (use_id) form.use_id = Number(use_id); // Tìm theo id của ứng viên
        if (use_first_name) form.use_first_name = use_first_name; // Tìm theo tên
        if (use_phone) form.use_phone = use_phone; // Tìm theo sđt
        if (use_email) form.use_email = use_email; // Tìm theo email đăng nhập
        if (use_address) form.use_address = use_address;
        if (use_phone_tk) form.use_phone_tk = use_phone_tk; // Tìm theo sđt đăng nhập
        if (use_email_lh) form.use_email_lh = use_email_lh; // Tìm theo email liên hệ
        if (cv_title) form.cv_title = cv_title; // Tìm theo công việc

        if (time_start) {
            form.time_start = time_start;
        }
        if (time_end) {
            form.time_end = time_end;
        }
        if (register) form.register = Number(register); // Tìm theo nguồn đăng ký
        if (category) form.category = category;
        if (city) form.city = city;
        if (authentic) form.authentic = Number(authentic);

        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/candi_all_2',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        let array = response.data.data.listuser;

        let condition = [{ idTimViec365: { $in: array } }, { type: { $ne: 1 } }];
        if (time_start) {
            condition.push({
                updatedAt: { $gte: Number(time_start) },
            });
        }
        if (time_end) {
            condition.push({
                updatedAt: { $lte: Number(time_end) },
            });
        }
        if (city) {
            condition.push({
                'inForPerson.candidate.cv_city_id': Number(city),
            });
        }
        if (category) {
            condition.push({
                'inForPerson.candidate.cv_cate_id': Number(category),
            });
        }
        const list = await Users.aggregate([
            { $sort: { updatedAt: -1, idTimViec365: -1 } },
            {
                $match: {
                    $and: condition,
                },
            },
            {
                $project: {
                    use_id: '$idTimViec365',
                    use_logo: '$avatarUser',
                    use_create_time: '$createdAt',
                    use_first_name: '$userName',
                    use_gioi_tinh: '$inForPerson.account.gender' || null,
                    use_phone: '$phone',
                    use_email: '$email',
                    cv_title: '$inForPerson.candidate.cv_title',
                    use_address: '$address',
                    dk: '$fromDevice',
                    use_view: '$inForPerson.candidate.use_view',
                    use_phone_tk: '$phoneTK',
                    user_xac_thuc: '$otp' || null,
                    use_authentic: '$authentic',
                    use_update_time: '$updatedAt',
                    email_lh: '$emailContact',
                },
            },
        ]);

        list.map((item) => {
            if (item.use_logo && item.use_create_time) {
                item.use_logo = functions.getImageUv(item.use_create_time, item.use_logo);
            }
            return item;
        });

        return functions.success(res, 'Danh sách', {
            data: {
                list,
                count: Number(response.data.data.count),
                condition,
                form,
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

//Tất cả ứng viên
exports.countCandiAll = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;
        let condition = {
            idTimViec365: { $gt: 0 },
            fromDevice: { $nin: [4, 7] },
            type: { $ne: 1 },
        };

        let {
            use_id,
            use_first_name,
            use_phone,
            use_email,
            use_address,
            use_phone_tk,
            cv_title,
            use_email_lh,
            time_start,
            time_end,
            register,
            category,
            city,
            authentic,
        } = req.body;
        if (use_id) condition.idTimViec365 = Number(use_id); // Tìm theo id của ứng viên
        if (use_first_name) condition.userName = { $regex: new RegExp(use_first_name, 'i') }; // Tìm theo tên
        if (use_phone) condition.phone = use_phone; // Tìm theo sđt
        if (use_email) condition.email = { $regex: new RegExp(use_email, 'i') }; // Tìm theo email đăng nhập
        if (use_address) condition.address = { $regex: new RegExp(use_address, 'i') };
        if (use_phone_tk) condition.phoneTK = use_phone_tk; // Tìm theo sđt đăng nhập
        if (use_email_lh) condition.emailContact = use_email_lh; // Tìm theo email liên hệ
        if (cv_title) condition['inForPerson.candidate.cv_title'] = { $regex: cv_title, $options: 'i' }; // Tìm theo công việc
        // Tìm theo ngày bắt đầu đăng ký

        if (time_start && !time_end) {
            condition.updatedAt = { $gte: Number(time_start) };
        } else if (!time_start && time_end) {
            condition.updatedAt = { $lte: Number(time_end) };
        } else if (time_start && time_end) {
            condition.updatedAt = { $gte: Number(time_start), $lte: Number(time_end) };
        }
        if (register) condition.fromDevice = Number(register); // Tìm theo nguồn đăng ký
        if (category) condition['inForPerson.candidate.cv_cate_id'] = Number(category);
        if (city) condition['inForPerson.candidate.cv_city_id'] = Number(city);
        if (authentic) condition.authentic = Number(authentic);

        let form = {
            page: page,
            pageSize: pageSize,
            use_id: use_id ? use_id : '0',
            use_first_name: use_first_name ? use_first_name : '0',
            use_phone: use_phone ? use_phone : '-1',
            use_address: use_address ? use_address : '0',
            use_email: use_email ? use_email : '0',
            use_phone_tk: use_phone_tk ? use_phone_tk : '-1',
            use_email_lh: use_email_lh ? use_email_lh : '0',
            cv_title: cv_title ? cv_title : '0',
            time_start: time_start ? time_start : '0',
            time_end: time_end ? time_end : '0',
            register: register ? register : '-1',
            category: category ? category : '-1',
            city: city ? city : '-1',
            authentic: authentic ? authentic : '-1',
        };
        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/candi_all_2',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        let array = response.data.data.listuser;
        // const count = await Users.countDocuments(condition);
        return functions.success(res, 'Danh sách', {
            data: {
                count: Number(response.data.data.count),
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.countCandiAll_2 = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;

        let {
            use_id,
            use_first_name,
            use_phone,
            use_address,
            use_email,
            use_phone_tk,
            cv_title,
            use_email_lh,
            time_start,
            time_end,
            register,
            category,
            city,
            authentic,
        } = req.body;
        let form = {
            page: page,
            pageSize: pageSize,
        };
        if (use_id) form.use_id = Number(use_id); // Tìm theo id của ứng viên
        if (use_first_name) form.use_first_name = use_first_name; // Tìm theo tên
        if (use_phone) form.use_phone = use_phone; // Tìm theo sđt
        if (use_email) form.use_email = use_email; // Tìm theo email đăng nhập
        if (use_address) form.use_address = use_address;
        if (use_phone_tk) form.use_phone_tk = use_phone_tk; // Tìm theo sđt đăng nhập
        if (use_email_lh) form.use_email_lh = use_email_lh; // Tìm theo email liên hệ
        if (cv_title) form.cv_title = cv_title; // Tìm theo công việc

        if (time_start) form.time_start = time_start;
        if (time_end) form.time_end = time_end;
        if (register) form.register = Number(register); // Tìm theo nguồn đăng ký
        if (category) form.cv_cate_id = category;
        if (city) form.cv_city_id = city;
        if (authentic) form.authentic = Number(authentic);

        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/candi_all_2',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return functions.success(res, 'Danh sách', {
            data: {
                count: Number(response.data.data.count),
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.candiNotCompleteAppCv = async(req, res) => {
    try {
        let condition = {
            idTimViec365: { $gt: 0 },
            fromDevice: { $nin: [4, 7] },
            type: { $ne: 1 },
            'inForPerson.candidate.percents': { $lte: 45 },
        };
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;

        let {
            use_id,
            use_first_name,
            use_phone,
            use_email,
            use_phone_tk,
            cv_title,
            use_email_lh,
            time_start,
            time_end,
            register,
            category,
            city,
            authentic,
            uv_time,
        } = req.body;
        if (use_id) condition.idTimViec365 = Number(use_id); // Tìm theo id của ứng viên
        if (use_first_name) condition.userName = { $regex: new RegExp(use_first_name, 'i') }; // Tìm theo tên
        if (use_phone) condition.phone = use_phone; // Tìm theo sđt
        if (use_email) condition.email = { $regex: new RegExp(use_email, 'i') }; // Tìm theo email đăng nhập
        if (use_phone_tk) condition.phoneTK = use_phone_tk; // Tìm theo sđt đăng nhập
        if (use_email_lh) condition.emailContact = use_email_lh; // Tìm theo email liên hệ
        if (cv_title) condition['inForPerson.candidate.cv_title'] = { $regex: cv_title, $options: 'i' }; // Tìm theo công việc
        // Tìm theo ngày bắt đầu đăng ký

        if (uv_time) {
            if (Number(uv_time) == 0) {
                const MonthsAgo = Number(new Date().getTime() / 1000) - 30 * 3 * 86400;
                condition.createdAt = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 1) {
                const MonthsAgo = Number(new Date().getTime() / 1000) - 30 * 6 * 86400;
                condition.createdAt = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 2) {
                const MonthsAgo = Number(new Date().getTime() / 1000) - 30 * 12 * 86400;
                condition.createdAt = { $gte: MonthsAgo };
            } else if (Number(uv_time) == 3) {
                const MonthsAgo = Number(new Date().getTime() / 1000) - 30 * 24 * 86400;
                condition.createdAt = { $gte: MonthsAgo };
            }
        }
        if (time_start && !time_end) {
            condition.createdAt = { $gte: Number(time_start) };
        } else if (!time_start && time_end) {
            condition.createdAt = { $lte: Number(time_end) };
        } else if (time_start && time_end) {
            condition.createdAt = { $gte: Number(time_start), $lte: Number(time_end) };
        }
        if (register) condition.fromDevice = Number(register); // Tìm theo nguồn đăng ký
        if (category) condition['inForPerson.candidate.cv_cate_id'] = Number(category);
        if (city) condition['inForPerson.candidate.cv_city_id'] = Number(city);
        if (authentic) condition.authentic = Number(authentic);

        let form = {
            page: page,
            pageSize: pageSize,
            use_id: use_id ? use_id : '0',
            use_first_name: use_first_name ? use_first_name : '0',
            use_phone: use_phone ? use_phone : '-1',
            use_email: use_email ? use_email : '0',
            use_phone_tk: use_phone_tk ? use_phone_tk : '-1',
            use_email_lh: use_email_lh ? use_email_lh : '0',
            cv_title: cv_title ? cv_title : '0',
            time_start: time_start ? time_start : '0',
            time_end: time_end ? time_end : '0',
            register: register ? register : '-1',
            category: category ? category : '-1',
            city: city ? city : '-1',
            authentic: authentic ? authentic : '-1',
        };
        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/candiNotCompleteAppCv',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        let array = response.data.data.listuser;

        const list = await Users.aggregate([
            // { $sort: { createdAt: -1, idTimViec365: -1 } },
            {
                $match: { idTimViec365: { $in: array } },
            },
            // { $skip: (page - 1) * pageSize },
            // { $limit: pageSize },
            {
                $project: {
                    use_id: '$idTimViec365',
                    use_logo: '$avatarUser',
                    use_create_time: '$createdAt',
                    use_first_name: '$userName',
                    use_gioi_tinh: '$inForPerson.account.gender' || null,
                    use_phone: '$phone',
                    use_email: '$email',
                    cv_title: '$inForPerson.candidate.cv_title',
                    use_address: '$address',
                    dk: '$fromDevice',
                    use_view: '$inForPerson.candidate.use_view',
                    use_phone_tk: '$phoneTK',
                    user_xac_thuc: '$otp' || null,
                    use_authentic: '$authentic',
                    use_update_time: '$updatedAt',
                    use_show: '$inForPerson.candidate.use_show',
                },
            },
        ]);
        list.map((item) => {
            if (item.use_logo && item.use_create_time) {
                item.use_logo = functions.getImageUv(item.use_create_time, item.use_logo);
            }
            return item;
        });

        return functions.success(res, 'Danh sách', {
            data: {
                list,
                count: Number(response.data.data.count),
                condition,
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.candiNotCompleteAppCv_2 = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;

        let {
            use_id,
            use_first_name,
            use_phone,
            use_email,
            use_phone_tk,
            cv_title,
            use_email_lh,
            time_start,
            time_end,
            register,
            category,
            city,
            authentic,
            uv_time,
        } = req.body;
        let form = {
            page: page,
            pageSize: pageSize,
        };
        if (use_id) form.idTimViec365 = Number(use_id); // Tìm theo id của ứng viên
        if (use_first_name) form.userName = use_first_name; // Tìm theo tên
        if (use_phone) form.phone = use_phone; // Tìm theo sđt
        if (use_email) form.email = use_email; // Tìm theo email đăng nhập
        if (use_phone_tk) form.phoneTK = use_phone_tk; // Tìm theo sđt đăng nhập
        if (use_email_lh) form.emailContact = use_email_lh; // Tìm theo email liên hệ
        if (cv_title) form.cv_title = cv_title; // Tìm theo công việc
        if (uv_time) form.uv_time = uv_time;
        if (time_start) form.time_start = time_start;
        if (time_end) form.time_end = time_end;
        if (register) form.register = register;
        if (category) form.cv_cate_id = category;
        if (city) form.cv_city_id = city;
        if (authentic) form.authentic = authentic;

        let response = await axios({
            method: 'post',
            url: 'http://43.239.223.57:9002/candiNotCompleteAppCv_2',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        let array = response.data.data.listuser;

        const list = await Users.aggregate([
            { $sort: { createdAt: -1, idTimViec365: -1 } },
            {
                $match: { idTimViec365: { $in: array } },
            },
            {
                $project: {
                    use_id: '$idTimViec365',
                    use_logo: '$avatarUser',
                    use_create_time: '$createdAt',
                    use_first_name: '$userName',
                    use_gioi_tinh: '$inForPerson.account.gender' || null,
                    use_phone: '$phone',
                    use_email: '$email',
                    cv_title: '$inForPerson.candidate.cv_title',
                    use_address: '$address',
                    dk: '$fromDevice',
                    use_view: '$inForPerson.candidate.use_view',
                    use_phone_tk: '$phoneTK',
                    user_xac_thuc: '$otp' || null,
                    use_authentic: '$authentic',
                    use_update_time: '$updatedAt',
                    use_show: '$inForPerson.candidate.use_show',
                },
            },
        ]);
        list.map((item) => {
            if (item.use_logo && item.use_create_time) {
                item.use_logo = functions.getImageUv(item.use_create_time, item.use_logo);
            }
            return item;
        });

        return functions.success(res, 'Danh sách', {
            data: {
                list,
                count: Number(response.data.data.count),
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.inforUserUnset = async(req, res) => {
    try {
        const { id } = req.body;
        if (id) {
            const user = await UserUnset.findOne({ id });
            if (user) {
                return functions.success(res, 'Thông tin ứng viên chưa hoàn thiện hồ sơ', { user });
            }
            return functions.setError(res, 'User không tồn tại');
        }
        return functions.setError(res, 'Chưa truyền id');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
};

exports.deleteUserUnset = async(req, res) => {
    try {
        const { id } = req.body;
        if (id) {
            const user = await UserUnset.findOne({ id });
            if (user) {
                await UserUnset.deleteOne({ id });
                return functions.success(res, 'Xóa thành công');
            }
            return functions.setError(res, 'User không tồn tại');
        }
        return functions.setError(res, 'Chưa truyền id');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
};

// Kích hoạt ứng viên
exports.activeUV = async(req, res, next) => {
    try {
        let use_id = req.body.use_id;
        if (use_id) {
            let checkdata = await Users.findOne({ idTimViec365: use_id, type: 0 }, { authentic: 1 });
            if (checkdata) {
                if (checkdata.authentic == 1) {
                    await Users.updateOne({ idTimViec365: use_id, type: 0 }, { authentic: 0 });
                } else {
                    await Users.updateOne({ idTimViec365: use_id, type: 0 }, { authentic: 1 });
                }
            } else {
                return functions.success(res, 'Không tìm thấy người dùng');
            }
            return functions.success(res, 'Cập nhập thành công');
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.deleteCandidate = async(req, res, next) => {
    try {
        const id = Number(req.body.id);
        if (!id) return functions.setError(res, 'not delete user');
        let candi = await Users.findOne({ type: 0, idTimViec365: id });
        await Users.deleteOne({
            type: 0,
            idTimViec365: id,
        });
        let dataDelete = {};
        return functions.success(res, 'delete candidate is successfully');
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.getCandidateSpamIP = async(req, res, next) => {
    try {
        const page = Number(req.body.page) || 1;
        const id = Number(req.body.id);
        const name = req.body.name;
        const startDate = Number(req.body.startDate);
        const endDate = Number(req.body.endDate);

        const promiseListCandidate = Users.find({
                type: 0,
                idTimviec365: { $ne: 0 },
                ...(id ? { idTimViec365: id } : {}),
                'inForPerson.candidate.check_create_use': 1,
                ...(name ? { userName: { $regex: name, $options: 'i' } } : {}),
                ...(startDate ? { createdAt: { $gte: startDate } } : {}),
                ...(endDate ? { createdAt: { $lte: endDate } } : {}),
                ...(endDate && startDate ? { createdAt: { $lte: endDate, $gte: startDate } } : {}),
            }, {
                userName: 1,
                phone: 1,
                phoneTK: 1,
                emailContact: 1,
                createdAt: 1,
                idTimViec365: 1,
                usc_ip: 1,
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * 30)
            .limit(30)
            .lean();

        const promiseCount = Users.find({
            type: 0,
            idTimviec365: { $ne: 0 },
            ...(id ? { idTimViec365: id } : {}),
            'inForPerson.candidate.check_create_use': 1,
            ...(name ? { userName: { $regex: name, $options: 'i' } } : {}),
            ...(startDate ? { createdAt: { $gte: startDate } } : {}),
            ...(endDate ? { createdAt: { $lte: endDate } } : {}),
            ...(endDate && startDate ? { createdAt: { $lte: endDate, $gte: startDate } } : {}),
        }).count();

        const [listCandidate, count] = await Promise.all([promiseListCandidate, promiseCount]);
        return functions.success(res, 'Get list user spam ip is successfully', {
            listCandidate,
            count,
        });
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.listCandidateTest = async(req, res, next) => {
    try {
        const page = Number(req.body.page) || 1;
        const id = Number(req.body.id);
        const name = req.body.name;
        const date = Number(req.body.date);
        const email = req.body.email;
        const phone = req.body.phone;

        const promiseListCandidate = Users.find({
                type: 0,
                idTimViec365: { $ne: 0 },
                ...(id ? { idTimViec365: id } : {}),
                'inForPerson.candidate.use_test': 1,
                ...(name ? { userName: { $regex: new RegExp(`^${name}`, 'i') } } : {}),
                ...(date ? { createdAt: { $gte: date } } : {}),
                ...(phone ? { phone: { $regex: `^${phone}` } } : {}),
                ...(email ? {
                    $or: [
                        { email: { $regex: new RegExp(`^${email}`, 'i') } },
                        {
                            emailContact: { $regex: new RegExp(`^${email}`, 'i') },
                        },
                    ],
                } : {}),
            }, {
                userName: 1,
                phone: 1,
                email: 1,
                phoneTK: 1,
                emailContact: 1,
                createdAt: 1,
                idTimViec365: 1,
            })
            .sort({
                createdAt: -1,
            })
            .skip((page - 1) * 30)
            .limit(30);

        const promiseCount = Users.find({
            type: 0,
            idTimViec365: { $ne: 0 },
            ...(id ? { idTimViec365: id } : {}),
            'inForPerson.candidate.use_test': 1,
            ...(name ? { userName: { $regex: new RegExp(`^${name}`, 'i') } } : {}),
            ...(date ? { createdAt: { $gte: date } } : {}),
            ...(phone ? { phone: { $regex: `^${phone}` } } : {}),
            ...(email ? {
                $or: [
                    { email: { $regex: new RegExp(`^${email}`, 'i') } },
                    {
                        emailContact: { $regex: new RegExp(`^${email}`, 'i') },
                    },
                ],
            } : {}),
        }).count();

        const [listCandidate, count] = await Promise.all([promiseListCandidate, promiseCount]);
        return functions.success(res, 'Get all candidate test is success', {
            listCandidate,
            count,
        });
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.addExcel = async(req, res) => {
    try {
        // Requiring the module
        const reader = require('xlsx');
        let fileExcell = req.file;
        if (fileExcell) {
            // Reading our test file
            const file = reader.readFile(fileExcell.path);

            let rowData = [];

            const sheets = file.SheetNames;
            let myHeader = [];
            while (myHeader.length <= 24) {
                myHeader.push(myHeader.length + 1);
            }
            for (let i = 0; i < sheets.length; i++) {
                const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]], {
                    header: myHeader,
                    defval: '',
                });
                temp.forEach((uv) => {
                    rowData.push(Object.values(uv));
                });
            }
            let u = 0,
                c = 0,
                success = 0,
                time_check = functions.getTimeNow(),
                d = new Date(),
                time_yesterday = time_check - 86400,
                total = rowData.length;
            let getMaxUserID = await functions.getMaxUserID();
            for (let key = 0; key < rowData.length; key++) {
                let value = rowData[key];
                let account = value[0];
                account = account.replaceAll('`', '');
                if (
                    value[22] == '' &&
                    value[21] == '' &&
                    (value[15] == '0' || value[15] == '') &&
                    (value[16] == '0' || value[16] == '')
                ) {
                    if (value[8] >= time_check) {
                        // check = new db_count("SELECT count(uf_id) as count FROM user_add_fail WHERE uf_email = '$account' AND uf_time >= '" . date('Y-m-d', $time_check) . "'");
                        let check = await UserAddFail.findOne({
                            uf_email: account,
                            uf_time: { $gte: new Date(d.getFullYear(), d.getMonth(), d.getDate()) },
                        }).lean();
                        if (!check) {
                            let reason = 'Không có đồng thời file CV lẫn mục tiêu và kỹ năng';
                            //Thêm vào base addFail
                            const getMaxIdAddFail = await UserAddFail.findOne({}, { uf_id: 1 })
                                .sort({ uf_id: -1 })
                                .limit(1)
                                .lean();
                            let dataAddFail = {
                                uf_id: Number(getMaxIdAddFail.uf_id) + 1,
                                uf_email: account,
                                uf_phone: value[2],
                                uf_reason: reason,
                                uf_time: new Date(),
                            };
                            let newAddFail = new UserAddFail(dataAddFail);
                            await newAddFail.save();
                        }
                    }
                    c++;
                    continue;
                }

                if (
                    (account.includes('@') && !(await functions.checkEmail(account))) ||
                    (!account.includes('@') && !(await functions.checkPhoneNumber(account)))
                ) {
                    let check = UserAddFail.findOne({
                        uf_email: account,
                        uf_time: { $gte: new Date(time_check * 1000) },
                    }).lean();
                    if (!check) {
                        let reason = 'Ứng viên có email hoặc số điện thoại không hợp lệ';
                        //Thêm vào base addFail
                        const getMaxIdAddFail = await UserAddFail.findOne({}, { uf_id: 1 })
                            .sort({ uf_id: -1 })
                            .limit(1)
                            .lean();
                        let dataAddFail = {
                            uf_id: Number(getMaxIdAddFail.uf_id) + 1,
                            uf_email: account,
                            uf_phone: value[2],
                            uf_reason: reason,
                            uf_time: new Date(),
                        };
                        let newAddFail = new UserAddFail(dataAddFail);
                        await newAddFail.save();
                    }
                    u++;
                    continue;
                }
                let matchUser = { type: 0 };
                if (await functions.checkEmail(account)) {
                    matchUser.email = account;
                } else {
                    matchUser.phoneTK = account;
                }
                let checkUser = await Users.findOne(matchUser).lean();
                if (!checkUser) {
                    let lastname = value[1],
                        phone = value[2] ? String(value[2]).replaceAll('`', '') : value[2],
                        use_birth_day = value[3],
                        lg_tp = value[4],
                        lg_qh = value[5],
                        use_hon_nhan = value[6],
                        use_gioi_tinh = value[7],
                        use_create_time = value[8],
                        use_address = value[9],
                        cv_title = value[10],
                        use_cate = value[11],
                        cv_city_id = value[12],
                        cv_exp = value[13],
                        cv_money_id = value[14],
                        cv_muctieu = value[15],
                        cv_kynang = value[16],
                        cv_capbac_id = value[17],
                        cv_loaihinh_id = value[18],
                        use_lat = value[19],
                        use_long = value[20],
                        kinhhnghiem = value[24] != '' ? value[24] : '',
                        time = (timeFile = functions.getTimeNow()),
                        password = md5('timviec365'),
                        avatar = value[23] ? value[23] : '';

                    getMaxUserID = await functions.getMaxUserID();
                    let idTimViec365 = getMaxUserID._idTV365;
                    //Xử lý avatar
                    let nameAva = '';
                    if (avatar) {
                        avatar = avatar.replaceAll(' ', '%20');
                        let typeOfAvatar = avatar.split('.').slice(-1);
                        let dirAvatar = functions.folderUploadImageAvatar(timeFile);
                        if (!fs.existsSync(dirAvatar)) {
                            fs.mkdirSync(dirAvatar, { recursive: true });
                        }
                        nameAva = 'ava_' + timeFile + '_' + idTimViec365 + '.' + typeOfAvatar;
                        const outputPath = `${dirAvatar}${nameAva}`;
                        await functions.downloadFile(avatar, outputPath);
                    }

                    //Lưu thông tin vào database
                    let dataUser = {
                        _id: getMaxUserID._id,
                        avatarUser: nameAva,
                        password: password,
                        userName: lastname,
                        phone: phone,
                        type: 0,
                        city: lg_tp,
                        district: lg_qh,
                        address: use_address,
                        fromWeb: 'timviec365',
                        fromDevice: 3,
                        idTimViec365: getMaxUserID._idTV365,
                        idRaoNhanh365: getMaxUserID._idRN365,
                        idQLC: getMaxUserID._idQLC,
                        chat365_secret: Buffer.from(getMaxUserID._id.toString()).toString('base64'),
                        createdAt: time,
                        updatedAt: time,
                        inForPerson: {
                            account: {
                                birthday: use_birth_day,
                                gender: use_gioi_tinh,
                                married: use_hon_nhan,
                            },
                            candidate: {
                                cv_city_id: String(cv_city_id).split(',').map(Number),
                                cv_cate_id: String(use_cate).split(',').map(Number),
                                cv_title: cv_title,
                                cv_exp: cv_exp,
                                cv_money_id: cv_money_id,
                                cv_muctieu: cv_muctieu,
                                cv_capbac_id: cv_capbac_id,
                                cv_loaihinh_id: cv_loaihinh_id,
                                cv_kynang: cv_kynang,
                                percents: 45,
                            },
                        },
                    };
                    if (account.includes('@')) {
                        dataUser.email = account;
                    } else {
                        dataUser.phoneTK = account;
                    }

                    //Ngoại ngữ

                    //Trường học
                    //Kinh Nghiệm
                    if (kinhhnghiem) {
                        dataUser.inForPerson.candidate.profileExperience = {
                            kn_id: 1,
                            kn_mota: kinhhnghiem,
                        };
                    }
                    let User = new Users(dataUser);
                    await User.save();

                    //Xử lý CV
                    let file = value[22];
                    if (value[21] != '') {
                        file = value[21];
                    }
                    let nameFile = '',
                        nameFileFull = '';
                    if (file != '') {
                        file = file.replaceAll(' ', '%20');
                        let typeOfFile = file.split('.').slice(-1);
                        let dirFile = functions.folderImageCV(timeFile);
                        if (!fs.existsSync(dirFile)) {
                            fs.mkdirSync(dirFile, { recursive: true });
                        }
                        nameFile = 'cv_' + timeFile + '_' + idTimViec365;
                        nameFileFull = nameFile + '.' + typeOfFile;
                        const outputPath = `${dirFile}/${nameFileFull}`;
                        const linkFileHide = `${process.env.PORT_QLC}/pictures/cv/${functions.convertDate(
                            timeFile,
                            true
                        )}/${nameFileFull}`;
                        functions.downloadFile(file, outputPath);
                        const getMaxIdProfile = await Profile.findOne({}, { hs_id: 1 })
                            .sort({ hs_id: -1 })
                            .limit(1)
                            .lean();
                        let dataProfile = {
                            hs_id: Number(getMaxIdProfile.hs_id) + 1,
                            hs_use_id: idTimViec365,
                            hs_name: nameFile,
                            hs_link: nameFileFull,
                            hs_link_hide: linkFileHide,
                            hs_create_time: timeFile,
                            hs_active: 1,
                        };
                        let profile = new Profile(dataProfile);
                        await profile.save();
                    }
                    //Bắn sang CRM
                    const link_multi = `${functions.siteName()}/ung-vien/${functions.renderAlias(
                        dataUser.userName
                    )}-uv${dataUser.idTimViec365}.html`;
                    await serviceCrm.sendataHr(
                        dataUser.userName,
                        dataUser.email,
                        dataUser.phone,
                        dataUser.idTimViec365,
                        link_multi,
                        dataUser._id
                    );
                    //Gửi sang AI

                    let dataSearchAI = {
                        use_id: dataUser.idTimViec365,
                        use_first_name: dataUser.userName,
                        use_create_time: dataUser.createdAt,
                        use_update_time: dataUser.updatedAt,
                        use_gioi_tinh: 0,
                        use_city: dataUser.city ? dataUser.city : 0,
                        use_quanhuyen: dataUser.district ? dataUser.district : 0,
                        use_address: dataUser.address,
                        cv_title: dataUser.inForPerson.candidate.cv_title,
                        cv_hocvan: 0,
                        cv_exp: dataUser.inForPerson.candidate.cv_exp ? dataUser.inForPerson.candidate.cv_exp : 0,
                        cv_muctieu: dataUser.inForPerson.candidate.cv_muctieu,
                        cv_cate_id: dataUser.inForPerson.candidate.cv_cate_id ?
                            dataUser.inForPerson.candidate.cv_cate_id.join(',') : '',
                        cv_city_id: dataUser.inForPerson.candidate.cv_city_id ?
                            dataUser.inForPerson.candidate.cv_city_id.join(',') : '',
                        cv_address: '',
                        cv_capbac_id: dataUser.inForPerson.candidate.cv_capbac_id ?
                            dataUser.inForPerson.candidate.cv_capbac_id : 0,
                        cv_money_id: dataUser.inForPerson.candidate.cv_money_id ?
                            dataUser.inForPerson.candidate.cv_money_id : 0,
                        cv_loaihinh_id: dataUser.inForPerson.candidate.cv_loaihinh_id ?
                            dataUser.inForPerson.candidate.cv_loaihinh_id : '',
                        cv_kynang: dataUser.inForPerson.candidate.cv_kynang,
                        use_show: 1,
                        dk: 3,
                        use_birth_day: dataUser.inForPerson.account.birthday ?
                            dataUser.inForPerson.account.birthday : 0,
                        um_max_value: 0,
                        um_min_value: 0,
                        um_unit: 0,
                        um_type: 0,
                        percents: 45,
                    };
                    let resAPI = await serviceDataAI.createDataSearchCandi(dataSearchAI);
                    // if (!resAPI.data.data) {
                    //     console.log(dataSearchAI);
                    //     console.log(resAPI.data);
                    // }
                    success++;
                } else {
                    if (checkUser.inForPerson.candidate) {
                        await Users.updateOne({ _id: checkUser._id }, {
                            $set: {
                                updatedAt: functions.getTimeNow(),
                                authentic: 1,
                                'inForPerson.candidate.use_show': 1,
                            },
                        });
                    }
                    let check = UserAddFail.findOne({
                        uf_email: account,
                        uf_time: { $gte: new Date(time_check * 1000) },
                    }).lean();
                    if (!check) {
                        let reason = 'Ứng viên có email hoặc số điện thoại không hợp lệ';
                        //Thêm vào base addFail
                        const getMaxIdAddFail = await UserAddFail.findOne({}, { uf_id: 1 })
                            .sort({ uf_id: -1 })
                            .limit(1)
                            .lean();
                        let dataAddFail = {
                            uf_id: Number(getMaxIdAddFail.uf_id) + 1,
                            uf_email: account,
                            uf_phone: value[2],
                            uf_reason: reason,
                            uf_time: new Date(),
                        };
                        let newAddFail = new UserAddFail(dataAddFail);
                        await newAddFail.save();
                    }
                    u++;
                }
            }
            return functions.success(res, 'Thành công', { u, c, success, total });
        }
        return functions.setError(res, 'Thiếu thông tin truyền lên');
    } catch (e) {
        console.log(e);
        return functions.setError(res, e);
    }
};

exports.activeUVUTS = async(req, res, next) => {
    try {
        let id_nhs = req.body.id_nhs;
        if (id_nhs) {
            let checkdata = await ApplyForJob.findOne({ nhs_id: id_nhs }, { nhs_xn_uts: 1 });
            if (checkdata) {
                if (checkdata.nhs_xn_uts == 1) {
                    await ApplyForJob.updateOne({ nhs_id: id_nhs }, { nhs_xn_uts: 0 });
                } else {
                    await ApplyForJob.updateOne({ nhs_id: id_nhs }, { nhs_xn_uts: 1 });
                }
            } else {
                return functions.success(res, 'Không tìm thấy hồ sơ ứng tuyển sai');
            }
            return functions.success(res, 'Cập nhập thành công');
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};
exports.deleteUVUTS = async(req, res, next) => {
    try {
        let id_nhs = req.body.id_nhs;
        if (id_nhs) {
            let checkdata = await ApplyForJob.findOne({ nhs_id: id_nhs, nhs_xn_uts: 1, check_ut: 1 }, { nhs_xn_uts: 1 });
            if (checkdata) {
                await ApplyForJob.deleteOne({ nhs_id: id_nhs, nhs_xn_uts: 1, check_ut: 1 });
            } else {
                return functions.success(res, 'Không tìm thấy hồ sơ ứng tuyển sai');
            }
            return functions.success(res, 'Xóa hồ sơ thành công');
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};
exports.removeUVCHTHS = async(req, res, next) => {
    try {
        let id_user = req.body.id_user;
        if (id_user) {
            let checkdata = await UserUnset.findOne({ id: id_user }, { use_delete: 1 });
            if (checkdata) {
                if (checkdata.use_delete == 1) {
                    await UserUnset.updateOne({ id: id_user }, { use_delete: 0 });
                } else {
                    await UserUnset.updateOne({ id: id_user }, { use_delete: 1 });
                }
            } else {
                return functions.success(res, 'Không tìm thấy hồ sơ ứng viên chưa hoàn thiện hồ sơ');
            }
            return functions.success(res, 'Cập nhập thành công');
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.sendUv_NTD = async(req, res) => {
    try {
        // console.log("Chuyên viên gửi ứng viên", req.body, new Date());
        const id_user = req.body.id_user; //idTimViec365
        const idNew = req.body.idNew; //id tin tuyển dụng
        const type = Number(req.body.type) || 0; //0 là chuyên viên gửi, 1 là tự ứng tuyển

        if (id_user == undefined || id_user == '' || idNew == undefined || idNew == '') {
            return functions.setError(res, 'Missingdata', 400);
        }

        const checkApplyForJob = await ApplyForJob.findOne({
            nhs_use_id: id_user,
            nhs_new_id: idNew,
        });
        if (!checkApplyForJob) {
            // const nhs_use_id = await Users.findOne({ idTimViec365: Number(id_user), type: { $ne: 1 } }).limit(1).select('idTimViec365').lean();
            // const nhs_new_id = await NewTV365.findOne({ new_id: Number(idNew) }).limit(1).select('new_id new_user_id').lean();

            let nhs_new_id = await NewTV365.aggregate([{
                    $match: { new_id: Number(idNew) },
                },
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'new_user_id',
                        foreignField: 'idTimViec365',
                        as: 'user',
                    },
                },
                { $unwind: '$user' },
                {
                    $match: {
                        'user.type': 1,
                    },
                },
                {
                    $project: {
                        new_id: 1,
                        new_title: 1,
                        usc_company: '$user.userName',
                        usc_email: '$user.email',
                        usc_chat_365: '$user._id',
                        chat365_secret: '$user.chat365_secret',
                        new_user_id: 1,
                    },
                },
            ]);

            const candidate = await Users.findOne({ idTimViec365: id_user, type: { $ne: 1 } }).select(
                'userName _id idTimViec365 inForPerson.candidate'
            );
            const now = functions.getTimeNow() + 7 * 60 + 15;

            if (nhs_new_id.length > 0 && candidate && candidate.idTimViec365) {
                if (type == 1) {
                    //Gửi email
                    if (nhs_new_id[0].usc_email) {
                        const email = nhs_new_id[0].usc_email;
                        const company = nhs_new_id[0].usc_company;
                        const tit = nhs_new_id[0].new_title;
                        const subject = `${candidate.userName} - Timviec365.vn đã ứng tuyển vào vị trí ${nhs_new_id[0].new_title}`;
                        const name_candi = candidate.userName;
                        const name_job = candidate.inForPerson.candidate.cv_title;
                        const cv_city_id = candidate.inForPerson.candidate.cv_city_id[0];
                        const city = City.findOne({ _id: cv_city_id }).select('name');
                        const city_candi = city.name;
                        const time = functions.timeElapsedString(candidate.updatedAt);
                        // const link_chat = functions.getLinkChat365(nhs_new_id[0].usc_chat_365, candidate._id, nhs_new_id[0].chat365_secret);
                        const link_chat = '';
                        const link_uv = `https://timviec365.vn/ung-vien/${functions.renderAlias(candidate.userName)}-uv${id_user}.html`;
                        await sendMail.Send_HS_NTD2(
                            email,
                            subject,
                            tit,
                            company,
                            name_candi,
                            name_job,
                            city_candi,
                            time,
                            link_chat,
                            link_uv
                        );
                    }

                    const link = `https://timviec365.vn/ung-vien/${functions.renderAlias(candidate.userName)}-uv${id_user}.html`;
                    const category = await CategoryJob.findOne({ cat_id: candidate.inForPerson.candidate.cv_cate_id[0] }, { cat_name: 1 });
                    const city = await City.findOne({ _id: candidate.inForPerson.candidate.cv_city_id[0] }, { name: 1 });
                    await serviceSendMess.NotificationTimviec365(
                        nhs_new_id[0].usc_chat_365,
                        candidate._id,
                        candidate.userName,
                        link,
                        city.name,
                        category.cat_name,
                        nhs_new_id[0].new_user_id
                    );
                } else {
                    const link = `https://timviec365.vn/ung-vien/${functions.renderAlias(candidate.userName)}-uv${id_user}.html`;
                    const category = await CategoryJob.findOne({ cat_id: candidate.inForPerson.candidate.cv_cate_id[0] }, { cat_name: 1 });
                    const city = await City.findOne({ _id: candidate.inForPerson.candidate.cv_city_id[0] }, { name: 1 });
                    await serviceSendMess.NotificationTimviec365(
                        nhs_new_id[0].usc_chat_365,
                        candidate._id,
                        candidate.userName,
                        link,
                        city.name,
                        category.cat_name,
                        nhs_new_id[0].new_user_id,
                        "Chuyên viên gửi ứng viên"
                    );
                }

                const MaxIDApplyForJob = await ApplyForJob.findOne({}).sort({ nhs_id: -1 }).select('nhs_id').lean();

                const applyForJob = {
                    nhs_id: MaxIDApplyForJob.nhs_id + 1,
                    nhs_use_id: candidate.idTimViec365,
                    nhs_new_id: nhs_new_id[0].new_id,
                    nhs_com_id: nhs_new_id[0].new_user_id,
                    nhs_time: now,
                    nhs_kq: type == 0 ? 10 : 0,
                };
                await new ApplyForJob(applyForJob).save();

                // Thêm vào thông báo tại quả chuông
                let not_id = 1;
                const itemMaxNoti = await Notification.findOne({}, { not_id: 1 }).sort({ not_id: -1 }).limit(1).lean();
                if (itemMaxNoti) {
                    not_id = Number(itemMaxNoti.not_id) + 1
                };
                await new Notification({
                    not_id: not_id,
                    usc_id: nhs_new_id[0].new_user_id,
                    not_time: now,
                    new_id: nhs_new_id[0].new_id,
                    use_id: candidate.idTimViec365,
                    not_active: type,
                }).save();

                return functions.success(res, 'Gửi thành công', {
                    MaxIDApplyForJob,
                    applyForJob,
                    nhs_new_id,
                });
            } else {
                return functions.setError(res, 'Không tìm thấy ứng viên và tin tuyển dụng', 400);
            }
        } else {
            return functions.setError(res, 'Ứng viên đã ứng tuyển tin tuyển dụng');
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
};

//ứng viên đăng nhập
exports.loginAdminUV = async(req, res) => {
    try {
        let id_admin = req.user.data.adm_id;
        if (id_admin) {
            let use_id = req.body.use_id;
            if (use_id) {
                findUser = await functions.getDatafindOne(Users, { idTimViec365: use_id, type: 0 });
                if (findUser) {
                    const token = await functions.createToken({
                            _id: findUser._id,
                            idTimViec365: findUser.idTimViec365,
                            idQLC: findUser.idQLC,
                            idRaoNhanh365: findUser.idRaoNhanh365,
                            email: findUser.email,
                            phoneTK: findUser.phoneTK,
                            createdAt: findUser.createdAt,
                            type: 0,
                        },
                        '1d'
                    );
                    const refreshToken = await functions.createToken({ userId: findUser._id, createTime: functions.getTimeNow() },
                        '1d'
                    );
                    // Cập nhật thời gian login
                    const dateNowInt = functions.getTimeNow();
                    await Users.updateOne({ _id: findUser._id }, {
                        $set: {
                            time_login: dateNowInt,
                            isOnline: 1,
                            updatedAt: dateNowInt,
                        },
                    });
                    let user_infor = {
                        use_id: findUser.idTimViec365,
                        chat365_id: findUser._id,
                        use_email: findUser.email,
                        use_first_name: findUser.userName,
                        use_pass: findUser.password,
                        use_update_time: findUser.updatedAt,
                        use_logo: findUser.avatarUser,
                        use_phone: findUser.phone,
                        use_city: findUser.city,
                        use_quanhuyen: findUser.district,
                        use_address: findUser.address,
                        use_authentic: findUser.authentic,
                    };
                    if (findUser.inForPerson != null) {
                        if (findUser.inForPerson.account) {
                            user_infor = {
                                use_gioi_tinh: findUser.inForPerson.account.gender,
                                use_birth_day: findUser.inForPerson.account.birthday,
                                use_hon_nhan: findUser.inForPerson.account.married,
                                ...user_infor,
                            };
                        }
                        if (findUser.inForPerson.candidate) {
                            user_infor = {
                                use_view: findUser.inForPerson.candidate.use_view,
                                cv_title: findUser.inForPerson.candidate.cv_title,
                                percents: findUser.inForPerson.candidate.percents,
                                ...user_infor,
                            };
                        }
                    }
                    return functions.success(res, 'Đăng nhập thành công', {
                        access_token: token,
                        refreshToken: refreshToken,
                        user_infor: user_infor,
                    });
                }
                return functions.setError(res, 'Không tìm thấy người dùng');
            }
            return functions.setError(res, 'Bạn chưa truyền use_id');
        }
        return functions.setError(res, 'Bạn không có quyền thực hiện chức năng đăng nhập');
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.deleteCrm = async(req, res) => {
    try {
        const { id_cus_from, cus_from } = req.body;
        if (id_cus_from && cus_from) {
            const customer = await Customer.findOne({ id_cus_from, cus_from });
            if (customer) {
                await Customer.deleteOne({ cus_id: customer.cus_id });
                return functions.success(res, 'Thành công');
            }
            return functions.setError(res, 'Ứng viên không tồn tại hoặc đã bị xóa');
        }
        return functions.setError(res, 'Bạn chưa truyền id_cus_from && cus_from');
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.listExcellGoogle = async(req, res) => {
    try {
        let timeFrom = Number(req.body.timeFrom),
            timeEnd = Number(req.body.timeEnd);
        let matchTime = {};
        if (timeFrom) {
            matchTime.$gte = timeFrom;
        }
        if (timeEnd) {
            matchTime.$lte = timeEnd;
        }
        let match = {
            idTimViec365: { $ne: 0 },
            createdAt: matchTime,
            phoneTK: { $nin: ['', null] },
            type: { $ne: 1 },
        };
        let list = await Users.aggregate([{
                $match: match,
            },
            {
                $project: {
                    phoneTK: 1,
                },
            },
        ]);
        return functions.success(res, 'Thành công', list);
    } catch (e) {
        console.log(e);
        return functions.setError(res, error.message);
    }
};

// đổi mật khẩu ứng viên

exports.changePassUvAdm = async(req, res) => {
    try {
        let iduv = req.body.id_user;
        let passNew = req.body.passNew;
        if (iduv) {
            let data = await Users.findOne({ idTimViec365: iduv, type: 0 });
            if (data) {
                let updatepass = await Users.updateOne({ idTimViec365: iduv, type: 0 }, { $set: { password: passNew } });
            }
            return functions.success(res, 'Đổi mật khẩu ứng viên thành công');
        }
        return functions.setError(res, 'Thiếu dữ liệu truyền lên');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// lay ra danh sách ứng viên ứng tuyển theo tin đăng
exports.listUVUTNews = async(req, res) => {
    try {
        let page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 30,
            skip = (page - 1) * pageSize;
        let new_id = req.body.new_id;
        if (new_id) {
            var data = await ApplyForJob.aggregate([{
                    $match: {
                        nhs_new_id: Number(new_id),
                        nhs_kq: { $in: [0, 2, 13] },
                    },
                },
                { $sort: { nhs_new_id: -1 } },
                { $skip: skip },
                { $limit: pageSize },
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'nhs_use_id',
                        foreignField: 'idTimViec365',
                        as: 'user',
                    },
                },
                {
                    $unwind: {
                        path: '$user',
                    },
                },
                {
                    $match: {
                        'user.type': 0,
                    },
                },
                {
                    $project: {
                        nhs_id: 1,
                        use_id: '$user.idTimViec365',
                        use_first_name: '$user.userName',
                        nhs_time: 1,
                        use_phone: '$user.phone',
                        use_email_lh: '$user.emailContact',
                        use_email: '$user.email',
                        use_address: '$user.address',
                    },
                },
            ]);
            return functions.success(res, 'Danh sách ứng viên ứng tuyển theo new_id', { data });
        }
        return functions.setError(res, 'Vui lòng nhập new_id');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
};

//Xóa nộp hồ sơ
exports.deleteNhs = async(req, res) => {
    try {
        let nhs_id = req.body.nhs_id;
        console.log(nhs_id);
        if (nhs_id) {
            await ApplyForJob.deleteOne({ nhs_id });
            return functions.success(res, 'Thành công', { nhs_id });
        }
        return functions.setError(res, 'Thiếu thông tin truyền lên');
    } catch (e) {
        return functions.setError(res, 'Đã có lỗi xảy ra');
    }
}

// lay ra danh sách cv đã tạo
exports.listCVSaved = async(req, res) => {
    try {
        let page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 30,
            skip = (page - 1) * pageSize;
        let userId = req.body.userId;
        if (userId) {
            let user = await Users.findOne({ idTimViec365: userId, type: { $ne: 1 } }).lean();
            var data = await SaveCvCandi.aggregate([{
                    $match: {
                        uid: Number(userId),
                    },
                },
                { $sort: { time_edit: -1 } },
                { $skip: skip },
                { $limit: pageSize },
                {
                    $project: {
                        id: 1,
                        uid: 1,
                        cvid: 1,
                        name_img: 1,
                    },
                },
            ]);

            for (let i in data) {
                const linkImg = `${process.env.PORT_QLC}pictures/cv/${functions.convertDate(user.createdAt,true)}/${data[i].name_img}.png`;
                data[i].name_img = linkImg;
            }

            let totalCount = await SaveCvCandi.aggregate([{
                    $match: {
                        uid: Number(userId),
                    },
                },
                { $sort: { time_edit: -1 } },
                { $skip: skip },
                { $limit: pageSize },
                {
                    $project: {
                        id: 1,
                        uid: 1,
                        cvid: 1,
                        name_img: 1,
                    },
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    },
                },
            ]);
            // console.log(totalCount);
            const count = totalCount[0] ? totalCount[0].count : 0;
            return functions.success(res, 'Danh sách cv', { data, count });
        }
        return functions.setError(res, 'Thiếu thông tin truyền lên');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
};

exports.scanErrCv = async(req, res) => {
    try {
        let timeNow = new Date().getTime();
        let date = new Date(timeNow - 86400000);
        let timeStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 1);
        let timeEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        timeStart = Math.floor(timeStart.getTime() / 1000);
        timeEnd = Math.floor(timeEnd.getTime() / 1000);
        console.log('start:', timeStart);
        console.log('end:', timeEnd);
        //Lấy danh sách UV đăng ký
        let listUV = await Users.find({ createdAt: { $gte: timeStart, $lte: timeEnd }, type: { $ne: 1 }, "inForPerson.candidate.percents": { $gte: 45 }, fromDevice: 0 });
        console.log(listUV.length);
        let listIdCandi = [];
        for (let i in listUV) {
            listIdCandi.push(listUV[i].idTimViec365);
        }

        //Lấy danh sách UV tạo CV
        let listCvCandi = await SaveCvCandi.find({ uid: { $in: listIdCandi }, cv: 1 });

        let listCvUpload = await Profile.find({ hs_use_id: { $in: listIdCandi } });

        let listCvErr = [];
        for (let i in listUV) {
            let checkCvSave = 0; //0:không tồn tại, 1:có CV, 2: có CV lỗi ảnh;
            let checkFileUpload = 0; //0:không tồn tại, 1:có CV, 2: Lỗi che CV,3: Không tồn tại file tải lên;
            let user = listUV[i];
            let checkCvCandi = listCvCandi.find((e) => e.uid == user.idTimViec365);
            if (checkCvCandi) {
                let img_hide = checkCvCandi.name_img_hide ? checkCvCandi.name_img_hide : checkCvCandi.name_img + '_h';
                let checkImageCv = functions.checkImageCv(user.createdAt, img_hide);
                if (checkImageCv) {
                    checkCvSave = 1;
                } else {
                    console.log(functions.imageCv(user.createdAt, img_hide));
                    checkCvSave = 2;

                }
            }
            let checkCvUpload = listCvUpload.find((e) => e.hs_use_id == user.idTimViec365);
            if (checkCvUpload) {
                if (!checkCvUpload.hs_link_hide || checkCvUpload.is_scan == 0) {
                    let checkFile = functions.checkCvUpload(user.createdAt, hs_link);
                    if (checkFile) {
                        checkFileUpload = 2;
                    } else {
                        checkFileUpload = 3;
                    }
                } else {
                    checkFileUpload = 1;
                }
            }
            let errMessage = '';

            if (checkCvSave == 0 && checkFileUpload == 0) {
                errMessage = "no cv";

            } else {
                let message = '';
                if (checkCvSave == 2) {
                    message = "error created cv";
                } else if (checkFileUpload == 2) {
                    message = "error hidden cv";
                } else if (checkFileUpload == 3) {
                    message = "error file upload";
                }
                if (errMessage) {
                    errMessage += `, ${message}`;
                } else {
                    errMessage += message;
                }
            }
            if (errMessage) {
                const link_uv = `https://timviec365.vn/ung-vien/${functions.renderAlias(user.userName)}-uv${user.idTimViec365}.html`;
                listCvErr.push({ link: link_uv, errMessage });
            }
        }
        return functions.success(res, 'Danh sách cv lỗi', { listCvErr });

    } catch (e) {
        console.log("Lỗi quét cv lỗi hằng ngày: ", e);
        return functions.setError(res, e.message);
    }
}