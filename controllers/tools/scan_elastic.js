const Users = require('../../models/Users');
const axios = require('axios');
const FormData = require('form-data');

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
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        str = str.replace(/ + /g, " ");
        str = str.trim();

        str = str.replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|{|}|\||\\/g, " ");
        return str;
    } else {
        return ""
    }
}

const run = async() => {
    try {
        const list_id = [250603];
        const list = await Users.find({
            idTimViec365: { $in: list_id },
            type: 1
        }).lean();

        for (let i = 0; i < list.length; i++) {
            const obj_save = list[i];
            let data = new FormData();

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
                data.append('usc_alias', obj_save.alias || "");
                data.append('usc_md5', (obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_md5) ? obj_save.inForCompany.timviec365.usc_md5 : "");
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
                //console.log(obj_save.userName ? removeVietnameseTones(obj_save.userName) : "")
                data.append('usc_name_novn', obj_save.userName ? removeVietnameseTones(obj_save.userName) : "");
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
                data.append('point_usc', "");
                data.append('day_reset_point', "");
                data.append('ngay_reset_diem_ve_0', "");
                data.append('point_bao_luu', "");
                data.append('chu_thich_bao_luu', "");
                data.append('table', "Users");
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'http://43.239.223.57:9006/add_company',
                    data: data
                };

                await axios.request(config);

            }
        }
        console.log("Thành công");
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }


}

run();