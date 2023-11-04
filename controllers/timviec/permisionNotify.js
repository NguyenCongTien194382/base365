const PermissionNotify = require('../../models/Timviec365/PermissionNotify');
const Users = require('../../models/Users');
const functions = require('../../services/functions');
const NewTV365 = require('../../models/Timviec365/UserOnSite/Company/New');
const City = require('../../models/City');
const PointCompany = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany');
exports.list = async(req, res) => {
    const user = req.user.data;
    let condition = { pn_usc_id: user.idTimViec365 };
    const { pn_id_new, pn_type } = req.body;
    if (pn_id_new) {
        condition.pn_id_new = Number(pn_id_new);
    }
    if (pn_type) {
        condition.pn_type = Number(pn_type);
    }

    const list = await PermissionNotify.find(condition).lean();
    const list_id = [];
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        list_id.push(element.pn_id_chat);
    }
    const listUserInfo = await Users.aggregate([{
        $match: {
            _id: { $in: list_id }
        }
    }, {
        $project: {
            _id: 0,
            id: "$_id",
            type365: "$type",
            email: "$email",
            phoneTK: "$phoneTK",
            userName: "$userName",
            avatarUser: "$avatarUser"
        }
    }]);
    return functions.success(res, "Danh sách quyền", { list, listUserInfo });
}

exports.getUserByIdChat = async(req, res) => {
    try {
        const Infor = req.body.Infor;
        if (Infor) {
            const listUser = await Users.aggregate([{
                    $match: {
                        $or: [{ email: Infor }, { phoneTK: Infor }]
                    }
                }, {
                    $project: {
                        _id: 1,
                        "type365": "$type",
                        userName: 1,
                    }
                }

            ]);
            return functions.success(res, "Danh sách thông tin", { listUser });
        }
        return functions.setError(res, "Thiếu thông tin truyền lên");
    } catch (error) {
        return functions.setError(res, error);
    }
}

