const Conversation = require('../../../models/chat365/Conversation')
const HistoryLogin = require("../../../models/Timviec365/UserOnSite/ManageHistory/HistoryLogin")
const HistoryPointPromotion = require("../../../models/Timviec365/UserOnSite/ManageHistory/HistoryPointPromotion")
const ManagerPointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory")
const SaveAccountVip = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveAccountVip")
const SaveExchangePoint = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveExchangePoint")
const SaveExchangePointBuy = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveExchangePointBuy")
const SaveExchangePointMoney = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveExchangePointMoney")
const SaveExchangePointOrder = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveExchangePointOrder")
const SaveNextPage = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveNextPage")
const SaveSeeNewByEm = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveSeeNewByEm")
const SaveSeeNewRequest = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveSeeNewRequest")
const SaveSeeRequest = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveSeeRequest")
const SaveShareSocialNew = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveShareSocialNew")
const SaveShareSocialUser = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveShareSocialUser")
const SaveVote = require("../../../models/Timviec365/SaveVote")
const SaveSeeUserNewByEm = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveSeeUserNewByEm");
const SaveVoteCandidate = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveVoteCandidate")
const NewTV365 = require("../../../models/Timviec365/UserOnSite/Company/New")
const PointUsed = require("../../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointUsed")
const CommentPost = require("../../../models/Timviec365/UserOnSite/CommentPost")
const SaveCvCandi = require('../../../models/Timviec365/UserOnSite/Candicate/SaveCvCandi')
const ApplyForJob = require('../../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');

const { saveHistory, userExists, getMaxID } = require("./utils");

const sanitizeHtml = require('sanitize-html');

const functions = require("../../../services/functions")
const Users = require("../../../models/Users")

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

const reformatShareData = (list) => {
    if (!list) return [];
    list = [...list];
    let shareObject = {
        chat365: 0,
        facebook: 0,
        twitter: 0,
        vkontakte: 0,
        linkedin: 0,
    }
    list.forEach(sharedNew => {
        let shares = {...shareObject };
        if (sharedNew.shares && sharedNew.shares.length) {
            sharedNew.shares.forEach(share => {
                shares[share.socialName] = share.count;
            })
        }
        sharedNew.shares = shares;
    })
    return list;
}

const getOnsiteHistory = async(userId, type, skip = 0, limit = 5, dateFrom = null, dateTo = null) => {
    try {
        const now = functions.getTimeNow()
        limit = Number(limit);
        skip = Number(skip);
        // dateFrom = dateFrom?new Date(Number(dateFrom)).getTime(): 0;
        // dateTo = (dateTo ? new Date(Number(dateTo)).getTime() : Number(new Date().getTime()/1000)) + ONE_DAY_IN_SECONDS;
        dateFrom = dateFrom ? Number(new Date(dateFrom).getTime() / 1000) - 25199 : 0;
        dateTo = dateTo ? Number(new Date(dateTo).getTime() / 1000) + 61199 : Number(new Date().getTime() / 1000) + ONE_DAY_IN_SECONDS;
        //console.time("getOnsiteHistory");
        let list = await HistoryLogin.find({
            userId,
            type,
            timeLogin: { $gte: dateFrom, $lte: dateTo },
        }).sort({ id: -1 }).skip(skip).limit(limit);

        let totalAggregate = await HistoryLogin.aggregate([{
                $match: {
                    userId: userId,
                    type: type,
                    // timeLogout: {$ne: 0},
                    timeLogin: { $gte: dateFrom, $lte: dateTo },
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $subtract: [{
                                    $cond: {
                                        if: {
                                            $or: [
                                                { $eq: ["$timeLogout", 0] },
                                                { $eq: ["$timeLogout", null] }
                                            ]
                                        },
                                        then: now,
                                        else: "$timeLogout",
                                    },
                                },
                                "$timeLogin",
                            ],
                        }
                    },
                    count: { $sum: 1 }
                }
            }
        ])
        let total = (totalAggregate[0] ? totalAggregate[0].total : 0);
        let count = (totalAggregate[0] ? totalAggregate[0].count : 0);
        //console.timeEnd("getOnsiteHistory");
        return { list: list ? list : [], total: total ? total : 0, count: count ? count : 0 }
    } catch (error) {
        return null;
    }
}

const getCandidateSeen = async(userId, type, skip = 0, limit = 5, dateFrom = null, dateTo = null) => {
    try {
        limit = Number(limit);
        skip = Number(skip);
        //console.time("getCandidateSeen");
        dateFrom = dateFrom ? Number(new Date(dateFrom).getTime() / 1000) - 25199 : 0;
        dateTo = dateTo ? Number(new Date(dateTo).getTime() / 1000) + 61199 : Number(new Date().getTime() / 1000) + ONE_DAY_IN_SECONDS;
        let aggrData = await SaveSeeUserNewByEm.aggregate([{
                $match: {
                    userId: userId,
                    type: type,
                    id_be_seen: { $gt: 0 },
                    start: { $gte: dateFrom, $lte: dateTo }
                }
            },
            {
                $sort: {
                    start: -1
                }
            },
            {
                $lookup: {
                    from: "Users",
                    // localField: "id_be_seen",
                    // foreignField: "idTimViec365",
                    let: { idTimViec365: '$id_be_seen' },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$idTimViec365', '$$idTimViec365'] },
                                    { $ne: ['$type', 1] }
                                ]
                            }
                        }
                    }],
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $facet: {
                    counter: [{ $count: "count" }],
                    list: [{
                            $skip: skip
                        },
                        {
                            $limit: limit
                        },
                        {
                            $project: {
                                "id": "$id",
                                "userId": "$userId",
                                "type": "$type",
                                "userIdBeSeen": "$id_be_seen",
                                "typeIdBeSeen": "$type_be_seen",
                                "time": "$start",
                                "cv_cate_id": "$user.inForPerson.candidate.cv_cate_id",
                                "use_city": "$user.city",
                                "first_name": "$user.userName",
                                "use_id": "$user.idTimViec365",
                            }
                        }
                    ]
                }
            }
        ]);
        let list = 0;
        let total = 0;
        if (aggrData[0] && aggrData[0].counter[0]) {
            list = aggrData[0].list;
            total = aggrData[0].counter[0].count;
        }



        //console.timeEnd("getCandidateSeen");
        return { list: list ? list : [], total: total ? total : 0 };
    } catch (error) {
        return null;
    }
}

const getPointSeenUv = async(
    userId,
    type,
    skip = 0,
    limit = 5,
    dateFrom = null,
    dateTo = null
) => {
    try {
        limit = Number(limit);
        skip = Number(skip);
        dateFrom = dateFrom ? Number(new Date(dateFrom).getTime() / 1000) - 25199 : 0;
        dateTo =
            (dateTo ?
                Number(new Date(dateTo).getTime() / 1000) + 61199 :
                Number(new Date().getTime() / 1000)) + ONE_DAY_IN_SECONDS;
        //console.time("getPointSeenUv");
        let total = await PointUsed.find({
            usc_id: userId,
            use_id: { $ne: 0 },
            $and: [{
                used_day: { $gte: dateFrom, $lte: dateTo },
            }, {
                used_day: { $gt: 1687315166 },
            }]
        }).count();
        let aggrData = await SaveExchangePointBuy.aggregate([{
                $match: {
                    userId: userId,
                    type: 1,
                    time: { $gte: dateFrom, $lte: dateTo },
                },
            },
            {
                $facet: {
                    counter: [{ $count: 'count' }],
                    list: [
                        { $sort: { time: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                    ],
                },
            },
        ]);
        let list = [];
        let listTotal = 0;
        if (aggrData[0] && aggrData[0].counter[0]) {
            list = aggrData[0].list;
            listTotal = aggrData[0].counter[0].count;
        }
        // //console.timeEnd("getPointSeenUv");
        return {
            total: total ? total : 0,
            list: list ? list : [],
            listTotal: listTotal ? listTotal : 0,
        };
    } catch (error) {
        console.log('getTotalPointSeenUv', error);
        return null;
    }
};

const getListNewShare = async(userId, type, skip = 0, limit = 5, dateFrom = null, dateTo = null) => {
    try {
        limit = Number(limit);
        skip = Number(skip);
        //console.time("getListNewShare");
        let aggrData = await SaveShareSocialNew.aggregate([{
                $match: {
                    userId,
                    userType: type,
                    newId: { $gt: 0 }
                }
            },
            {
                $lookup: {
                    from: "NewTV365",
                    localField: "newId",
                    foreignField: "new_id",
                    as: "newTV365"
                }
            },
            {
                $unwind: "$newTV365"
            },
            {
                $facet: {
                    counter: [{ $count: "count" }],
                    listTotal: [{
                            $group: {
                                _id: {
                                    newId: "$newId",
                                    socialName: "$socialName"
                                },
                            }
                        },
                        {
                            $group: {
                                _id: "$_id.newId"
                            }
                        },
                        {
                            $count: "count"
                        }
                    ],
                    list: [{
                            $project: {
                                newId: "$newId",
                                time: "$time",
                                socialName: "$socialName",
                                new_id: "$newTV365.new_id",
                                new_title: "$newTV365.new_title",
                                new_alias: "$newTV365.new_alias",
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    newId: "$newId",
                                    socialName: "$socialName"
                                },
                                count: { $sum: 1 },
                                time: { $max: "$time" },
                                new_id: { $first: "$new_id" },
                                new_title: { $first: "$new_title" },
                                new_alias: { $first: "$new_alias" },
                            }
                        },
                        {
                            $group: {
                                _id: "$_id.newId",
                                shares: {
                                    $push: {
                                        socialName: "$_id.socialName",
                                        count: "$count"
                                    }
                                },
                                time: { $max: "$time" },
                                new_id: { $first: "$new_id" },
                                new_title: { $first: "$new_title" },
                                new_alias: { $first: "$new_alias" },
                            }
                        },
                        {
                            $sort: { time: -1 }
                        },
                        {
                            $skip: skip
                        },
                        {
                            $limit: limit
                        },
                    ]
                }
            },
        ]);
        let list = [];
        let total = 0;
        let listTotal = 0;
        if (aggrData[0] && aggrData[0].counter.length && aggrData[0].listTotal.length) {
            total = aggrData[0].counter[0].count;
            listTotal = aggrData[0].listTotal[0].count;
            list = aggrData[0].list
        }
        //console.timeEnd("getListNewShare");
        list = reformatShareData(list);
        return { total: total ? total : 0, list: list ? list : [], listTotal: listTotal ? listTotal : 0 }
    } catch (error) {
        return null;
    }
}

const getListUserShare = async(userId, type, skip = 0, limit = 5, dateFrom = null, dateTo = null) => {
    try {
        limit = Number(limit);
        skip = Number(skip);
        //console.time("getListUserShare");
        let aggrData = await SaveShareSocialUser.aggregate([{
                $match: {
                    userId,
                    userType: type,
                    userIdBeShare: { $gt: 0 }
                }
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "userIdBeShare",
                    foreignField: "idTimViec365",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $match: {
                    // $expr: {$eq: ["$user.type", "$typeIdBeShare"]}
                    $expr: { $in: ["$user.type", [0, 2]] }
                }
            },
            {
                $facet: {
                    counter: [{ $count: "count" }],
                    listTotal: [{
                            $project: {
                                socialName: "$socialName",
                                use_id: "$user.idTimViec365",
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    use_id: "$use_id",
                                    socialName: "$socialName"
                                },
                            }
                        },
                        {
                            $group: {
                                _id: "$_id.use_id",
                            }
                        },
                        {
                            $count: "count"
                        }
                    ],
                    list: [{
                            $project: {
                                socialName: "$socialName",
                                time: "$time",
                                use_id: "$user.idTimViec365",
                                use_name: "$user.userName",
                                use_alias: "$user.alias",
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    use_id: "$use_id",
                                    socialName: "$socialName"
                                },
                                count: { $sum: 1 },
                                use_id: { $first: "$use_id" },
                                use_name: { $first: "$use_name" },
                                use_alias: { $first: "$use_alias" },
                                time: { $first: "$time" },
                            }
                        },
                        {
                            $group: {
                                _id: "$_id.use_id",
                                shares: {
                                    $push: {
                                        socialName: "$_id.socialName",
                                        count: "$count"
                                    }
                                },
                                use_id: { $first: "$use_id" },
                                use_name: { $first: "$use_name" },
                                use_alias: { $first: "$use_alias" },
                                time: { $first: "$time" },
                            }
                        },
                        {
                            $sort: { time: -1 }
                        },
                        {
                            $skip: skip
                        },
                        {
                            $limit: limit
                        },
                    ]
                }
            }
        ]);
        let list = [];
        let total = 0;
        let listTotal = 0;
        if (aggrData[0] && aggrData[0].counter.length && aggrData[0].listTotal.length) {
            total = aggrData[0].counter[0].count;
            listTotal = aggrData[0].listTotal[0].count;
            list = aggrData[0].list
        }
        //console.timeEnd("getListUserShare");
        list = reformatShareData(list);
        return { total: total ? total : 0, list: list ? list : [], listTotal: listTotal ? listTotal : 0 };
    } catch (error) {
        return null;
    }
}

