const { isNull } = require('util')
const { deflateSync } = require('zlib')

const fnc = require('../../services/qlc/functions')
const functions = require('../../services/functions')
const md5 = require('md5')

const Users = require('../../models/Users')
const Deparment = require('../../models/qlc/Deparment')
const TimeSheet = require('../../models/qlc/TimeSheets')

//dang k� t�i kho?n nh�n vi�n
exports.register = async(req, res) => {
    try {
        const {
            userName,
            emailContact,
            phoneTK,
            password,
            com_id,
            address,
            position_id,
            dep_id,
            phone,
            avatarUser,
            role,
            group_id,
            birthday,
            gender,
            married,
            experience,
            startWorkingTime,
            education,
            otp,
            team_id,
        } = req.body
        const createdAt = new Date()

        if ((userName && password && com_id && address && phoneTK) !== undefined) {
            let checkPhone = await functions.checkPhoneNumber(phoneTK)
            if (checkPhone) {
                let user = await Users.findOne({
                    phoneTK: phoneTK,
                    type: { $ne: 1 },
                }).lean()
                let MaxId = await functions.getMaxUserID('user')
                let _id = MaxId._id
                if (!user) {
                    const user = new Users({
                        _id: _id,
                        emailContact: emailContact,
                        phoneTK: phoneTK,
                        userName: userName,
                        phone: phone,
                        avatarUser: avatarUser,
                        type: 2,
                        password: md5(password),
                        address: address,
                        createdAt: functions.getTimeNow(),
                        fromWeb: 'quanlychung',
                        chat365_secret: Buffer.from(_id.toString()).toString('base64'),
                        role: 0,
                        avatarUser: null,
                        idQLC: MaxId._idQLC,
                        idTimViec365: MaxId._idTV365,
                        idRaoNhanh365: MaxId._idRN365,
                        'inForPerson.employee.position_id': position_id,
                        'inForPerson.employee.com_id': com_id,
                        'inForPerson.employee.dep_id': dep_id,
                        'inForPerson.employee.group_id': group_id,
                        'inForPerson.employee.team_id': team_id,
                        'inForPerson.account.birthday': Date.parse(birthday) / 1000,
                        'inForPerson.account.gender': gender,
                        'inForPerson.account.married': married,
                        'inForPerson.account.experience': experience,
                        // "inForPerson.employee.start_working_time": Date.parse(startWorkingTime) / 1000,
                        'inForPerson.account.education': education,
                    })
                    await user.save()

                    const token = await functions.createToken({
                            _id: user._id,
                            idTimViec365: user.idTimViec365,
                            idQLC: user.idQLC,
                            idRaoNhanh365: user.idRaoNhanh365,
                            emailContact: user.emailContact,
                            phoneTK: user.phoneTK,
                            createdAt: user.createdAt,
                            type: user.type,
                            com_id: user.inForPerson.employee.com_id,
                            userName: user.userName,
                            position_id: user.inForPerson.employee.position_id,
                            dep_id: user.inForPerson.employee.dep_id,
                            group_id: user.inForPerson.employee.group_id,
                            team_id: user.inForPerson.employee.team_id,
                            // startWorkingTime: user.inForPerson.employee.startWorkingTime,
                            married: user.inForPerson.account.married,
                            experience: user.inForPerson.account.experience,
                            education: user.inForPerson.account.education,
                        },
                        '1d'
                    )
                    const refreshToken = await functions.createToken({ userId: user._id },
                        '1y'
                    )
                    let data = {
                        access_token: token,
                        refresh_token: refreshToken,
                    }
                    return functions.success(res, 't?o t�i kho?n th�nh c�ng', {
                        user,
                        data,
                    })
                } else {
                    return functions.setError(res, 'SDT d� t?n t?i')
                }
            } else {
                return functions.setError(res, ' d?nh d?ng sdt kh�ng d�ng')
            }
        } else {
            return functions.setError(res, 'M?t trong c�c tru?ng y�u c?u b? thi?u')
        }
    } catch (e) {
        return functions.setError(res, e.message)
    }
}

