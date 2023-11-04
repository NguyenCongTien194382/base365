const NewTV365 = require('../../models/Timviec365/UserOnSite/Company/New');

const AdminUser = require('../../models/Timviec365/Admin/AdminUser');
const PermissionNotify = require('../../models/Timviec365/PermissionNotify');

const functions = require('../../services/functions');
const serviceSendMess = require('../../services/timviec365/sendMess');
const sendMail = require('../../services/timviec365/sendMail');

const getListNewExpried = async(time_start, time_end) => {
    return await NewTV365.aggregate([{
            $match: {
                // new_han_nop: {
                //     $gte: time_start,
                //     $lte: time_end
                // },
                // new_user_id: { $ne: 0 }
                new_user_id: 236250
            },
        },
        {
            $limit: 1
        },
        {
            $lookup: {
                from: "Users",
                localField: "new_user_id",
                foreignField: "idTimViec365",
                as: "user"
            }
        }, {
            $unwind: "$user"
        }, {
            $match: { 'user.type': 1 }
        }, {
            $project: {
                new_id: 1,
                new_title: 1,
                new_alias: 1,
                new_han_nop: 1,
                chat365_id: "$user._id",
                new_user_id: 1,
                usc_kd: "$user.inForCompany.usc_kd",
            }
        }
    ]);
}

const getListNewExpriedGhim = async(time_start, time_end) => {
    return await NewTV365.aggregate([{
            $match: {
                // new_vip_time: {
                //     $gte: time_start,
                //     $lte: time_end
                // },
                // new_user_id: { $ne: 0 }
                new_user_id: 236250
            }
        },
        {
            $limit: 1
        },
        {
            $lookup: {
                from: "Users",
                localField: "new_user_id",
                foreignField: "idTimViec365",
                as: "user"
            }
        }, {
            $unwind: "$user"
        }, {
            $match: { 'user.type': 1 }
        }, {
            $project: {
                new_id: 1,
                new_title: 1,
                new_alias: 1,
                new_vip_time: 1,
                chat365_id: "$user._id",
                usc_kd: "$user.inForCompany.usc_kd",
                usc_email: "$user.email",
                usc_email_lh: "$user.emailContact",
                usc_company: "$user.userName",
                new_user_id: 1
            }
        }
    ]);
}

const getListAdmin = async() => {
    const list = await AdminUser.find({ adm_bophan: { $ne: 0 } }).select("adm_id adm_bophan emp_id emp_id_chat").lean();
    return list;
}

const getListPermission = async(listComId) => {
    return await PermissionNotify.find({ pn_usc_id: { $in: listComId }, pn_id_new: 0 });
}