const getListUrlShare = async(userId, type, skip = 0, limit = 5, dateFrom = null, dateTo = null) => {
    try {
        limit = Number(limit);
        skip = Number(skip);
        //console.time("getListUrlShare");
        let total = await SaveShareSocialNew.find({
            userId,
            userType: type,
            newId: 0
        }).count();
        let aggrData = await SaveShareSocialNew.aggregate([{
                $match: {
                    userId,
                    userType: type,
                    newId: 0
                }
            },
            {
                $project: {
                    newId: "$newId",
                    time: "$time",
                    socialName: "$socialName",
                    linkPage: "$linkPage"
                }
            },
            {
                $group: {
                    _id: {
                        linkPage: "$linkPage",
                        socialName: "$socialName"
                    },
                    count: { $sum: 1 },
                    time: { $max: "$time" },
                    linkPage: { $first: "$linkPage" },

                }
            },
            {
                $group: {
                    _id: "$_id.linkPage",
                    shares: {
                        $push: {
                            socialName: "$_id.socialName",
                            count: "$count"
                        }
                    },
                    time: { $max: "$time" },
                    linkPage: { $first: "$linkPage" },
                }
            },
            {
                $facet: {
                    listTotal: [{
                        $count: "count"
                    }],
                    list: [{
                            $sort: { time: -1 }
                        },
                        {
                            $skip: skip
                        },
                        {
                            $limit: limit
                        },
                    ]
                }
            }
        ]);
        let list = [];
        let listTotal = 0;
        if (aggrData[0] && aggrData[0].listTotal.length) {
            listTotal = aggrData[0].listTotal[0].count;
            list = aggrData[0].list
        }
        //console.timeEnd("getListUrlShare");
        list = reformatShareData(list);
        return { total: total ? total : 0, list: list ? list : [], listTotal: listTotal ? listTotal : 0 }
    } catch (error) {
        return null;
    }
}

const getStarRating = async(userId, type) => {
    try {
        //console.time("getStarRating");
        if (type == 1) {
            let list = await SaveVote.aggregate([{
                    $match: {
                        id_be_vote: userId
                    }
                },
                {
                    $group: {
                        _id: "$id_be_vote",
                        star: { $sum: "$star" },
                        count: { $sum: 1 }
                    }
                }
            ]);
            let total = list.reduce((acc, val) => acc + (val.star), 0);
            let count = list.reduce((acc, val) => acc + (val.count), 0);
            let avg = total / count;
            return { list: list ? list : [], total, count, avg }
        } else {
            let list = await SaveVoteCandidate.aggregate([{
                    $match: {
                        id_be_vote: userId
                    }
                },
                {
                    $group: {
                        _id: "$userId",
                        star: { $sum: "$star" },
                        count: { $sum: 1 }
                    }
                }
            ]);
            let total = list.reduce((acc, val) => acc + (val.star), 0);
            let count = list.reduce((acc, val) => acc + (val.count), 0);
            let avg = total / count;
            return { list: list ? list : [], total, count, avg }
        }
        //console.timeEnd("getStarRating");
    } catch (error) {
        return null;
    }
}

const getListUvSeen = async(userId, type, skip = 0, limit = 5, dateFrom = null, dateTo = null) => {
    try {
        limit = Number(limit);
        skip = Number(skip);
        //console.time("getListUvSeen");
        let aggrData = await SaveSeeUserNewByEm.aggregate([{
                $match: {
                    hostId: userId
                }
            },
            {
                $lookup: {
                    from: "NewTV365",
                    localField: "newId",
                    foreignField: "new_id",
                    as: "new"
                }
            },
            {
                $unwind: "$new"
            },
            {
                $facet: {
                    counter: [{ $count: "count" }],
                    totalCandidate: [{
                            $group: {
                                _id: "$userId"
                            }
                        },
                        { $count: "count" }
                    ],
                    list: [{
                            $sort: {
                                id: -1
                            }
                        },
                        {
                            $skip: skip
                        },
                        {
                            $limit: limit
                        },
                        {
                            $lookup: {
                                from: "Tv365SaveVote",
                                // localField: "userId",
                                // foreignField: "userId",
                                let: {
                                    userId: '$userId',
                                    id_be_vote: '$newId',
                                },
                                pipeline: [{
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ['$userId', '$$userId'] },
                                                { $eq: ['$id_be_vote', '$$id_be_vote'] },
                                            ]
                                        }
                                    }
                                }],
                                as: "star"
                            }
                        },
                        {
                            $lookup: {
                                from: "Users",
                                // localField: "id_be_seen",
                                // foreignField: "idTimViec365",
                                let: { idTimViec365: '$userId' },
                                pipeline: [{
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ['$idTimViec365', '$$idTimViec365'] },
                                                { $eq: ['$type', 0] }
                                            ]
                                        }
                                    }
                                }],
                                as: "user"
                            }
                        },
                        {
                            $unwind: "$user"
                        },
                        {
                            $project: {
                                userId: "$userId",
                                type: "$type",
                                name: "$user.userName",
                                newId: "$newId",
                                hostId: "$hostId",
                                url: "$url",
                                start: "$start",
                                end: "$end",
                                duration: "$duration",
                                new_title: "$new.new_title",
                                new_alias: "$new.new_alias",
                                star: { $ifNull: [{ $arrayElemAt: ["$star.star", 0] }, 0] }
                            }
                        }
                    ]
                }
            }
        ])
        let list = 0;
        let total = 0;
        let totalCandidate = 0;
        if (aggrData[0] && aggrData[0].counter.length && aggrData[0].totalCandidate.length) {
            list = aggrData[0].list;
            total = aggrData[0].counter[0].count;
            totalCandidate = aggrData[0].totalCandidate[0].count;
        }
        //console.timeEnd("getListUvSeen");
        return { list: list ? list : [], total: total ? total : 0, totalCandidate: totalCandidate ? totalCandidate : 0 };
    } catch (error) {
        return null;
    }
}

const getListCommentNew = async(userId, type, skip = 0, limit = 5, dateFrom = null, dateTo = null) => {
    try {
        limit = Number(limit);
        skip = Number(skip);
        //console.time("getListCommentNew");    
        let aggrData = await NewTV365.aggregate([{
                $match: {
                    new_user_id: userId
                }
            },
            {
                $lookup: {
                    from: "Tv365CommentPost",
                    localField: "new_id",
                    foreignField: "cm_new_id",
                    as: "comment"
                }
            },
            {
                $unwind: "$comment"
            },
            {
                $addFields: { cm_sender_idchat: "$comment.cm_sender_idchat" }
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "cm_sender_idchat",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $facet: {
                    counter: [{ $count: "count" }],
                    list: [{
                            $sort: { "comment.cm_time": -1 }
                        },
                        {
                            $skip: skip
                        },
                        {
                            $limit: limit
                        },
                        {
                            $project: {
                                cm_sender_idchat: "$cm_sender_idchat",
                                cm_sender_name: "$user.userName",
                                cm_time: "$comment.cm_time",
                                idNew: "$new_id",
                                cm_comment: "$comment.cm_comment",
                                cm_img: "$comment.cm_img",
                                new_title: 1,
                                new_alias: 1,
                                id_user: "$user.idTimViec365",
                                type_user: "$user.type",
                                alias_user: "$user.alias",
                            }
                        }
                    ]
                }
            }
        ]);
        let list = 0;
        let total = 0;
        if (aggrData[0] && aggrData[0].counter[0]) {
            list = aggrData[0].list;
            total = aggrData[0].counter[0].count;
        }
        //console.timeEnd("getListCommentNew");
        return { list: list ? list : [], total: total ? total : 0 };
    } catch (error) {
        return null;
    }
}

