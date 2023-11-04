// Khai báo service
const functions = require('../functions');
const serviceNew365 = require('../../services/timviec365/new');
const sendMail = require('../../services/timviec365/sendMail');
const serviceCrm = require("../../services/timviec365/crm");
const serviceSendMess = require('../../services/timviec365/sendMess');

// Khai báo models
const Candidate = require('../../models/Users');
const Users = Candidate;
const Evaluate = require('../../models/Timviec365/Evaluate');
const applyForJob = require('../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');
const NewTV365 = require('../../models/Timviec365/UserOnSite/Company/New');
const Notification = require('../../models/Timviec365/Notification');
const pointUsed = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointUsed');
const SaveCvCandi = require('../../models/Timviec365/UserOnSite/Candicate/SaveCvCandi'); // Cv đã lưu
const Profile = require('../../models/Timviec365/UserOnSite/Candicate/Profile');
const ImagesUser = require('../../models/Timviec365/UserOnSite/Candicate/ImagesUser');
const GroupCrm = require('../../models/crm/Customer/customer_group');
const UserUnset = require('../../models/Timviec365/UserOnSite/Candicate/UserUnset');
const HistoryCandidateCrm = require("../../models/Timviec365/UserOnSite/ManageHistory/HistoryCandidateCrm");
const PermissionNotify = require("../../models/Timviec365/PermissionNotify");
const SaveVoteCandidate = require("../../models/Timviec365/UserOnSite/ManageHistory/SaveVoteCandidate");
const CategoryJob = require("../../models/Timviec365/CategoryJob");
const City = require("../../models/City");


const fs = require('fs');
const path = require('path');
const axios = require('axios');
const slugify = require('slugify');
const FormData = require('form-data');

exports.evaluate = async(use_id, com_id, type, content) => {
    // Check xem đã đánh giá hay chưa
    const evaluate = await Evaluate.findOne({
            usc_id: com_id,
            use_id: use_id
        }).lean(),
        now = functions.getTimeNow();

    // Nếu chưa đánh giá thì lưu lại vào bảng
    if (!evaluate) {
        const getItemMax = await Evaluate.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let data = {
            id: getItemMax.id + 1,
            usc_id: com_id,
            use_id: use_id,
            time_create: now
        };
        if (type == 1) {
            data.bx_uv = content;
        } else {
            data.bx_ntd = content;
        }
        const item = new Evaluate(data);
        item.save();
    } else {
        let condition = {
            time_create: now
        };
        if (type == 1) {
            condition.bx_uv = content;
        } else {
            condition.bx_ntd = content;
        }
        await Evaluate.updateOne({
            id: evaluate.id
        }, {
            $set: condition
        });
    }
}

