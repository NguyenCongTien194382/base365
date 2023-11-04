var mongoose = require('mongoose')
const Users = require('./models/Users');
const serviceDataAI = require('./services/timviec365/dataAI');
const FormData = require('form-data');
const axios = require('axios')
const Tv365PointCompany = require('./models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany');



function removeVietnameseTones(str) {
    if (str && (str.trim()) && (str.trim() != "")) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, " ");
        str = str.trim();

        str = str.replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|{|}|\||\\/g, " ");
        return str;
    } else {
        return ""
    }
}

const ToolPushDataUvToElasticToSearch = async() => {
    try {
        let stone = new Date().getTime() / 1000 - 12 * 60 * 60;
        // let listUser = await Users.find({
        //     createdAt: { $gte: stone },
        //     type: 0,
        //     fromDevice: 7
        // }).lean();
        let listUser = await Users.find({ idTimViec365: 1395555, type: 0 }).lean();
        for (let i = 0; i < listUser.length; i++) {
            console.log(listUser[i].idTimViec365)
            let findUser = listUser[i];
            let dataSearchAI = {
                use_id: findUser.idTimViec365,
                use_update_time: new Date().getTime() % 1000,
                percents: 50
            }
            const response = await serviceDataAI.updateDataSearchCandi(dataSearchAI);
            console.log(response);
        }
    } catch (e) {
        console.log(e);
    }
}