exports.register2 = async(req, res) => {
    try {
        // const {
        //     userName,
        //     emailContact,
        //     password,
        //     com_id,
        //     address,
        //     position_id,
        //     dep_id,
        //     phone,
        //     avatarUser,
        //     role,
        //     group_id,
        //     birthday,
        //     gender,
        //     married,
        //     experience,
        //     startWorkingTime,
        //     education,
        //     otp,
        //     team_id,
        //     email
        // } = req.body
        const email = req.body.email;
        const userName = req.body.name;
        const emailContact = "";
        const password = req.body.password;
        const com_id = 220309;
        const address = req.body.address;
        const dep_id = 0;
        const dep_name = req.body.dep_name;
        // let department = await Deparment.findOne({dep_name:dep_name});
        // dep_id = department.dep_id;
        const position_id = 3;
        const createdAt = new Date()
        const phone = req.body.sdt;
        const now = new Date().getTime() / 1000;
        //await Users.deleteMany({ email: email })
        if ((userName && password && com_id && address && email) !== undefined) {
            let user = await Users.findOne({
                email: email,
                type: { $ne: 1 },
            }).lean()
            let MaxId = await functions.getMaxUserID('user')
            let _id = MaxId._id
            if (!user) {
                const user = new Users({
                    _id: _id,
                    email: email,
                    emailContact: emailContact,
                    userName: userName,
                    phone: phone,
                    avatarUser: "",
                    type: 2,
                    password: md5(password),
                    address: address,
                    createdAt: functions.getTimeNow(),
                    fromWeb: 'quanlychung',
                    chat365_secret: Buffer.from(_id.toString()).toString('base64'),
                    role: 0,
                    authentic: 1,
                    avatarUser: null,
                    idQLC: MaxId._idQLC,
                    idTimViec365: MaxId._idTV365,
                    idRaoNhanh365: MaxId._idRN365,
                    'inForPerson.employee.position_id': position_id,
                    'inForPerson.employee.com_id': com_id,
                    'inForPerson.employee.dep_id': dep_id,
                    'inForPerson.employee.group_id': 0,
                    'inForPerson.employee.team_id': 0,
                    'inForPerson.account.birthday': now,
                    'inForPerson.account.gender': 0,
                    'inForPerson.account.married': 0,
                    'inForPerson.account.experience': 1,
                    // "inForPerson.employee.start_working_time": Date.parse(startWorkingTime) / 1000,
                    'inForPerson.account.education': 1,
                })
                await user.save()

                const token = await functions.createToken({
                        _id: user._id,
                        idTimViec365: user.idTimViec365,
                        idQLC: user.idQLC,
                        idRaoNhanh365: user.idRaoNhanh365,
                        emailContact: user.emailContact,
                        phoneTK: user.phoneTK,
                        createdAt: user.createdAt,
                        type: user.type,
                        com_id: user.inForPerson.employee.com_id,
                        userName: user.userName,
                        position_id: user.inForPerson.employee.position_id,
                        dep_id: user.inForPerson.employee.dep_id,
                        group_id: user.inForPerson.employee.group_id,
                        team_id: user.inForPerson.employee.team_id,
                        // startWorkingTime: user.inForPerson.employee.startWorkingTime,
                        married: user.inForPerson.account.married,
                        experience: user.inForPerson.account.experience,
                        education: user.inForPerson.account.education,
                    },
                    '1d'
                )
                const refreshToken = await functions.createToken({ userId: user._id },
                    '1y'
                )
                let data = {
                    access_token: token,
                    refresh_token: refreshToken,
                }
                return functions.success(res, 't?o t�i kho?n th�nh c�ng', {
                    user,
                    data,
                })
            } else {
                return functions.setError(res, 'SDT d� t?n t?i')
            }
        } else {
            return functions.setError(res, 'M?t trong c�c tru?ng y�u c?u b? thi?u')
        }
    } catch (e) {
        console.log("register", e);
        return functions.setError(res, e.message)
    }
}

