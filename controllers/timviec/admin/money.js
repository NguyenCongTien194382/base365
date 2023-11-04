const { recordCreditsHistory } = require("../credits");
const Users = require('../../../models/Users');
const AdminUser = require('../../../models/Timviec365/Admin/AdminUser');
const PointCompany = require("../../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany");
const PointUsed = require("../../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointUsed");
const creditHistory = require("../../../models/Timviec365/UserOnSite/Company/ManageCredits/CreditsHistory");
const functions = require("../../../services/functions");

exports.listCom = async(req, res, next) => {
    try {
        const request = req.body;
        let comId = Number(request.comId),
            account = request.account,
            comName = request.comName,
            page = Number(request.page) || 1,
            pageSize = Number(request.pageSize) || 30,
            skip = (page - 1) * pageSize,
            searchConditions = {},
            data = '',
            count = 0;
        if (!account && !comName) {
            searchConditions.money_usc = { $exists: true, $gt: 0 };
            searchConditions.usc_id = { $ne: 0 };
            if (comId) searchConditions.usc_id = comId;
            data = await PointCompany.aggregate([{
                    $match: searchConditions,
                },
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'usc_id',
                        foreignField: 'idTimViec365',
                        as: 'user',
                    }
                },
                {
                    $unwind: '$user',
                },
                { $skip: skip },
                { $limit: pageSize },
                {
                    $sort: {
                        'user.idTimViec365': -1,
                    },
                },
                {
                    $project: {
                        money: '$money_usc',
                        comId: '$usc_id',
                        comName: '$user.userName',
                        email: '$user.email',
                        phoneTK: '$user.phoneTK',
                    },
                },
            ])

            if (comId && data == '') {
                count = 0;
            } else if (comId && data != '') {
                count = 1;
            } else {
                count = await PointCompany.countDocuments(searchConditions);
            }
        } else {
            searchConditions = { type: 1, idTimViec365: { $ne: 0 } };
            if (account) {
                searchConditions.$or = [
                    { email: { $regex: account, $options: 'i' } },
                    { phoneTK: account }
                ];
            }
            if (comId) { searchConditions.idTimViec365 = comId; };
            if (comName) { searchConditions.userName = { $regex: comName, $options: 'i' }; };

            data = await Users.aggregate([{
                    $match: searchConditions,
                },
                {
                    $lookup: {
                        from: 'Tv365PointCompany',
                        localField: 'idTimViec365',
                        foreignField: 'usc_id',
                        as: 'money_info',
                    }
                },
                {
                    $unwind: {
                        path: "$money_info",
                    }
                },
                { $skip: skip },
                { $limit: pageSize },
                { $sort: { idTimViec365: -1 } },
                {
                    $match: {
                        'money_info.money_usc': { $gt: 0, $exists: true },
                    },
                },
                {
                    $project: {
                        money: '$money_info.money_usc',
                        comId: '$idTimViec365',
                        comName: '$userName',
                        email: '$email',
                        phoneTK: '$phoneTK',
                    },
                },

            ]);
            if (data != '') {
                count = data.length;
            }
        }
        return functions.success(res, "Danh sách công ty", { data, count });
    } catch (e) {
        functions.setError(res, e.message);
    }
}

exports.listPlusMoney = async(req, res, next) => {
    try {
        const request = req.body;
        let comId = Number(request.comId),
            timeStart = Number(request.timeStart),
            timeEnd = Number(request.timeEnd),
            page = Number(request.page) || 1,
            pageSize = Number(request.pageSize) || 30;

        const skip = (page - 1) * pageSize;

        let searchConditions = [
            { type: 1 },
            { action: 0 },
            { admin_id: { $exists: true, $ne: null, $gt: 0 } },
            { usc_id: { $ne: 0 } }
        ];
        if (comId) {
            searchConditions.push({
                usc_id: comId
            })
        }
        if (timeStart) {
            searchConditions.push({
                used_day: { $gte: timeStart }
            })
        };
        if (timeEnd) {
            searchConditions.push({
                used_day: { $lte: timeEnd }
            })
        };

        const data = await creditHistory.aggregate([{
                $match: { $and: searchConditions },
            },
            {
                $lookup: {
                    from: 'AdminUser',
                    localField: 'admin_id',
                    foreignField: 'adm_bophan',
                    as: 'admin',
                }
            },
            {
                $unwind: {
                    path: "$admin",
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'usc_id',
                    foreignField: 'idTimViec365',
                    as: 'user',
                }
            },
            {
                $unwind: {
                    path: "$user",
                },
            },
            { $skip: skip },
            { $limit: pageSize },
            { $sort: { _id: -1 } },
            {
                $project: {
                    money: '$amount',
                    date: '$used_day',
                    adminName: '$admin.adm_name',
                    comId: '$user.idTimViec365',
                    comName: '$user.userName',
                },
            }
        ]);
        const count = await creditHistory.countDocuments(searchConditions);
        return functions.success(res, "Lịch sử cộng tiền", { data, count });
    } catch (e) {
        functions.setError(res, e.message);
    }
}