exports.applyJob = async(new_id, use_id) => {
    const now = functions.getTimeNow();

    // Check xem đã ứng tuyển tin hay chưa
    const checkApplyForJob = await applyForJob.findOne({
        nhs_new_id: new_id,
        nhs_use_id: use_id,
        nhs_kq: { $ne: 10 }
    });
    if (!checkApplyForJob) {
        /* So sánh địa điểm tuyển dụng với tỉnh thành làm việc, tỉnh thành nơi ứng viên sinh 
        sống của ứng viên xem ứng viên có ứng tuyển sai hay không? */

        let user = await Candidate.aggregate([{
            $match: { idTimViec365: use_id, type: { $ne: 1 } }
        }, {
            $project: {
                _id: 1,
                use_first_name: "$userName",
                city: 1,
                cv_city_id: "$inForPerson.candidate.cv_city_id",
                cv_cate_id: "$inForPerson.candidate.cv_cate_id",
            }
        }]);
        user = user[0];

        const job = await NewTV365.findOne({ new_id: new_id }, {
            new_city: 1,
            new_user_id: 1
        }).lean();
        let nhs_xn_uts = 1;

        if (job.new_city && job.new_city.indexOf(0) < 0) {
            for (let i = 0; i < job.new_city.length; i++) {
                const new_city = job.new_city[i];
                /* Nếu như địa điểm làm việc đó nằm trong ds địa điểm mong muốn 
                và khác với tỉnh thành sinh sống thì xác nhận ứng tuyển đúng */
                // if (user.cv_city_id.indexOf(new_city) > -1 || new_city == user.city) {
                //     nhs_xn_uts = 0;
                //     break;
                // }
            }
        } else {
            nhs_xn_uts = 0;
        }

        const com_id = job.new_user_id;

        // Lưu vào bảng ứng tuyển
        const itemMax = await applyForJob.findOne({}, { nhs_id: 1 }).sort({ nhs_id: -1 }).limit(1).lean();
        await new applyForJob({
            nhs_id: Number(itemMax.nhs_id) + 1,
            nhs_use_id: use_id,
            nhs_new_id: new_id,
            nhs_com_id: com_id,
            nhs_time: now,
            check_ut: 14,
            nhs_xn_uts: nhs_xn_uts
        }).save();

        // Cập nhật thời gian làm mới cho ứng viên
        await Candidate.updateOne({ _id: use_id }, {
            $set: {
                updatedAt: now
            }
        });

        // +10 điểm cho tin tuyển dụng khi được ứng tuyển
        await NewTV365.updateOne({ new_id: new_id }, { $inc: { new_point: 10 } });

        // Lưu vào lịch sử
        const point = 10,
            type = 1;
        await serviceNew365.logHistoryNewPoint(new_id, point, type);

        // Thêm vào thông báo tại quả chuông
        let not_id = 1;
        const itemMaxNoti = await Notification.findOne({}, { not_id: 1 }).sort({ not_id: -1 }).limit(1).lean();
        if (itemMaxNoti) {
            not_id = Number(itemMaxNoti.not_id) + 1
        }
        await new Notification({
            not_id: not_id,
            usc_id: com_id,
            use_id: use_id,
            not_time: now,
            new_id: new_id,
            not_active: 1,
        }).save();

        // Thêm vào bảng sử dụng điểm
        await new pointUsed({
            usc_id: com_id,
            use_id: use_id,
            point: 1,
            type: 1,
            used_day: now,
        }).save();
        const company = await Users.findOne({ idTimViec365: com_id, type: 1 }, { _id: 1, idTimViec365: 1 });
        const alias = slugify(user.use_first_name, {
            replacement: '-', // Ký tự thay thế khoảng trắng và các ký tự đặc biệt
            lower: true, // Chuyển thành chữ thường
            strict: true // Loại bỏ các ký tự không hợp lệ
        });
        const link = `https://timviec365.vn/ung-vien/${alias}-uv${use_id}.html`;
        const category = await CategoryJob.findOne({ cat_id: user.cv_cate_id[0] }, { cat_name: 1 });
        const city = await City.findOne({ _id: user.cv_city_id[0] }, { name: 1 });
        const cityName = city ? city.name : 'Xem trong CV';
        const catName = category ? category.cat_name : 'Xem trong CV';
        await serviceSendMess.NotificationTimviec365(
            company._id,
            user._id,
            user.use_first_name,
            link,
            cityName,
            catName,
            company.idTimViec365
        );

        return true;
    }
    return false;
}

exports.updateCandidate = async(use_id) => {
    await Candidate.updateOne({ _id: use_id }, {
        $set: {
            "inForPerson.candidate": {
                use_type: 0
            },
        }
    });
}

exports.getUrlVideo = (createTime, video) => {
    return `${process.env.cdn}/pictures/cv/${functions.convertDate(createTime,true)}/${video}`;
}

exports.getUrlProfile = (createTime, profile) => {
    return `${process.env.cdn}/pictures/cv/${functions.convertDate(createTime,true)}/${profile}`;
}

exports.checkUrlProfile = (createTime, profile) => {
    let path = `../storage/base365/timviec365/pictures/cv/${functions.convertDate(createTime,true)}/${profile}`
    return fs.existsSync(path);
}
exports.getDirProfile = (createTime, profile) => {
    let path = `../storage/base365/timviec365/pictures/cv/${functions.convertDate(createTime,true)}/${profile}`
    return path;
}

