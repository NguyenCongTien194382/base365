const md5 = require('md5')

// Load models
const Users = require('../../models/Users')
const ManagerPointHistory = require('../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory')
const SaveVote = require('../../models/Timviec365/SaveVote')
const functions = require('../../services/functions')
const ApplyForJob = require('../../models/Timviec365/UserOnSite/Candicate/ApplyForJob')
const NewTV365 = require('../../models/Timviec365/UserOnSite/Company/New')
const SaveCandidate = require('../../models/Timviec365/UserOnSite/Company/SaveCandidate')
const PointCompany = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany')
const PointUsed = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointUsed')
const CompanyUnset = require('../../models/Timviec365/UserOnSite/Company/UserCompanyUnset')
const AdminUser = require('../../models/Timviec365/Admin/AdminUser')
const CategoryCompany = require('../../models/Timviec365/UserOnSite/Company/CategoryCompany')
const CV = require('../../models/Timviec365/CV/Cv365')
const TagBlog = require('../../models/Timviec365/Blog/TagBlog')
const CompanyStorage = require('../../models/Timviec365/UserOnSite/Company/Storage')
const PermissionNotify = require('../../models/Timviec365/PermissionNotify')
const TblBaoLuu = require('../../models/Timviec365/UserOnSite/Company/TblBaoLuu')
const mongoose = require('mongoose')
const CreditController = require('./credits')
const OrderDetails = require('../../models/Timviec365/OrderDetails')
const GhimHistory = require('../../models/Timviec365/UserOnSite/Company/GhimHistory')
const City = require('../../models/City')
const District = require('../../models/District')
const Order = require('../../models/Timviec365/Order')
const serviceNew = require('../../services/timviec365/new')
const CommentPost = require('../../models/Timviec365/UserOnSite/CommentPost')
const Keyword = require('../../models/Timviec365/UserOnSite/Company/Keywords')
const LikePost = require('../../models/Timviec365/UserOnSite/LikePost')
const { saveHistory } = require('./history/utils')
    // Load service
const service = require('../../services/timviec365/company')
const servicePermissionNotify = require('../../services/timviec365/PermissionNotify')
const sendMail = require('../../services/timviec365/sendMail')
const multer = require('multer')
const fs = require('fs')
const serviceCrm = require('../../services/timviec365/crm')
const { getMaxID } = require('./history/utils')
const serviceCompany = require('../../services/timviec365/company')
const serviceSendMess = require('../../services/timviec365/sendMess')
const sanitizeHtml = require('sanitize-html')
const axios = require('axios')

