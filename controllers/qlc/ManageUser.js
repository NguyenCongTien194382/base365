const Users = require('../../models/Users')
const functions = require('../../services/functions')
const service = require('../../services/qlc/functions')
const md5 = require('md5')

//tìm danh sách 
exports.getlistAdmin = async(req, res) => {
    try {
        const pageNumber = Number(req.body.pageNumber) || 1;
        const pageSize = Number(req.body.pageSize) || 10
        const type = req.user.data.type;
        let com_id = req.user.data.com_id;
        let userName = req.body.userName;
        let dep_id = req.body.dep_id;
        const experience = Number(req.body.experience);
        const education = Number(req.body.education);
        const position_id = Number(req.body.position_id);
        const team_id = Number(req.body.team_id);
        const group_id = Number(req.body.group_id);
        const ep_status = req.body.ep_status || "Active";
        const ep_id = req.body.ep_id;

        // if (type == 1) {
        let condition = {
            "inForPerson.employee.ep_status": ep_status,
            'inForPerson.employee.com_id': Number(com_id)
        };

        if (education) condition["inForPerson.account.education"] = education
        if (position_id) condition["inForPerson.employee.position_id"] = position_id
        if (team_id) condition["inForPerson.employee.team_id"] = team_id
        if (group_id) condition["inForPerson.employee.group_id"] = group_id
        if (userName) condition["userName"] = { $regex: userName }; //tìm kiếm theo tên 
        if (dep_id) condition["inForPerson.employee.dep_id"] = Number(dep_id); //tìmm kiếm theo tên phòng ban 
        if (ep_id) condition = {
            { idQLC: Number(ep_id), type: 2 },
            ...condition
        };

        let data = await Users.aggregate([
            { $match: condition },
            { $sort: { ep_id: -1 } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
            {
                $lookup: {
                    from: "QLC_Deparments",
                    localField: "inForPerson.employee.dep_id",
                    foreignField: "dep_id",
                    as: "deparment"
                }
            },
            {
                $lookup: {
                    from: "QLC_Groups",
                    localField: "inForPerson.employee.group_id",
                    foreignField: "gr_id",
                    as: "Groups"
                }
            },
            {
                $project: {
                    ep_id: "$idQLC",
                    ep_email: "$email",
                    ep_email_lh: "$emailContact",
                    ep_phone_tk: "$phoneTK",
                    ep_name: "$userName",
                    ep_education: "$inForPerson.account.education",
                    ep_exp: "$inForPerson.account.experience",
                    ep_phone: "$phone",
                    ep_image: "$avatarUser",
                    ep_address: "$address",
                    ep_gender: "$inForPerson.account.gender",
                    ep_married: "$inForPerson.account.married",
                    ep_birth_day: "$inForPerson.account.birthday",
                    ep_description: "$inForPerson.employee.ep_description",
                    create_time: "$createdAt",
                    role_id: "$role",
                    group_id: "$inForPerson.employee.group_id",
                    start_working_time: "$inForPerson.employee.start_working_time",
                    position_id: "$inForPerson.employee.position_id",
                    ep_status: "$inForPerson.employee.ep_status",
                    allow_update_face: "$inForPerson.employee.allow_update_face",
                    com_id: "$inForPerson.employee.com_id",
                    dep_id: "$inForPerson.employee.dep_id",
                    nameDeparment: "$deparment.dep_name",
                    gr_name: "$Groups.gr_name",
                }
            },
        ]);
        const count = await Users.countDocuments(condition);
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            element.nameDeparment = element.nameDeparment.toString()
        }
        return functions.success(res, 'Lấy thành công', {
            totalItems: count,
            items: data
        });
        // }
        // return functions.setError(res, "Tài khoản không phải Công ty");
    } catch (err) {
        console.log(err);
        functions.setError(res, err.message)
    }
};

