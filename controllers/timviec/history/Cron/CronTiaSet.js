const cron = require('node-cron');
const time_stone = 1687315166; // thoi di?m b?t d?u ch?y tia s�t
const User = require('../../../../models/Users');
const NewTV365 = require('../../../../models/Timviec365/UserOnSite/Company/New');
const ApplyForJob = require('../../../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');
const ManagePointHistory = require('../../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory');
const { saveHistory } = require('../utils');

const cronTiaSetUngVien = async() => {
    const limit = 100;
    let offset = 0;
    let flag = true;
    while (flag) {
        let now = Math.floor(new Date().getTime() / 1000);
        let applications = await ApplyForJob.find({
                nhs_time: { $gt: time_stone },
            })
            .sort({ nhs_id: -1 })
            .skip(offset)
            .limit(limit);
        if (applications.length) {
            offset = offset + 100;
            for (let i = 0; i < applications.length; i++) {
                let anhsao_badge = 0;
                const new_id = applications[i].nhs_new_id;
                const user_id = applications[i].nhs_use_id;
                let newsData = NewTV365.findOne({
                    new_han_nop: { $gt: now },
                    new_id,
                }).select('new_han_nop');
                let userData = User.findOne({
                    type: 0,
                    idTimViec365: user_id,
                }).select('updatedAt fromDevice');
                let [news, user] = await Promise.all([newsData, userData]);
                const han_nop = news && news.new_han_nop ? news.new_han_nop : 0;
                const nhs_time = applications[i].nhs_time;
                const update_at = user && user.updatedAt ? user.updatedAt : 0;
                if (update_at > nhs_time && update_at < han_nop) {
                    if (now - nhs_time <= 86400 * 2) {
                        if (user && user.fromDevice === 1) {
                            anhsao_badge = 3;
                        } else {
                            anhsao_badge = 2;
                        }
                    } else {
                        anhsao_badge = 1;
                    }
                }
                if (user) {
                    await User.updateOne({ idTimViec365: user_id, type: 0 }, {
                        'inForPerson.candidate.anhsao_badge': anhsao_badge,
                    });
                }
                const dataPoint = await ManagePointHistory.findOne({
                    type: 0,
                    userId: user_id,
                });
                let point_TiaSet = 0;
                if (anhsao_badge > 0) point_TiaSet = 10;
                else point_TiaSet = 0;
                // console.log(
                //     'Id: ',
                //     user_id,
                //     'anhsao_badge: ',
                //     anhsao_badge,
                //     'point_TiaSet: ',
                //     point_TiaSet
                // );
                if (dataPoint) {
                    let change_sum = point_TiaSet - dataPoint.point_TiaSet;
                    let new_sum = dataPoint.sum + change_sum;
                    let new_point_to_change =
                        dataPoint.point_to_change + change_sum;
                    await ManagePointHistory.updateOne({
                        type: 0,
                        userId: user_id,
                    }, {
                        sum: new_sum,
                        point_to_change: new_point_to_change,
                        point_TiaSet: point_TiaSet,
                    });
                } else {
                    let dataId = await ManagePointHistory.findOne({}, { id: 1 })
                        .sort({ id: -1 })
                        .limit(1)
                        .lean();
                    const id = dataId ? dataId.id + 1 : 1;
                    await new ManagePointHistory({
                        id: id,
                        userId: user_id,
                        type: 0,
                        point_TiaSet: point_TiaSet,
                        sum: point_TiaSet,
                        point_to_change: point_TiaSet,
                    }).save();
                }
            }
        } else {
            flag = false;
            console.log('Kết thúc tia sét UV');
        }
    }
};

