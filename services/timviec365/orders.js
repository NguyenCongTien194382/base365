const axios = require("axios");
const User = require("../../models/Users")
const AdminUser = require("../../models/Timviec365/Admin/AdminUser")
const functions = require("../../services/functions");
const { saveHistory } = require("../../controllers/timviec/history/utils");
const ManagerPointHistory = require("../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");
const SaveAccountVip = require("../../models/Timviec365/UserOnSite/ManageHistory/SaveAccountVip");

exports.random = (from, to) => {
    return Math.floor(Math.random() * (to - from)) + from;
}

// danh sách các loại chi tiết dịch vụ crm
const listServiceCRM = exports.listServiceCRM = (id) => {
    let arr = [{
            time: 2, // thời lượng(1:tháng, 2: tuần)
            city: 0, // tỉnh thành(0: chính, 1: khác)
            cate: 0, // ngành nghề(0: chính, 1: khác)
            price: 5000000 // Đơn giá
        },
        {
            time: 1,
            city: 0,
            cate: 0,
            price: 15000000
        },
        {
            time: 2,
            city: 1,
            cate: 0,
            price: 2000000
        },
        {
            time: 1,
            city: 1,
            cate: 0,
            price: 6000000
        },
        {
            time: 2,
            city: 0,
            cate: 1,
            price: 3500000
        },
        {
            time: 1,
            city: 0,
            cate: 1,
            price: 10500000
        },
        {
            time: 2,
            city: 1,
            cate: 1,
            price: 1400000
        },
        {
            time: 1,
            city: 1,
            cate: 1,
            price: 4200000
        }
    ];
    if (id > 0 && id <= 8) {
        return arr[id - 1];
    } else {
        return arr;
    }
}


// Gửi thông báo vào nhóm thanh toán đơn hàng
const sendMessageToGroupOrder = exports.sendMessageToGroupOrder = async(message, id_order = null) => {
    try {
        let dataGroup;
        // if (id_order != null) {
        //     dataGroup = { 
        //         ConversationID: '806102', // id nhóm thanh toán đơn hàng
        //         SenderID: '1192',
        //         MessageType: 'OfferReceive',
        //         Message: message,
        //         Link: 'https://timviec365.vn/admin/modules/orders/detail_of_supporter.php?id='+id_order
        //     };
        // } else {
        //     dataGroup = { 
        //         ConversationID: '806102', // id nhóm thanh toán đơn hàng
        //         SenderID: '1192',
        //         MessageType: 'text',
        //         Message: message
        //     };
        // }
        if (id_order != null) {
            dataGroup = {
                ConversationID: '806102', // id nhóm thanh toán đơn hàng
                SenderID: '1192',
                MessageType: 'OfferReceive',
                Message: message,
                Link: 'https://dev.timviec365.vn/admin/modules/orders/detail_of_supporter.php?id=' + id_order
            };
        } else {
            dataGroup = {
                ConversationID: '806102', // id nhóm thanh toán đơn hàng
                SenderID: '1192',
                MessageType: 'text',
                Message: message
            };
        }
        const sendGroup = await axios.post('http://210.245.108.202:9000/api/message/SendMessage', dataGroup);
        return true;
    } catch (e) {
        console.log('error SendMessageToGroupOrder', e);
        return false;
    }
}


// Gửi tin nhắn từ tài khoản công ty Hưng hà đến người nhận là id quản lý chung
const sendMessageToIdQlc = exports.sendMessageToIdQlc = async(message, ContactId, id_order = null) => {
    try {
        let data;
        // if (id_order != null) {
        //     data = { 
        //         ContactId: ContactId,
        //         SenderID: '1192',
        //         MessageType: 'OfferReceive',
        //         Message: message,
        //         Link: 'https://timviec365.vn/admin/modules/orders/detail_of_supporter.php?id='+id_order
        //     };
        // } else {
        //     data = { 
        //         ContactId: ContactId,
        //         SenderID: '1192',
        //         MessageType: 'text',
        //         Message: message
        //     };
        // }
        if (id_order != null) {
            data = {
                ContactId: ContactId,
                SenderID: '1192',
                MessageType: 'OfferReceive',
                Message: message,
                Link: 'https://dev.timviec365.vn/admin/modules/orders/detail_of_supporter.php?id=' + id_order
            };
        } else {
            data = {
                ContactId: ContactId,
                SenderID: '1192',
                MessageType: 'text',
                Message: message
            };
        }
        const send = await axios.post('http://43.239.223.142:9000/api/message/SendMessage_v3', data);
        return true;
    } catch (e) {
        console.log('error sendMessageToIdQlc', e);
        return false;
    }
}

