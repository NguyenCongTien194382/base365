const AdminNhanSuUv = require('../../models/Timviec365/Admin/AdminNhanSuUv');
const AdminUser = require('../../models/Timviec365/Admin/AdminUser');
const Users = require('../../models/Users');

const axios = require('axios');
const FormData = require('form-data');

let domain = "timviec365.vn";
let InfoSupportTitle = "Hỗ trợ";
let companyID = 1191;
let fromConversation = 142015; //Nhóm gửi tin nhắn nhỡ NTD
let fromConversationCandidate = 161084; //Nhóm gửi tin nhắn nhỡ UV
let listIdOff = [235784, 187705, 300438, 380989]; //Các nhà a Chính yêu cầu tắt thông báo, 380989: duonghiepit1@gmail.com

const timeAllowSend = () => {
    return true;
}
const checkAllowSendByAdmin = (type = 1) => {
    return true;
}

const construct = async (idTimViec365, type) => {

    //Lấy thông tin user
    let matchUser = { idTimViec365 };
    if (type == 1) {
        matchUser.type = 1;
    } else {
        matchUser.type = { $ne: 1 };
    }
    let findUser = await Users.findOne(matchUser).lean();

    let email = findUser ? (findUser.email ? findUser.email : findUser.emailContact) : '',
        phone = findUser ? (findUser.phoneTK ? findUser.phoneTK : findUser.phone) : '',
        idChat = findUser ? findUser._id : 0,
        name = findUser ? findUser.userName : '';
    //Lấy thông tin KD
    let idKD = 0;
    if (findUser) {
        if (type == 1) {
            if (findUser.inForCompany) {
                let idBoPhan = findUser.inForCompany.usc_kd;
                //console.log("idBoPhan tìm được", idBoPhan);
                let checkAdminNTD = await AdminUser.findOne({
                    //adm_ntd: 1, 
                    adm_bophan: idBoPhan
                }).lean();
                if (checkAdminNTD) {
                    //console.log("checkAdminNTD tìm được", checkAdminNTD);
                    idKD = checkAdminNTD.emp_id_chat ? checkAdminNTD.emp_id_chat : checkAdminNTD.emp_id;
                    //console.log("id kinh doanh", idKD)
                }
            }
        } else {
            let checkAdminNS = await AdminNhanSuUv.findOne({ id_uv: findUser.idTimViec365, com_id: 3312 }).lean()
            if (checkAdminNS) {
                idKD = checkAdminNS.emp_id;
            }
        }
    }

    let liveChat = {
        ClientId: idChat + '_liveChatV2',
        ClientName: name,
        FromWeb: domain,
        FromConversation: fromConversation
    };
    let textEmail = email != '' ? `, Email: ${email}` : "",
        textPhone = phone != '' ? `, SĐT: ${phone}` : "",
        allowSendByAdmin = checkAllowSendByAdmin();
    console.log("id kinh doanh", idKD)
    if (phone == '0862026999') {
        idKD = 30571
    }
    let dataSend = {
        domain,
        email,
        phone,
        idChat,
        name,
        liveChat,
        textPhone,
        textEmail,
        InfoSupportTitle,
        companyID,
        idKD,
        fromConversation,
        allowSendByAdmin,
        listIdOff
    }
    return dataSend;
}


const callApiChat = async (dataSend) => {
    if (dataSend.idChat != 0 && dataSend.idKD != 0 && timeAllowSend() == true && dataSend.allowSendByAdmin == true && dataSend.listIdOff.indexOf(dataSend.idChat) == -1) {
        let dataMess = {
            ContactId: dataSend.idKD,
            SenderID: dataSend.companyID,
            Message: dataSend.messageShow,
            MessageType: 'text',
            LiveChat: JSON.stringify(dataSend.liveChat),
            InfoSupport: JSON.stringify({
                Title: dataSend.InfoSupportTitle,
                Status: 0,
            }),
            MessageInforSupport: dataSend.message,
        };
        let response = await axios.post("http://210.245.108.202:9000/api/message/SendMessage_v2", dataMess);
    }
}

//NTD đăng nhập (Đã ghép)
exports.login = async (idTimViec365) => {
    let dataSend = await construct(idTimViec365, 1);
    dataSend.InfoSupportTitle = "Đăng nhập";
    dataSend.message = "Xin chào, tôi tên là " + dataSend.name + dataSend.textPhone + dataSend.textEmail + ", tôi vừa đăng nhập tài khoản nhà tuyển dụng trên " + dataSend.domain + ", tôi cần bạn hỗ trợ! ";
    // if (dataSend.email == 'viettop8462@gmail.com') { //Đ/c Long test
    //     dataSend.idKD = 7652;
    // }
    // if (dataSend.email == 'thanh99@gmail.com') { 
    //     dataSend.idKD = 12483;
    // }
    dataSend.messageShow = dataSend.name + " vừa đăng nhập tài khoản nhà tuyển dụng trên " + dataSend.domain;
    // console.log(dataSend);
    callApiChat(dataSend);
}