const ToolPushDataUvToElasticToSearchAdmin = async() => {
    try {
        let flag = true;
        let skip = 0;
        while (flag) {
            let stone = new Date().getTime() / 1000 - 6 * 60 * 60;
            let listUser = await Users.find({
                // createdAt: { $gte: stone },
                $and: [{
                        idTimViec365: { $lte: 1084137 }
                    },
                    {
                        idTimViec365: { $ne: 0 },
                    }
                ],
                type: 0
            }).sort({ idTimViec365: -1 }).skip(skip).limit(30).lean();
            //let listUser = await Users.find({ idTimViec365: 1395555, type: 0 }).lean();
            if (listUser.length) {
                skip = skip + 30;
                for (let i = 0; i < listUser.length; i++) {
                    console.log("ứng viên", listUser[i].idTimViec365);
                    let data = new FormData();
                    let obj_save = listUser[i];
                    let percents = (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.percents) ? obj_save.inForPerson.candidate.percents : 0;
                    if (obj_save.fromDevice == 8) {
                        percents = 50;
                    }
                    data.append('use_id', obj_save.idTimViec365 || "");
                    data.append('cv_user_id', obj_save.idTimViec365 || "");
                    data.append('use_email', obj_save.email || "");
                    data.append('use_phone_tk', obj_save.phoneTK || "");
                    data.append('use_first_name', obj_save.userName || "");
                    data.append('use_pass', obj_save.password || "");
                    data.append('use_type', (obj_save.inForPerson && obj_save.inForPerson.candidate) ? obj_save.inForPerson.candidate.use_type : "");
                    data.append('use_create_time', obj_save.createdAt ? Number(obj_save.createdAt).toFixed(0) : "");
                    data.append('use_update_time', obj_save.updatedAt ? Number(obj_save.updatedAt).toFixed(0) : "");

                    data.append('user_reset_time', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.user_reset_time) ? Number(obj_save.inForPerson.candidate.user_reset_time).toFixed(0) : "");
                    data.append('use_logo', obj_save.avatarUser || "");
                    data.append('use_phone', obj_save.phone || "");
                    data.append('use_email_lienhe', obj_save.emailContact || "");
                    data.append('use_gioi_tinh', (obj_save.inForPerson && obj_save.inForPerson.account && obj_save.inForPerson.account.gender) ? obj_save.inForPerson.account.gender : "");
                    data.append('use_birth_day', (obj_save.inForPerson && obj_save.inForPerson.account && obj_save.inForPerson.account.birthday) ? Number(obj_save.inForPerson.account.birthday).toFixed(0) : "");
                    data.append('use_birth_mail', "");
                    data.append('use_city', obj_save.city || "");
                    data.append('use_quanhuyen', obj_save.district || "");
                    data.append('use_address', obj_save.address || "");
                    data.append('use_fb', "");
                    data.append('use_hon_nhan', (obj_save.inForPerson && obj_save.inForPerson.account && obj_save.inForPerson.account.married) ? obj_save.inForPerson.account.married : "");
                    data.append('use_view', (obj_save.inForPerson && obj_save.inForPerson.candidate) ? obj_save.inForPerson.candidate.use_view : "");
                    data.append('use_noti', (obj_save.inForPerson && obj_save.inForPerson.candidate) ? obj_save.inForPerson.candidate.use_noti : "");
                    data.append('use_show', (obj_save.inForPerson && obj_save.inForPerson.candidate) ? obj_save.inForPerson.candidate.use_show : "");
                    data.append('use_show_cv', (obj_save.inForPerson && obj_save.inForPerson.candidate) ? obj_save.inForPerson.candidate.use_show_cv : "");
                    data.append('use_active', (obj_save.inForPerson && obj_save.inForPerson.candidate) ? obj_save.inForPerson.candidate.use_active : "");
                    data.append('use_authentic', obj_save.authentic || "");
                    data.append('use_lat', obj_save.latitude || "");
                    data.append('use_long', obj_save.longtitude || "");
                    data.append('use_td', (obj_save.inForPerson && obj_save.inForPerson.candidate) ? obj_save.inForPerson.candidate.use_td : "");
                    data.append('send_vip_time', "");
                    data.append('use_stop_mail', "");
                    data.append('use_utl', "");
                    data.append('use_ssl', "");
                    data.append('use_mail_vt', "");
                    data.append('use_qc', "");
                    data.append('use_check', (obj_save.inForPerson && obj_save.inForPerson.candidate) ? obj_save.inForPerson.candidate.use_check : "");
                    data.append('user_xac_thuc', obj_save.otp || "");
                    data.append('dk', obj_save.fromDevice || "");
                    data.append('chat365_id', obj_save.chat365_id || "");
                    data.append('chat365_secret', obj_save.chat365_secret || "");
                    data.append('use_delete', "");
                    data.append('send_crm', "");
                    data.append('otp_time_exist', "");
                    data.append('id_qlc', obj_save.idQLC || "");
                    data.append('scan_logo', "");
                    data.append('use_test', "");
                    data.append('point_time_active', (obj_save.inForPerson && obj_save.inForPerson.candidate) ? obj_save.inForPerson.candidate.point_time_active : "");
                    data.append('scan_base365', "");
                    data.append('time_send_vl', "");
                    data.append('use_ip', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.use_ip) ? obj_save.inForPerson.candidate.use_ip : "");
                    data.append('percents', percents);
                    data.append('vip', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.percents) ? obj_save.inForPerson.candidate.vip : "");
                    data.append('scan_AI', "");
                    data.append('scan_AI_Lam', "");
                    data.append('scan_AI_percents', "");
                    data.append('check_create_usc', "");
                    data.append('emp_id', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.emp_id) ? obj_save.inForPerson.candidate.emp_id : "");
                    data.append('raonhanh365_id', obj_save.idRaoNhanh365 || "");
                    data.append('check_account_raonhanh', "");
                    data.append('check_account_qlc', "");
                    data.append('scan_audio', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.scan_audio) ? obj_save.inForPerson.candidate.scan_audio : "");
                    data.append('update_uv_ai', "");
                    data.append('check_crm', "");
                    data.append('scan_elastic', "");
                    data.append('cv_id', "");

                    data.append('cv_title', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.scan_audio) ? obj_save.inForPerson.candidate.cv_title : "");
                    data.append('cv_hocvan', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.education) ? obj_save.inForPerson.account.education : "");
                    data.append('cv_exp', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.experience) ? obj_save.inForPerson.account.experience : "");
                    data.append('cv_muctieu', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_muctieu) ? obj_save.inForPerson.candidate.cv_muctieu : "");
                    data.append('cv_cate_id', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_cate_id) ? obj_save.inForPerson.candidate.cv_cate_id.toString() : "");
                    data.append('cv_city_id', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_city_id) ? obj_save.inForPerson.candidate.cv_city_id.toString() : "");
                    data.append('cv_district_id', "");
                    data.append('cv_address', "");
                    data.append('cv_capbac_id', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_capbac_id) ? obj_save.inForPerson.candidate.cv_capbac_id : "");
                    data.append('cv_money_id', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_money_id) ? obj_save.inForPerson.candidate.cv_money_id : "");
                    data.append('cv_loaihinh_id', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_loaihinh_id) ? obj_save.inForPerson.candidate.cv_loaihinh_id : "");
                    data.append('cv_time', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_time) ? obj_save.inForPerson.candidate.cv_time : "");
                    data.append('cv_time_dl', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_time_dl) ? obj_save.inForPerson.candidate.cv_time_dl : "");

                    data.append('cv_kynang', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_kynang) ? obj_save.inForPerson.candidate.cv_kynang : "");
                    data.append('cv_giai_thuong', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_giai_thuong) ? obj_save.inForPerson.candidate.cv_giai_thuong : "");
                    data.append('cv_hoat_dong', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_hoat_dong) ? obj_save.inForPerson.candidate.cv_hoat_dong : "");
                    data.append('cv_so_thich', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_so_thich) ? obj_save.inForPerson.candidate.cv_so_thich : "");
                    data.append('cv_tc_name', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_tc_name) ? obj_save.inForPerson.candidate.cv_tc_name : "");
                    data.append('cv_tc_cv', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_tc_cv) ? obj_save.inForPerson.candidate.cv_tc_cv : "");
                    data.append('cv_tc_dc', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_tc_dc) ? obj_save.inForPerson.candidate.cv_tc_dc : "");
                    data.append('cv_tc_phone', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_tc_phone) ? obj_save.inForPerson.candidate.cv_tc_phone : "");
                    data.append('cv_tc_email', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_tc_email) ? obj_save.inForPerson.candidate.cv_tc_email : "");
                    data.append('cv_tc_company', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_tc_company) ? obj_save.inForPerson.candidate.cv_tc_company : "");
                    data.append('cv_video', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_video) ? obj_save.inForPerson.candidate.cv_video : "");
                    data.append('cv_video_type', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_video_type) ? obj_save.inForPerson.candidate.cv_video_type : "");
                    data.append('cv_video_active', (obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_video_active) ? obj_save.inForPerson.candidate.cv_video_active : "");

                    let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'http://43.239.223.57:9005/add_candidate',
                        data: data
                    };

                    await axios.request(config);
                    // return true;

                }
            } else {
                flag = false;
            }
        }
    } catch (e) {
        console.log(e);
    }
}