// gửi thông tin đơn hàng vào chat365 cho chuyên viên và nhóm thanh toán hóa đơn
exports.sendMessageToSupporter = async(adm_qlc, code_order, name, phone, adm_name, final_price, id_order) => {
    try {
        let message = `Thông tin đơn hàng \n
             - Tên khách hàng: ${name} \n - Số điện thoại: ${phone} \n - Chuyên viên chăm sóc: ${adm_name} \n
             - Mã đơn hàng: ${code_order} \n - Tổng tiền thanh toán: ${Number(final_price).toLocaleString('vi-VN')} vnđ`;
        await sendMessageToIdQlc(message, adm_qlc, id_order);
        await sendMessageToGroupOrder(message, id_order);
        return true;
    } catch (e) {
        console.log('error sendMessageToSupporter');
        return false;
    }
}


// Gửi tin nhắn từ tài khoản công ty Hưng hà đến người nhận là idchat365
const sendMessageToIdChat = exports.sendMessageToIdChat = async(message, ContactId) => {
    try {
        // let data = { 
        //     UserID: ContactId,
        //     SenderID: '1192',
        //     MessageType: 'text',
        //     Message: message
        // };
        let data = {
            UserID: ContactId,
            SenderID: '1192',
            MessageType: 'text',
            Message: message
        };
        const send = await axios.post('http://210.245.108.202:9000/api/message/SendMessageIdChat', data);
        return true;
    } catch (e) {
        console.log('error SendMessageToIdChat', e);
        return false;
    }
}


exports.renderServiceDetailCRM = (id_service, type_service) => {
    let info = listServiceCRM(id_service);
    let time_service_crm = '1 ' + ((info.time == 1) ? 'THÁNG' : 'TUẦN');
    let name_service_crm = ((info.cate == 0) ? 'NGÀNH NGHỀ CHÍNH' : 'NGÀNH NGHỀ KHÁC') + ' + ' + ((info.city == 0) ? 'HÀ NỘI/HỒ CHÍ MINH' : 'TỈNH THÀNH KHÁC');
    let info_service_crm = {
        bg_id: id_service,
        bg_tuan: time_service_crm + ' - ' + name_service_crm,
        bg_gia: info.price,
        bg_chiet_khau: 0,
        bg_thanh_tien: info.price,
        bg_vat: info.price + ((info.price * 10) / 100),
        bg_type: type_service
    };
    return info_service_crm;
}

exports.userExists = async(usc_id, type) => {
    try {
        let user = await User.findOne({ idTimViec365: usc_id, type });
        if (!user) return false;
        return true;
    } catch (error) {
        return false;
    }
}

exports.adminExists = async(id) => {
    try {
        let admin = await AdminUser.findOne({ adm_bophan: id });
        if (admin) return true;
        return false;
    } catch (e) {
        console.log("CheckExistAdmin", e)
        return false;
    }
}
exports.updateVipNTD = async(userId, otp, vip) => {
    try {
        vip = Number(vip);
        let time = functions.getTimeNow();
        let point = 0;
        if (vip < 1) vip = 1;
        if (vip > 6) vip = 6;
        if (vip == 1) point = 2;
        if (vip == 2) point = 4;
        if (vip == 3) point = 8;
        if (vip == 4) point = 9;
        if (vip == 5) point = 10;
        if (vip == 6) point = 11;

        let update = {};
        let user = await User.findOne({ idTimViec365: userId, type: 1 });
        if (!user) return false;
        if ((otp > 0 && vip == 1) && (String(otp) !== String(user.inForCompany.timviec365.usc_xacthuc_email)))
            return false;

        update["inForCompany.timviec365.usc_vip"] = vip;
        await User.updateOne({ idTimViec365: userId, type: 1 }, {
            $set: update
        });
        await (new SaveAccountVip({
            userId: userId,
            userType: 1,
            type_vip: vip,
            time: time
        })).save();
        let history = await ManagerPointHistory.findOne({ userId: userId, type: 1 });
        if (history) {
            history.point_vip = point;
        } else {
            history = new ManagerPointHistory({
                userId: userId,
                type: 1,
                point_to_change: point,
                point_vip: point,
                sum: point
            });
        }
        await saveHistory(history);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}