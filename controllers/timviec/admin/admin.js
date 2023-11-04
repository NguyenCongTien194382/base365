const md5 = require('md5');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const service = require('../../../services/timviec365/candidate');
const serviceDataAI = require('../../../services/timviec365/dataAI');
const functions = require('../../../services/functions');

const Users = require('../../../models/Users');
const AdminUser = require('../../../models/Timviec365/Admin/AdminUser');
const Modules = require('../../../models/Timviec365/Admin/Modules');
const AdminUserRight = require('../../../models/Timviec365/Admin/AdminUserRight');
const AdminTranslate = require('../../../models/Timviec365/Admin/AdminTranslate');
const { recordCreditsHistory } = require("../credits");
const PointCompany = require("../../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany")
const Profile = require('../../../models/Timviec365/UserOnSite/Candicate/Profile');
const SaveCvCandi = require('../../../models/Timviec365/UserOnSite/Candicate/SaveCvCandi'); // Cv đã lưu
const Category = require('../../../models/Timviec365/CategoryJob');
const HoSoUV = require('../../../models/Timviec365/CV/ResumeUV'); // Sơ yếu lý lịch đã lưu
const LetterUV = require('../../../models/Timviec365/CV/LetterUV'); // Thư xin việc đã lưu
const ApplyForJob = require('../../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');
const NewTV365 = require('../../../models/Timviec365/UserOnSite/Company/New');
const Customer = require('../../../models/crm/Customer/customer');



const getIP = (req) => {
    let forwardedIpsStr = req.header('x-forwarded-for');
    let ip = '';
    if (forwardedIpsStr) {
        ip = forwardedIpsStr.split(',')[0];
    } else {
        ip = req.socket.remoteAddress
    }
    return ip;
}

// Đăng nhập
// exports.login = async(req, res) => {
//     try {
//         if (req.body.adm_loginname && req.body.adm_password) {
//             const loginName = req.body.adm_loginname
//             const password = req.body.adm_password
//             let findUser = await functions.getDatafindOne(AdminUser, { loginName })
//             if (findUser) {
//                 let checkPassword = await functions.verifyPassword(password, findUser.password)
//                 if (checkPassword) {
//                     let updateUser = await functions.getDatafindOneAndUpdate(AdminUser, { loginName }, {
//                         date: new Date(Date.now())
//                     }, { new: true });
//                     const token = await functions.createToken(updateUser, "1d")
//                     return functions.success(res, 'Đăng nhập thành công', { token: token })
//                 }
//                 return functions.setError(res, "Mật khẩu sai", 406);
//             }
//             return functions.setError(res, "không tìm thấy tài khoản trong bảng admin user", 405)
//         }
//         return functions.setError(res, "Missing input value!", 404)
//     } catch (error) {
//         return functions.setError(res, error.message)
//     }

// }

exports.login = async(req, res) => {
    const { adm_loginname, adm_password } = req.body;
    const result = await AdminUser.findOne({
        adm_loginname: adm_loginname,
        adm_password: md5(adm_password)
    }).select('adm_id').lean();
    if (result) {
        result.timeLogin = functions.getTimeNow();
        const token = await functions.createToken(result, "1d");
        return functions.success(res, 'thành công', {
            adm_id: result.adm_id,
            token: token
        });
    }
    return functions.setError(res, 'vui lòng thử lại');
}

exports.translate = async(req, res) => {
    const list = await AdminTranslate.find();
    return functions.success(res, "", { data: list });
}

