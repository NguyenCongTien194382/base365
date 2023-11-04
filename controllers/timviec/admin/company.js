// Models
const Users = require('../../../models/Users');
const UsersDeleted = require('../../../models/UsersDeleted');
const City = require('../../../models/City');
const District = require('../../../models/District');
const TrangVangCategory = require('../../../models/Timviec365/UserOnSite/Company/TrangVangCategory');
const Tv365PointCompany = require('../../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany');
const UserCompanyUnset = require('../../../models/Timviec365/UserOnSite/Company/UserCompanyUnset');
const AdminUser = require('../../../models/Timviec365/Admin/AdminUser');
const Customer = require("../../../models/crm/Customer/customer");

// Load service
const services = require('../../../services/timviec365/company');
const serviceCrm = require('../../../services/timviec365/crm');
const functions = require('../../../services/functions');
const axios = require('axios');
const md5 = require('md5');
const fs = require('fs');

exports.listRegister = async(req, res) => {
    try {
        const result = await Users.deleteOne({ idTimViec365: 1111111526 });
        return functions.success(res, 'Xóa thành công', { data: result })

    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.createNTD = async(req, res) => {
    try {
        const data = req.body;
        let { emailContact, name, phoneTK, address, com_size, usc_lv, phone, email } = data
        let { website, city, district, zalo, skype, description, fromWeb, fromDevice, usc_kd } = data
        let fileName = "";
        // if (emailContact == undefined || name == undefined || emailContact == '' || name == '' || address == undefined || com_size == undefined || usc_lv == undefined || address == '' || com_size == '' || usc_lv == '' || phone == undefined || phone == '' || usc_kd == '' || usc_kd == undefined) {
        //     return functions.setError(res, 'Missing data', 400)
        // }


        // Lấy id mới nhất
        const getMaxUserID = await functions.getMaxUserID(1);
        const now = functions.getTimeNow();

        if (JSON.stringify(req.files) !== '{}') {
            // Cập nhật ảnh đại diện
            const avatarUser = req.files.logo;
            const uploadLogo = services.uploadLogo(avatarUser);
            fileName = uploadLogo.file_name;
        }

        // xử lý chuỗi link_web
        var use_company = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        use_company = use_company.replace(/\s+/g, "-");
        var link_web = '/' + use_company + '-co' + getMaxUserID._id;

        //Xóa NTD tại bảng lỗi
        await UserCompanyUnset.findOneAndDelete({ phone: phoneTK });
        const alias = functions.renderAlias(name);
        //Thêm mới NTD
        const password = md5('timviec365.vn');
        const newEmployer = await Users.create({
                _id: getMaxUserID._id,
                emailContact: emailContact,
                phoneTK: phoneTK || "",
                email: email || "",
                phone: phone,
                userName: name,
                alias: alias,
                avatarUser: fileName,
                password: password,
                address: address,
                authentic: 1,
                type: 1,
                chat365_secret: Buffer.from(getMaxUserID._id.toString()).toString('base64'),
                chat365_id: getMaxUserID._id,
                idTimViec365: getMaxUserID._idTV365,
                idQLC: getMaxUserID._idQLC,
                idRaoNhanh365: getMaxUserID._idRN365,
                district: district ? district : "",
                city: city ? city : "",
                createdAt: now,
                updatedAt: now,
                fromWeb: fromWeb || 'timviec365.vn',
                fromDevice: fromDevice || 1,
                inForCompany: {
                    description: description ? description : "",
                    com_size: com_size,
                    usc_kd: usc_kd,
                    timviec365: {
                        usc_name: name,
                        usc_name_add: address,
                        usc_name_phone: phone,
                        usc_name_email: emailContact,
                        usc_type: 1,
                        usc_size: com_size,
                        usc_skype: skype ? skype : "",
                        usc_zalo: zalo ? zalo : "",
                        usc_website: website ? website : "",
                        usc_lv: usc_lv
                    },
                    cds: {
                        com_role_id: 0
                    }
                }
            })
            .then(data => {
                return data;
            });
        // Update sang crm
        // Lưu data vào base crm
        const resoure = 3;
        const status = 12;
        const group = 456;
        const type_crm = 2;
        const link = services.rewrite_company(getMaxUserID._idTV365, alias);
        const admin = await AdminUser.findOne({ adm_bophan: usc_kd }, { emp_id: 1 }).lean();
        await serviceCrm.addCustomer(name, emailContact, phoneTK, admin.emp_id, getMaxUserID._idTV365, resoure, status, group, type_crm, link);
        // await service.RegisterWork247(phoneTK, password, name, alias, emailContact, now, now, usc_kd);

        return functions.success(res, 'Thêm mới thành công', { data: newEmployer })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.updateNTD = async(req, res) => {
    try {
        const data = req.body;
        let { idTimViec365, name, address, phoneTK, email, phone, usc_ip, usc_lat, usc_long, emailContact } = data
        let { password, website, district, city, size, usc_map, usc_lv, usc_kd, skype, zalo, description } = data
        const file = req.files.logo;
        var fileName = "";
        const now = functions.getTimeNow();

        if (
            idTimViec365 == undefined || name == undefined ||
            idTimViec365 == '' || name == '' ||
            phone == undefined || phone == '' || emailContact == '' ||
            emailContact == undefined
        ) {
            return functions.setError(res, 'Missing data', 400)
        }

        //Check tài khoản trùng
        // let findUser = await functions.getDatafindOne(Users, { phoneTK: phoneTK, type: 1 })
        // if (findUser && findUser.phoneTK && findUser.phoneTK == phoneTK) {
        //     return functions.setError(res, "Số điện thoại này đã được đăng kí", 400);
        // }

        var updateNTD = await Users.findOne({ idTimViec365: idTimViec365, type: 1 })
            .then(data => {
                return data
            })
            .catch(err => {
                return functions.setError(res, 'Id NTD sai', 400)
            })

        if (file && file.size > 0) {
            const avatarUser = updateNTD.avatarUser;
            fileName = req.files.logo.originalFilename;
            if (avatarUser != fileName) {
                const avatarUser = req.files.logo;
                const uploadLogo = services.uploadLogo(avatarUser);
                fileName = uploadLogo.file_name;
                updateNTD.avatarUser = fileName;
            }
        }

        const usc_kd_old = updateNTD.inForCompany.usc_kd;

        updateNTD.userName = name;
        updateNTD.inForCompany.timviec365.usc_name = name;
        updateNTD.address = address;
        updateNTD.inForCompany.timviec365.usc_name_add = address;
        if (phoneTK) {
            updateNTD.phoneTK = phoneTK;
        }
        if (email) {
            updateNTD.email = email;
        }
        updateNTD.phone = phone;
        updateNTD.inForCompany.timviec365.usc_name_phone = phone;
        updateNTD.inForCompany.timviec365.usc_ip = usc_ip;
        updateNTD.latitude = usc_lat;
        updateNTD.longtitude = usc_long;
        updateNTD.emailContact = emailContact;
        updateNTD.inForCompany.timviec365.usc_name_email = emailContact;

        if (password) {
            updateNTD.password = password;
        }

        if (website) updateNTD.inForCompany.timviec365.usc_website = website;
        if (city) updateNTD.city = city;
        if (district) updateNTD.district = district;
        if (zalo) updateNTD.inForCompany.timviec365.usc_zalo = zalo;
        if (skype) updateNTD.inForCompany.timviec365.usc_skype = skype;
        if (description) updateNTD.inForCompany.description = description;
        if (usc_kd) updateNTD.inForCompany.usc_kd = usc_kd;
        if (usc_map) updateNTD.inForCompany.timviec365.usc_map = usc_map;
        if (size) updateNTD.inForCompany.com_size = size;
        if (usc_lv) updateNTD.inForCompany.timviec365.usc_lv = usc_lv;

        updateNTD.updatedAt = now
        const user = new Users(updateNTD);
        await user.save();

        // Nếu chuyển giỏ cho người khác thì cũng cập nhật bên crm
        if (usc_kd != usc_kd_old) {
            const admin = await AdminUser.findOne({ adm_bophan: usc_kd }, { emp_id: 1 }).lean();
            await Customer.updateOne({ id_cus_from: updateNTD.idTimViec365, emp_id: usc_kd_old, cus_from: 'tv365' }, {
                $set: {
                    emp_id: admin.usc_kd
                }
            });
        }


        //Gọi sang CRM tạo mới customer
        // Call sang API CRM customer/addCustomer < thư mục routes/crm/CRMroutes.js >
        // Truyền vào name, emailContact, phoneTK, city, district, address, type = 1, link_cty<website + ... >

        // const url = '';

        // const formData = new FormData();
        // formData.append("email",        emailContact);
        // formData.append("name",         name);
        // formData.append("phone_number", phoneTK);
        // formData.append("address",      address);
        // formData.append("size",         com_size);
        // formData.append("type",         1);
        // formData.append("link",         link_web);

        // if(district)
        // {
        //     formData.append("district_id", district);
        // }

        // if(description)
        // {
        //     formData.append("description", description);
        // }

        // formData.append("logo", JSON.stringify( fs.createReadStream(req.files.logo) ));

        // const authHeader = req.headers["authorization"];
        // const token = authHeader && authHeader.split(" ")[1];
        // const config = {
        //     headers: {
        //       'Content-Type': 'application/json',
        //       Authorization: `Bearer ${token}`,
        //     },
        // };

        // await axios.post(url, formData, config)
        // .then((response) => {
        //     // Xử lý phản hồi ở đây
        //     console.log('Phản hồi:', response);
        //   })
        //   .catch((error) => {
        //     // Xử lý lỗi ở đây
        //     console.error('Lỗi:', error);
        //   });

        return functions.success(res, 'Cập nhật thành công', { data: updateNTD })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.getCity = async(req, res) => {
    try {
        const city = await City.aggregate([{
                $project: {
                    _id: 1,
                    name: 1
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
        return functions.success(res, 'Lấy tỉnh thành thành công', { data: city })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.getDistrict = async(req, res) => {
    try {
        const data = req.body;
        const parent = parseInt(data ? data.idCity : 0);
        var district = [];
        const excludedTypes = [1, 2, 3, 4];
        if (isNaN(parent) || parent == undefined || parent == "") {
            district = await District.aggregate([{
                    $match: {
                        type: { $nin: excludedTypes }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                }
            ]);
        } else {
            district = await District.aggregate([{
                    $match: {
                        $and: [
                            { parent: parent },
                            { type: { $nin: excludedTypes } }
                        ]
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                }
            ]);
        }
        return functions.success(res, 'Lấy quận huyện thành công', { data: district })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.getOperatingField = async(req, res) => {
    try {
        const operatingFields = await TrangVangCategory.aggregate([{
            $project: {
                id: 1,
                name_cate: 1
            }
        }]);
        return functions.success(res, 'Lấy lĩnh vực thành công', { data: operatingFields })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

// exports.getListNewRegistrationNTD = async(req, res) => {
//     try {
//         var { _id, name, phone, email, emailTK, phoneTK } = req.body;
//         var { city, district, checkVip, supportKD, fromDate, toDate, usc_kd } = req.body;
//         const page = Number(req.body.page) || 1;
//         const perPage = Number(req.body.pageSize) || 30;
//         const skip = (page - 1) * perPage;
//         if (req.user && req.user.data.adm_id) {
//             if (Number(req.user.data.adm_id) == 4) {
//                 var search = {};
//                 var search_1 = {
//                     type: 1,
//                     $or: [
//                         { "inForCompany.timviec365.usc_md5": "" },
//                         { "inForCompany.timviec365.usc_md5": null }
//                     ],
//                     idTimViec365: { $gt: 0 }
//                 };
//                 var search_point = {};
//                 var unwind = {};

//                 if (_id != undefined && _id != "" && !isNaN(parseInt(_id))) {
//                     search.idTimViec365 = Number(_id)
//                 }

//                 if (name != undefined && name != "") {
//                     search.userName = { $regex: new RegExp(name, 'i') }
//                 }

//                 if (phone != undefined && phone != "") {
//                     search.phone = phone
//                 }

//                 if (email != undefined && email != "") {
//                     search.emailContact = { $regex: new RegExp(email, 'i') }
//                 }

//                 if (phoneTK != undefined && phoneTK != "") {
//                     search.phoneTK = phoneTK
//                 }

//                 if (emailTK != undefined && emailTK != "") {
//                     search.email = { $regex: new RegExp(emailTK, 'i') }
//                 }

//                 if (city != undefined && city != "") {
//                     search.city = parseInt(city);
//                 }

//                 if (district != undefined && district != "") {
//                     search.district = parseInt(district);
//                 }

//                 if (checkVip != undefined && checkVip != "") {
//                     let now = Math.floor(Date.now() / 1000);
//                     if (checkVip == 1) { //Vip
//                         // let use_id_array = await Tv365PointCompany.aggregate([{
//                         //         $match: {
//                         //             day_reset_point: { $gt: now },
//                         //             point_usc: { $gt: 0 }
//                         //         }
//                         //     },
//                         //     {
//                         //         $project: {
//                         //             usc_id: 1
//                         //         }
//                         //     }
//                         // ])
//                         // let idTimViec365_array = [];
//                         // for (let i = 0; i < use_id_array.length; i++) {
//                         //     idTimViec365_array.push(use_id_array[i].usc_id);
//                         // }
//                         // search_1.idTimViec365 = { $in: idTimViec365_array }

//                         // unwind = {
//                         //     path: '$point',
//                         //     preserveNullAndEmptyArrays: true
//                         // }
//                         search["point.point_usc"] = { $gt: 0 };
//                         unwind = {
//                             path: '$point',
//                             preserveNullAndEmptyArrays: true
//                         }
//                     }
//                     if (checkVip == 2) { //Từng vip
//                         // search_point.day_reset_point = { $lte: now, $gt: 0 };
//                         // unwind = '$point';
//                         search["point.ngay_reset_diem_ve_0"] = { $gt: 0 }
//                         search["point.point_usc"] = 0
//                         unwind = {
//                             path: '$point',
//                             preserveNullAndEmptyArrays: true
//                         }
//                     }

//                     if (checkVip == 3) { //Chưa vip
//                         search["$and"] = [{
//                                 $or: [{
//                                         "point.ngay_reset_diem_ve_0": 0
//                                     },
//                                     {
//                                         "point.ngay_reset_diem_ve_0": { $exists: false }
//                                     }
//                                 ]
//                             },
//                             {
//                                 $or: [{
//                                         "point.point_usc": 0
//                                     },
//                                     {
//                                         "point.point_usc": { $exists: false }
//                                     }
//                                 ]
//                             }
//                         ];
//                         unwind = {
//                             path: '$point',
//                             preserveNullAndEmptyArrays: true
//                         }
//                     }
//                 } else {
//                     unwind = {
//                         path: '$point',
//                         preserveNullAndEmptyArrays: true
//                     }
//                 }

//                 if (supportKD != undefined && supportKD != "") {
//                     search["inForCompany.usc_kd"] = parseInt(supportKD);
//                 }

//                 if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate))) {
//                     fromDate = parseInt(fromDate);
//                     search.createdAt = { "$gte": fromDate }
//                 }

//                 if (toDate != undefined && toDate != "" && !isNaN(parseInt(fromDate))) {
//                     toDate = parseInt(toDate);
//                     search.createdAt = { "$lte": toDate }
//                 }

//                 if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate)) &&
//                     toDate != undefined && toDate != "" && !isNaN(parseInt(fromDate))) {
//                     fromDate = parseInt(fromDate);
//                     toDate = parseInt(toDate);
//                     search.createdAt = {
//                         "$gte": fromDate,
//                         "$lte": toDate
//                     }
//                 }

//                 var listNewRegistrationNTD = [];

//                 listNewRegistrationNTD = await Users.aggregate([{
//                         $sort: {
//                             createdAt: -1
//                         }
//                     },
//                     {
//                         $match: search_1
//                     },
//                     {
//                         $lookup: {
//                             from: 'Tv365PointCompany',
//                             localField: 'idTimViec365',
//                             foreignField: 'usc_id',
//                             pipeline: [{
//                                 $match: search_point
//                             }],
//                             as: 'point'
//                         }
//                     },
//                     {
//                         $unwind: unwind
//                     },
//                     {
//                         $match: search
//                     },
//                     {

//                         $skip: skip

//                     },
//                     {
//                         $limit: perPage
//                     },
//                     {
//                         $project: {
//                             _id: 1,
//                             logo: "$avatarUser",
//                             name: "$userName",
//                             phone: 1,
//                             createdAt: 1,
//                             email: "$emailContact",
//                             website: "$inForCompany.timviec365.usc_website",
//                             address: 1,
//                             authentic: 1,
//                             phoneTK: 1,
//                             otp: 1,
//                             emailTK: "$email",
//                             skype: "$inForCompany.timviec365.usc_skype",
//                             zalo: "$inForCompany.timviec365.usc_zalo",
//                             registrationDate: "$createdAt",
//                             usc_map: "$inForCompany.timviec365.usc_map",
//                             kinhDoanh: "$inForCompany.usc_kd",
//                             idTimViec365: 1,
//                             point_usc: "$point.point_usc",
//                             ngay_reset_diem_ve_0: "$point.ngay_reset_diem_ve_0"
//                         }
//                     }
//                 ])

//                 var listNewRegistrationNTD_1 = [];

//                 for (var item of listNewRegistrationNTD) {
//                     if (item.logo != null) {
//                         item.logo = functions.cdnImageAvatar(Number(item.createdAt) * 1000) + item.logo;
//                     }

//                     listNewRegistrationNTD_1.push(item);
//                 }

//                 return functions.success(res, 'Lấy danh sách nhà tuyển dụng đăng kí mới thành công', {
//                     data: listNewRegistrationNTD_1
//                 })
//             } else {
//                 let kd_ht = Number(req.user.data.adm_id);
//                 search["inForCompany.usc_kd"] = parseInt(kd_ht);
//                 var search = {};
//                 var search_1 = {
//                     type: 1,
//                     $or: [
//                         { "inForCompany.timviec365.usc_md5": "" },
//                         { "inForCompany.timviec365.usc_md5": null }
//                     ],
//                     idTimViec365: { $gt: 0 }
//                 };
//                 var search_point = {};
//                 var unwind = {};

//                 if (_id != undefined && _id != "" && !isNaN(parseInt(_id))) {
//                     search.idTimViec365 = Number(_id)
//                 }

//                 if (name != undefined && name != "") {
//                     search.userName = { $regex: new RegExp(name, 'i') }
//                 }

//                 if (phone != undefined && phone != "") {
//                     search.phone = phone
//                 }

//                 if (email != undefined && email != "") {
//                     search.emailContact = { $regex: new RegExp(email, 'i') }
//                 }

//                 if (phoneTK != undefined && phoneTK != "") {
//                     search.phoneTK = phoneTK
//                 }

//                 if (emailTK != undefined && emailTK != "") {
//                     search.email = { $regex: new RegExp(emailTK, 'i') }
//                 }

//                 if (city != undefined && city != "") {
//                     search.city = parseInt(city);
//                 }

//                 if (district != undefined && district != "") {
//                     search.district = parseInt(district);
//                 }

//                 if (checkVip != undefined && checkVip != "") {
//                     let now = Math.floor(Date.now() / 1000);
//                     if (checkVip == 1) { //Vip
//                         // let use_id_array = await Tv365PointCompany.aggregate([{
//                         //         $match: {
//                         //             day_reset_point: { $gt: now },
//                         //             point_usc: { $gt: 0 }
//                         //         }
//                         //     },
//                         //     {
//                         //         $project: {
//                         //             usc_id: 1
//                         //         }
//                         //     }
//                         // ])
//                         // let idTimViec365_array = [];
//                         // for (let i = 0; i < use_id_array.length; i++) {
//                         //     idTimViec365_array.push(use_id_array[i].usc_id);
//                         // }
//                         // search_1.idTimViec365 = { $in: idTimViec365_array }

//                         // unwind = {
//                         //     path: '$point',
//                         //     preserveNullAndEmptyArrays: true
//                         // }
//                         search["point.point_usc"] = { $gt: 0 };
//                         unwind = {
//                             path: '$point',
//                             preserveNullAndEmptyArrays: true
//                         }
//                     }
//                     if (checkVip == 2) { //Từng vip
//                         // search_point.day_reset_point = { $lte: now, $gt: 0 };
//                         // unwind = '$point';
//                         search["point.ngay_reset_diem_ve_0"] = { $gt: 0 }
//                         search["point.point_usc"] = 0
//                         unwind = {
//                             path: '$point',
//                             preserveNullAndEmptyArrays: true
//                         }
//                     }

//                     if (checkVip == 3) { //Chưa vip
//                         search["$and"] = [{
//                                 $or: [{
//                                         "point.ngay_reset_diem_ve_0": 0
//                                     },
//                                     {
//                                         "point.ngay_reset_diem_ve_0": { $exists: false }
//                                     }
//                                 ]
//                             },
//                             {
//                                 $or: [{
//                                         "point.point_usc": 0
//                                     },
//                                     {
//                                         "point.point_usc": { $exists: false }
//                                     }
//                                 ]
//                             }
//                         ];
//                         unwind = {
//                             path: '$point',
//                             preserveNullAndEmptyArrays: true
//                         }
//                     }
//                 } else {
//                     unwind = {
//                         path: '$point',
//                         preserveNullAndEmptyArrays: true
//                     }
//                 }
//                 if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate))) {
//                     fromDate = parseInt(fromDate);
//                     search.createdAt = { "$gte": fromDate }
//                 }

//                 if (toDate != undefined && toDate != "" && !isNaN(parseInt(fromDate))) {
//                     toDate = parseInt(toDate);
//                     search.createdAt = { "$lte": toDate }
//                 }

//                 if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate)) &&
//                     toDate != undefined && toDate != "" && !isNaN(parseInt(fromDate))) {
//                     fromDate = parseInt(fromDate);
//                     toDate = parseInt(toDate);
//                     search.createdAt = {
//                         "$gte": fromDate,
//                         "$lte": toDate
//                     }
//                 }

//                 var listNewRegistrationNTD = [];

//                 listNewRegistrationNTD = await Users.aggregate([{
//                         $sort: {
//                             createdAt: -1
//                         }
//                     },
//                     {
//                         $match: search_1
//                     },
//                     {
//                         $lookup: {
//                             from: 'Tv365PointCompany',
//                             localField: 'idTimViec365',
//                             foreignField: 'usc_id',
//                             pipeline: [{
//                                 $match: search_point
//                             }],
//                             as: 'point'
//                         }
//                     },
//                     {
//                         $unwind: unwind
//                     },
//                     {
//                         $match: search
//                     },
//                     {

//                         $skip: skip

//                     },
//                     {
//                         $limit: perPage
//                     },
//                     {
//                         $project: {
//                             _id: 1,
//                             logo: "$avatarUser",
//                             name: "$userName",
//                             phone: 1,
//                             createdAt: 1,
//                             email: "$emailContact",
//                             website: "$inForCompany.timviec365.usc_website",
//                             address: 1,
//                             authentic: 1,
//                             phoneTK: 1,
//                             otp: 1,
//                             emailTK: "$email",
//                             skype: "$inForCompany.timviec365.usc_skype",
//                             zalo: "$inForCompany.timviec365.usc_zalo",
//                             registrationDate: "$createdAt",
//                             usc_map: "$inForCompany.timviec365.usc_map",
//                             kinhDoanh: "$inForCompany.usc_kd",
//                             idTimViec365: 1,
//                             point_usc: "$point.point_usc",
//                             ngay_reset_diem_ve_0: "$point.ngay_reset_diem_ve_0"
//                         }
//                     }
//                 ])

//                 var listNewRegistrationNTD_1 = [];

//                 for (var item of listNewRegistrationNTD) {
//                     if (item.logo != null) {
//                         item.logo = functions.cdnImageAvatar(Number(item.createdAt) * 1000) + item.logo;
//                     }

//                     listNewRegistrationNTD_1.push(item);
//                 }

//                 return functions.success(res, 'Lấy danh sách nhà tuyển dụng đăng kí mới thành công', {
//                     data: listNewRegistrationNTD_1
//                 })
//             }

//         }

//         return functions.success(res, 'Lấy danh sách nhà tuyển dụng đăng kí mới thành công', {
//             data: []
//         })
//     } catch (error) {
//         return functions.setError(res, error.message)
//     }
// }

exports.getListNewRegistrationNTD = async(req, res) => {
    try {

        var { _id, name, phone, email, usc_email_lh, emailTK, phoneTK, supportKD } = req.body;
        if (usc_email_lh == "Email (liên hệ)") {
            usc_email_lh = "";
        }
        var { city, district, checkVip, supportKD, fromDate, toDate, dk } = req.body;
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;
        const skip = (page - 1) * pageSize;
        let form = {
            page: page,
            pageSize: pageSize,
        };
        let search = {}
        if (_id != undefined && _id != "" && !isNaN(parseInt(_id))) {
            form.idTimViec365 = Number(_id)
            search.idTimViec365 = Number(_id)
        }

        if (name != undefined && name != "") {
            form.userName = name
            search.userName = {
                $regex: name,
                $options: 'i'
            }
        }

        if (phone != undefined && phone != "") {
            form.phone = phone
            search.phone = {
                $regex: phone,
                $options: 'i'
            }
        }

        if (email != undefined && email != "") {
            form.emailContact = email
            search.emailContact = {
                $regex: email,
                $options: 'i'
            }
        };
        if (supportKD && (!isNaN(supportKD))) {
            search["inForCompany.usc_kd"] = supportKD;
        }
        if (usc_email_lh != undefined && usc_email_lh != "") {
            if (usc_email_lh != "Email (liên hệ)") {
                form.email = usc_email_lh;
                search.emailContact = {
                    $regex: usc_email_lh,
                    $options: 'i'
                }
            }
        }
        if (phoneTK != undefined && phoneTK != "") {
            form.phoneTK = phoneTK
            search.phoneTK = {
                $regex: phoneTK,
                $options: 'i'
            }
        }

        if (emailTK != undefined && emailTK != "") {
            form.email = emailTK
            search.email = {
                $regex: emailTK,
                $options: 'i'
            }
        }

        if (city != undefined && city != "") {
            form.city = parseInt(city);
            search.city = parseInt(city);
        }

        if (district != undefined && district != "") {
            form.district = parseInt(district);
            search.district = parseInt(district);
        }

        if (checkVip != undefined && checkVip != "") {
            form.checkVip = checkVip
        }
        if (fromDate) {
            form.fromDate = Number(fromDate)
            search.createdAt = {
                $gte: Number(fromDate)
            }
        }

        //if (toDate != undefined && toDate != "" && !isNaN(parseInt(fromDate))) {
        if (toDate) {

            form.toDate = Number(toDate)
            search.createdAt = {
                $lte: toDate
            }
        }

        if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate)) &&
            toDate != undefined && toDate != "" && !isNaN(parseInt(toDate))) {
            form.toDate = toDate
            form.fromDate = fromDate
            search.createdAt = {
                $gte: Number(fromDate),
                $lte: Number(toDate)
            }
        }

        if (Number(dk)) {
            form.dk = Number(dk);
        }

        if (req.user && req.user.data.adm_id) {
            if (Number(req.user.data.adm_id) == 4) {
                if (supportKD != undefined && supportKD != "" && !isNaN(parseInt(supportKD))) {
                    form.supportKD = supportKD
                };
                let response = await axios({
                    method: "post",
                    url: "http://43.239.223.57:9002/getListNewRegister",
                    data: form,
                    headers: { "Content-Type": "multipart/form-data" }
                });
                let array = response.data.data.listuser;
                var listNewRegistrationNTD = [];
                //console.log(new Date(), req.body, form, req.headers['authorization']);
                // checkVip: '1' VIP
                // checkVip: '2' Từng VIP
                // checkVip: '3' Chưa VIP 
                let aggregation = [];
                if (req.body.checkVip) {
                    //console.log("Thay đổi gia tri aggregation")
                    // nếu là VIP thì lấy dữ liệu dưới base mongo 
                    aggregation = [{
                            $sort: {
                                createdAt: -1
                            }
                        },
                        {
                            $match: {
                                type: 1
                            }
                        },
                        {
                            $lookup: {
                                from: 'Tv365PointCompany',
                                localField: 'idTimViec365',
                                foreignField: 'usc_id',
                                as: 'point'
                            }
                        },
                        {
                            $unwind: "$point"
                        },
                        {
                            $project: {
                                _id: 1,
                                logo: "$avatarUser",
                                name: "$userName",
                                phone: 1,
                                createdAt: 1,
                                email: "$emailContact",
                                website: "$inForCompany.timviec365.usc_website",
                                address: 1,
                                authentic: 1,
                                phoneTK: 1,
                                otp: 1,
                                emailTK: "$email",
                                skype: "$inForCompany.timviec365.usc_skype",
                                usc_note: "$inForCompany.timviec365.usc_note",
                                zalo: "$inForCompany.timviec365.usc_zalo",
                                registrationDate: "$createdAt",
                                usc_map: "$inForCompany.timviec365.usc_map",
                                kinhDoanh: "$inForCompany.usc_kd",
                                idTimViec365: 1,
                                point_usc: "$point.point_usc",
                                ngay_reset_diem_ve_0: "$point.ngay_reset_diem_ve_0"
                            }
                        },
                        {
                            $match: {
                                idTimViec365: { $ne: 0 }
                            }
                        },
                        {
                            $skip: skip
                        },
                        {
                            $limit: pageSize
                        }
                    ];
                    if (Number(req.body.checkVip) == 1) {
                        let time = new Date().getTime() / 1000;
                        aggregation.splice(5, 0, {
                            $match: {
                                point_usc: { $ne: 0 }
                                // $or: [{
                                //         "point.ngay_reset_diem_ve_0": 0
                                //     },
                                //     {
                                //         "point.ngay_reset_diem_ve_0": { $lte: time }
                                //     }
                                // ]
                            }
                        })
                    } else if (Number(req.body.checkVip) == 2) {
                        aggregation.splice(5, 0, {
                            $match: {
                                point_usc: 0,
                                ngay_reset_diem_ve_0: { $ne: 0 }
                            }
                        })
                    } else if (Number(req.body.checkVip) == 3) {
                        aggregation.splice(5, 0, {
                            $match: {
                                point_usc: 0,
                                ngay_reset_diem_ve_0: 0
                            }
                        })
                    };
                    aggregation.splice(2, 0, {
                        $match: search
                    })
                    listNewRegistrationNTD = await Users.aggregate(aggregation);
                } else {
                    listNewRegistrationNTD = await Users.aggregate([{
                            $sort: {
                                createdAt: -1
                            }
                        },
                        {
                            $match: {
                                idTimViec365: { $in: array },
                                type: 1
                            }
                        },
                        {
                            $lookup: {
                                from: 'Tv365PointCompany',
                                localField: 'idTimViec365',
                                foreignField: 'usc_id',
                                as: 'point'
                            }
                        },
                        {
                            $unwind: {
                                path: "$point",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                logo: "$avatarUser",
                                name: "$userName",
                                phone: 1,
                                createdAt: 1,
                                email: "$emailContact",
                                website: "$inForCompany.timviec365.usc_website",
                                address: 1,
                                authentic: 1,
                                phoneTK: 1,
                                otp: 1,
                                emailTK: "$email",
                                skype: "$inForCompany.timviec365.usc_skype",
                                usc_note: "$inForCompany.timviec365.usc_note",
                                zalo: "$inForCompany.timviec365.usc_zalo",
                                registrationDate: "$createdAt",
                                usc_map: "$inForCompany.timviec365.usc_map",
                                kinhDoanh: "$inForCompany.usc_kd",
                                idTimViec365: 1,
                                point_usc: "$point.point_usc",
                                ngay_reset_diem_ve_0: "$point.ngay_reset_diem_ve_0"
                            }
                        },
                        {
                            $match: {
                                idTimViec365: { $ne: 0 }
                            }
                        }
                    ])
                }

                var listNewRegistrationNTD_1 = [];

                for (var item of listNewRegistrationNTD) {
                    if (item.logo != null) {
                        item.logo = functions.getUrlLogoCompany(Number(item.createdAt), item.logo);
                    }

                    listNewRegistrationNTD_1.push(item);
                }
                listNewRegistrationNTD_1 = [...new Map(listNewRegistrationNTD_1.map((item) => [item['_id'], item])).values()];
                //console.log("Response", listNewRegistrationNTD_1)
                return functions.success(res, 'Lấy danh sách nhà tuyển dụng đăng kí mới thành công', {
                    data: listNewRegistrationNTD_1,
                    aggregation

                })

            } else {
                let kd_ht = Number(req.user.data.adm_id);
                let adm_bophan = await AdminUser.findOne({ adm_id: kd_ht }).select('adm_bophan').lean();
                console.log('admin:', adm_bophan);
                if (adm_bophan != null && adm_bophan != undefined) {
                    form.supportKD = adm_bophan.adm_bophan
                    let response = await axios({
                        method: "post",
                        url: "http://43.239.223.57:9002/getListNewRegister",
                        data: form,
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                    // console.log("response", response.data.data);
                    let array = response.data.data.listuser;

                    var listNewRegistrationNTD = [];
                    let aggregation = [];
                    if (adm_bophan != 0) {
                        search["inForCompany.usc_kd"] = Number(adm_bophan.adm_bophan);
                        console.log("admin bo phan", adm_bophan, req.body.supportKD);
                        if (req.body.checkVip) {
                            aggregation = [{
                                    $sort: {
                                        createdAt: -1
                                    }
                                },
                                {
                                    $match: {
                                        type: 1
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'Tv365PointCompany',
                                        localField: 'idTimViec365',
                                        foreignField: 'usc_id',
                                        as: 'point'
                                    }
                                },
                                {
                                    $unwind: "$point"
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        logo: "$avatarUser",
                                        name: "$userName",
                                        phone: 1,
                                        createdAt: 1,
                                        email: "$emailContact",
                                        website: "$inForCompany.timviec365.usc_website",
                                        address: 1,
                                        authentic: 1,
                                        phoneTK: 1,
                                        otp: 1,
                                        emailTK: "$email",
                                        skype: "$inForCompany.timviec365.usc_skype",
                                        usc_note: "$inForCompany.timviec365.usc_note",
                                        zalo: "$inForCompany.timviec365.usc_zalo",
                                        registrationDate: "$createdAt",
                                        usc_map: "$inForCompany.timviec365.usc_map",
                                        kinhDoanh: "$inForCompany.usc_kd",
                                        idTimViec365: 1,
                                        point_usc: "$point.point_usc",
                                        ngay_reset_diem_ve_0: "$point.ngay_reset_diem_ve_0"
                                    }
                                },
                                {
                                    $match: {
                                        idTimViec365: { $ne: 0 }
                                    }
                                },
                                {
                                    $skip: skip
                                },
                                {
                                    $limit: pageSize
                                }
                            ];
                            if (Number(req.body.checkVip) == 1) {
                                let time = new Date().getTime() / 1000;
                                aggregation.splice(5, 0, {
                                    $match: {
                                        point_usc: { $ne: 0 }
                                    }
                                })
                            } else if (Number(req.body.checkVip) == 2) {
                                aggregation.splice(5, 0, {
                                    $match: {
                                        point_usc: 0,
                                        ngay_reset_diem_ve_0: { $ne: 0 }
                                    }
                                })
                            } else if (Number(req.body.checkVip) == 3) {
                                aggregation.splice(5, 0, {
                                    $match: {
                                        point_usc: 0,
                                        ngay_reset_diem_ve_0: 0
                                    }
                                })
                            };
                            aggregation.splice(2, 0, {
                                $match: search
                            })
                            listNewRegistrationNTD = await Users.aggregate(aggregation);
                        } else {
                            listNewRegistrationNTD = await Users.aggregate([{
                                    $sort: {
                                        createdAt: -1
                                    }
                                },
                                {
                                    $match: {
                                        idTimViec365: { $in: array },
                                        type: 1
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'Tv365PointCompany',
                                        localField: 'idTimViec365',
                                        foreignField: 'usc_id',
                                        as: 'point'
                                    }
                                },
                                {
                                    $unwind: {
                                        path: "$point",
                                        preserveNullAndEmptyArrays: true
                                    }

                                },
                                {
                                    $project: {
                                        _id: 1,
                                        logo: "$avatarUser",
                                        name: "$userName",
                                        phone: 1,
                                        createdAt: 1,
                                        email: "$emailContact",
                                        website: "$inForCompany.timviec365.usc_website",
                                        address: 1,
                                        authentic: 1,
                                        phoneTK: 1,
                                        otp: 1,
                                        emailTK: "$email",
                                        skype: "$inForCompany.timviec365.usc_skype",
                                        usc_note: "$inForCompany.timviec365.usc_note",
                                        zalo: "$inForCompany.timviec365.usc_zalo",
                                        registrationDate: "$createdAt",
                                        usc_map: "$inForCompany.timviec365.usc_map",
                                        kinhDoanh: "$inForCompany.usc_kd",
                                        idTimViec365: 1,
                                        point_usc: "$point.point_usc",
                                        ngay_reset_diem_ve_0: "$point.ngay_reset_diem_ve_0",
                                    }
                                }
                            ])
                        }
                    } else {
                        if (req.body.checkVip) {
                            aggregation = [{
                                    $sort: {
                                        createdAt: -1
                                    }
                                },
                                {
                                    $match: {
                                        type: 1,
                                        "inForCompany.usc_kd": 0
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'Tv365PointCompany',
                                        localField: 'idTimViec365',
                                        foreignField: 'usc_id',
                                        as: 'point'
                                    }
                                },
                                {
                                    $unwind: "$point"
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        logo: "$avatarUser",
                                        name: "$userName",
                                        phone: 1,
                                        createdAt: 1,
                                        email: "$emailContact",
                                        website: "$inForCompany.timviec365.usc_website",
                                        address: 1,
                                        authentic: 1,
                                        phoneTK: 1,
                                        otp: 1,
                                        emailTK: "$email",
                                        skype: "$inForCompany.timviec365.usc_skype",
                                        usc_note: "$inForCompany.timviec365.usc_note",
                                        zalo: "$inForCompany.timviec365.usc_zalo",
                                        registrationDate: "$createdAt",
                                        usc_map: "$inForCompany.timviec365.usc_map",
                                        kinhDoanh: "$inForCompany.usc_kd",
                                        idTimViec365: 1,
                                        point_usc: "$point.point_usc",
                                        ngay_reset_diem_ve_0: "$point.ngay_reset_diem_ve_0"
                                    }
                                },
                                {
                                    $match: {
                                        idTimViec365: { $ne: 0 }
                                    }
                                },
                                {
                                    $skip: skip
                                },
                                {
                                    $limit: pageSize
                                }
                            ];
                            if (Number(req.body.checkVip) == 1) {
                                let time = new Date().getTime() / 1000;
                                aggregation.splice(5, 0, {
                                    $match: {
                                        point_usc: { $ne: 0 }
                                    }
                                })
                            } else if (Number(req.body.checkVip) == 2) {
                                aggregation.splice(5, 0, {
                                    $match: {
                                        point_usc: 0,
                                        ngay_reset_diem_ve_0: { $ne: 0 }
                                    }
                                })
                            } else if (Number(req.body.checkVip) == 3) {
                                aggregation.splice(5, 0, {
                                    $match: {
                                        point_usc: 0,
                                        ngay_reset_diem_ve_0: 0
                                    }
                                })
                            };
                            aggregation.splice(2, 0, {
                                $match: search
                            })
                            listNewRegistrationNTD = await Users.aggregate(aggregation);
                        } else {
                            listNewRegistrationNTD = await Users.aggregate([{
                                    $sort: {
                                        createdAt: -1
                                    }
                                },
                                {
                                    $match: {
                                        idTimViec365: { $gte: 1 },
                                        type: 1,
                                        "inForCompany.usc_kd": 0
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'Tv365PointCompany',
                                        localField: 'idTimViec365',
                                        foreignField: 'usc_id',
                                        as: 'point'
                                    }
                                },
                                {
                                    $unwind: {
                                        path: "$point",
                                        preserveNullAndEmptyArrays: true
                                    }

                                },
                                {
                                    $match: search
                                },
                                {
                                    $skip: skip
                                },
                                {
                                    $limit: pageSize
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        logo: "$avatarUser",
                                        name: "$userName",
                                        phone: 1,
                                        createdAt: 1,
                                        email: "$emailContact",
                                        website: "$inForCompany.timviec365.usc_website",
                                        address: 1,
                                        authentic: 1,
                                        phoneTK: 1,
                                        otp: 1,
                                        emailTK: "$email",
                                        skype: "$inForCompany.timviec365.usc_skype",
                                        zalo: "$inForCompany.timviec365.usc_zalo",
                                        usc_note: "$inForCompany.timviec365.usc_note",
                                        registrationDate: "$createdAt",
                                        usc_map: "$inForCompany.timviec365.usc_map",
                                        kinhDoanh: "$inForCompany.usc_kd",
                                        idTimViec365: 1,
                                        point_usc: "$point.point_usc",
                                        ngay_reset_diem_ve_0: "$point.ngay_reset_diem_ve_0"
                                    }
                                }
                            ])
                        }
                    }

                    var listNewRegistrationNTD_1 = [];

                    for (var item of listNewRegistrationNTD) {
                        if (item.logo != null) {
                            item.logo = functions.cdnImageAvatar(Number(item.createdAt) * 1000) + item.logo;
                        }

                        listNewRegistrationNTD_1.push(item);
                    }
                    listNewRegistrationNTD_1 = [...new Map(listNewRegistrationNTD_1.map((item) => [item['_id'], item])).values()];
                    return functions.success(res, 'Lấy danh sách nhà tuyển dụng đăng kí mới thành công', {
                        data: listNewRegistrationNTD_1
                    })
                }
                return functions.success(res, 'Lấy danh sách nhà tuyển dụng đăng kí mới thành công', {
                    data: []
                })
            }
        }
        return functions.success(res, 'Bạn không phải là admin', {
            data: []
        }, 400)
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

// tool đẩy dữ liệu vip => 1 ngày đẩy 1 lần. 
exports.countGetListNewRegistrationNTD = async(req, res) => {
    try {
        var { _id, name, phone, email, emailTK, phoneTK } = req.body;
        var { city, district, checkVip, supportKD, fromDate, toDate, dk } = req.body;
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;
        const skip = (page - 1) * pageSize;
        let form = {
            page: page,
            pageSize: pageSize,
        };
        let search = {
            idTimViec365: { $gte: 1 },
            //type: 1,
            //"inForCompany.usc_kd": 0
        }
        if (_id != undefined && _id != "" && !isNaN(parseInt(_id))) {
            form.idTimViec365 = Number(_id)
            search.idTimViec365 = Number(_id)
        }

        if (name != undefined && name != "") {
            form.userName = name
            search.userName = {
                $regex: name,
                $options: 'i'
            }
        }

        if (phone != undefined && phone != "") {
            form.phone = phone
            search.phone = {
                $regex: phone,
                $options: 'i'
            }
        }

        if (email != undefined && email != "") {
            form.emailContact = email
            search.emailContact = {
                $regex: email,
                $options: 'i'
            }
        }

        if (phoneTK != undefined && phoneTK != "") {
            form.phoneTK = phoneTK
            search.phoneTK = {
                $regex: phoneTK,
                $options: 'i'
            }
        }

        if (emailTK != undefined && emailTK != "") {
            form.email = emailTK
            search.email = {
                $regex: emailTK,
                $options: 'i'
            }
        }

        if (city != undefined && city != "") {
            form.city = parseInt(city);
            search.city = parseInt(city);
        }

        if (district != undefined && district != "") {
            form.district = parseInt(district);
            search.district = parseInt(district);
        }

        if (checkVip != undefined && checkVip != "") {
            form.checkVip = checkVip
        }
        if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate))) {
            form.fromDate = fromDate
            search.createdAt = {
                $gte: fromDate
            }
        }

        if (toDate != undefined && toDate != "" && !isNaN(parseInt(fromDate))) {
            form.toDate = toDate
            search.createdAt = {
                $lte: toDate
            }
        }

        if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate)) &&
            toDate != undefined && toDate != "" && !isNaN(parseInt(toDate))) {
            form.toDate = toDate
            form.fromDate = fromDate
            search.createdAt = {
                $gte: parseInt(fromDate),
                $lte: parseInt(toDate)
            }
        }

        if (dk) {
            form.dk = dk;
        }

        if (req.user && req.user.data.adm_id) {
            if (Number(req.user.data.adm_id) == 4) {
                if (supportKD != undefined && supportKD != "" && !isNaN(parseInt(supportKD))) {
                    form.supportKD = supportKD
                }

                let count = 0;
                let response;
                let aggregation = [];
                if (false) {
                    //if (req.body.checkVip) {
                    //console.log("countGetListNewRegistrationNTD", req.body);
                    aggregation = [{
                            $match: {
                                type: 1
                            }
                        },
                        {
                            $lookup: {
                                from: 'Tv365PointCompany',
                                localField: 'idTimViec365',
                                foreignField: 'usc_id',
                                as: 'point'
                            }
                        },
                        {
                            $unwind: "$point"
                        },
                        {
                            $project: {
                                _id: 1,
                                logo: "$avatarUser",
                                name: "$userName",
                                phone: 1,
                                createdAt: 1,
                                email: "$emailContact",
                                website: "$inForCompany.timviec365.usc_website",
                                address: 1,
                                authentic: 1,
                                phoneTK: 1,
                                otp: 1,
                                emailTK: "$email",
                                skype: "$inForCompany.timviec365.usc_skype",
                                usc_note: "$inForCompany.timviec365.usc_note",
                                zalo: "$inForCompany.timviec365.usc_zalo",
                                registrationDate: "$createdAt",
                                usc_map: "$inForCompany.timviec365.usc_map",
                                kinhDoanh: "$inForCompany.usc_kd",
                                idTimViec365: 1,
                                point_usc: "$point.point_usc",
                                ngay_reset_diem_ve_0: "$point.ngay_reset_diem_ve_0"
                            }
                        },
                        {
                            $match: {
                                idTimViec365: { $ne: 0 }
                            }
                        },
                        { $count: "count" }
                        // {
                        //     $count: "count"
                        // }
                    ];
                    if (Number(req.body.checkVip) == 1) {
                        let time = new Date().getTime() / 1000;
                        aggregation.splice(5, 0, {
                            $match: {
                                point_usc: { $ne: 0 }
                            }
                        })
                    } else if (Number(req.body.checkVip) == 2) {
                        aggregation.splice(5, 0, {
                            $match: {
                                point_usc: 0,
                                ngay_reset_diem_ve_0: { $ne: 0 }
                            }
                        })
                    } else if (Number(req.body.checkVip) == 3) {
                        aggregation.splice(5, 0, {
                            $match: {
                                point_usc: 0,
                                ngay_reset_diem_ve_0: 0
                            }
                        })
                    };
                    aggregation.splice(2, 0, {
                        $match: search
                    })
                    let obj_count = await Users.aggregate(aggregation);
                    // console.log("obj_count", obj_count);
                    count = obj_count[0].count;
                } else {
                    console.log("Form count", form);
                    response = await axios({
                        method: "post",
                        url: "http://43.239.223.57:9002/getListNewRegister",
                        data: form,
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                    count = Number(response.data.data.count);
                }
                // console.log("Count trả về", count);
                return functions.success(res, 'Lấy count thành công', {
                    count: count,
                    aggregation
                })

            } else {
                let kd_ht = Number(req.user.data.adm_id);
                const adm_bophan = await AdminUser.findOne({ adm_id: kd_ht }).select('adm_bophan').lean();
                if (adm_bophan != null && adm_bophan != undefined) {
                    form.supportKD = adm_bophan.adm_bophan
                    if (adm_bophan == 0) {
                        let count = await Users.countDocuments(search)
                        return functions.success(res, 'Lấy count thành công', {
                            count: count
                        })
                    }
                    let response = await axios({
                        method: "post",
                        url: "http://43.239.223.57:9002/getListNewRegister",
                        data: form,
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                    console.log("Form elastic", form);

                    return functions.success(res, 'Lấy count thành công', {
                        count: Number(response.data.data.count)
                    })
                }
                return functions.success(res, 'Lấy danh sách nhà tuyển dụng đăng kí mới thành công', {
                    count: 0
                })
            }
        }
        return functions.success(res, 'Bạn không phải là admin', {
            count: 0
        }, 400)
    } catch (error) {
        console.log("countGetListNewRegistrationNTD", error);
        return functions.setError(res, error.message)
    }
}

exports.noteNTD = async(req, res) => {
    try {
        const usc_id = Number(req.body.usc_id);
        const usc_note = String(req.body.usc_note);
        //console.log("noteNTD", req.body);
        // let user = await Users.findOne({
        //     idTimViec365: usc_id,
        //     type: 1,
        //     "inForCompany.timviec365": { $ne: null }
        // });
        //console.log("user test", user);
        await Users.updateOne({
            idTimViec365: usc_id,
            type: 1,
            "inForCompany.timviec365": { $ne: null }
        }, {
            $set: {
                "inForCompany.timviec365.usc_note": usc_note
            }
        })
        return res.json({
            data: {
                message: "Thanh cong"
            }
        })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.getListHideNTD = async(req, res) => {
    try {
        var { _id, name, phone, email } = req.body;
        var { fromDate, toDate } = req.body;
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;
        const skip = (page - 1) * pageSize;
        var search = {
            type: 1
        }
        search["$or"] = [
            { email: "" },
            { phoneTK: "" }
        ]

        if (_id != undefined && _id != "" && !isNaN(parseInt(_id))) {
            search.idTimViec365 = Number(_id)
        }

        if (name != undefined && name != "") {
            search.userName = { $regex: new RegExp(name, 'i') }
        }

        if (phone != undefined && phone != "") {
            search.phone = phone
        }

        if (email != undefined && email != "") {
            search.emailContact = { $regex: new RegExp(email, 'i') }
        }

        if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate))) {
            fromDate = parseInt(fromDate);
            search.createdAt = { "$gte": fromDate }
        }

        if (toDate != undefined && toDate != "" && !isNaN(parseInt(fromDate))) {
            toDate = parseInt(toDate);
            search.createdAt = { "$lte": toDate }
        }

        if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate)) &&
            toDate != undefined && toDate != "" && !isNaN(parseInt(fromDate))) {
            fromDate = parseInt(fromDate);
            toDate = parseInt(toDate);
            search.createdAt = {
                "$gte": fromDate,
                "$lte": toDate
            }
        }

        let form = {
            page: page,
            pageSize: pageSize,
            _id: _id ? _id : "0",
            name: name ? name : "0",
            phone: phone ? phone : "-1",
            email: email ? email : "0",
            fromDate: fromDate ? fromDate : "0",
            toDate: toDate ? toDate : "0",
        }
        let response = await axios({
            method: "post",
            url: "http://43.239.223.57:9002/getListHideNTD",
            data: form,
            headers: { "Content-Type": "multipart/form-data" }
        });

        let array = response.data.data.listuser;

        let list = await Users.aggregate([{
                $sort: {
                    createdAt: -1
                }
            },
            {
                $match: {
                    idTimViec365: { $in: array }
                }
            },
            // {
            //     $skip: skip
            // }, {
            //     $limit: pageSize
            // },
            {
                $project: {
                    idTimViec365: 1,
                    logo: "$avatarUser",
                    name: "$userName",
                    phoneTK: 1,
                    emailTK: "$email",
                    phone: 1,
                    email: "$emailContact",
                    website: "$inForCompany.timviec365.usc_website",
                    address: 1,
                    createdAt: 1,
                    registrationDate: "$createdAt"
                }
            }
        ])

        list.map(user => {
            if (user.logo != null) {
                user.logo = functions.cdnImageAvatar(Number(user.createdAt) * 1000) + user.logo;
            }
            return user;
        })

        return functions.success(res, 'Lấy danh sách nhà tuyển dụng bị ẩn thành công', {
            // data: {
            //     listUser: list,
            //     count: Number(response.data.data.count),
            // }
            data: list
        })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.getListHideNTD_2 = async(req, res) => {
    try {
        var { _id, name, phone, email } = req.body;
        var { fromDate, toDate } = req.body;
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 20;
        var form = {
            page: page,
            pageSize: pageSize
        }
        if (_id != undefined && _id != "" && !isNaN(parseInt(_id))) {
            form.idTimViec365 = Number(_id)
        }

        if (name != undefined && name != "") {
            form.name = name
        }

        if (phone != undefined && phone != "") {
            form.phone = phone
        }

        if (email != undefined && email != "") {
            form.email = email
        }

        if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate))) {
            form.fromDate = fromDate
        }

        if (toDate != undefined && toDate != "" && !isNaN(parseInt(fromDate))) {
            form.toDate = toDate
        }

        if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate)) &&
            toDate != undefined && toDate != "" && !isNaN(parseInt(fromDate))) {
            form.fromDate = fromDate
            form.toDate = toDate
        }

        let response = await axios({
            method: "post",
            url: "http://43.239.223.57:9002/getListHideNTD_2",
            data: form,
            headers: { "Content-Type": "multipart/form-data" }
        });

        let array = response.data.data.listuser;

        let list = await Users.aggregate([{
                $sort: {
                    createdAt: -1
                }
            },
            {
                $match: {
                    idTimViec365: { $in: array },
                    type: 1
                }
            },
            {
                $project: {
                    idTimViec365: 1,
                    logo: "$avatarUser",
                    name: "$userName",
                    phoneTK: 1,
                    emailTK: "$email",
                    phone: 1,
                    email: "$emailContact",
                    website: "$inForCompany.timviec365.usc_website",
                    address: 1,
                    createdAt: 1,
                    registrationDate: "$createdAt"
                }
            }
        ])

        list.map(user => {
            if (user.logo != null) {
                user.logo = functions.cdnImageAvatar(Number(user.createdAt) * 1000) + user.logo;
            }
            return user;
        })

        return functions.success(res, 'Lấy danh sách nhà tuyển dụng bị ẩn thành công', {
            data: list
        })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.countGetListHideNTD = async(req, res) => {
    try {
        var { _id, name, phone, email } = req.body;
        var { fromDate, toDate } = req.body;
        const page = Number(req.body.page) || 1;
        const perPage = Number(req.body.pageSize) || 30;
        const skip = (page - 1) * perPage;
        var search = {
            type: 1
        }
        search["$or"] = [
            { email: "" },
            { phoneTK: "" }
        ]

        if (_id != undefined && _id != "" && !isNaN(parseInt(_id))) {
            search.idTimViec365 = Number(_id)
        }

        if (name != undefined && name != "") {
            search.userName = { $regex: new RegExp(name, 'i') }
        }

        if (phone != undefined && phone != "") {
            search.phone = phone
        }

        if (email != undefined && email != "") {
            search.emailContact = { $regex: new RegExp(email, 'i') }
        }

        if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate))) {
            fromDate = parseInt(fromDate);
            search.createdAt = { "$gte": fromDate }
        }

        if (toDate != undefined && toDate != "" && !isNaN(parseInt(fromDate))) {
            toDate = parseInt(toDate);
            search.createdAt = { "$lte": toDate }
        }

        if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate)) &&
            toDate != undefined && toDate != "" && !isNaN(parseInt(fromDate))) {
            fromDate = parseInt(fromDate);
            toDate = parseInt(toDate);
            search.createdAt = {
                "$gte": fromDate,
                "$lte": toDate
            }
        }

        var totalCount = 0

        let form = {
            page: page,
            pageSize: perPage,
            _id: _id ? _id : "0",
            name: name ? name : "0",
            phone: phone ? phone : "-1",
            email: email ? email : "0",
            fromDate: fromDate ? fromDate : "0",
            toDate: toDate ? toDate : "0",
        }
        let response = await axios({
            method: "post",
            url: "http://43.239.223.57:9002/getListHideNTD_2",
            data: form,
            headers: { "Content-Type": "multipart/form-data" }
        });
        // totalCount = await Users.aggregate([{
        //         $sort: {
        //             createdAt: -1
        //         }
        //     },
        //     {
        //         $match: search
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             count: { $sum: 1 }
        //         }
        //     }
        // ])


        return functions.success(res, 'Lấy danh sách nhà tuyển dụng bị ẩn thành công', {
            data: {
                count: Number(response.data.data.count),
            }
        })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.countGetListHideNTD_2 = async(req, res) => {
    try {
        var { _id, name, phone, email } = req.body;
        var { fromDate, toDate } = req.body;
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 20;
        var form = {
            page: page,
            pageSize: pageSize
        }
        if (_id != undefined && _id != "" && !isNaN(parseInt(_id))) {
            form.idTimViec365 = Number(_id)
        }

        if (name != undefined && name != "") {
            form.name = name
        }

        if (phone != undefined && phone != "") {
            form.phone = phone
        }

        if (email != undefined && email != "") {
            form.email = email
        }

        if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate))) {
            form.fromDate = fromDate
        }

        if (toDate != undefined && toDate != "" && !isNaN(parseInt(fromDate))) {
            form.toDate = toDate
        }

        if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate)) &&
            toDate != undefined && toDate != "" && !isNaN(parseInt(fromDate))) {
            form.fromDate = fromDate
            form.toDate = toDate
        }

        let response = await axios({
            method: "post",
            url: "http://43.239.223.57:9002/getListHideNTD_2",
            data: form,
            headers: { "Content-Type": "multipart/form-data" }
        });


        return functions.success(res, 'Lấy count thành công', {
            data: {
                count: Number(response.data.data.count)
            }
        })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.getListRegistrationFailedNTD = async(req, res) => {
    try {
        console.log("getListRegistrationFailedNTD", req.body);
        var { name, phone, email, regis } = req.body;
        var { fromDate, toDate } = req.body;
        const page = Number(req.body.page) || 1;
        const perPage = Number(req.body.pageSize) || 30;
        const skip = (page - 1) * perPage;


        //Lấy id admin
        var adm_id = req && req.user && req.user.data.adm_id ? req.user.data.adm_id : 4
        adm_id = parseInt(adm_id)

        var search = {}

        //Nếu không phải admin tổng thì k show danh sách
        if (adm_id != 4 && adm_id != 32 && !isNaN(adm_id)) {
            // điều kiện để danh sách không hiển thị ra, điều kiện type = 1000 này k có ý nghĩa chỉ để chặn quyền xem
            search.type = 1000;
        }

        if (name != undefined && name != "") {
            search.nameCompany = {
                "$regex": name,
            }
        }

        if (phone != undefined && phone != "") {
            search.phone = {
                "$regex": phone,
            }
        }

        if (email != undefined && email != "") {
            search.email = {
                "$regex": email,
            }
        }

        if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate))) {
            fromDate = parseInt(fromDate);
            search.errTime = { "$gte": fromDate }
        }

        if (toDate != undefined && toDate != "" && !isNaN(parseInt(fromDate))) {
            toDate = parseInt(toDate);
            search.errTime = { "$lte": toDate }
        }

        if (fromDate != undefined && fromDate != "" && !isNaN(parseInt(fromDate)) &&
            toDate != undefined && toDate != "" && !isNaN(parseInt(fromDate))) {
            fromDate = parseInt(fromDate);
            toDate = parseInt(toDate);
            search.errTime = {
                "$gte": fromDate,
                "$lte": toDate
            }
        }
        if (regis) {
            if (regis == 0) {
                search.regis = { $in: [0, null] }
            } else {
                search.regis = Number(regis);
            }
        }
        // console.log(search);
        var listRegistrationFailedNTD = []

        listRegistrationFailedNTD = await UserCompanyUnset.aggregate([{
                $match: search
            },
            {
                $sort: {
                    errTime: -1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: perPage
            },
            {
                $project: {
                    name: "$nameCompany",
                    phone: 1,
                    email: 1,
                    district: 1,
                    city: 1,
                    address: 1,
                    errTime: 1
                }
            }
        ])
        var totalCount = 0;
        totalCount = await UserCompanyUnset.aggregate([{
                $match: search
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ]);

        let listFinal = [];
        let _id = 0;
        for (let i = 0; i < listRegistrationFailedNTD.length; i++) {
            let user = listRegistrationFailedNTD[i];
            let obj = listFinal.find((e) => ((e.email == user.email) && (e.phone == user.phone)));
            if (!obj) {
                listFinal.push(user);
            }
            // listFinal.push(user);
        }
        let count = 0;
        if (totalCount.length > 0) {
            count = totalCount[0].count
        }
        return functions.success(res, 'Lấy danh sách nhà tuyển dụng đăng ký lỗi thành công', { data: listFinal, total: count })

    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.getDetailFailedNTD = async(req, res) => {
    try {
        const usc_id = req.body.usc_id;
        var condition = {};
        if (usc_id != "" && usc_id != 0 && usc_id != undefined) {
            condition._id = Number(usc_id);
        } else {
            return functions.setError(res, "Thiếu usc_id", 400);
        }
        const list = await UserCompanyUnset.aggregate([
            { $match: condition },
            {
                $project: {
                    usc_id: "$_id",
                    email: "$email",
                    phone: "$phone",
                    nameCompany: "$nameCompany",
                    city: "$city",
                    district: "$district",
                    address: "$address",
                    errTime: "$errTime",
                    regis: "$regis",
                }
            }
        ]);
        const count = await UserCompanyUnset.countDocuments(condition);
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

// hàm xóa NTD đăng ký lỗi
exports.deleteFailedNTD = async(req, res, next) => {
    try {
        let usc_id = req.body.usc_id;
        if (usc_id) {
            let checkdata = await functions.getDatafind(UserCompanyUnset, { _id: usc_id })
            if (checkdata.length > 0) {
                await UserCompanyUnset.deleteOne({ _id: usc_id });
            }
            return functions.success(res, 'xóa thành công')
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.activeNTD = async(req, res, next) => {
    try {
        let usc_id = req.body.usc_id;
        if (usc_id) {
            let checkdata = await Users.findOne({ idTimViec365: usc_id, type: 1 }, { authentic: 1 })
            if (checkdata) {
                if (checkdata.authentic == 1) {
                    await Users.updateOne({ idTimViec365: usc_id, type: 1 }, { authentic: 0 });
                } else {
                    await Users.updateOne({ idTimViec365: usc_id, type: 1 }, { authentic: 1 });
                }
            } else {
                return functions.success(res, 'Không tìm thấy người dùng')
            }
            return functions.success(res, 'Cập nhập thành công')
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.deleteCompany = async(req, res, next) => {
    try {
        const id = Number(req.body.id);
        if (!id) return functions.setError(res, 'not delete user');
        let checkUser = await Users.findOne({ type: 1, idTimViec365: id }).lean();
        if (checkUser) {
            checkUser.deleteTime = functions.getTimeNow();
            let dataDeleted = [];
            // for (const [key, value] of Object.entries(checkUser)) {
            //     dataDeleted[key] = checkUser[key];
            // }
            const userDeleted = new UsersDeleted(checkUser);
            await userDeleted.save();
            await Users.deleteOne({
                type: 1,
                idTimViec365: id,
            });
        }
        return functions.success(res, 'delete company is successfully');
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.listCompanyTest = async(req, res, next) => {
    try {
        const page = Number(req.body.page) || 1;
        const id = Number(req.body.id);
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const phoneTK = req.body.phoneTK;

        const promiseListCompany = Users.find({
                type: 1,
                idTimViec365: { $ne: 0 },
                'inForCompany.timviec365.usc_test': 1,
                ...(id ? { idTimViec365: id } : {}),
                ...(name ? { userName: { $regex: new RegExp(`^${name}`, 'i') } } : {}),
                ...(email ? { email: { $regex: new RegExp(`^${email}`, 'i') } } : {}),
                ...(phone ? { phone: { $regex: `^${phone}` } } : {}),
                ...(phoneTK ? { phoneTK: { $regex: `^${phoneTK}` } } : {}),
            }, {
                idTimViec365: 1,
                userName: 1,
                phoneTK: 1,
                phone: 1,
                email: 1,
                'inForCompany.timviec365.usc_name_phone': 1,
                'inForCompany.timviec365.usc_name_email': 1,
                createdAt: 1,
                lastActivedAt: 1,
                updatedAt: 1,
            })
            .sort({
                createdAt: -1,
            })
            .skip((page - 1) * 30)
            .limit(30);

        const promiseCount = Users.countDocuments({
            type: 1,
            idTimViec365: { $ne: 0 },
            'inForCompany.timviec365.usc_test': 1,
            ...(id ? { idTimViec365: id } : {}),
            ...(name ? { userName: { $regex: new RegExp(`^${name}`, 'i') } } : {}),
            ...(email ? { email: { $regex: new RegExp(`^${email}`, 'i') } } : {}),
            ...(phone ? { phone: { $regex: `^${phone}` } } : {}),
            ...(phoneTK ? { phoneTK: { $regex: `^${phoneTK}` } } : {}),
        });

        const [count, listCompany] = await Promise.all([
            promiseCount,
            promiseListCompany,
        ]);

        return functions.success(res, 'Get all candidate test is success', {
            listCompany: listCompany,
            count,
        });
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.getDataKD = async(req, res) => {
    try {
        let getData = await AdminUser.aggregate([{
                $match: { adm_bophan: { $ne: 0 } },
            },
            {
                $sort: {
                    adm_id: -1,
                },
            }, {
                $project: {
                    adm_id: "$adm_id",
                    adm_loginname: "$adm_loginname",
                    adm_name: "$adm_name",
                    adm_email: "$adm_email",
                    adm_author: "$adm_author",
                    adm_address: "$adm_address",
                    adm_phone: "$adm_phone",
                    adm_mobile: "$adm_mobile",
                    adm_access_module: "$adm_access_module",
                    adm_access_category: "$adm_access_category",
                    adm_date: "$adm_date",
                    adm_isadmin: "$adm_isadmin",
                    adm_active: "$adm_active",
                    lang_id: "$lang_id",
                    adm_delete: "$adm_delete",
                    adm_all_category: "$adm_all_category",
                    adm_edit_all: "$adm_edit_all",
                    admin_id: "$admin_id",
                    adm_bophan: "$adm_bophan",
                    adm_ntd: "$adm_ntd",
                    emp_id: "$emp_id",
                    adm_nhaplieu: "$adm_nhaplieu",
                    adm_rank: "$adm_rank",
                }
            }
        ])
        return functions.success(res, "Danh sách", {
            data: {
                getData
            }
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}
exports.loginAdmin = async(req, res, next) => {
    try {
        let id_admin = req.user.data.adm_id;
        if (id_admin) {
            const type = 1;
            let usc_id = req.body.usc_id;
            findUser = await functions.getDatafindOne(Users, { idTimViec365: usc_id, type: 1 });
            if (findUser) {
                if (findUser.type == type) {
                    const token = await functions.createToken({
                        _id: findUser._id,
                        idTimViec365: findUser.idTimViec365,
                        idQLC: findUser.idQLC,
                        idRaoNhanh365: findUser.idRaoNhanh365,
                        email: findUser.email,
                        phoneTK: findUser.phoneTK,
                        createdAt: findUser.createdAt,
                        userName: findUser.userName,
                        createTime: functions.getTimeNow(),
                        type: 1
                    }, "1d");
                    const refreshToken = await functions.createToken({ userId: findUser._id, createTime: functions.getTimeNow() }, "1d")
                    let data = {
                        access_token: token,
                        refresh_token: refreshToken,
                        chat365_id: findUser._id,
                        user_info: {
                            usc_id: findUser.idTimViec365,
                            usc_email: findUser.email,
                            usc_phone_tk: findUser.phoneTK,
                            usc_pass: findUser.password,
                            usc_company: findUser.userName,
                            usc_logo: findUser.avatarUser,
                            usc_phone: findUser.phone,
                            usc_city: findUser.city,
                            usc_qh: findUser.district,
                            usc_address: findUser.address,
                            usc_create_time: findUser.createdAt,
                            usc_update_time: findUser.updatedAt,
                            usc_active: findUser.lastActivedAt,
                            usc_authentic: findUser.authentic,
                            usc_lat: findUser.latitude,
                            usc_long: findUser.longtitude,
                        }
                    }
                    if (findUser.inForCompany) {
                        data.user_info.usc_name = findUser.inForCompany.userContactName;
                        data.user_info.usc_name_add = findUser.inForCompany.userContactAddress;
                        data.user_info.usc_name_phone = findUser.inForCompany.userContactPhone;
                        data.user_info.usc_name_email = findUser.inForCompany.userContactEmail;
                    }
                    return functions.success(res, 'Đăng nhập thành công', data);
                } else return functions.setError(res, "tài khoản này không phải tài khoản công ty", 404);
            }
            return functions.setError(res, "Tài khoản không tồn tại");
        }
        return functions.setError(res, "Bạn không có quyền thực hiện chức năng đăng nhập");
    } catch (error) {
        return functions.setError(res, error, 404)
    }

};

exports.listExcellGoogle = async(req, res) => {
    try {
        let timeFrom = Number(req.body.timeFrom),
            timeEnd = Number(req.body.timeEnd);
        let matchTime = {};
        if (timeFrom) {
            matchTime.$gte = timeFrom;
        }
        if (timeEnd) {
            matchTime.$lte = timeEnd;
        }
        let list = await Users.aggregate([{
                $match: {
                    idTimViec365: { $ne: 0 },
                    createdAt: matchTime,
                    phoneTK: { $nin: ['', null] },
                    type: 1
                }
            },
            {
                $project: {
                    phoneTK: 1,
                }
            }
        ]);
        return functions.success(res, 'Thành công', list);
    } catch {
        return functions.setError(res, error.message);
    }
}

exports.getListLoginNTD = async(req, res) => {
    try {

        let { usc_id, name, email, dk, city_id, qh_id, startdate, enddate, supportKD } = req.body;
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;
        const skip = (page - 1) * pageSize;
        let form = {
            page: page,
            pageSize: pageSize,
        };
        let search = {
            idTimViec365: { $gte: 1 },
            type: 1,
            time_login: { $gte: 1 }
        }
        if (usc_id != undefined && usc_id != "" && !isNaN(parseInt(usc_id))) {
            form.idTimViec365 = Number(usc_id)
            search.idTimViec365 = Number(usc_id)
        }

        if (name != undefined && name != "") {
            form.userName = name
            search.userName = {
                $regex: name,
                $options: 'i'
            }
        }

        if (email != undefined && email != "") {
            form.emailContact = email
            search.emailContact = {
                $regex: email,
                $options: 'i'
            }
        }

        if (city_id != undefined && city_id != "") {
            form.city = parseInt(city_id);
            search.city = parseInt(city_id);
        }

        if (qh_id != undefined && qh_id != "") {
            form.district = parseInt(qh_id);
            search.district = parseInt(qh_id);
        }

        if (startdate != undefined && startdate != "" && !isNaN(parseInt(startdate))) {
            form.fromDate = startdate
            search.time_login = {
                $gte: parseInt(startdate)
            }
        }

        if (enddate != undefined && enddate != "" && !isNaN(parseInt(enddate))) {
            form.toDate = enddate
            search.time_login = {
                $lte: parseInt(enddate)
            }
        }

        if (startdate != undefined && startdate != "" && !isNaN(parseInt(startdate)) &&
            enddate != undefined && enddate != "" && !isNaN(parseInt(enddate))) {
            form.toDate = enddate
            form.fromDate = startdate
            search.time_login = {
                $gte: parseInt(startdate),
                $lte: parseInt(enddate)
            }
        }

        if (dk) {
            search.fromDevice = parseInt(dk);
        }

        if (req.user && req.user.data.adm_id) {
            if (Number(req.user.data.adm_id) == 4) {
                if (supportKD != undefined && supportKD != "" && !isNaN(parseInt(supportKD))) {
                    search["inForCompany.usc_kd"] = parseInt(supportKD)
                }
                var listLoginNTD = [];

                listLoginNTD = await Users.aggregate([{
                        $match: search
                    },
                    {
                        $skip: skip
                    },
                    {
                        $limit: pageSize
                    },
                    {
                        $sort: {
                            time_login: -1
                        }
                    },
                    {
                        $lookup: {
                            from: 'Tv365PointCompany',
                            localField: 'idTimViec365',
                            foreignField: 'usc_id',
                            as: 'point'
                        }
                    },
                    {
                        $unwind: {
                            path: "$point",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            usc_logo: "$avatarUser",
                            usc_id: "$idTimViec365",
                            usc_company: "$userName",
                            usc_phone: "$phone",
                            usc_email: "$emailContact",
                            usc_time_login: "$time_login",
                            usc_address: "$address",
                            usc_create_time: "$createdAt",
                            point_usc: "$point.point_usc",
                            ngay_reset_diem_ve_0: "$point.ngay_reset_diem_ve_0"
                        }
                    }
                ])

                var listLoginNTD_1 = [];
                for (var item of listLoginNTD) {
                    if (item.usc_logo != null) {
                        item.usc_logo = functions.getUrlLogoCompany(Number(item.createdAt), item.usc_logo);
                    }

                    listLoginNTD_1.push(item);
                }
                const count = await Users.countDocuments(search);
                return functions.success(res, 'Lấy danh sách nhà tuyển dụng đăng nhập thành công', {
                    data: {
                        list: listLoginNTD,
                        count: count
                    }
                })

            } else {
                let kd_ht = Number(req.user.data.adm_id);
                let adm_bophan = await AdminUser.findOne({ adm_id: kd_ht }).select('adm_bophan').lean();
                if (adm_bophan != null && adm_bophan != undefined) {
                    search["inForCompany.usc_kd"] = parseInt(adm_bophan.adm_bophan)

                    var listLoginNTD = [];

                    listLoginNTD = await Users.aggregate([{
                            $match: search
                        },
                        {
                            $skip: skip
                        },
                        {
                            $limit: pageSize
                        },
                        {
                            $lookup: {
                                from: 'Tv365PointCompany',
                                localField: 'idTimViec365',
                                foreignField: 'usc_id',
                                as: 'point'
                            }
                        },
                        {
                            $unwind: {
                                path: "$point",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $sort: {
                                time_login: -1
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                usc_logo: "$avatarUser",
                                usc_id: "$idTimViec365",
                                usc_company: "$userName",
                                usc_phone: "$phone",
                                usc_email: "$emailContact",
                                usc_time_login: "$time_login",
                                usc_address: "$address",
                                usc_create_time: "$createdAt"
                            }
                        }
                    ])

                    var listLoginNTD_1 = [];
                    for (var item of listLoginNTD) {
                        if (item.usc_logo != null) {
                            item.usc_logo = functions.getUrlLogoCompany(Number(item.createdAt), item.usc_logo);
                        }

                        listLoginNTD_1.push(item);
                    }
                    const count = await Users.countDocuments(search);
                    return functions.success(res, 'Lấy danh sách nhà tuyển dụng đăng nhập thành công', {
                        data: {
                            list: listLoginNTD,
                            count: count
                        }
                    })
                }
                return functions.success(res, 'Lấy danh sách nhà tuyển dụng đăng kí mới thành công', {
                    data: []
                })
            }
        }
        return functions.success(res, 'Bạn không phải là admin', {
            data: []
        }, 400)
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

// exports.HistoryTransferNotCall = async(req, res) => {
//     try {
//         const list_emp = await Users.aggregate({
//             $match: {
//                 "inForPerson.employee.com_id": 10003087
//             }
//         });
//         console.log(list_emp);
//     } catch (error) {
//         console.log(error);
//         return functions.setError(res, error.message);
//     }
// }