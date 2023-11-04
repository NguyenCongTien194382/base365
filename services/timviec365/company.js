const Users = require('../../models/Users');
const AdminUser = require('../../models/Timviec365/Admin/AdminUser');
const CompanyStorage = require('../../models/Timviec365/UserOnSite/Company/Storage');
const HistoryCrm = require("../../models/Timviec365/UserOnSite/ManageHistory/HistoryCrm");
const Notification = require("../../models/Timviec365/Notification");

const multer = require('multer');
const fs = require('fs');
const fsPromises = require('fs/promises');
const functions = require('../functions');

const allowedTypes = ["image/png", "image/jpeg", "image/gif", "video/m4v", "video/mp4", "video/ogm", "video/wmv", "video/mpg", "video/ogv", "video/webm", "video/mov", "video/asx", "video/mpeg", "video/quicktime"];
const allowedTypeVideos = ["video/m4v", "video/mp4", "video/ogm", "video/wmv", "video/mpg", "video/ogv", "video/webm", "video/mov", "video/asx", "video/mpeg", "video/quicktime"];
const allowedTypeImages = ["image/png", "image/jpeg", "image/gif"];

const urlImage = "../storage/base365/timviec365/pictures";
const urlCdnImage = `${functions.hostCDN()}/pictures/videos`;
const urlVideo = "../storage/base365/timviec365/pictures/videos";
const urlCdnVideo = `${functions.hostCDN()}/pictures/videos`;

const serviceCrm = require("../timviec365/crm");
const axios = require('axios');
const FormData = require('form-data');

exports.geturlVideo = (time) => {
    const dateTime = functions.convertDate(time, true);
    path = `${urlVideo}/${dateTime}/`; // Tạo đường dẫn đến thư mục của người dùng

    if (!fs.existsSync(path)) { // Nếu thư mục chưa tồn tại thì tạo mới
        fs.mkdirSync(path, { recursive: true });
    }
    return path;
}

exports.geturlImage = (time) => {
    const dateTime = functions.convertDate(time, true);
    path = `${urlImage}/${dateTime}/`; // Tạo đường dẫn đến thư mục của người dùng

    if (!fs.existsSync(path)) { // Nếu thư mục chưa tồn tại thì tạo mới
        fs.mkdirSync(path, { recursive: true });
    }
    return path;
}

exports.shareCompanyToAdmin = async() => {
    try {
        const company = await Users.findOne({
                fromDevice: { $ne: 3 },
                type: 1,
                "inForCompany.usc_kd_first": { $ne: 0 },
                fromWeb: "timviec365"
            })
            .select("inForCompany.usc_kd_first")
            .sort({ idTimViec365: -1 })
            .lean();
        let usc_kd = 0;
        if (company) {
            usc_kd = company.inForCompany.usc_kd_first
        }

        // Lấy danh sách id kinh doanh
        let listKD = await AdminUser.find({
                adm_bophan: { $ne: 0 },
                adm_ntd: 1
            })
            .select("adm_bophan emp_id")
            .sort({ adm_bophan: 1 })
            .lean();

        const max_kd = listKD[listKD.length - 1].adm_bophan;

        // lấy vị trí của usc_kd trong danh sách adm_bophan
        const position_usc_kd = listKD.findIndex(item => item.adm_bophan === usc_kd);

        // Xử lý logic chia user cho KD
        let new_val, emp_id;
        if (usc_kd === max_kd || usc_kd == 0) {
            new_val = listKD[0].adm_bophan;
            emp_id = listKD[0].emp_id;
        } else {
            new_val = listKD[position_usc_kd + 1].adm_bophan;
            emp_id = listKD[position_usc_kd + 1].emp_id;
        }

        // if (use_test === 1) {
        //     new_val = 0;
        // }

        return {
            adm_bophan: new_val,
            emp_id: emp_id
        };
    } catch (error) {

    }
}

exports.recognition_tag_company = async(username, description) => {
    let lvID = "";
    try {
        let dataLV = await functions.getDataAxios(process.env.domain_ai_recommend + '/recognition_tag_company', {
            title_company: username,
            description_company: description,
            number: 1
        }, 5000);
        if (dataLV.data && dataLV.data.items.length > 0) {
            lvID = dataLV.data.items[0].id_tag;
        }
        return lvID;
    } catch (error) {
        return lvID;
    }

}