//NTD đổi mật khẩu (Đã ghép)
exports.changePass = async (idTimViec365) => {
    let dataSend = await construct(idTimViec365, 1);
    dataSend.InfoSupportTitle = "Đổi mật khẩu";
    dataSend.message = "Xin chào, tôi tên là " + dataSend.name + dataSend.textPhone + dataSend.textEmail + ", tôi vừa đổi mật khẩu tài khoản nhà tuyển dụng trên " + dataSend.domain + ", tôi cần bạn hỗ trợ!";
    dataSend.messageShow = dataSend.name + " vừa đổi mật khẩu tài khoản nhà tuyển dụng trên " + dataSend.domain;
    callApiChat(dataSend);
}

//NTD đăng tin  (Đã ghép)
exports.createNew = async (idTimViec365) => {
    let dataSend = await construct(idTimViec365, 1);
    dataSend.InfoSupportTitle = "Đăng tin";
    dataSend.message = "Xin chào, tôi tên là " + dataSend.name + dataSend.textPhone + dataSend.textEmail + ", tôi vừa đăng tin tuyển dụng mới trên " + dataSend.domain + ", tôi cần bạn hỗ trợ!";
    dataSend.messageShow = dataSend.name + " vừa đăng tin tuyển dụng mới trên " + dataSend.domain;
    callApiChat(dataSend);
}

//NTD sửa tin (Đã ghép)
exports.editNew = async (idTimViec365) => {
    let dataSend = await construct(idTimViec365, 1);
    dataSend.InfoSupportTitle = "Sửa tin";
    dataSend.message = "Xin chào, tôi tên là " + dataSend.name + dataSend.textPhone + dataSend.textEmail + ", tôi vừa sửa tin tuyển dụng trên " + dataSend.domain + ", tôi cần bạn hỗ trợ!";
    dataSend.messageShow = dataSend.name + " vừa sửa tin tuyển dụng trên " + dataSend.domain;
    callApiChat(dataSend);
}

//NTD đăng ký (Đã ghép)
exports.registerCompany = async (idTimViec365) => {
    let dataSend = await construct(idTimViec365, 1);
    dataSend.InfoSupportTitle = "Đăng ký";
    dataSend.message = "Xin chào, tôi tên là " + dataSend.name + dataSend.textPhone + dataSend.textEmail + ", tôi vừa đăng ký tài khoản NTD trên " + dataSend.domain + ", tôi cần bạn hỗ trợ!";
    dataSend.messageShow = dataSend.name + " vừa đăng ký tài khoản NTD trên " + dataSend.domain;
    callApiChat(dataSend);
}

//UV đăng ký
exports.registerUser = async (idTimViec365) => {
    let dataSend = await construct(idTimViec365, 0);
    dataSend.InfoSupportTitle = "Đăng ký";
    dataSend.message = "Xin chào, tôi tên là " + dataSend.name + dataSend.textPhone + dataSend.textEmail + ", tôi vừa đăng ký tài khoản ứng viên trên " + dataSend.domain + ", tôi cần bạn hỗ trợ!";
    dataSend.messageShow = dataSend.name + " vừa đăng ký tài khoản ứng viên trên " + dataSend.domain;
    dataSend.liveChat.FromConversation = fromConversationCandidate;
    callApiChat(dataSend);
}

//UV đăng nhập
exports.candidateLogin = async (idTimViec365) => {
    let dataSend = await construct(idTimViec365, 0);
    dataSend.InfoSupportTitle = "Đăng nhập";
    dataSend.message = "Xin chào, tôi tên là " + dataSend.name + dataSend.textPhone + dataSend.textEmail + ", tôi vừa đăng nhập tài khoản ứng viên trên " + dataSend.domain + ", tôi cần bạn hỗ trợ!";
    dataSend.messageShow = dataSend.name + " vừa đăng nhập tài khoản ứng viên trên " + dataSend.domain;
    dataSend.liveChat.FromConversation = fromConversationCandidate;
    callApiChat(dataSend);
}


//Gửi thông UV úng tuyển về NTD
exports.NotificationTimviec365 = async (CompanyId, EmployeeId, EmployeeName, Link, city, career, uscid, title = '') => {
    try {
        const dataMess = {
            CompanyId, //_id NTD 
            EmployeeId, // _id UV
            EmployeeName, // Tên UV
            Link, // Link úng tuyển
            city, // Tỉnh thành
            career, // Ngành nghề
            uscid, // idTimviec NTD
            title
        };
        await axios.post("http://210.245.108.202:9000/api/message/NotificationTimviec365", dataMess);
    } catch (err) {
        console.log("NotificationTimviec365", err)
    }
}

//Gửi thông báo quả chuông về chat365
exports.SendNotification = async (data) => {
    try {
        const form = new FormData();
        for (const [key, value] of Object.entries(data)) {
            form.append(key, value);
        }
        let url = "http://210.245.108.202:9000/api/V2/Notification/SendNotification"
        if (data['SenderId']) {
            url = "http://210.245.108.202:9000/api/V2/Notification/SendNotification_v2";
        }
        return await axios.post(url, form);
    } catch (err) {
        console.log("SendNotification", err)
    }
}

//Gửi list thông báo quả chuông về chat365
exports.SendListNotification = async (jsonDataAPI) => {
    try {
        const form = new FormData();
        form.append('Data', jsonDataAPI);
        console.log(jsonDataAPI);
        let url = "http://210.245.108.202:9000/api/V2/Notification/SendListNotification"
        return await axios.post(url, form);
    } catch (err) {
        console.log("SendListNotification", err)
    }
}