// lấy ds nhân viên cả chưa duyệt
exports.getlistAdminAll = async(req, res) => {
    try {
        const pageNumber = req.body.pageNumber || 1
        const type = req.user.data.type
        let com_id = req.body.com_id
        let userName = req.body.userName
        let dep_id = req.body.dep_id

        if (type == 1) {
            let condition = {
                // "inForPerson.employee.ep_status": "Active",
                'inForPerson.employee.com_id': Number(com_id),
            }

            if (com_id) {
                if (userName) condition['userName'] = { $regex: userName } //tìm kiếm theo tên
                if (dep_id) condition['inForPerson.employee.dep_id'] = Number(dep_id) //tìmm kiếm theo tên phòng ban

                let data = await Users.aggregate([
                    { $match: condition },
                    { $sort: { _id: -1 } },
                    { $skip: (pageNumber - 1) * 10 },
                    { $limit: 10 },
                    {
                        $lookup: {
                            from: 'QLC_Deparments',
                            localField: 'inForPerson.employee.dep_id',
                            foreignField: 'dep_id',
                            as: 'deparment',
                        },
                    },
                    {
                        $project: {
                            userName: '$userName',
                            dep_id: '$inForPerson.employee.dep_id',
                            com_id: '$inForPerson.employee.com_id',
                            position_id: '$inForPerson.employee.position_id',
                            phoneTK: '$phoneTK',
                            email: '$email',
                            emailContact: '$emailContact',
                            idQLC: '$idQLC',
                            nameDeparment: '$deparment.dep_name',
                            gender: '$inForPerson.employee.gender',
                            married: '$inForPerson.employee.married',
                            address: '$address',
                            position_id: '$inForPerson.employee.position_id',
                            ep_status: '$inForPerson.employee.ep_status',
                            avatarUser: '$avatarUser',
                        },
                    },
                ])
                const count = await Users.countDocuments(condition)
                for (let index = 0; index < data.length; index++) {
                    const element = data[index]
                    element.nameDeparment = element.nameDeparment.toString()
                }
                return await functions.success(res, 'Lấy thành công', { data, count })
            }
            return functions.setError(res, 'thiếu com_id')
        }
        return functions.setError(res, 'Tài khoản không phải Công ty')
    } catch (err) {
        console.log(err)
        functions.setError(res, err.message)
    }
}

//tao nv
exports.createUser = async(req, res) => {
    try {
        const type = req.user.data.type,
            com_id = req.body.com_id
        const {
            userName,
            phoneTK,
            emailContact,
            password,
            role,
            address,
            birthday,
            dep_id,
            group_id,
            team_id,
            position_id,
            gender,
            education,
            married,
            experience,
            start_working_time,
        } = req.body
        if (type == 1) {
            if (
                com_id &&
                userName &&
                password &&
                role &&
                address &&
                position_id &&
                gender
            ) {
                //Kiểm tra tên nhân viên khác null

                const manager = await functions.getDatafindOne(Users, {
                    phoneTK: phoneTK,
                    type: { $ne: 1 },
                })
                if (!manager) {
                    //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 0 có giá trị max thì bằng max + 1
                    let maxID = await functions.getMaxUserID()
                    const ManagerUser = new Users({
                        _id: maxID._id,
                        idQLC: maxID._idQLC,
                        idTimViec365: maxID._idTV365,
                        idRaoNhanh365: maxID._idRN365,
                        'inForPerson.employee.com_id': com_id,
                        userName: userName,
                        phoneTK: phoneTK,
                        emailContact: emailContact,
                        password: md5(password),
                        address: address,
                        role: role,
                        'inForPerson.account.gender': gender,
                        'inForPerson.account.birthday': Date.parse(birthday) / 1000,
                        'inForPerson.account.education': education,
                        'inForPerson.account.married': married,
                        'inForPerson.account.experience': experience,
                        'inForPerson.employee.start_working_time': Date.parse(start_working_time) / 1000,
                        'inForPerson.employee.dep_id': dep_id,
                        'inForPerson.employee.position_id': position_id,
                        'inForPerson.employee.group_id': group_id,
                        'inForPerson.employee.team_id': team_id,
                        'inForPerson.employee.ep_status': 'Active',
                        fromWeb: 'quanlychung',
                        type: 2,
                        createdAt: functions.getTimeNow(),
                        chat365_secret: functions.chat365_secret(maxID._id),
                    })

                    await ManagerUser.save()
                    return functions.success(res, 'user created successfully')
                }
                return functions.setError(res, 'Tài khoản đã tồn tại!')
            }
            return functions.setError(res, 'Cần nhập đủ thông tin')
        }
        return functions.setError(res, 'Tài khoản không phải Công ty')
    } catch (e) {
        return functions.setError(res, e.message)
    }
}