const cronTiaSetNTD = async() => {
    const limit = 100;
    let offset = 0;
    let flag = true;
    let count = 0;
    while (flag) {
        let now = new Date().getTime() / 1000;
        let news = await NewTV365.find({ new_han_nop: { $gt: now } })
            .sort({ new_id: -1 })
            .skip(offset)
            .limit(limit);
        if (news.length) {
            offset = offset + 100;
            for (let i = 0; i < news.length; i++) {
                try {
                    let badge = 0;
                    let applications = await ApplyForJob.find({
                        nhs_new_id: news[i].new_id,
                        nhs_time: { $gt: time_stone },
                    });
                    count = count + 1;
                    if (applications.length >= 2) {
                        let rate = 0;
                        let count = 0;
                        for (let j = 0; j < applications.length; j++) {
                            if (applications[j].new_seen == 1) {
                                count = count + 1;
                            }
                        }
                        rate = count / applications.length;
                        if (rate >= 0.6) {
                            badge = 1;
                        }
                    }
                    console.log(count, badge);
                    // if (news[i].new_user_id === 1111111514) {
                    //     console.log(applications.length)
                    //     console.log('==============================')
                    //     console.log(count, badge, news[i].new_user_id)
                    // }
                    if (news[i].new_badge != badge) {
                        await NewTV365.updateOne({ new_id: news[i].new_id }, {
                            new_badge: badge,
                        });
                        if (badge == 0) {
                            let check = await NewTV365.findOne({
                                new_user_id: news[i].new_user_id,
                                new_badge: 1,
                            });
                            if (!check) {
                                await User.updateOne({
                                    idTimViec365: news[i].new_user_id,
                                    type: 1,
                                }, {
                                    $set: {
                                        'inForCompany.timviec365.usc_badge': 0,
                                    },
                                });
                            }
                        } else {
                            await User.updateOne({
                                idTimViec365: news[i].new_user_id,
                                type: 1,
                            }, {
                                $set: {
                                    'inForCompany.timviec365.usc_badge': 1,
                                },
                            });
                        }
                    }
                    if (badge == 1) {
                        await User.updateOne({ idTimViec365: news[i].new_user_id, type: 1 }, {
                            $set: {
                                'inForCompany.timviec365.usc_badge': 1,
                            },
                        });
                    }

                    let userId = news[i].new_user_id;
                    const dataPoint = await ManagePointHistory.findOne({
                        type: 1,
                        userId: userId,
                    });
                    let point_TiaSet = 0;
                    if (badge > 0) point_TiaSet = 5;
                    else point_TiaSet = 0;
                    if (dataPoint) {
                        let change_sum = point_TiaSet - dataPoint.point_TiaSet;
                        let new_sum = dataPoint.sum + change_sum;
                        let new_point_to_change =
                            dataPoint.point_to_change + change_sum;
                        await ManagePointHistory.updateOne({
                            type: 1,
                            userId: userId,
                        }, {
                            sum: new_sum,
                            point_to_change: new_point_to_change,
                            point_TiaSet: point_TiaSet,
                        });
                    } else {
                        let dataId = await ManagePointHistory.findOne({}, {}, { sort: { id: -1 } }).lean();
                        const id = dataId ? dataId.id + 1 : 1;
                        await new ManagePointHistory({
                            id: id,
                            userId: userId,
                            type: 1,
                            point_TiaSet: point_TiaSet,
                            sum: point_TiaSet,
                            point_to_change: point_TiaSet,
                        }).save();
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        } else {
            flag = false;
            console.log('Kết thúc tia sét NTD');
        }
    }
    return true;
};

console.log('Start');
cron.schedule('0 12 * * *', async() => {
    try {
        await cronTiaSetNTD();
    } catch (e) {
        console.log(e);
        return false;
    }
});

cron.schedule('0 0 * * *', async() => {
    try {
        await cronTiaSetNTD();
    } catch (e) {
        console.log(e);
        return false;
    }
});

// cron.schedule('30 11 * * *', async () => {
//     try {
//         await cronTiaSetUngVien();
//     } catch (e) {
//         console.log(e);
//         return false;
//     }
// });

// cron.schedule('30 23 * * *', async () => {
//     try {
//         await cronTiaSetUngVien();
//     } catch (e) {
//         console.log(e);
//         return false;
//     }
// });

const Tool = async() => {
    try {
        // await cronTiaSetUngVien();
        //await cronTiaSetNTD();
    } catch (e) {
        console.log(e);
        return false;
    }
};
Tool();
console.log('Set');