exports.listUseMoney = async(req, res, next) => {
    try {
        const request = req.body;
        let comEmail = request.comEmail,
            comPhone = request.comPhone,
            comId = Number(request.comId),
            page = Number(request.page) || 1,
            pageSize = Number(request.pageSize) || 30;

        const skip = (page - 1) * pageSize;

        let data = '',
            count = 0;

        if (!comEmail && !comPhone) {
            let searchCondition = { usc_id: { $ne: 0 } }
            if (comId) {
                searchCondition.usc_id = comId;
            }
            data = await creditHistory.aggregate([{
                    $match: searchCondition,
                },
                {
                    $group: {
                        _id: "$usc_id",
                        totalMoneyPlus: {
                            $sum: { $cond: [{ $eq: ["$type", 1] }, "$amount", 0] }
                        },
                        totalMoneyMinus: {
                            $sum: { $cond: [{ $eq: ["$type", 0] }, "$amount", 0] }
                        }
                    }
                },
                { $skip: skip },
                { $limit: pageSize },
                {
                    $lookup: {
                        from: 'Users',
                        localField: '_id',
                        foreignField: 'idTimViec365',
                        as: 'user',
                    }
                },
                {
                    $unwind: {
                        path: "$user",
                    },
                },
                {
                    $sort: {
                        'user.idTimViec365': -1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        user_id: "$user.idTimViec365",
                        user_name: "$user.userName",
                        email: "$user.email",
                        phone: "$user.phoneTK",
                        totalMoneyPlus: 1,
                        totalMoneyMinus: 1,
                    }
                },
            ]);
            if (comId && data == '') {
                count = 0;
            } else if (comId && data != '') {
                count = 1;
            } else {
                const uscIdsFromCreditsHistory = await creditHistory.distinct('usc_id', { usc_id: { $ne: 0 } });
                count = uscIdsFromCreditsHistory.length;
            }
            return functions.success(res, "Lịch sử cộng tiền", { data, count });
        } else {
            let searchConditions = [];
            if (comId) {
                searchConditions.push({
                    idTimViec365: comId
                })
            }
            if (comEmail) {
                searchConditions.push({
                    $or: [
                        { email: comEmail },
                        { emailContact: comEmail }
                    ]
                })
            };
            if (comPhone) {
                searchConditions.push({
                    $or: [
                        { phone: comPhone },
                        { phoneTK: comPhone }
                    ]
                })
            };

            let match = {};
            if (searchConditions.length > 0) {
                match.$and = searchConditions
            }

            let getIdCom = await Users.find(match).select("idTimViec365 userName email phoneTK");
            if (getIdCom != '') {
                data = await creditHistory.aggregate([{
                        $match: { usc_id: getIdCom[0].idTimViec365 },
                    },
                    {
                        $group: {
                            _id: "$usc_id",
                            totalMoneyPlus: {
                                $sum: { $cond: [{ $eq: ["$type", 1] }, "$amount", 0] }
                            },
                            totalMoneyMinus: {
                                $sum: { $cond: [{ $eq: ["$type", 0] }, "$amount", 0] }
                            }
                        }
                    },
                    { $skip: skip },
                    { $limit: pageSize },
                    {
                        $project: {
                            _id: 0,
                            user_id: getIdCom[0].idTimViec365,
                            user_name: getIdCom[0].userName,
                            email: getIdCom[0].email,
                            phone: getIdCom[0].phoneTK,
                            totalMoneyPlus: 1,
                            totalMoneyMinus: 1,
                        }
                    },
                ]);
                count = 1;
                return functions.success(res, "Lịch sử cộng tiền", { data, count });
            } else {
                return functions.success(res, "Lịch sử cộng tiền", { data, count });
            }
        }
    } catch (e) {
        functions.setError(res, e.message);
    }
}