// chỉnh sửa
exports.editUser = async(req, res) => {
    try {
        const type = req.user.data.type,
            com_id = req.body.com_id;

        const { ep_name, phoneTK, ep_email, password, role, ep_address, ep_birth_day, dep_id, group_id, team_id, position_id, ep_gender, ep_education, ep_married, ep_exp, start_working_time, ep_id } = req.body;
        if (type == 1) {
            //Kiểm tra tên nhân viên khác null
            const manager = await Users.findOne({ idQLC: ep_id });
            if (manager) {
                let data = {
                    "inForPerson.employee.com_id": com_id || manager.inForPerson.employee.com_id,
                    userName: ep_name || manager.userName,
                    emailContact: ep_email || manager.emailContact,
                    address: ep_address || manager.address,
                    role: role || manager.role,
                    "inForPerson.account.gender": Number(ep_gender) || manager.inForPerson.account.gender,
                    "inForPerson.account.birthday": Date.parse(ep_birth_day) / 1000 || manager.inForPerson.account.birthday,
                    "inForPerson.account.education": Number(ep_education) || manager.inForPerson.account.education,
                    "inForPerson.account.married": Number(ep_married) || manager.inForPerson.account.married,
                    "inForPerson.account.experience": Number(ep_exp) || manager.inForPerson.account.experience,
                    "inForPerson.employee.start_working_time": Date.parse(start_working_time) / 1000 || manager.inForPerson.employee.start_working_time,
                    "inForPerson.employee.dep_id": Number(dep_id) || manager.inForPerson.employee.dep_id,
                    "inForPerson.employee.position_id": Number(position_id) || manager.inForPerson.employee.position_id,
                    "inForPerson.employee.group_id": Number(group_id) || manager.inForPerson.employee.group_id,
                    "inForPerson.employee.team_id": Number(team_id) || manager.inForPerson.employee.team_id,
                    "inForPerson.employee.ep_status": "Active",
                };

                if (password) {
                    data.password = md5(password);
                }
                await functions.getDatafindOneAndUpdate(Users, { idQLC: ep_id }, data)
                const result = await Users.findOne({ idQLC: ep_id })
                return functions.success(res, "Sửa thành công", { result })
            }
            return functions.setError(res, "người dùng không tồn tại");
        }
        return functions.setError(res, "Tài khoản không phải Công ty");
    } catch (e) {
        return functions.setError(res, e.message);

    }
}