exports.uploadProfile = async(file_cv, createdAt) => {
    const targetDirectory = `${process.env.storage_tv365}/pictures/cv/${functions.convertDate(createdAt,true)}`;
    const typeFile = functions.fileType(file_cv);
    // Đặt lại tên file
    const originalname = file_cv.originalFilename;
    const extension = originalname.split('.').pop();
    const uniqueSuffix = Date.now();
    const now = functions.getTimeNow();
    let nameFile = `cv_${uniqueSuffix}.${extension}`;
    if (typeFile == "mp4" || typeFile == "quicktime") {
        if (typeFile == "mp4") {
            nameFile = `video_uv_${now}.mp4`;
        } else {
            nameFile = `video_uv_${now}.mov`;
        }
    }

    if (!fs.existsSync(targetDirectory)) { // Nếu thư mục chưa tồn tại thì tạo mới
        fs.mkdirSync(targetDirectory, { recursive: true });
    }

    // Đường dẫn tới file cũ
    const oldFilePath = file_cv.path;

    // Đường dẫn tới file mới
    const newFilePath = path.join(targetDirectory, nameFile);

    // Di chuyển file và đổi tên file
    fs.rename(oldFilePath, newFilePath, async function(err) {
        if (err) {
            console.error(err);
            return false;
        }
    });
    return { typeFile, nameFile };
}

//Tính phần trăm hoàn thiện hồ sơ của UV
exports.percentHTHS = async(userID) => {
    let percent = 0;
    try {
        let user = await functions.getDatafindOne(Candidate, { idTimViec365: userID, type: { $ne: 1 } });
        if (user) {
            let checkCV = await functions.getDatafindOne(SaveCvCandi, { uid: userID });
            let checkImg = await functions.getDatafindOne(ImagesUser, { img_user_id: userID });
            let profile = await functions.getDatafindOne(Profile, { hs_use_id: userID });
            let userCV = user.inForPerson ? user.inForPerson.candidate : null;
            let userInfo = user.inForPerson ? user.inForPerson.account : null;
            let voteUV = await SaveVoteCandidate.findOne({ type: "candidate", id_be_vote: userID });
            let permissionNotify = await functions.getDatafindOne(PermissionNotify, { pn_use_id: userID });
            let checkUserPercent = {
                userCity: user.city ? 0.5 : 0,
                userDistrict: user.district ? 0.5 : 0,
                userAddress: user.address ? 0.5 : 0,
                userCate: userCV && userCV.cv_cate_id.length ? 6 : 0,
                userPosition: userCV && userCV.cv_capbac_id ? 1 : 0,
                userCVCity: userCV && userCV.cv_city_id.length ? 6 : 0,
                userSharePermission: user.sharePermissionId.length ? 0.5 : 0,
                userBirthday: userInfo.birthday ? 4 : 0,
                userGender: userInfo.gender > 0 ? 5 : 0,
                userCareerGoal: (userCV && userCV.cv_muctieu) ? 6 : 0,
                userEducation: userCV && userCV.profileDegree.length ? 5 : 0,
                userSkill: userCV && userCV.cv_kynang ? 0.5 : 0,
                userExperience: userCV && userCV.profileExperience.length ? 8 : 0, //5% kinh nghiệm, 3% dự án tham gia
                userCertificate: userCV && userCV.profileNgoaiNgu.length ? 0.5 : 0,
                userPrize: userCV && userCV.cv_giai_thuong ? 0.5 : 0,
                userActivity: userCV && userCV.cv_hoat_dong ? 0.5 : 0,
                userProject: userCV && userCV.cv_duan ? 3 : 0,
                userInterest: userCV && userCV.cv_so_thich ? 0.5 : 0,
                userReference: userCV && userCV.cv_tc_phone ? 0.5 : 0,
                userImage: checkImg || user.avatarUser ? 1 : 0,
                userMoney: userCV && userCV.cv_money_id ? 1 : 0,
                userMarried: userCV && userInfo.married ? 1 : 0,
                userWay: userCV && userCV.cv_loaihinh_id ? 5 : 0,
                userReview: userCV && voteUV ? 0.5 : 0,
                userView: userCV && user.view ? 0.5 : 0,
                userCVShow: (profile && profile.hs_name) || checkCV || userCV.cv_video ? 45 : 0,
                userPermissionNotify: permissionNotify ? 0.5 : 0,
            }

            Object.keys(checkUserPercent).forEach((key) => {
                percent += checkUserPercent[key];
            })
            if (user.fromDevice == 1) {
                percent = 45;
            }
            if ((percent >= 45 && !user.inForPerson.candidate.send_crm)) {
                //Bắn sang CRM
                const link_multi = `${functions.siteName()}/admin/modules/ungvien/edit.php?record_id=${user.idTimViec365}`;
                let textCheck = '';
                textCheck += userCV.cv_muctieu ? userCV.cv_muctieu : '';
                textCheck += userCV.cv_kynang ? userCV.cv_kynang : '';
                textCheck += userCV.cv_duan ? userCV.cv_duan : '';
                textCheck += userCV.cv_giai_thuong ? userCV.cv_giai_thuong : '';
                textCheck += userCV.cv_hoat_dong ? userCV.cv_hoat_dong : '';
                let checkCate = functions.checkCateCandi(userCV.cv_title, textCheck, userCV.cv_cate_id);
                if (checkCate) {
                    serviceCrm.sendataHr(user.userName, user.email, user.phone, user.idTimViec365, link_multi, user._id);
                }
                await Candidate.updateOne({ _id: user._id }, {
                    $set: { "inForPerson.candidate.send_crm": 1 }
                })
                serviceSendMess.registerUser(user.idTimViec365);
            }
        }

    } catch (e) {
        console.log(e);
    }
    return percent;
}