exports.detailPlusMoney = async(req, res, next) => {
    try {
        const request = req.body;
        let userId = Number(request.userId),
            type = Number(request.type),
            idContent = Number(request.idContent),
            page = Number(request.page) || 1,
            pageSize = Number(request.pageSize) || 30;
        const skip = (page - 1) * pageSize;

        if (userId && (0 <= type <= 1)) {
            if (type == 1) {
                let data = await creditHistory.aggregate([{
                        $match: {
                            usc_id: userId,
                            admin_id: { $exists: true, $ne: null, $gt: 0 },
                            type: 1
                        }
                    },
                    {
                        $lookup: {
                            from: 'AdminUser',
                            localField: 'admin_id',
                            foreignField: 'adm_bophan',
                            as: 'admin',
                        }
                    },
                    {
                        $unwind: {
                            path: "$admin",
                        },
                    },
                    { $sort: { used_day: -1 } },
                    { $skip: skip },
                    { $limit: pageSize },
                    {
                        $project: {
                            admin_name: "$admin.adm_name",
                            money: "$amount",
                            time: "$used_day",
                            action: '$action'
                        }
                    },
                ])
                const count = await creditHistory.countDocuments({
                    type: 1,
                    admin_id: { $exists: true, $ne: null, $gt: 0 },
                    usc_id: userId
                });

                return functions.success(res, "Lịch sử cộng tiền", { data, count });
            } else {
                let searchConditions = {
                    usc_id: userId,
                    type: 0
                }
                if (idContent) { searchConditions.content_id = idContent };
                let data = await creditHistory
                    .find(searchConditions)
                    .sort({ used_day: -1 })
                    .skip(skip)
                    .limit(pageSize);
                let count = await creditHistory.find(searchConditions).count();
                return functions.success(res, "Thành công!", { data, count });
            }
        } else {
            return functions.setError(res, 'Thiếu thông tin truyền lên');
        }
    } catch (e) {
        return functions.setError(res, e)
    }
}

exports.refundMoney = async(req, res, next) => {
    try {
        const request = req.body;
        let userId = Number(request.userId),
            idCreditHistory = Number(request.idCreditHistory);
        let idAdmin = req.user.data._id;
        let checkAdmin = await functions.getDatafindOne(AdminUser, { _id: idAdmin });
        if (checkAdmin) {
            if (userId && idCreditHistory) {
                let info = await creditHistory.findOne({ _id: idCreditHistory });
                if (info) {
                    // update history refund
                    await creditHistory.updateOne({ _id: idCreditHistory }, { $set: { refund: 1 } });
                    let _id = 0;
                    let latestHistory = await creditHistory.findOne({}).sort({ _id: -1 });
                    if (latestHistory) _id = latestHistory._id + 1;
                    let moneyUsc = await PointCompany.findOne({ usc_id: userId });
                    let info_uv = await Users.findOne({ idTimViec365: info.content_id }).select("userName");
                    if (moneyUsc) {
                        let balance = moneyUsc.money_usc + info.amount;
                        let data = {
                                _id: _id,
                                usc_id: info.usc_id,
                                amount: info.amount,
                                type: 1,
                                used_day: functions.getTimeNow(),
                                content: info_uv.userName,
                                balance: balance,
                                action: 9,
                                content_id: info.content_id,
                                admin_id: checkAdmin.adm_id
                            }
                            // update money user
                        await PointCompany.updateOne({ usc_id: userId }, { $set: { money_usc: balance } });
                        // create history refund
                        await creditHistory.create(data);
                        // delete record view uv
                        await PointUsed.deleteOne({
                            usc_id: userId,
                            use_id: info.content_id
                        });
                        return functions.success(res, 'Hoàn tiền thành công')
                    }
                    return functions.setError(res, 'Đã có lỗi xảy ra');
                } else {
                    return functions.setError(res, 'Đã có lỗi xảy ra');
                }
            } else {
                return functions.setError(res, 'Thiếu thông tin truyền lên');
            }
        } else {
            return functions.setError(res, 'Bạn không có quyền thực hiện hành động này!', 403)
        }

    } catch (e) {
        return functions.setError(res, e);
    }
}