const getListCommentNTD = async(userId, type, skip = 0, limit = 5, dateFrom = null, dateTo = null) => {
    try {
        limit = Number(limit);
        skip = Number(skip);
        //console.time("getListCommentNTD");
        let id_chat365 = (await Users.findOne({ idTimViec365: userId, type: type }).select("_id").lean())._id;
        let aggrData = await CommentPost.aggregate([{
                $match: {
                    cm_sender_idchat: id_chat365
                }
            },
            {
                $lookup: {
                    from: "NewTV365",
                    localField: "cm_new_id",
                    foreignField: "new_id",
                    as: "new"
                }
            },
            {
                $unwind: "$new"
            },
            {
                $facet: {
                    counter: [{ $count: "count" }],
                    list: [{
                            $sort: { cm_time: -1 }
                        },
                        {
                            $skip: skip
                        },
                        {
                            $limit: limit
                        },
                        {
                            $lookup: {
                                from: "Tv365SaveVote",
                                let: { cm_new_id: "$cm_new_id" },
                                pipeline: [{
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$id_be_vote", "$$cm_new_id"] },
                                                { $eq: ["$userId", userId] }
                                            ]
                                        }
                                    }
                                }],
                                as: "star"
                            }
                        },
                        {
                            $project: {
                                new_id: "$new.new_id",
                                cm_url: 1,
                                cm_comment: 1,
                                cm_time: 1,
                                cm_img: 1,
                                new_title: "$new.new_title",
                                new_alias: "$new.new_alias",
                                star: { $ifNull: [{ $arrayElemAt: ["$star.star", 0] }, 0] }
                            }
                        }
                    ]
                }
            }
        ]);
        let list = 0;
        let total = 0;
        if (aggrData[0] && aggrData[0].counter[0]) {
            list = aggrData[0].list;
            total = aggrData[0].counter[0].count;
        }
        //console.timeEnd("getListCommentNTD");
        return { list: list ? list : [], total: total ? total : 0 };
    } catch (error) {
        return null;
    }
}

const getApplyData = async(userId, type) => {
    try {
        //console.time("getApplyData");
        let data = await NewTV365.aggregate([{
                $match: {
                    new_user_id: userId,
                    new_create_time: { $gt: 1687315166 }
                }
            },
            {
                $lookup: {
                    from: "ApplyForJob",
                    localField: "new_id",
                    foreignField: "nhs_new_id",
                    as: "applied"
                }
            },
            {
                $unwind: {
                    path: "$applied",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    nhs_use_id: "$applied.nhs_use_id",
                    nhs_new_seen: "$applied.new_seen",
                }
            },
            {
                $facet: {
                    apply_all: [{
                            $match: {
                                nhs_use_id: { $gt: 0 }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    apply_seen: [{
                            $match: {
                                nhs_use_id: { $gt: 0 },
                                nhs_new_seen: 1
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    apply_not_seen: [{
                            $match: {
                                nhs_use_id: { $gt: 0 },
                                nhs_new_seen: { $ne: 1 }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    new_not_apply: [{
                            $match: {
                                "applied": null
                            }
                        },
                        {
                            $group: {
                                _id: "$new_id",
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 }
                            }
                        }
                    ]
                }
            },
        ]);
        let countData = {
                apply_all: data[0].apply_all[0] ? data[0].apply_all[0].count : 0,
                apply_seen: data[0].apply_seen[0] ? data[0].apply_seen[0].count : 0,
                apply_not_seen: data[0].apply_not_seen[0] ? data[0].apply_not_seen[0].count : 0,
                new_not_apply: data[0].new_not_apply[0] ? data[0].new_not_apply[0].count : 0,
            }
            //console.timeEnd("getApplyData");
        return countData;
    } catch (error) {
        return null;
    }
}

const getAppliedList = async(userId, type, isSeen, skip = 0, limit = 5, dateFrom = null, dateTo = null) => {
    try {
        limit = Number(limit);
        skip = Number(skip);
        //console.time("getAppliedList");
        dateFrom = dateFrom ? Number(new Date(dateFrom).getTime() / 1000) - 25199 : 0;
        dateTo = dateTo ? Number(new Date(dateTo).getTime() / 1000) + 61199 : Number(new Date().getTime() / 1000) + ONE_DAY_IN_SECONDS;
        let match = {
            nhs_time: { $gte: dateFrom, $lte: dateTo },
            nhs_use_id: { $ne: 0 }
        }
        if (isSeen) {
            isSeen = Number(isSeen);
            if (isSeen === 1) {
                match['nhs_new_seen'] = 1;
            } else {
                match['nhs_new_seen'] = { $ne: 1 };
            }
        }

        let aggrData = await NewTV365.aggregate([{
                $match: {
                    new_user_id: userId,
                    new_create_time: { $gt: 1687315166 }
                }
            },
            {
                $lookup: {
                    from: "ApplyForJob",
                    localField: "new_id",
                    foreignField: "nhs_new_id",
                    as: "applied"
                }
            },
            {
                $unwind: "$applied"
            },
            {
                $addFields: {
                    nhs_time: "$applied.nhs_time",
                    nhs_use_id: "$applied.nhs_use_id",
                    nhs_new_seen: "$applied.new_seen"
                }
            },
            {
                $match: match
            },
            {
                $lookup: {
                    from: "Users",
                    let: { nhs_use_id: "$nhs_use_id" },
                    pipeline: [{
                            $match: {
                                $expr: { $eq: ["$$nhs_use_id", "$idTimViec365"] }
                            }
                        },
                        { $limit: 1 }
                    ],
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $facet: {
                    listTotal: [{ $count: "count" }],
                    list: [
                        { $sort: { nhs_time: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                nhs_id: "$applied.nhs_id",
                                nhs_time: "$applied.nhs_time",
                                nhs_thuungtuyen: "$applied.nhs_thuungtuyen",
                                nhs_new_id: "$applied.nhs_new_id",
                                nhs_use_id: "$applied.nhs_use_id",
                                use_id: "$user.idTimViec365",
                                use_first_name: "$user.userName",
                                new_id: 1,
                                new_title: 1,
                                new_alias: 1,
                            }
                        }
                    ]
                }
            }
        ]);
        let list = [];
        let listTotal = 0;
        if (aggrData[0] && aggrData[0].listTotal.length) {
            listTotal = aggrData[0].listTotal[0].count;
            list = aggrData[0].list
        }
        //console.timeEnd("getAppliedList");
        return { list: list ? list : [], listTotal: listTotal ? listTotal : 0 }
    } catch (error) {
        return null;
    }
}

const getOnsiteData = async(userId, type, skip = 0, limit = 5, dateFrom = null, dateTo = null) => {
    try {
        limit = Number(limit);
        skip = Number(skip);
        //console.time("getOnsiteData");
        //console.time("getOnsiteDataTotal")
        let total = await SaveNextPage.find({
            userType: type,
            userId: userId,
        }).count();
        //console.timeEnd("getOnsiteDataTotal")
        let list = await SaveNextPage.aggregate([{
                    $match: {
                        userType: type,
                        userId: userId,
                    }
                },
                {
                    $sort: { startTime: -1 }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
                },
                {
                    $lookup: {
                        from: "TV365HistoryLogin",
                        let: {
                            startTime: "$startTime",
                            endTime: "$endTime",
                        },
                        pipeline: [{
                                $match: {
                                    type: type,
                                    userId: userId
                                }
                            },
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $gte: ["$timeLogout", "$$startTime"] },
                                            { $lte: ["$timeLogin", "$$endTime"] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'session'
                    }
                },
                {
                    $unwind: "$session"
                },
                {
                    $lookup: {
                        from: "TV365SaveNextPage",
                        let: {
                            timeLogin: "$session.timeLogin",
                            timeLogout: "$session.timeLogout",
                        },
                        pipeline: [{
                                $match: {
                                    userType: type,
                                    userId: userId
                                }
                            },
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $gte: ["$$timeLogout", "$startTime"] },
                                            { $lte: ["$$timeLogin", "$endTime"] }
                                        ]
                                    }
                                }
                            },
                            {
                                $count: "count"
                            }
                        ],
                        as: "counter"
                    }
                },
                {
                    $group: {
                        _id: "$session.id",
                        timeLogin: { $first: "$session.timeLogin" },
                        timeLogout: { $first: "$session.timeLogout" },
                        count: { $first: "$counter.count" },
                        pages: {
                            $push: {
                                startTime: "$startTime",
                                endTime: "$endTime",
                                link: "$link",
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        timeLogin: 1,
                        timeLogout: 1,
                        pages: 1,
                        count: { $ifNull: [{ $arrayElemAt: ["$count", 0] }, 0] },
                    }
                },
                { $sort: { timeLogin: -1 } }
            ])
            //console.timeEnd("getOnsiteData");
        return { total, list };
    } catch (error) {
        return null;
    }
}

const getVipData = async(userId, type) => {
    try {
        //console.time("getVipData");
        let list = await SaveAccountVip.find({
            userId: userId,
            userType: type
        }).sort({ time: -1 }).limit(6);
        //console.timeEnd("getVipData");
        return list;
    } catch (error) {
        return null;
    }
}

const getHistoryPoint = async(userId, type) => {
    try {
        //console.time("getHistoryPoint");
        let historyPoint = await ManagerPointHistory.findOne({
                userId,
                type
            })
            //console.timeEnd("getHistoryPoint");
        return historyPoint;
    } catch (error) {
        return null;
    }
}

const getSaveExchangePoints = async(userId, type) => {
    try {
        let list = await SaveExchangePoint.find({
            userId: userId,
            userType: type
        }).sort({ id: -1 });
        return list ? list : [];
    } catch (error) {
        return null;
    }
}

const getSeenNewsOrCompanyDetails = async(userId, type, skip = 0, limit = 5, dateFrom = null, dateTo = null) => {
    try {
        limit = Number(limit);
        skip = Number(skip);
        dateFrom = dateFrom ? Number(new Date(dateFrom).getTime() / 1000) : 0;
        dateTo = (dateTo ? Number(new Date(dateTo).getTime() / 1000) : Number(new Date().getTime() / 1000)) + ONE_DAY_IN_SECONDS;
        // let total = await SaveSeeUserNewByEm.find({
        //     userId: userId,
        //     type: type,
        //     start: {$gte: dateFrom, $lte: dateTo},
        // }).count()
        let listData = SaveSeeUserNewByEm.aggregate([{
                $match: {
                    userId: userId,
                    type: type,
                    start: { $gte: dateFrom, $lte: dateTo }
                }
            },
            {
                $facet: {
                    newsFacet: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $gt: ['$newId', 0] },
                                        { $lte: ['$userIdBeSeen', 0] }
                                    ]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "NewTV365",
                                let: { new_id: "$newId" },
                                pipeline: [{
                                        $match: {
                                            $expr: { $eq: ["$new_id", "$$new_id"] }
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: "City",
                                            localField: "new_city",
                                            foreignField: "_id",
                                            as: "city"
                                        }
                                    },
                                    {
                                        $unwind: {
                                            path: "$city",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    },
                                ],
                                as: "news"
                            }
                        },
                        { $unwind: "$news" },
                        { $unwind: "$news.new_city" },
                        // {
                        //     $unwind: {
                        //         path: "$news.new_cat_id",
                        //         preserveNullAndEmptyArrays: true
                        //     }
                        // },
                        {
                            $lookup: {
                                from: 'CategoryJob',
                                let: { cat_id: '$news.new_cat_id' },
                                pipeline: [{
                                        $match: {
                                            $expr: {
                                                $in: ['$cat_id', '$$cat_id']
                                            }
                                        }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            'cat_id': '$cat_id',
                                            'cat_name': '$cat_name',
                                        }
                                    }
                                ],
                                as: 'cat'
                            }
                        },
                        // {
                        //     $unwind: {
                        //         path: "$cat",
                        //         preserveNullAndEmptyArrays: true
                        //     }
                        // },
                    ],
                    usersFacet: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $lte: ['$newId', 0] },
                                        { $gt: ['$id_be_seen', 0] }
                                    ]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "Users",
                                let: {
                                    userIdBeSeen: "$id_be_seen",
                                    typeIdBeSeen: "$type_be_seen"
                                },
                                pipeline: [{
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ["$idTimViec365", "$$userIdBeSeen"] },
                                                    { $eq: ["$type", "$$typeIdBeSeen"] }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: "City",
                                            localField: "city",
                                            foreignField: "_id",
                                            as: "cityNTD"
                                        }
                                    },
                                    {
                                        $unwind: {
                                            path: "$cityNTD",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    },
                                ],
                                as: "NTD"
                            }
                        },
                        { $unwind: "$NTD" }
                    ]
                }
            },
            {
                $project: {
                    documents: { $concatArrays: ["$newsFacet", "$usersFacet"] }
                }
            },
            { $unwind: "$documents" },
            {
                $replaceRoot: { newRoot: "$documents" }
            },
            {
                $project: {
                    _id: 0,
                    id: 1,
                    userId: 1,
                    newId: 1,
                    type: 1,
                    time: '$start',
                    news_id: '$news.new_id',
                    news_name: "$news.new_title",
                    news_cat: '$cat',
                    news_city_id: "$news.new_city",
                    news_city: {
                        $cond: [
                            { $eq: ['$news.new_city', 0] },
                            'Toàn Quốc',
                            '$news.city.name'
                        ]
                    },
                    news_alias: "$news.new_alias",
                    com_id: '$NTD.idTimViec365',
                    com_name: "$NTD.userName",
                    com_city_id: '$NTD.city',
                    com_city: {
                        $cond: [
                            { $eq: ['$NTD.city', 0] },
                            'Toàn Quốc',
                            '$NTD.cityNTD.name'
                        ]
                    },
                    com_alias: "$NTD.alias",
                }
            },
            {
                $sort: { time: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);
        let totalData = SaveSeeUserNewByEm.aggregate([{
                $match: {
                    userId: userId,
                    type: type,
                    start: { $gte: dateFrom, $lte: dateTo }
                }
            },
            {
                $facet: {
                    newsFacet: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $gt: ['$newId', 0] },
                                        { $lte: ['$userIdBeSeen', 0] }
                                    ]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "NewTV365",
                                let: { new_id: "$newId" },
                                pipeline: [{
                                        $match: {
                                            $expr: { $eq: ["$new_id", "$$new_id"] }
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: "City",
                                            localField: "new_city",
                                            foreignField: "_id",
                                            as: "city"
                                        }
                                    },
                                    {
                                        $unwind: {
                                            path: "$city",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    },
                                ],
                                as: "news"
                            }
                        },
                        { $unwind: "$news" },
                        { $unwind: "$news.new_city" },
                        // {
                        //     $unwind: {
                        //         path: "$news.new_cat_id",
                        //         preserveNullAndEmptyArrays: true
                        //     }
                        // },
                        {
                            $lookup: {
                                from: 'CategoryJob',
                                let: { cat_id: '$news.new_cat_id' },
                                pipeline: [{
                                        $match: {
                                            $expr: {
                                                $in: ['$cat_id', '$$cat_id']
                                            }
                                        }
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            'cat_id': '$cat_id',
                                            'cat_name': '$cat_name',
                                        }
                                    }
                                ],
                                as: 'cat'
                            }
                        },
                        // {
                        //     $unwind: {
                        //         path: "$cat",
                        //         preserveNullAndEmptyArrays: true
                        //     }
                        // },
                    ],
                    usersFacet: [{
                            $match: {
                                $expr: {
                                    $and: [
                                        { $lte: ['$newId', 0] },
                                        { $gt: ['$id_be_seen', 0] }
                                    ]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "Users",
                                let: {
                                    userIdBeSeen: "$id_be_seen",
                                    typeIdBeSeen: "$type_be_seen"
                                },
                                pipeline: [{
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ["$idTimViec365", "$$userIdBeSeen"] },
                                                    { $eq: ["$type", "$$typeIdBeSeen"] }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: "City",
                                            localField: "city",
                                            foreignField: "_id",
                                            as: "cityNTD"
                                        }
                                    },
                                    {
                                        $unwind: {
                                            path: "$cityNTD",
                                            preserveNullAndEmptyArrays: true
                                        }
                                    },
                                ],
                                as: "NTD"
                            }
                        },
                        { $unwind: "$NTD" }
                    ]
                }
            },
            {
                $project: {
                    documents: { $concatArrays: ["$newsFacet", "$usersFacet"] }
                }
            },
            { $unwind: "$documents" },
            {
                $replaceRoot: { newRoot: "$documents" }
            },
            {
                $count: 'total'
            }
        ]);
        const [list, total] = await Promise.all([listData, totalData]);
        return { list: list ? list : [], total: total && total[0] ? total[0].total : 0 }
    } catch (error) {
        console.log("getSeenNewsOrCompanyDetails", error)
        return null;
    }
}