// h�m g?i otp qua gmail khi k�ch ho?t t�i kho?n
exports.verify = async(req, res) => {
    try {
        let otp = req.body.ma_xt || null
        let phoneTK = req.user.data.phoneTK
        let data = []
        if (otp) {
            data = await Users.updateOne({ phoneTK: phoneTK, type: 2 }, {
                $set: {
                    otp: otp,
                },
            })
            return functions.success(res, 'luu OTP th�nh c�ng', { data })
        } else if (!otp) {
            await Users.updateOne({ phoneTK: phoneTK, type: 2 }, {
                $set: {
                    authentic: 1,
                },
            })
            return functions.success(res, 'x�c th?c th�nh c�ng')
        } else {
            return functions.setError(res, 'thi?u d? li?u sdt')
        }
    } catch (e) {
        return functions.setError(res, e.message)
    }
}
exports.verifyCheckOTP = async(req, res) => {
    try {
        let otp = req.body.ma_xt || null
        let phoneTK = req.user.data.phoneTK

        if (otp) {
            let findUser = await Users.findOne({ phoneTK: phoneTK, type: 2 }).select(
                'otp'
            )
            if (findUser) {
                let data = findUser.otp
                if (data === otp) {
                    return functions.success(res, 'x�c th?c th�nh c�ng')
                } else {
                    return functions.setError(res, 'x�c th?c th?t b?i')
                }
            } else {
                return functions.setError(res, 't�i kho?n kh�ng t?n t?i')
            }
        } else {
            return functions.setError(res, 'vui l�ng nh?p m� x�c th?c')
        }
    } catch (e) {
        return functions.setError(res, e.message)
    }
}

