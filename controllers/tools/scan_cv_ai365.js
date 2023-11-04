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



//chạy tool
// const backgroundTasks = require('./services/timviec365/toolWritedByDat/background_task');

// console.log('Tool started');

const DB_URL = 'mongodb://127.0.0.1:27017/api-base365';
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));


const scan_cv_ai = async() => {
    let listCv = await Profile.find({ mdtd_state: 0 }).sort({ hs_id: -1 }).limit(10).lean();
    // console.log(listCv.length);
    while (listCv.length > 0) {
        listCv = await Profile.find({ mdtd_state: 0 }).sort({ hs_id: -1 }).limit(10).lean();
        for (key in listCv) {
            try {
                let cv = listCv[key];
                // console.log("Đang cập nhật: ", cv.hs_use_id);
                if (cv) {
                    if (cv.hs_link) {
                        let dir = '../../' + serviceCandi.getDirProfile(cv.hs_create_time, cv.hs_link);
                        if (fs.existsSync(dir)) {
                            let dataAPI = {
                                site: "uvtimviec365_5",
                                list_link: [{
                                    id: cv.hs_use_id,
                                    link: serviceCandi.getUrlProfile(cv.hs_create_time, cv.hs_link).replaceAll('undefined', 'https://cdn.timviec365.vn')
                                }]
                            }
                            const res = await axios.post('http://43.239.223.4:5016/mdtd_scan_file', dataAPI);
                            let itemRes = res.data.data.item[0];
                            // console.log(itemRes);
                            if (itemRes.state == 2) { //Thành công
                                await Profile.updateOne({ hs_id: cv.hs_id }, { $set: { mdtd_state: 1 } });
                                // console.log("Cập nhật thành công: ", cv.hs_use_id);
                            } else {
                                await Profile.updateOne({ hs_id: cv.hs_id }, { $set: { mdtd_state: 2 } });
                                // console.log("Lỗi: ", cv.hs_use_id);
                            }

                        } else {
                            console.log(dir);
                            await Profile.updateOne({ hs_id: cv.hs_id }, { $set: { mdtd_state: 3 } });
                        }
                    } else if (cv.hs_link_hide) {
                        let dataAPI = {
                            site: "uvtimviec365_5",
                            list_link: [{
                                id: cv.hs_use_id,
                                link: cv.hs_link_hide
                            }]
                        }
                        const res = await axios.post('http://43.239.223.4:5016/mdtd_scan_file', dataAPI);
                        let itemRes = res.data.data.item[0];
                        if (itemRes.state == 2) { //Thành công
                            await Profile.updateOne({ hs_id: cv.hs_id }, { $set: { mdtd_state: 1 } });
                            // console.log("Cập nhật thành công: ", cv.hs_use_id);
                        } else {
                            await Profile.updateOne({ hs_id: cv.hs_id }, { $set: { mdtd_state: 2 } });
                            // console.log("Lỗi: ", cv.hs_use_id);
                        }
                    } else {
                        await Profile.updateOne({ hs_id: cv.hs_id }, { $set: { mdtd_state: 3 } });
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
}

scan_cv_ai();


const removeHtmlTag = (string) => {
    return string ? string.replace(/\s{2,9999}/g, ' ').replace(/(<([^>]+)>)/ig, ' ').replaceAll('<br>', '') : string;
}

//Quét nội dung CV UV tạo sang AI
const scan_cv_php = async() => {
    try {
        // console.log(`Đang cập nhật CV UV`);
        let listCV = await SaveCvCandi.find({ scan: { $in: 0 }, cv: 1, cvid: { $nin: [100001, 100049] } }).limit(1).lean()
        while (listCV.length) {
            listCV = await SaveCvCandi.find({ scan: { $in: 0 }, cv: 1, cvid: { $nin: [100001, 100049] } }).sort({ id: -1 }).limit(10).lean()
            for (i in listCV) {
                let cv = listCV[i];
                try {
                    // console.log(`Đang cập nhật CV UV: ${cv.uid}`);
                    let dataCV = JSON.parse(cv['html']);
                    let contact = dataCV.menu.find(e => e.id == 'box01'),
                        career = dataCV.menu.find(e => e.id == 'box02'),
                        skill = dataCV.menu.find(e => e.id == 'box03'),
                        certificate = dataCV.menu.find(e => e.id == 'box05'),
                        award = dataCV.menu.find(e => e.id == 'box04'),
                        interest = dataCV.menu.find(e => e.id == 'box06'),
                        reference = dataCV.menu.find(e => e.id == 'box07'),
                        exp = dataCV.experiences.find(e => e.id == 'block01'),
                        education = dataCV.experiences.find(e => e.id == 'block02'),
                        activity = dataCV.experiences.find(e => e.id == 'block03'),
                        project = dataCV.experiences.find(e => e.id == 'block04'),
                        other = dataCV.experiences.find(e => e.id == 'block05');

                    let cv_title_php = dataCV.cv_title,
                        use_name_php = dataCV.name,
                        cv_brithday_php = contact.content.content.content.birthday,
                        cv_address_php = contact.content.content.content.address,
                        use_mail_php = contact.content.content.content.email,
                        cv_phone_php = contact.content.content.content.phone,
                        cv_gioitinh_php = contact.content.content.content.sex;

                    let cv_muctieu_php = career && career.status != 'hide' ? career.content.content : '',
                        cv_chungchi_php = certificate && certificate.status != 'hide' ? certificate.content.content : '',
                        cv_giaithuong_php = award && award.status != 'hide' ? award.content.content : '',
                        cv_sothich_php = interest && interest.status != 'hide' ? interest.content.content : '',
                        cv_nthchieu_php = reference && reference.status != 'hide' ? reference.content.content : '';
                    let list_name_skill = [];
                    if (skill.status != 'hide')
                        skill.content.content.skills.forEach(element => {
                            list_name_skill.push(element.name);
                        });
                    let cv_kynang_php = list_name_skill.join('\n');

                    let edu_list = [],
                        exp_list = [],
                        act_list = [],
                        proj_list = [],
                        other_list = [];
                    if (education && education.status != 'hide' && education.content.content) {
                        education.content.content.forEach((e) => {
                            let arr_text = [];
                            if (e.title) arr_text.push(e.title);
                            if (e.date) arr_text.push(e.date)
                            if (e.subtitle) arr_text.push(e.subtitle)
                            if (e.content) arr_text.push(e.content)
                            edu_list.push(arr_text.join('\n'));
                        })
                    }
                    if (exp && exp.status != 'hide' && exp.content.content) {
                        exp.content.content.forEach((e) => {
                            let arr_text = [];
                            if (e.title) arr_text.push(e.title);
                            if (e.date) arr_text.push(e.date)
                            if (e.subtitle) arr_text.push(e.subtitle)
                            if (e.content) arr_text.push(e.content)
                            exp_list.push(arr_text.join('\n'));
                        })
                    }
                    if (activity && activity.status != 'hide' && activity.content.content) {
                        activity.content.content.forEach((e) => {
                            let arr_text = [];
                            if (e.title) arr_text.push(e.title);
                            if (e.date) arr_text.push(e.date)
                            if (e.subtitle) arr_text.push(e.subtitle)
                            if (e.content) arr_text.push(e.content)
                            act_list.push(arr_text.join('\n'));
                        })
                    }
                    if (project && project.status != 'hide' && project.content.content) {
                        project.content.content.forEach((e) => {
                            let arr_text = [];
                            if (e.title) arr_text.push(e.title);
                            if (e.date) arr_text.push(e.date)
                            if (e.subtitle) arr_text.push(e.subtitle)
                            if (e.content) arr_text.push(e.content)
                            proj_list.push(arr_text.join('\n'));
                        })
                    }
                    if (other && other.status != 'hide' && other.content.content) {
                        other.content.content.forEach((e) => {
                            let arr_text = [];
                            if (e.title) arr_text.push(e.title);
                            if (e.date) arr_text.push(e.date)
                            if (e.subtitle) arr_text.push(e.subtitle)
                            if (e.content) arr_text.push(e.content)
                            other_list.push(arr_text.join('\n'));
                        })
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

                        cv_hocvan_php: removeHtmlTag(edu_list.join(';')),
                        cv_exp_php: removeHtmlTag(exp_list.join(';')),
                        cv_hoatdong_php: removeHtmlTag(act_list.join(';')),
                        cv_duan_php: removeHtmlTag(proj_list.join(';')),
                        cv_ttthem_php: removeHtmlTag(other_list.join(';'))
                    }
                    let res = await serviceDataAI.updateDataSearchCandiCV(dataAI);

                    if (res.data.data) {
                        await SaveCvCandi.updateOne({ id: cv.id }, { $set: { scan: 1 } });
                        // console.log(`Cập nhật thành công CV UV: ${cv.uid}`);
                    } else {
                        await SaveCvCandi.updateOne({ id: cv.id }, { $set: { scan: 2 } });
                        // console.log(`Cập nhật thất bại CV UV: ${cv.uid}`);
                    }
                } catch (e) {
                    // console.log(e);
                    await SaveCvCandi.updateOne({ id: cv.id }, { $set: { scan: 2 } });
                    // console.log(`Cập nhật thất bại CV UV: ${cv.uid}`);
                }
            }
        }
        // console.log(`Cập nhật xong CV UV`);
        setTimeout(await scan_cv_php(), 20000);
    } catch (e) {
        console.log(e);
        console.log(`Lỗi cập nhật CV UV`);
    }
}
scan_cv_php();

//Quét che thông tin UV
const arr_post = [8000, 8001, 8002];
const scan_cv_profile = async() => {
    try {
        const list = await Profile.find({
            is_scan: 0,
            hs_link: { $ne: "" },
            hs_link_hide: { $in: ['', null] },
            $or: [
                { hs_link: { $regex: ".png" } },
                { hs_link: { $regex: ".doc" } },
                { hs_link: { $regex: ".pdf" } },
                { hs_link: { $regex: ".jpg" } },
                { hs_link: { $regex: ".jpeg" } }
            ]
        }).sort({ hs_id: -1 }).limit(1);
        let data = [];
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            const link = `https://storage.timviec365.vn/timviec365/pictures/cv/${functions.convertDate(element.hs_create_time,true)}/${element.hs_link}`;

            data.push({
                id: element.hs_id,
                link: link
            });
            console.log(data);
        }

        data = JSON.stringify(data);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://43.239.223.148:8001/hide_cv',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        const request_axios = await axios.request(config);
        const result = request_axios.data;
        console.log('ket qua API ', result)
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                const element = result[i];
                console.log(element)
                await Profile.updateOne({ hs_id: element.id }, {
                    $set: {
                        is_scan: 1,
                        hs_link_hide: element.link
                    }
                });
                console.log("Cập nhật cv ứng viên thành công: " + element.id);
            }
        } else {
            const lists = JSON.parse(data);
            for (let j = 0; j < lists.length; j++) {
                const element = lists[j];
                await Profile.updateOne({ hs_id: element.id }, {
                    $set: {
                        is_scan: 1,
                    }
                });
                console.log("Cập nhật cv ứng viên thất bại: " + element.id);
            }
        }
        setTimeout(await scan_cv_profile(), 20000);
    } catch (error) {
        console.log(error);
        await scan_cv_profile();
        return false;
    }
}

scan_cv_profile();


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
        cv_ttthem_php: cv['html']
    };
    let res = await serviceDataAI.updateDataSearchCandiCV(dataAI);
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

    // console.log("response từ việc cập nhật cv AI", res.data, dataAI);
    if (res.data.data) {
        await SaveCvCandi.updateOne({ id: cv.id }, { $set: { scan: 1 } });
        console.log(`Cập nhật thành công CV UV: ${cv.uid}`);
    } else {
        await SaveCvCandi.updateOne({ id: cv.id }, { $set: { scan: 2 } });
        console.log(`Cập nhật thất bại CV UV: ${cv.uid}`);
    };
}


//Quét nội dung CV UV tạo sang AI
const scan_cv_php_cv_ai = async() => {
    try {
        while (true) {
            // console.log("Cập nhật", new Date());
            await sleep(2000);
            // console.log(`Đang cập nhật CV UV`);
            let listCV = await SaveCvCandi.find({ scan: { $ne: 1 }, cv: 1, cvid: { $in: [100001, 100049] } }).lean();

            if (listCV.length) {
                for (let i = 0; i < listCV.length; i++) {
                    let cv = listCV[i];
                    await handleCVAI(cv)
                }

            }

        }
    } catch (e) {
        console.log(e);
        await scan_cv_php();
        console.log(`Lỗi cập nhật CV UV`);
    }
}

scan_cv_php_cv_ai();