const getNTDSeen = async(userId, type, skip = 0, limit = 5, dateFrom = null, dateTo = null) => {
    try {
        limit = Number(limit);
        skip = Number(skip);
        dateFrom = dateFrom ? Number(new Date(dateFrom).getTime() / 1000) - 25199 : 0;
        dateTo = dateTo ? Number(new Date(dateTo).getTime() / 1000) + 61199 : Number(new Date().getTime() / 1000) + ONE_DAY_IN_SECONDS;
        let total = await SaveSeeUserNewByEm.find({
            id_be_seen: userId,
            type_be_seen: type,
            start: { $gte: dateFrom, $lte: dateTo },
        }).count()
        let list = await SaveSeeUserNewByEm.aggregate([{
                $match: {
                    id_be_seen: userId,
                    type_be_seen: type,
                    start: { $gte: dateFrom, $lte: dateTo },
                },
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: "Users",
                    let: { id_user: "$userId" },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$idTimViec365", "$$id_user"] },
                                    { $eq: ["$type", 1] },
                                ],
                            },
                        },
                    }, ],
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 0,
                    "userId": "$userId",
                    "type": "$type",
                    "time": "$start",
                    "comId": '$user.idTimViec365',
                    "comName": "$user.userName",
                    "comAlias": "$user.alias",
                }
            }
        ])
        return { list: list ? list : [], total: total ? total : 0 }
    } catch (error) {
        console.log("getNTDSeen", error)
        return null;
    }
}

const getDetailExChangedPoints = async(userId, type, skip = 0, limit = 5, dateFrom = null, dateTo = null) => {
    limit = Number(limit);
    skip = Number(skip);
    dateFrom = dateFrom ? Number(new Date(dateFrom).getTime() / 1000) - 25199 : 0;
    dateTo = dateTo ? Number(new Date(dateTo).getTime() / 1000) + 61199 : Number(new Date().getTime() / 1000) + ONE_DAY_IN_SECONDS;
    const list = await SaveExchangePoint.find({ userId, userType: type }, {
        _id: 0,
        time: 1,
        point_later: 1,
    }).skip(skip).limit(limit).lean()
    return { list: list ? list : [] }
}

const getNtdEvaluate = async(userId, type, skip = 0, limit = 5, dateFrom = null, dateTo = null) => {
    limit = Number(limit);
    skip = Number(skip);
    dateFrom = dateFrom ? Number(new Date(dateFrom).getTime() / 1000) - 25199 : 0;
    dateTo = (dateTo ? Number(new Date(dateTo).getTime() / 1000) : Number(new Date().getTime() / 1000)) + ONE_DAY_IN_SECONDS;
    let listData = SaveVoteCandidate.aggregate([{
            $match: {
                id_be_vote: userId,
                type_be_vote: type,
                time: { $gte: dateFrom, $lte: dateTo },
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                from: "Users",
                let: { idTimViec365: "$userId" },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$idTimViec365", "$$idTimViec365"] },
                                { $eq: ["$type", 1] },
                            ]
                        }
                    }
                }],
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                _id: 0,
                star: 1,
                time: 1,
                com_name: "$user.userName",
                com_id: "$user.idQLC",
                com_alias: "$user.alias",
            }
        }
    ]);
    let totalData = SaveVoteCandidate.aggregate([{
            $match: {
                id_be_vote: userId,
                type_be_vote: type,
                time: { $gte: dateFrom, $lte: dateTo },
            }
        },
        {
            $lookup: {
                from: "Users",
                let: { idTimViec365: "$userId" },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$idTimViec365", "$$idTimViec365"] },
                                { $eq: ["$type", 1] },
                            ]
                        }
                    }
                }],
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $count: 'total'
        }
    ]);
    const [list, total] = await Promise.all([listData, totalData]);
    return { list: list ? list : [], total: total[0] ? total[0].total : 0 };
}

