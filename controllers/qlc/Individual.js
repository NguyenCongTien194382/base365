const Users = require("../../models/Users")
const fnc = require("../../services/qlc/functions")
const functions = require("../../services/functions")
const md5 = require("md5")

//đăng kí tài khoản cá nhân 
exports.register = async(req, res) => {
    try {
        const { userName, password, phoneTK, address, phone, fromWeb } = req.body
        const createdAt = new Date()
        if (userName && password && phoneTK && address) {
            let checkPhone = await functions.checkPhoneNumber(phoneTK);
            if (checkPhone) {
                let user = await Users.findOne({ phoneTK: phoneTK, type: { $ne: 1 } }).lean()
                let MaxId = await functions.getMaxUserID("user")
                let _id = MaxId._id
                if (!user) {
                    const Inuser = new Users({
                        _id: _id,
                        userName: userName,
                        phoneTK: phoneTK,
                        phone: phone,
                        password: md5(password),
                        address: address,
                        createdAt: Date.parse(createdAt) / 1000,
                        type: 0,
                        chat365_secret: Buffer.from(_id.toString()).toString('base64'),
                        fromWeb: "quanlychung",
                        idQLC: MaxId._idQLC,
                        idTimViec365: MaxId._idTV365,
                        idRaoNhanh365: MaxId._idRN365,
                        "inForPerson.account.birthday": null,
                        "inForPerson.account.gender": 0,
                        "inForPerson.account.married": 0,
                        "inForPerson.account.experience": 0,
                        "inForPerson.account.education": 0,
                    })
                    await Inuser.save()
                    const token = await functions.createToken(Inuser, "1d")
                    const refreshToken = await functions.createToken({ userId: Inuser._id }, "1y")
                    let data = {
                        access_token: token,
                        refresh_token: refreshToken,
                    }
                    return functions.success(res, "tạo tài khoản thành công", { Inuser, data })
                } else {
                    return functions.setError(res, " sdt đã tồn tại")
                }
            } else {
                functions.setError(res, "định dạng sdt không đúng ")
            }
        } else {
            return functions.setError(res, "thiếu thông tin để đăng kí ")
        }
    } catch (e) {
        return functions.setError(res, e.message)
    }
}
exports.verify = async(req, res) => {
    try {
        let otp = req.body.ma_xt || null
        let phoneTK = req.user.data.phoneTK;
        let data = []
        if (otp) {
            data = await Users.updateOne({ phoneTK: phoneTK, type: 0 }, {
                $set: {
                    otp: otp
                }
            });
            return functions.success(res, "lưu OTP thành công", { data })
        } else if (!otp) {
            await Users.updateOne({ phoneTK: phoneTK, type: 0 }, {
                $set: {
                    authentic: 1
                }
            });
            return functions.success(res, "xác thực thành công");
        } else {
            return functions.setError(res, "thiếu dữ liệu sdt")
        };
    } catch (e) {
        return functions.setError(res, e.message)
    }
}
exports.verifyCheckOTP = async(req, res) => {
    try {
        let otp = req.body.ma_xt || null
        let phoneTK = req.user.data.phoneTK;

        if (otp) {
            let findUser = await Users.findOne({ phoneTK: phoneTK, type: 0 }).select("otp")
            if (findUser) {
                let data = findUser.otp
                if (data === otp) {
                    functions.success(res, "xác thực thành công")
                } else {
                    functions.setError(res, "xác thực thất bại")
                };
            } else {
                return functions.setError(res, "tài khoản không tồn tại")
            };
        } else {
            return functions.setError(res, "vui lòng nhập mã xác thực")
        };
    } catch (e) {
        return functions.setError(res, e.message)
    };
}