const SendNotification = async() => {
    try {
        let listAdmin = await getListAdmin();
        const now = functions.getTimeNow();


        // Lấy danh sách tin sắp hết hạn
        const time_start = now + 259200,
            time_end = time_start + 46400;
        const listNewExpried = await getListNewExpried(time_start, time_end);

        // Lấy danh sách tin sắp hết hạn ghim tin
        const time_start_ghim = now + 86400,
            time_end_ghim = time_start_ghim + 46400;
        const listNewExpriedGhim = await getListNewExpriedGhim(time_start_ghim, time_end_ghim);
        let listIdCom = [];
        for (let i = 0; i < listNewExpried.length; i++) {
            const element = listNewExpried[i];
            if (listIdCom.indexOf(element.new_user_id) == -1) {
                listIdCom.push(element.new_user_id);
            }
        }
        for (let i = 0; i < listNewExpriedGhim.length; i++) {
            const element = listNewExpriedGhim[i];
            if (listIdCom.indexOf(element.new_user_id) == -1) {
                listIdCom.push(element.new_user_id);
            }
        }
        //Lấy danh sách tk phân quyền
        let listPermission = await getListPermission(listIdCom);

        for (let i = 0; i < listNewExpried.length; i++) {
            let data = [];
            const element = listNewExpried[i];
            const usc_kd = element.usc_kd;
            const Bussiness = listAdmin.find(e => e.adm_bophan == element.usc_kd);
            data.push({
                Title: "Tin tuyển dụng hết hạn nộp hồ sơ",
                Message: `Tin tuyển dụng ${element.new_title} sẽ hết hạn nộp hồ sơ vào ngày ${functions.convertDate(element.new_han_nop)})`,
                Type: "NTD",
                UserId: element.chat365_id,
                SenderId: 58384,
                Link: functions.renderAliasURL(element.new_id, element.new_title, element.new_alias),
                Id365Bussiness: Bussiness ? (Bussiness.emp_id_chat ? Bussiness.emp_id_chat : Bussiness.emp_id) : 0,
            });
            let checkPermission = listPermission.filter(e => e.pn_usc_id == element.new_user_id && (e.pn_id_new == 0 || e.pn_id_new == element.new_id));
            if (checkPermission.length) {
                checkPermission.forEach((permission) => {
                    data.push({
                        Title: "Tin tuyển dụng hết hạn nộp hồ sơ",
                        Message: `Tin tuyển dụng ${element.new_title} sẽ hết hạn nộp hồ sơ vào ngày ${functions.convertDate(element.new_han_nop)})`,
                        Type: "NTD",
                        UserId: permission.pn_id_chat,
                        SenderId: 58384,
                        Link: functions.renderAliasURL(element.new_id, element.new_title, element.new_alias),
                    });
                })
            }
            let jsonDataAPI = JSON.stringify(data);
            let res = await serviceSendMess.SendListNotification(jsonDataAPI);
            console.log(res.data);
        }



        for (let i = 0; i < listNewExpriedGhim.length; i++) {
            let data = [];
            const element = listNewExpriedGhim[i];
            const usc_kd = element.usc_kd;
            const Bussiness = listAdmin.find(e => e.adm_bophan == element.usc_kd);
            data.push({
                Title: "Tin tuyển dụng hết hạn ghim tin",
                Message: `Tin tuyển dụng ${element.new_title} sẽ hết hạn ghim tin vào ngày ${functions.convertDate(element.new_vip_time)})`,
                Type: "NTD",
                UserId: element.chat365_id,
                SenderId: 58384,
                Link: functions.renderAliasURL(element.new_id, element.new_title, element.new_alias),
                Id365Bussiness: Bussiness ? (Bussiness.emp_id_chat ? Bussiness.emp_id_chat : Bussiness.emp_id) : 0,
            });
            let checkPermission = listPermission.filter(e => e.pn_usc_id == element.new_user_id && (e.pn_id_new == 0 || e.pn_id_new == element.new_id));
            if (checkPermission.length) {
                checkPermission.forEach((permission) => {
                    data.push({
                        Title: "Tin tuyển dụng hết hạn ghim tin",
                        Message: `Tin tuyển dụng ${element.new_title} sẽ hết hạn ghim tin vào ngày ${functions.convertDate(element.new_vip_time)})`,
                        Type: "NTD",
                        UserId: permission.pn_id_chat,
                        SenderId: 58384,
                        Link: functions.renderAliasURL(element.new_id, element.new_title, element.new_alias),
                    });
                })
            }
            let jsonDataAPI = JSON.stringify(data);
            let res = await serviceSendMess.SendListNotification(jsonDataAPI);
            console.log(res.data);
            if (element.usc_email || element.usc_email_lh) {
                let subject = "Thông báo sắp hết hạn tin ghim",
                    link_chat = 'https://timviec365.vn/',
                    pin_pack = 'GÓI TIN GHIM',
                    date_pin = functions.convertDate(element.new_vip_time);
                let email = element.usc_email ? element.usc_email : element.usc_email_lh;
                sendMail.Send_exp_service(email, subject, element.usc_company, date_pin, link_chat, pin_pack);
            }
        }


        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

SendNotification();