const getListHistoryChat = async(userId, type, skip = 0, limit = 5, dateFrom = null, dateTo = null) => {
    limit = Number(limit);
    skip = Number(skip);
    dateFrom = dateFrom ? new Date(dateFrom) : new Date(0);
    dateTo = (dateTo ? new Date(dateTo) : new Date())
    let match = [
            { $ne: ["$NTD_id", null] },
            { $ne: ["$memberList", null] },
            // {$eq: ["$memberList.unReader", 1]},
        ]
        // if(isSeen){
        //     isSeen = Number(isSeen)
        //     if(isSeen === 1){
        //         match.push({$eq: ["$memberList.unReader", 1]})
        //     } else {
        //         match.push({$eq: ["$memberList.unReader", 0]})
        //     }
        // }
        // Tổng
    const listTotal = Conversation.aggregate([{
            $match: {
                isGroup: 0,
                $expr: { $gt: [{ $size: "$messageList" }, 1] },
                memberList: { $elemMatch: { memberId: userId } },
            }
        },
        {
            $project: {
                NTD_id: {
                    $map: {
                        input: '$memberList',
                        as: "member",
                        in: {
                            $cond: [
                                { $ne: ["$$member.memberId", userId] },
                                "$$member.memberId",
                                null
                            ]
                        }
                    }
                },
                memberList: {
                    $map: {
                        input: '$memberList',
                        as: "member",
                        in: {
                            $cond: [
                                { $ne: ["$$member.memberId", userId] },
                                "$$member",
                                null
                            ]
                        }
                    }
                },
            }
        },
        { $unwind: "$memberList" },
        { $unwind: "$NTD_id" },
        {
            $match: {
                $expr: {
                    $and: match
                }
            }
        },
        {
            $lookup: {
                from: "Users",
                let: { user_id: "$NTD_id" },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$idTimViec365", "$$user_id"] },
                                { $eq: ["$type", 1] }
                            ]
                        }
                    }
                }],
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                ['NTD_id']: '$user.idTimViec365',
                ['NTD_name']: "$user.userName",
                ['NTD_alias']: '$user.alias',
                ['timeLastSeener']: "$memberList.timeLastSeener",
            }
        },
        {
            $match: {
                ['timeLastSeener']: { $gte: dateFrom, $lte: dateTo },
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
    ])
    const countTotal = Conversation.aggregate([{
            $match: {
                isGroup: 0,
                $expr: { $gt: [{ $size: "$messageList" }, 1] },
                memberList: { $elemMatch: { memberId: userId } },
            }
        },
        {
            $project: {
                NTD_id: {
                    $map: {
                        input: '$memberList',
                        as: "member",
                        in: {
                            $cond: [
                                { $ne: ["$$member.memberId", userId] },
                                "$$member.memberId",
                                null
                            ]
                        }
                    }
                },
                memberList: {
                    $map: {
                        input: '$memberList',
                        as: "member",
                        in: {
                            $cond: [
                                { $ne: ["$$member.memberId", userId] },
                                "$$member",
                                null
                            ]
                        }
                    }
                },
            }
        },
        { $unwind: "$memberList" },
        { $unwind: "$NTD_id" },
        {
            $match: {
                $expr: {
                    $and: match
                }
            }
        },
        {
            $lookup: {
                from: "Users",
                let: { user_id: "$NTD_id" },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$idTimViec365", "$$user_id"] },
                                { $eq: ["$type", 1] }
                            ]
                        }
                    }
                }],
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                ['NTD_name']: "$user.userName",
                ['timeLastSeener']: "$memberList.timeLastSeener",
            }
        },
    ])

    // Đã xem
    const listTotalSeen = Conversation.aggregate([{
            $match: {
                isGroup: 0,
                $expr: { $gt: [{ $size: "$messageList" }, 1] },
                memberList: { $elemMatch: { memberId: userId } },
            }
        },
        {
            $project: {
                NTD_id: {
                    $map: {
                        input: '$memberList',
                        as: "member",
                        in: {
                            $cond: [
                                { $ne: ["$$member.memberId", userId] },
                                "$$member.memberId",
                                null
                            ]
                        }
                    }
                },
                memberList: {
                    $map: {
                        input: '$memberList',
                        as: "member",
                        in: {
                            $cond: [
                                { $ne: ["$$member.memberId", userId] },
                                "$$member",
                                null
                            ]
                        }
                    }
                },
            }
        },
        { $unwind: "$memberList" },
        { $unwind: "$NTD_id" },
        {
            $match: {
                $expr: {
                    $and: [
                        { $ne: ["$NTD_id", null] },
                        { $ne: ["$memberList", null] },
                        { $eq: ["$memberList.unReader", 1] },
                    ]
                }
            }
        },
        {
            $lookup: {
                from: "Users",
                let: { user_id: "$NTD_id" },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$idTimViec365", "$$user_id"] },
                                { $eq: ["$type", 1] }
                            ]
                        }
                    }
                }],
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                ['NTD_id']: '$user.idTimViec365',
                ['NTD_name']: "$user.userName",
                ['NTD_alias']: '$user.alias',
                ['timeLastSeener']: "$memberList.timeLastSeener",
            }
        },
        {
            $match: {
                ['timeLastSeener']: { $gte: dateFrom, $lte: dateTo },
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
    ])
    const countTotalSeen = Conversation.aggregate([{
            $match: {
                isGroup: 0,
                $expr: { $gt: [{ $size: "$messageList" }, 1] },
                memberList: { $elemMatch: { memberId: userId } },
            }
        },
        {
            $project: {
                NTD_id: {
                    $map: {
                        input: '$memberList',
                        as: "member",
                        in: {
                            $cond: [
                                { $ne: ["$$member.memberId", userId] },
                                "$$member.memberId",
                                null
                            ]
                        }
                    }
                },
                memberList: {
                    $map: {
                        input: '$memberList',
                        as: "member",
                        in: {
                            $cond: [
                                { $ne: ["$$member.memberId", userId] },
                                "$$member",
                                null
                            ]
                        }
                    }
                },
            }
        },
        { $unwind: "$memberList" },
        { $unwind: "$NTD_id" },
        {
            $match: {
                $expr: {
                    $and: [
                        { $ne: ["$NTD_id", null] },
                        { $ne: ["$memberList", null] },
                        { $eq: ["$memberList.unReader", 1] },
                    ]
                }
            }
        },
        {
            $lookup: {
                from: "Users",
                let: { user_id: "$NTD_id" },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$idTimViec365", "$$user_id"] },
                                { $eq: ["$type", 1] }
                            ]
                        }
                    }
                }],
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                ['NTD_name']: "$user.userName",
                ['timeLastSeener']: "$memberList.timeLastSeener",
            }
        },
    ])

    // Chưa xem
    const listTotalUnseen = Conversation.aggregate([{
            $match: {
                isGroup: 0,
                $expr: { $gt: [{ $size: "$messageList" }, 1] },
                memberList: { $elemMatch: { memberId: userId } },
            }
        },
        {
            $project: {
                NTD_id: {
                    $map: {
                        input: '$memberList',
                        as: "member",
                        in: {
                            $cond: [
                                { $ne: ["$$member.memberId", userId] },
                                "$$member.memberId",
                                null
                            ]
                        }
                    }
                },
                memberList: {
                    $map: {
                        input: '$memberList',
                        as: "member",
                        in: {
                            $cond: [
                                { $ne: ["$$member.memberId", userId] },
                                "$$member",
                                null
                            ]
                        }
                    }
                },
            }
        },
        { $unwind: "$memberList" },
        { $unwind: "$NTD_id" },
        {
            $match: {
                $expr: {
                    $and: [
                        { $ne: ["$NTD_id", null] },
                        { $ne: ["$memberList", null] },
                        { $eq: ["$memberList.unReader", 0] },
                    ]
                }
            }
        },
        {
            $lookup: {
                from: "Users",
                let: { user_id: "$NTD_id" },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$idTimViec365", "$$user_id"] },
                                { $eq: ["$type", 1] }
                            ]
                        }
                    }
                }],
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                ['NTD_id']: '$user.idTimViec365',
                ['NTD_name']: "$user.userName",
                ['NTD_alias']: '$user.alias',
                ['timeLastSeener']: "$memberList.timeLastSeener",
            }
        },
        {
            $match: {
                ['timeLastSeener']: { $gte: dateFrom, $lte: dateTo },
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
    ])
    const countTotalUnseen = Conversation.aggregate([{
            $match: {
                isGroup: 0,
                $expr: { $gt: [{ $size: "$messageList" }, 1] },
                memberList: { $elemMatch: { memberId: userId } },
            }
        },
        {
            $project: {
                NTD_id: {
                    $map: {
                        input: '$memberList',
                        as: "member",
                        in: {
                            $cond: [
                                { $ne: ["$$member.memberId", userId] },
                                "$$member.memberId",
                                null
                            ]
                        }
                    }
                },
                memberList: {
                    $map: {
                        input: '$memberList',
                        as: "member",
                        in: {
                            $cond: [
                                { $ne: ["$$member.memberId", userId] },
                                "$$member",
                                null
                            ]
                        }
                    }
                },
            }
        },
        { $unwind: "$memberList" },
        { $unwind: "$NTD_id" },
        {
            $match: {
                $expr: {
                    $and: [
                        { $ne: ["$NTD_id", null] },
                        { $ne: ["$memberList", null] },
                        { $eq: ["$memberList.unReader", 0] },
                    ]
                }
            }
        },
        {
            $lookup: {
                from: "Users",
                let: { user_id: "$NTD_id" },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$idTimViec365", "$$user_id"] },
                                { $eq: ["$type", 1] }
                            ]
                        }
                    }
                }],
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                ['NTD_name']: "$user.userName",
                ['timeLastSeener']: "$memberList.timeLastSeener",
            }
        },
    ])

    const [
        list,
        total,
        listSeen,
        totalSeen,
        listUnseen,
        totalUnseen
    ] = await Promise.all([listTotal, countTotal, listTotalSeen, countTotalSeen, listTotalUnseen, countTotalUnseen])
        // ] = await Promise.all([listTotal,countTotal])

    return {
        Tong: { list: list ? list : [], total: total ? total.length : 0 },
        DaXem: { list: listSeen ? listSeen : [], total: totalSeen ? totalSeen.length : 0 },
        ChuaXem: { list: listUnseen ? listUnseen : [], total: totalUnseen ? totalUnseen.length : 0 }
    }
    // return {list:list?list:[], total:total?total.length:0}
}