exports.verifyListUsers = async(req, res) => {
    try {
        const type = req.user.data.type
        const com_id = req.body.com_id
        const listUsers = req.body.listUsers
        if (type == 1) {
            if (listUsers) {
                if (listUsers.length >= 1) {
                    await Users.updateMany({ idQLC: { $in: listUsers } }, {
                        $set: {
                            'inForPerson.employee.ep_status': 'Active',
                        },
                    }, { multi: true })

                    return functions.success(res, 'Duyệt thành công')
                }
            }
            return functions.setError(
                res,
                'Danh sách nhân viên cần duyệt không được trống'
            )
        }

        return functions.setError(res, 'Tài khoản không phải Công ty')
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

//xoa nhan vien khỏi công ty
exports.deleteUser = async(req, res) => {
    try {
        //tạo biến đọc idQLC
        const type = req.user.data.type
        let com_id = Number(req.user.data.idQLC);

        const idQLC = req.body.idQLC;
        if (type == 1) {
            const manager = await Users.findOne({ "inForPerson.employee.com_id": com_id, idQLC: idQLC, type: 2 }).lean();

            if (manager) { //nếu biến manager không tìm thấy  trả ra fnc lỗi 
                await Users.updateOne({ "inForPerson.employee.com_id": com_id, idQLC: idQLC, type: 2 }, {
                    $set: {
                        type: 0,
                        "inForPerson.employee.com_id": 0
                    }
                })
                return functions.success(res, "xóa thành công!", { manager })
            }
            return functions.setError(res, "người dùng không tồn tại!", 510);
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (e) {
        return functions.setError(res, e.message);

    }
};

// xóa nhân viên khỏi phòng ban
exports.deleteUser_Deparment = async(req, res) => {
    try {
        //tạo biến đọc idQLC
        const type = req.user.data.type
        const com_id = Number(req.user.data.com_id);
        const { _id } = req.body

        if (type == 1) {
            const manager = await Users.findOne({ "inForPerson.employee.com_id": com_id, _id: _id, type: 2 }).lean();
            if (manager) { //nếu biến manager không tìm thấy  trả ra fnc lỗi 
                await Users.updateOne({ "inForPerson.employee.com_id": com_id, _id: _id, type: 2 }, {
                    "inForPerson.employee.dep_id": 0
                })
                return functions.success(res, "Xóa khỏi phòng ban thành công!")
            }
            return functions.setError(res, "Người dùng không tồn tại!", 510);
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (e) {
        return functions.setError(res, e.message);

    }
};


// Lấy tất cả nhân viên không phân trang
exports.listAll = async(req, res) => {
    try {
        const com_id = Number(req.user.data.com_id);
        let data = await Users.aggregate([{
                $match: {
                    // 'inForPerson.employee.ep_status': 'Active',
                    'inForPerson.employee.com_id': com_id,
                },
            },
            { $sort: { userName: -1 } },
            {
                $lookup: {
                    from: 'QLC_Deparments',
                    localField: 'inForPerson.employee.dep_id',
                    foreignField: 'dep_id',
                    as: 'deparment',
                },
            },
            {
                $project: {
                    ep_id: '$idQLC',
                    ep_email: '$email',
                    ep_phone: '$phone',
                    ep_name: '$userName',
                    ep_image: '$avatarUser',
                    role_id: '$role',
                    dep_name: '$deparment.dep_name',
                    allow_update_face: '$inForPerson.employee.allow_update_face',
                    ep_education: '$inForPerson.account.education',
                    ep_exp: '$inForPerson.account.experience',
                    ep_address: '$address',
                    ep_gender: '$inForPerson.account.gender',
                    ep_married: '$inForPerson.account.married',
                    ep_education: '$inForPerson.account.education',
                    ep_birth_day: '$inForPerson.account.birthday',
                    group_id: '$inForPerson.employee.group_id',
                    start_working_time: '$inForPerson.employee.start_working_time',
                    position_id: '$inForPerson.employee.position_id',
                    com_id: '$inForPerson.employee.com_id',
                    dep_id: '$inForPerson.employee.dep_id',
                },
            },
        ])
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            element.dep_name = element.dep_name.toString();
            element.ep_image = service.createLinkFileEmpQLC(element.ep_id, element.ep_image)
        }
        const totalItems = await Users.countDocuments({
            // 'inForPerson.employee.ep_status': 'Active',
            'inForPerson.employee.com_id': com_id,
        });
        return await functions.success(res, 'Lấy thành công', {
            totalItems,
            items: data
        })
    } catch (error) {
        console.log(err)
        functions.setError(res, err.message)
    }
}