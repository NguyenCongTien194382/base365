const functions = require("../../services/functions");
const serviceCandi = require("../../services/timviec365/candidate");
const serviceDataAI = require('../../services/timviec365/dataAI');

const SaveCvCandi = require("../../models/Timviec365/UserOnSite/Candicate/SaveCvCandi");
const Profile = require('../../models/Timviec365/UserOnSite/Candicate/Profile');
const Customer = require('../../models/crm/Customer/customer');
const AdminUser = require('../../models/Timviec365/Admin/AdminUser');

const Users = require("../../models/Users");

const fs = require("fs");
const axios = require("axios");
const nl2br = require('nl2br');

var mongoose = require('mongoose');



const DB_URL = 'mongodb://127.0.0.1:27017/api-base365';
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));



const removeHtmlTag = (string) => {
    return string ? string.replace(/\s{2,9999}/g, ' ').replace(/(<([^>]+)>)/ig, ' ').replaceAll('<br>', '') : string;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const handleCVAI = async(cv) => {
    let dataCV = JSON.parse(cv['html']);
    // lấy dữ liệu từ các trường có sẵn 
    let cv_title_php = dataCV.cv_content_title;
    let use_name_php = dataCV.cv_content_name;
    let cv_brithday_php = (dataCV && dataCV.cv_content_contact && dataCV.cv_content_contact.birth_day) ? dataCV.cv_content_contact.birth_day : "";
    let cv_address_php = (dataCV && dataCV.cv_content_contact && dataCV.cv_content_contact.address) ? dataCV.cv_content_contact.address : "";
    let use_mail_php = (dataCV && dataCV.cv_content_contact && dataCV.cv_content_contact.email) ? dataCV.cv_content_contact.email : "";
    let cv_phone_php = (dataCV && dataCV.cv_content_contact && dataCV.cv_content_contact.phone) ? dataCV.cv_content_contact.phone : "";
    let cv_gioitinh_php = "";

    let cv_muctieu_php = (dataCV && dataCV.cv_content_goal) ? dataCV.cv_content_goal : "";
    let cv_chungchi_php = (dataCV && dataCV.cv_content_certificate && dataCV.cv_content_certificate.job_input_certificate_content) ?
        dataCV.cv_content_certificate.job_input_certificate_content : "";
    let cv_giaithuong_php = (dataCV && dataCV.cv_content_award && dataCV.cv_content_award.job_input_award_content) ? dataCV.cv_content_award.job_input_award_content : "";
    let cv_sothich_php = "";
    if (dataCV.cv_content_interest) {
        if (dataCV.cv_content_interest.job_input_interest_content) {
            cv_sothich_php = dataCV.cv_content_interest.job_input_interest_content;
        } else {
            if (dataCV.cv_content_interest.length) {
                for (let j = 0; j < dataCV.cv_content_interest.length; j++) {
                    if (j > 0) {
                        cv_sothich_php = `${cv_sothich_php},${dataCV.cv_content_interest[j].job_input_interest_content}`
                    } else {
                        cv_sothich_php = dataCV.cv_content_interest[j].job_input_interest_content;
                    }
                }
            }
        }
    }
    let cv_nthchieu_php = "";
    if (dataCV && dataCV.cv_content_reference && dataCV.cv_content_reference.job_input_ref_name) {
        cv_nthchieu_php = dataCV.cv_content_reference.job_input_ref_name
    }

    //let list_name_skill = [dataCV.cv_content_skill.job_input_skill_content];
    let cv_kynang_php = "";
    if (dataCV.cv_content_skill && dataCV.cv_content_skill.job_input_skill_content) {
        if (typeof(dataCV.cv_content_skill.job_input_skill_content) == "string") {
            cv_kynang_php = dataCV.cv_content_skill.job_input_skill_content;
        } else if (typeof(dataCV.cv_content_skill.job_input_skill_content) == "object") {
            if (dataCV.cv_content_skill.job_input_skill_content.length) {
                for (let j = 0; j < dataCV.cv_content_skill.job_input_skill_content; j++) {
                    if (j == 0) {
                        cv_kynang_php = dataCV.cv_content_skill.job_input_skill_content[j];
                    } else {
                        cv_kynang_php = `${cv_kynang_php},${dataCV.cv_content_skill.job_input_skill_content[j]}`
                    }
                }
            }
        }
    }

    let cv_hocvan_php = "";
    if (dataCV.cv_content_education && dataCV.cv_content_education.length) {
        if (typeof(dataCV.cv_content_education) == "object") {
            for (let j = 0; j < dataCV.cv_content_education.length; j++) {
                let obj = dataCV.cv_content_education[j];
                let listkey = Object.keys(obj);
                for (let h = 0; h < listkey.length; h++) {
                    if ((j == 0) && (h == 0)) {
                        cv_hocvan_php = obj[listkey[h]]
                    } else {
                        cv_hocvan_php = `${cv_hocvan_php},${obj[listkey[h]]}`
                    }
                }
            }
        }
    };

    let cv_exp_php = "";
    if (dataCV.cv_content_exp && dataCV.cv_content_exp.length) {
        if (typeof(dataCV.cv_content_exp) == "object") {
            for (let j = 0; j < dataCV.cv_content_exp.length; j++) {
                let obj = dataCV.cv_content_exp[j];
                let listkey = Object.keys(obj);
                for (let h = 0; h < listkey.length; h++) {
                    if ((j == 0) && (h == 0)) {
                        cv_exp_php = obj[listkey[h]]
                    } else {
                        cv_exp_php = `${cv_exp_php},${obj[listkey[h]]}`
                    }
                }
            }
        }
    }
    let dataAI = {
        use_id: cv.uid,
        use_name_php: use_name_php,
        cv_title_php: cv_title_php,
        cv_brithday_php: cv_brithday_php,
        cv_address_php: cv_address_php,
        use_mail_php: use_mail_php,
        cv_phone_php: cv_phone_php,
        cv_gioitinh_php: cv_gioitinh_php,
        cv_muctieu_php: removeHtmlTag(cv_muctieu_php),
        cv_kynang_php: removeHtmlTag(cv_kynang_php),
        cv_chungchi_php: removeHtmlTag(cv_chungchi_php),
        cv_sothich_php: removeHtmlTag(cv_sothich_php),
        cv_nthchieu_php: removeHtmlTag(cv_nthchieu_php),
        cv_giaithuong_php: removeHtmlTag(cv_giaithuong_php),

        cv_hocvan_php: cv_hocvan_php,
        cv_exp_php: cv_exp_php,
        cv_hoatdong_php: "",
        cv_duan_php: "",
        cv_ttthem_php: ""
    };
    let res = await serviceDataAI.updateDataSearchCandiCV(dataAI);
    console.log(res.data);
    let data = {
        use_id: cv.uid,
        percents: 50
    };
    data.site = "uvtimviec365_5";
    let url = "http://43.239.223.21:5012/update_data_ungvien";
    await axios({
        method: 'post',
        url: url,
        data: data,
        headers: { "Content-Type": "multipart/form-data" }
    });
    url = "http://43.239.223.4:5002/update_data_ungvien";
    await axios({
        method: 'post',
        url: url,
        data: data,
        headers: { "Content-Type": "multipart/form-data" }
    });

    //console.log(res.data);
    if (res.data.data) {
        await SaveCvCandi.updateOne({ id: cv.id }, { $set: { scan: 1 } });
        console.log(`Cập nhật thành công CV UV: ${cv.uid}`);
    } else {
        await SaveCvCandi.updateOne({ id: cv.id }, { $set: { scan: 2 } });
        console.log(`Cập nhật thất bại CV UV: ${cv.uid}`);
    };
}

// const handleCV

//Quét nội dung CV UV tạo sang AI
const scan_cv_php_cv_ai = async() => {
    try {
        while (true) {
            console.log("Cập nhật", new Date());
            //await sleep(2000);
            // console.log(`Đang cập nhật CV UV`);
            //let listCV = await SaveCvCandi.find({ scan: { $in: 0 }, cv: 1, cvid: 100001 }).limit(1).lean();
            // 
            // let listCV = await SaveCvCandi.find({ cvid: { $in: [100001, 100049] } }).limit(1).lean();
            let listCV = await SaveCvCandi.find({ uid: 1111140371 }).lean();
            if (listCV.length) {
                for (let i = 0; i < listCV.length; i++) {
                    console.log("......cv số", i)
                    let cv = listCV[i];
                    await handleCVAI(cv);
                }

            }
            // console.log(`Cập nhật xong CV UV`);
            // setTimeout(await scan_cv_php(), 1000);
        }
    } catch (e) {
        console.log(e);
        await scan_cv_php();
        console.log(`Lỗi cập nhật CV UV`);
    }
}
scan_cv_php_cv_ai();