const getListHistoryChatDetail = async(userId, type, skip = 0, limit = 5, dateFrom = null, dateTo = null, isSeen) => {
    limit = Number(limit);
    skip = Number(skip);
    dateFrom = dateFrom ? new Date(dateFrom) : new Date(0);
    dateTo = (dateTo ? new Date(dateTo) : new Date())

    let match = [
        { $ne: ["$NTD_id", null] },
        { $ne: ["$memberList", null] },
        // {$eq: ["$memberList.unReader", 1]},
    ]
    if (isSeen) {
        isSeen = Number(isSeen)
        if (isSeen === 1) {
            match.push({ $eq: ["$memberList.unReader", 1] })
        } else {
            match.push({ $eq: ["$memberList.unReader", 0] })
        }
    }
    // Tổng
    const listTotal = Conversation.aggregate([{
            $match: {
                isGroup: 0,
                $expr: { $gt: [{ $size: "$messageList" }, 1] },
                memberList: { $elemMatch: { memberId: userId } },
            }
        },
        {
            $project: {
                NTD_id: {
                    $map: {
                        input: '$memberList',
                        as: "member",
                        in: {
                            $cond: [
                                { $ne: ["$$member.memberId", userId] },
                                "$$member.memberId",
                                null
                            ]
                        }
                    }
                },
                memberList: {
                    $map: {
                        input: '$memberList',
                        as: "member",
                        in: {
                            $cond: [
                                { $ne: ["$$member.memberId", userId] },
                                "$$member",
                                null
                            ]
                        }
                    }
                },
            }
        },
        { $unwind: "$memberList" },
        { $unwind: "$NTD_id" },
        {
            $match: {
                $expr: {
                    $and: match
                }
            }
        },
        {
            $lookup: {
                from: "Users",
                let: { user_id: "$NTD_id" },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$idTimViec365", "$$user_id"] },
                                { $eq: ["$type", 1] }
                            ]
                        }
                    }
                }],
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                ['NTD_id']: '$user.idTimViec365',
                ['NTD_name']: "$user.userName",
                ['NTD_alias']: '$user.alias',
                ['timeLastSeener']: "$memberList.timeLastSeener",
            }
        },
        {
            $match: {
                ['timeLastSeener']: { $gte: dateFrom, $lte: dateTo },
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
    ])
    const countTotal = Conversation.aggregate([{
            $match: {
                isGroup: 0,
                $expr: { $gt: [{ $size: "$messageList" }, 1] },
                memberList: { $elemMatch: { memberId: userId } },
            }
        },
        {
            $project: {
                NTD_id: {
                    $map: {
                        input: '$memberList',
                        as: "member",
                        in: {
                            $cond: [
                                { $ne: ["$$member.memberId", userId] },
                                "$$member.memberId",
                                null
                            ]
                        }
                    }
                },
                memberList: {
                    $map: {
                        input: '$memberList',
                        as: "member",
                        in: {
                            $cond: [
                                { $ne: ["$$member.memberId", userId] },
                                "$$member",
                                null
                            ]
                        }
                    }
                },
            }
        },
        { $unwind: "$memberList" },
        { $unwind: "$NTD_id" },
        {
            $match: {
                $expr: {
                    $and: match
                }
            }
        },
        {
            $lookup: {
                from: "Users",
                let: { user_id: "$NTD_id" },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$idTimViec365", "$$user_id"] },
                                { $eq: ["$type", 1] }
                            ]
                        }
                    }
                }],
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                ['NTD_name']: "$user.userName",
                ['timeLastSeener']: "$memberList.timeLastSeener",
            }
        },
    ])

    // // Đã xem
    // const listTotalSeen = Conversation.aggregate([
    //     {
    //         $match: {
    //             isGroup: 0,
    //             $expr: { $gt: [{ $size: "$messageList" }, 1]},
    //             memberList: {$elemMatch: { memberId: idChat }},
    //         }
    //     },
    //     {
    //         $project: {
    //             NTD_id:{
    //                 $map: {
    //                     input: '$memberList',
    //                     as: "member",
    //                     in: {
    //                         $cond: [
    //                             {$ne: ["$$member.memberId", idChat]},
    //                             "$$member.memberId",
    //                             null
    //                         ]
    //                     }
    //                 }
    //             },
    //             memberList:{
    //                 $map: {
    //                     input: '$memberList',
    //                     as: "member",
    //                     in: {
    //                         $cond: [
    //                             {$ne: ["$$member.memberId", idChat]},
    //                             "$$member",
    //                             null
    //                         ]
    //                     }
    //                 }
    //             },
    //         }
    //     },
    //     {$unwind: "$memberList"},
    //     {$unwind: "$NTD_id"},
    //     {
    //         $match: {
    //             $expr: {
    //                 $and: [
    //                     {$ne: ["$NTD_id", null]},
    //                     {$ne: ["$memberList", null]},
    //                     {$eq: ["$memberList.unReader", 1]},
    //                 ]
    //             }
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "Users",
    //             let: {user_id: "$NTD_id"},
    //             pipeline: [
    //                 {
    //                     $match: {
    //                         $expr: {
    //                             $and: [
    //                                 {$eq: ["$idTimViec365","$$user_id"]},
    //                                 {$eq: ["$type", 1]}
    //                             ]
    //                         }
    //                     }
    //                 }
    //             ],
    //             as: "user"
    //         }
    //     },
    //     {$unwind: "$user"},
    //     {
    //         $project: {
    //             ['NTD_id']: '$user.idTimViec365',
    //             ['NTD_name']: "$user.userName",
    //             ['NTD_alias']: '$user.alias',
    //             ['timeLastSeener']: "$memberList.timeLastSeener",
    //         }
    //     },
    //     {
    //         $match: {
    //             ['timeLastSeener']: {$gte: dateFrom, $lte: dateTo},
    //         }
    //     },
    //     {
    //         $skip: skip
    //     },
    //     {
    //         $limit: limit
    //     },
    // ])
    // const countTotalSeen = Conversation.aggregate([
    //     {
    //         $match: {
    //             isGroup: 0,
    //             $expr: { $gt: [{ $size: "$messageList" }, 1]},
    //             memberList: {$elemMatch: { memberId: idChat }},
    //         }
    //     },
    //     {
    //         $project: {
    //             NTD_id:{
    //                 $map: {
    //                     input: '$memberList',
    //                     as: "member",
    //                     in: {
    //                         $cond: [
    //                             {$ne: ["$$member.memberId", idChat]},
    //                             "$$member.memberId",
    //                             null
    //                         ]
    //                     }
    //                 }
    //             },
    //             memberList:{
    //                 $map: {
    //                     input: '$memberList',
    //                     as: "member",
    //                     in: {
    //                         $cond: [
    //                             {$ne: ["$$member.memberId", idChat]},
    //                             "$$member",
    //                             null
    //                         ]
    //                     }
    //                 }
    //             },
    //         }
    //     },
    //     {$unwind: "$memberList"},
    //     {$unwind: "$NTD_id"},
    //     {
    //         $match: {
    //             $expr: {
    //                 $and: [
    //                     {$ne: ["$NTD_id", null]},
    //                     {$ne: ["$memberList", null]},
    //                     {$eq: ["$memberList.unReader", 1]},
    //                 ]
    //             }
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "Users",
    //             let: {user_id: "$NTD_id"},
    //             pipeline: [
    //                 {
    //                     $match: {
    //                         $expr: {
    //                             $and: [
    //                                 {$eq: ["$idTimViec365","$$user_id"]},
    //                                 {$eq: ["$type", 1]}
    //                             ]
    //                         }
    //                     }
    //                 }
    //             ],
    //             as: "user"
    //         }
    //     },
    //     {$unwind: "$user"},
    //     {
    //         $project: {
    //             ['NTD_name']: "$user.userName",
    //             ['timeLastSeener']: "$memberList.timeLastSeener",
    //         }
    //     },
    // ])

    // // Chưa xem
    // const listTotalUnseen = Conversation.aggregate([
    //     {
    //         $match: {
    //             isGroup: 0,
    //             $expr: { $gt: [{ $size: "$messageList" }, 1]},
    //             memberList: {$elemMatch: { memberId: idChat }},
    //         }
    //     },
    //     {
    //         $project: {
    //             NTD_id:{
    //                 $map: {
    //                     input: '$memberList',
    //                     as: "member",
    //                     in: {
    //                         $cond: [
    //                             {$ne: ["$$member.memberId", idChat]},
    //                             "$$member.memberId",
    //                             null
    //                         ]
    //                     }
    //                 }
    //             },
    //             memberList:{
    //                 $map: {
    //                     input: '$memberList',
    //                     as: "member",
    //                     in: {
    //                         $cond: [
    //                             {$ne: ["$$member.memberId", idChat]},
    //                             "$$member",
    //                             null
    //                         ]
    //                     }
    //                 }
    //             },
    //         }
    //     },
    //     {$unwind: "$memberList"},
    //     {$unwind: "$NTD_id"},
    //     {
    //         $match: {
    //             $expr: {
    //                 $and: [
    //                     {$ne: ["$NTD_id", null]},
    //                     {$ne: ["$memberList", null]},
    //                     {$eq: ["$memberList.unReader", 0]},
    //                 ]
    //             }
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "Users",
    //             let: {user_id: "$NTD_id"},
    //             pipeline: [
    //                 {
    //                     $match: {
    //                         $expr: {
    //                             $and: [
    //                                 {$eq: ["$idTimViec365","$$user_id"]},
    //                                 {$eq: ["$type", 1]}
    //                             ]
    //                         }
    //                     }
    //                 }
    //             ],
    //             as: "user"
    //         }
    //     },
    //     {$unwind: "$user"},
    //     {
    //         $project: {
    //             ['NTD_id']: '$user.idTimViec365',
    //             ['NTD_name']: "$user.userName",
    //             ['NTD_alias']: '$user.alias',
    //             ['timeLastSeener']: "$memberList.timeLastSeener",
    //         }
    //     },
    //     {
    //         $match: {
    //             ['timeLastSeener']: {$gte: dateFrom, $lte: dateTo},
    //         }
    //     },
    //     {
    //         $skip: skip
    //     },
    //     {
    //         $limit: limit
    //     },
    // ])
    // const countTotalUnseen = Conversation.aggregate([
    //     {
    //         $match: {
    //             isGroup: 0,
    //             $expr: { $gt: [{ $size: "$messageList" }, 1]},
    //             memberList: {$elemMatch: { memberId: idChat }},
    //         }
    //     },
    //     {
    //         $project: {
    //             NTD_id:{
    //                 $map: {
    //                     input: '$memberList',
    //                     as: "member",
    //                     in: {
    //                         $cond: [
    //                             {$ne: ["$$member.memberId", idChat]},
    //                             "$$member.memberId",
    //                             null
    //                         ]
    //                     }
    //                 }
    //             },
    //             memberList:{
    //                 $map: {
    //                     input: '$memberList',
    //                     as: "member",
    //                     in: {
    //                         $cond: [
    //                             {$ne: ["$$member.memberId", idChat]},
    //                             "$$member",
    //                             null
    //                         ]
    //                     }
    //                 }
    //             },
    //         }
    //     },
    //     {$unwind: "$memberList"},
    //     {$unwind: "$NTD_id"},
    //     {
    //         $match: {
    //             $expr: {
    //                 $and: [
    //                     {$ne: ["$NTD_id", null]},
    //                     {$ne: ["$memberList", null]},
    //                     {$eq: ["$memberList.unReader", 0]},
    //                 ]
    //             }
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "Users",
    //             let: {user_id: "$NTD_id"},
    //             pipeline: [
    //                 {
    //                     $match: {
    //                         $expr: {
    //                             $and: [
    //                                 {$eq: ["$idTimViec365","$$user_id"]},
    //                                 {$eq: ["$type", 1]}
    //                             ]
    //                         }
    //                     }
    //                 }
    //             ],
    //             as: "user"
    //         }
    //     },
    //     {$unwind: "$user"},
    //     {
    //         $project: {
    //             ['NTD_name']: "$user.userName",
    //             ['timeLastSeener']: "$memberList.timeLastSeener",
    //         }
    //     },
    // ])

    const [
        list,
        total,
        // listSeen,
        // totalSeen,
        // listUnseen,
        // totalUnseen
        // ] = await Promise.all([listTotal,countTotal,listTotalSeen,countTotalSeen,listTotalUnseen,countTotalUnseen])
    ] = await Promise.all([listTotal, countTotal])

    // return {
    //     Tong: {list:list?list:[], total:total?total.length:0},
    //     DaXem: {list:listSeen?listSeen:[], total:totalSeen?totalSeen.length:0},
    //     ChuaXem: {list:listUnseen?listUnseen:[], total:totalUnseen?totalUnseen.length:0}
    // }
    return { list: list ? list : [], total: total ? total.length : 0 }
}

