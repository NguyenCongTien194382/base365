const cron = require('node-cron');
const time_stone = 1687315166; // thời điểm ra mắt chức năng
const User = require('../../../../models/Users');
const NewTV365 = require('../../../../models/Timviec365/UserOnSite/Company/New');
const ApplyForJob = require('../../../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');
const ManagePointHistory = require('../../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory');
const { saveHistory } = require('../utils');

const cronCallback = async() => {
    const limit = 10;
    let offset = 0;
    let flag = true;
    while (flag) {
        let data = await User.find({ type: 1 })
            .select('idTimViec365')
            .sort({ updatedAt: -1 })
            .skip(offset)
            .limit(limit);
        if (data.length) {
            offset = offset + 10;
            for (let i = 0; i < data.length; i++) {
                let userId = data[i].idTimViec365;
                let userType = 1;
                let history = await ManagePointHistory.findOne({
                    userId: userId,
                    type: 1,
                });
                if (history) {
                    // từng hoạt động

                    let listPost = await NewTV365.find({ new_user_id: userId });
                    if (listPost && listPost.length) {
                        // có bài post
                        let list_ho_so = await ApplyForJob.find({
                            nhs_new_id: { $in: listPost.map((r) => r.new_id) },
                        });
                        let point = 0;
                        for (let j = 0; j < list_ho_so.length; j++) {
                            if (list_ho_so[j].new_seen) {
                                point = point + 1;
                            } else {
                                if (list_ho_so[j].nhs_time > time_stone) {
                                    point = point - 1;
                                }
                            }
                        }

                        // tin không có ứng viên ứng tuyển
                        let point_sub = 0;
                        for (let j = 0; j < listPost.length; j++) {
                            if (!list_ho_so.find(
                                    (e) => e.nhs_new_id == listPost[j].new_id
                                )) {
                                if (listPost[j].new_create_time > time_stone) {
                                    point_sub = point_sub + 1;
                                }
                            }
                        }

                        // giới hạn dưới
                        let point_sub_limit = point_sub > 0 ? 15 : 0;
                        point = point - point_sub_limit;
                        if (point > 15) {
                            point = 15;
                        }

                        if (point < -15) {
                            point = -15;
                        }
                        let history = await ManagePointHistory.findOne({
                            userId: userId,
                            type: userType,
                        });
                        console.log(userId, point);
                        if (history) {
                            history.point_see_em_apply = point;
                        } else {
                            point = point;
                            history = new ManagePointHistory({
                                userId: userId,
                                type: userType,
                                point_to_change: point,
                                point_see_em_apply: point,
                                sum: point,
                            });
                        }
                        await saveHistory(history);
                    }
                }
            }
        } else {
            flag = false;
            console.log('Kết thúc tính điểm UVUT');
        }
    }
    console.log('Kết thúc hàm');
};

// Tool xem ứng viên ứng tuyển
console.log('Start');
cron.schedule('30 12 * * *', async() => {
    try {
        await cronCallback();
    } catch (e) {
        console.log(e);
    }
});

cron.schedule('30 0 * * *', async() => {
    try {
        await cronCallback();
    } catch (e) {
        console.log(e);
    }
});

const Tool = async() => {
    try {
        //await cronCallback();
    } catch (e) {
        console.log(e);
    }
};
Tool();
console.log('Seted');