const ToolPushDataNtdToElasticToSearchAdmin = async() => {
    try {
        let flag = true;
        let skip = 0;
        while (flag) {
            let stone = new Date().getTime() / 1000 - 12 * 60 * 60;
            let listUser = await Users.find({
                // createdAt: { $gte: stone },
                //idTimViec365: 1111123119,

                $and: [{
                        idTimViec365: { $ne: 0 }
                    },
                    // {
                    //     idTimViec365: { $lte: 24408 }
                    // }
                ],
                type: 1
            }).sort({ idTimViec365: -1 }).skip(skip).limit(30).lean();
            //let listUser = await Users.find({ idTimViec365: 1395555, type: 0 }).lean();
            if (listUser.length) {
                skip = skip + 30;
                for (let i = 0; i < listUser.length; i++) {
                    // console.log(listUser[i].idTimViec365);
                    let data = new FormData();
                    let obj_save = listUser[i];
                    let usc_md5 = "";
                    if (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_md5) {
                        usc_md5 = obj_save.inForCompany.timviec365.usc_md5;
                    };
                    if (obj_save.type == 1) {
                        data.append('usc_id', obj_save.idTimViec365 || "");
                        data.append('usc_email', obj_save.email || "");

                        data.append('usc_phone_tk', obj_save.phoneTK ? obj_save.phoneTK : "");
                        data.append('usc_name', (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_name) ? obj_save.inForCompany.timviec365.usc_name : "");
                        data.append('usc_name_add', (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_name_add) ? obj_save.inForCompany.timviec365.usc_name_add : "");
                        data.append('usc_name_phone', (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_name_phone) ? obj_save.inForCompany.timviec365.usc_name_phone : "");
                        data.append('usc_name_email', (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_name_email) ? obj_save.inForCompany.timviec365.usc_name_email : "");
                        data.append('usc_canonical', "");
                        data.append('usc_pass', "");
                        data.append('usc_company', obj_save.userName || "");
                        data.append('usc_name_novn', obj_save.userName ? removeVietnameseTones(obj_save.userName) : "");
                        data.append('usc_alias', obj_save.alias || "");
                        data.append('usc_md5', usc_md5);
                        data.append('usc_redirect', (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_redirect) ? obj_save.inForCompany.timviec365.usc_redirect : "");

                        data.append('usc_address', obj_save.address || "");
                        data.append('usc_phone', obj_save.phone || "");
                        data.append('usc_logo', obj_save.avatarUser || "");
                        data.append('usc_size', (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_size) ? obj_save.inForCompany.timviec365.usc_size : "");
                        data.append('usc_website', (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_website) ? obj_save.inForCompany.timviec365.usc_website : "");
                        data.append('usc_city', obj_save.city || "");
                        data.append('usc_qh', obj_save.district || "");
                        data.append('usc_create_time', obj_save.createdAt ? Number(obj_save.createdAt).toFixed(0) : "");
                        data.append('usc_update_time', obj_save.updatedAt ? Number(obj_save.updatedAt).toFixed(0) : "");
                        data.append('usc_update_new', (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_update_new) ? obj_save.inForCompany.timviec365.usc_update_new : "");
                        data.append('usc_view_count', "");
                        data.append('usc_time_login', obj_save.time_login ? Number(obj_save.time_login).toFixed(0) : "");
                        data.append('usc_active', (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_active) ? obj_save.inForCompany.timviec365.usc_active : "");
                        data.append('usc_show', (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_show) ? obj_save.inForCompany.timviec365.usc_show : "");
                        data.append('usc_mail', "");
                        data.append('usc_stop_mail', "");
                        data.append('usc_utl', "");
                        data.append('usc_ssl', "");
                        data.append('usc_mst', "");

                        data.append('usc_authentic', obj_save.authentic || "");
                        data.append('usc_security', "");
                        data.append('usc_lat', "");
                        data.append('usc_long', "");
                        data.append('usc_ip', (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_ip) ? obj_save.inForCompany.timviec365.usc_ip : "");
                        data.append('usc_loc', "");
                        data.append('usc_kd', (obj_save.inForCompany && obj_save.inForCompany.timviec365) ? obj_save.inForCompany.usc_kd : "");
                        data.append('usc_kd_first', (obj_save.inForCompany && obj_save.inForCompany.timviec365) ? obj_save.inForCompany.usc_kd_first : "");
                        data.append('usc_mail_app', "");
                        data.append('dk', obj_save.fromDevice || 0);
                        data.append('usc_xac_thuc', obj_save.otp || "");
                        data.append('usc_cc365', "");
                        data.append('usc_crm', "");
                        data.append('usc_video', "");
                        data.append('usc_video_type', "");
                        data.append('usc_video_active', "");
                        data.append('usc_images', "");

                        data.append('usc_active_img', (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_active_img) ? obj_save.inForCompany.timviec365.usc_active_img : "");
                        data.append('up_crm', "");
                        data.append('chat365_id', obj_save.chat365_id || "");
                        data.append('chat365_secret', obj_save.chat365_secret || "");
                        data.append('usc_block_account', "");
                        data.append('usc_stop_noti', "");
                        data.append('otp_time_exist', "");
                        data.append('id_qlc', obj_save.idQLC || "");
                        data.append('use_test', "");
                        data.append('usc_badge', (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_badge) ? obj_save.inForCompany.timviec365.usc_badge : "");
                        data.append('usc_star', (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_star) ? obj_save.inForCompany.timviec365.usc_star : "");
                        data.append('scan_base365', obj_save.scan_base365 || "");
                        data.append('check_chat', obj_save.check_chat || "");
                        data.append('usc_vip', (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_vip) ? obj_save.inForCompany.timviec365.usc_vip : "");
                        data.append('usc_xacthuc_email', "");
                        data.append('usc_manager', "");
                        data.append('usc_license', "");
                        data.append('usc_active_license', "");
                        data.append('usc_license_additional', "");
                        data.append('raonhanh365_id', obj_save.idRaoNhanh365 || "");
                        data.append('check_raonhanh_id', "");
                        data.append('status_dowload_appchat', "");
                        data.append('status_dowload_wfchat', "");
                        data.append('usc_founding', "");
                        data.append('scan_elastic', "");
                        data.append('point', "");
                        // lấy dữ liệu về điểm 
                        let point_usc = 0;
                        let ngay_reset_diem_ve_0 = 0;
                        let data_point = await Tv365PointCompany.findOne({ usc_id: Number(obj_save.idTimViec365) });
                        if (data_point) {
                            point_usc = data_point.point_usc;
                            ngay_reset_diem_ve_0 = data_point.ngay_reset_diem_ve_0;
                            // console.log(data_point);
                            console.log(listUser[i].idTimViec365, point_usc, ngay_reset_diem_ve_0)
                        }
                        data.append('point_usc', point_usc);
                        data.append('ngay_reset_diem_ve_0', ngay_reset_diem_ve_0);
                        data.append('day_reset_point', "");
                        data.append('point_bao_luu', "");
                        data.append('chu_thich_bao_luu', "");
                        data.append('table', "Users");
                        let config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: 'http://43.239.223.57:9006/add_company',
                            data: data
                        };

                        const response = await axios.request(config);
                        console.log(response.data);
                        //     // return true;
                        // }
                    }
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
}

// ToolPushDataUvToElasticToSearch();
// ToolPushDataUvToElasticToSearchAdmin();
setInterval(() => {
    console.log("Start");
    ToolPushDataNtdToElasticToSearchAdmin()
}, 12 * 3600 * 1000);
ToolPushDataNtdToElasticToSearchAdmin()




const DB_URL = 'mongodb://127.0.0.1:27017/api-base365';
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));