const getCvEvaluatePoint = async(userId, type) => {
    let point = await ManagerPointHistory.findOne({ userId, type }, 'point_evaluate_cv').lean()
    return point && point.point_evaluate_cv ? point.point_evaluate_cv : 0
}

// exports.updatePointTimeActive = async(req, res) => {
//     try {
//         const managerHistory = await ManagerPointHistory.find({ type: 1 }).lean()
//         const now = functions.getTimeNow()
//         const listPoint = []
//         for (let i = 0; i < managerHistory.length; i++) {
//             console.log('count: ', i)
//             userId = managerHistory[i].userId
//             let totalAggregate = await HistoryLogin.aggregate([{
//                     $match: {
//                         userId: userId,
//                         type: 1,
//                         // timeLogout: {$ne: 0},
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: null,
//                         total: {
//                             $sum: {
//                                 $subtract: [{
//                                         $cond: {
//                                             if: {
//                                                 $or: [
//                                                     { $eq: ["$timeLogout", 0] },
//                                                     { $eq: ["$timeLogout", null] }
//                                                 ]
//                                             },
//                                             then: now,
//                                             else: "$timeLogout",
//                                         },
//                                     },
//                                     "$timeLogin",
//                                 ],
//                             }
//                         },
//                         count: { $sum: 1 }
//                     }
//                 }
//             ])
//             let total = (totalAggregate[0] ? totalAggregate[0].total : 0);
//             let POINT_LIMIT = 10
//             let point = total / 3600
//             point = point > POINT_LIMIT ? POINT_LIMIT : point
//             const changePoint = point - managerHistory[i].point_time_active
//             const new_point_to_change = changePoint + managerHistory[i].point_to_change
//             const new_sum = changePoint + managerHistory[i].sum
//             const data = {
//                 userId,
//                 point,
//                 changePoint,
//                 new_point_to_change,
//                 new_sum,
//             }
//             listPoint.push(data)
//             await ManagerPointHistory.updateOne({
//                 userId,
//                 type: 1,
//             }, {
//                 point_time_active: point,
//                 point_to_change: new_point_to_change,
//                 sum: new_sum,
//             })
//         }
//         return functions.success(res, "Thành công", { listPoint });
//     } catch (error) {
//         console.log(error);
//         return functions.setError(res, "Đã xảy ra lỗi", 500);
//     }
// }

exports.historyAll = async(req, res) => {
    try {
        let {
            userId,
            userType
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (userType == 1) {
            let [
                historyPoint,
                saveExchangePoints,
                historyOnsite,
                candidateSeen,
                pointSeenUv,
                listNewShare,
                listUserShare,
                listUrlShare,
                starRating,
                listUvSeen,
                listCommentNew,
                listCommentNTD,
                applyData,
                onsiteData,
                vipData,
            ] = await Promise.all([
                getHistoryPoint(userId, userType),
                getSaveExchangePoints(userId, userType),
                getOnsiteHistory(userId, userType),
                getCandidateSeen(userId, userType),
                getPointSeenUv(userId, userType),
                getListNewShare(userId, userType),
                getListUserShare(userId, userType),
                getListUrlShare(userId, userType),
                getStarRating(userId, userType),
                getListUvSeen(userId, userType),
                getListCommentNew(userId, userType),
                getListCommentNTD(userId, userType),
                getApplyData(userId, userType),
                getOnsiteData(userId, userType),
                getVipData(userId, userType),
            ])

            let exchangedPoints = (await SaveExchangePoint.find({
                userId,
                userType
            })).reduce((acc, val) => acc + val.point, 0);
            return functions.success(res, "Thành công", {
                data: {
                    historyPoint,
                    exchangedPoints,
                    saveExchangePoints,
                    historyOnsite,
                    candidateSeen,
                    pointSeenUv,
                    listNewShare,
                    listUserShare,
                    listUrlShare,
                    starRating,
                    listUvSeen,
                    listCommentNew,
                    listCommentNTD,
                    applyData,
                    onsiteData,
                    vipData,
                }
            })
        } else {
            const user = await Users.findOne({ idTimViec365: userId, type: userType })
            if (!user) return functions.setError(res, 'Không tìm thấy dữ liệu người dùng')
            const idChat = user._id
            let [
                historyPoint,
                saveExchangePoints,
                historyOnsite,
                listNewShare,
                listUserShare,
                listUrlShare,
                starRating,
                onsiteData,
                seenNewsOrCompanyDetails,
                NTDSeen,
                listHistoryChat,
                NtdEvaluate,
            ] = await Promise.all([
                getHistoryPoint(userId, userType),
                getSaveExchangePoints(userId, userType),
                getOnsiteHistory(userId, userType),
                getListNewShare(userId, userType),
                getListUserShare(userId, userType),
                getListUrlShare(userId, userType),
                getStarRating(userId, userType),
                getOnsiteData(userId, userType),
                getSeenNewsOrCompanyDetails(userId, userType),
                getNTDSeen(userId, userType),
                getListHistoryChat(idChat, userType),
                getNtdEvaluate(userId, userType),
            ])
            let exchangedPoints = (await SaveExchangePoint.find({
                userId,
                userType
            })).reduce((acc, val) => acc + val.point, 0);
            return functions.success(res, "Thành công", {
                data: {
                    historyPoint,
                    saveExchangePoints,
                    exchangedPoints,
                    historyOnsite,
                    listNewShare,
                    listUserShare,
                    listUrlShare,
                    starRating,
                    onsiteData,
                    seenNewsOrCompanyDetails,
                    NTDSeen,
                    listHistoryChat,
                    NtdEvaluate,
                }
            })
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }

}

exports.getOnsiteHistory = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getOnsiteHistory(userId, userType, skip, limit, dateFrom, dateTo)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}
exports.getCandidateSeen = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getCandidateSeen(userId, userType, skip, limit, dateFrom, dateTo)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}
exports.getPointSeenUv = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getPointSeenUv(userId, userType, skip, limit, dateFrom, dateTo)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}
exports.getListNewShare = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getListNewShare(userId, userType, skip, limit, dateFrom, dateTo)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}
exports.getListUrlShare = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getListUrlShare(userId, userType, skip, limit, dateFrom, dateTo)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}
exports.getListUserShare = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getListUserShare(userId, userType, skip, limit, dateFrom, dateTo)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}
exports.getListUvSeen = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getListUvSeen(userId, userType, skip, limit, dateFrom, dateTo);
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}
exports.getListCommentNew = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getListCommentNew(userId, userType, skip, limit, dateFrom, dateTo)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}
exports.getListCommentNTD = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getListCommentNTD(userId, userType, skip, limit, dateFrom, dateTo)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}
exports.getOnsiteData = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getOnsiteData(userId, userType, skip, limit, dateFrom, dateTo)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}

exports.getSaveExchangePoints = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getSaveExchangePoints(userId, userType, skip, limit, dateFrom, dateTo)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}

exports.getAppliedList = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo,
            isSeen
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getAppliedList(userId, userType, isSeen, skip, limit, dateFrom, dateTo)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}

exports.getSeenNewsOrCompanyDetails = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getSeenNewsOrCompanyDetails(userId, userType, skip, limit, dateFrom, dateTo)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}

exports.getNTDSeen = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getNTDSeen(userId, userType, skip, limit, dateFrom, dateTo)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}

exports.getDetailExChangedPoints = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getDetailExChangedPoints(userId, userType, skip, limit, dateFrom, dateTo)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}

exports.getNtdEvaluate = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getNtdEvaluate(userId, userType, skip, limit, dateFrom, dateTo)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}

exports.getListHistoryChat = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo,
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        const user = await Users.findOne({ idTimViec365: userId, type: userType })
        if (!user) return functions.setError(res, 'Không tìm thấy dữ liệu người dùng')
        const idChat = user._id
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getListHistoryChat(idChat, userType, skip, limit, dateFrom, dateTo)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}

exports.getListHistoryChatDetail = async(req, res) => {
    try {
        let {
            page,
            limit,
            userId,
            userType,
            dateFrom,
            dateTo,
            isSeen
        } = req.body;
        if (!userId || !userType) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        userType = Number(userType);
        const user = await Users.findOne({ idTimViec365: userId, type: userType })
        if (!user) return functions.setError(res, 'Không tìm thấy dữ liệu người dùng')
        const idChat = user._id
        if (!page) page = 1;
        if (!limit) limit = 5;
        let skip = (page - 1) * limit;
        let data = await getListHistoryChatDetail(idChat, userType, skip, limit, dateFrom, dateTo, isSeen)
        return functions.success(res, "Thành công", { data: data });
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}

const getObjectValueLength = (obj) => {
    let totalLength = 0;

    // Duyệt qua tất cả các thuộc tính của object
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            // Kiểm tra nếu giá trị là một object, thực hiện đệ quy để tính độ dài của giá trị trong object con
            if (typeof value === 'object' && value !== null) {
                totalLength += getObjectValueLength(value);
            } else {
                // Nếu giá trị không phải là object, tính độ dài của giá trị
                totalLength += String(value).length;
            }
        }
    }

    return totalLength;
}

