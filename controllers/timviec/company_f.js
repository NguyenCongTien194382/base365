const md5 = require('md5');

// Load models
const Users = require('../../models/Users');
const functions = require('../../services/functions');
const ApplyForJob = require('../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');
const NewTV365 = require('../../models/Timviec365/UserOnSite/Company/New');
const SaveCandidate = require('../../models/Timviec365/UserOnSite/Company/SaveCandidate');
const PointCompany = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany');
const PointUsed = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointUsed');
const CompanyUnset = require('../../models/Timviec365/UserOnSite/Company/UserCompanyUnset');
const AdminUser = require('../../models/Timviec365/Admin/AdminUser');
const CategoryCompany = require('../../models/Timviec365/UserOnSite/Company/CategoryCompany')
const CV = require('../../models/Timviec365/CV/Cv365')
const TagBlog = require('../../models/Timviec365/Blog/TagBlog');
const CompanyStorage = require('../../models/Timviec365/UserOnSite/Company/Storage');
const PermissionNotify = require('../../models/Timviec365/PermissionNotify');
const CreditController = require('./credits')

// Load service
const service = require('../../services/timviec365/company');
const servicePermissionNotify = require('../../services/timviec365/PermissionNotify');
const sendMail = require('../../services/timviec365/sendMail');
const multer = require('multer');
const fs = require('fs');