exports.checkItemStorage = (mimetype) => {
    if (!allowedTypes.includes(mimetype)) {
        return false;
    }
    return true;
}

exports.isImage = (mimetype) => {
    if (!allowedTypeImages.includes(mimetype)) {
        return false;
    }
    return true;
}

exports.uploadStorage = (user_id, file, type, time = null) => {
    var file_path = file.path;
    const path = this.geturlVideo(time);
    const now = functions.getTimeNow();
    let file_name = '';
    if (allowedTypes.includes(file.type)) {
        if (type == 'video') {
            let type_vd = file.type.replace('video/', '');
            type_vd = type_vd == 'quicktime' ? 'mov' : type_vd;
            file_name = `video_cpn_${user_id}_${now}_${Math.round(Math.random() * 1E9)}.${type_vd}`;
        } else {
            file_name = now + "_" + file.name;
        }
        fs.rename(file_path, path + file_name, function(err) {
            if (err) throw err;
        });
    }
    return { file_name };
};

exports.uploadLogo = (file, time = null) => {
    var file_path = file.path;
    const path = this.geturlImage(time),
        file_name = functions.getTimeNow() + "_" + file.name;
    if (allowedTypeImages.includes(file.type)) {
        fs.rename(file_path, path + file_name, function(err) {
            if (err) return false;
        });
        return { file_name };
    }
    return { file_name: '' };
}

exports.addStorage = async(usc_id, type, file_name) => {
    const now = functions.getTimeNow(),
        getItemMax = await CompanyStorage.findOne({}, { id_usc_img: 1 }).sort({ id_usc_img: -1 }).lean(),
        data = {
            id_usc_img: Number(getItemMax.id_usc_img) + 1,
            usc_id: usc_id,
            time_created: now,
            time_update: now
        };
    if (type == 'image') {
        data.image = file_name;
    } else {
        data.video = file_name;
    }
    const item = new CompanyStorage(data);
    await item.save();
}

exports.urlStorageImage = (time, image) => {
    let dateTime = functions.convertDate(time, true);
    url = `${urlCdnImage}/${dateTime}/${image}`;
    return url;
}

exports.urlStorageVideo = (time, video) => {
    let dateTime = functions.convertDate(time, true);
    url = `${urlCdnVideo}/${dateTime}/${video}`;
    return url;
}


exports.checkStorageVideo = (time, video) => {
    let dateTime = functions.convertDate(time, true);
    url = `${urlVideo}/${dateTime}/${video}`;
    if (fs.existsSync(url)) {
        return true;
    }
    return false;
}

exports.copyImageInStorageToAvatar = async(time, image) => {
    let originalPath = `${this.geturlVideo(time)}${image}`;
    if (!fs.existsSync(originalPath)) {
        fs.mkdirSync(originalPath, { recursive: true });
    }
    let avatarPath = `${this.geturlImage(time)}${image}`;
    await fsPromises.copyFile(originalPath, avatarPath);
}

exports.rewrite_company = (id, alias) => {
    return `${functions.siteName()}/${alias}-co${id}`;
}

const checkHistory = async(usc_id, usc_group, usc_status) => {
    const today = new Date().toISOString().slice(0, 10);
    const timeStampBegin = functions.convertTimestamp(`${today} 08:00:00`);
    const timeStampEnd = functions.convertTimestamp(`${today} 18:00:00`);
    const history = await HistoryCrm.findOne({
        usc_id,
        usc_group,
        usc_status,
        time_created: {
            $gte: timeStampBegin,
            $lte: timeStampEnd,
        }
    }).select("id");
    return history;
}