// hàm lấy dữ liệu modules
exports.getModules = async(req, res, next) => {
    try {
        const { isAdmin, user_id } = req.body;
        if (isAdmin == 1) {
            let modules = await Modules.find({ mod_parent: { $ne: 0, $ne: null } }).sort({ mod_order: 1 }).lean();
            return functions.success(res, 'lấy dữ liệu thành công', {
                modules
            })
        } else {
            return functions.setError(res, '123');
        }


    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
};

exports.accessmodule = async(req, res) => {
    try {
        const { userlogin, password, module_id } = req.body;
        const check = await AdminUserRight.aggregate([{
            $lookup: {
                from: "AdminUser",
                localField: "adu_admin_id",
                foreignField: "adm_id",
                as: "admin"
            }
        }, {
            $unwind: "$admin"
        }, {
            $match: {
                "admin.adm_loginname": userlogin,
                "admin.adm_password": password,
                "admin.adm_active": 1,
                "admin.adm_delete": 0,
            }
        }, {
            $lookup: {
                from: "modules",
                localField: "adu_admin_module_id",
                foreignField: "mod_id",
                as: "modules",
            }
        }, {
            $unwind: "$modules"
        }, {
            $match: {
                "modules.mod_id": module_id
            }
        }, {
            $project: {
                module_id: "$modules.mod_id"
            }
        }]);
        return functions.success(res, "...", { check });
    } catch (error) {
        return functions.setError(res, error);
    }
}

// Lấy thông tin admin qua trường id bộ phận và không cần đăng nhập
exports.getInfoAdminUser = async(req, res) => {
    const adm_bophan = req.body.adm_bophan;
    if (adm_bophan) {
        const admin = await AdminUser.findOne({ adm_bophan: adm_bophan }).lean();
        return functions.success(res, "Thông tin KD", { admin });
    }
    return functions.setError(res, "Chưa truyền adm_bophan");
}

exports.infor = async(req, res) => {
    const { adm_id } = req.body;
    const admin = await AdminUser.findOne({ adm_id: adm_id }).lean();
    return functions.success(res, "Thông tin KD", { admin });
}

exports.inforBophan = async(req, res) => {
    const { adm_bophan } = req.body;
    const admin = await AdminUser.findOne({ adm_bophan: adm_bophan }).lean();
    return functions.success(res, "Thông tin KD", { admin });
}

exports.bophan_list = async(req, res) => {
    const list = await AdminUser.find({
        adm_bophan: { $ne: 0 }
    }).sort({
        adm_bophan: 1
    }).lean();
    return functions.success(res, "Thông tin KD", { data: list });
}


exports.listingCompany = async(req, res) => {
    let condition = {
        type: 1,
        "inForCompany.timviec365.usc_md5": ""
    };
    const list = await Users.find(condition).limit(30).lean();
    const count = await Users.countDocuments(condition);
    return functions.success(res, "Thông tin KD", {
        data: {
            list,
            count
        }
    });
}

// hàm lấy danh sách admin
exports.getListAdmin = async(req, res, next) => {
    try {
        let listADmin = await functions.getDatafind(AdminUser);
        return functions.success(res, 'lấy dữ liệu thành công', listADmin)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm xóa admin
exports.deleteAdmin = async(req, res, next) => {
    try {
        let id = req.user.data._id;
        if (id) {
            await AdminUser.deleteOne({ _id: id });
            let adminRight = await functions.getDatafind(AdminUserRight, { adminID: id })
            if (adminRight.length > 0) {
                await AdminUserRight.deleteMany({ adminID: id });
            }
            return functions.success(res, 'xóa thành công')
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập active
exports.updateActive = async(req, res, next) => {
    try {
        let id = req.user.data._id;
        let active = req.body.active;
        if (id) {
            let admin = await functions.getDatafindOne(AdminUser, { _id: id })
            if (admin) {
                await AdminUser.updateOne({ _id: id }, {
                    $set: {
                        active: active,
                    }
                });
                return functions.success(res, 'cập nhập thành công')
            }
            return functions.setError(res, 'admin không tồn tại', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm đổi mật khẩu 
exports.updatePassword = async(req, res, next) => {
    try {
        let id = req.user.data._id;
        let password = req.body.password;
        if (id) {
            let admin = await functions.getDatafindOne(AdminUser, { _id: id })
            if (admin) {
                await AdminUser.updateOne({ _id: id }, {
                    $set: {
                        password: md5(password),
                    }
                });
                return functions.success(res, 'cập nhập thành công')
            }
            return functions.setError(res, 'admin không tồn tại', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// luồng ứng viên
exports.candi_register = async(req, res) => {
    try {
        let condition = {
            fromDevice: { $nin: [4, 7] },
            type: 0,
            fromWeb: { $in: ["timviec365", "dev.timviec365"] }
        };
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;

        const use_id = req.body.use_id;
        if (use_id != 0) {
            condition.idTimViec365 = Number(use_id);
        }
        const use_first_name = req.body.use_first_name;
        if (use_first_name != 0) {
            // condition.use_first_name = { $regex: use_first_name };
        }
        const list = await Users.aggregate([
            { $match: condition },
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $project: {
                    use_id: "$idTimViec365",
                    use_logo: "$avatarUser",
                    use_create_time: "$createdAt",
                    use_first_name: "$userName",
                    use_gioi_tinh: "$inForPerson.account.gender" || null,
                    use_phone: "$phone",
                    use_email: "$email",
                    cv_title: "$inForPerson.candidate.cv_title",
                    use_address: "$address",
                    dk: "$fromDevice",
                    use_view: "$inForPerson.candidate.use_view",
                    use_phone_tk: "$phoneTK",
                    user_xac_thuc: "$otp" || null,
                    use_authentic: "$authentic",
                }
            }
        ]);
        const count = await Users.countDocuments(condition);
        return functions.success(res, "Danh sách", {
            data: {
                list,
                count
            }
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.topupCredits = async(req, res) => {
    try {
        let {
            usc_id,
            amount,
            //0 là trừ tiền, 1 là nạp tiền
            type
        } = req.body;

        if (!type) type = 1;
        let idAdmin = req.user.data._id;
        let checkAdmin = await functions.getDatafindOne(AdminUser, { _id: idAdmin });
        if (checkAdmin) {
            if (usc_id && amount) {
                let company = await Users.findOne({ idTimViec365: usc_id, type: 1 });
                if (company) {
                    let doc = await PointCompany.findOne({ usc_id });
                    if (!doc) {
                        if (type === 1) {
                            doc = await (new PointCompany({
                                usc_id: usc_id,
                                money_usc: amount,
                            })).save();
                        } else if (type === 0) {
                            return functions.setError(res, "Trừ tiền không hợp lệ", 400);
                        } else {
                            return functions.setError(res, "Thao tác không hợp lệ", 400);
                        }
                    } else {
                        if (type === 1) {
                            doc = await PointCompany.findOneAndUpdate({ usc_id }, { $inc: { money_usc: amount } }, { new: true });
                        } else if (type === 0) {
                            doc = await PointCompany.findOneAndUpdate({ usc_id }, { $inc: { money_usc: -amount } }, { new: true });
                        } else {
                            return functions.setError(res, "Thao tác không hợp lệ", 400);
                        }
                    }

                    await recordCreditsHistory(
                        usc_id,
                        type === 1 ? 1 : 0,
                        amount,
                        checkAdmin.adm_id ? checkAdmin.adm_id : -1,
                        getIP(req),
                        `Ví 365`,
                        doc.money_usc,
                        0);
                    return functions.success(res, "Nạp tiền thành công!")
                } else {
                    return functions.setError(res, "Không tồn tại công ty có ID này", 400);
                }
            } else {
                return functions.setError(res, "Thiếu các trường cần thiết", 429);
            }
        } else {
            return functions.setError(res, 'Bạn không có quyền thực hiện hành động này!', 403)
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.updateCandiDate = async(req, res) => {
    try {
        let idTimViec365 = req.body.idTimViec365
        let avatarUser = req.files.avatarUser ? req.files.avatarUser : null;
        let userName = req.body.userName ? req.body.userName : "";
        let phone = req.body.phone
        let birthday = req.body.birthday
        let gender = req.body.gender
        let married = req.body.married
        let city = req.body.city
        let district = req.body.district
        let address = req.body.address
        let cv_city_id = req.body.cv_city_id.split(",").map(Number);
        let cv_title = req.body.cv_title
        let cv_cate_id = req.body.cv_cate_id.split(",").map(Number);
        let cv_capbac_id = req.body.cv_capbac_id
        let education = req.body.education
        let cv_money_id = req.body.cv_money_id
        let um_unit = req.body.um_unit
        let um_type = req.body.um_type
        let um_min_value = req.body.um_min_value
        let um_max_value = req.body.um_max_value
        let cv_loaihinh_id = req.body.cv_loaihinh_id
        let experience = req.body.experience
        let cv_muctieu = req.body.cv_muctieu
        let cv_kynang = req.body.cv_kynang
        let kn_mota = req.body.kn_mota
        let cv = req.files.cv
        let hs_lang_cv = req.body.hs_lang_cv
        let th_bc = req.body.th_bc //bằng cấp
        let th_name = req.body.th_name //trường học
        let th_one_time = req.body.th_one_time
        let th_two_time = req.body.th_two_time
        let th_cn = req.body.th_cn //chuyên ngành
        let th_xl = req.body.th_xl //xếp loại
        let th_bs = req.body.th_bs //bổ sung
        let kn_cv = req.body.kn_cv //chức danh vị trí
        let kn_name = req.body.kn_name //công ty
        let nn_cc = req.body.nn_cc //chứng chỉ
        let nn_sd = req.body.nn_sd //số điểm
        let use_lat = req.body.use_lat
        let use_long = req.body.use_long
        let admin_id = req.body.admin_id;
        let nn_id_pick = req.body.nn_id_pick
        let findUser = await Users.findOne({ idTimViec365: idTimViec365, type: 0 }).lean();
        const now = functions.getTimeNow();
        if (findUser) {
            let condition = {
                updatedAt: now,
                fromDevice: 1
            };
            let conditionPush = {}
            if (avatarUser) {
                if (avatarUser.size > 0 && avatarUser.originalFilename != condition.avatarUser) {
                    const uploadLogo = functions.uploadImageUv(avatarUser, findUser.createdAt);
                    condition.avatarUser = uploadLogo.file_name;
                }
            }
            if (userName) condition.userName = userName

            if (phone) condition.phone = phone

            if (birthday) {
                condition = { "inForPerson.account.birthday": Number(birthday), ...condition };
            }
            if (gender) {
                condition = { "inForPerson.account.gender": Number(gender), ...condition };
            }
            if (married) {
                condition = { "inForPerson.account.married": married, ...condition };
            }
            if (city) condition.city = city

            if (district) condition.district = district

            if (address) condition.address = address

            if (cv_city_id) {
                condition = { "inForPerson.candidate.cv_city_id": cv_city_id, ...condition };
            }
            if (cv_title) {
                condition = { "inForPerson.candidate.cv_title": cv_title, ...condition };
            }
            if (cv_cate_id) {
                condition = { "inForPerson.candidate.cv_cate_id": cv_cate_id, ...condition };
            }
            if (cv_capbac_id) {
                condition = { "inForPerson.candidate.cv_capbac_id": Number(cv_capbac_id), ...condition };
            }
            if (use_lat) condition.latitude = use_lat

            if (use_long) condition.longitude = use_long

            if (um_type) { condition = { "inForPerson.candidate.um_type": Number(um_type), ...condition } }

            if (education) {
                condition = { "inForPerson.account.education": education, ...condition };
            }
            if (cv_money_id) {
                condition = { "inForPerson.candidate.cv_money_id": cv_money_id, ...condition };
            }
            if (um_unit) {
                condition = { "inForPerson.candidate.um_unit": um_unit, ...condition };
            }
            if (um_min_value) {
                condition = { "inForPerson.candidate.um_min_value": um_min_value, ...condition };
            }
            if (um_max_value) {
                condition = { "inForPerson.candidate.um_max_value": um_max_value, ...condition };
            }
            if (cv_loaihinh_id) {
                condition = { "inForPerson.candidate.cv_loaihinh_id": cv_loaihinh_id, ...condition };
            }
            if (experience) {
                condition = { "inForPerson.account.experience": experience, ...condition };
            }
            if (cv_muctieu) {
                condition = { "inForPerson.candidate.cv_muctieu": cv_muctieu, ...condition };
            }
            if (cv_kynang) {
                condition = { "inForPerson.candidate.cv_kynang": cv_kynang, ...condition };
            }
            if (cv) {
                const idProfile = await Profile.findOne({ hs_use_id: findUser.idTimViec365 }, { hs_id: 1, hs_link: 1 });
                if (cv.size > 0 && cv.originalFilename != idProfile.hs_link) {
                    let uploadCv = await service.uploadProfile(cv, findUser.createdAt);
                    // Cập nhật
                    let dataUpload = {}
                    if (idProfile) {
                        dataUpload = {
                            hs_id: idProfile.hs_id,
                            hs_name: req.files.cv.originalFilename,
                            hs_link: uploadCv.nameFile,
                        };
                        conditionPush = {
                            'inForPerson.candidate.profileUpload': {
                                hs_id: idProfile.hs_id,
                                hs_name: req.files.cv.originalFilename,
                                hs_lang_cv: hs_lang_cv,
                                hs_link: uploadCv.nameFile,
                                hs_active: 1,
                                hs_update_time: now
                            },
                            ...conditionPush
                        }
                    } else {
                        await Users.updateOne({ hs_use_id: findUser.idTimViec365 }, { $unset: { 'inForPerson.candidate.profileUpload': 1 } })
                        const getMaxIdProfile = await Profile.findOne({}, { hs_id: 1 }).sort({ hs_id: -1 }).limit(1).lean();
                        dataUpload = {
                            hs_id: 1,
                            hs_use_id: idProfile.hs_id,
                            hs_name: req.files.cv.originalFilename,
                            hs_create_time: now,
                            hs_active: 1,
                            hs_link: uploadCv.nameFile,
                        };
                        conditionPush = {
                            'inForPerson.candidate.profileUpload': {
                                hs_id: 1,
                                hs_name: req.files.cv.originalname,
                                hs_lang_cv: hs_lang_cv,
                                hs_link: uploadCv.nameFile,
                                hs_active: 1,
                                hs_create_time: now
                            },
                            ...conditionPush
                        }
                    }
                    const profile = new Profile(dataUpload);
                    await profile.save();
                }
            }

            if (kn_mota || kn_name || kn_cv) {

                if (findUser.inForPerson.candidate.profileExperience.length == 0) {
                    conditionPush = {
                        'inForPerson.candidate.profileExperience': {
                            kn_id: 1,
                            kn_name: kn_name,
                            kn_cv: kn_cv,
                            kn_mota: kn_mota,
                        },
                        ...conditionPush
                    }
                } else {
                    await Users.updateOne({ idTimViec365: idTimViec365, type: 0 }, { $unset: { 'inForPerson.candidate.profileExperience': 1 } })
                    conditionPush = {
                        'inForPerson.candidate.profileExperience': {
                            kn_id: 1,
                            kn_name: kn_name,
                            kn_cv: kn_cv,
                            kn_mota: kn_mota,
                        },
                        ...conditionPush
                    }
                }

            }

            if (th_bc || th_name || th_one_time || th_two_time || th_cn || th_xl || th_bs) {

                if (findUser.inForPerson.candidate.profileDegree.length == 0) {
                    conditionPush = {
                        'inForPerson.candidate.profileDegree': {
                            th_id: 1,
                            th_name: th_name,
                            th_one_time: th_one_time,
                            th_two_time: th_two_time,
                            th_cn: th_cn,
                            th_xl: th_xl,
                            th_bs: th_bs,
                            th_bc: th_bc
                        },
                        ...conditionPush
                    }
                } else {
                    await Users.updateOne({ idTimViec365: idTimViec365, type: 0 }, { $unset: { 'inForPerson.candidate.profileDegree': "" } })
                    conditionPush = {
                        'inForPerson.candidate.profileDegree': {
                            th_id: 1,
                            th_name: th_name,
                            th_one_time: th_one_time,
                            th_two_time: th_two_time,
                            th_cn: th_cn,
                            th_xl: th_xl,
                            th_bs: th_bs,
                            th_bc: th_bc
                        },
                        ...conditionPush
                    }
                }
            }

            if (nn_cc || nn_sd) {
                if (findUser.inForPerson.candidate.profileNgoaiNgu == 0) {
                    conditionPush = {
                        'inForPerson.candidate.profileNgoaiNgu': {
                            nn_id: 1,
                            nn_cc: nn_cc,
                            nn_sd: nn_sd,
                            nn_id_pick: nn_id_pick,
                        },
                        ...conditionPush
                    }
                } else {
                    await Users.updateOne({ idTimViec365: idTimViec365, type: 0 }, { $unset: { 'inForPerson.candidate.profileNgoaiNgu': "" } })
                    conditionPush = {
                        'inForPerson.candidate.profileNgoaiNgu': {
                            nn_id: 1,
                            nn_cc: nn_cc,
                            nn_sd: nn_sd,
                            nn_id_pick: nn_id_pick,
                        },
                        ...conditionPush
                    }
                }
            }
            condition = { $push: conditionPush, ...condition }
            await Users.findOneAndUpdate({ idTimViec365, type: 0 }, condition);
            const admin_infor = await AdminUser.findOne({ adm_id: admin_id }).select("adm_nhaplieu");
            if (findUser.dk == 4 || admin_id == 223 || (admin_infor && admin_infor.adm_nhaplieu != 0)) {
                const percent = 45;
                await Users.updateOne({ idTimViec365, type: 0 }, {
                    $set: {
                        authentic: 1,
                        createdAt: now,
                        updatedAt: now,
                        "inForPerson.candidate.percents": percent
                    }
                });
            } else {
                // Tính % hoàn thiện hồ sơ và xóa bên crm
                const percent = await service.percentHTHS(idTimViec365);
                await Users.updateOne({ idTimViec365, type: 0 }, {
                    $set: {
                        "inForPerson.candidate.percents": percent
                    }
                });
            }
            // await Customer.deleteOne({ id_cus_from: idTimViec365, cus_from: "uv_timviec365" });
            return functions.success(res, "Cập nhật thông tin ứng viên thành công");
        }
        return functions.setError(res, "không tìm thấy user này");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.infoCandidate = async(req, res, next) => {
    try {
        if (req.body.iduser) {
            const userId = Number(req.body.iduser);
            const useraggre = await Users.aggregate([{
                $match: {
                    idTimViec365: userId,
                    type: { $ne: 1 }
                }
            }, {
                $project: {
                    _id: 0,
                    "use_id": "$idTimViec365",
                    "use_email": "$email",
                    "use_phone_tk": "$phoneTK",
                    "use_phone": "$phone",
                    "use_first_name": "$userName",
                    "use_update_time": "$updatedAt",
                    "use_create_time": "$createdAt",
                    "use_logo": "$avatarUser",
                    "use_email_lienhe": "$emailContact",
                    "use_gioi_tinh": "$inForPerson.account.gender",
                    "use_birth_day": "$inForPerson.account.birthday",
                    "use_city": "$city",
                    "use_quanhuyen": "$district",
                    "use_address": "$address",
                    "use_hon_nhan": "$inForPerson.account.married",
                    "use_view": "$inForPerson.candidate.use_view",
                    "use_authentic": "$authentic",
                    "cv_user_id": "$idTimViec365",
                    "cv_title": "$inForPerson.candidate.cv_title",
                    "cv_exp": "$inForPerson.account.experience",
                    "cv_muctieu": "$inForPerson.candidate.cv_muctieu",
                    "cv_cate_id": "$inForPerson.candidate.cv_cate_id",
                    "cv_city_id": "$inForPerson.candidate.cv_city_id",
                    "cv_capbac_id": "$inForPerson.candidate.cv_capbac_id",
                    "cv_money_id": "$inForPerson.candidate.cv_money_id",
                    "cv_loaihinh_id": "$inForPerson.candidate.cv_loaihinh_id",
                    "cv_kynang": "$inForPerson.candidate.cv_kynang",
                    "cv_tc_name": "$inForPerson.candidate.cv_tc_name",
                    "cv_tc_cv": "$inForPerson.candidate.cv_tc_cv",
                    "cv_tc_phone": "$inForPerson.candidate.cv_tc_phone",
                    "cv_tc_email": "$inForPerson.candidate.cv_tc_email",
                    "cv_tc_company": "$inForPerson.candidate.cv_tc_company",
                    "cv_video": "$inForPerson.candidate.cv_video",
                    "cv_video_type": "$inForPerson.candidate.cv_video_type",
                    "cv_hocvan": "$inForPerson.account.education",
                    "um_type": "$inForPerson.candidate.um_type",
                    "um_min_value": "$inForPerson.candidate.um_min_value",
                    "um_max_value": "$inForPerson.candidate.um_max_value",
                    "um_unit": "$inForPerson.candidate.um_unit",
                    "muc_luong": "$inForPerson.candidate.muc_luong",
                    "profileDegree": "$inForPerson.candidate.profileDegree",
                    "profileNgoaiNgu": "$inForPerson.candidate.profileNgoaiNgu",
                    "profileExperience": "$inForPerson.candidate.profileExperience",
                    "user_xac_thuc": "$otp",
                    "use_show": "$inForPerson.candidate.use_show",
                    "chat365_id": "$_id",
                    "candidate": "$inForPerson.candidate",
                    "id_qlc": "$idQLC"
                }
            }]);
            if (useraggre.length > 0) {
                let userInfo = useraggre[0],
                    // Thông tin bằng cấp
                    bang_cap = (userInfo.profileDegree) ? userInfo.profileDegree : [],
                    // Thông tin ngoại ngữ
                    ngoai_ngu = (userInfo.profileNgoaiNgu) ? userInfo.profileNgoaiNgu : [],
                    // Thông tin kinh nghiệm
                    kinh_nghiem = (userInfo.profileExperience) ? userInfo.profileExperience : [];

                // Cập nhật đường dẫn ảnh đại diện
                userInfo.use_logo = functions.getImageUv(userInfo.use_create_time, userInfo.use_logo);
                if (userInfo.cv_city_id) {
                    userInfo.cv_city_id = userInfo.cv_city_id.toString();
                }
                const cv_cate_id = userInfo.cv_cate_id;
                if (userInfo.cv_cate_id) {
                    userInfo.cv_cate_id = userInfo.cv_cate_id.toString();
                }
                const getCvInfor = await SaveCvCandi.findOne({
                    uid: userInfo.use_id
                }).sort({ _id: -1 }).limit(1);
                userInfo.name_img = getCvInfor ? functions.imageCv_2(userInfo.use_create_time, getCvInfor.name_img) : "";
                userInfo.name_img_hide = getCvInfor ? functions.imageCv(userInfo.use_create_time, getCvInfor.name_img_hide) : "";
                // Cập nhật đường dẫn video
                if (userInfo.cv_video && userInfo.cv_video_type == 1) {
                    userInfo.cv_video = service.getUrlVideo(userInfo.use_create_time, userInfo.cv_video)
                }
                const getFileUpLoad = await Profile.findOne({
                    hs_link: { $ne: '' },
                    hs_use_id: userInfo.use_id,
                }).sort({ hs_active: -1, hs_id: -1 }).limit(1);
                let fileUpLoad = "";
                if (getFileUpLoad) {
                    fileUpLoad = {
                        hs_link: getFileUpLoad.hs_link,
                        hs_link_hide: getFileUpLoad.hs_link_hide,
                        hs_link_full: service.getUrlProfile(userInfo.use_create_time, getFileUpLoad.hs_link)
                    };
                }
                userInfo.fileUpLoad = fileUpLoad;
                let don_xin_viec,
                    thu_xin_viec,
                    syll;
                don_xin_viec = await SaveCvCandi.findOne({ uid: userId }, { name_img: 1 }).sort({ id: -1 }).limit(1).lean();
                thu_xin_viec = await LetterUV.findOne({ uid: userId }, { name_img: 1 }).sort({ id: -1 }).limit(1).lean();
                syll = await HoSoUV.findOne({ uid: userId }, { name_img: 1 }).sort({ id: -1 }).limit(1).lean();
                return functions.success(res, "Hiển thị chi tiết ứng viên thành công", {
                    thong_tin: userInfo,
                    bang_cap,
                    ngoai_ngu,
                    kinh_nghiem,
                    don_xin_viec,
                    thu_xin_viec,
                    syll
                });
            }
            return functions.setError(res, "Không có thông tin user", 400);
        }
        return functions.setError(res, "thông tin truyền lên không đầy đủ", 400);

    } catch (e) {
        console.log(e);
        return functions.setError(res, "Đã có lỗi xảy ra");
    }
}


exports.insertCandiDate = async(req, res) => {
    try {
        let avatarUser = req.files.avatarUser
        let phoneTK = req.body.phoneTK
        let userName = req.body.userName
        let phone = req.body.phone
        let emailContact = req.body.emailContact
        let password = md5(req.body.password)
        let birthday = req.body.birthday
        let gender = req.body.gender
        let married = req.body.married
        let city = req.body.city
        let district = req.body.district
        let address = req.body.address
        let cv_city_id = req.body.cv_city_id
        let cv_title = req.body.cv_title
        let cv_cate_id = req.body.cv_cate_id
        let cv_capbac_id = req.body.cv_capbac_id
        let education = req.body.education
        let cv_money_id = req.body.cv_money_id
        let um_unit = req.body.um_unit
        let um_min_value = req.body.um_min_value
        let um_max_value = req.body.um_max_value
        let cv_loaihinh_id = req.body.cv_loaihinh_id
        let experience = req.body.experience
        let cv_muctieu = req.body.cv_muctieu
        let cv_kynang = req.body.cv_kynang
        let kn_mota = req.body.kn_mota
        let cv = req.files.cv
        let nn_id_pick = req.body.nn_id_pick
        let th_bc = req.body.th_bc //bằng cấp
        let th_name = req.body.th_name //trường học
        let th_one_time = req.body.th_one_time
        let th_two_time = req.body.th_two_time
        let th_cn = req.body.th_cn //chuyên ngành
        let th_xl = req.body.th_xl //xếp loại
        let th_bs = req.body.th_bs //bổ sung
        let kn_cv = req.body.kn_cv //chức danh vị trí
        let kn_name = req.body.kn_name //công ty
        let nn_cc = req.body.nn_cc //chứng chỉ
        let nn_sd = req.body.nn_sd //số điểm
        let um_type = req.body.um_type
        let use_lat = req.body.use_lat
        let use_long = req.body.use_long
        let um_kg_value = req.body.um_kg_value
        let fromWeb = "timviec365.vn"
        let fromDevice = 1
        let authentic = 1

        const getMaxUserID = await functions.getMaxUserID();
        const now = functions.getTimeNow();

        let condition = {
            _id: getMaxUserID._id,
            idTimViec365: getMaxUserID._idTV365,
            idQLC: getMaxUserID._idQLC,
            idRaoNhanh365: getMaxUserID._idRN365,
            chat365_secret: Buffer.from(getMaxUserID._id.toString()).toString('base64'),
            chat365_id: getMaxUserID._id,
            type: 0,
            updatedAt: now,
            createdAt: now,
            "inForPerson.candidate.percents": 45
        };

        if (avatarUser) {
            if (avatarUser.size > 0) {
                let uploadLogo = functions.uploadImageUv(avatarUser, now);
                condition.avatarUser = uploadLogo.file_name;
            }
        }

        if (use_lat) condition.latitude = use_lat
        if (use_long) condition.longitude = use_long
        if (authentic) condition.authentic = authentic
        if (um_type) {
            condition = { "inForPerson.candidate.um_type": um_type, ...condition };
        }
        if (um_kg_value) {
            condition = { "inForPerson.candidate.um_kg_value": um_kg_value, ...condition };
        }
        if (phoneTK) condition.phoneTK = phoneTK
        if (userName) condition.userName = userName
        if (phone) condition.phone = phone
        if (password) condition.password = password
        if (emailContact) condition.emailContact = emailContact
        if (birthday) {
            condition = { "inForPerson.account.birthday": birthday, ...condition };
        }
        if (gender) {
            condition = { "inForPerson.account.gender": gender, ...condition };
        }
        if (married) {
            condition = { "inForPerson.account.married": married, ...condition };
        }
        if (city) condition.city = city
        if (district) condition.district = district
        if (address) condition.address = address
        if (cv_city_id) {
            condition = { "inForPerson.candidate.cv_city_id": cv_city_id.split(',').map(Number), ...condition };
        }
        if (cv_title) {
            condition = { "inForPerson.candidate.cv_title": cv_title, ...condition };
        }
        if (cv_cate_id) {
            condition = { "inForPerson.candidate.cv_cate_id": cv_cate_id.split(',').map(Number), ...condition };
        }
        if (cv_capbac_id) {
            condition = { "inForPerson.candidate.cv_capbac_id": cv_capbac_id, ...condition };
        }
        if (education) {
            condition = { "inForPerson.account.education": education, ...condition };
        }
        if (cv_money_id) {
            condition = { "inForPerson.candidate.cv_money_id": cv_money_id, ...condition };
        }
        if (um_unit) {
            condition = { "inForPerson.candidate.um_unit": um_unit, ...condition };
        }
        if (um_min_value) {
            condition = { "inForPerson.candidate.um_min_value": um_min_value, ...condition };
        }
        if (um_max_value) {
            condition = { "inForPerson.candidate.um_max_value": um_max_value, ...condition };
        }
        if (cv_loaihinh_id) {
            condition = { "inForPerson.candidate.cv_loaihinh_id": cv_loaihinh_id, ...condition };
        }
        if (experience) {
            condition = { "inForPerson.account.experience": experience, ...condition };
        }
        if (cv_muctieu) {
            condition = { "inForPerson.candidate.cv_muctieu": cv_muctieu, ...condition };
        }
        if (cv_kynang) {
            condition = { "inForPerson.candidate.cv_kynang": cv_kynang, ...condition };
        }
        if (fromWeb) {
            condition.fromWeb = fromWeb;
        }
        if (fromDevice) {
            condition.fromDevice = fromDevice;
        }
        if (cv) {
            if (cv.size > 0) {
                // Thêm mới
                const getMaxIdProfile = await Profile.findOne({}, { hs_id: 1 }).sort({ hs_id: -1 }).limit(1).lean();

                let uploadCv = await service.uploadProfile(cv, now);

                const dataUpload = {
                    hs_id: getMaxIdProfile.hs_id + 1,
                    hs_use_id: getMaxUserID._idTV365,
                    hs_name: req.files.cv.originalFilename,
                    hs_create_time: now,
                    hs_active: 1,
                    hs_link: uploadCv.nameFile,
                };
                const profile = new Profile(dataUpload);
                await profile.save();
                condition = {
                    "inForPerson.candidate.profileUpload": {
                        hs_id: 1,
                        hs_name: req.files.cv.originalFilename,
                        hs_link: uploadCv.nameFile,
                        hs_active: 1,
                        hs_update_time: now
                    },
                    ...condition
                }
            }
        }

        if (kn_mota && kn_name && kn_cv) {
            condition = {
                'inForPerson.candidate.profileExperience': {
                    kn_id: 1,
                    kn_name: kn_name,
                    kn_cv: kn_cv,
                },
                ...condition
            }

        }

        if (th_bc && th_name && th_one_time && th_two_time && th_cn && th_xl && th_bs) {
            condition = {
                'inForPerson.candidate.profileDegree': {
                    th_id: 1,
                    th_name: th_name,
                    th_one_time: th_one_time,
                    th_two_time: th_two_time,
                    th_cn: th_cn,
                    th_xl: th_xl,
                    th_bs: th_bs,
                    th_bc: th_bc
                },
                ...condition
            }
        }

        if (nn_cc && nn_sd) {
            condition = {
                'inForPerson.candidate.profileNgoaiNgu': {
                    nn_id: 1,
                    nn_cc: nn_cc,
                    nn_sd: nn_sd,
                    nn_id_pick: nn_id_pick,
                },
                ...condition
            }

        }
        const newUser = new Users(condition);
        await newUser.save();
        return functions.success(res, "Thêm mới ứng viên thành công", { data: newUser });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

//làm mới hồ sơ
exports.RefreshProfile = async(req, res, next) => {
    try {
        if (req.body.idTimViec365) {
            let idTimViec365 = req.body.idTimViec365

            await Users.updateOne({ idTimViec365: idTimViec365 }, {
                $set: {
                    updatedAt: functions.getTimeNow()
                }
            });

            return functions.success(res, "Làm mới hồ sơ thành công");
        } else {
            return functions.setError(res, "thông tin truyền lên không đầy đủ", 400);
        }
    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.topupCredits = async(req, res) => {
    try {
        let {
            usc_id,
            amount,
            //0 là trừ tiền, 1 là nạp tiền
            type
        } = req.body;
        let idAdmin = req.user.data.adm_id;
        if (!type) type = 1;
        let checkAdmin = await functions.getDatafindOne(AdminUser, { adm_id: idAdmin });
        if (checkAdmin) {
            if (usc_id && amount) {
                let company = await Users.findOne({ idTimViec365: usc_id, type: 1 });
                if (company) {
                    let doc = await PointCompany.findOne({ usc_id });
                    if (!doc) {
                        if (type === 1) {
                            doc = await (new PointCompany({
                                usc_id: usc_id,
                                money_usc: amount,
                            })).save();
                        } else if (type === 0) {
                            return functions.setError(res, "Trừ tiền không hợp lệ", 400);
                        } else {
                            return functions.setError(res, "Thao tác không hợp lệ", 400);
                        }
                    } else {
                        if (type === 1) {
                            doc = await PointCompany.findOneAndUpdate({ usc_id }, { $inc: { money_usc: amount } }, { new: true });
                        } else if (type === 0) {
                            doc = await PointCompany.findOneAndUpdate({ usc_id }, { $inc: { money_usc: -amount } }, { new: true });
                        } else {
                            return functions.setError(res, "Thao tác không hợp lệ", 400);
                        }
                    }

                    await recordCreditsHistory(
                        usc_id,
                        type === 1 ? 1 : 0,
                        amount,
                        idAdmin,
                        getIP(req),
                        `Ví 365`,
                        doc.money_usc,
                        0);
                    return functions.success(res, "Nạp tiền thành công!")
                } else {
                    return functions.setError(res, "Không tồn tại công ty có ID này", 400);
                }
            } else {
                return functions.setError(res, "Thiếu các trường cần thiết", 429);
            }
        } else {
            return functions.setError(res, 'Bạn không có quyền thực hiện hành động này!', 403)
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}


//trạng thái ứng viên nộp hồ sơ
exports.statusApplyForJob = async(req, res, next) => {
    try {
        const data = req.body;
        let { userName, comName, new_title, startDate, endDate, nhs_kq, nguon } = data;

        const page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 30,
            skip = (page - 1) * pageSize;
        let nhs_use_id_arr = [];
        let nhs_com_id_arr = [];
        let nhs_new_id_arr = [];

        let search = {};
        let search_1 = { type: { $ne: 1 }, idTimViec365: { $gt: 0 } };
        let search_2 = { type: 1, idTimViec365: { $gt: 0 } };
        let search_3 = {};

        //Tên ứng viên
        if (userName) {
            search_1.userName = { $regex: new RegExp(userName, 'i') }

            const result = await Users.aggregate([{
                    $match: {
                        type: 0,
                        idTimViec365: { $ne: 0 },
                        userName: { $regex: new RegExp(userName, 'i') }
                    }
                },
                {
                    $project: {
                        idTimViec365: 1
                    }
                }
            ])

            result.forEach(item => {
                nhs_use_id_arr.push(item.idTimViec365)
            });


            search.nhs_use_id = { "$in": nhs_use_id_arr }
        }

        //Tên công ty
        if (comName) {
            search_2.userName = { $regex: new RegExp(comName, 'i') }

            const result = await Users.aggregate([{
                    $match: {
                        type: 1,
                        idTimViec365: { $ne: 0 },
                        userName: { $regex: new RegExp(comName, 'i') }
                    }
                },
                {
                    $project: {
                        idTimViec365: 1
                    }
                }
            ])

            result.forEach(item => {
                nhs_com_id_arr.push(item.idTimViec365)
            });

            search.nhs_com_id = { "$in": nhs_com_id_arr }
        }

        if (new_title) {
            search_3.new_title = { $regex: new RegExp(new_title, 'i') }

            const result = await NewTV365.aggregate([{
                    $match: {
                        new_title: { $regex: new RegExp(new_title, 'i') }
                    }
                },
                {
                    $project: {
                        new_id: 1
                    }
                }
            ])

            result.forEach(item => {
                nhs_new_id_arr.push(item.new_id)
            });

            search.nhs_new_id = { "$in": nhs_new_id_arr }
        }

        if (startDate && !endDate) {
            startDate = parseInt(startDate);
            search.nhs_time = { "$gte": startDate }
        } else if (!startDate && endDate) {
            toDate = parseInt(endDate);
            search.nhs_time = { "$lte": toDate }
        } else if (startDate && endDate) {
            fromDate = parseInt(startDate);
            toDate = parseInt(endDate);
            search.nhs_time = {
                "$gte": fromDate,
                "$lte": toDate
            }
        }

        if (nhs_kq) {
            nhs_kq = parseInt(nhs_kq);
            search.nhs_kq = nhs_kq;
        }

        // 0 => 'Tất cả', 1 => 'Chuyên viên gửi', 2 => 'Tự ứng tuyển'
        if (nguon && parseInt(nguon) == 1) {
            search.nhs_kq = { "$in": [10, 11, 12, 14] }
        }

        if (nguon && parseInt(nguon) == 2) {
            search.nhs_kq = { "$in": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 13] }
        }

        let listCandidate = await ApplyForJob.aggregate([{
                $match: search,
            },
            {
                $sort: {
                    nhs_time: -1,
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: pageSize,
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "nhs_use_id",
                    foreignField: "idTimViec365",
                    as: "user",
                    pipeline: [{
                            $match: search_1
                        },
                        {
                            $project: { userName: 1 }
                        }
                    ]
                },
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "nhs_com_id",
                    foreignField: "idTimViec365",
                    as: "com",
                    pipeline: [{
                            $match: search_2,
                        },
                        {
                            $project: { userName: 1 }
                        }
                    ]
                },
            },
            {
                $lookup: {
                    from: "NewTV365",
                    localField: "nhs_new_id",
                    foreignField: "new_id",
                    as: "new",
                    pipeline: [{
                            $match: search_3,
                        },
                        {
                            $project: { new_title: 1 },
                        }
                    ]
                },
            },
            {
                $unwind: {
                    path: "$com",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$new",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    nhs_use_id: 1,
                    nhs_com_id: 1,
                    nhs_new_id: 1,
                    userName: "$user.userName",
                    comName: "$com.userName",
                    new_title: "$new.new_title",
                    nhs_kq: 1,
                    nhs_text: 1,
                    nhs_time: 1,
                    nhs_id: 1,
                },
            },
        ]);

        listCandidate = listCandidate.map(user => {
            let arr = [10, 11, 12, 14]
            if (arr.includes(user.nhs_kq)) {
                user.kq = "Chuyên viên gửi"
            } else {
                user.kq = "Tự ứng tuyển"
            }
            return user
        })

        // const count = await ApplyForJob.countDocuments(search);

        return functions.success(res, "Hiển thị chi tiết ứng viên thành công", { listCandidate });


    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra");
    }
}

exports.countStatusApplyForJob = async(req, res, next) => {
    try {
        const data = req.body;
        let { userName, comName, new_title, startDate, endDate, nhs_kq, nguon } = data;

        let nhs_use_id_arr = [];
        let nhs_com_id_arr = [];
        let nhs_new_id_arr = [];

        let search = {};
        let search_1 = { type: { $ne: 1 }, idTimViec365: { $gt: 0 } };
        let search_2 = { type: 1, idTimViec365: { $gt: 0 } };
        let search_3 = {};

        //Tên ứng viên
        if (userName) {
            search_1.userName = { $regex: new RegExp(userName, 'i') }

            const result = await Users.aggregate([{
                    $match: {
                        type: 0,
                        idTimViec365: { $ne: 0 },
                        userName: { $regex: new RegExp(userName, 'i') }
                    }
                },
                {
                    $project: {
                        idTimViec365: 1
                    }
                }
            ])

            result.forEach(item => {
                nhs_use_id_arr.push(item.idTimViec365)
            });


            search.nhs_use_id = { "$in": nhs_use_id_arr }
        }

        //Tên công ty
        if (comName) {
            search_2.userName = { $regex: new RegExp(comName, 'i') }

            const result = await Users.aggregate([{
                    $match: {
                        type: 1,
                        idTimViec365: { $ne: 0 },
                        userName: { $regex: new RegExp(comName, 'i') }
                    }
                },
                {
                    $project: {
                        idTimViec365: 1
                    }
                }
            ])

            result.forEach(item => {
                nhs_com_id_arr.push(item.idTimViec365)
            });

            search.nhs_com_id = { "$in": nhs_com_id_arr }
        }

        if (new_title) {
            search_3.new_title = { $regex: new RegExp(new_title, 'i') }

            const result = await NewTV365.aggregate([{
                    $match: {
                        new_title: { $regex: new RegExp(new_title, 'i') }
                    }
                },
                {
                    $project: {
                        new_id: 1
                    }
                }
            ])

            result.forEach(item => {
                nhs_new_id_arr.push(item.new_id)
            });

            search.nhs_new_id = { "$in": nhs_new_id_arr }
        }

        if (startDate && !endDate) {
            startDate = parseInt(startDate);
            search.nhs_time = { "$gte": startDate }
        } else if (!startDate && endDate) {
            toDate = parseInt(endDate);
            search.nhs_time = { "$lte": toDate }
        } else if (startDate && endDate) {
            fromDate = parseInt(startDate);
            toDate = parseInt(endDate);
            search.nhs_time = {
                "$gte": fromDate,
                "$lte": toDate
            }
        }

        if (nhs_kq) {
            nhs_kq = parseInt(nhs_kq);
            search.nhs_kq = nhs_kq;
        }

        // 0 => 'Tất cả', 1 => 'Chuyên viên gửi', 2 => 'Tự ứng tuyển'
        if (nguon && parseInt(nguon) == 1) {
            search.nhs_kq = { "$in": [10, 11, 12, 14] }
        }

        if (nguon && parseInt(nguon) == 2) {
            search.nhs_kq = { "$in": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 13] }
        }

        let count = await ApplyForJob.countDocuments(search);

        return functions.success(res, "Hiển thị tổng ứng viên thành công", {
            data: {
                count: count
            }
        });


    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra");
    }
}


// UserAddFails
exports.takeListUserAddFail = async(req, res) => {
    try {
        let condition = [];
        if (req.body.start) {
            condition.push({ uf_time: { $gte: new Date(req.body.start) } });
        };
        if (req.body.end) {
            condition.push({ uf_time: { $lte: new Date(req.body.end) } });
        };
        if (req.body.email) {
            condition.push({ uf_email: new RegExp(req.body.email, 'i') });
        }
        if (req.body.phone) {
            condition.push({ uf_phone: new RegExp(req.body.phone, 'i') });
        }
        let skip = Number(req.body.skip);
        let limit = Number(req.body.limit);
        let listData = await UserAddFails.find({
            $or: condition,
        }).skip(skip).limit(limit).lean();
        let count = await UserAddFails.find({
            $or: condition,
        })
        return functions.success(res, "Danh sách", {
            data: {
                listData,
                count
            }
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}


exports.listCvUvHide = async(req, res, next) => {
    try {

        const page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 30,
            skip = (page - 1) * pageSize;

        let condition = {
            is_scan: 1,
            hs_link_hide: { $exists: true },
            hs_link_hide: { $ne: '' }
        }

        let conditionUser = [{}];

        let hs_user_id = req.body.hs_user_id
        let use_first_name = req.body.use_first_name
        let use_email = req.body.use_email
        let use_address = req.body.use_address
        let hs_create_time = req.body.hs_create_time

        if (hs_user_id) {
            condition.hs_use_id = Number(hs_user_id);
        }
        if (use_first_name) {
            conditionUser.push({ "user.userName": { $regex: new RegExp(use_first_name, 'i') } });
        }
        if (use_address) {
            conditionUser.push({ "user.address": use_address });
        }
        if (use_email) {
            conditionUser.push({ "user.email": { $regex: new RegExp(use_email, 'i') } });
        }

        if (hs_create_time) {
            const parts = hs_create_time.split('/');
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Trừ 1 vì tháng trong JavaScript bắt đầu từ 0
            const year = parseInt(parts[2], 10);

            const startMilliseconds = new Date(year, month, day, 0, 0, 0, 0).getTime() / 1000;
            const endMilliseconds = new Date(year, month, day, 23, 59, 59, 999).getTime() / 1000;
            condition.hs_create_time = {
                $gte: startMilliseconds,
                $lte: endMilliseconds
            }
        }

        // let form = {
        //     page: page,
        //     pageSize: pageSize,
        //     hs_user_id: hs_user_id ? hs_user_id : "0",
        //     use_first_name: use_first_name ? use_first_name : "0",
        //     use_email: use_email ? use_email : "0",
        //     use_address: use_address ? use_email : "0",
        //     startdate: "0",
        //     enddate: "0",
        // }

        // let response = await axios({
        //     method: "post",
        //     url: "http://43.239.223.57:9002/listCvUvHide",
        //     data: form,
        //     headers: { "Content-Type": "multipart/form-data" }
        // });
        // let array = response.data.data.listuser;

        let list = []

        list = await Profile.aggregate([{
                $match: condition,
            },
            {
                $sort: {
                    hs_create_time: -1,
                },
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "hs_use_id",
                    foreignField: "idTimViec365",
                    as: "user",
                    pipeline: [{
                        $match: { idTimViec365: { $gte: 1 }, type: { $ne: 1 } },
                    }, ]
                },
            },
            {
                $unwind: {
                    path: "$user",
                },
            },
            {
                $match: {
                    $and: conditionUser
                }
            },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
                $project: {
                    use_id: "$user.idTimViec365",
                    use_logo: "$user.avatarUser",
                    use_create_time: "$user.createdAt",
                    use_first_name: "$user.userName",
                    use_phone: "$user.phone",
                    use_email: "$user.email",
                    hs_create_time: 1,
                    hs_link: 1,
                    use_address: "$user.address"
                }
            }
        ])

        return functions.success(res, "Hiển thị chi tiết ứng viên thành công", {
            list,
            // count: Number(response.data.data.count),
        });


    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.countListCvUvHide = async(req, res, next) => {
    try {

        let condition = {
            is_scan: 1,
            hs_link_hide: { $exists: true },
            hs_link_hide: { $ne: '' }
        }

        let conditionUser = [{}];

        let hs_user_id = req.body.hs_user_id
        let use_first_name = req.body.use_first_name
        let use_email = req.body.use_email
        let use_address = req.body.use_address
        let hs_create_time = req.body.hs_create_time

        if (hs_user_id) {
            condition.hs_use_id = Number(hs_user_id);
        }
        if (use_first_name) {
            conditionUser.push({ "user.userName": { $regex: new RegExp(use_first_name, 'i') } });
        }
        if (use_address) {
            conditionUser.push({ "user.address": use_address });
        }
        if (use_email) {
            conditionUser.push({ "user.email": { $regex: new RegExp(use_email, 'i') } });
        }

        if (hs_create_time) {
            const parts = hs_create_time.split('/');
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Trừ 1 vì tháng trong JavaScript bắt đầu từ 0
            const year = parseInt(parts[2], 10);

            const startMilliseconds = new Date(year, month, day, 0, 0, 0, 0).getTime() / 1000;
            const endMilliseconds = new Date(year, month, day, 23, 59, 59, 999).getTime() / 1000;
            condition.hs_create_time = {
                $gte: startMilliseconds,
                $lte: endMilliseconds
            }
        }

        let totalCount = await Profile.aggregate([{
                $match: condition,
            },
            {
                $sort: {
                    hs_create_time: -1,
                },
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "hs_use_id",
                    foreignField: "idTimViec365",
                    as: "user",
                    pipeline: [{
                        $match: { idTimViec365: { $gte: 1 }, type: { $ne: 1 } },
                    }, ]
                },
            },
            {
                $unwind: {
                    path: "$user",
                },
            },
            {
                $match: {
                    $and: conditionUser
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                },
            },
        ])

        return functions.success(res, "Hiển thị chi tiết ứng viên thành công", {
            data: {
                count: totalCount.length > 0 ? totalCount[0].count : 0
            }
        });


    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//danh sách uv cv
exports.listCvUv = async(req, res, next) => {
    try {

        const page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 30,
            skip = (page - 1) * pageSize;

        let use_id = req.body.use_id;
        let userName = req.body.userName;
        let use_phone = req.body.use_phone;
        let use_email = req.body.use_email;
        let fromDate = req.body.fromDate;
        let toDate = req.body.toDate;

        let condition = {
            idTimViec365: { $gt: 0 },
            type: { $ne: 1 }
        }

        let conditionProfile = {
            $and: [
                { hs_link: { $ne: "" } },
                { hs_link: { $ne: null } },
                { hs_name: { $ne: "" } },
                { hs_name: { $ne: null } },
                { hs_use_id: { $gt: 0 } }
            ]
        }

        let conditionCv = {}

        if (use_id) {
            condition.idTimViec365 = Number(use_id);
        }

        if (userName) {
            condition.userName = { $regex: new RegExp(userName, "i") };
        }

        if (use_phone) {
            condition.phoneTK = use_phone;
        }
        if (use_email) {
            condition.email = { $regex: new RegExp(use_email, "i") }
        }


        if (fromDate && !toDate) {
            conditionProfile.hs_create_time = { '$gte': fromDate };
        } else if (!fromDate && toDate) {
            conditionProfile.hs_create_time = { '$lte': toDate };
        } else if (fromDate && toDate) {
            conditionProfile.hs_create_time = {
                "$gte": fromDate,
                "$lte": toDate
            }
        }

        if (fromDate && !toDate) {
            conditionCv.time_edit = { '$gte': fromDate };
        } else if (!fromDate && toDate) {
            conditionCv.time_edit = { '$lte': toDate };
        } else if (fromDate && toDate) {
            conditionCv.time_edit = {
                "$gte": fromDate,
                "$lte": toDate
            }
        }

        let listCandidate = await Users.aggregate([{
                $match: condition,
            },
            {
                $lookup: {
                    from: "Tv365Profile",
                    localField: "idTimViec365",
                    foreignField: "hs_use_id",
                    as: "profile",
                    pipeline: [{
                        $match: conditionProfile
                    }]
                },
            },
            {
                $unwind: {
                    path: "$profile",
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $lookup: {
                    from: "SaveCvCandi",
                    localField: "idTimViec365",
                    foreignField: "uid",
                    pipeline: [{
                        $match: conditionCv
                    }],
                    as: "cv",
                },
            },
            {
                $unwind: {
                    path: "$cv",
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $match: {
                    $or: [
                        { "cv.id": { $exists: true } },
                        { "profile.hs_link": { $exists: true } },
                    ]
                }
            },
            {
                $skip: skip
            },
            {
                $limit: pageSize
            },
            {
                $project: {
                    use_id: "$idTimViec365",
                    use_first_name: "$userName",
                    use_phone: "$phoneTK",
                    use_email: "$email",
                    createdAt: "$createdAt",
                    hs_create_time: "$profile.hs_create_time",
                    hs_active: "$profile.hs_active",
                    hs_link: "$profile.hs_link",
                    hs_name: "$profile.hs_name",
                    html: "$cv.html",
                    name_img: "$cv.name_img",
                    hs_create_time: "$profile.hs_create_time",
                    time_edit: "$cv.time_edit"
                },
            }
        ]);

        listCandidate.map(item => {
            if (item.hs_link) {
                item.hs_link_check = service.checkUrlProfile(item.createdAt, item.hs_link);
                item.hs_link = service.getUrlProfile(item.createdAt, item.hs_link);
            }

            if (item.name_img) {
                item.name_img_check = functions.checkImageCv(item.createdAt, item.name_img);
                item.name_img = functions.imageCv(item.createdAt, item.name_img);
            }

            return item;
        })

        return functions.success(res, "Hiển thị chi tiết ứng viên thành công", {
            listCandidate
        });


    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra");
    }
}

exports.countListCvUv = async(req, res, next) => {
    try {
        let use_id = req.body.use_id;
        let userName = req.body.userName;
        let use_phone = req.body.use_phone;
        let use_email = req.body.use_email;
        let fromDate = req.body.fromDate;
        let toDate = req.body.toDate;

        let condition = {
            idTimViec365: { $gt: 0 },
            type: { $ne: 1 }
        }

        let conditionProfile = {
            $and: [
                { hs_link: { $ne: "" } },
                { hs_link: { $ne: null } },
                { hs_name: { $ne: "" } },
                { hs_name: { $ne: null } },
                { hs_use_id: { $gt: 0 } }
            ]
        }

        let conditionCv = {}

        if (use_id) {
            condition.idTimViec365 = Number(use_id);
        }

        if (userName) {
            condition.userName = { $regex: new RegExp(userName, "i") };
        }

        if (use_phone) {
            condition.phoneTK = use_phone;
        }
        if (use_email) {
            condition.email = { $regex: new RegExp(use_email, "i") }
        }


        if (fromDate && !toDate) {
            conditionProfile.hs_create_time = { '$gte': fromDate };
        } else if (!fromDate && toDate) {
            conditionProfile.hs_create_time = { '$lte': toDate };
        } else if (fromDate && toDate) {
            conditionProfile.hs_create_time = {
                "$gte": fromDate,
                "$lte": toDate
            }
        }

        if (fromDate && !toDate) {
            conditionCv.time_edit = { '$gte': fromDate };
        } else if (!fromDate && toDate) {
            conditionCv.time_edit = { '$lte': toDate };
        } else if (fromDate && toDate) {
            conditionCv.time_edit = {
                "$gte": fromDate,
                "$lte": toDate
            }
        }

        let totalCount = await Users.aggregate([{
                $match: condition,
            },
            {
                $lookup: {
                    from: "Tv365Profile",
                    localField: "idTimViec365",
                    foreignField: "hs_use_id",
                    as: "profile",
                    pipeline: [{
                        $match: conditionProfile
                    }]
                },
            },
            {
                $unwind: {
                    path: "$profile",
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $lookup: {
                    from: "SaveCvCandi",
                    localField: "idTimViec365",
                    foreignField: "uid",
                    pipeline: [{
                        $match: conditionCv
                    }],
                    as: "cv",
                },
            },
            {
                $unwind: {
                    path: "$cv",
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $match: {
                    $or: [
                        { "cv.id": { $exists: true } },
                        { "profile.hs_link": { $exists: true } },
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                },
            }
        ]);



        return functions.success(res, "Lấy count thành công", {
            count: totalCount.length > 0 ? totalCount[0].count : 0,
        });


    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra");
    }
}

exports.addUvSiteVeTinh = async(req, res, next) => {
    try {

        let fileXlsx = req.files

        const excelFilePath = `../storage/base365/timviec365/xlsx/${fileXlsx[0].filename}`;

        // Đọc dữ liệu từ file Excel
        const workbook = xlsx.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0]; // Lấy tên sheet đầu tiên
        const sheet = workbook.Sheets[sheetName];

        // Mảng để lưu trữ dữ liệu JSON
        const excelData = [];

        // Định danh các tên trường từ A đến Z
        const fieldNames = ['account', 'lastname', 'phone', 'use_birth_day', 'lg_tp', 'lg_qh', 'use_hon_nhan', 'use_gioi_tinh', 'use_create_time', 'use_address', 'cv_title', 'use_cate', 'cv_city_id', 'cv_exp', 'cv_money_id', 'cv_muctieu', 'cv_kynang', 'cv_capbac_id', 'cv_loaihinh_id', 'use_lat', 'use_long', 'file1', 'file2', 'avatar', 'kinhhnghiem', 'z'];

        for (let rowIndex = 1;; rowIndex++) {
            const rowData = {};
            const cellA = sheet[`A${rowIndex}`];

            // Kiểm tra xem ô ở cột A có tồn tại và có dữ liệu hay không
            if (cellA === undefined || cellA.v === undefined) {
                // Nếu ô ở cột A trống, dừng lại
                break;
            }

            rowData['account'] = cellA.v

            // Lấy giá trị từ cột C
            const cellC = sheet[`C${rowIndex}`];
            let phoneNumber = null;

            // Kiểm tra xem ô ở cột C có tồn tại và có dữ liệu hay không
            if (cellC !== undefined && cellC.v !== undefined) {
                // Nếu có dữ liệu, kiểm tra nếu nó bắt đầu bằng số 0
                phoneNumber = cellC.v.toString();
                if (!phoneNumber.startsWith('0')) {
                    // Nếu không bắt đầu bằng số 0, thêm số 0 vào đầu
                    phoneNumber = '0' + phoneNumber;
                }
            }

            // Lặp qua các cột từ B đến Z
            for (let colIndex = 1; colIndex < fieldNames.length; colIndex++) {
                const fieldName = fieldNames[colIndex];
                const cell = sheet[`${String.fromCharCode(65 + colIndex)}${rowIndex}`];

                // Kiểm tra xem ô có tồn tại và có dữ liệu hay không
                if (cell !== undefined && cell.v !== undefined) {
                    // Nếu có dữ liệu, thêm giá trị vào đối tượng JSON
                    rowData[fieldName] = cell.v;
                } else {
                    // Nếu không có dữ liệu, đặt giá trị của trường tương ứng là null
                    rowData[fieldName] = null;
                }
            }

            // Thêm số điện thoại vào đối tượng JSON
            rowData['phone'] = phoneNumber;

            // Thêm đối tượng JSON vào mảng
            excelData.push(rowData);
        }

        for (let i = 0; i < excelData.length; i++) {
            const getMaxIdTimViec = await Users.findOne({}, { idTimViec365: 1 }).sort({ idTimViec365: -1 }).limit(1).lean()
            const getMaxIdChat = await Users.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean()
            let check = await Users.findOne({ $or: [{ phoneTK: excelData[i].phone }, { email: excelData[i].account }], })

            let condition = {
                _id: getMaxIdChat._id + 1,
                idTimViec365: getMaxIdTimViec.idTimViec365 + 1,
                type: 0,
                updatedAt: functions.getTimeNow()
            }
            if (excelData[i].account != null) condition.email = excelData[i].account
            if (excelData[i].lastname != null) condition.userName = excelData[i].lastname
            if (excelData[i].phone != null) condition.phoneTK = excelData[i].phone
            if (excelData[i].use_birth_day) {
                condition = { "inForPerson.account.birthday": excelData[i].use_birth_day, ...condition };
            }
            if (excelData[i].lg_tp != null) condition.city = excelData[i].lg_tp
            if (excelData[i].lg_qh != null) condition.district = excelData[i].lg_qh
            if (excelData[i].use_hon_nhan) {
                condition = { "inForPerson.account.married": excelData[i].use_hon_nhan, ...condition };
            }
            if (excelData[i].use_gioi_tinh) {
                condition = { "inForPerson.account.gender": excelData[i].use_gioi_tinh, ...condition };
            }
            if (excelData[i].use_gioi_tinh != null) condition.createdAt = excelData[i].use_gioi_tinh
            if (excelData[i].use_address != null) condition.address = excelData[i].use_address
            if (excelData[i].cv_title) {
                condition = { "inForPerson.candidate.cv_title": excelData[i].cv_title, ...condition };
            }
            if (excelData[i].use_cate) {
                condition = { "inForPerson.candidate.cv_cate_id": excelData[i].use_cate.split(',').map(Number), ...condition };
            }
            if (excelData[i].cv_city_id) {
                condition = { "inForPerson.candidate.cv_city_id": excelData[i].cv_city_id.split(',').map(Number), ...condition };
            }
            if (excelData[i].cv_exp) {
                condition = { "inForPerson.account.experience": excelData[i].cv_exp, ...condition };
            }
            if (excelData[i].cv_money_id) {
                condition = { "inForPerson.candidate.cv_money_id": excelData[i].cv_money_id, ...condition };
            }
            if (excelData[i].cv_muctieu) {
                condition = { "inForPerson.candidate.cv_muctieu": excelData[i].cv_muctieu, ...condition };
            }
            if (excelData[i].cv_kynang) {
                condition = { "inForPerson.candidate.cv_kynang": excelData[i].cv_kynang, ...condition };
            }
            if (excelData[i].cv_capbac_id) {
                condition = { "inForPerson.candidate.cv_capbac_id": excelData[i].cv_capbac_id, ...condition };
            }
            if (excelData[i].cv_loaihinh_id) {
                condition = { "inForPerson.candidate.cv_loaihinh_id": excelData[i].cv_loaihinh_id, ...condition };
            }
            if (excelData[i].use_lat) condition.latitude = excelData[i].use_lat
            if (excelData[i].use_long) condition.longitude = excelData[i].use_long

            if (!check) {
                const newUser = new Users(condition);
                await newUser.save();
            }
        }
        return functions.success(res, "Hiển thị chi tiết ứng viên thành công", {
            excelData
        });


    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

exports.excelUvTimviec = async(req, res, next) => {
    try {
        const now = new Date(Date.now());
        let today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        today = Number(today) / 1000;
        const time_begin = Number(req.body.time_begin);
        const condition = { createdAt: { "$gte": time_begin }, fromDevice: 1, type: 0 };
        let infoUser = await Users.aggregate([{
                $match: condition,
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $project: {
                    use_first_name: "$userName",
                    use_phone: "$phone",
                    use_mail: "$email",
                    use_birth_day: "$inForPerson.account.birthday",
                    use_city: "$city",
                    use_quanhuyen: "$district",
                    use_hon_nhan: "$inForPerson.account.married",
                    use_gioi_tinh: "$inForPerson.account.gender",
                    use_create_time: "$createdAt",
                    use_address: "$address",
                    cv_title: "$inForPerson.candidate.cv_title",
                    cv_cate_id: "$inForPerson.candidate.cv_cate_id",
                    cv_city_id: "$inForPerson.candidate.cv_city_id",
                    cv_exp: "$inForPerson.account.experience",
                    cv_money_id: "$inForPerson.candidate.cv_money_id",
                    cv_muctieu: "$inForPerson.candidate.cv_muctieu",
                    cv_kynang: "$inForPerson.candidate.cv_kynang",
                    cv_capbac_id: "$inForPerson.candidate.cv_capbac_id",
                    cv_loaihinh_id: "$inForPerson.candidate.cv_loaihinh_id",
                    profileExperience: "$inForPerson.candidate.profileExperience",
                    cv_hocvan: "$inForPerson.account.education"
                },
            },
        ])

        let count = await Users.countDocuments(condition);
        return functions.success(res, "Hiển thị chi tiết ứng viên thành công", {
            infoUser,
            count
        });

    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}

//Lấy danh sách toàn bộ admin user
exports.getListAllAdmin = async(req, res, next) => {
    try {
        const admin_user = await AdminUser.aggregate([{
                $sort: { adm_id: -1 }
            },
            {
                $project: {
                    adm_id: 1,
                    adm_name: 1,
                    adm_bophan: 1,
                    adm_loginname: 1
                }
            }
        ])

        let count = await AdminUser.countDocuments({});
        return functions.success(res, "Hiển thị chi tiết ứng viên thành công", {
            admin_user,
            count
        });

    } catch (e) {
        console.log("Đã có lỗi xảy ra khi cập nhật kỹ năng bản thân", e);
        return functions.setError(res, "Đã có lỗi xảy ra", 400);
    }
}