exports.login = async(req, res, next) => {
    try {
        let phoneTK = req.body.phoneTK
        let email = req.body.email
        password = req.body.password
        type_user = {};

        if (phoneTK && password) {

            let checkPhone = await functions.checkPhoneNumber(phoneTK)
            if (checkPhone) {
                let checkTypeUser = await Users.findOne({ phoneTK: phoneTK }).lean()
                if (checkTypeUser.type == 0) {
                    type_user = 0
                    let checkPassword = await functions.verifyPassword(password, checkTypeUser.password)
                    if (!checkPassword) {
                        return functions.setError(res, "Mật khẩu sai")
                    }
                    if (checkTypeUser != null) {
                        const token = await functions.createToken(checkTypeUser, "1d")
                        const refreshToken = await functions.createToken({ userId: checkTypeUser._id }, "1y")
                        let data = {
                            access_token: token,
                            refresh_token: refreshToken,
                            com_info: {
                                com_id: checkTypeUser._id,
                                com_phone_tk: checkTypeUser.phoneTK,
                            }
                        }
                        data.type_user = type_user
                        return functions.success(res, 'Đăng nhập thành công bằng SDT', { data })

                    } else {
                        return functions.setError(res, "sai tai khoan hoac mat khau")
                    }
                } else if (checkTypeUser.type == 1) {
                    type_user = 1
                    functions.success(res, "tài khoản là tài khoản cty", { type_user })

                } else if (checkTypeUser.type == 2) {
                    type_user = 2
                    functions.success(res, "tài khoản là tài khoản nhân viên", { type_user })

                } else {
                    functions.setError(res, "không tìm thấy tài khoản ")
                }

            } else {
                return functions.setError(res, "không đúng định dạng SDT")
            }
        } else if (email && password) {
            let checkMail = await functions.checkEmail(email)
            if (checkMail) {
                let checkTypeUser = await Users.findOne({ email: email }).lean()
                if (checkTypeUser.type == 0) {
                    type_user = 0
                    let checkPassword = await functions.verifyPassword(password, checkTypeUser.password)
                    if (!checkPassword) {
                        return functions.setError(res, "Mật khẩu sai")
                    }
                    if (checkTypeUser != null) {
                        const token = await functions.createToken(checkTypeUser, "1d")
                        const refreshToken = await functions.createToken({ userId: checkTypeUser._id }, "1y")
                        let data = {
                            access_token: token,
                            refresh_token: refreshToken,
                            com_info: {
                                com_id: checkTypeUser._id,
                                com_email: checkTypeUser.email,
                            }
                        }
                        data.type_user = type_user
                        return functions.success(res, 'Đăng nhập thành công bằng email', { data })

                    } else {
                        return functions.setError(res, "sai tai khoan hoac mat khau")
                    }
                } else if (checkTypeUser.type == 1) {
                    type_user = 1
                    functions.success(res, "tài khoản là tài khoản công ty", { type_user })

                } else if (checkTypeUser.type == 2) {
                    type_user = 2
                    functions.success(res, "tài khoản là tài khoản nhân viên", { type_user })

                } else {
                    functions.setError(res, "không tìm thấy tài khoản ")
                }
            } else {
                return functions.setError(res, "không đúng định dạng email")
            }
        } else {
            return functions.setError(res, "thiếu dữ liệu email hoặc sdt hoặc password ")

        }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}


// hàm đổi mật khẩu 
exports.updatePassword = async(req, res, next) => {
    try {
        let idQLC = req.user.data.idQLC
        let old_password = req.body.old_password
        let password = req.body.password;
        if (!password) {
            return functions.setError(res, 'điền thiếu thông tin')
        }
        if (password.length < 6) {
            return functions.setError(res, 'Password quá ngắn')
        }
        if (old_password) {
            let checkOldPassword = await Users.findOne({ idQLC: idQLC, password: md5(old_password), type: 0 })
            if (checkOldPassword) {
                await Users.updateOne({ idQLC: idQLC, type: 0 }, {
                    $set: {
                        password: md5(password),
                    }
                });
                return functions.success(res, 'cập nhập thành công')
            }
            return functions.setError(res, 'Mật khẩu cũ không đúng, vui lòng kiểm tra lại')
        }
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.updatePasswordbyInput = async(req, res, next) => {
        try {
            let phoneTK = req.body.phoneTK
            let email = req.body.email
            let password = req.body.password;
            if (phoneTK && password) {
                if (password.length < 6) {
                    return functions.setError(res, 'Password quá ngắn')
                }
                let checkPass = await functions.getDatafindOne(Users, { phoneTK, password: md5(password), type: 0 })
                if (!checkPass) {
                    await Users.updateOne({ phoneTK: phoneTK, type: 0 }, {
                        $set: {
                            password: md5(password),
                        }
                    });
                    return functions.success(res, 'cập nhập thành công')
                }
                return functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ');
            } else if (email && password) {
                if (password.length < 6) {
                    return functions.setError(res, 'Password quá ngắn')
                }
                let checkPass = await functions.getDatafindOne(Users, { email, password: md5(password), type: 0 })
                if (!checkPass) {
                    await Users.updateOne({ email: email, type: 0 }, {
                        $set: {
                            password: md5(password),
                        }
                    });
                    return functions.success(res, 'cập nhập thành công')
                }
                return functions.setError(res, 'mật khẩu đã tồn tại, xin nhập mật khẩu khác ');
            } else {
                return functions.setError(res, ' điền thiếu trường ')
            };

        } catch (error) {
            return functions.setError(res, error.message)
        }
    }
    // hàm cập nhập thông tin cá nhân
exports.updateInfoindividual = async(req, res, next) => {
    try {
        let idQLC = req.user.data.idQLC;
        let data = [];
        const { userName, emailContact, phoneTK, com_id, address, position_id, dep_id, phone, group_id, birthday, gender, married, experience, startWorkingTime, education, otp } = req.body;
        let File = req.files || null;
        let avatarUser = null;

        if (File && File.avatarUser) {
            let upload = await fnc.uploadAvaEmpQLC(idQLC, File.avatarUser, ['.jpeg', '.jpg', '.png']);
            if (!upload) {
                return functions.setError(res, 'Định dạng ảnh không hợp lệ')
            }
            avatarUser = upload
        }

        data = await Users.updateOne({ idQLC: idQLC, type: 0 }, {
            $set: {
                userName: userName,
                emailContact: emailContact,
                phone: phone,
                avatarUser: avatarUser,
                address: address,
                avatarUser: avatarUser,
                updatedAt: functions.getTimeNow(),
                "inForPerson.account.birthday": Date.parse(birthday) / 1000,
                "inForPerson.account.gender": gender,
                "inForPerson.account.married": married,
                "inForPerson.account.experience": experience,
                "inForPerson.account.education": education,
            }
        })
        return functions.success(res, 'update info user success', { data })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}


// hàm bước 1 của quên mật khẩu
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
//                 let findUser = await Users.findOne({ $or: [{ email: email, type: 0 }, { phoneTK: phoneTK, type: 0 }] })
//                 if (findUser) {
//                     let otp = functions.randomNumber
//                     data = await Users.updateOne({ $or: [{ email: email, type: 0 }, { phoneTK: phoneTK, type: 0 }] }, {
//                         $set: {
//                             otp: otp
//                         }
//                     })
//                     return functions.success(res, "Gửi mã OTP thành công", { data, otp })
//                 } else {
//                     return functions.setError(res, "tài khoản không tồn tại")
//                 }
//             } else {
//                 return functions.setError(res, " email không đúng định dạng ")
//             }

//         } else if (otp && (phoneTK || email)) {
//             let verify = await Users.findOne({ $or: [{ email: email, otp, type: 0 }, { phoneTK: phoneTK, otp, type: 0 }] });
//             if (verify != null) {
//                 await Users.updateOne({ $or: [{ email: email, type: 0 }, { phoneTK: phoneTK, type: 0 }] }, {
//                     $set: {
//                         authentic: 1
//                     }
//                 });
//                 return functions.success(res, "xác thực thành công");



//             } else {
//                 return functions.setError(res, "xác thực thất bại");
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
//                 return functions.setError(res, 'Password quá ngắn')
//             }
//             if (password !== re_password) {
//                 return functions.setError(res, 'Password nhập lại không trùng khớp')
//             }
//             await Users.updateOne({ $or: [{ email: email, authentic: 1, type: 0 }, { phoneTK: phoneTK, authentic: 1, type: 0 }] }, {
//                 $set: {
//                     password: md5(password),
//                 }
//             });
//             return functions.success(res, 'cập nhập MK thành công')

//         } else {
//             return functions.setError(res, "thiếu dữ liệu")
//         }
//     } catch (e) {
//         return functions.setError(res, e.message)
//     }
// }

exports.info = async(req, res) => {
    try {
        const idQLC = req.user.data.idQLC
            // const com_id = req.user.data.com_id
        const data = await Users.aggregate([
            { $match: { idQLC: idQLC, type: 0 } },
            {
                $project: {
                    "ep_name": "$userName",
                    "ep_email": "$email",
                    "ep_email_lh": "$emailContact",
                    "ep_phone": "$phone",
                    "ep_phone_tk": "$phoneTK",
                    "ep_address": "$address",
                    "avatarUser": "$avatarUser",
                    "idQLC": "$idQLC",
                    "ep_authentic": "$authentic",
                    "ep_birth_day": "$inForPerson.account.birthday",
                    "ep_gender": "$inForPerson.account.gender",
                    "ep_married": "$inForPerson.account.married",
                    "ep_exp": "$inForPerson.account.experience",
                    "ep_education": "$inForPerson.account.education"
                }
            }
        ]);
        if (data.length > 0) {
            const user = data[0];
            user.avatarUser = await fnc.createLinkFileEmpQLC(user.idQLC, user.avatarUser);

            return functions.success(res, 'Lấy thành công', { data: user });
        };
        return functions.setError(res, 'Không có dữ liệu');
    } catch (e) {
        return functions.setError(res, e.message)
    }
}