const processHistory = async(usc_id, usc_group, usc_status) => {
    try {
        const hours = new Date().getHours();
        const timeNow = functions.getTimeNow();
        const history = await checkHistory(usc_id, usc_group, usc_status);
        /* Kiểm tra nếu trong giờ làm việc (từ 8h -> 18h) thì xử lý check gửi thông báo và cập nhật trạng thái khách hàng 1 lần */

        if (hours >= 8 && hours < 18) {
            /** Kiểm tra xử lý:
             * Nếu trong ngày lần đầu đăng nhập thì gửi thông báo sang crm và lưu mới thời gian lần đầu trong ngày 
             * Còn không thì chỉ cập nhật thời gian mới nhất khi người đó đăng nhập
             */
            if (!history) {
                let id = 1;
                const maxHistory = await HistoryCrm.findOne({}, { id: 1 }).sort({ id: -1 });
                if (maxHistory) {
                    id = Number(maxHistory.id) + 1
                }
                const NewHistory = new HistoryCrm({ id, usc_id, usc_group, usc_status, time_created: timeNow });
                await NewHistory.save();
                await serviceCrm.editCustomer(null, null, null, null, usc_group, usc_id);
            } else {
                await HistoryCrm.updateOne({ id: history.id }, {
                    $set: { time_created: timeNow }
                });
            }
        } else {
            await serviceCrm.editCustomer(null, null, null, null, usc_group, usc_id);
        }
    } catch (error) {
        console.log(error)
        return false;
    }
}

exports.saveLoginCrm = async(usc_id) => {
    try {
        const usc_group = 453; // Nhóm NTD đăng nhập
        const usc_status = 4; // Trạng thái NTD đăng nhập
        await processHistory(usc_id, usc_group, usc_status);

    } catch (error) {
        console.log(error);
        return false;
    }
}

exports.saveRegisError = async() => {

}

exports.CreateNewCrm = async(usc_id) => {
    const usc_group = 455;
    const usc_status = 1;
    // await processHistory(usc_id, usc_group, usc_status);
    await serviceCrm.editCustomer(null, null, null, null, usc_group, usc_id);
}

exports.UpdateNewCrm = async(usc_id) => {
    const usc_group = 455;
    await serviceCrm.editCustomer(null, null, null, null, usc_group, usc_id);
}

exports.get_notification = async(com_id) => {
    try {
        //return [];
        // const com_id = Number(com_id);
        // console.log("condition", com_id);
        let list = await Notification.aggregate([{
                $sort: { not_id: -1 }
            },
            {
                $match: {
                    usc_id: Number(com_id),
                    not_active: { $in: [0, 1, 9] },
                    use_id: { $ne: 0 }
                }
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'use_id',
                    foreignField: 'idTimViec365',
                    as: 'user',
                }
            },
            { $unwind: '$user' },
            {
                $match: {
                    'user.type': { $ne: 1 }
                }
            },
            // { $skip: 0 },
            { $limit: 100 },
            {
                $project: {
                    not_id: 1,
                    use_id: "$user.idTimViec365",
                    use_first_name: "$user.userName",
                    not_active: 1,
                    not_time: 1,
                    usc_id: 1
                }
            }
        ]);
        //list = [...new Map(list.map((item) => [item['not_id'], item])).values()];
        return list;
    } catch (error) {
        console.log(error)
        return [];
    }
}

exports.RegisterWork247 = async(account, password, usc_company, usc_alias, email_contact, usc_create_time, usc_update_time, adm_bophan, usc_phone = '', usc_logo = '', usc_size = '', usc_city = '', usc_district = '') => {
    try {
        const admin_user = await AdminUser.findOne({ adm_bophan }, { adm_work247: 1 });
        if (admin_user && admin_user.adm_work247 && admin_user.adm_work247 != 0) {
            let data = new FormData();
            data.append('account', account);
            data.append('usc_company', usc_company);
            data.append('usc_name_email', email_contact);
            data.append('usc_pass', password);
            data.append('usc_alias', usc_alias);
            data.append('usc_address', usc_alias);
            data.append('usc_phone', usc_phone);
            data.append('usc_logo', usc_logo);
            data.append('usc_size', usc_size);
            data.append('usc_city', usc_city);
            data.append('usc_district', usc_district);
            data.append('usc_create_time', usc_create_time);
            data.append('usc_update_time', usc_update_time);
            data.append('usc_kd_crm', admin_user.adm_work247);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://work247.vn/api202/register_company.php',
                headers: {
                    ...data.getHeaders()
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                    console.log(error);
                });
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}