const PermissionNotify = require('../../models/Timviec365/PermissionNotify');
const functions = require('../../services/functions');

exports.HandlePermissionNotify = async(userid, listPermissions, usertype = 'candidate', type = 'create') => {
    try {
        if (listPermissions) {
            const list = JSON.parse(listPermissions);
            let data = {
                pn_type: 0,
                pn_created_at: functions.getTimeNow()
            };
            if (usertype == 'candidate') {
                // Nếu là trường hợp update thì xóa đi
                if (type == 'update') {
                    await PermissionNotify.deleteMany({ pn_use_id: userid });
                }
                data.pn_use_id = userid;
                data.pn_usc_id = 0;
            } else {
                data.pn_usc_id = userid;
                data.pn_use_id = 0;
            }

            for (let i = 0; i < list.length; i++) {
                const element = list[i],
                    pn_id_chat = element.id_chat,
                    type_noti = element.type_noti,
                    itemMax = await PermissionNotify.findOne({}, { pn_id: 1 }).sort({ pn_id: -1 }).limit(1).lean();
                // Cập nhật type_noti và pn_id_chat
                data.pn_id = Number(itemMax.pn_id) + 1;
                data.pn_type_noti = type_noti;
                data.pn_id_chat = pn_id_chat;
                const item = new PermissionNotify(data);
                await item.save();
            }
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}