exports.getListPermissionByUser = async(req, res) => {
    try {
        const idTimViec365 = req.user.data.idTimViec365;
        const type = req.body.type || 1;
        let list_type_noti;
        let list = [];

        // Luồng nhà tuyển dụng phân quyền
        if (type == 1) {
            list_type_noti = await PermissionNotify.distinct('pn_type_noti', {
                pn_usc_id: idTimViec365,
                pn_id_new: 0
            }).lean();
            for (let i = 0; i < list_type_noti.length; i++) {
                const pn_type_noti = list_type_noti[i];

                const rs_usc = await PermissionNotify.aggregate([{
                        $match: {
                            pn_usc_id: idTimViec365,
                            pn_id_new: 0,
                            pn_type_noti: pn_type_noti
                        }
                    },
                    {
                        $lookup: {
                            from: "Users",
                            localField: "pn_id_chat",
                            foreignField: "_id",
                            as: "user",
                        }
                    },
                    { $unwind: "$user" },
                    {
                        $project: {
                            id: "$user._id",
                            type365: "$user.type",
                            email: "$user.email",
                            phoneTK: "$user.phoneTK"
                        }
                    }
                ]);
                list.push({
                    pn_type_noti: pn_type_noti,
                    rs_usc: rs_usc
                });
            }
        }
        // Luồng ứng viên phân quyền
        else {
            list_type_noti = await PermissionNotify.distinct('pn_type_noti', {
                pn_use_id: idTimViec365,
                pn_id_new: 0
            }).lean();
            for (let i = 0; i < list_type_noti.length; i++) {
                const pn_type_noti = list_type_noti[i];

                const rs_usc = await PermissionNotify.aggregate([{
                        $match: {
                            pn_use_id: idTimViec365,
                            pn_id_new: 0,
                            pn_type_noti: pn_type_noti
                        }
                    },
                    {
                        $lookup: {
                            from: "Users",
                            localField: "pn_id_chat",
                            foreignField: "_id",
                            as: "user",
                        }
                    },
                    { $unwind: "$user" },
                    {
                        $project: {
                            id: "$user._id",
                            type365: "$user.type",
                            email: "$user.email",
                            phoneTK: "$user.phoneTK"
                        }
                    }
                ]);
                list.push({
                    pn_type_noti: pn_type_noti,
                    rs_usc: rs_usc
                });
            }
        }
        return functions.success(res, "Danh sách thông tin", { items: list });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

//Ktra tài khoản cho app - checkAccount
exports.checkAccount = async(req, res) => {
    try {
        const idChat = req.user.data._id,
            type = req.user.data.type,
            email = req.user.data.email ? req.user.data.email : req.user.data.phoneTK
        const now = functions.getTimeNow();

        if (email) {
            const check = await Users.findOne({
                $or: [
                    { phoneTK: email },
                    { email: email }
                ],
                type: Number(type),
            }).lean();
            if (check) { // check TK ton tai
                //xử lý token for app
                let com_id = 0
                if (type === 1) com_id = check.idTimViec365
                const [token, refreshToken, nameCity, checkPoint] = await Promise.all([
                    functions.createToken({
                            _id: check._id,
                            idTimViec365: check.idTimViec365,
                            idQLC: check.idQLC,
                            idRaoNhanh365: check.idRN365,
                            email: check.email,
                            phoneTK: check.phoneTK,
                            createdAt: now,
                            type: check.type,
                            com_id: com_id,
                        },
                        '1d'
                    ),
                    functions.createToken({ userId: check._id, createTime: now },
                        '1y'
                    ),
                    City.findOne({ _id: check.city }).select('name -_id'),
                    // Lấy điểm còn lại của công ty
                    functions.getDatafindOne(PointCompany, { usc_id: com_id })
                ]);
                let items = {
                    id_timviec: check.idTimViec365,
                    email: check.email,
                    password: check.password,
                    type: check.type,
                    city_id: check.city,
                    CityName: nameCity ? nameCity.name : "",
                    name: check.userName,
                    phone: check.phone,
                    address: check.address,
                    token: token ? token : "",
                    refreshToken: refreshToken ? refreshToken : "",
                    point: checkPoint ? checkPoint.point_usc : 0,
                }
                if (type == 0) { // UV thi ktra quyen
                    let checkPM = await PermissionNotify.findOne({
                        $and: [
                            { pn_id_chat: idChat },
                            { pn_id_chat: { $ne: 0 } }
                        ],
                    }).lean();
                    if (checkPM) {
                        return functions.success(res, "lay thanh cong thong tin UV", { data: items });
                    }
                    return functions.setError(res, "Tài khoản không co quyen");
                } else { // NTD
                    //Lấy danh sách id tin
                    let listNew = {}
                    let list = await NewTV365.find({
                        new_user_id: check.idTimViec365
                    }).select("new_id").lean();
                    if (list) {
                        items = {
                            ...items,
                            list_new: list,
                        }
                    }
                    return functions.success(res, "lay thanh cong thon tin NTD", { data: items });
                }
            }
            return functions.setError(res, "Tài khoản không tồn tại");
        }
        return functions.setError(res, "thieu thong tin truyen len");
    } catch (error) {
        console.log(error)
        return functions.setError(res, error.message);
    }
}

//kiểm tra quyền QR - getkAccPermission
exports.getkAccPermission = async(req, res) => {
    try {
        const idChat = Number(req.body.idChat)
        if (!idChat) {
            return functions.setError(res, "vui long nhap idChat")
        }
        const list_acc = [];
        const list_acc_id = [];
        // Check tài khoản chat
        const listIDChat = [];
        listIDChat.push(idChat);

        let [db_qrcheck, data] = await Promise.all([
            Users.aggregate([{
                    $match: {
                        _id: idChat,
                        idTimViec365: { $ne: 0 }
                    }
                },
                {
                    $project: {
                        id_chat: "$_id",
                        user_id: "$idTimViec365",
                        use_first_name: "$userName",
                        user_type: "$type",
                        use_email: "$email",
                        use_phone_tk: "$phoneTK",
                        pass: "$password",
                    }
                }
            ]),
            PermissionNotify.aggregate([{
                    $match: {
                        pn_id_chat: { $in: listIDChat },
                        pn_usc_id: { $ne: 0 }
                    }
                },
                {
                    $lookup: {
                        from: "Users",
                        localField: "pn_use_id",
                        foreignField: "idTimViec365",
                        pipeline: [{
                            $match: {
                                $and: [
                                    { "idTimViec365": { $ne: 0 } },
                                    { "idTimViec365": { $ne: 1 } }
                                ]
                            },
                        }],
                        as: "user"
                    }
                },
                { $unwind: "$user" },
                {
                    $project: {
                        id_chat: "$user._id",
                        use_id: "$user.idTimViec365",
                        use_first_name: "$user.userName",
                        user_type: "$user.type",
                        use_email: "$user.email",
                        use_phone_tk: "$user.phoneTK",
                        pass: "$user.password",
                    }
                }
            ])
        ]);

        // check ứng viên
        if (db_qrcheck.length > 0) {
            for (let i = 0; i < db_qrcheck.length; i++) {
                const element = db_qrcheck[i];
                list_acc.push(element);
                list_acc_id.push(element.id_chat);
            }
        }

        // lấy các tài khoản được phân quyền
        if (listIDChat.length > 0) {
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const row = data[i];
                    if (!list_acc_id.includes(row.use_id)) {
                        list_acc.push(row);
                        list_acc_id.push(row.use_id);
                    }
                }
            }
        }
        return functions.success(res, "lay thanh cong thong tin nguoi dung", { list_acc });
    } catch (error) {
        console.log(error)
        return functions.setError(res, error.message);
    }
}