// Check email tồn tại
exports.checkExistEmail = async(req, res) => {
    try {
        const email = req.body.email;
        if (email) {
            const checkEmail = await Users.findOne({
                email: email,
                "inForCompany.timviec365.usc_md5": "",
                type: 1
            }).lean();
            if (!checkEmail) {
                return functions.success(res, "email có thể sử dụng để đăng ký");
            }
            return functions.setError(res, "Email đã tồn tại.")
        }
        return functions.setError(res, "Chưa truyền email");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

// Check tên công ty
exports.checkExistName = async(req, res) => {
    try {
        const nameCompany = req.body.nameCompany;
        if (nameCompany) {
            const company = await Users.findOne({
                userName: { $regex: new RegExp('^' + nameCompany + '$', 'i') }
            }, {
                email: 1,
                phoneTK: 1
            }).lean();
            if (!company) {
                return functions.success(res, "Tên công ty có thể sử dụng để đăng ký", {
                    account: ""
                });
            }
            return functions.success(res, "Tên công ty đã được sử dụng", {
                account: company.email != null ? company.email : company.phoneTK
            });
        }
        return functions.setError(res, "Chưa truyền tên công ty");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

// hàm đăng ký
exports.register = async(req, res, next) => {
    try {
        let request = req.body,
            email = request.email,
            password = request.password,
            username = request.usc_name,
            city = request.usc_city,
            district = request.usc_qh,
            address = request.usc_address,
            phone = request.phone,
            description = request.usc_mota || null,
            linkVideo = request.linkVideo,
            fromDevice = request.fromDevice,
            fromWeb = request.fromWeb;

        // check dữ liệu không bị undefined
        if (username && password && city && district && address && email && phone) {
            // validate email,phone
            let CheckEmail = await functions.checkEmail(email),
                CheckPhoneNumber = await functions.checkPhoneNumber(phone);

            if (CheckPhoneNumber && CheckEmail) {
                //  check email co trong trong database hay khong
                let user = await functions.getDatafindOne(Users, { email, type: 1 });
                if (user == null) {
                    if (JSON.stringify(req.files) !== '{}') {
                        let totalSize = 0;
                        const files = req.files.storage;

                        // Chuyển đối tượng thành mảng
                        const storage = Object.keys(files).map((key) => files[key]);

                        // Tính tổng dung lượng file tải lên
                        storage.forEach(file => {
                            totalSize += file.size;
                        });

                        if (totalSize > functions.MAX_STORAGE) {
                            return functions.setError(res, 'Dung lượng file tải lên vượt quá 300MB');
                        }
                    }

                    // Lấy ID lĩnh vực
                    const lvID = await service.recognition_tag_company(username, description);

                    // Lấy ID kinh doanh sau khi được chia
                    const kd = await service.shareCompanyToAdmin();

                    // Lấy id mới nhất
                    const getMaxUserID = await functions.getMaxUserID("company");
                    // data gửi đến bộ phận nhân sự qua app chat
                    // let dataSendChatApp = {
                    //     ContactId: kd.emp_id,
                    //     SenderID: 1191,
                    //     MessageType: 'text',
                    //     Message: `${username} vừa đăng ký tài khoản nhà tuyển dụng trên timviec365.vn`,
                    //     LiveChat: { "ClientId": "200504_liveChatV2", "ClientName": username, "FromWeb": "timviec365.vn", "FromConversation": "506685" },
                    //     InfoSupport: { "Title": "Hỗ trợ", "Status": 1 },
                    //     MessageInforSupport: `Xin chào, tôi tên là ${username},SĐT: ${phone} `,
                    //     Email: `${email},tôi vừa đăng ký tài khoản NTD trên timviec365.vn,tôi cần bạn hỗ trợ !`
                    // }

                    const otp = Math.floor(Math.random() * 900000) + 100000;

                    const data = {
                        _id: getMaxUserID._id,
                        email: email,
                        password: md5(password),
                        phone: phone,
                        userName: username,
                        alias: functions.renderAlias(username),
                        type: 1,
                        city: city,
                        district: district,
                        address: address,
                        otp: otp,
                        isOnline: 1,
                        createdAt: functions.getTimeNow(),
                        updatedAt: functions.getTimeNow(),
                        role: 1,
                        authentic: 0,
                        fromWeb: fromWeb || null,
                        fromDevice: fromDevice || null,
                        idTimViec365: getMaxUserID._idTV365,
                        idRaoNhanh365: getMaxUserID._idRN365,
                        idQLC: getMaxUserID._idQLC,
                        chat365_secret: Buffer.from(getMaxUserID._id.toString()).toString('base64'),
                        inForCompany: {
                            scan: 1,
                            usc_kd: kd.usc_kd,
                            usc_kd_first: kd.usc_kd,
                            description: description,
                            timviec365: { usc_lv: lvID }
                        }
                    };

                    if (linkVideo) {
                        data.usc_video = linkVideo;
                        data.usc_video_type = 2;
                    }

                    const company = new Users(data);
                    await company.save();

                    // Gửi mail kích hoạt
                    sendMail.SendRegisterNTDAPP(email, username, otp);

                    // Xử lý upload hình ảnh vào kho nếu có
                    if (JSON.stringify(req.files) !== '{}') {
                        // Cập nhật ảnh đại diện
                        const avatarUser = req.files.avatarUser;
                        const uploadLogo = service.uploadLogo(avatarUser);
                        await Users.updateOne({ _id: getMaxUserID._id }, {
                            $set: { avatarUser: uploadLogo.file_name }
                        });

                        // Xử lý hình ảnh vào kho
                        const files = req.files.storage;

                        // Chuyển đối tượng thành mảng
                        const storage = Object.keys(files).map((key) => files[key]);

                        let uploadStorage, isUploadLogo = 0;
                        for (let index = 0; index < storage.length; index++) {
                            file = storage[index];

                            if (service.checkItemStorage(file.type)) {
                                if (service.isImage(file.type)) {
                                    uploadStorage = service.uploadStorage(getMaxUserID._idTV365, file, 'image');
                                    await service.addStorage(getMaxUserID._idTV365, 'image', uploadStorage.file_name);
                                } else {
                                    uploadStorage = service.uploadStorage(getMaxUserID._idTV365, file, 'video');
                                    await service.addStorage(getMaxUserID._idTV365, 'video', uploadStorage.file_name);
                                }
                            }
                        }
                    }

                    // gửi cho bộ phận nhân sự qua appchat
                    await functions.getDataAxios('http://210.245.108.202:9000/api/message/SendMessage_v2', dataSendChatApp)
                    let companyUnset = await functions.getDatafindOne(CompanyUnset, { email })
                    if (companyUnset != null) {
                        await functions.getDataDeleteOne(CompanyUnset, { email })
                    }

                    // Lưu lại thông tin phân quyền
                    const listPermissions = request.listPermissions;
                    servicePermissionNotify.HandlePermissionNotify(getMaxUserID._idTV365, listPermissions, 'company');

                    const token = await functions.createToken(data, "1d");
                    return functions.success(res, 'đăng ký thành công', {
                        access_token: token,
                        user_id: getMaxUserID._idTV365,
                        chat365_id: getMaxUserID._id
                    })
                } else {
                    return functions.setError(res, 'email đã tồn tại', 404)
                }
            } else {
                return functions.setError(res, 'email hoặc số điện thoại định dạng không hợp lệ', 404)
            }
        } else {
            return functions.setError(res, 'Thiếu dữ liệu', 404)
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

// hàm dăng nhập
exports.login = async(req, res, next) => {
    try {
        if (req.body.email && req.body.password) {
            console.log("login", req.body);
            const type = 1;
            const id_chat = req.body.id_chat;
            let email = req.body.email;
            let password = req.body.password;
            let password_type = req.body.password_type || 0;

            if (id_chat && id_chat != 0) {
                const permission = await PermissionNotify.aggregate([{
                        $match: {
                            pn_type_noti: { $all: [1] },
                            pn_id_chat: id_chat
                        }
                    },
                    { $limit: 1 },
                    {
                        $lookup: {
                            from: "Users",
                            foreignField: "idTimViec365",
                            localField: "pn_usc_id",
                            as: "user",
                        }
                    },
                    { $unwind: "$user" },
                    { $match: { "$user.type": 1 } },
                    {
                        $project: {
                            usc_email: "$user.email",
                            usc_phone_tk: "$user.phoneTK",
                            usc_pass: "$user.password",
                        }
                    }
                ]);
                if (permission.length > 0) {
                    const rs_permission = permission[0];
                    email = rs_permission.usc_email != "" ? rs_permission.usc_email : rs_permission.usc_phone_tk;
                    password = rs_permission.usc_pass;
                    password_type = 1;
                }
            }

            password = (password_type == 0) ? md5(password) : password;

            let checkPhoneNumber = await functions.checkEmail(email);
            if (checkPhoneNumber) {
                let findUser = await functions.getDatafindOne(Users, { email, type: 1 });
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
                            type: 1
                        }, "1d");
                        const refreshToken = await functions.createToken({ userId: findUser._id }, "1d")
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
                                // usc_name: findUser.inForCompany.userContactName,
                                // usc_name_add: findUser.inForCompany.userContactAddress,
                                // usc_name_phone: findUser.inForCompany.userContactPhone,
                                // usc_name_email: findUser.inForCompany.userContactEmail,
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
                return functions.setError(res, "Tài khoản hoặc mật khẩu không đúng");
                let checkPassword = await functions.verifyPassword(password, findUser.password)
                if (!checkPassword) {
                    return functions.setError(res, "Mật khẩu sai", 404)
                }



            } else {
                return functions.setError(res, "không đúng định dạng email", 404)
            }
        }
    } catch (error) {
        return functions.setError(res, error, 404)
    }

};

// hàm lấy user khi đăng ký sai
exports.registerFall = async(req, res, next) => {
    try {
        let request = req.body,
            email = request.email,
            phone = request.phone,
            nameCompany = request.nameCompany,
            city = request.city,
            district = request.district,
            address = request.address,
            regis = request.regis;
        let maxID = await functions.getMaxID(CompanyUnset) || 1;
        if ((email) != undefined) {
            // check email ,phone
            let checkEmail = await functions.checkEmail(email)
            let CheckPhoneNumber = await functions.checkPhoneNumber(phone)
            if ((checkEmail && CheckPhoneNumber) == true) {
                let company = await functions.getDatafindOne(CompanyUnset, { email })
                if (company == null) {
                    const companyUnset = new CompanyUnset({
                        _id: (Number(maxID) + 1),
                        email: email,
                        nameCompany: nameCompany | null,
                        type: 1,
                        phone: phone,
                        city: city | null,
                        district: district | null,
                        address: address || null,
                        errTime: new Date().getTime(),
                        regis: regis || null

                    });
                    await companyUnset.save();
                    return functions.success(res, 'tạo thành công')

                } else {
                    await CompanyUnset.updateOne({ email: email }, {
                        $set: {
                            nameCompany: nameCompany,
                            phone: phone,
                            city: city,
                            district: district,
                            address: address,
                            errTime: new Date().getTime(),
                            regis: regis
                        }
                    });
                    return functions.success(res, 'update thành công')


                }
            } else {
                return functions.setError(res, 'email hoặc số điện thoại không đúng định dạng', 404)
            }
        } else {
            return functions.setError(res, 'thiếu dữ liệu gmail', 404)

        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm gửi otp qua gmail khi kích hoạt tài khoản
exports.sendOTP = async(req, res, next) => {
    try {
        let email = req.body.email;
        if (email != undefined) {
            let checkEmail = await functions.checkEmail(email);
            if (checkEmail) {
                let user = await functions.getDatafindOne(Users, { email, type: 1 })
                if (user) {
                    let otp = await functions.randomNumber
                    await Users.updateOne({ _id: user._id }, {
                        $set: {
                            otp: otp
                        }
                    });
                    await functions.sendEmailVerificationRequest(otp, email, user.userName);
                    return functions.success(res, 'Gửi mã OTP thành công');
                }
                return functions.setError(res, 'tài khoản không tồn tại', 404)
            } else {
                return functions.setError(res, 'email không đúng định dạng', 404)
            }
        } else {
            return functions.setError(res, 'thiếu dữ liệu gmail', 404)
        }

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm xác nhận otp để kích hoạt tài khoản
exports.verify = async(req, res, next) => {
    try {
        let otp = req.body.otp,
            user = req.user.data;
        if (otp) {
            let User = await Users.findOne({ _id: user._id, otp });
            if (User != null) {
                await Users.updateOne({ _id: User._id }, {
                    $set: {
                        authentic: 1
                    }
                });
                return functions.success(res, 'xác thực thành công', { user_id: User.idTimViec365 })
            }
            return functions.setError(res, 'xác thực thất bại', 404)
        }
        return functions.setError(res, 'thiếu dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm bước 1 của quên mật khẩu
exports.forgotPasswordCheckMail = async(req, res, next) => {
    try {
        let email = req.body.email,
            otp = req.body.otp;
        let checkEmail = await functions.checkEmail(email);
        if (checkEmail) {
            let user = await Users.findOne({ email: email, type: 1 });
            if (user) {
                await Users.updateOne({ _id: user._id }, {
                    $set: { otp: otp }
                });
                await sendMail.SendqmkNTDAPP(email, user.userName, otp);
                return functions.success(res, 'xác thực thành công', { IdTv365: user.idTimViec365 })
            }
            return functions.setError(res, 'email không đúng', 404)
        }
        return functions.setError(res, 'sai định dạng email', 404)


    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm bước 2 của quên mật khẩu
exports.forgotPasswordCheckOTP = async(req, res, next) => {
    try {
        let idTv365 = req.body.id,
            otp = req.body.otp;
        if (otp) {
            let user = await Users.findOne({ idTimViec365: idTv365, otp: otp, type: 1 });
            if (user) {
                const obj = { otp: user.otp, idTv365: idTv365, type: user.type };
                const base64 = Buffer.from(JSON.stringify(obj)).toString('base64');
                return functions.success(res, 'xác thực thành công', { base64 })
            }
            return functions.setError(res, 'mã otp không đúng', 404)
        }
        return functions.setError(res, 'thiếu mã otp', 404)


    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm bước 3 của quên mật khẩu
exports.updatePassword = async(req, res, next) => {
    try {
        let email = req.user.data.email,
            password = req.body.password;
        if (password) {
            await Users.updateOne({ email: email, type: 1 }, {
                $set: {
                    password: md5(password)
                }
            });
            return functions.success(res, 'đổi mật khẩu thành công')

        }
        return functions.setError(res, 'thiếu mật khẩu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập thông tin công ty
exports.updateInfor = async(req, res, next) => {
    try {
        const user = req.user.data;
        let companyID = user._id,
            idTimViec365 = user.idTimViec365,
            request = req.body,
            phone = request.phone,
            userCompany = request.name,
            city = request.city,
            district = request.usc_qh,
            address = request.address,
            description = request.gt,
            mst = request.thue,
            tagLinhVuc = request.tagLinhVuc,
            usc_video_link = request.usc_video_link,
            usc_images = request.usc_images,
            usc_manager = request.usc_manager,
            usc_skype = request.usc_skype,
            usc_zalo = request.usc_zalo,
            usc_website = request.usc_website,
            //Quy mô công ty
            usc_size = request.usc_size,
            //Thời gian thành lập
            usc_founded_time = request.usc_founded_time,
            /**
             * Mảng chứa data add chi nhánh.
             * VD: [
             * {
             *  usc_branch_cit: 1,
             *  usc_branch_qh: 2,
             *  usc_branch_address: "Hai Ba Trung"
             * }, ...
             * ]
             * */
            usc_branches_add = request.usc_branches_add,
            /**
             * Mảng chứa data edit chi nhánh. Chỉ thêm những trường muốn edit, bắt buộc có _id
             * VD: [
             * {
             *  _id: "64d04ce1b0671c0154f00b53",
             *  usc_branch_cit: 1,
             *  usc_branch_qh: 2,
             *  usc_branch_address: "Hai Ba Trung"
             * }, ...
             * ]
             * */
            usc_branches_edit = request.usc_branches_edit,
            //Mảng chứa _id để xóa chi nhánh. VD: ["64d04ce1b0671c0154f00b53", "64d04ce1b0671c0154f00b54"]
            usc_branches_delete = request.usc_branches_delete;

        if (phone && userCompany && city && district && address) {
            let checkPhone = await functions.checkPhoneNumber(phone);
            const now = functions.getTimeNow();
            if (checkPhone) {
                let dataUpdate = {
                    'inForCompany.description': description,
                    'userName': userCompany,
                    'phone': phone,
                    'city': city,
                    'district': district,
                    'address': address,
                    'inForCompany.timviec365.usc_mst': mst || null,
                    "inForCompany.timviec365.usc_lv": tagLinhVuc,
                    "inForCompany.timviec365.usc_images": usc_images,
                    "inForCompany.timviec365.usc_manager": usc_manager,
                    "inForCompany.timviec365.usc_skype": usc_skype,
                    "inForCompany.timviec365.usc_zalo": usc_zalo,
                    "inForCompany.timviec365.usc_website": usc_website,
                    "inForCompany.timviec365.usc_size": usc_size,
                };

                let pull = {};
                let push = {};

                if (usc_video_link) {
                    dataUpdate["inForCompany.timviec365.usc_video"] = usc_video_link;
                    dataUpdate["inForCompany.timviec365.usc_video_type"] = 2;
                }

                if (usc_founded_time) {
                    dataUpdate["inForCompany.timviec365.usc_founded_time"] = (new Date(usc_founded_time)).getTime() / 1000;
                }

                let Files = req.files || null;
                if (Files && Files.usc_license) {
                    let license = await functions.uploadLicense(idTimViec365, Files.usc_license);
                    dataUpdate["inForCompany.timviec365.usc_license"] = license;
                }

                if (usc_branches_delete && usc_branches_delete.length) {
                    if (typeof usc_branches_delete === "string") {
                        //Trong trường hợp chỉ có 1 giá trị id
                        usc_branches_delete = [usc_branches_delete];
                    }
                    pull["inForCompany.timviec365.usc_branches"] = { _id: { $in: [...usc_branches_delete] } };
                }

                if (usc_branches_add && usc_branches_add.length) {
                    //Map lại để lọc trường, tránh việc thêm sai trường
                    push["inForCompany.timviec365.usc_branches"] = {
                        $each: usc_branches_add.map(data => ({
                            usc_branch_cit: data.usc_branch_cit,
                            usc_branch_qh: data.usc_branch_qh,
                            usc_branch_address: data.usc_branch_address,
                            usc_branch_time: functions.getTimeNow()
                        }))
                    }
                }

                if (usc_branches_edit && usc_branches_edit.length) {
                    let promises = [];
                    usc_branches_edit.forEach(payload => {
                        if (payload._id) {
                            promises.push(
                                Users.updateOne({ _id: companyID, "inForCompany.timviec365.usc_branches._id": payload._id }, {
                                    $set: {
                                        "inForCompany.timviec365.usc_branches.$.usc_branch_cit": payload.usc_branch_cit,
                                        "inForCompany.timviec365.usc_branches.$.usc_branch_qh": payload.usc_branch_qh,
                                        "inForCompany.timviec365.usc_branches.$.usc_branch_address": payload.usc_branch_address
                                    }
                                })
                            )
                        }
                    });
                    //
                    await Promise.all(promises);
                }

                await Users.updateOne({ _id: companyID }, {
                    $set: dataUpdate,
                    $pull: pull,
                    $push: push
                });



                // Cập nhật quyền
                const list_permission = req.body.list_permission;
                if (list_permission && list_permission != '' && list_permission.length > 0) {
                    const array_list_permission = JSON.parse(list_permission);
                    for (let i = 0; i < array_list_permission.length; i++) {
                        const element = array_list_permission[i];
                        const id_chat_pq = element.arr_id_chat;

                        const id_thongbao = element.arr_id_ltbao.toString();
                        for (let j = 0; j < id_chat_pq.length; j++) {
                            const id_chat = id_chat_pq[j];

                            const checkNotify = await PermissionNotify.findOne({
                                pn_usc_id: idTimViec365,
                                pn_id_chat: id_chat,
                                pn_id_new: 0
                            });

                            if (checkNotify) {
                                await PermissionNotify.updateOne({
                                    pn_usc_id: idTimViec365,
                                    pn_id_chat: id_chat,
                                    pn_id_new: 0
                                }, {
                                    $set: {
                                        pn_type_noti: id_thongbao,
                                        pn_created_at: now
                                    }
                                });
                            } else {
                                if (id_thongbao) {
                                    const maxID = await PermissionNotify.findOne({}, { pn_id: 1 }).sort({ pn_id: -1 }).lean();
                                    const item = new PermissionNotify({
                                        pn_id: Number(maxID.pn_id) + 1,
                                        pn_usc_id: idTimViec365,
                                        pn_id_chat: id_chat,
                                        pn_type_noti: id_thongbao,
                                        pn_created_at: now
                                    });
                                    await item.save();
                                }
                            }
                        }
                    }
                }

                // Xóa các quyền bị loại bỏ
                const list_permission_rm = req.body.list_permission_rm;
                if (list_permission_rm && list_permission_rm != '') {
                    const array_list_permission_rm = list_permission_rm.split(',').map(Number);
                    for (let k = 0; k < array_list_permission_rm.length; k++) {
                        const pn_id_chat = array_list_permission_rm[k];
                        await PermissionNotify.deleteOne({
                            pn_usc_id: idCompany,
                            pn_id_chat: pn_id_chat,
                            pn_id_new: 0
                        });
                    }
                }

                return functions.success(res, 'update thành công')
            }
            return functions.setError(res, 'sai định dạng số điện thoại')
        }
        return functions.setError(res, 'thiếu dữ liệu')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập thông tin liên hệ 
exports.updateContactInfo = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let userContactName = req.body.name_lh,
            userContactPhone = req.body.phone_lh,
            userContactAddress = req.body.address_lh,
            userContactEmail = req.body.email_lh;

        if (userContactAddress && userContactEmail && userContactName && userContactPhone) {
            let checkPhone = await functions.checkPhoneNumber(userContactPhone);
            let checkEmail = await functions.checkEmail(userContactEmail);

            if (checkEmail && checkPhone) {
                let user = await functions.getDatafindOne(Users, { email: email, type: 1 })

                if (user != null) {
                    await Users.updateOne({ email: email, type: 1 }, {
                        $set: {
                            'inForCompany.userContactName': userContactName,
                            'inForCompany.userContactPhone': userContactPhone,
                            'inForCompany.userContactAddress': userContactAddress,
                            'inForCompany.userContactEmail': userContactEmail,
                        }
                    });
                    return functions.success(res, 'update thành công')
                }
                return functions.setError(res, 'email không tồn tại')
            }
            return functions.setError(res, 'sai định dạng số điện thoại hoặc email')
        }
        return functions.setError(res, 'thiếu dữ liệu')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập video hoặc link 
exports.updateVideoOrLink = async(req, res, next) => {
    try {
        let com_id = req.user.data.idTimViec365;

        // Xử lý upload hình ảnh vào kho nếu có
        if (JSON.stringify(req.files) !== '{}') {
            // Xử lý hình ảnh vào kho
            const storage = req.files.storage;

            let uploadStorage, isUploadLogo = 0;
            for (let index = 0; index < storage.length; index++) {
                file = storage[index];

                if (service.checkItemStorage(file.type)) {
                    if (service.isImage(file.type)) {
                        uploadStorage = service.uploadStorage(com_id, file, 'image');
                        await service.addStorage(com_id, 'image', uploadStorage.file_name);
                    } else {
                        uploadStorage = service.uploadStorage(com_id, file, 'video');
                        await service.addStorage(com_id, 'video', uploadStorage.file_name);
                    }
                }
            }
        }

        return functions.setError(res, "Chưa truyền file để tải")
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm đổi mật khẩu bước 1
exports.changePasswordSendOTP = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let id = req.user.data._id
        let otp = await functions.randomNumber;
        let data = {
            UserID: id,
            SenderID: 1191,
            MessageType: 'text',
            Message: `Chúng tôi nhận được yêu cầu tạo mật khẩu mới tài khoản ứng viên trên timviec365.vn. Mã OTP của bạn là: '${otp}'`
        }
        await functions.getDataAxios('http://43.239.223.142:9000/api/message/SendMessageIdChat', data)
        await Users.updateOne({ email: email, type: 1 }, {
            $set: {
                otp: otp
            }
        });
        return functions.success(res, 'update thành công')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm bước 2  đổi mật khẩu
exports.changePasswordCheckOTP = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let otp = req.body.otp
        if (otp) {
            let verify = await Users.findOne({ email, otp, type: 1 });
            if (verify != null) {
                return functions.success(res, 'xác thực thành công')
            }
            return functions.setError(res, 'mã otp không đúng', 404)
        }
        return functions.setError(res, 'thiếu otp', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm đổi mật khẩu bước 3
exports.changePassword = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let password = req.body.password
        if (password) {
            await Users.updateOne({ email: email, type: 1 }, {
                $set: {
                    password: md5(password),
                }
            });
            return functions.success(res, 'đổi mật khẩu thành công')
        }
        return functions.setError(res, 'thiếu mật khẩu', 404)


    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập avatar
exports.updateImg = async(req, res, next) => {
    try {
        let email = req.user.data.email,
            avatarUser = req.file;
        if (avatarUser) {
            let checkImg = await functions.checkImage(avatarUser.path)
            if (checkImg) {
                await Users.updateOne({ email: email, type: 1 }, {
                    $set: {
                        avatarUser: avatarUser.filename,
                    }
                });
                return functions.success(res, 'thay đổi ảnh thành công')
            } else {
                await functions.deleteImg(avatarUser)
                return functions.setError(res, 'sai định dạng ảnh hoặc ảnh lớn hơn 2MB', 404)
            }
        } else {
            await functions.deleteImg(avatarUser)
            return functions.setError(res, 'chưa có ảnh', 404)
        }
    } catch (error) {
        console.log(error)
        await functions.deleteImg(req.file)
        return functions.setError(res, error)
    }
}

// hàm lấy dữ liệu thông tin cập nhập
exports.getDataCompany = async(req, res, next) => {
    try {
        let id = req.user.data.idTimViec365;
        let user = await functions.getDatafindOne(Users, { idTimViec365: id, type: 1 });
        if (user.inForCompany.timviec365.usc_license) {
            user.inForCompany.timviec365.usc_license =
                functions.getLicenseURL(id, user.inForCompany.timviec365.usc_license);
        }
        if (user) {
            return functions.success(res, 'lấy thông tin thành công', user)
        }
        return functions.setError(res, 'người dùng không tồn tại', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy dữ liệu danh sách ứng tuyển UV
exports.listUVApplyJob = async(req, res, next) => {
    try {
        const idCompany = req.user.data.idTimViec365,
            page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 10,
            nhs_new_id = req.body.ft_new,
            nhs_kq = req.body.ft_box,
            skip = (page - 1) * pageSize,
            limit = pageSize,
            type = req.body.type || "tuungtuyen";
        let match = {
                nhs_com_id: idCompany,
                nhs_kq: { $in: [0, 2, 13] }
            },
            lookUpUser = {
                from: "Users",
                localField: "nhs_use_id",
                foreignField: "idTimViec365",
                as: "user"
            },
            matchUser = {
                "user.type": 0
            },
            lookUpNewTv365 = {
                from: "NewTV365",
                localField: "nhs_new_id",
                foreignField: "new_id",
                as: "new"
            };
        if (type != 'tuungtuyen') {
            match.nhs_kq = { $in: [10, 11, 12, 14] }
        }
        if (nhs_new_id && nhs_new_id != 0) {
            match.nhs_new_id = Number(nhs_new_id);
        }
        if (nhs_kq && nhs_kq != 0) {
            match.nhs_kq = Number(nhs_kq);
        }

        let total = 0;
        const list = await ApplyForJob.aggregate([{
                $match: match
            },
            { $lookup: lookUpUser },
            { $unwind: "$user" },
            { $match: matchUser },
            { $lookup: lookUpNewTv365 },
            { $unwind: "$new" },
            { $sort: { nhs_id: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    use_id: "$user.idTimViec365",
                    use_first_name: "$user.userName",
                    use_email: "$user.email",
                    new_id: "$new.new_id",
                    new_title: "$new.new_title",
                    new_alias: "$new.new_alias",
                    nhs_time: 1,
                    nhs_kq: 1,
                    nhs_id: 1,
                    nhs_time_pv: 1,
                    nhs_text: 1,
                    nhs_thuungtuyen: 1
                }
            }
        ]);
        if (list.length > 0) {
            let countUv = await ApplyForJob.aggregate([{
                    $match: match
                },
                {
                    $lookup: lookUpUser
                },
                {
                    $unwind: "$user"
                },
                {
                    $match: matchUser
                },
                {
                    $lookup: lookUpNewTv365
                },
                {
                    $unwind: "$new"
                },
                {
                    $count: "total"
                }
            ]);
            if (countUv.length > 0) {
                total = countUv[0].total;
            }
        }
        return functions.success(res, "Lấy danh sách uv thành công", { items: list, total: total });
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.listJobByToken = async(req, res) => {
    try {
        const userID = req.user.data.idTimViec365;
        const list = await NewTV365.find({ new_user_id: userID, new_md5: null }).select('new_id new_title');
        return functions.success(res, "Lấy danh sách uv thành công", { items: list });
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.update_uvut = async(req, res) => {
    try {
        let { nhs_id, nhs_kq, nhs_time_pv, nhs_time_tvs, nhs_time_tve, nhs_text } = req.body;
        if (nhs_id) {
            let data = {};
            if (nhs_kq) {
                data.nhs_kq = nhs_kq;
            }
            if (nhs_time_pv) {
                data.nhs_time_pv = nhs_time_pv;
            }
            if (nhs_time_tvs) {
                data.nhs_time_tvs = nhs_time_tvs;
            }
            if (nhs_time_tve) {
                data.nhs_time_tve = nhs_time_tve;
            }
            if (nhs_text) {
                data.nhs_text = nhs_text;
            }
            await ApplyForJob.updateOne({ nhs_id: nhs_id }, {
                $set: data
            });
            return functions.success(res, "Cập nhật thành công");
        }
        return functions.setError(res, "Chưa truyền id");
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.delete_hsut = async(req, res) => {
    try {
        let nhs_id = req.body.nhs_id;
        if (nhs_id) {
            const list = nhs_id.split(',').map(Number);
            await ApplyForJob.deleteMany({ nhs_id: { $in: list } });
            return functions.success(res, "Cập nhật thành công");
        }
        return functions.setError(res, "Chưa truyền id");
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy dữ liệu danh sách ứng tuyển của chuyên viên gửi
exports.listUVApplyJobStaff = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let page = Number(req.body.start);
        let pageSize = Number(req.body.curent);
        if (page && pageSize) {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            let findUV = await functions.pageFind(ApplyForJob, { userID: idCompany, type: 2 }, { _id: -1 }, skip, limit);
            const totalCount = await functions.findCount(ApplyForJob, { userID: idCompany, type: 2 });
            const totalPages = Math.ceil(totalCount / pageSize);
            if (findUV) {
                return functions.success(res, "Lấy danh sách uv thành công", { totalCount, totalPages, listUv: findUV });
            }
            return functions.setError(res, 'không lấy được danh sách', 404)
        } else {
            let findUV = await functions.getDatafind(ApplyForJob, { userID: idCompany, type: 2 });
            return functions.success(res, "Lấy danh sách uv thành công", findUV);
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }

}

// hàm thống kê tin đăng
exports.postStatistics = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        const now = new Date();
        let startOfDay = (new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0));
        let endOfDay = (new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999));
        let threeDaysTomorow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
        // count UV ứng tuyển
        let countApplyForJobTypeOne = await functions.findCount(ApplyForJob, { userID: idCompany, type: 1 });
        // count cọng tác viên gửi Uv
        let countApplyForJobTypeTwo = await functions.findCount(ApplyForJob, { userID: idCompany, type: 2 });
        // count việc còn hạn
        let countAvailableJobs = await functions.findCount(NewTV365, { userID: idCompany, hanNop: { $gt: now } });
        // count việc hết hạn
        let countGetExpiredJobs = await functions.findCount(NewTV365, { userID: idCompany, hanNop: { $lt: now } });
        // count tin đã đăng trong ngày
        let countPostsInDay = await functions.findCount(NewTV365, { userID: idCompany, createTime: { $gte: startOfDay, $lte: endOfDay } });
        // count tin đã cập nhập trong ngày
        let countRefreshPostInDay = await functions.findCount(NewTV365, { userID: idCompany, updateTime: { $gte: startOfDay, $lte: endOfDay } });
        // count tin gần hết hạn 
        let countJobsNearExpiration = await functions.findCount(NewTV365, { userID: idCompany, hanNop: { $lte: threeDaysTomorow, $gte: now } });
        let count = {
            count_uv_ung_tuyen: countApplyForJobTypeOne,
            count_ctv_gui_uv: countApplyForJobTypeTwo,
            count_tin_dang_con_han: countAvailableJobs,
            count_tin_dang_het_han: countGetExpiredJobs,
            count_tin_dang_trong_ngay: countPostsInDay,
            count_tin_cap_nhap_trong_ngay: countRefreshPostInDay,
            count_tin_sap_het_han: countJobsNearExpiration,
        }
        return functions.success(res, "lấy số lượng thành công", count)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy danh sách các ứng viên đã lưu
exports.listSaveUV = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        const skip = (page - 1) * pageSize;
        const limit = pageSize;

        const list = await SaveCandidate.aggregate([{
                $match: {
                    usc_id: Number(idCompany)
                }
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "use_id",
                    foreignField: "idTimViec365",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            { $match: { "user.type": 0 } },
            { $sort: { id: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    use_id: "$user.idTimViec365",
                    use_first_name: "$user.userName",
                    use_email: "$user.email",
                    cv_title: "$user.inForPerson.candidate.cv_title",
                    save_time: 1
                }
            }
        ]);


        // let findUV = await functions.pageFind(SaveCandidate, { uscID: idCompany }, { _id: -1 }, skip, limit);
        // const totalCount = await functions.findCount(SaveCandidate, { uscID: idCompany });
        return functions.success(res, "Lấy danh sách uv thành công", { total: 0, items: list });
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm quản lý điểm
exports.manageFilterPoint = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let point = await functions.getDatafindOne(PointCompany, { uscID: idCompany, type: 1 });
        let now = new Date();
        let pointUSC = 0;
        // let checkReset0 = await functions.getDatafindOne(PointCompany, { uscID: idCompany, type: 1, dayResetPoint0: { $lt: now } });
        // if (checkReset0 == null) {
        //     pointUSC = point.pointCompany
        // }
        return functions.success(res, "lấy số lượng thành công", {
            pointFree: 0,
            pointUSC: pointUSC,
            totalPoint: pointUSC,
        })
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm xem ứng hồ sơ ứng viên với điểm lọc 
exports.seenUVWithPoint = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let idUser = req.body.useID;
        let type_payment = req.body.type_payment ? req.body.type_payment : 0;
        type_payment = Number(type_payment)
        if (idUser) {
            // Kiểm tra xem đã mất điểm hay chưa
            const checkUsePoint = await functions.getDatafindOne(PointUsed, {
                usc_id: idCompany,
                use_id: idUser
            });

            // Nếu chưa mất điểm thì xử lý
            if (!checkUsePoint) {
                // point - money
                // Lấy điểm hiện tại của ntd xem còn điểm không
                let companyPoint = await functions.getDatafindOne(PointCompany, { usc_id: idCompany });
                if (companyPoint) {
                    //Luồng xử lý điểm
                    if (type_payment === 0) {
                        let pointUSC = companyPoint.point_usc;
                        if (pointUSC > 0) {
                            pointUSC = pointUSC - 1;
                            await PointCompany.updateOne({ usc_id: idCompany }, {
                                $set: {
                                    pointUSC: pointUSC,
                                }
                            });
                            const pointUsed = new PointUsed({
                                usc_id: idCompany,
                                use_id: idUser,
                                point: 1,
                                type: 1,
                                used_day: functions.getTimeNow(),
                                check_from: 1
                            })
                            await pointUsed.save();

                            return functions.success(res, "Mở điểm ứng viên thành công");
                        }
                        return functions.setError(res, "Bạn đã hết điểm để sử dụng", 200)
                    } else if (type_payment === 1) {
                        let money_usc = companyPoint.money_usc;
                        const _price = 30000;
                        if (money_usc >= _price) {
                            await CreditController.useCreditsHandler(idCompany, _price);
                            const pointUsed = new PointUsed({
                                usc_id: idCompany,
                                use_id: idUser,
                                money: _price,
                                type: 1,
                                //Kiểu thanh toán: 1: Tiền, mặc định là 0: Điểm
                                type_payment: 1,
                                used_day: functions.getTimeNow(),
                                check_from: 1
                            })
                            await pointUsed.save();

                            return functions.success(res, "Mở điểm ứng viên thành công");
                        }
                        return functions.setError(res, "Bạn đã hết tiền để sử dụng", 200)
                    } else {
                        return functions.setError(res, "Không tồn tại phương thức thanh toán này!", 200)
                    }
                }
                return functions.setError(res, 'nhà tuyển dụng không có điểm', 200);
            }
            return functions.setError(res, 'Ứng viên này đã được xem thông tin');
        }
        return functions.setError(res, 'không có dữ liệu')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm đánh giá của NTD về CTV
exports.submitFeedbackCtv = async(req, res, next) => {
    try {
        let request = req.body,
            idCompany = req.user.data.idTimViec365,
            description = req.user.data.inForCompany.description;
        if (request) {
            let company = await functions.getDatafindOne(UserCompanyMultit, { uscID: idCompany });
            if (company) {
                await UserCompanyMultit.updateOne({ uscID: idCompany }, {
                    $set: {
                        dgc: request,
                        dgTime: new Date().getTime(),
                    }
                });
                return functions.success(res, "Cập nhập thành công")
            } else {
                let maxID = await functions.getMaxID(UserCompanyMultit) || 0;
                const feedBack = new UserCompanyMultit({
                    _id: maxID,
                    uscID: idCompany,
                    companyInfo: description,
                    dgc: request,
                    dgTime: new Date().getTime(),
                });
                await feedBack.save();
                return functions.success(res, "tạo thành công")
            }
        }
        return functions.setError(res, 'không có dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm đánh giá của NTD về Web
exports.submitFeedbackWeb = async(req, res, next) => {
    try {
        let request = req.body,
            idCompany = req.user.data.idTimViec365,
            description = req.user.data.inForCompany.description;
        if (request) {
            let company = await functions.getDatafindOne(UserCompanyMultit, { uscID: idCompany });
            if (company) {
                await UserCompanyMultit.updateOne({ uscID: idCompany }, {
                    $set: {
                        dgtv: request,
                        dgTime: new Date().getTime(),
                    }
                });
                return functions.success(res, "Cập nhập thành công")
            } else {
                let maxID = await functions.getMaxID(UserCompanyMultit) || 0;
                const feedBack = new UserCompanyMultit({
                    _id: maxID,
                    uscID: idCompany,
                    companyInfo: description,
                    dgtv: request,
                    dgTime: new Date().getTime(),
                });
                await feedBack.save();
                return functions.success(res, "tạo thành công")

            }
        }
        return functions.setError(res, 'không có dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy ra kho ảnh
exports.displayImages = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let khoAnh = await functions.getDatafindOne(Users, { idTimViec365: idCompany, type: 1 });
        if (khoAnh) {
            let data = {
                listImgs: khoAnh.inForCompany.comImages,
                listVideos: khoAnh.inForCompany.comVideos,
            }
            return functions.success(res, "lấy dữ liệu thành công thành công", data)
        }
        return functions.setError(res, 'không có dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm up ảnh ở kho ảnh
exports.uploadImg = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let img = req.files;
        let imageMoment = 0;
        let sizeImg = 0;
        let user = await functions.getDatafindOne(Users, { idTimViec365: idCompany, type: 1 });
        if (user) {
            let listImg = user.inForCompany.comImages;
            let listVideo = user.inForCompany.comVideos;
            const listMedia = [...listImg, ...listVideo];
            for (let i = 0; i < listMedia.length; i++) {
                imageMoment += listMedia[i].size;
            }
            if (imageMoment < functions.MAX_Kho_Anh) {
                if (img) {
                    for (let i = 0; i < img.length; i++) {
                        sizeImg += img[i].size;
                    }
                    if ((Number(sizeImg) + Number(imageMoment)) <= functions.MAX_Kho_Anh) {
                        for (let i = 0; i < img.length; i++) {
                            let checkImg = await functions.checkImage(img[i].path);
                            if (checkImg) {
                                let id = listImg[listImg.length - 1] || 0;
                                let newID = id._id || 0;
                                listImg.push({
                                    _id: Number(newID) + 1,
                                    name: img[i].filename,
                                    size: img[i].size
                                })
                            } else {
                                if (img) {
                                    for (let i = 0; i < img.length; i++) {
                                        await functions.deleteImg(img[i])
                                    }
                                }
                                return functions.setError(res, 'sai định dạng ảnh hoặc ảnh lớn hơn 2MB', 404)
                            }
                        }
                        await Users.updateOne({ idTimViec365: idCompany, type: 1 }, {
                            $set: { 'inForCompany.comImages': listImg }
                        });
                        return functions.success(res, 'thêm ảnh thành công')

                    } else {
                        if (img) {
                            for (let i = 0; i < img.length; i++) {
                                await functions.deleteImg(img[i])
                            }
                        }
                        return functions.setError(res, 'ảnh thêm vào đã quá dung lượng của kho', 404)
                    }
                } else {
                    if (img) {
                        for (let i = 0; i < img.length; i++) {
                            await functions.deleteImg(img[i])
                        }
                    }
                    return functions.setError(res, 'chưa có ảnh', 404)
                }
            }
            if (img) {
                for (let i = 0; i < img.length; i++) {
                    await functions.deleteImg(img[i])
                }
            }
            return functions.setError(res, ' kho ảnh đã đầy', 404)
        }
        if (img) {
            for (let i = 0; i < img.length; i++) {
                await functions.deleteImg(img[i])
            }
        }
        return functions.setError(res, 'nguời dùng không tồn tại', 404)
    } catch (error) {
        console.log(error)
        if (img) {
            for (let i = 0; i < img.length; i++) {
                await functions.deleteImg(img[i])
            }
        }
        return functions.setError(res, error)
    }
}

// hàm up video ở kho ảnh
exports.uploadVideo = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let video = req.files;
        let imageMoment = 0;
        let sizeVideo = 0;
        let user = await functions.getDatafindOne(Users, { idTimViec365: idCompany, type: 1 });
        if (user) {
            let listImg = user.inForCompany.comImages;
            let listVideo = user.inForCompany.comVideos;
            const listMedia = [...listImg, ...listVideo];
            for (let i = 0; i < listMedia.length; i++) {
                imageMoment += listMedia[i].size;
            }

            if (imageMoment < functions.MAX_Kho_Anh) {
                if (video) {
                    for (let i = 0; i < video.length; i++) {
                        sizeVideo += video[i].size;
                    }
                    if ((Number(sizeVideo) + Number(imageMoment)) <= functions.MAX_Kho_Anh) {
                        for (let i = 0; i < video.length; i++) {
                            let checkImg = await functions.checkVideo(video[i]);
                            if (checkImg) {
                                let id = listVideo[listVideo.length - 1] || 0;
                                let newID = id._id || 0;
                                listVideo.push({
                                    _id: Number(newID) + 1,
                                    name: video[i].filename,
                                    size: video[i].size,
                                })

                            } else {
                                if (video) {
                                    for (let i = 0; i < video.length; i++) {
                                        await functions.deleteImg(video[i])
                                    }
                                }
                                return functions.setError(res, 'sai định dạng video hoặc video lớn hơn 100MB', 404)
                            }
                        }
                        await Users.updateOne({ idTimViec365: idCompany, type: 1 }, {
                            $set: { 'inForCompany.comVideos': listVideo }
                        });
                        return functions.success(res, 'thêm video thành công')
                    } else {
                        if (video) {
                            for (let i = 0; i < video.length; i++) {
                                await functions.deleteImg(video[i])
                            }
                        }
                        return functions.setError(res, 'video thêm vào đã quá dung lượng của kho', 404)
                    }
                } else {
                    if (video) {
                        for (let i = 0; i < video.length; i++) {
                            await functions.deleteImg(video[i])
                        }
                    }
                    return functions.setError(res, 'chưa có video', 404)
                }
            }
            if (video) {
                for (let i = 0; i < video.length; i++) {
                    await functions.deleteImg(video[i])
                }
            }
            return functions.setError(res, 'kho ảnh đã đầy', 404)
        }
        if (video) {
            for (let i = 0; i < video.length; i++) {
                await functions.deleteImg(video[i])
            }
        }
        return functions.setError(res, 'nguời dùng không tồn tại', 404)
    } catch (error) {
        console.log(error)
        if (video) {
            for (let i = 0; i < video.length; i++) {
                await functions.deleteImg(video[i])
            }
        }
        return functions.setError(res, error)
    }
}

// hàm xóa ảnh
exports.deleteImg = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let idFile = req.body.idFile;
        let user = await functions.getDatafindOne(Users, { idTimViec365: idCompany, type: 1 });
        if (idFile && user) {
            let listImg = user.inForCompany.comImages;
            const index = listImg.findIndex(img => img._id == idFile);
            if (index != -1) {
                let nameFile = listImg[index].name;
                await listImg.splice(index, 1);
                await Users.updateOne({ idTimViec365: idCompany, type: 1 }, {
                    $set: { 'inForCompany.comImages': listImg }
                });
                await functions.deleteImg(`public\\KhoAnh\\${idCompany}\\${nameFile}`)
                return functions.success(res, 'xoá thành công')
            } else {
                return functions.setError(res, 'id không đúng', 404)
            }

        }
        return functions.setError(res, 'tên file không tồn tại hoặc người dùng không tồn tại', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm xóa video
exports.deleteVideo = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let idFile = req.body.idFile;
        let user = await functions.getDatafindOne(Users, { idTimViec365: idCompany, type: 1 });
        if (idFile && user) {
            let listVideo = user.inForCompany.comVideos;
            const index = listVideo.findIndex(video => video._id == idFile);
            if (index != -1) {
                await listVideo.splice(index, 1);
                let nameFile = listVideo[index].name;
                await Users.updateOne({ idTimViec365: idCompany, type: 1 }, {
                    $set: { 'inForCompany.comVideos': listVideo }
                });
                await functions.deleteImg(`public\\KhoAnh\\${idCompany}\\${nameFile}`)
                return functions.success(res, 'xoá thành công')
            } else {
                return functions.setError(res, 'id không đúng', 404)
            }
        }
        return functions.setError(res, 'tên file không tồn tại hoặc người dùng không tồn tại', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm gọi data lĩnh vực
exports.getDataLV = async(req, res, next) => {
    try {
        let lists = await CategoryCompany.find({ nameTag: { $ne: "" }, cityTag: 0 }, { _id: 1, nameTag: 1 }),
            data = [];
        for (let index = 0; index < lists.length; index++) {
            const element = lists[index];
            data.push({
                "id": element._id,
                "name_tag": element.nameTag
            });
        }
        return functions.success(res, 'lấy thành công', { data })
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
};

// hàm tìm lĩnh vực theo ngành nghề
exports.getFieldsByIndustry = async(req, res, next) => {
    try {
        let catID = req.body.cat_id;
        if (catID) {
            let data = await functions.getDatafind(CategoryCompany, { tagIndex: catID })
            return functions.success(res, 'lấy thành công', { data })
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// lưu ứng viên 
exports.luuUV = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let idUser = req.body.user_id;
        if (idUser) {
            // Kiểm tra ứng viên có tồn tại không
            const candidate = await functions.getDatafindOne(Users, {
                idTimViec365: idUser,
                type: 0
            });
            if (candidate != undefined) {
                // Kiểm tra đã lưu hay chưa
                const checkSaveCandi = await functions.getDatafindOne(SaveCandidate, {
                    usc_id: idCompany,
                    use_id: idUser,
                });
                if (checkSaveCandi == undefined) {
                    let maxID = await SaveCandidate.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
                    let newID = maxID.id || 0;
                    const uv = new SaveCandidate({
                        id: Number(newID) + 1,
                        usc_id: idCompany,
                        use_id: idUser,
                        save_time: functions.getTimeNow()
                    })
                    await uv.save();
                    return functions.success(res, 'lưu thành công')
                } else {
                    let deleteUv = await functions.getDataDeleteOne(SaveCandidate, {
                        usc_id: idCompany,
                        use_id: idUser,
                    })
                    if (deleteUv) {
                        return functions.success(res, 'bỏ lưu thành công')
                    }
                }
            }
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// xóa ứng viên trong danh sách lưu
exports.deleteUV = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let idUser = req.body.user_id;
        if (idUser) {
            await functions.getDataDeleteOne(SaveCandidate, { uscID: idCompany, userID: idUser })
            return functions.success(res, 'xóa thành công', )
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// danh sách sử dụng điểm của nhà tuyển dụng cho Uv
exports.listUVPoint = async(req, res, next) => {
    try {
        const idCompany = req.user.data.idTimViec365,
            page = Number(req.body.page) || 1,
            pageSize = Number(req.body.pageSize) || 10,
            skip = (page - 1) * pageSize,
            limit = pageSize,
            ft_box = req.body.ft_box,
            ft_box2 = req.body.ft_box2;

        let match = {
                usc_id: Number(idCompany),
                use_id: { $ne: 0 },
                type: 1
            },
            lookUpUser = {
                from: "Users",
                localField: "use_id",
                foreignField: "idTimViec365",
                as: "user"
            },
            matchUser = {
                "user.type": 0
            };
        if (ft_box != 'tc') {
            match.type = Number(ft_box);
        }
        if (ft_box2 != 'tc') {
            match.type_err = Number(ft_box2);
        }

        const list = await PointUsed.aggregate([
            { $match: match },
            { $lookup: lookUpUser },
            { $unwind: "$user" },
            { $match: matchUser },
            { $sort: { used_day: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    use_id: "$user.idTimViec365",
                    use_first_name: "$user.userName",
                    use_email: "$user.email",
                    cv_title: "$user.inForPerson.candidate.cv_title",
                    used_day: 1,
                    type: 1,
                    note_uv: 1,
                    return_point: 1,
                    type_err: 1,
                }
            }
        ]);
        let total = 0;
        if (list.length > 0) {
            let countUv = await PointUsed.aggregate([
                { $match: match },
                { $lookup: lookUpUser },
                { $unwind: "$user" },
                { $match: matchUser },
                { $count: "total" }
            ]);
            if (countUv.length > 0) {
                total = countUv[0].total;
            }
        }
        return functions.success(res, "Lấy danh sách uv thành công", { items: list, total: total });
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// xóa uv trong danh sách dùng điểm
exports.deleteUVUsePoin = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let idUser = req.body.user_id;
        if (idUser) {
            await functions.getDataDeleteOne(PointUsed, { uscID: idCompany, userID: idUser })
            return functions.success(res, 'xóa thành công', )
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập ứng viên ứng tuyển 
exports.updateUvApplyJob = async(req, res, next) => {
    try {
        let newID = req.body.new_id;
        let userID = req.body.user_id;
        let type = req.body.type;
        if (newID && userID && type) {
            let news = await functions.getDatafindOne(NewTV365, { _id: newID });
            let user = await functions.getDatafindOne(Users, { idTimViec365: userID, type: 1 });
            if (news && user) {
                await ApplyForJob.updateOne({ userID: userID, newID: newID }, {
                    $set: { kq: type }
                });
                return functions.success(res, 'cập nhập thành công', )
            }
            return functions.setError(res, 'người dùng hoặc bài viết không tồn tại', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập ứng viên qua điểm lọc
exports.updateUvWithPoint = async(req, res, next) => {
    try {
        let userID = req.body.user_id;
        let type = req.body.type;
        let note = req.body.note;
        if (userID) {
            let poin = await functions.getDatafindOne(PointUsed, { uscID: idCompany, useID: idUV });
            if (poin) {
                await PointUsed.updateOne({ uscID: idCompany, useID: idUV }, {
                    $set: {
                        type: type,
                        noteUV: note,
                    }
                });
                return functions.success(res, 'cập nhập thành công', )
            }
            return functions.setError(res, 'không tồn tại người dùng trong danh sách điểm lọc', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm chi tiết công ty trước đăng nhập
exports.getDetailInfoCompany = async(req, res, next) => {
    try {
        let idCompany = Number(req.body.user_id);
        if (idCompany) {
            let getData = await Users.aggregate([{
                $match: {
                    idTimViec365: idCompany,
                    type: 1
                }
            }, {
                $project: {
                    "usc_id": "$idTimViec365",
                    "usc_email": "$email",
                    "usc_company": "$userName",
                    "usc_alias": "$alias",
                    "usc_pass": "$password",
                    "chat365_id": "$_id",
                    "chat365_secret": "$chat365_secret",
                    "usc_name": "$inForCompany.timviec365.usc_name",
                    "usc_name_add": "$inForCompany.timviec365.usc_name_add",
                    "usc_name_phone": "$inForCompany.timviec365.usc_name_phone",
                    "usc_name_email": "$inForCompany.timviec365.usc_name_email",
                    "usc_redirect": "$inForCompany.timviec365.usc_redirect",
                    "usc_type": "$inForCompany.timviec365.usc_type",
                    "usc_mst": "$inForCompany.timviec365.usc_mst",
                    "usc_address": "$address",
                    "usc_phone": "$phone",
                    "usc_logo": "$avatarUser" || null,
                    "usc_size": "$inForCompany.timviec365.usc_size",
                    "usc_website": "$inForCompany.timviec365.usc_website",
                    "usc_city": "$city",
                    "usc_qh": "$district",
                    "usc_create_time": "$createdAt",
                    "usc_update_time": "$updatedAt",
                    "usc_view_count": "$inForCompany.timviec365.usc_view_count",
                    "usc_authentic": "$authentic",
                    "usc_company_info": "$inForCompany.description",
                    "usc_lv": "$inForCompany.timviec365.usc_lv",
                    "usc_badge": "$inForCompany.timviec365.usc_badge",
                    "usc_video": "$inForCompany.timviec365.usc_video_type",
                    "usc_video_type": "$inForCompany.timviec365.usc_video_type",
                    "usc_xac_thuc": "$otp",
                    "usc_kd": "$inForCompany.usc_kd",
                    "usc_license": "$inForCompany.timviec365.usc_license",
                    "usc_images": "$inForCompany.timviec365.usc_images",
                    "usc_manager": "$inForCompany.timviec365.usc_manager",
                    "usc_skype": "$inForCompany.timviec365.usc_skype",
                    "usc_zalo": "$inForCompany.timviec365.usc_zalo",
                    "usc_founded_time": "$inForCompany.timviec365.usc_founded_time",
                    "usc_branches": "$inForCompany.timviec365.usc_branches",
                    "idQLC": "$idQLC",
                }
            }]);
            if (getData.length > 0) {
                const company = getData[0];

                // Xử lý ảnh đại diện
                company.usc_logo = functions.getUrlLogoCompany(company.usc_create_time, company.usc_logo);

                company.usc_license = functions.getLicenseURL(idCompany, company.usc_license);

                // Lấy danh sách tin tuyển dụng của cty
                const listNew = await NewTV365.find({
                        $or: [
                            { new_user_id: company.usc_id },
                            { new_user_redirect: company.usc_id }
                        ],
                        new_active: 1,
                        new_301: '',
                        new_md5: { $ne: 1 },
                    }).lean(),
                    // Số lượng tin tuyển dụng
                    count = await functions.findCount(NewTV365, {
                        $or: [
                            { new_user_id: company.usc_id },
                            { new_user_redirect: company.usc_id }
                        ],
                        new_active: 1,
                        new_301: '',
                        new_md5: { $ne: 1 },
                    }),
                    // Lấy từ khóa liên quan
                    tagBlog = await TagBlog.find({
                        $text: { $search: company.usc_company }
                    })
                    .limit(20)
                    .lean(),
                    // Lấy kho ảnh
                    storageImage = await CompanyStorage.find({
                        usc_id: idCompany,
                        image: { $ne: null }
                    }).lean(),
                    // Lấy kho video
                    storageVideo = await CompanyStorage.find({
                        usc_id: idCompany,
                        video: { $ne: null }
                    }).lean();

                // Xử lý chuyển về text cho tỉnh thành, ngành nghề của tin
                for (let k = 0; k < listNew.length; k++) {
                    const element = listNew[k];
                    element.new_city = element.new_city.toString();
                    element.new_cat_id = element.new_cat_id.toString();
                }
                // Xử lý đường dẫn đầy đủ của ảnh và video
                for (let i = 0; i < storageImage.length; i++) {
                    const element = storageImage[i];
                    element.url = service.urlStorageImage(company.usc_create_time, element.image);
                }
                for (let j = 0; j < storageVideo.length; j++) {
                    const element = storageVideo[j];
                    element.url = service.urlStorageVideo(company.usc_create_time, element.video);
                }
                // Trả ra view
                company.storageImage = storageImage;
                company.storageVideo = storageVideo;

                // Lấy điểm còn lại của công ty
                company.point_usc = 0;
                let companyPoint = await PointCompany.findOne({ usc_id: idCompany }, { point_usc: 1 }).lean();
                if (companyPoint) {
                    company.point_usc = companyPoint.point_usc;
                }
                return functions.success(res, 'Lấy thông tin công ty thành công', {
                    detail_company: company,
                    items: listNew,
                    tu_khoa: tagBlog
                })
            }
            return functions.setError(res, 'công ty không tồn tại', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm box mẫu cv
exports.formCV = async(req, res, next) => {
    try {
        let formCV = await CV.find().sort({ vip: -1, _id: -1 }).limit(10);
        return functions.success(res, 'lấy thành công', { formCV })

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm đánh giá ứng viên 
exports.assessmentUV = async(req, res, next) => {
    try {
        let idUV = req.body.user_id;
        let idCompany = req.user.data.idTimViec365;
        let type = req.body.type;
        let note = req.body.note;
        if (idCompany) {
            let poin = await functions.getDatafindOne(PointUsed, { uscID: idCompany, useID: idUV });
            if (poin) {
                await PointUsed.updateOne({ uscID: idCompany, useID: idUV }, {
                    $set: {
                        type: type,
                        noteUV: note,
                    }
                });
                return functions.success(res, 'cập nhập thành công', )
            }
            return functions.setError(res, 'chưa xem chi tiết ứng viên', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// Lấy danh sách tin tuyển dụng đã đăng
exports.listNews = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365;
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 20;
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        const condition = { new_user_id: idCompany, new_md5: null };
        const listPost = await NewTV365.find(condition)
            .select("new_id new_title new_alias new_update_time new_city new_cat_id new_view_count new_bao_luu new_han_nop new_hot new_gap new_cao new_nganh new_create_time time_bao_luu")
            .limit(limit)
            .skip(skip)
            .sort({ new_id: -1 })
            .lean();

        for (let i = 0; i < listPost.length; i++) {
            const element = listPost[i];
            const cate = element.new_cat_id[0];
            const city = element.new_city[0];
            element.new_cat_id = element.new_cat_id.toString();
            element.new_city = element.new_city.toString();

            element.applied = await functions.findCount(ApplyForJob, { nhs_new_id: element.new_id, nhs_kq: 0 });
            element.count_uv = await functions.findCount(Users, {
                // "inForPerson.candidate.cv_cate_id": { $all: [cate] },
                "inForPerson.candidate.cv_city_id": { $all: [city] },
            });
        }

        const total = await functions.findCount(NewTV365, condition);
        return functions.success(res, "Lấy danh sách tin đăng thành công", { total, items: listPost });

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}