exports.checkImageSize = async(idTimViec365) => {
    const user = await Candidate.findOne({ idTimViec365 }).lean();
    let fileSize = 0;
    if (user) {
        const d = new Date(user.createdAt * 1000),
            day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate(),
            month = d.getMonth() < 10 ? "0" + Number(d.getMonth() + 1) : d.getMonth(),
            year = d.getFullYear();
        const dir = `${process.env.storage_tv365}/pictures/cv/${year}/${month}/${day}/`;
        //check file ảnh
        listFile = await ImagesUser.find({ img_user_id: idTimViec365 }).lean();
        if (listFile) {
            listFile.forEach((img, i) => {
                let filePath = dir + img.img;
                let stats = fs.statSync(filePath);
                if (stats) {
                    let fileSizeInBytes = stats.size;
                    let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
                    fileSize += fileSizeInMegabytes;
                }
            })
        }

        //check video
        if (user.inForPerson.candidate && user.inForPerson.candidate.cv_video_type == 1) {
            let filePath = dir + user.inForPerson.candidate.cv_video;
            let stats = fs.statSync(filePath);
            if (stats) {
                let fileSizeInBytes = stats.size;
                let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
                fileSize += fileSizeInMegabytes;
            }
        }
    }
    return fileSize;
}

exports.shareUserUnset = async() => {
    try {
        const gr_id = 432;
        const group = await GroupCrm.findOne({ gr_id });
        if (group) {
            let listGroup;
            if (group.emp_id != 'all') {
                listGroup = group.emp_id.split(',');
            } else {
                const findEmployee = await Users.find({ "inForPerson.employee.dep_id": group.dep_id }, { idQLC: 1 });
                listGroup = findEmployee.map(item => Number(item.idQLC))
            }
            let index = 0;

            const lastUserUnset = await UserUnset.findOne({ emp_id: { $ne: 0 } }, { emp_id: 1 }).sort({ id: -1 });
            if (lastUserUnset) {
                const lastIndex = listGroup.indexOf(lastUserUnset.emp_id);
                if (lastIndex != listGroup.length - 1) {
                    index = lastIndex + 1;
                }
            }
            return { emp_id: listGroup[index] };
        }
        return { emp_id: 0 };
    } catch (error) {
        console.log(error)
        return { emp_id: 0 };
    }
}