// Check email tồn tại
exports.checkExistEmail = async(req, res) => {
    try {
        const email = req.body.email
        if (email) {
            let checkEmail
            if (email.includes('@')) {
                checkEmail = await Users.findOne({
                    email: email,
                    type: 1,
                }).lean()
            } else {
                checkEmail = await Users.findOne({
                    phoneTK: email,
                    type: 1,
                }).lean()
            }
            if (!checkEmail) {
                return functions.success(res, 'Tài khoản có thể sử dụng để đăng ký')
            }
            return functions.setError(res, 'Tài khoản đã tồn tại.')
        }
        return functions.setError(res, 'Chưa truyền tài khoản')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// Check tên công ty
exports.checkExistName = async(req, res) => {
    try {
        const nameCompany = req.body.nameCompany
        if (nameCompany) {
            const company = await Users.findOne({
                userName: nameCompany,
                type: 1,
            }, {
                email: 1,
                phoneTK: 1,
            }).lean()
            if (!company) {
                return functions.success(res, 'Tên công ty có thể sử dụng để đăng ký', {
                    account: '',
                })
            }
            return functions.success(res, 'Tên công ty đã được sử dụng', {
                account: company.email != null ? company.email : company.phoneTK,
            })
        }
        return functions.setError(res, 'Chưa truyền tên công ty')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm đăng ký
exports.register = async(req, res, next) => {
    try {
        let request = req.body,
            phoneTK = request.phoneTK,
            password = request.password,
            username = request.usc_name,
            city = request.usc_city,
            district = request.usc_qh,
            address = request.usc_address,
            emailContact = request.email_contact,
            description = request.usc_mota || null,
            linkVideo = request.linkVideo,
            fromDevice = request.fromDevice,
            fromWeb = request.fromWeb,
            ipClient = req.body.ip || ''
            // check dữ liệu không bị undefined
        if (username && password && emailContact && phoneTK) {
            // validate email,phone
            let CheckEmail = await functions.checkEmail(emailContact),
                CheckPhoneNumber = await functions.checkPhoneNumber(phoneTK)

            if (CheckPhoneNumber && CheckEmail) {
                // check email co trong trong database hay khong
                let user = await functions.getDatafindOne(Users, {
                    phoneTK,
                    type: 1,
                })
                if (user == null) {
                    if (JSON.stringify(req.files) !== '{}') {
                        let totalSize = 0
                        const files = req.files.storage

                        // Chuyển đối tượng thành mảng
                        const storage = Object.keys(files).map((key) => files[key])

                        // Tính tổng dung lượng file tải lên
                        storage.forEach((file) => {
                            totalSize += file.size
                        })

                        if (totalSize > functions.MAX_STORAGE) {
                            return functions.setError(
                                res,
                                'Dung lượng file tải lên vượt quá 300MB'
                            )
                        }
                    }

                    // Lấy ID lĩnh vực
                    // const lvID = await service.recognition_tag_company(username, description);
                    const lvID = null

                    // Lấy ID kinh doanh sau khi được chia
                    const kd = await service.shareCompanyToAdmin()
                        // Lấy id mới nhất
                    const getMaxUserID = await functions.getMaxUserID('company')

                    const otp = Math.floor(Math.random() * 900000) + 100000

                    const data = {
                        _id: getMaxUserID._id,
                        phoneTK: phoneTK,
                        password: md5(password),
                        emailContact: emailContact,
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
                        chat365_secret: Buffer.from(getMaxUserID._id.toString()).toString(
                            'base64'
                        ),
                        inForCompany: {
                            scan: 1,
                            usc_kd: kd.adm_bophan,
                            usc_kd_first: kd.adm_bophan,
                            description: description,
                            timviec365: {
                                usc_lv: lvID,
                                usc_name: username,
                                usc_name_add: address,
                                usc_name_email: emailContact,
                                usc_type: 1,
                            },
                            cds: {
                                com_role_id: 1,
                            },
                        },
                    }

                    if (linkVideo) { 
                        data.usc_video = linkVideo
                        data.usc_video_type = 2
                    }
                    data.inForCompany.timviec365.usc_ip = ipClient
                    if (functions.isTestIp(ipClient)) {
                        data.inForCompany.timviec365.usc_test = 1
                    }

                    const company = new Users(data)
                    await company.save()

                    //Call api tạo tài khoản bên chat
                    axios({
                        method: 'post',
                        url: 'http://43.239.223.142:9000/api/users/insertAccount',
                        data: {
                            _id: data._id,
                            id365: data.idQLC,
                            type365: data.type,
                            email: data.phoneTK,
                            password: data.password,
                            userName: data.userName,
                            companyId: data.idQLC,
                            companyName: data.userName,
                            idTimViec: data.idTimViec365,
                            fromWeb: data.fromWeb,
                            secretCode: data.chat365_secret,
                        },
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }).catch((e) => {
                        console.log(e)
                    })

                    if (data.inForCompany.timviec365.usc_test != 1) {
                        // Lưu data vào base crm
                        const resoure = 3
                        const status = 12
                        const group = 456
                        const type_crm = 2
                        const link = service.rewrite_company(data.idTimViec365, data.alias)
                        await serviceCrm.addCustomer(
                            username,
                            emailContact,
                            phoneTK,
                            kd.emp_id,
                            data.idTimViec365,
                            resoure,
                            status,
                            group,
                            type_crm,
                            link
                        )

                        //Gửi data sang chat
                        serviceSendMess.registerCompany(data.idTimViec365)
                        serviceCompany.RegisterWork247(
                            data.phoneTK,
                            data.password,
                            data.userName,
                            data.alias,
                            data.emailContact,
                            data.createdAt,
                            data.updatedAt,
                            kd.adm_bophan
                        )
                    }

                    // Gửi mail kích hoạt
                    // sendMail.SendRegisterNTDAPP(email, username, otp);

                    // Xử lý upload hình ảnh vào kho nếu có
                    if (JSON.stringify(req.files) !== '{}') {
                        // Cập nhật ảnh đại diện
                        const avatarUser = req.files.avatarUser
                        const uploadLogo = service.uploadLogo(avatarUser)
                        await Users.updateOne({ _id: getMaxUserID._id }, {
                            $set: { avatarUser: uploadLogo.file_name },
                        })

                        // Xử lý hình ảnh vào kho
                        const files = req.files.storage

                        // Chuyển đối tượng thành mảng
                        const storage = Object.keys(files).map((key) => files[key])

                        let uploadStorage,
                            isUploadLogo = 0
                        for (let index = 0; index < storage.length; index++) {
                            let file = storage[index]

                            if (service.checkItemStorage(file.type)) {
                                if (service.isImage(file.type)) {
                                    uploadStorage = service.uploadStorage(
                                        getMaxUserID._idTV365,
                                        file,
                                        'image'
                                    )
                                    await service.addStorage(
                                        getMaxUserID._idTV365,
                                        'image',
                                        uploadStorage.file_name
                                    )
                                } else {
                                    uploadStorage = service.uploadStorage(
                                        getMaxUserID._idTV365,
                                        file,
                                        'video'
                                    )
                                    await service.addStorage(
                                        getMaxUserID._idTV365,
                                        'video',
                                        uploadStorage.file_name
                                    )
                                }
                            }
                        }
                    }

                    let companyUnset = await functions.getDatafindOne(CompanyUnset, {
                        phoneTK,
                    })
                    if (companyUnset != null) {
                        await functions.getDataDeleteOne(CompanyUnset, {
                            phoneTK,
                        })
                    }

                    // Lưu lại thông tin phân quyền
                    const listPermissions = request.listPermissions
                    servicePermissionNotify.HandlePermissionNotify(
                        getMaxUserID._idTV365,
                        listPermissions,
                        'company'
                    )

                    const token = await functions.createToken(data, '1d')
                    return functions.success(res, 'đăng ký thành công', {
                        access_token: token,
                        user_id: getMaxUserID._idTV365,
                        chat365_id: getMaxUserID._id,
                    })
                } else {
                    return functions.setError(res, 'SĐT đã tồn tại', 404)
                }
            } else {
                return functions.setError(
                    res,
                    'email hoặc số điện thoại định dạng không hợp lệ',
                    404
                )
            }
        } else {
            return functions.setError(res, 'Thiếu dữ liệu', 404)
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm dăng nhập
exports.login = async(req, res, next) => {
    try {
        // console.log("login", req.body);
        if (req.body.email && req.body.password) {
            const type = 1
            const id_chat = req.body.id_chat
            let email = req.body.email.replace(/\s/g, '')
            let password = req.body.password.replace(/\s/g, '')
            let password_type = req.body.password_type || 0

            if (id_chat && id_chat != 0) {
                const permission = await PermissionNotify.aggregate([{
                        $match: {
                            pn_type_noti: { $all: [1] },
                            pn_id_chat: id_chat,
                        },
                    },
                    { $limit: 1 },
                    {
                        $lookup: {
                            from: 'Users',
                            foreignField: 'idTimViec365',
                            localField: 'pn_usc_id',
                            as: 'user',
                        },
                    },
                    { $unwind: '$user' },
                    { $match: { 'user.type': 1 } },
                    {
                        $project: {
                            usc_email: '$user.email',
                            usc_phone_tk: '$user.phoneTK',
                            usc_pass: '$user.password',
                        },
                    },
                ])
                if (permission.length > 0) {
                    const rs_permission = permission[0]
                    email =
                        rs_permission.usc_email != '' ?
                        rs_permission.usc_email :
                        rs_permission.usc_phone_tk
                    password = rs_permission.usc_pass
                    password_type = 1
                }
            }

            password = password_type == 0 ? md5(password) : password
                // console.log(password);
            let checkPhoneNumber
            if (email.includes('@')) {
                checkPhoneNumber = await functions.checkEmail(email)
            } else {
                checkPhoneNumber = await functions.checkPhoneNumber(email)
            }
            if (checkPhoneNumber) {
                let findUser
                if (email.includes('@')) {
                    findUser = await functions.getDatafindOne(Users, {
                            email,
                            password,
                            type: 1,
                            idTimViec365: { $ne: 0 },
                        })
                        // try with no encode pass
                    if (!findUser) {
                        findUser = await functions.getDatafindOne(Users, {
                            email,
                            password: req.body.password,
                            type: 1,
                            idTimViec365: { $ne: 0 },
                        })
                        if (findUser) {
                            // update to md5 pass
                            await Users.updateOne({ _id: findUser._id }, { $set: { password: password } })
                            findUser = await functions.getDatafindOne(Users, {
                                email,
                                password,
                                type: 1,
                                idTimViec365: { $ne: 0 },
                            })
                        }
                    }
                } else {
                    findUser = await functions.getDatafindOne(Users, {
                            phoneTK: email,
                            password,
                            type: 1,
                            idTimViec365: { $ne: 0 },
                        })
                        // try with no encode pass
                    if (!findUser) {
                        findUser = await functions.getDatafindOne(Users, {
                            phoneTK: email,
                            password: req.body.password,
                            type: 1,
                            idTimViec365: { $ne: 0 },
                        })
                        if (findUser) {
                            // update to md5 pass
                            await Users.updateOne({ _id: findUser._id }, { $set: { password: password } })
                            findUser = await functions.getDatafindOne(Users, {
                                phoneTK: email,
                                password,
                                type: 1,
                                idTimViec365: { $ne: 0 },
                            })
                        }
                    }
                }
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
                                type: 1,
                            },
                            '1d'
                        )
                        const refreshToken = await functions.createToken({
                                userId: findUser._id,
                                createTime: functions.getTimeNow(),
                            },
                            '1d'
                        )
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
                            },
                        }
                        if (findUser.inForCompany) {
                            data.user_info.usc_name = findUser.inForCompany.userContactName
                            data.user_info.usc_name_add =
                                findUser.inForCompany.userContactAddress
                            data.user_info.usc_name_phone =
                                findUser.inForCompany.userContactPhone
                            data.user_info.usc_name_email =
                                findUser.inForCompany.userContactEmail
                        }
                        await Users.updateOne({ _id: findUser._id }, {
                                $set: {
                                    time_login: functions.getTimeNow(),
                                },
                            })
                            // Xử lý gửi data sang crm
                        service.saveLoginCrm(findUser.idTimViec365)

                        //Gửi data sang chat
                        serviceSendMess.login(findUser.idTimViec365)
                            // console.log("Data response", data)
                        return functions.success(res, 'Đăng nhập thành công', data)
                    }
                    return functions.setError(
                        res,
                        'tài khoản này không phải tài khoản công ty',
                        404
                    )
                }
                return functions.setError(res, 'Tài khoản hoặc mật khẩu không đúng')
                let checkPassword = await functions.verifyPassword(
                    password,
                    findUser.password
                )
                if (!checkPassword) {
                    return functions.setError(res, 'Mật khẩu sai', 404)
                }
            } else {
                return functions.setError(res, 'không đúng định dạng email', 404)
            }
        }
    } catch (error) {
        return functions.setError(res, error, 404)
    }
}

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
            regis = request.regis
        let maxID = (await functions.getMaxID(CompanyUnset)) || 1
        if (email != undefined) {
            // check email ,phone
            const ip = functions.get_client_ip(req)
            let checkPhone = await functions.checkPhoneNumber(phone)
            if (checkPhone && !functions.isTestIp(ip)) {
                let company = await CompanyUnset.findOne({ phone })
                const resoure = 3
                const status = 12
                const group = 454
                const type_crm = 2
                const crm_from = 'tv365_error'
                if (!company) {
                    let type = (Number(maxID) + 1) % 4
                    let usc_crm = 9
                    switch (type) {
                        case 0:
                            usc_crm = 9
                            break
                        case 1:
                            usc_crm = 2
                            break
                        case 2:
                            usc_crm = 11
                            break
                            // case 3:
                            //     usc_crm = 6;
                            //     break;
                        default:
                            usc_crm = 9
                            break
                    }
                    const dataUnset = {
                        _id: Number(maxID) + 1,
                        phone: phone,
                        nameCompany: nameCompany | null,
                        type: 1,
                        email: email,
                        city: city || null,
                        district: district || null,
                        address: address || null,
                        errTime: functions.getTimeNow(),
                        usc_crm: usc_crm,
                        regis: regis || 0,
                    }
                    const companyUnset = new CompanyUnset(dataUnset)
                    await companyUnset.save()

                    const kd = await AdminUser.findOne({
                            adm_bophan: usc_crm,
                        }, { emp_id: 1 })
                        // Lưu data vào base crm

                    await serviceCrm.addCustomer(
                        nameCompany,
                        email,
                        phone,
                        kd.emp_id,
                        dataUnset._id,
                        resoure,
                        status,
                        group,
                        type_crm,
                        '',
                        crm_from
                    )
                } else {
                    await CompanyUnset.updateOne({ _id: company._id }, {
                        $set: { errTime: functions.getTimeNow() },
                    })
                    await serviceCrm.editCustomer(
                        nameCompany,
                        email,
                        phone,
                        null,
                        group,
                        company._id,
                        crm_from
                    )
                }
                return functions.success(res, 'tạo thành công')
            } else {
                return functions.setError(
                    res,
                    'email hoặc số điện thoại không đúng định dạng'
                )
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
        let email = req.body.email
        if (email != undefined) {
            let checkEmail = await functions.checkEmail(email)
            if (checkEmail) {
                let user = await functions.getDatafindOne(Users, {
                    email,
                    type: 1,
                })
                if (user) {
                    let otp = await functions.randomNumber
                    await Users.updateOne({ _id: user._id }, {
                        $set: {
                            otp: otp,
                        },
                    })
                    await functions.sendEmailVerificationRequest(
                        otp,
                        email,
                        user.userName
                    )
                    return functions.success(res, 'Gửi mã OTP thành công')
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

// hàm kích hoạt tài khoản
exports.verify = async(req, res, next) => {
    try {
        let user = req.user.data
        let User = await Users.findOne({
            _id: user._id,
            authentic: 0,
        })
        if (User != null) {
            await Users.updateOne({ _id: User._id }, {
                $set: {
                    authentic: 1,
                },
            })
            return functions.success(res, 'xác thực thành công', {
                user_id: User.idTimViec365,
            })
        }
        return functions.setError(res, 'xác thực thất bại', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm bước 1 của quên mật khẩu
exports.forgotPasswordCheckMail = async(req, res, next) => {
    try {
        let email = req.body.email,
            otp = req.body.otp
        let checkEmail = await functions.checkEmail(email)

        if (checkEmail) {
            let user = await Users.findOne({ email: email, type: 1 })
            if (user) {
                await Users.updateOne({ _id: user._id }, {
                    $set: { otp: otp },
                })
                await sendMail.SendqmkNTDAPP(email, user.userName, otp)
                return functions.success(res, 'xác thực thành công', {
                    IdTv365: user.idTimViec365,
                })
            }
            return functions.setError(res, 'email không đúng', 404)
        } else {
            let user = await Users.findOne({ phoneTK: email, type: 1 }).lean()
            if (user) {
                await Users.updateOne({ _id: user._id }, {
                        $set: { otp: otp },
                    })
                    //await sendMail.SendqmkNTDAPP(email, user.userName, otp);
                return functions.success(res, 'xác thực thành công', {
                    IdTv365: user.idTimViec365,
                })
            }
            return functions.setError(res, 'sdt không đúng', 404)
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
            otp = req.body.otp
        if (otp) {
            let user = await Users.findOne({
                idTimViec365: idTv365,
                otp: otp,
                type: 1,
            })
            if (user) {
                const obj = {
                    otp: user.otp,
                    idTv365: idTv365,
                    type: user.type,
                }
                const base64 = Buffer.from(JSON.stringify(obj)).toString('base64')
                return functions.success(res, 'xác thực thành công', {
                    base64,
                })
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
            password = req.body.password
        if (password) {
            await Users.updateOne({ email: email, type: 1 }, {
                $set: {
                    password: md5(password),
                },
            })
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
        const user = req.user.data
        let companyID = user._id,
            idTimViec365 = user.idTimViec365,
            request = req.body,
            phone = request.phone,
            userCompany = request.name,
            city = request.city,
            district = request.usc_qh,
            address = request.address,
            emailContact = request.emailContact,
            description = request.gt,
            mst = request.thue,
            tagLinhVuc = request.tagLinhVuc,
            usc_video_link = request.usc_video_link,
            check_chat = request.check_chat,
            usc_images = request.usc_images,
            usc_manager = request.usc_manager,
            usc_skype = request.usc_skype,
            usc_zalo = request.usc_zalo,
            usc_website = request.usc_website,
            usc_name = request.usc_name,
            usc_name_add = request.usc_name_add,
            usc_name_phone = request.usc_name_phone,
            usc_name_email = request.usc_name_email,
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
            usc_branches_delete = request.usc_branches_delete

        if (phone && userCompany && city && district && address) {
            let checkPhone = await functions.checkPhoneNumber(phone)
            const now = functions.getTimeNow()
            if (checkPhone) {
                let dataUpdate = {
                    'inForCompany.description': description,
                    userName: userCompany,
                    phone: phone,
                    city: city,
                    emailContact: emailContact,
                    district: district,
                    address: address,
                    'inForCompany.timviec365.usc_mst': mst || null,
                    'inForCompany.timviec365.usc_lv': tagLinhVuc,
                    'inForCompany.timviec365.usc_images': usc_images,
                    'inForCompany.timviec365.usc_manager': usc_manager,
                    'inForCompany.timviec365.usc_skype': usc_skype,
                    'inForCompany.timviec365.usc_zalo': usc_zalo,
                    'inForCompany.timviec365.usc_website': usc_website,
                    'inForCompany.timviec365.usc_size': usc_size,
                    'inForCompany.timviec365.usc_name': usc_name,
                    'inForCompany.timviec365.usc_name_add': usc_name_add,
                    'inForCompany.timviec365.usc_name_phone': usc_name_phone,
                    'inForCompany.timviec365.usc_name_email': usc_name_email,
                }

                let pull = {}
                let push = {}

                if (usc_video_link) {
                    dataUpdate['inForCompany.timviec365.usc_video'] = usc_video_link
                    dataUpdate['inForCompany.timviec365.usc_video_type'] = 2
                } else {
                    dataUpdate['inForCompany.timviec365.usc_video'] = ''
                    dataUpdate['inForCompany.timviec365.usc_video_type'] = 1
                }

                if (usc_founded_time) {
                    dataUpdate['inForCompany.timviec365.usc_founded_time'] =
                        usc_founded_time
                }

                let Files = req.files || null
                if (Files && Files.usc_license) {
                    let license = await functions.uploadLicense(
                        idTimViec365,
                        Files.usc_license
                    )
                    dataUpdate['inForCompany.timviec365.usc_license'] = license
                    dataUpdate['inForCompany.timviec365.usc_active_license'] = 0
                }
                if (usc_branches_delete)
                    usc_branches_delete = JSON.parse(usc_branches_delete)
                if (usc_branches_add) usc_branches_add = JSON.parse(usc_branches_add)
                if (usc_branches_edit) usc_branches_edit = JSON.parse(usc_branches_edit)

                if (usc_branches_delete && usc_branches_delete.length) {
                    if (typeof usc_branches_delete === 'string') {
                        //Trong trường hợp chỉ có 1 giá trị id
                        usc_branches_delete = [usc_branches_delete]
                    }
                    pull['inForCompany.timviec365.usc_branches'] = {
                        _id: { $in: [...usc_branches_delete] },
                    }
                }

                if (usc_branches_add && usc_branches_add.length) {
                    //Map lại để lọc trường, tránh việc thêm sai trường
                    push['inForCompany.timviec365.usc_branches'] = {
                        $each: usc_branches_add.map((data) => ({
                            usc_branch_cit: data.usc_branch_cit,
                            usc_branch_qh: data.usc_branch_qh,
                            usc_branch_address: data.usc_branch_address,
                            usc_branch_time: functions.getTimeNow(),
                        })),
                    }
                }

                if (usc_branches_edit && usc_branches_edit.length) {
                    let promises = []
                    usc_branches_edit.forEach((payload) => {
                            if (payload._id) {
                                promises.push(
                                    Users.updateOne({
                                        _id: companyID,
                                        'inForCompany.timviec365.usc_branches._id': payload._id,
                                    }, {
                                        $set: {
                                            'inForCompany.timviec365.usc_branches.$.usc_branch_cit': payload.usc_branch_cit,
                                            'inForCompany.timviec365.usc_branches.$.usc_branch_qh': payload.usc_branch_qh,
                                            'inForCompany.timviec365.usc_branches.$.usc_branch_address': payload.usc_branch_address,
                                        },
                                    })
                                )
                            }
                        })
                        //
                    await Promise.all(promises)
                }
                await Users.updateOne({ _id: companyID }, {
                    $set: dataUpdate,
                    $pull: pull,
                })
                await Users.updateOne({ _id: companyID }, {
                    $push: push,
                })

                // Cập nhật quyền
                const list_permission = req.body.list_permission
                if (
                    list_permission &&
                    list_permission != '' &&
                    list_permission.length > 0
                ) {
                    const array_list_permission = JSON.parse(list_permission)
                    for (let i = 0; i < array_list_permission.length; i++) {
                        const element = array_list_permission[i]
                        const id_chat_pq = element.arr_id_chat

                        const id_thongbao = element.arr_id_ltbao.toString()
                        for (let j = 0; j < id_chat_pq.length; j++) {
                            const id_chat = id_chat_pq[j]

                            const checkNotify = await PermissionNotify.findOne({
                                pn_usc_id: idTimViec365,
                                pn_id_chat: id_chat,
                                pn_id_new: 0,
                            })

                            if (checkNotify) {
                                await PermissionNotify.updateOne({
                                    pn_usc_id: idTimViec365,
                                    pn_id_chat: id_chat,
                                    pn_id_new: 0,
                                }, {
                                    $set: {
                                        pn_type_noti: id_thongbao,
                                        pn_created_at: now,
                                    },
                                })
                            } else {
                                if (id_thongbao) {
                                    const maxID = await PermissionNotify.findOne({}, { pn_id: 1 })
                                        .sort({ pn_id: -1 })
                                        .lean()
                                    const item = new PermissionNotify({
                                        pn_id: Number(maxID.pn_id) + 1,
                                        pn_usc_id: idTimViec365,
                                        pn_id_chat: id_chat,
                                        pn_type_noti: id_thongbao,
                                        pn_created_at: now,
                                    })
                                    await item.save()
                                }
                            }
                        }
                    }
                }

                // Xóa các quyền bị loại bỏ
                const list_permission_rm = req.body.list_permission_rm
                if (list_permission_rm && list_permission_rm != '') {
                    const array_list_permission_rm = list_permission_rm
                        .split(',')
                        .map(Number)
                    for (let k = 0; k < array_list_permission_rm.length; k++) {
                        const pn_id_chat = array_list_permission_rm[k]
                        await PermissionNotify.deleteOne({
                            pn_usc_id: idTimViec365,
                            pn_id_chat: pn_id_chat,
                            pn_id_new: 0,
                        })
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
            userContactEmail = req.body.email_lh

        if (
            userContactAddress &&
            userContactEmail &&
            userContactName &&
            userContactPhone
        ) {
            let checkPhone = await functions.checkPhoneNumber(userContactPhone)
            let checkEmail = await functions.checkEmail(userContactEmail)

            if (checkEmail && checkPhone) {
                let user = await functions.getDatafindOne(Users, {
                    email: email,
                    type: 1,
                })

                if (user != null) {
                    await Users.updateOne({ email: email, type: 1 }, {
                        $set: {
                            'inForCompany.userContactName': userContactName,
                            'inForCompany.userContactPhone': userContactPhone,
                            'inForCompany.userContactAddress': userContactAddress,
                            'inForCompany.userContactEmail': userContactEmail,
                        },
                    })
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
        const user = req.user.data
        const com_id = user.idTimViec365
            // Xử lý upload hình ảnh vào kho nếu có
        if (JSON.stringify(req.files) !== '{}') {
            // Xử lý hình ảnh vào kho
            const storage = req.files.storage

            let uploadStorage,
                isUploadLogo = 0
            for (let index = 0; index < storage.length; index++) {
                file = storage[index]

                if (service.checkItemStorage(file.type)) {
                    if (service.isImage(file.type)) {
                        uploadStorage = service.uploadStorage(
                            com_id,
                            file,
                            'image',
                            user.createdAt
                        )
                        await service.addStorage(com_id, 'image', uploadStorage.file_name)
                    } else {
                        uploadStorage = service.uploadStorage(
                            com_id,
                            file,
                            'video',
                            user.createdAt
                        )
                        await service.addStorage(com_id, 'video', uploadStorage.file_name)
                    }
                }
            }
        }

        return functions.setError(res, 'Chưa truyền file để tải')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm bước 2  đổi mật khẩu
exports.changePasswordCheckOTP = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let id = req.user.data._id
        let otp = req.body.otp
        if (otp) {
            let verify = await Users.findOne({ _id: id, otp, type: 1 })
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
        let id = req.user.data._id
        let password = req.body.password
        if (password) {
            await Users.updateOne({ _id: id, type: 1 }, {
                $set: {
                    password: md5(password),
                },
            })
            return functions.success(res, 'đổi mật khẩu thành công')
        }
        return functions.setError(res, 'thiếu mật khẩu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập avatar
exports.uploadAvatar = async(req, res, next) => {
    try {
        let user = req.user.data,
            file = req.files,
            avatarUser = req.body.avatarUser
        if (file && file.avatarUser) {
            avatarUser = service.uploadLogo(file.avatarUser, user.createdAt)
            if (avatarUser) {
                await Users.updateOne({ _id: user._id, type: 1 }, {
                    $set: {
                        avatarUser: avatarUser.file_name,
                    },
                })
                return functions.success(res, 'thay đổi ảnh thành công')
            }
            return functions.setError(res, 'Có lỗi trong khi upload ảnh đại diện')
        } else {
            if (avatarUser) {
                await service.copyImageInStorageToAvatar(user.createdAt, avatarUser)
                await Users.updateOne({ _id: user._id, type: 1 }, {
                    $set: {
                        avatarUser: avatarUser,
                    },
                })
                return functions.success(res, 'thay đổi ảnh thành công')
            }
        }
        return functions.setError(res, 'Chưa upload ảnh đại diện')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy dữ liệu thông tin cập nhập
exports.getDataCompany = async(req, res, next) => {
    try {
        let id = req.user.data.idTimViec365
        let user = await functions.getDatafindOne(Users, {
            idTimViec365: id,
            type: 1,
        })
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
            type = req.body.type || 'tuungtuyen'
        let match = {
                nhs_com_id: idCompany,
                nhs_kq: { $in: [0, 2, 13] },
            },
            lookUpUser = {
                from: 'Users',
                localField: 'nhs_use_id',
                foreignField: 'idTimViec365',
                as: 'user',
            },
            matchUser = {
                'user.type': 0,
            },
            lookUpNewTv365 = {
                from: 'NewTV365',
                localField: 'nhs_new_id',
                foreignField: 'new_id',
                as: 'new',
            }
        if (type != 'tuungtuyen') {
            match.nhs_kq = { $in: [10, 11, 12, 14] }
        }
        if (nhs_new_id && nhs_new_id != 0) {
            match.nhs_new_id = Number(nhs_new_id)
        }
        if (nhs_kq && nhs_kq != 0) {
            match.nhs_kq = Number(nhs_kq)
        }

        let total = 0
        const list = await ApplyForJob.aggregate([{
                $match: match,
            },
            { $lookup: lookUpUser },
            { $unwind: '$user' },
            { $match: matchUser },
            { $lookup: lookUpNewTv365 },
            { $unwind: '$new' },
            { $sort: { nhs_id: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    use_id: '$user.idTimViec365',
                    use_first_name: '$user.userName',
                    use_email: '$user.email',
                    use_logo: '$user.avatarUser',
                    use_create_time: '$user.createdAt',
                    use_address: '$user.address',
                    use_gioi_tinh: '$user.inForPerson.account.gender',
                    cv_exp: '$user.inForPerson.account.experience',
                    chat365_id: '$user.chat365_id',
                    new_id: '$new.new_id',
                    new_title: '$new.new_title',
                    new_alias: '$new.new_alias',
                    nhs_time: 1,
                    nhs_kq: 1,
                    nhs_id: 1,
                    nhs_time_pv: 1,
                    nhs_text: 1,
                    nhs_thuungtuyen: 1,
                },
            },
        ])
        if (list.length > 0) {
            list.forEach((user) => {
                user.use_logo =
                    functions.cdnImageAvatar(Number(user.use_create_time) * 1000) +
                    user.use_logo
            })
            let countUv = await ApplyForJob.aggregate([{
                    $match: match,
                },
                {
                    $lookup: lookUpUser,
                },
                {
                    $unwind: '$user',
                },
                {
                    $match: matchUser,
                },
                {
                    $lookup: lookUpNewTv365,
                },
                {
                    $unwind: '$new',
                },
                {
                    $count: 'total',
                },
            ])
            if (countUv.length > 0) {
                total = countUv[0].total
            }
        }
        return functions.success(res, 'Lấy danh sách uv thành công', {
            items: list,
            total: total,
        })
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.listJobByToken = async(req, res) => {
    try {
        const userID = req.user.data.idTimViec365
        const list = await NewTV365.find({
            new_user_id: userID,
            new_md5: null,
        }).select('new_id new_title')
        return functions.success(res, 'Lấy danh sách uv thành công', {
            items: list,
        })
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.update_uvut = async(req, res) => {
    try {
        let { nhs_id, nhs_kq, nhs_time_pv, nhs_time_tvs, nhs_time_tve, nhs_text } =
        req.body
        if (nhs_id) {
            let data = {}
            if (nhs_kq) {
                data.nhs_kq = nhs_kq
            }
            if (nhs_time_pv) {
                data.nhs_time_pv = nhs_time_pv
            }
            if (nhs_time_tvs) {
                data.nhs_time_tvs = nhs_time_tvs
            }
            if (nhs_time_tve) {
                data.nhs_time_tve = nhs_time_tve
            }
            if (nhs_text) {
                data.nhs_text = nhs_text
            }
            await ApplyForJob.updateOne({ nhs_id: nhs_id }, {
                $set: data,
            })
            return functions.success(res, 'Cập nhật thành công')
        }
        return functions.setError(res, 'Chưa truyền id')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.delete_hsut = async(req, res) => {
    try {
        let nhs_id = req.body.nhs_id
        if (nhs_id) {
            const list = nhs_id.split(',').map(Number)
            await ApplyForJob.deleteMany({ nhs_id: { $in: list } })
            return functions.success(res, 'Cập nhật thành công')
        }
        return functions.setError(res, 'Chưa truyền id')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy dữ liệu danh sách ứng tuyển của chuyên viên gửi
exports.listUVApplyJobStaff = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365
        let page = Number(req.body.start)
        let pageSize = Number(req.body.curent)
        if (page && pageSize) {
            const skip = (page - 1) * pageSize
            const limit = pageSize
            let findUV = await functions.pageFind(
                ApplyForJob, { userID: idCompany, type: 2 }, { _id: -1 },
                skip,
                limit
            )
            const totalCount = await functions.findCount(ApplyForJob, {
                userID: idCompany,
                type: 2,
            })
            const totalPages = Math.ceil(totalCount / pageSize)
            if (findUV) {
                return functions.success(res, 'Lấy danh sách uv thành công', {
                    totalCount,
                    totalPages,
                    listUv: findUV,
                })
            }
            return functions.setError(res, 'không lấy được danh sách', 404)
        } else {
            let findUV = await functions.getDatafind(ApplyForJob, {
                userID: idCompany,
                type: 2,
            })
            return functions.success(res, 'Lấy danh sách uv thành công', findUV)
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm thống kê tin đăng
exports.postStatistics = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365
        const now = new Date()
        let startOfDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0,
            0,
            0
        )
        let endOfDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23,
            59,
            59,
            999
        )
        let threeDaysTomorow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
            // count UV ứng tuyển
        let countApplyForJobTypeOne = await functions.findCount(ApplyForJob, {
                userID: idCompany,
                type: 1,
            })
            // count cọng tác viên gửi Uv
        let countApplyForJobTypeTwo = await functions.findCount(ApplyForJob, {
                userID: idCompany,
                type: 2,
            })
            // count việc còn hạn
        let countAvailableJobs = await functions.findCount(NewTV365, {
                userID: idCompany,
                hanNop: { $gt: now },
            })
            // count việc hết hạn
        let countGetExpiredJobs = await functions.findCount(NewTV365, {
                userID: idCompany,
                hanNop: { $lt: now },
            })
            // count tin đã đăng trong ngày
        let countPostsInDay = await functions.findCount(NewTV365, {
                userID: idCompany,
                createTime: { $gte: startOfDay, $lte: endOfDay },
            })
            // count tin đã cập nhập trong ngày
        let countRefreshPostInDay = await functions.findCount(NewTV365, {
                userID: idCompany,
                updateTime: { $gte: startOfDay, $lte: endOfDay },
            })
            // count tin gần hết hạn
        let countJobsNearExpiration = await functions.findCount(NewTV365, {
            userID: idCompany,
            hanNop: { $lte: threeDaysTomorow, $gte: now },
        })
        let count = {
            count_uv_ung_tuyen: countApplyForJobTypeOne,
            count_ctv_gui_uv: countApplyForJobTypeTwo,
            count_tin_dang_con_han: countAvailableJobs,
            count_tin_dang_het_han: countGetExpiredJobs,
            count_tin_dang_trong_ngay: countPostsInDay,
            count_tin_cap_nhap_trong_ngay: countRefreshPostInDay,
            count_tin_sap_het_han: countJobsNearExpiration,
        }
        return functions.success(res, 'lấy số lượng thành công', count)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy danh sách các ứng viên đã lưu
exports.listSaveUV = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365
        let page = Number(req.body.page) || 1
        let pageSize = Number(req.body.pageSize) || 10
        const skip = (page - 1) * pageSize
        const limit = pageSize

        const list = await SaveCandidate.aggregate([{
                    $match: {
                        usc_id: Number(idCompany),
                    },
                },
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'use_id',
                        foreignField: 'idTimViec365',
                        as: 'user',
                    },
                },
                { $unwind: '$user' },
                { $match: { 'user.type': 0 } },
                { $sort: { id: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        use_id: '$user.idTimViec365',
                        use_first_name: '$user.userName',
                        use_email: '$user.email',
                        use_logo: '$user.avatarUser',
                        use_create_time: '$user.createdAt',
                        use_address: '$user.address',
                        use_gioi_tinh: '$user.inForPerson.account.gender',
                        use_view: '$user.inForPerson.candidate.use_view',
                        cv_title: '$user.inForPerson.candidate.cv_title',
                        cv_exp: '$user.inForPerson.account.experience',
                        chat365_id: '$user.chat365_id',
                        save_time: 1,
                    },
                },
            ])
            //Thêm trường avatar cho user
        list.forEach((user) => {
                user.use_logo =
                    functions.cdnImageAvatar(Number(user.use_create_time) * 1000) +
                    user.use_logo
            })
            // let findUV = await functions.pageFind(SaveCandidate, { uscID: idCompany }, { _id: -1 }, skip, limit);
        const totalCount = await functions.findCount(SaveCandidate, {
            usc_id: Number(idCompany),
        })
        return functions.success(res, 'Lấy danh sách uv thành công', {
            total: totalCount,
            items: list,
        })
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm quản lý điểm
exports.manageFilterPoint = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365
        let point = await functions.getDatafindOne(PointCompany, {
            uscID: idCompany,
            type: 1,
        })
        let now = new Date()
        let pointUSC = 0
            // let checkReset0 = await functions.getDatafindOne(PointCompany, { uscID: idCompany, type: 1, dayResetPoint0: { $lt: now } });
            // if (checkReset0 == null) {
            //     pointUSC = point.pointCompany
            // }
        return functions.success(res, 'lấy số lượng thành công', {
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
        let idCompany = req.user.data.idTimViec365
        let idUser = req.body.useID ? req.body.useID : req.body.idchat
        let type_payment = req.body.type_payment ? req.body.type_payment : 0
        type_payment = Number(type_payment)
        if (idUser) {
            const candidate = await Users.findOne({
                idTimViec365: idUser,
            }).select('userName idTimViec365')
            if (!candidate)
                return functions.setError(res, 'Ứng viên không tồn tại', 200)
                    // Kiểm tra xem đã mất điểm hay chưa
            const checkUsePoint = await functions.getDatafindOne(PointUsed, {
                    usc_id: idCompany,
                    use_id: idUser,
                    return_point: 0, // chưa hoàn điểm
                })
                // console.log("seenUVWithPoint", "checkUsePoint", checkUsePoint)
                // Nếu chưa mất điểm thì xử lý
            if (!checkUsePoint) {
                // point - money
                // Lấy điểm hiện tại của ntd xem còn điểm không
                let companyPoint = await functions.getDatafindOne(PointCompany, {
                    usc_id: idCompany,
                })
                if (companyPoint) {
                    //Luồng xử lý điểm
                    if (type_payment === 0) {
                        let pointUSC = companyPoint.point_usc
                        if (pointUSC > 0) {
                            pointUSC = pointUSC - 1
                            await PointCompany.updateOne({ usc_id: idCompany }, {
                                $set: {
                                    point_usc: pointUSC,
                                },
                            })
                            const pointUsed = new PointUsed({
                                usc_id: idCompany,
                                use_id: idUser,
                                point: 1,
                                type: 1,
                                used_day: functions.getTimeNow(),
                                check_from: 1,
                            })
                            await pointUsed.save()
                            return functions.success(res, 'Mở điểm ứng viên thành công')
                        }
                        return functions.setError(res, 'Bạn đã hết điểm để sử dụng', 200)
                    } else if (type_payment === 1) {
                        let money_usc = companyPoint.money_usc
                        const _price = 200000
                        if (money_usc >= _price) {
                            await CreditController.useCreditsHandler(
                                idCompany,
                                _price,
                                1,
                                candidate.userName,
                                candidate.idTimViec365
                            )
                            const pointUsed = new PointUsed({
                                usc_id: idCompany,
                                use_id: idUser,
                                money: _price,
                                type: 1,
                                //Kiểu thanh toán: 1: Tiền, mặc định là 0: Điểm
                                type_payment: 1,
                                used_day: functions.getTimeNow(),
                                check_from: 1,
                            })
                            await pointUsed.save()

                            return functions.success(res, 'Mở điểm ứng viên thành công')
                        }
                        return functions.setError(res, 'Bạn đã hết tiền để sử dụng', 200)
                    } else {
                        return functions.setError(
                            res,
                            'Không tồn tại phương thức thanh toán này!',
                            200
                        )
                    }
                }
                return functions.setError(res, 'nhà tuyển dụng không có điểm', 200)
            }
            return functions.setError(res, 'Ứng viên này đã được xem thông tin')
        }
        return functions.setError(res, 'không có dữ liệu')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.seenUVWithPointV2 = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365
        let idUser = req.body.useID ? req.body.useID : req.body.idchat
        let type_payment = req.body.type_payment ? req.body.type_payment : 0
        type_payment = Number(type_payment)
        let point = req.body.point ? Number(req.body.point) : 0
        let type_chat = req.body.type_chat
        type_chat = type_chat == '1' ? 1 : 2
        if (type_payment === 1) point = point * 200000
        if (idUser) {
            const candidate = await Users.findOne({
                idTimViec365: idUser,
                type: { $ne: 1 },
            }).lean()

            if (!candidate)
                return functions.setError(res, 'Ứng viên không tồn tại', 200)
                    // Kiểm tra xem đã mất điểm hay chưa
            const checkUsePoint = await functions.getDatafindOne(PointUsed, {
                    usc_id: idCompany,
                    use_id: idUser,
                    return_point: 0, // chưa hoàn điểm
                })
                // console.log("seenUVWithPoint", "checkUsePoint", checkUsePoint)
                // Nếu chưa mất điểm thì xử lý
            if (
                type_payment === 0 &&
                checkUsePoint &&
                type_chat !== 1 &&
                checkUsePoint.type_chat === 1
            ) {
                const oldPoint = checkUsePoint.point
                const newPoint = point - oldPoint
                if (newPoint === 0)
                    return functions.setError(res, 'Ứng viên này đã được xem thông tin')
                let companyPoint = await functions.getDatafindOne(PointCompany, {
                    usc_id: idCompany,
                })
                let pointUSC = companyPoint.point_usc
                if (pointUSC > 0) {
                    pointUSC = pointUSC - newPoint
                    await PointCompany.updateOne({ usc_id: idCompany }, {
                        $set: {
                            point_usc: pointUSC,
                        },
                    })
                    await PointUsed.updateOne({
                        usc_id: idCompany,
                        use_id: idUser,
                    }, {
                        point: point,
                        type_chat,
                        used_day: functions.getTimeNow(),
                    })
                    return functions.success(res, 'Mở điểm ứng viên thành công')
                }
                return functions.setError(res, 'Bạn đã hết điểm để sử dụng', 200)
            }
            if (
                type_payment === 1 &&
                checkUsePoint &&
                type_chat !== 1 &&
                checkUsePoint.type_chat === 1
            ) {
                const oldMoney = checkUsePoint.money
                const newMoney = point - oldMoney
                if (newMoney === 0)
                    return functions.setError(res, 'Ứng viên này đã được xem thông tin')
                let companyPoint = await functions.getDatafindOne(PointCompany, {
                    usc_id: idCompany,
                })
                let money_usc = companyPoint.money_usc
                if (money_usc >= newMoney) {
                    money_usc = money_usc - newMoney
                    await PointCompany.updateOne({ usc_id: idCompany }, {
                        $set: {
                            money_usc: money_usc,
                        },
                    })
                    await PointUsed.updateOne({
                        usc_id: idCompany,
                        use_id: idUser,
                    }, {
                        money: point,
                        type_chat,
                        used_day: functions.getTimeNow(),
                    })
                    return functions.success(res, 'Mở điểm ứng viên thành công')
                }
                return functions.setError(res, 'Bạn đã hết tiền để sử dụng', 200)
            }
            if (!checkUsePoint) {
                // point - money
                // Lấy điểm hiện tại của ntd xem còn điểm không
                let companyPoint = await functions.getDatafindOne(PointCompany, {
                    usc_id: idCompany,
                })
                if (companyPoint) {
                    //Luồng xử lý điểm
                    if (type_payment === 0) {
                        let pointUSC = companyPoint.point_usc
                        if (pointUSC > 0) {
                            pointUSC = pointUSC - point
                            await PointCompany.updateOne({ usc_id: idCompany }, {
                                $set: {
                                    point_usc: pointUSC,
                                },
                            })
                            const pointUsed = new PointUsed({
                                usc_id: idCompany,
                                use_id: idUser,
                                point: point,
                                type: 1,
                                used_day: functions.getTimeNow(),
                                check_from: 1,
                                type_chat,
                            })
                            await pointUsed.save()
                            if (pointUSC <= 0 || idCompany == 236250) {
                                const company = await Users.findOne({
                                    idTimViec365: idCompany,
                                    type: 1,
                                }).lean()
                                let dataNotiChat = {
                                    Title: 'NTD hết điểm lọc hồ sơ trên Timviec365.vn',
                                    Message: company.userName,
                                    Type: 'NTD',
                                    UserId: company._id,
                                    SenderId: 58384,
                                    Link: 'https://timviec365.vn/thong-tin-bang-gia.html',
                                }
                                let response = await serviceSendMess.SendNotification(
                                        dataNotiChat
                                    )
                                    // console.log(dataNotiChat);
                                    // console.log(response);
                                    //Gửi thông báo đến tài khoản phân quyền
                                let listUserPm = await PermissionNotify.find({
                                    pn_usc_id: idCompany,
                                    pn_id_new: 0,
                                })
                                for (key in listUserPm) {
                                    let permissionData = listUserPm[key]
                                    let listPermissions = permissionData.pn_type_noti.split(',')
                                    if (listPermissions.indexOf('7')) {
                                        dataNotiChat.UserId = permissionData.pn_id_chat
                                        let response = await serviceSendMess.SendNotification(
                                            dataNotiChat
                                        )
                                        console.log(response.data)
                                    }
                                }
                            }

                            return functions.success(res, 'Mở điểm ứng viên thành công')
                        }
                        return functions.setError(res, 'Bạn đã hết điểm để sử dụng', 200)
                    } else if (type_payment === 1) {
                        let money_usc = companyPoint.money_usc
                        if (money_usc >= point) {
                            money_usc = money_usc - point
                            await PointCompany.updateOne({ usc_id: idCompany }, {
                                $set: {
                                    money_usc: money_usc,
                                },
                            })
                            const pointUsed = new PointUsed({
                                usc_id: idCompany,
                                use_id: idUser,
                                money: point,
                                type_payment: 1,
                                type: 1,
                                used_day: functions.getTimeNow(),
                                check_from: 1,
                                type_chat,
                            })
                            await pointUsed.save()
                            return functions.success(res, 'Mở điểm ứng viên thành công')
                        }
                        return functions.setError(res, 'Bạn đã hết tiền để sử dụng', 200)
                    } else {
                        return functions.setError(
                            res,
                            'Không tồn tại phương thức thanh toán này!',
                            200
                        )
                    }
                }
                return functions.setError(res, 'nhà tuyển dụng không có điểm', 200)
            }
            return functions.setError(res, 'Ứng viên này đã được xem thông tin')
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
            description = req.user.data.inForCompany.description
        if (request) {
            let company = await functions.getDatafindOne(UserCompanyMultit, {
                uscID: idCompany,
            })
            if (company) {
                await UserCompanyMultit.updateOne({ uscID: idCompany }, {
                    $set: {
                        dgc: request,
                        dgTime: new Date().getTime(),
                    },
                })
                return functions.success(res, 'Cập nhập thành công')
            } else {
                let maxID = (await functions.getMaxID(UserCompanyMultit)) || 0
                const feedBack = new UserCompanyMultit({
                    _id: maxID,
                    uscID: idCompany,
                    companyInfo: description,
                    dgc: request,
                    dgTime: new Date().getTime(),
                })
                await feedBack.save()
                return functions.success(res, 'tạo thành công')
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
            description = req.user.data.inForCompany.description
        if (request) {
            let company = await functions.getDatafindOne(UserCompanyMultit, {
                uscID: idCompany,
            })
            if (company) {
                await UserCompanyMultit.updateOne({ uscID: idCompany }, {
                    $set: {
                        dgtv: request,
                        dgTime: new Date().getTime(),
                    },
                })
                return functions.success(res, 'Cập nhập thành công')
            } else {
                let maxID = (await functions.getMaxID(UserCompanyMultit)) || 0
                const feedBack = new UserCompanyMultit({
                    _id: maxID,
                    uscID: idCompany,
                    companyInfo: description,
                    dgtv: request,
                    dgTime: new Date().getTime(),
                })
                await feedBack.save()
                return functions.success(res, 'tạo thành công')
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
        let idCompany = req.user.data.idTimViec365
        let khoAnh = await functions.getDatafindOne(Users, {
            idTimViec365: idCompany,
            type: 1,
        })
        if (khoAnh) {
            let data = {
                listImgs: khoAnh.inForCompany.comImages,
                listVideos: khoAnh.inForCompany.comVideos,
            }
            return functions.success(res, 'lấy dữ liệu thành công thành công', {
                data,
            })
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
        let idCompany = req.user.data.idTimViec365
        let img = req.files
        let imageMoment = 0
        let sizeImg = 0
        let user = await functions.getDatafindOne(Users, {
            idTimViec365: idCompany,
            type: 1,
        })
        if (user) {
            let listImg = user.inForCompany.comImages
            let listVideo = user.inForCompany.comVideos
            const listMedia = [...listImg, ...listVideo]
            for (let i = 0; i < listMedia.length; i++) {
                imageMoment += listMedia[i].size
            }
            if (imageMoment < functions.MAX_Kho_Anh) {
                if (img) {
                    for (let i = 0; i < img.length; i++) {
                        sizeImg += img[i].size
                    }
                    if (Number(sizeImg) + Number(imageMoment) <= functions.MAX_Kho_Anh) {
                        for (let i = 0; i < img.length; i++) {
                            let checkImg = await functions.checkImage(img[i].path)
                            if (checkImg) {
                                let id = listImg[listImg.length - 1] || 0
                                let newID = id._id || 0
                                listImg.push({
                                    _id: Number(newID) + 1,
                                    name: img[i].filename,
                                    size: img[i].size,
                                })
                            } else {
                                if (img) {
                                    for (let i = 0; i < img.length; i++) {
                                        await functions.deleteImg(img[i])
                                    }
                                }
                                return functions.setError(
                                    res,
                                    'sai định dạng ảnh hoặc ảnh lớn hơn 2MB',
                                    404
                                )
                            }
                        }
                        await Users.updateOne({ idTimViec365: idCompany, type: 1 }, {
                            $set: { 'inForCompany.comImages': listImg },
                        })
                        return functions.success(res, 'thêm ảnh thành công')
                    } else {
                        if (img) {
                            for (let i = 0; i < img.length; i++) {
                                await functions.deleteImg(img[i])
                            }
                        }
                        return functions.setError(
                            res,
                            'ảnh thêm vào đã quá dung lượng của kho',
                            404
                        )
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
        let idCompany = req.user.data.idTimViec365
        let video = req.files
        let imageMoment = 0
        let sizeVideo = 0
        let user = await functions.getDatafindOne(Users, {
            idTimViec365: idCompany,
            type: 1,
        })
        if (user) {
            let listImg = user.inForCompany.comImages
            let listVideo = user.inForCompany.comVideos
            const listMedia = [...listImg, ...listVideo]
            for (let i = 0; i < listMedia.length; i++) {
                imageMoment += listMedia[i].size
            }

            if (imageMoment < functions.MAX_Kho_Anh) {
                if (video) {
                    for (let i = 0; i < video.length; i++) {
                        sizeVideo += video[i].size
                    }
                    if (
                        Number(sizeVideo) + Number(imageMoment) <=
                        functions.MAX_Kho_Anh
                    ) {
                        for (let i = 0; i < video.length; i++) {
                            let checkImg = await functions.checkVideo(video[i])
                            if (checkImg) {
                                let id = listVideo[listVideo.length - 1] || 0
                                let newID = id._id || 0
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
                                return functions.setError(
                                    res,
                                    'sai định dạng video hoặc video lớn hơn 100MB',
                                    404
                                )
                            }
                        }
                        await Users.updateOne({ idTimViec365: idCompany, type: 1 }, {
                            $set: { 'inForCompany.comVideos': listVideo },
                        })
                        return functions.success(res, 'thêm video thành công')
                    } else {
                        if (video) {
                            for (let i = 0; i < video.length; i++) {
                                await functions.deleteImg(video[i])
                            }
                        }
                        return functions.setError(
                            res,
                            'video thêm vào đã quá dung lượng của kho',
                            404
                        )
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
        const user = req.user.data
        const { list_id } = req.body
        if (list_id) {
            let array = []
            const list = list_id.split(',')

            for (let i = 0; i < list.length; i++) {
                const idString = list[i]
                const ObjectId = mongoose.Types.ObjectId
                array.push(new ObjectId(idString))
            }
            const list_img = await CompanyStorage.find({
                _id: { $in: array },
                usc_id: user.idTimViec365,
            })
            if (list_img.length > 0) {
                const geturlVideo = service.geturlVideo(user.createdAt)
                let fullPath
                for (let j = 0; j < list_img.length; j++) {
                    const element = list_img[j]
                    if (element.image) {
                        fullPath = `${geturlVideo}/${element.image}`
                    } else {
                        fullPath = `${geturlVideo}/${element.video}`
                    }
                    // Kiểm tra xem hình ảnh tồn tại hay không
                    fs.access(fullPath, fs.constants.F_OK, (err) => {
                        if (err) {} else {
                            // Xóa hình ảnh
                            fs.unlink(fullPath, (err) => {})
                        }
                    })
                    const ObjectId = mongoose.Types.ObjectId
                    await CompanyStorage.deleteOne({
                        _id: new ObjectId(element._id),
                    })
                }
                return functions.success(res, 'xoá thành công', { list_img })
            }
            return functions.setError(res, 'Không tồn tại hình ảnh cần xóa')
        }
        return functions.setError(res, 'Chưa truyền list id')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm xóa video (bỏ)
exports.deleteVideo = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365
        let idFile = req.body.idFile
        let user = await functions.getDatafindOne(Users, {
            idTimViec365: idCompany,
            type: 1,
        })
        if (idFile && user) {
            let listVideo = user.inForCompany.comVideos
            const index = listVideo.findIndex((video) => video._id == idFile)
            if (index != -1) {
                await listVideo.splice(index, 1)
                let nameFile = listVideo[index].name
                await Users.updateOne({ idTimViec365: idCompany, type: 1 }, {
                    $set: { 'inForCompany.comVideos': listVideo },
                })
                await functions.deleteImg(`public\\KhoAnh\\${idCompany}\\${nameFile}`)
                return functions.success(res, 'xoá thành công')
            } else {
                return functions.setError(res, 'id không đúng', 404)
            }
        }
        return functions.setError(
            res,
            'tên file không tồn tại hoặc người dùng không tồn tại',
            404
        )
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm gọi data lĩnh vực
exports.getDataLV = async(req, res, next) => {
    try {
        let lists = await CategoryCompany.find({
            name_tag: { $ne: '' },
            city_tag: 0,
        }, { id: 1, name_tag: 1 })
        return functions.success(res, 'lấy thành công', { data: lists })
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm tìm lĩnh vực theo ngành nghề
exports.getFieldsByIndustry = async(req, res, next) => {
    try {
        let catID = req.body.cat_id
        if (catID) {
            let data = await functions.getDatafind(CategoryCompany, {
                tag_index: catID,
            })
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
        let idCompany = req.user.data.idTimViec365
        let idUser = req.body.user_id
        if (idUser) {
            // Kiểm tra ứng viên có tồn tại không
            const candidate = await functions.getDatafindOne(Users, {
                idTimViec365: idUser,
                type: 0,
            })
            if (candidate != undefined) {
                // Kiểm tra đã lưu hay chưa
                const checkSaveCandi = await functions.getDatafindOne(SaveCandidate, {
                    usc_id: idCompany,
                    use_id: idUser,
                })
                if (checkSaveCandi == undefined) {
                    let maxID = await SaveCandidate.findOne({}, { id: 1 })
                        .sort({ id: -1 })
                        .limit(1)
                        .lean()
                    let newID = 0
                    if (maxID) newID = maxID.id
                    const uv = new SaveCandidate({
                        id: Number(newID) + 1,
                        usc_id: idCompany,
                        use_id: idUser,
                        save_time: functions.getTimeNow(),
                    })
                    await uv.save()
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
            return functions.setError(res, 'Ứng viên không tồn tại ')
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
        let idCompany = req.user.data.idTimViec365
        let idUser = req.body.user_id
        if (idUser) {
            await functions.getDataDeleteOne(SaveCandidate, {
                uscID: idCompany,
                userID: idUser,
            })
            return functions.success(res, 'xóa thành công')
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
            ft_box2 = req.body.ft_box2

        let match = {
                usc_id: Number(idCompany),
                use_id: { $ne: 0 },
                type: 1,
            },
            lookUpUser = {
                from: 'Users',
                localField: 'use_id',
                foreignField: 'idTimViec365',
                as: 'user',
            },
            matchUser = {
                'user.type': 0,
            }
        if (ft_box != 'tc') {
            match.type = Number(ft_box)
        }
        if (ft_box2 != 'tc') {
            match.type_err = Number(ft_box2)
        }

        const list = await PointUsed.aggregate([
            { $match: match },
            {
                $group: {
                    _id: '$use_id',
                    use_id: { $first: '$use_id' },
                    used_day: { $first: '$used_day' },
                    type: { $first: '$type' },
                    note_uv: { $first: '$note_uv' },
                    return_point: { $first: '$return_point' },
                    type_err: { $first: '$type_err' },
                    ip_user: { $first: '$ip_user' },
                },
            },
            { $lookup: lookUpUser },
            { $unwind: '$user' },
            { $match: matchUser },
            { $sort: { used_day: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    use_id: '$user.idTimViec365',
                    use_first_name: '$user.userName',
                    use_email: '$user.email',
                    cv_title: '$user.inForPerson.candidate.cv_title',
                    use_gioi_tinh: '$user.inForPerson.account.gender',
                    cv_city_id: '$user.inForPerson.candidate.cv_city_id',
                    use_phone: '$user.inForPerson.candidate.use_phone',
                    use_birth_day: '$user.inForPerson.account.birthday',
                    used_day: 1,
                    type: 1,
                    note_uv: 1,
                    return_point: 1,
                    type_err: 1,
                    // cv_city_id,
                    ip_user: '$ip_user',
                },
            },
        ])
        let total = 0
        if (list.length > 0) {
            let countUv = await PointUsed.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: '$use_id',
                        use_id: { $first: '$use_id' },
                    },
                },
                { $lookup: lookUpUser },
                { $unwind: '$user' },
                { $match: matchUser },
                { $count: 'total' },
            ])
            if (countUv.length > 0) {
                total = countUv[0].total
            }
        }
        return functions.success(res, 'Lấy danh sách uv thành công', {
            items: list,
            total: total,
        })
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// xóa uv trong danh sách dùng điểm
exports.deleteUVUsePoin = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365
        let idUser = req.body.user_id
        if (idUser) {
            await functions.getDataDeleteOne(PointUsed, {
                uscID: idCompany,
                userID: idUser,
            })
            return functions.success(res, 'xóa thành công')
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
        let newID = req.body.new_id
        let userID = req.body.user_id
        let type = req.body.type
        if (newID && userID && type) {
            let news = await functions.getDatafindOne(NewTV365, { _id: newID })
            let user = await functions.getDatafindOne(Users, {
                idTimViec365: userID,
                type: 1,
            })
            if (news && user) {
                await ApplyForJob.updateOne({ userID: userID, newID: newID }, {
                    $set: { kq: type },
                })
                return functions.success(res, 'cập nhập thành công')
            }
            return functions.setError(
                res,
                'người dùng hoặc bài viết không tồn tại',
                404
            )
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
        let userID = req.body.user_id
        let idCompany = req.user.data.idTimViec365
        let type = req.body.type
        let note = req.body.note
        if (userID) {
            let poin = await functions.getDatafindOne(PointUsed, {
                uscID: idCompany,
                useID: userID,
            })
            if (poin) {
                await PointUsed.updateOne({ uscID: idCompany, useID: userID }, {
                    $set: {
                        type: type,
                        noteUV: note,
                    },
                })
                return functions.success(res, 'cập nhập thành công')
            }
            return functions.setError(
                res,
                'không tồn tại người dùng trong danh sách điểm lọc',
                404
            )
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
        let formCV = await CV.find().sort({ vip: -1, _id: -1 }).limit(10)
        return functions.success(res, 'lấy thành công', { formCV })
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm đánh giá ứng viên
exports.assessmentUV = async(req, res, next) => {
    try {
        let idUV = req.body.user_id
        let idCompany = req.user.data.idTimViec365
        let type = req.body.type
        let note = req.body.note
        if (idCompany) {
            let poin = await functions.getDatafindOne(PointUsed, {
                uscID: idCompany,
                useID: idUV,
            })
            if (poin) {
                await PointUsed.updateOne({ uscID: idCompany, useID: idUV }, {
                        $set: {
                            type: type,
                            noteUV: note,
                        },
                    })
                    // Cập nhật phần trăm hoàn thiện hồ sơ
                const uvPercent = await serviceCompany.percentHTHS(idUV)

                await Users.updateOne({ idTimViec365: idUV }, {
                    $set: {
                        'inForPerson.candidate.percents': uvPercent,
                    },
                })
                return functions.success(res, 'cập nhập thành công')
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
        let idCompany = req.body.com_id ?
            req.body.com_id :
            req.user.data.idTimViec365
        let page = Number(req.body.page) || 1
        let pageSize = Number(req.body.pageSize) || 20
        const skip = (page - 1) * pageSize
        const limit = pageSize
        const condition = {
            new_user_id: idCompany,
            $or: [{ new_md5: null }, { new_md5: '' }],
        }
        let listPost = await NewTV365.find(condition)
            .select(
                'new_id new_title new_alias new_update_time new_update_time_2 new_city new_cat_id new_view_count new_bao_luu new_han_nop new_hot new_gap new_cao new_nganh new_create_time time_bao_luu new_active new_vip_time new_cate_time'
            )
            .limit(limit)
            .skip(skip)
            .sort({ new_id: -1 })
            .lean()

        let listNewId = []
        let listCityId = []
        for (let i = 0; i < listPost.length; i++) {
            listNewId.push(listPost[i].new_id)
            listCityId.push(listPost[i].new_city[0])
        }
        listCityId = [...new Set(listCityId)]
        let listDataCity = []
        let listGhim = []
        let total = 0
        let dv_bl = 0
        let total_ghim = 0
        let listApplied = []
        await Promise.all(
            [1, 2].map(async(indextotal) => {
                if (indextotal == 1) {
                    await Promise.all(
                        listCityId.map(async(city) => {
                            let count = await functions.findCount(Users, {
                                // "inForPerson.candidate.cv_cate_id": { $all: [cate] },
                                'inForPerson.candidate.cv_city_id': {
                                    $all: [city],
                                },
                            })
                            listDataCity.push({
                                cityId: city,
                                count: count,
                            })
                        })
                    )
                } else if (indextotal == 2) {
                    await Promise.all(
                        [1, 2, 3, 4].map(async(index) => {
                            if (index == 1) {
                                total = await functions.findCount(NewTV365, condition)
                            } else if (index == 2) {
                                dv_bl = await TblBaoLuu.find({
                                    id_ntd_bl: idCompany,
                                }).sort({ _id: -1 })
                            } else if (index == 3) {
                                listGhim = await GhimHistory.find({
                                    new_id: { $in: listNewId },
                                }).lean()
                            } else if (index == 4) {
                                let lookUpUser = {
                                        from: 'Users',
                                        localField: 'nhs_use_id',
                                        foreignField: 'idTimViec365',
                                        as: 'user',
                                    },
                                    matchUser = {
                                        'user.type': 0,
                                    },
                                    lookUpNewTv365 = {
                                        from: 'NewTV365',
                                        localField: 'nhs_new_id',
                                        foreignField: 'new_id',
                                        as: 'new',
                                    }
                                listApplied = await ApplyForJob.aggregate([{
                                        $match: {
                                            nhs_new_id: { $in: listNewId },
                                            nhs_kq: { $in: [0, 2, 13] },
                                        },
                                    },
                                    { $lookup: lookUpUser },
                                    { $unwind: '$user' },
                                    { $match: matchUser },
                                    {
                                        $group: {
                                            _id: '$nhs_new_id',
                                            count: { $count: {} },
                                        },
                                    },
                                ])
                            }
                        })
                    )
                }
            })
        )
        if (idCompany == 202585) {
            console.log(listApplied)
        }
        let listPostTempt = []
        await Promise.all(
            listPost.map(async(element) => {
                const cate = element.new_cat_id[0]
                const city = element.new_city[0]
                element.new_cat_id = element.new_cat_id.toString()
                element.new_city = element.new_city.toString()

                let applied = listApplied.find((e) => e._id == element.new_id)
                element.applied = applied ? applied.count : 0
                    // console.log(applied)
                    // element.applied = applied || 0;
                    // element.applied = await functions.findCount(ApplyForJob, { nhs_new_id: element.new_id, nhs_kq: 0 });
                    // element.count_uv = await functions.findCount(Users, {
                    //     // "inForPerson.candidate.cv_cate_id": { $all: [cate] },
                    //     "inForPerson.candidate.cv_city_id": { $all: [city] },
                    // });
                element.count_uv = 0
                let obj = listDataCity.find((e) => e.cityId == city)
                if (obj) {
                    element.count_uv = obj.count
                }

                //let checkPin = await GhimHistory.findOne({ new_id: element.new_id }).lean();
                let checkPin = listGhim.find((e) => e.new_id == element.new_id)
                element.check_pin = checkPin ? 1 : 0
                total_ghim += checkPin ? 1 : 0
                listPostTempt.push(element)
            })
        )

        return functions.success(res, 'Lấy danh sách tin đăng thành công', {
            total,
            items: listPostTempt,
            dv_bl,
            listDataCity,
            total_ghim,
        })
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm cập nhập ứng viên point
exports.updateUVPoint = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365
        let noteUV = req.body.note_uv
        let userID = req.body.user_id
        let type = req.body.type
        if (userID && idCompany) {
            let user = await functions.getDatafindOne(Users, {
                idTimViec365: userID,
            })
            if (user) {
                if (type) {
                    await PointUsed.updateOne({ use_id: userID, usc_id: idCompany }, {
                        $set: { type_err: type },
                    })
                }

                if (noteUV) {
                    await PointUsed.updateOne({ use_id: userID, usc_id: idCompany }, {
                        $set: { note_uv: noteUV },
                    })
                }
                return functions.success(res, 'cập nhật thành công')
            }
            return functions.setError(
                res,
                'người dùng hoặc công ty không tồn tại',
                404
            )
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// xóa uv trong danh sách dùng điểm
exports.deleteUVUsePoint = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365
        let idUser = req.body.user_id
        if (idUser) {
            await functions.getDataDeleteOne(PointUsed, {
                usc_id: idCompany,
                use_id: idUser,
            })
            return functions.success(res, 'xóa thành công')
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// danh sách sử dụng điểm của nhà tuyển dụng cho Uv
exports.listUVPointAll = async(req, res, next) => {
    try {
        const idCompany = req.user.data.idTimViec365,
            ft_box = req.body.ft_box,
            ft_box2 = req.body.ft_box2

        let match = {
                usc_id: Number(idCompany),
                use_id: { $ne: 0 },
                type: 1,
            },
            lookUpUser = {
                from: 'Users',
                localField: 'use_id',
                foreignField: 'idTimViec365',
                as: 'user',
            },
            matchUser = {
                'user.type': 0,
            }
        if (ft_box != 'tc') {
            match.type = Number(ft_box)
        }
        if (ft_box2 != 'tc') {
            match.type_err = Number(ft_box2)
        }

        const list = await PointUsed.aggregate([
            { $match: match },
            { $lookup: lookUpUser },
            { $unwind: '$user' },
            { $match: matchUser },
            { $sort: { used_day: -1 } },
            {
                $project: {
                    use_id: '$user.idTimViec365',
                    use_first_name: '$user.userName',
                    use_email: '$user.email',
                    cv_title: '$user.inForPerson.candidate.cv_title',
                    use_gioi_tinh: '$user.inForPerson.account.gender',
                    cv_city_id: '$user.inForPerson.candidate.cv_city_id',
                    use_phone: '$user.phone',
                    use_email_lienhe: '$user.emailContact',
                    use_phone_tk: '$user.phoneTK',
                    use_birth_day: '$user.inForPerson.account.birthday',
                    ip_user: '$ip_user',
                    used_day: 1,
                    type: 1,
                    note_uv: 1,
                    return_point: 1,
                    type_err: 1,
                    // cv_city_id,
                    ip_user: '$ip_user',
                },
            },
        ])
        let total = 0
        if (list.length > 0) {
            let countUv = await PointUsed.aggregate([
                { $match: match },
                { $lookup: lookUpUser },
                { $unwind: '$user' },
                { $match: matchUser },
                { $count: 'total' },
            ])
            if (countUv.length > 0) {
                total = countUv[0].total
            }
        }
        return functions.success(res, 'Lấy danh sách uv thành công', {
            items: list,
            total: total,
        })
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy dữ liệu danh sách ứng tuyển UV all
exports.listUVApplyJobAll = async(req, res, next) => {
    try {
        const idCompany = req.user.data.idTimViec365,
            nhs_new_id = req.body.ft_new,
            nhs_kq = req.body.ft_box,
            type = req.body.type || 'tuungtuyen'
        let match = {
                nhs_com_id: idCompany,
                nhs_kq: { $in: [0, 2, 13] },
            },
            lookUpUser = {
                from: 'Users',
                localField: 'nhs_use_id',
                foreignField: 'idTimViec365',
                as: 'user',
            },
            matchUser = {
                'user.type': 0,
            },
            lookUpNewTv365 = {
                from: 'NewTV365',
                localField: 'nhs_new_id',
                foreignField: 'new_id',
                as: 'new',
            }
        if (type != 'tuungtuyen') {
            match.nhs_kq = { $in: [10, 11, 12, 14] }
        }
        if (nhs_new_id && nhs_new_id != 0) {
            match.nhs_new_id = Number(nhs_new_id)
        }
        if (nhs_kq && nhs_kq != 0) {
            match.nhs_kq = Number(nhs_kq)
        }

        let total = 0
        const list = await ApplyForJob.aggregate([{
                $match: match,
            },
            { $lookup: lookUpUser },
            { $unwind: '$user' },
            { $match: matchUser },
            { $lookup: lookUpNewTv365 },
            { $unwind: '$new' },
            { $sort: { nhs_id: -1 } },
            {
                $project: {
                    use_id: '$user.idTimViec365',
                    use_first_name: '$user.userName',
                    use_email: '$user.email',
                    use_logo: '$user.avatarUser',
                    use_create_time: '$user.createdAt',
                    use_address: '$user.address',
                    use_gioi_tinh: '$user.inForPerson.account.gender',
                    cv_exp: '$user.inForPerson.account.experience',
                    use_email_lienhe: '$user.emailContact',
                    use_phone_tk: '$user.phoneTK',
                    use_phone: '$user.phone',
                    cv_city_id: '$user.inForPerson.candidate.cv_city_id',
                    chat365_id: '$user._id',
                    new_id: '$new.new_id',
                    new_title: '$new.new_title',
                    new_alias: '$new.new_alias',
                    nhs_time: 1,
                    nhs_kq: 1,
                    nhs_id: 1,
                    nhs_time_pv: 1,
                    nhs_text: 1,
                    nhs_thuungtuyen: 1,
                },
            },
        ])
        if (list.length > 0) {
            let countUv = await ApplyForJob.aggregate([{
                    $match: match,
                },
                {
                    $lookup: lookUpUser,
                },
                {
                    $unwind: '$user',
                },
                {
                    $match: matchUser,
                },
                {
                    $lookup: lookUpNewTv365,
                },
                {
                    $unwind: '$new',
                },
                {
                    $count: 'total',
                },
            ])
            if (countUv.length > 0) {
                total = countUv[0].total
            }
        }
        return functions.success(res, 'Lấy danh sách uv thành công', {
            items: list,
            total: total,
        })
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.listSaveUVAll = async(req, res, next) => {
    try {
        let idCompany = req.user.data.idTimViec365
        const list = await SaveCandidate.aggregate([{
                $match: {
                    usc_id: Number(idCompany),
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'use_id',
                    foreignField: 'idTimViec365',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            { $match: { 'user.type': 0 } },
            { $sort: { id: -1 } },
            {
                $project: {
                    use_id: '$user.idTimViec365',
                    use_first_name: '$user.userName',
                    use_email: '$user.email',
                    cv_title: '$user.inForPerson.candidate.cv_title',
                    save_time: 1,
                },
            },
        ])
        const totalCount = await functions.findCount(SaveCandidate, {
            usc_id: idCompany,
        })
        return functions.success(res, 'Lấy danh sách uv thành công', {
            total: totalCount,
            items: list,
        })
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm kích hoạt tài khoản bằng otp nhà mạng
exports.verifyOTP = async(req, res, next) => {
    try {
        let user = req.user.data
        let otp = req.body.otp
        let User = await Users.findOne({
            _id: user._id,
            authentic: 0,
        })
        if (User != null) {
            if (User.otp == otp) {
                await Users.updateOne({ _id: User._id }, {
                    $set: {
                        authentic: 1,
                    },
                })
                return functions.success(res, 'Xác thực thành công', {
                    user_id: User.idTimViec365,
                })
            }
            return functions.setError(res, 'Mã OTP không đúng')
        }
        return functions.setError(res, 'xác thực thất bại', 404)
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.vote = async(req, res) => {
    try {
        if (req.body.star && req.body.comId) {
            const userId = req.user.data.idTimViec365,
                userType = req.user.data.type,
                star = Number(req.body.star)
            const comId = Number(req.body.comId)
            const check = await Users.findOne({
                idTimViec365: comId,
                type: 1,
            }).lean()
            const user = await Users.findOne({
                idTimViec365: userId,
                type: userType,
            }).lean()
            if (check && user) {
                let time = new Date().getTime() / 1000
                let type = 'com'
                let type_create = 1
                let checkVote = await SaveVote.findOne({
                    userId: user.idTimViec365,
                    user_type_vote: user.type,
                    id_be_vote: comId,
                    type: type,
                })
                if (checkVote) {
                    await SaveVote.updateOne({
                        id: checkVote.id,
                    }, {
                        $set: {
                            star: star,
                            time: time,
                        },
                    })
                } else {
                    await new SaveVote({
                        id: await getMaxID(SaveVote),
                        userId: user.idTimViec365,
                        user_type_vote: user.type,
                        star: star,
                        id_be_vote: comId,
                        type: type,
                        type_create: type_create,
                        time: time,
                    }).save()
                }

                // Cập nhật điểm sau khi được vote
                let list = await SaveVote.aggregate([{
                        $match: {
                            id_be_vote: comId,
                        },
                    },
                    {
                        $group: {
                            _id: '$id_be_vote',
                            star: { $sum: '$star' },
                            count: { $sum: 1 },
                        },
                    },
                ])
                let total = list.reduce((acc, val) => acc + val.star, 0)
                let count = list.reduce((acc, val) => acc + val.count, 0)
                let avg = Math.floor(total / count)
                let point = 0
                if (avg === 1) point = -10
                if (avg === 2) point = -5
                if (avg === 3) point = 0
                if (avg === 4) point = 5
                if (avg === 5) point = 10
                let history = await ManagerPointHistory.findOne({
                    userId: comId,
                    type: 1,
                })
                if (history) {
                    history.point_vote = point
                } else {
                    history = new ManagerPointHistory({
                        userId: userId,
                        type: userType,
                        point_to_change: point,
                        point_vote: point,
                        sum: point,
                    })
                }
                await saveHistory(history)

                return functions.success(res, 'Thành công')
            }
            return functions.setError(res, 'NTD không tồn tại')
        } else {
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ')
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.getMyVote = async(req, res) => {
    try {
        let { comId } = req.body
        comId = Number(comId)
        if (!comId || !req.user || !req.user.data)
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ')
        const user = await Users.findOne({
            idTimViec365: req.user.data.idTimViec365,
            type: req.user.data.type,
        }).lean()
        let vote = await SaveVote.findOne({
            userId: user.idTimViec365,
            user_type_vote: user.type,
            id_be_vote: comId,
            type: 'com',
        })
        return functions.success(res, 'Thành công', { data: { vote } })
    } catch (error) {
        return functions.setError(res, error)
    }
}

exports.getComVotes = async(req, res) => {
    try {
        let { comId } = req.body
        comId = Number(comId)
        if (!comId) functions.setError(res, 'Thông tin truyền lên không đầy đủ')
        let aggrData = await SaveVote.aggregate([{
                $match: {
                    id_be_vote: comId,
                    type: 'com',
                },
            },
            {
                $group: {
                    _id: '$star',
                    sum: { $sum: '$star' },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: null,
                    votes: {
                        $push: {
                            star: '$_id',
                            count: '$count',
                        },
                    },
                    sum: { $sum: '$sum' },
                    totalVotes: { $sum: '$count' },
                },
            },
        ])
        let voteData = null
        if (aggrData[0]) {
            voteData = aggrData[0]
        }
        return functions.success(res, 'Thành công', { data: { voteData } })
    } catch (error) {
        return functions.setError(res, error)
    }
}

exports.updateInforV2 = async(req, res, next) => {
    try {
        const user = req.user.data
        const type = req.body.type
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
            check_chat = request.check_chat,
            usc_images = request.usc_images,
            usc_manager = request.usc_manager,
            usc_skype = request.usc_skype,
            usc_zalo = request.usc_zalo,
            usc_website = request.usc_website,
            usc_name = request.usc_name,
            usc_name_add = request.usc_name_add,
            usc_name_phone = request.usc_name_phone,
            usc_name_email = request.usc_name_email,
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
            usc_branches_delete = request.usc_branches_delete

        if (phone && userCompany && city && district && address) {
            let checkPhone = await functions.checkPhoneNumber(phone)
            const now = functions.getTimeNow()
            if (checkPhone) {
                let dataUpdate = {
                    'inForCompany.description': description,
                    userName: userCompany,
                    phone: phone,
                    city: city,
                    district: district,
                    address: address,
                    'inForCompany.timviec365.usc_mst': mst || null,
                    'inForCompany.timviec365.usc_lv': tagLinhVuc,
                    'inForCompany.timviec365.usc_images': usc_images,
                    'inForCompany.timviec365.usc_manager': usc_manager,
                    'inForCompany.timviec365.usc_skype': usc_skype,
                    'inForCompany.timviec365.usc_zalo': usc_zalo,
                    'inForCompany.timviec365.usc_website': usc_website,
                    'inForCompany.timviec365.usc_size': usc_size,
                    'inForCompany.timviec365.usc_name': usc_name,
                    'inForCompany.timviec365.usc_name_add': usc_name_add,
                    'inForCompany.timviec365.usc_name_phone': usc_name_phone,
                    'inForCompany.timviec365.usc_name_email': usc_name_email,
                }

                let pull = {}
                let push = {}

                if (usc_video_link) {
                    dataUpdate['inForCompany.timviec365.usc_video'] = usc_video_link
                    dataUpdate['inForCompany.timviec365.usc_video_type'] = 2
                }

                if (usc_founded_time) {
                    dataUpdate['inForCompany.timviec365.usc_founded_time'] =
                        usc_founded_time
                }

                let Files = req.files || null
                if (Files && Files.usc_license) {
                    let license = await functions.uploadLicense(
                        idTimViec365,
                        Files.usc_license
                    )
                    dataUpdate['inForCompany.timviec365.usc_license'] = license
                    dataUpdate['inForCompany.timviec365.usc_active_license'] = 0
                }
                if (usc_branches_delete)
                    usc_branches_delete = JSON.parse(usc_branches_delete)
                if (usc_branches_add) usc_branches_add = JSON.parse(usc_branches_add)
                if (usc_branches_edit) usc_branches_edit = JSON.parse(usc_branches_edit)

                if (usc_branches_delete && usc_branches_delete.length) {
                    if (typeof usc_branches_delete === 'string') {
                        //Trong trường hợp chỉ có 1 giá trị id
                        usc_branches_delete = [usc_branches_delete]
                    }
                    pull['inForCompany.timviec365.usc_branches'] = {
                        _id: { $in: [...usc_branches_delete] },
                    }
                }

                if (usc_branches_add && usc_branches_add.length) {
                    //Map lại để lọc trường, tránh việc thêm sai trường
                    push['inForCompany.timviec365.usc_branches'] = {
                        $each: usc_branches_add.map((data) => ({
                            usc_branch_cit: data.usc_branch_cit,
                            usc_branch_qh: data.usc_branch_qh,
                            usc_branch_address: data.usc_branch_address,
                            usc_branch_time: functions.getTimeNow(),
                        })),
                    }
                }

                if (usc_branches_edit && usc_branches_edit.length) {
                    let promises = []
                    usc_branches_edit.forEach((payload) => {
                            if (payload._id) {
                                promises.push(
                                    Users.updateOne({
                                        _id: companyID,
                                        'inForCompany.timviec365.usc_branches._id': payload._id,
                                    }, {
                                        $set: {
                                            'inForCompany.timviec365.usc_branches.$.usc_branch_cit': payload.usc_branch_cit,
                                            'inForCompany.timviec365.usc_branches.$.usc_branch_qh': payload.usc_branch_qh,
                                            'inForCompany.timviec365.usc_branches.$.usc_branch_address': payload.usc_branch_address,
                                        },
                                    })
                                )
                            }
                        })
                        //
                    await Promise.all(promises)
                }
                await Users.updateOne({ _id: companyID }, {
                    $set: dataUpdate,
                    $pull: pull,
                })
                await Users.updateOne({ _id: companyID }, {
                    $push: push,
                })

                // Cập nhật quyền
                const list_permission = req.body.list_permission
                if (
                    list_permission &&
                    list_permission != '' &&
                    list_permission.length > 0
                ) {
                    const array_list_permission = JSON.parse(list_permission)
                    for (let i = 0; i < array_list_permission.length; i++) {
                        const element = array_list_permission[i]
                        const id_chat_pq = element.arr_id_chat

                        const id_thongbao = element.arr_id_ltbao.toString()
                        for (let j = 0; j < id_chat_pq.length; j++) {
                            const id_chat = id_chat_pq[j]

                            const checkNotify = await PermissionNotify.findOne({
                                pn_usc_id: idTimViec365,
                                pn_id_chat: id_chat,
                                pn_id_new: 0,
                            })

                            if (checkNotify) {
                                await PermissionNotify.updateOne({
                                    pn_usc_id: idTimViec365,
                                    pn_id_chat: id_chat,
                                    pn_id_new: 0,
                                }, {
                                    $set: {
                                        pn_type_noti: id_thongbao,
                                        pn_created_at: now,
                                    },
                                })
                            } else {
                                if (id_thongbao) {
                                    const maxID = await PermissionNotify.findOne({}, { pn_id: 1 })
                                        .sort({ pn_id: -1 })
                                        .lean()
                                    const item = new PermissionNotify({
                                        pn_id: Number(maxID.pn_id) + 1,
                                        pn_usc_id: idTimViec365,
                                        pn_id_chat: id_chat,
                                        pn_type_noti: id_thongbao,
                                        pn_created_at: now,
                                    })
                                    await item.save()
                                }
                            }
                        }
                    }
                }

                // Xóa các quyền bị loại bỏ
                const list_permission_rm = req.body.list_permission_rm
                if (list_permission_rm && list_permission_rm != '') {
                    const array_list_permission_rm = list_permission_rm
                        .split(',')
                        .map(Number)
                    for (let k = 0; k < array_list_permission_rm.length; k++) {
                        const pn_id_chat = array_list_permission_rm[k]
                        await PermissionNotify.deleteOne({
                            pn_usc_id: idCompany,
                            pn_id_chat: pn_id_chat,
                            pn_id_new: 0,
                        })
                    }
                }
                let list_type_noti
                let list = []
                    // Luồng nhà tuyển dụng phân quyền
                if (type == 1) {
                    list_type_noti = await PermissionNotify.distinct('pn_type_noti', {
                        pn_usc_id: idTimViec365,
                        pn_id_new: 0,
                    }).lean()
                    for (let i = 0; i < list_type_noti.length; i++) {
                        const pn_type_noti = list_type_noti[i]

                        const rs_usc = await PermissionNotify.aggregate([{
                                $match: {
                                    pn_usc_id: idTimViec365,
                                    pn_id_new: 0,
                                    pn_type_noti: pn_type_noti,
                                },
                            },
                            {
                                $lookup: {
                                    from: 'Users',
                                    localField: 'pn_id_chat',
                                    foreignField: '_id',
                                    as: 'user',
                                },
                            },
                            { $unwind: '$user' },
                            {
                                $project: {
                                    id: '$user._id',
                                    type365: '$user.type',
                                    email: '$user.email',
                                    phoneTK: '$user.phoneTK',
                                },
                            },
                        ])
                        list.push({
                            pn_type_noti: pn_type_noti,
                            rs_usc: rs_usc,
                        })
                    }
                }
                let point = 0
                const Com = await Users.findOne({ _id: companyID })
                if (Com) {
                    if (Com.avatarUser) point += 5
                    if (Com.inForCompany.timviec365.usc_lv) point += 10
                    if (Com.inForCompany.timviec365.usc_mst) point += 3
                    if (Com.city) point += 15
                    if (Com.district) point += 10
                    if (Com.address) point += 5
                    if (Com.inForCompany.timviec365.usc_vip !== 0) {
                        point += 10
                    } else if (Com.inForCompany.timviec365.usc_vip === 0) {
                        point += 5
                    }
                    if (Com.inForCompany.description) {
                        const string = Com.inForCompany.description
                        if (string.length <= 50) {
                            point += 10
                        } else if (string.length <= 100) {
                            point += 15
                        } else point += 20
                    }
                    if (Com.inForCompany.timviec365.usc_video) point += 4
                    if (Com.inForCompany.timviec365.usc_images) {
                        const length = Com.inForCompany.timviec365.usc_images.length
                        if (length <= 4) point += length
                        else point += 5
                    }
                    if (Com.inForCompany.timviec365.usc_vip)
                        point += Com.inForCompany.timviec365.usc_vip
                    const num = list.length
                    if (num <= 4) {
                        point += num
                    } else point += 5
                }

                return functions.success(res, 'update thành công', { point })
            }
            return functions.setError(res, 'sai định dạng số điện thoại')
        }
        return functions.setError(res, 'thiếu dữ liệu')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm chi tiết công ty dùng chung (trả về điểm)
exports.getDetailInfoCompanyGeneral = async(req, res, next) => {
    try {
        let idCompany = Number(req.body.user_id)
        if (idCompany) {
            let getData = await Users.aggregate([{
                    $match: {
                        idTimViec365: idCompany,
                        type: 1,
                    },
                },
                {
                    $project: {
                        usc_id: '$idTimViec365',
                        usc_email: '$email',
                        usc_phone_tk: '$phoneTK',
                        usc_company: '$userName',
                        emailContact: '$emailContact',
                        usc_alias: '$alias',
                        usc_pass: '$password',
                        chat365_id: '$_id',
                        chat365_secret: '$chat365_secret',
                        usc_name: '$inForCompany.timviec365.usc_name',
                        usc_name_add: '$inForCompany.timviec365.usc_name_add',
                        usc_name_phone: '$inForCompany.timviec365.usc_name_phone',
                        usc_name_email: '$inForCompany.timviec365.usc_name_email',
                        usc_redirect: '$inForCompany.timviec365.usc_redirect',
                        usc_type: '$inForCompany.timviec365.usc_type',
                        usc_mst: '$inForCompany.timviec365.usc_mst',
                        usc_address: '$address',
                        usc_phone: '$phone',
                        usc_logo: '$avatarUser' || null,
                        usc_size: '$inForCompany.timviec365.usc_size',
                        usc_website: '$inForCompany.timviec365.usc_website',
                        usc_city: '$city',
                        usc_qh: '$district',
                        usc_create_time: '$createdAt',
                        usc_update_time: '$updatedAt',
                        usc_view_count: '$inForCompany.timviec365.usc_view_count',
                        usc_authentic: '$authentic',
                        usc_company_info: '$inForCompany.description',
                        usc_lv: '$inForCompany.timviec365.usc_lv',
                        usc_vip: '$inForCompany.timviec365.usc_vip',
                        usc_badge: '$inForCompany.timviec365.usc_badge',
                        usc_video: '$inForCompany.timviec365.usc_video',
                        usc_video_type: '$inForCompany.timviec365.usc_video_type',
                        usc_branches: '$inForCompany.timviec365.usc_branches',
                        usc_active_license: '$inForCompany.timviec365.usc_active_license',
                        usc_images: '$inForCompany.timviec365.usc_images',
                        usc_manager: '$inForCompany.timviec365.usc_manager',
                        usc_skype: '$inForCompany.timviec365.usc_skype',
                        usc_zalo: '$inForCompany.timviec365.usc_zalo',
                        usc_founded_time: '$inForCompany.timviec365.usc_founded_time',
                        usc_license: '$inForCompany.timviec365.usc_license',
                        usc_license_additional: '$inForCompany.timviec365.usc_license_additional',
                        usc_xac_thuc: '$otp',
                        usc_kd: '$inForCompany.usc_kd',
                        idQLC: '$idQLC',
                        usc_star: '$inForCompany.timviec365.usc_star',
                        otp_time_exist: '$inForCompany.timviec365.otp_time_exist',
                    },
                },
            ])
            if (getData.length > 0) {
                const company = getData[0]

                // Xử lý tên tỉnh thành , quận huyện cho app
                if (
                    company.usc_city !== 0 &&
                    company.usc_city !== null &&
                    company.usc_city !== ''
                ) {
                    let check = await City.findOne({ _id: company.usc_city })
                        .select('name')
                        .lean()
                    if (check) company.name_city = check.name
                    else company.name_city = ''
                }
                if (
                    company.usc_qh !== 0 &&
                    company.usc_qh !== null &&
                    company.usc_qh !== ''
                ) {
                    let check = await District.findOne({ _id: company.usc_qh })
                        .select('name')
                        .lean()
                    if (check) company.name_district = check.name
                    else company.name_district = ''
                }

                //xử lý mô tả cty cho app
                if (company.usc_company_info == null) company.usc_company_info = ''

                // Xử lý ảnh đại diện
                company.usc_logo = functions.getUrlLogoCompany(
                    company.usc_create_time,
                    company.usc_logo
                )
                company.usc_license = await functions.getLicenseURL(
                    company.usc_id,
                    company.usc_license
                )
                if (!company.usc_license) company.usc_license = ''
                company.usc_license_additional = await functions.getLicenseURL(
                    company.usc_id,
                    company.usc_license_additional
                )

                // Lấy kho ảnh
                ;
                (storageImage = await CompanyStorage.find({
                    usc_id: idCompany,
                    image: { $ne: null },
                }).lean()),
                // Lấy kho video
                (storageVideo = await CompanyStorage.find({
                    usc_id: idCompany,
                    video: { $ne: null },
                }).lean())

                // Xử lý đường dẫn đầy đủ của ảnh và video
                for (let i = 0; i < storageImage.length; i++) {
                    const element = storageImage[i]
                    element.url = service.urlStorageImage(
                        company.usc_create_time,
                        element.image
                    )
                }
                for (let j = 0; j < storageVideo.length; j++) {
                    const element = storageVideo[j]
                    element.url = service.urlStorageVideo(
                        company.usc_create_time,
                        element.video
                    )
                }
                // Trả ra view
                company.storageImage = storageImage
                company.storageVideo = storageVideo

                // Lấy điểm còn lại của công ty
                company.point_usc = 0
                let companyPoint = await PointCompany.findOne({ usc_id: idCompany }, { point_usc: 1 }).lean()
                if (companyPoint) {
                    company.point_usc = companyPoint.point_usc
                }

                // Tính trọng số công ty
                let list_type_noti
                let list = []
                list_type_noti = await PermissionNotify.distinct('pn_type_noti', {
                    pn_usc_id: idCompany,
                    pn_id_new: 0,
                }).lean()
                for (let i = 0; i < list_type_noti.length; i++) {
                    const pn_type_noti = list_type_noti[i]

                    const rs_usc = await PermissionNotify.aggregate([{
                            $match: {
                                pn_usc_id: idCompany,
                                pn_id_new: 0,
                                pn_type_noti: pn_type_noti,
                            },
                        },
                        {
                            $lookup: {
                                from: 'Users',
                                localField: 'pn_id_chat',
                                foreignField: '_id',
                                as: 'user',
                            },
                        },
                        { $unwind: '$user' },
                        {
                            $project: {
                                id: '$user._id',
                                type365: '$user.type',
                                email: '$user.email',
                                phoneTK: '$user.phoneTK',
                            },
                        },
                    ])
                    list.push({
                        pn_type_noti: pn_type_noti,
                        rs_usc: rs_usc,
                    })
                }
                let totalPer = 0
                let detailPercent = {
                    Logo: 0,
                    LinhVuc: 0,
                    MaSoThue: 0,
                    Tinh_ThanhPho: 0,
                    Quan_Huyen: 0,
                    DiaChi: 0,
                    Email: 0,
                    GioiThieu: 0,
                    Video: 0,
                    Anh: 0,
                    Vip: 0,
                    tkPhanQuyen: 0,
                    TinTuyenDung: 0,
                    Website: 0,
                    QuyMo: 0,
                    Tong: 0,
                }
                const Com = await Users.findOne({
                    idTimViec365: idCompany,
                    type: 1,
                })
                let detailKD = {}
                if (Com && Com.inForCompany) {
                    if (Com.inForCompany.usc_kd) {
                        detailKD = await AdminUser.findOne({
                            adm_bophan: Com.inForCompany.usc_kd,
                        }).lean()
                    }
                    if (Com.avatarUser) {
                        totalPer += 5
                        detailPercent.Logo = 5
                    }
                    if (Com.inForCompany.timviec365.usc_lv) {
                        totalPer += 10
                        detailPercent.LinhVuc = 10
                    }
                    if (Com.inForCompany.timviec365.usc_mst > 0) {
                        totalPer += 3
                        detailPercent.MaSoThue = 3
                    }
                    if (Com.city) {
                        totalPer += 15
                        detailPercent.Tinh_ThanhPho = 15
                    }
                    if (Com.district) {
                        totalPer += 10
                        detailPercent.Quan_Huyen = 10
                    }
                    if (Com.address) {
                        totalPer += 5
                        detailPercent.DiaChi = 5
                    }
                    if (Com.inForCompany.timviec365.usc_vip > 0) {
                        totalPer += 10
                        detailPercent.Email = 10
                    } else if (Com.inForCompany.timviec365.usc_vip === 0) {
                        totalPer += 5
                        detailPercent.Email = 5
                    }
                    if (Com.inForCompany.description) {
                        const string = Com.inForCompany.description
                        const string1 = sanitizeHtml(string, {
                            allowedTags: [],
                            allowedAttributes: {},
                        })
                        totalPer += 5
                        detailPercent.GioiThieu += 5
                        const point = Math.floor(string1.length / 50)
                        if (point <= 14) {
                            totalPer += point
                            detailPercent.GioiThieu += point
                        } else {
                            totalPer += 15
                            detailPercent.GioiThieu += 15
                        }
                    }

                    if (
                        storageVideo.length > 0 ||
                        Com.inForCompany.timviec365.usc_video
                    ) {
                        totalPer += 4
                        detailPercent.Video = 4
                    }
                    if (storageImage.length) {
                        const length = storageImage.length
                        if (length <= 3) {
                            totalPer += length
                            detailPercent.Anh = length
                        } else {
                            totalPer += 4
                            detailPercent.Anh = 4
                        }
                    }
                    if (Com.inForCompany.timviec365.usc_vip) {
                        totalPer += Com.inForCompany.timviec365.usc_vip
                        detailPercent.Vip = Com.inForCompany.timviec365.usc_vip
                    }
                    let num = 0
                    const countList = list ? list.length : 0
                    for (let i = 0; i < countList; i++) {
                        num += list[i].rs_usc.length
                    }
                    if (num <= 4) {
                        totalPer += num
                        detailPercent.tkPhanQuyen = num
                    } else {
                        totalPer += 5
                        detailPercent.tkPhanQuyen = 5
                    }
                    if (Com.inForCompany.timviec365.usc_website) {
                        totalPer += 2
                        detailPercent.Website = 2
                    }
                    if (Com.inForCompany.timviec365.usc_size) {
                        totalPer += 2
                        detailPercent.QuyMo = 2
                    }
                }
                detailPercent.Tong = totalPer
                company.DetailPercent = detailPercent
                company.detailKD = detailKD

                // Lấy thông báo cho ntd
                const list_notification = await serviceCompany.get_notification(
                    idCompany
                )

                return functions.success(res, 'Lấy thông tin công ty thành công', {
                    detail_company: company,
                    list_notification,
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

// hàm chi tiết công ty trước đăng nhập (trả về điểm)
exports.getDetailInfoCompany = async(req, res, next) => {
    try {
        let idCompany = Number(req.body.user_id)
        if (idCompany) {
            let getData = await Users.aggregate([{
                    $match: {
                        idTimViec365: idCompany,
                        type: 1,
                    },
                },
                {
                    $lookup: {
                        from: 'City',
                        localField: 'city',
                        foreignField: '_id',
                        as: 'City',
                    },
                },
                { $unwind: { path: '$City', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'District',
                        localField: 'district',
                        foreignField: '_id',
                        as: 'District',
                    },
                },
                { $unwind: { path: '$District', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        usc_id: '$idTimViec365',
                        usc_email: '$email',
                        usc_phone_tk: '$phoneTK',
                        usc_company: '$userName',
                        emailContact: '$emailContact',
                        usc_alias: '$alias',
                        usc_pass: '$password',
                        chat365_id: '$_id',
                        chat365_secret: '$chat365_secret',
                        usc_name: '$inForCompany.timviec365.usc_name',
                        usc_name_add: '$inForCompany.timviec365.usc_name_add',
                        usc_name_phone: '$inForCompany.timviec365.usc_name_phone',
                        usc_name_email: '$inForCompany.timviec365.usc_name_email',
                        usc_redirect: '$inForCompany.timviec365.usc_redirect',
                        usc_type: '$inForCompany.timviec365.usc_type',
                        usc_mst: '$inForCompany.timviec365.usc_mst',
                        usc_address: '$address',
                        usc_phone: '$phone',
                        usc_logo: '$avatarUser' || null,
                        usc_size: '$inForCompany.timviec365.usc_size',
                        usc_website: '$inForCompany.timviec365.usc_website',
                        usc_city: '$city',
                        usc_qh: '$district',
                        usc_create_time: '$createdAt',
                        usc_update_time: '$updatedAt',
                        usc_view_count: '$inForCompany.timviec365.usc_view_count',
                        usc_authentic: '$authentic',
                        usc_company_info: '$inForCompany.description',
                        usc_lv: '$inForCompany.timviec365.usc_lv',
                        usc_vip: '$inForCompany.timviec365.usc_vip',
                        usc_badge: '$inForCompany.timviec365.usc_badge',
                        usc_video: '$inForCompany.timviec365.usc_video',
                        usc_video_type: '$inForCompany.timviec365.usc_video_type',
                        usc_branches: '$inForCompany.timviec365.usc_branches',
                        usc_active_license: '$inForCompany.timviec365.usc_active_license',
                        usc_images: '$inForCompany.timviec365.usc_images',
                        usc_manager: '$inForCompany.timviec365.usc_manager',
                        usc_skype: '$inForCompany.timviec365.usc_skype',
                        usc_zalo: '$inForCompany.timviec365.usc_zalo',
                        usc_founded_time: '$inForCompany.timviec365.usc_founded_time',
                        usc_license: '$inForCompany.timviec365.usc_license',
                        usc_license_additional: '$inForCompany.timviec365.usc_license_additional',
                        usc_xac_thuc: '$otp',
                        usc_kd: '$inForCompany.usc_kd',
                        idQLC: '$idQLC',
                        usc_star: '$inForCompany.timviec365.usc_star',
                        otp_time_exist: '$inForCompany.timviec365.otp_time_exist',
                        name_city: '$City.name',
                        name_district: '$District.name',
                    },
                },
            ])
            if (getData.length > 0) {
                const company = getData[0]

                // Xử lý tên tỉnh thành , quận huyện cho app
                if (
                    company.usc_city !== 0 &&
                    company.usc_city !== null &&
                    company.usc_city !== ''
                ) {
                    let check = await City.findOne({ _id: company.usc_city })
                        .select('name')
                        .lean()
                    if (check) company.name_city = check.name
                    else company.name_city = ''
                }
                if (
                    company.usc_qh !== 0 &&
                    company.usc_qh !== null &&
                    company.usc_qh !== ''
                ) {
                    let check = await District.findOne({ _id: company.usc_qh })
                        .select('name')
                        .lean()
                    if (check) company.name_district = check.name
                    else company.name_district = ''
                }

                //xử lý mô tả cty cho app
                if (company.usc_company_info == null) company.usc_company_info = ''

                // Xử lý ảnh đại diện
                company.usc_logo = functions.getUrlLogoCompany(
                    company.usc_create_time,
                    company.usc_logo
                )
                company.usc_license = await functions.getLicenseURL(
                    company.usc_id,
                    company.usc_license
                )
                if (!company.usc_license) company.usc_license = ''
                company.usc_license_additional = await functions.getLicenseURL(
                        company.usc_id,
                        company.usc_license_additional
                    )
                    // Lấy danh sách tin tuyển dụng của cty
                    // const listNew = [],
                    //     count = 0;
                const listNew = await NewTV365.find({
                        new_user_id: company.usc_id,
                        new_active: { $ne: 0 },
                        new_md5: { $ne: 1 },
                    }).lean(),
                    // Số lượng tin tuyển dụng
                    count = await functions.findCount(NewTV365, {
                        new_user_id: company.usc_id,
                        new_active: { $ne: 0 },
                        new_md5: { $ne: 1 },
                    })

                // Lấy từ khóa liên quan
                ;
                (tagBlog = await TagBlog.find({
                        $text: { $search: company.usc_company },
                    })
                    .limit(20)
                    .lean()),
                // Lấy kho ảnh
                (storageImage = await CompanyStorage.find({
                    usc_id: idCompany,
                    image: { $ne: null },
                }).lean()),
                // Lấy kho video
                (storageVideo = await CompanyStorage.find({
                    usc_id: idCompany,
                    video: { $ne: null },
                }).lean())

                // Xử lý chuyển về text cho tỉnh thành, ngành nghề của tin
                for (let k = 0; k < listNew.length; k++) {
                    const element = listNew[k]
                    element.new_city = element.new_city.toString()
                    element.new_cat_id = element.new_cat_id.toString()
                }
                // Xử lý đường dẫn đầy đủ của ảnh và video
                for (let i = 0; i < storageImage.length; i++) {
                    const element = storageImage[i]
                    element.url = service.urlStorageImage(
                        company.usc_create_time,
                        element.image
                    )
                }
                for (let j = 0; j < storageVideo.length; j++) {
                    const element = storageVideo[j]
                    element.url = service.urlStorageVideo(
                        company.usc_create_time,
                        element.video
                    )
                }
                // Trả ra view
                company.storageImage = storageImage
                company.storageVideo = storageVideo

                // Lấy điểm còn lại của công ty
                company.point_usc = 0
                let companyPoint = await PointCompany.findOne({ usc_id: idCompany }, { point_usc: 1 }).lean()
                if (companyPoint) {
                    company.point_usc = companyPoint.point_usc
                }

                // Tính trọng số công ty
                let list_type_noti
                let list = []
                list_type_noti = await PermissionNotify.distinct('pn_type_noti', {
                    pn_usc_id: idCompany,
                    pn_id_new: 0,
                }).lean()
                for (let i = 0; i < list_type_noti.length; i++) {
                    const pn_type_noti = list_type_noti[i]

                    const rs_usc = await PermissionNotify.aggregate([{
                            $match: {
                                pn_usc_id: idCompany,
                                pn_id_new: 0,
                                pn_type_noti: pn_type_noti,
                            },
                        },
                        {
                            $lookup: {
                                from: 'Users',
                                localField: 'pn_id_chat',
                                foreignField: '_id',
                                as: 'user',
                            },
                        },
                        { $unwind: '$user' },
                        {
                            $project: {
                                id: '$user._id',
                                type365: '$user.type',
                                email: '$user.email',
                                phoneTK: '$user.phoneTK',
                            },
                        },
                    ])
                    list.push({
                        pn_type_noti: pn_type_noti,
                        rs_usc: rs_usc,
                    })
                }
                let totalPer = 0
                let detailPercent = {
                    Logo: 0,
                    LinhVuc: 0,
                    MaSoThue: 0,
                    Tinh_ThanhPho: 0,
                    Quan_Huyen: 0,
                    DiaChi: 0,
                    Email: 0,
                    GioiThieu: 0,
                    Video: 0,
                    Anh: 0,
                    Vip: 0,
                    tkPhanQuyen: 0,
                    TinTuyenDung: 0,
                    Website: 0,
                    QuyMo: 0,
                    Tong: 0,
                }
                const Com = await Users.findOne({
                    idTimViec365: idCompany,
                    type: 1,
                })
                if (Com && Com.inForCompany) {
                    if (Com.avatarUser) {
                        totalPer += 5
                        detailPercent.Logo = 5
                    }
                    if (Com.inForCompany.timviec365.usc_lv) {
                        totalPer += 10
                        detailPercent.LinhVuc = 10
                    }
                    if (Com.inForCompany.timviec365.usc_mst > 0) {
                        totalPer += 3
                        detailPercent.MaSoThue = 3
                    }
                    if (Com.city) {
                        totalPer += 15
                        detailPercent.Tinh_ThanhPho = 15
                    }
                    if (Com.district) {
                        totalPer += 10
                        detailPercent.Quan_Huyen = 10
                    }
                    if (Com.address) {
                        totalPer += 5
                        detailPercent.DiaChi = 5
                    }
                    if (Com.inForCompany.timviec365.usc_vip > 0) {
                        totalPer += 10
                        detailPercent.Email = 10
                    } else if (Com.inForCompany.timviec365.usc_vip === 0) {
                        totalPer += 5
                        detailPercent.Email = 5
                    }
                    if (Com.inForCompany.description) {
                        const string = Com.inForCompany.description
                        const string1 = sanitizeHtml(string, {
                            allowedTags: [],
                            allowedAttributes: {},
                        })
                        totalPer += 5
                        detailPercent.GioiThieu += 5
                        const point = Math.floor(string1.length / 50)
                        if (point <= 14) {
                            totalPer += point
                            detailPercent.GioiThieu += point
                        } else {
                            totalPer += 15
                            detailPercent.GioiThieu += 15
                        }
                    }

                    if (
                        storageVideo.length > 0 ||
                        Com.inForCompany.timviec365.usc_video
                    ) {
                        totalPer += 4
                        detailPercent.Video = 4
                    }
                    if (storageImage.length) {
                        const length = storageImage.length
                        if (length <= 3) {
                            totalPer += length
                            detailPercent.Anh = length
                        } else {
                            totalPer += 4
                            detailPercent.Anh = 4
                        }
                    }
                    if (Com.inForCompany.timviec365.usc_vip) {
                        totalPer += Com.inForCompany.timviec365.usc_vip
                        detailPercent.Vip = Com.inForCompany.timviec365.usc_vip
                    }
                    let num = 0
                    const countList = list ? list.length : 0
                    for (let i = 0; i < countList; i++) {
                        num += list[i].rs_usc.length
                    }
                    if (num <= 4) {
                        totalPer += num
                        detailPercent.tkPhanQuyen = num
                    } else {
                        totalPer += 5
                        detailPercent.tkPhanQuyen = 5
                    }
                    if (Com.inForCompany.timviec365.usc_website) {
                        totalPer += 2
                        detailPercent.Website = 2
                    }
                    if (Com.inForCompany.timviec365.usc_size) {
                        totalPer += 2
                        detailPercent.QuyMo = 2
                    }
                }
                detailPercent.Tong = totalPer
                company.DetailPercent = detailPercent
                return functions.success(res, 'Lấy thông tin công ty thành công', {
                    detail_company: company,
                    items: listNew,
                    tu_khoa: tagBlog,
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

exports.notiForCom = async(req, res, next) => {
    try {
        return functions.success(res, 'Lấy danh sách uv thành công', {
            total: 0,
            data: [],
        })
        const iduser = req.user.data.idTimViec365
        let data = await Notification.aggregate([{
                $match: {
                    usc_id: iduser,
                    not_active: { $in: [0, 1, 9] },
                },
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'use_id',
                    foreignField: 'idTimViec365',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            {
                $project: {
                    not_id: 1,
                    use_id: '$user.idTimViec365',
                    use_logo: '$user.avatarUser',
                    use_create_time: '$user.createdAt',
                    use_first_name: '$user.userName',
                    use_gioi_tinh: '$user.inForPerson.account.gender',
                    not_active: 1,
                    not_time: 1,
                },
            },
        ])
        if (data.length > 0) {
            data.forEach((user) => {
                //xử lí hình ảnh
                user.use_logo =
                    functions.cdnImageAvatar(Number(user.use_create_time) * 1000) +
                    user.use_logo
                    //xử lí thông báo
                if (user.not_active == 1) {
                    user.tb = user.use_first_name + ': vừa nộp hồ sơ.'
                } else if (user.not_active == 0) {
                    user.tb = 'Chuyên viên gửi ứng viên: ' + user.use_first_name
                } else if (user.not_active == 9) {
                    user.tb = 'Bạn có tin nhắn từ ứng viên: ' + user.use_first_name
                }
            })
            const totalCount = await functions.findCount(Notification, {
                usc_id: iduser,
                not_active: { $in: [0, 1, 9] },
            })
            return functions.success(res, 'Lấy danh sách uv thành công', {
                total: totalCount,
                data: data,
            })
        }
        return functions.setError(res, 'không tìm thấy dữ liệu')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error.message)
    }
}

//Xóa thông báo NTD
exports.delNotiForCom = async(req, res, next) => {
    try {
        const iduser = req.user.data.idTimViec365
        const type = req.user.data.type
        if (type == 2) {
            await Notification.deleteMany({
                usc_id: iduser,
                not_active: { $in: [3, 8] },
            })
        } else {
            await Notification.deleteMany({
                usc_id: iduser,
                not_active: { $in: [0, 1, 9] },
            })
        }
        return functions.success(res, 'Xóa thông báo thành công')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error.message)
    }
}
exports.CheckComUsePointYet = async(req, res, next) => {
    try {
        const use_chat_id = req.body.id_chat_user
        const com_email = req.body.com_email
        let check = false
        if (use_chat_id && com_email) {
            let use_id = 0
            let userid = 0
                //check UV va NTD
            let [qr_check_uv, qr_check_com] = await Promise.all([
                Users.findOne({
                    _id: Number(use_chat_id),
                    type: { $ne: 1 },
                }).lean(),
                Users.findOne({
                    $or: [{ phoneTK: com_email }, { email: com_email }],
                    type: 1,
                }).lean(),
            ])
            if (qr_check_uv) {
                use_id = qr_check_uv.idTimViec365
            }
            if (qr_check_com) {
                userid = qr_check_com.idTimViec365
            }
            if (userid > 0 && use_id > 0) {
                let [db_qr, qr_count] = await Promise.all([
                    Users.aggregate([{
                            $match: {
                                idTimViec365: Number(userid),
                            },
                        },
                        {
                            $lookup: {
                                from: 'Tv365PointUsed',
                                localField: 'idTimViec365',
                                foreignField: 'use_id',
                                as: 'point',
                            },
                        },
                        { $unwind: '$point' },
                        {
                            $match: {
                                'point.use_id': Number(use_id),
                            },
                        },
                    ]),
                    ApplyForJob.aggregate([{
                            $match: { nhs_use_id: Number(use_id) },
                        },
                        {
                            $lookup: {
                                from: 'NewTV365',
                                localField: 'nhs_new_id',
                                foreignField: 'new_id',
                                as: 'new',
                            },
                        },
                        { $unwind: '$new' },
                        {
                            $match: {
                                'new.new_user_id': userid,
                            },
                        },
                    ]),
                ])
                console.log(db_qr, qr_count)
                if (db_qr.length > 0 || qr_count.length > 0) {
                    check = true
                }

                return functions.success(res, 'Kiểm tra thành công', { check })
            }
            return functions.setError(res, 'Tài khoản UV hoac NTD không tồn tại')
        }
        return functions.setError(res, 'Thông tin truyền lên không đầy đủ')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error.message)
    }
}

// api gửi mã OTP qua appChat luồng ntd (dổi mật khẩu)
exports.changePasswordSendOTP = async(req, res, next) => {
    try {
        let email = req.user.data.email
        let id = req.user.data._id
        let otp = await functions.randomNumber
        let data = {
            UserID: id,
            SenderID: 1191,
            MessageType: 'text',
            Message: `Chúng tôi nhận được yêu cầu tạo mật khẩu mới tài khoản nhà tuyển dụng trên timviec365.vn. Mã OTP của bạn là: '${otp}'`,
        }
        await Users.updateOne({ _id: id, type: 1 }, {
            $set: {
                otp: otp,
            },
        })
        await functions.getDataAxios(
            'http://210.245.108.202:9000/api/message/SendMessageIdChat',
            data
        )

        return functions.success(res, 'update thành công')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// Lấy danh sách tin tuyển dụng đã đăng cho app
exports.listNewsApp = async(req, res, next) => {
    try {
        let idCompany = req.body.com_id ?
            req.body.com_id :
            req.user.data.idTimViec365
        let page = Number(req.body.page) || 1
        let pageSize = Number(req.body.pageSize) || 20
        const skip = (page - 1) * pageSize
        const limit = pageSize
        const condition = {
            new_user_id: Number(idCompany),
            $or: [{ new_md5: null }, { new_md5: '' }],
        }
        let [listPost, total, dv_bl] = await Promise.all([
            NewTV365.aggregate([{
                    $match: condition,
                },
                {
                    $sort: {
                        new_id: -1,
                    },
                },
                {
                    $skip: skip,
                },
                {
                    $limit: limit,
                },
                {
                    $lookup: {
                        from: 'Users',
                        localField: 'new_user_id',
                        foreignField: 'idTimViec365',
                        as: 'user',
                    },
                },
                {
                    $unwind: '$user',
                },
                {
                    $match: {
                        'user.type': 1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        new_id: 1,
                        new_title: 1,
                        new_alias: 1,
                        new_update_time: 1,
                        new_update_time_2: 1,
                        new_city: 1,
                        new_cat_id: 1,
                        new_money: 1,
                        new_view_count: 1,
                        new_bao_luu: 1,
                        new_han_nop: 1,
                        new_hot: 1,
                        new_gap: 1,
                        new_cao: 1,
                        new_nganh: 1,
                        new_create_time: 1,
                        time_bao_luu: 1,
                        usc_id: '$user.idTimViec365',
                        usc_company: '$user.userName',
                        usc_alias: '$user.alias',
                        chat365_id: '$user._id',
                        usc_time_login: '$user.time_login',
                        usc_create_time: '$user.createdAt',
                        usc_logo: '$user.avatarUser',
                        usc_badge: '$user.inForCompany.timviec365.usc_badge',
                        usc_star: '$user.inForCompany.timviec365.usc_star',
                        isOnline: '$user.isOnline',
                    },
                },
            ]),
            functions.findCount(NewTV365, condition),
            TblBaoLuu.find({ id_ntd_bl: idCompany }).sort({ _id: -1 }),
        ])
        if (listPost.length > 0) {
            await Promise.all(
                listPost.map(async(element) => {
                    const cate = element.new_cat_id[0]
                    const city = element.new_city[0]
                        // element.new_cat_id = element.new_cat_id.toString();
                        // element.new_city = element.new_city.toString();

                    let [
                        countApply,
                        countUV,
                        checkPin,
                        new_money_str,
                        logo,
                        url,
                        countLike,
                        countComments,
                        listWordReacted,
                        countVote,
                    ] = await Promise.all([
                        functions.findCount(ApplyForJob, {
                            nhs_new_id: element.new_id,
                            nhs_kq: 0,
                        }),
                        functions.findCount(Users, {
                            // "inForPerson.candidate.cv_cate_id": { $all: [cate] },
                            'inForPerson.candidate.cv_city_id': {
                                $all: [city],
                            },
                        }),
                        Order.findOne({ id_user: idCompany }).limit(1),
                        functions.new_money_tv(0, 0, 0, 0, 0, element.new_money),
                        // Xử lý hình ảnh cdn
                        functions.getUrlLogoCompany(
                            element.usc_create_time,
                            element.usc_logo
                        ),
                        //xử lí đường dẫn
                        functions.renderAliasURL(
                            element.new_id,
                            element.new_alias,
                            element.new_title
                        ),
                        serviceNew.inforLikeChild(element.new_id, 0),
                        CommentPost.countDocuments({
                            cm_parent_id: 0,
                            cm_new_id: Number(element.new_id),
                        }),

                        // Từ khóa liên quan (wordReacted)
                        Keyword.aggregate([{
                                $match: {
                                    key_name: { $ne: '' },
                                    key_301: '',
                                    key_cb_id: 0,
                                    key_city_id: { $in: element.new_city },
                                    key_cate_lq: { $in: element.new_cat_id },
                                    // key_name: {
                                    // $not: /thực tập|chuyên viên|nhân viên|giám đốc|trưởng phòng|trưởng nhóm|trợ lý|phó trưởng phòng|phó giám đốc|quản lý|quản đốc/,
                                    // },
                                },
                            },
                            { $limit: 3 },
                            {
                                $project: {
                                    _id: 0,
                                    key_id: 1,
                                    key_cate_id: 1,
                                    key_city_id: 1,
                                    key_qh_id: 1,
                                    key_name: 1,
                                    key_cb_id: 1,
                                    key_type: 1,
                                },
                            },
                        ]),
                        // Xử lý đếm số sao đánh giá
                        SaveVote.aggregate([{
                                $match: {
                                    id_be_vote: element.new_id,
                                    type: 'new',
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    sum: { $sum: '$star' },
                                    count: { $sum: 1 },
                                },
                            },
                        ]),
                    ])
                    if (countApply) element.applied = countApply
                    else element.applied = ''
                    if (countUV) element.count_uv = countUV
                    else element.count_uv = ''
                    if (checkPin) element.check_pin = 1
                    else element.applied = 0
                    if (new_money_str) element.new_money_str = new_money_str
                    else element.new_money_str = ''
                    element.usc_logo = logo
                    element.url = url
                    if (countLike) {
                        //xử lí đếm từng loại cảm xúc
                        let arr_count_like = countLike.map((vl_lk) => vl_lk.lk_type)
                        element.items_count_like = arr_count_like.reduce((acc, val) => {
                            acc[val] = (acc[val] || 0) + 1
                            return acc
                        }, {})
                        element.count_like = countLike.length

                        const user = await functions.getTokenUser(req, res)
                            // Xử lý luồng người dùng đăng nhập
                        if (user) {
                            const idchat = user._id // id chat
                                //ktra xem người dùng tương tác bài hay chưa
                            let LikeYet = await LikePost.findOne({
                                lk_new_id: Number(element.new_id),
                                lk_user_idchat: Number(idchat),
                                lk_type: { $lt: 8 },
                                lk_for_comment: 0,
                            })
                            element.type_lk = LikeYet ? LikeYet.lk_type : 0
                        }
                        element.listLike = countLike
                    } else {
                        element.type_lk = 0
                        element.count_like = 0
                        element.listLike = countLike
                    }

                    //Xử lí tên từ khóa cho app
                    if (listWordReacted) {
                        let array_kw =
                            typeof listWordReacted == 'object' ?
                            listWordReacted.map((item) => item.key_name) :
                            ''

                        if (array_kw != ',,') element.listWordReacted = array_kw.toString()
                        else element.listWordReacted = ''
                    } else {
                        element.listWordReacted = ''
                    }
                    element.count_comments = countComments
                    element.new_money_str = new_money_str
                        // Xử lý đếm số sao đánh giá
                    if (countVote.length > 0) {
                        element.sum_star = countVote[0].sum
                        element.count_star = countVote[0].count
                    } else {
                        element.sum_star = 0
                        element.count_star = 0
                    }

                    element.resultCountVote = []
                    for (let n = 1; n <= 5; n++) {
                        const result = await SaveVote.countDocuments({
                            id_be_vote: element.new_id,
                            type: 'new',
                            star: n,
                        })
                        element.resultCountVote.push(result)
                    }
                    //Xử lí tên tỉnh thành cho tiện ích app chat
                    if (
                        element.new_city != '' &&
                        element.new_city != null &&
                        element.new_city != 0
                    ) {
                        let array_name_city =
                            typeof element.new_city == 'string' ?
                            element.new_city.split(',') :
                            element.new_city
                        for (let t = 0; t < array_name_city.length; t++) {
                            let cit = await City.findOne({
                                    _id: array_name_city[t],
                                })
                                .select('name')
                                .lean()
                            if (cit) array_name_city[t] = cit.name
                        }
                        element.new_name_cit = array_name_city.toString()
                    } else {
                        element.new_name_cit = 'Toàn quốc'
                    }
                })
            )
            return functions.success(res, 'Lấy danh sách tin đăng thành công', {
                total,
                items: listPost,
                dv_bl,
            })
        }
        return functions.setError(res, ' không có bài viết nào tồn tại')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error.message)
    }
}

//danh sách ứng viên gợi ý cho nhà tuyển dụng
exports.candidateAIForNew = async(req, res, next) => {
    try {
        const str_new_id = String(req.body.new_id)
        const idTimViec365 = req.user.data.idTimViec365
        console.log(str_new_id)
        const pageSize = Number(req.body.pageSize) || 6
        if (str_new_id) {
            let arr_new_id = str_new_id.split(',')
            let list_new_res = []
            let arr_new_detail = await NewTV365.find({ new_id: { $in: arr_new_id } })
                .select('new_id new_title')
                .lean()

            await Promise.all(
                arr_new_id.map(async(new_id) => {
                    const dataSuggestCandidate = await axios({
                        method: 'post',
                        url: 'http://43.239.223.21:9001/recommend_ntd',
                        data: {
                            site: 'timviec365',
                            new_id,
                        },
                        headers: { 'Content-Type': 'multipart/form-data' },
                    })
                    let listCandidate = []
                    let listResult = []
                    if (dataSuggestCandidate) {
                        let { list_id_cat_city, list_id_cat_not_city, list_id } =
                        dataSuggestCandidate.data
                        let listIdFind = list_id ? list_id.map(Number) : []
                            // if (list_id_cat_city.length > pageSize - 1) {
                            //     listIdFind = list_id_cat_city.slice(0, pageSize);
                            // } else {
                            //     listIdFind = list_id_cat_city.concat(list_id_cat_not_city).slice(0, pageSize);
                            // }
                        listCandidate = await Users.aggregate([{
                                $match: {
                                    idTimViec365: { $in: listIdFind },
                                    type: { $ne: 1 },
                                },
                            },
                            {
                                $sort: { updatedAt: -1 },
                            },
                            {
                                $limit: pageSize,
                            },
                            {
                                $project: {
                                    _id: 0,
                                    use_id: '$idTimViec365',
                                    use_email: '$email',
                                    use_phone_tk: '$phoneTK',
                                    use_phone: '$phone',
                                    use_first_name: '$userName',
                                    use_update_time: '$updatedAt',
                                    use_create_time: '$createdAt',
                                    use_logo: '$avatarUser',
                                    use_email_lienhe: '$emailContact',
                                    use_gioi_tinh: '$inForPerson.account.gender',
                                    use_birth_day: '$inForPerson.account.birthday',
                                    use_city: '$city',
                                    use_quanhuyen: '$district',
                                    use_address: '$address',
                                    cv_user_id: '$idTimViec365',
                                    use_password: '$password',
                                    avatarUser: 1,
                                    city: '$inForPerson.candidate.cv_city_id',
                                    cv_title: '$inForPerson.candidate.cv_title',
                                    cv_cate_id: '$inForPerson.candidate.cv_cate_id',
                                    cv_city_id: '$inForPerson.candidate.cv_city_id',
                                    cv_capbac_id: '$inForPerson.candidate.cv_capbac_id',
                                    cv_money_id: '$inForPerson.candidate.cv_money_id',
                                    cv_exp: '$inForPerson.account.experience',
                                    cv_kynang: '$inForPerson.candidate.cv_kynang',
                                    cv_tc_name: '$inForPerson.candidate.cv_tc_name',
                                    cv_tc_cv: '$inForPerson.candidate.cv_tc_cv',
                                    cv_tc_phone: '$inForPerson.candidate.cv_tc_phone',
                                    cv_tc_email: '$inForPerson.candidate.cv_tc_email',
                                    cv_tc_company: '$inForPerson.candidate.cv_tc_company',
                                    um_type: '$inForPerson.candidate.um_type',
                                    um_min_value: '$inForPerson.candidate.um_min_value',
                                    um_max_value: '$inForPerson.candidate.um_max_value',
                                    um_unit: '$inForPerson.candidate.um_unit',
                                    muc_luong: '$inForPerson.candidate.muc_luong',
                                    chat365_id: '$_id',
                                    chat365_secret: '$chat365_secret',
                                    id_qlc: '$idQLC',
                                    isOnline: 1,
                                    time_login: 1,
                                },
                            },
                        ])
                        for (let t = 0; t < listIdFind.length; t++) {
                            for (let u = 0; u < listCandidate.length; u++) {
                                if (listIdFind[t] == listCandidate[u].use_id) {
                                    listResult.push(listCandidate[u])
                                }
                            }
                        }
                        let listUvSave = await SaveCandidate.find({
                                usc_id: idTimViec365,
                                use_id: { $in: listIdFind },
                            })
                            .select('use_id')
                            .lean()
                        if (listResult.length > 0) {
                            for (let t = 0; t < listResult.length; t++) {
                                const element = listResult[t]
                                if (element) {
                                    element.use_city = element.use_city ?
                                        element.use_city.toString() :
                                        ''
                                    element.use_logo =
                                        functions.cdnImageAvatar(element.use_create_time * 1000) +
                                        element.use_logo
                                    let checkSave = listUvSave.find(
                                        (e) => e.use_id == element.use_id
                                    )
                                    if (checkSave) {
                                        element.statusSaveCandi = 1
                                    }
                                }
                            }
                        }
                    }
                    let new_detail = arr_new_detail.find((item) => item.new_id == new_id)
                    list_new_res.push({
                        new_id,
                        listResult,
                        new_title: new_detail.new_title,
                    })
                })
            )

            return functions.success(
                res,
                'List simulate candidate for candidate is successfully', {
                    list_new_res,
                }
            )
        } else return functions.setError(res, 'Missing the new_id')
    } catch (e) {
        // console.log(e);
        return functions.setError(res, e.message)
    }
}