//h�m dang nh?p
exports.login = async(req, res, next) => {
    try {
        let request = req.body,
            account = request.account,
            password = request.password,
            pass_type = request.pass_type
        let type = request.type
        if (account && password && type) {
            let user

            if (!pass_type) {
                password = md5(password)
            }
            user = await Users.findOne({
                $or: [
                    { phoneTK: account },
                    { email: account }
                ],
                password: password,
                type: Number(type),
            }).lean();

            // if (!(await functions.checkPhoneNumber(account))) {
            //     user = await Users.findOne({
            //         email: account,
            //         password: password,
            //         type: type,
            //     }).lean()
            // } else {
            //     user = await Users.findOne({
            //         phoneTK: account,
            //         password: password,
            //         type: type,
            //     }).lean()
            // }

            if (user) {
                let com_id = 0
                if (user.type === 1) {
                    com_id = user.idQLC
                } else if (user.type == 2 && user.inForPerson != null) {
                    com_id = user.inForPerson.employee.com_id
                }
                const token = await functions.createToken({
                        _id: user._id,
                        idTimViec365: user.idTimViec365,
                        idQLC: user.idQLC,
                        idRaoNhanh365: user.idRaoNhanh365,
                        email: user.email,
                        phoneTK: user.phoneTK,
                        createdAt: user.createdAt,
                        type: user.type,
                        com_id: com_id,
                        userName: user.userName,
                    },
                    '1d'
                )
                const refreshToken = await functions.createToken({ userId: user._id },
                    '1y'
                )
                let data = {}
                    // if comp
                if (user.type === 1) {
                    let userData = await Users.aggregate([{
                            $match: {
                                _id: user._id,
                            },
                        },
                        {
                            $project: {
                                com_info: {
                                    com_id: '$_id',
                                    com_email: '$email',
                                },
                                authentic: '$authentic',
                                user_info: {
                                    com_id: '$idQLC',
                                    com_parent_id: '$inForCompany.com_parent_id',
                                    com_name: '$userName',
                                    com_email: '$emailContact',
                                    com_phone_tk: '$phoneTK',
                                    com_phone: '$phone',
                                    type_timekeeping: '$inForCompany.cds.type_timekeeping',
                                    id_way_timekeeping: '$inForCompany.cds.id_way_timekeeping',
                                    com_logo: '$avatarUser',
                                    com_pass: '$password',
                                    com_address: '$address',
                                    com_role_id: '$inForCompany.cds.com_role_id',
                                    com_size: '$inForCompany.com_size',
                                    com_description: '$inForCompany.description',
                                    com_create_time: '$createdAt',
                                    com_update_time: '$updatedAt',
                                    com_authentic: '$authentic',
                                    com_lat: '$latitude',
                                    com_lng: '$longtitude',
                                    com_qr_logo: '$inForCompany.cds.com_qr_logo',
                                    enable_scan_qr: '$inForCompany.cds.enable_scan_qr',
                                    com_vip: '$inForCompany.cds.com_vip',
                                    com_ep_vip: '$inForCompany.cds.com_ep_vip',
                                    ep_crm: '$inForCompany.cds.ep_crm',
                                    scan: '$scan',
                                },
                            },
                        },
                    ])
                    data = userData[0]
                    data['access_token'] = token
                    data['refresh_token'] = refreshToken
                    data['user_info'] = {
                        ...data['user_info'],
                        com_pass_encrypt: '',
                        com_path: '',
                        base36_path: '',
                        from_source: '',
                        com_id_tv365: '0',
                        com_quantity_time: '0',
                        com_kd: '0',
                        check_phone: '0',
                    }
                    data.type = type
                } else if (user.type === 2) {
                    let userData = await Users.aggregate([{
                            $match: {
                                _id: user._id,
                            },
                        },
                        {
                            $lookup: {
                                from: 'QLC_Deparments',
                                foreignField: 'dep_id',
                                localField: 'inForPerson.employee.dep_id',
                                as: 'deparment',
                            },
                        },
                        {
                            $project: {
                                user_info: {
                                    ep_id: '$idQLC',
                                    ep_mail: '$emailContact',
                                    ep_phone_tk: '$phoneTK',
                                    ep_name: '$userName',
                                    ep_phone: '$phoneTK',
                                    ep_email_lh: '$emailContact',
                                    ep_pass: '$password',
                                    com_id: '$inForPerson.employee.com_id',
                                    dep_id: '$inForPerson.employee.dep_id',
                                    ep_address: '$address',
                                    ep_birth_day: '$inForPerson.account.birthday',
                                    ep_gender: '$inForPerson.account.gender',
                                    ep_married: '$inForPerson.account.married',
                                    ep_education: '$inForPerson.account.education',
                                    ep_exp: '$inForPerson.account.experience',
                                    ep_authentic: '$authentic',
                                    role_id: '$role',
                                    ep_image: '$avatarUser',
                                    create_time: '$createdAt',
                                    update_time: '$updatedAt',
                                    start_working_time: '$inForPerson.employee.start_working_time',
                                    position_id: '$inForPerson.employee.position_id',
                                    group_id: '$inForPerson.employee.group_id',
                                    ep_description: '$inForPerson.employee.ep_description',
                                    ep_featured_recognition: '$inForPerson.employee.ep_featured_recognition',
                                    ep_status: '$inForPerson.employee.ep_status',
                                    ep_signature: '$inForPerson.employee.ep_signature',
                                    allow_update_face: '$inForPerson.employee.allow_update_face',
                                    version_in_use: '$inForPerson.employee.version_in_use',
                                    ep_id_tv365: '$idTimViec365',
                                    scan: '$scan',
                                    dep_name: {
                                        $first: '$deparment.dep_name',
                                    },
                                },
                            },
                        },
                    ])

                    data = userData[0]
                    data['access_token'] = token
                    data['refresh_token'] = refreshToken
                    data['user_info'] = {
                        ...data['user_info'],
                        ep_pass_encrypt: '',
                        from_source: '',
                    }
                    data.type = user.type

                    // get com name
                    if (data['user_info'].com_id) {
                        const compid = data['user_info'].com_id

                        const company = await Users.aggregate([{
                                $match: {
                                    idQLC: compid,
                                },
                            },
                            {
                                $project: {
                                    comp_name: '$userName',
                                },
                            },
                        ]);
                        if (company && company.length) {
                            data['user_info'] = {
                                ...data['user_info'],
                                com_name: company[0].comp_name,
                            }
                        }
                    }
                }

                return functions.success(res, '�ang nh?p th�nh c�ng', { data })
            } else {
                // N?u l� t�i kho?n c�ng ty th� t�m t�i kho?n c?a d?i tu?ng c�n l?i
                if (type == 1) {
                    if (!(await functions.checkPhoneNumber(account))) {
                        user = await Users.findOne({
                            email: account,
                            password: password,
                            type: { $ne: 1 },
                        }).lean()
                    } else {
                        user = await Users.findOne({
                            phoneTK: account,
                            password: password,
                            type: { $ne: 1 },
                        }).lean()
                    }
                }
                // C�n n?u l� t�i kho?n nh�n vi�n ho?c c� nh�n
                else {
                    if (!(await functions.checkPhoneNumber(account))) {
                        user = await Users.findOne({
                            email: account,
                            password: password,
                            type: { $in: [0, 1, 2] },
                        })
                    } else {
                        user = await Users.findOne({
                            phoneTK: account,
                            password: password,
                            type: { $in: [0, 1, 2] },
                        })
                    }
                }
                if (user) {
                    let com_id = 0
                    if (user.type === 1) {
                        com_id = user.idQLC
                    } else if (user.inForPerson && user.type == 2) {
                        com_id = user.inForPerson.employee.com_id
                    }
                    const token = await functions.createToken({
                            _id: user._id,
                            idTimViec365: user.idTimViec365,
                            idQLC: user.idQLC,
                            idRaoNhanh365: user.idRaoNhanh365,
                            email: user.email,
                            phoneTK: user.phoneTK,
                            createdAt: user.createdAt,
                            type: user.type,
                            com_id: com_id,
                            userName: user.userName,
                        },
                        '1d'
                    )
                    const refreshToken = await functions.createToken({ userId: user._id },
                        '1y'
                    )

                    let userData = await Users.aggregate([{
                            $match: {
                                _id: user._id,
                            },
                        },
                        {
                            $project: {
                                com_info: {
                                    com_id: '$_id',
                                    com_email: '$email',
                                },
                                authentic: '$authentic',
                                user_info: {
                                    com_id: '$idQLC',
                                    com_parent_id: '$inForCompany.com_parent_id',
                                    com_name: '$userName',
                                    com_email: '$emailContact',
                                    com_phone_tk: '$phoneTK',
                                    type_timekeeping: '$inForCompany.cds.type_timekeeping',
                                    id_way_timekeeping: '$inForCompany.cds.id_way_timekeeping',
                                    com_logo: '$avatarUser',
                                    com_pass: '$password',
                                    com_address: '$address',
                                    com_role_id: '$inForCompany.cds.com_role_id',
                                    com_size: '$inForCompany.com_size',
                                    com_description: '$inForCompany.description',
                                    com_create_time: '$createdAt',
                                    com_update_time: '$updatedAt',
                                    com_authentic: '$authentic',
                                    com_lat: '$latitude',
                                    com_lng: '$longtitude',
                                    com_qr_logo: '$inForCompany.cds.com_qr_logo',
                                    enable_scan_qr: '$inForCompany.cds.enable_scan_qr',
                                    com_vip: '$inForCompany.cds.com_vip',
                                    com_ep_vip: '$inForCompany.cds.com_ep_vip',
                                    ep_crm: '$inForCompany.cds.ep_crm',
                                    scan: '$scan',
                                },
                            },
                        },
                    ])
                    let data = userData[0]
                    data['access_token'] = token
                    data['refresh_token'] = refreshToken
                    data['user_info'] = {
                        ...data['user_info'],
                        com_pass_encrypt: '',
                        com_path: '',
                        base36_path: '',
                        from_source: '',
                        com_id_tv365: '0',
                        com_quantity_time: '0',
                        com_kd: '0',
                        check_phone: '0',
                    }
                    data.type = user.type
                    return functions.success(res, '�ang nh?p th�nh c�ng', { data })
                }
                return functions.setError(res, 'T�i kho?n kh�ng t?n t?i')
            }
        }
        return functions.setError(res, 'Chua d? th�ng tin truy?n l�n')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// L?y token t? rf token
exports.getTokenFromRfToken = async(req, res) => {
    try {
        const userId = req.user.data.userId

        if (userId) {
            const user = await Users.findOne({
                _id: userId,
            })
            if (user) {
                let com_id
                if (user.type === 1) {
                    com_id = user.idQLC
                } else if (user.inForPerson && user.type == 2) {
                    com_id = user.inForPerson.employee.com_id
                }

                // tao token m?i

                const token = await functions.createToken({
                            _id: user._id,
                            idTimViec365: user.idTimViec365,
                            idQLC: user.idQLC,
                            idRaoNhanh365: user.idRaoNhanh365,
                            email: user.email,
                            phoneTK: user.phoneTK,
                            createdAt: user.createdAt,
                            type: user.type,
                            com_id: com_id,
                            userName: user.userName,
                        },
                        '1d'
                    )
                    // t?o rf token m?i
                const refreshToken = await functions.createToken({ userId: user._id },
                    '1y'
                )

                return functions.success(res, 'T?o token m?i th�nh c�ng', {
                    token: token,
                    refreshToken: refreshToken,
                    user_info: user,
                })
            }
            return functions.setError(res, 'Kh�ng t�m th?y ngu?i d�ng')
        }

        return functions.setError(res, 'Thi?u refresh token truy?n v�o')
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// h�m d?i m?t kh?u
exports.updatePasswordbyToken = async(req, res, next) => {
    try {
        let idQLC = req.user.data.idQLC
        let old_password = req.body.old_password
        let password = req.body.password
        if (!password) {
            return functions.setError(res, 'di?n thi?u th�ng tin')
        }
        if (password.length < 6) {
            return functions.setError(res, 'Password qu� ng?n')
        }
        if (old_password) {
            let checkOldPassword = await Users.findOne({
                idQLC: idQLC,
                password: md5(old_password),
                type: 2,
            })
            if (checkOldPassword) {
                await Users.updateOne({ idQLC: idQLC, type: 2 }, {
                    $set: {
                        password: md5(password),
                    },
                })
                return functions.success(res, 'c?p nh?p th�nh c�ng')
            }
            return functions.setError(
                res,
                'M?t kh?u cu kh�ng d�ng, vui l�ng ki?m tra l?i'
            )
        }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}
exports.updatePasswordbyInput = async(req, res, next) => {
    try {
        let phoneTK = req.body.phoneTK
        let email = req.body.email
        let password = req.body.password
        if (phoneTK && password) {
            if (password.length < 6) {
                return functions.setError(res, 'Password qu� ng?n')
            }
            let checkPass = await functions.getDatafindOne(Users, {
                phoneTK,
                password: md5(password),
                type: 2,
            })
            if (!checkPass) {
                await Users.updateOne({ phoneTK: phoneTK, type: 2 }, {
                    $set: {
                        password: md5(password),
                    },
                })
                return functions.success(res, 'c?p nh?p th�nh c�ng')
            }
            return functions.setError(
                res,
                'm?t kh?u d� t?n t?i, xin nh?p m?t kh?u kh�c '
            )
        } else if (email && password) {
            if (password.length < 6) {
                return functions.setError(res, 'Password qu� ng?n')
            }
            let checkPass = await functions.getDatafindOne(Users, {
                email,
                password: md5(password),
                type: 2,
            })
            if (!checkPass) {
                await Users.updateOne({ email: email, type: 2 }, {
                    $set: {
                        password: md5(password),
                    },
                })
                return functions.success(res, 'c?p nh?p th�nh c�ng')
            }
            return functions.setError(
                res,
                'm?t kh?u d� t?n t?i, xin nh?p m?t kh?u kh�c '
            )
        } else {
            return functions.setError(res, ' di?n thi?u tru?ng ')
        }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

// Cập nhật thông tin nhân viên
exports.updateInfoEmployee = async(req, res, next) => {
    try {
        let idQLC = req.user.data.idQLC
        let data = []
        const {
            userName,
            emailContact,
            phoneTK,
            password,
            com_id,
            address,
            position_id,
            dep_id,
            phone,
            group_id,
            birthday,
            gender,
            married,
            experience,
            startWorkingTime,
            education,
            otp,
        } = req.body
        let updatedAt = new Date()
        let File = req.files || null
        let avatarUser = null
        if (idQLC !== undefined) {
            let findUser = await Users.findOne({ idQLC: idQLC, type: 2 })
            if (findUser) {
                if (File && File.avatarUser) {
                    let upload = await fnc.uploadAvaEmpQLC(idQLC, File.avatarUser, [
                        '.jpeg',
                        '.jpg',
                        '.png',
                    ])
                    if (!upload) {
                        return functions.setError(res, '�?nh d?ng ?nh kh�ng h?p l?')
                    }
                    avatarUser = upload
                }
                data = await Users.updateOne({ idQLC: idQLC, type: 2 }, {
                    $set: {
                        userName: userName,
                        emailContact: emailContact,
                        phone: phone,
                        avatarUser: avatarUser,
                        'inForPerson.employee.position_id': position_id,
                        'inForPerson.employee.com_id': com_id,
                        'inForPerson.employee.dep_id': dep_id,
                        address: address,
                        otp: otp,
                        avatarUser: avatarUser,
                        updatedAt: functions.getTimeNow(),
                        'inForPerson.employee.group_id': group_id,
                        'inForPerson.account.birthday': birthday ?
                            Date.parse(birthday) / 1000 : undefined,
                        'inForPerson.account.gender': gender,
                        'inForPerson.account.married': married,
                        'inForPerson.account.experience': experience,
                        'inForPerson.employee.start_working_time': startWorkingTime,
                        'inForPerson.account.education': education,
                    },
                })
                return functions.success(res, 'c?p nh?t th�nh c�ng')
            } else {
                return functions.setError(res, 'kh�ng t�m th?y user')
            }
        } else {
            return functions.setError(res, 'kh�ng t�m th?y token')
        }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

// cập nhật info emp dùng comp tk

const EmpTL = require('../../models/Tinhluong/Tinhluong365EmpStart')
exports.updateInfoEmployeeComp = async(req, res, next) => {
    try {
        //let idQLC = req.user.data.idQLC
        let data = []
        const {
            idQLC,
            userName,
            emailContact,
            phoneTK,
            // password,
            com_id,
            address,
            position_id,
            dep_id,
            phone,
            group_id,
            birthday,
            gender,
            married,
            experience,
            startWorkingTime,
            education,
            otp,
            st_bank,
            st_stk

        } = req.body
        let updatedAt = new Date()
        let File = req.files || null
        let avatarUser = null
        if (idQLC !== undefined) {
            let findUser = await Users.findOne({ idQLC: idQLC, type: 2 })
            if (findUser) {
                if (File && File.avatarUser) {
                    let upload = await fnc.uploadAvaEmpQLC(idQLC, File.avatarUser, [
                        '.jpeg',
                        '.jpg',
                        '.png',
                    ])
                    if (!upload) {
                        return functions.setError(res, '�?nh d?ng ?nh kh�ng h?p l?')
                    }
                    avatarUser = upload
                }
                data = await Users.updateOne({ idQLC: idQLC, type: 2 }, {
                    $set: {
                        userName: userName,
                        emailContact: emailContact,
                        phone: phone,
                        avatarUser: avatarUser,
                        'inForPerson.employee.position_id': position_id,
                        'inForPerson.employee.com_id': com_id,
                        'inForPerson.employee.dep_id': dep_id,
                        address: address,
                        otp: otp,
                        avatarUser: avatarUser,
                        updatedAt: functions.getTimeNow(),
                        'inForPerson.employee.group_id': group_id,
                        'inForPerson.account.birthday': birthday ? birthday / 1000 : undefined,
                        'inForPerson.account.gender': gender,
                        'inForPerson.account.married': married,
                        'inForPerson.account.experience': experience,
                        'inForPerson.employee.start_working_time': startWorkingTime ? startWorkingTime / 1000 : undefined,
                        'inForPerson.account.education': education,
                    },
                })


                // cap nhat data tinh luong
                await EmpTL.updateOne({ st_ep_id: idQLC }, {

                    $set: {
                        st_bank: st_bank,
                        st_stk: st_stk
                    }
                })

                return functions.success(res, 'c?p nh?t th�nh c�ng')
            } else {
                return functions.setError(res, 'kh�ng t�m th?y user')
            }
        } else {
            return functions.setError(res, 'kh�ng t�m th?y token')
        }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}



// C?p nh?t ?nh nh�n vi�n
exports.updateEmpAvatar = async(req, res, next) => {
    try {
        // let idQLC = req.user.data.idQLC
        let idQLC = req.body.idQLC
        let data = []
        let File = req.files || null
        let avatarUser = null
        if (idQLC !== undefined) {
            let findUser = await Users.findOne({ idQLC: idQLC, type: 2 })
            if (findUser) {
                if (File && File.avatarUser) {
                    let upload = await fnc.uploadAvaEmpQLC(idQLC, File.avatarUser, [
                        '.jpeg',
                        '.jpg',
                        '.png',
                    ])
                    if (!upload) {
                        return functions.setError(res, '�?nh d?ng ?nh kh�ng h?p l?')
                    }
                    avatarUser = upload
                }
                data = await Users.updateOne({ idQLC: idQLC, type: 2 }, {
                    $set: {
                        avatarUser: avatarUser,
                    },
                })
                return functions.success(res, 'c?p nh?t th�nh c�ng')
            } else {
                return functions.setError(res, 'kh�ng t�m th?y user')
            }
        } else {
            return functions.setError(res, 'kh�ng t�m th?y token')
        }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

// // h�m qu�n m?t kh?u
// exports.forgotPassword = async(req, res) => {
//     try {
//         let otp = req.body.ma_xt || null
//         let phoneTK = req.body.phoneTK;
//         let email = req.body.email;
//         let password = req.body.password;
//         let re_password = req.body.re_password;
//         let data = []
//         if ((phoneTK || email) && (!otp)) {
//             let checkMail = await functions.checkEmail(email)
//             let checkPhone = await functions.checkPhoneNumber(phoneTK)
//             if (checkMail || checkPhone) {
//                 let findUser = await Users.findOne({ $or: [{ email: email, type: 2 }, { phoneTK: phoneTK, type: 2 }] })
//                 if (findUser) {
//                     let otp = functions.randomNumber
//                     data = await Users.updateOne({ $or: [{ email: email, type: 2 }, { phoneTK: phoneTK, type: 2 }] }, {
//                         $set: {
//                             otp: otp
//                         }
//                     })
//                     return functions.success(res, "G?i m� OTP th�nh c�ng", { data, otp })
//                 } else {
//                     return functions.setError(res, "t�i kho?n kh�ng t?n t?i")
//                 }
//             } else {
//                 return functions.setError(res, " email kh�ng d�ng d?nh d?ng ")
//             }

//         } else if (otp && (phoneTK || email)) {
//             let verify = await Users.findOne({ $or: [{ email: email, otp, type: 2 }, { phoneTK: phoneTK, otp, type: 2 }] });
//             if (verify != null) {
//                 await Users.updateOne({ $or: [{ email: email, type: 2 }, { phoneTK: phoneTK, type: 2 }] }, {
//                     $set: {
//                         authentic: 1
//                     }
//                 });
//                 await functions.success(res, "x�c th?c th�nh c�ng");

//             } else {
//                 return functions.setError(res, "x�c th?c th?t b?i");
//             }
//         } else if (password && re_password) {
//             let checkPassword = await functions.verifyPassword(password)
//             if (!checkPassword) {
//                 return functions.setError(res, "sai dinh dang Mk")
//             }
//             if (!password && !re_password) {
//                 return functions.setError(res, 'Missing data')
//             }
//             if (password.length < 6) {
//                 return functions.setError(res, 'Password qu� ng?n')
//             }
//             if (password !== re_password) {
//                 return functions.setError(res, 'Password nh?p l?i kh�ng tr�ng kh?p')
//             }
//             await Users.updateOne({ $or: [{ email: email, authentic: 1, type: 2 }, { phoneTK: phoneTK, authentic: 1, type: 2 }] }, {
//                 $set: {
//                     password: md5(password),
//                 }
//             });
//             return functions.success(res, 'c?p nh?p MK th�nh c�ng')

//         } else {
//             return functions.setError(res, "thi?u d? li?u")
//         }
//     } catch (e) {
//         return functions.setError(res, e.message)
//     }
// }

// show info
exports.info = async(req, res) => {
    try {
        const user = req.user.data;
        let idQLC = user.idQLC;
        const com_id = user.com_id;

        if (req.body.idQLC && user.type == 1) {
            idQLC = Number(req.body.idQLC);
        }

        const data = await Users.aggregate([{
                $match: { idQLC: idQLC, type: 2 }
            },
            {
                $lookup: {
                    from: "QLC_Deparments",
                    localField: "inForPerson.employee.dep_id",
                    foreignField: "dep_id",
                    as: "deparment"
                }
            },
            {
                $project: {
                    "userName": "$userName",
                    "dep_id": "$inForPerson.employee.dep_id",
                    "com_id": "$inForPerson.employee.com_id",
                    "position_id": "$inForPerson.employee.position_id",
                    "start_working_time": "$inForPerson.employee.start_working_time",
                    "idQLC": "$idQLC",
                    "phoneTK": "$phoneTK",
                    "phone": "$phone",
                    "address": "$address",
                    "avatarUser": "$avatarUser",
                    "authentic": "$authentic",
                    "birthday": "$inForPerson.account.birthday",
                    "gender": "$inForPerson.account.gender",
                    "married": "$inForPerson.account.married",
                    "experience": "$inForPerson.account.experience",
                    "education": "$inForPerson.account.education",
                    "emailContact": "$emailContact",
                    "idQLC": "$idQLC",
                    "nameDeparment": "$deparment.dep_name",
                    "inForPerson": 1
                }
            }
        ]);
        if (data.length > 0) {
            const user = data[0];
            let companyName = await Users.findOne({ idQLC: user.com_id, type: 1 }).select('userName').lean();
            if (companyName) user.companyName = companyName;

            user.avatarUser = await fnc.createLinkFileEmpQLC(user.idQLC, user.avatarUser);
            user.nameDeparment = user.nameDeparment.toString();

            return functions.success(res, "lấy thành công", { data: user })
        }
        return functions.setError(res, " không tìm thấy nhân viên ")

    } catch (e) {
        return functions.setError(res, e.message)
    }
}

exports.home = async(req, res) => {
    try {
        const user = req.user.data
    } catch (error) {
        return functions.setError(res, err.message)
    }
}