exports.shareCandidate = async(use_id) => {
    try {
        const gr_id = 430;
        const group = await GroupCrm.findOne({ gr_id });
        if (group && group.emp_id != 'all') {
            let index = 0;
            const listGroup = group.emp_id.split(',').map(Number);
            const lastUserUnset = await HistoryCandidateCrm.findOne({ emp_id: { $ne: 0 } }, { emp_id: 1 }).sort({ _id: -1 });
            if (lastUserUnset) {
                const lastIndex = listGroup.indexOf(lastUserUnset.emp_id);
                if (lastIndex != listGroup.length - 1) {
                    index = lastIndex + 1;
                }
            }
            const emp_id = listGroup[index];
            const time_created = functions.getTimeNow();

            new HistoryCandidateCrm({ use_id, emp_id, time_created }).save();

            return { emp_id };
        }
        return { emp_id: 0 };
    } catch (error) {
        return { emp_id: 0 };
    }
}

exports.sendCvCandi = async() => {

}

exports.uploadAudio = (id, base64String) => {
    let path1 = `${process.env.storage_tv365}/audio/candidate/${id}/`;
    if (!fs.existsSync(path1)) {
        fs.mkdirSync(path1, { recursive: true });
    }
    let data = Buffer.from(base64String, 'base64');

    const audioName = `${Date.now()}.wav`;
    fs.writeFile(path1 + audioName, data, (err) => {
        if (err) {
            console.log(err);
        }
    });

    return `${process.env.cdn}/audio/candidate/${id}/${audioName}`;
};

exports.getDataHr = async() => {

}

exports.getListNewIdByAI = async(id_user) => {
    let postAI = [];
    try {
        let takeData = await axios({
            method: "post",
            url: "http://43.239.223.21:7001/recommend_uv",
            data: { id_user },
            headers: { "Content-Type": "multipart/form-data" }
        });

        if (takeData.data.data != null && takeData.data.data.list_id != '') {
            let listNewId = takeData.data.data.list_id.split(",").map(Number);

            postAI = await NewTV365.aggregate([{
                    $match: {
                        new_id: { $in: listNewId },
                    }
                },
                {
                    $lookup: {
                        from: "Users",
                        localField: "new_user_id",
                        foreignField: "idTimViec365",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    $project: {
                        new_id: 1,
                        usc_company: '$user.userName',
                        usc_logo: '$user.avatarUser',
                        usc_id: '$user.idTimViec365',
                        usc_alias: '$user.alias',
                        usc_create_time: '$user.createdAt',
                        new_title: 1,
                        new_alias: 1,
                        new_city: 1,
                        new_han_nop: 1,
                        new_hot: 1,
                        new_cao: 1,
                        new_gap: 1,
                        new_money: 1,
                        nm_type: 1,
                        nm_id: 1,
                        nm_min_value: 1,
                        nm_max_value: 1,
                        nm_unit: 1,
                    }
                },
            ]);

            for (let i = 0; i < postAI.length; i++) {
                const element = postAI[i]
                element.usc_logo = functions.getUrlLogoCompany(element.usc_create_time, element.usc_logo);
            }
        }
        return postAI;
    } catch (e) {
        console.log(e.message)
        return postAI;
    }
}

exports.registerUserToWork247 = async(phone_tk, password, cv_title, use_email_contact, cv_cate_id, cv_city_id, use_name, file = '', avatar = '') => {
    try {
        if (file != '') {
            let data = new FormData();
            data.append('phone_tk', phone_tk);
            data.append('password', password);
            data.append('cv_title', cv_title);
            data.append('use_email_contact', use_email_contact);
            data.append('cv_cate_id', cv_cate_id);
            data.append('cv_city_id', cv_city_id);
            data.append('use_name', use_name);
            data.append('file', file);
            data.append('avatar', avatar);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://work247.vn/api202/register_candidate.php',
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
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}