exports.calPointEvaluateCv = async(req, res) => {
    try {
        let userId = req.body.userId;
        let type = req.body.type;
        if (!userId || !type) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        type = Number(type);
        const user = await Users.findOne({ type, idTimViec365: userId });
        if (!user) return functions.setError(res, "Không tìm thấy dữ liệu người dùng")
        const cvCandi = await SaveCvCandi.find({ uid: userId, delete_cv: 0 }, 'html');
        let htmlArr = []
        for (let i = 0; i < cvCandi.length; i++) {
            const textNoHTML = sanitizeHtml(cvCandi[i].html, {
                allowedTags: [],
                allowedAttributes: {},
            })
            let totalContent = 0
            if (functions.isJSON(textNoHTML)) {
                const trimmedJson = JSON.parse(textNoHTML.replace(/\\n/g, '').trim().replace(/\s+/g, ' '));
                const exp = trimmedJson.experiences
                for (let j = 0; j < exp.length; j++) {
                    exp[j] = exp[j].content.content
                    totalContent += getObjectValueLength(exp[j])
                }
            }
            htmlArr[i] = totalContent
        }
        const lengthCV = functions.calculateAverage(htmlArr)
        let point = 0
        if (lengthCV < 200) point = -10
        else if (lengthCV >= 200 && lengthCV < 500) point = 0
        else if (lengthCV >= 500 && lengthCV < 1000) point = 5
        else point = 10
        await ManagerPointHistory.updateOne({ userId, type }, {
            point_evaluate_cv: point
        })
        return functions.success(res, "Thành công");
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}

exports.calPointChatUv = async(req, res) => {
    try {
        let userId = req.body.userId;
        let type = req.body.type;
        if (!userId || !type) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        userId = Number(userId);
        type = Number(type);
        const user = await Users.findOne({ type, idTimViec365: userId });
        if (!user) return functions.setError(res, "Không tìm thấy dữ liệu người dùng")
        const idChat = user._id
        const totalChatData = Conversation.aggregate([{
                $match: {
                    isGroup: 0,
                    $expr: { $gt: [{ $size: "$messageList" }, 1] },
                    memberList: { $elemMatch: { memberId: idChat } },
                }
            },
            {
                $project: {
                    NTD_id: {
                        $map: {
                            input: '$memberList',
                            as: "member",
                            in: {
                                $cond: [
                                    { $ne: ["$$member.memberId", idChat] },
                                    "$$member.memberId",
                                    null
                                ]
                            }
                        }
                    },
                    memberList: {
                        $map: {
                            input: '$memberList',
                            as: "member",
                            in: {
                                $cond: [
                                    { $ne: ["$$member.memberId", idChat] },
                                    "$$member",
                                    null
                                ]
                            }
                        }
                    },
                }
            },
            { $unwind: "$memberList" },
            { $unwind: "$NTD_id" },
            {
                $match: {
                    $expr: {
                        $and: [
                            { $ne: ["$NTD_id", null] },
                            { $ne: ["$memberList", null] },
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: "Users",
                    let: { user_id: "$NTD_id" },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$idTimViec365", "$$user_id"] },
                                    { $eq: ["$type", 1] }
                                ]
                            }
                        }
                    }],
                    as: "user"
                }
            },
            { $unwind: "$user" },
            { $unset: 'user' },
            {
                $count: 'total'
            },
        ])
        const totalRepData = Conversation.aggregate([{
                $match: {
                    isGroup: 0,
                    $expr: { $gt: [{ $size: "$messageList" }, 1] },
                    memberList: { $elemMatch: { memberId: idChat } },
                    messageList: { $elemMatch: { senderId: idChat } },
                }
            },
            {
                $project: {
                    NTD_id: {
                        $map: {
                            input: '$memberList',
                            as: "member",
                            in: {
                                $cond: [
                                    { $ne: ["$$member.memberId", idChat] },
                                    "$$member.memberId",
                                    null
                                ]
                            }
                        }
                    },
                    memberList: {
                        $map: {
                            input: '$memberList',
                            as: "member",
                            in: {
                                $cond: [
                                    { $ne: ["$$member.memberId", idChat] },
                                    "$$member",
                                    null
                                ]
                            }
                        }
                    },
                }
            },
            { $unwind: "$memberList" },
            { $unwind: "$NTD_id" },
            {
                $match: {
                    $expr: {
                        $and: [
                            { $ne: ["$NTD_id", null] },
                            { $ne: ["$memberList", null] },
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: "Users",
                    let: { user_id: "$NTD_id" },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$idTimViec365", "$$user_id"] },
                                    { $eq: ["$type", 1] }
                                ]
                            }
                        }
                    }],
                    as: "user"
                }
            },
            { $unwind: "$user" },
            { $unset: 'user' },
            {
                $count: 'total'
            },
        ])
        const [Chat, Rep] = await Promise.all([totalChatData, totalRepData])
        const totalChat = Chat[0] ? Chat[0].total : 0
        const totalRep = Rep[0] ? Rep[0].total : 0
        const totalUnRep = totalChat - totalRep
        let point = 0
        if (totalChat === 0) point -= 20
        else {
            if (totalRep >= 0 && totalRep < 20) point += totalRep
            else point += 20
            if (totalUnRep >= 0 && totalUnRep < 20) point -= totalUnRep
            else point -= 20
        }
        await ManagerPointHistory.updateOne({ userId, type }, {
            point_chat_uv: point
        })
        return functions.success(res, "Thành công");
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}

exports.calPointNtdSeen = async(req, res) => {
    try {
        const {
            userId,
            type,
            user_id_seen,
            user_type_seen,
        } = req.body
        if (!userId || !type || !user_id_seen || !user_type_seen) return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        let isDuplicated = await SaveSeeRequest.findOne({
            userIdBeSeen: userId,
            typeIdBeSeen: type,
            userId: user_id_seen,
            type: user_type_seen,
        });
        if (!isDuplicated) {
            const now = functions.getTimeNow()
            const id = await functions.getMaxIdByField(SaveSeeRequest, 'id')
            await new SaveSeeRequest({
                id,
                userIdBeSeen: userId,
                typeIdBeSeen: type,
                userId: user_id_seen,
                type: user_type_seen,
                time: now
            }).save()
            if (type == 0) {
                let point = 1
                let POINT_LIMIT = 10
                let history = await ManagerPointHistory.findOne({ userId: userId, type: 0 });
                if (history) {
                    let oldPoints = history.point_ntd_seen;
                    history.point_ntd_seen = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
                } else {
                    point = point > POINT_LIMIT ? POINT_LIMIT : point;
                    history = new ManagePointHistory({
                        userId: userId,
                        type: 0,
                        point_ntd_seen: point,
                        sum: point
                    });
                }
                await saveHistory(history)
            }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}

exports.calPointNtdEvaluate = async(req, res) => {
    try {
        const {
            userId,
            type,
            user_id_vote,
            user_type_vote,
            star,
        } = req.body
        if (!userId || !type || !user_id_vote || !user_type_vote || !star) return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        let isDuplicated = await SaveVoteCandidate.findOne({
            userId: user_id_vote,
            user_type_vote,
            type_be_vote: userId,
            type_be_vote: user_type_vote,
        });
        if (!isDuplicated) {
            const now = functions.getTimeNow()
            const id = await functions.getMaxIdByField(SaveVoteCandidate, 'id')
            await new SaveVoteCandidate({
                id,
                userId: user_id_vote,
                user_type_vote,
                id_be_vote: userId,
                type_be_vote: user_type_vote,
                star,
                time: now
            }).save()
            if (type == 0) {
                let point = 1 / 2
                let POINT_LIMIT = 10
                let history = await ManagerPointHistory.findOne({ userId: userId, type: 0 });
                if (history) {
                    let oldPoints = history.point_ntd_evaluate;
                    history.point_ntd_evaluate = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
                } else {
                    point = point > POINT_LIMIT ? POINT_LIMIT : point;
                    history = new ManagePointHistory({
                        userId: userId,
                        type: 0,
                        point_ntd_evaluate: point,
                        sum: point
                    });
                }
                await saveHistory(history)
            }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}

exports.calPointSeenNewNtd = async(req, res) => {
    try {
        const {
            userId,
            type,
            userIdBeSeen,
            typeIdBeSeen,
            newId,
        } = req.body
        let checkNtd = false
        let checkNew = false
        if (userIdBeSeen && typeIdBeSeen) checkNtd = true
        if (newId) checkNew = true
        if (!userId || !type) return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        if (!checkNtd && !checkNew) return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        if (checkNtd) {
            let isDuplicated = await SaveSeeRequest.findOne({ userId, type, userIdBeSeen, typeIdBeSeen });
            if (!isDuplicated) {
                const now = functions.getTimeNow()
                const id = await functions.getMaxIdByField(SaveSeeRequest, 'id')
                await new SaveSeeRequest({
                    id,
                    userId,
                    type,
                    userIdBeSeen,
                    typeIdBeSeen,
                    time: now,
                }).save()
                if (type == 0) {
                    let point = 1 / 10
                    let POINT_LIMIT = 10
                    let history = await ManagerPointHistory.findOne({ userId: userId, type: 0 });
                    if (history) {
                        let oldPoints = history.point_seen_new_ntd;
                        history.point_seen_new_ntd = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
                    } else {
                        point = point > POINT_LIMIT ? POINT_LIMIT : point;
                        history = new ManagePointHistory({
                            userId: userId,
                            type: 0,
                            point_seen_new_ntd: point,
                            sum: point
                        });
                    }
                    await saveHistory(history)
                }
            }
        }
        if (checkNew) {
            let isDuplicated = await SaveSeeRequest.findOne({ userId, type, newId, });
            if (!isDuplicated) {
                const now = functions.getTimeNow()
                const id = await functions.getMaxIdByField(SaveSeeRequest, 'id')
                await new SaveSeeRequest({
                    id,
                    userId,
                    type,
                    newId,
                    time: now
                }).save()
                if (type == 0) {
                    let point = 1 / 10
                    let POINT_LIMIT = 10
                    let history = await ManagerPointHistory.findOne({ userId: userId, type: 0 });
                    if (history) {
                        let oldPoints = history.point_seen_new_ntd;
                        history.point_seen_new_ntd = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
                    } else {
                        point = point > POINT_LIMIT ? POINT_LIMIT : point;
                        history = new ManagePointHistory({
                            userId: userId,
                            type: 0,
                            point_seen_new_ntd: point,
                            sum: point
                        });
                    }
                    await saveHistory(history)
                }
            }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}

exports.calPointSeenInfoUv = async(req, res) => {
    try {

        const { userId, type } = req.body;
        // console.log("calPointSeenInfoUv", req.body);
        if (!userId || !type) return functions.setError(res, "Thiếu dữ liệu truyền lên")
        let total = await PointUsed.find({
            usc_id: userId,
            used_day: { $gt: 1687315166 },
            use_id: { $ne: 0 },
        }).count();
        let point = total / 50
        let POINT_LIMIT = 20
        let history = await ManagerPointHistory.findOne({
            userId,
            type,
        })
        if (history) {
            history.point_use_point = point < POINT_LIMIT ? point : POINT_LIMIT;
        } else {
            point = point > POINT_LIMIT ? POINT_LIMIT : point;
            history = new ManagerPointHistory({
                userId,
                type,
                point_use_point: point,
                sum: point
            });
        }
        await saveHistory(history)
        return functions.success(res, "Thành công");
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}

// cập nhật trường new_seen khi NTD xem thông tin UV
exports.updateSttSeenUv = async(req, res) => {
    try {
        let {
            idUv,
            idNtd
        } = req.body;
        if (!idUv || !idNtd) return functions.setError(res, "Không đủ thông tin truyền lên", 400);
        // lấy ds tin tuyển dụng của NTD
        let listNew = await NewTV365.find({ new_user_id: idNtd }).select("new_id");
        if (listNew.length) {
            let arrNew = listNew.map(item => item['new_id']);
            await ApplyForJob.updateMany({
                nhs_use_id: idUv,
                nhs_new_id: { $in: arrNew }
            }, {
                $set: { new_seen: 1 }
            })
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        console.log(error);
        return functions.setError(res, "Đã xảy ra lỗi", 500);
    }
}