const functions = require('../../services/functions');
const Users = require('../../models/Users');
const md5 = require('md5');
const fs = require('fs');
const PermissionNotify = require('../../models/Timviec365/PermissionNotify');
const New = require('../../models/Timviec365/UserOnSite/Company/New');
const City = require('../../models/City');
const PointCompany = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany');

exports.getAccPermission = async(req, res) => {
    try {
        let { account, password, password_type, id_chat } = req.body;
        if ((account && password) || Number(id_chat)) {
            // Giải thích: Nếu không truyền type_pass thì sẽ mặc định sẽ dùng pass mã hóa, còn không sẽ dùng pass bình thường phục vụ app QR
            password = (password_type == 0) ? md5(password) : password;

            let condition = {};
            if (Number(id_chat)) {
                condition = { _id: Number(id_chat), idTimViec365: { $ne: 0 } };
            }
            if (account.trim().includes('@')) {
                condition = { email: account, password: password, idTimViec365: { $ne: 0 } };
            } else {
                condition = { phoneTK: account, password: password, idTimViec365: { $ne: 0 } };
            }

            let list = [],
                listUser = [],
                list_id_chat = [];
            const list_acc = await Users.aggregate([
                { $match: condition },
                {
                    $project: {
                        id_chat: "$_id",
                        user_id: "$idTimViec365",
                        user_name: "$userName",
                        user_type: "$type",
                        email: "$email",
                        phone_tk: "$phoneTK",
                        pass: "$password",
                    }
                }
            ]);

            if (list_acc.length > 0) {
                for (let i = 0; i < list_acc.length; i++) {
                    const element = list_acc[i];
                    list_id_chat.push(element.id_chat);
                }

                // NTD
                const ls_pm_usc = await PermissionNotify.aggregate([{
                        $match: {
                            pn_usc_id: { $ne: 0 },
                            pn_id_chat: { $in: list_id_chat }
                        }
                    }, {
                        $lookup: {
                            from: "Users",
                            localField: "pn_usc_id",
                            foreignField: "idTimViec365",
                            as: "user",
                        }
                    },
                    { $unwind: "$user" },
                    { $match: { "user.type": 1 } },
                    {
                        $project: {
                            id_chat: "$user._id",
                            user_id: "$user.idTimViec365",
                            user_name: "$user.userName",
                            user_type: "$user.type",
                            email: "$user.email",
                            phone_tk: "$user.phoneTK",
                            pass: "$user.password",
                        }
                    }
                ]);

                // Ứng viên
                const ls_pm_use = await PermissionNotify.aggregate([{
                        $match: {
                            pn_use_id: { $ne: 0 },
                            pn_id_chat: { $in: list_id_chat }
                        }
                    }, {
                        $lookup: {
                            from: "Users",
                            localField: "pn_use_id",
                            foreignField: "idTimViec365",
                            as: "user",
                        }
                    },
                    { $unwind: "$user" },
                    { $match: { "user.type": { $ne: 1 } } },
                    {
                        $project: {
                            id_chat: "$user._id",
                            user_id: "$user.idTimViec365",
                            user_name: "$user.userName",
                            user_type: "$user.type",
                            email: "$user.email",
                            phone_tk: "$user.phoneTK",
                            pass: "$user.password",
                        }
                    }
                ]);

                listUser = list_acc.concat(ls_pm_usc, ls_pm_use);
            }

            return functions.success(res, "", { listUser });
        } else {
            return functions.setError(res, "Thiếu tham số truyền lên");
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.getAccPermissionCandi = async(req, res) => {
    try {
        let { id_chat } = req.body;
        if (Number(id_chat)) {

            let condition = {};
            if (Number(id_chat)) {
                condition = { _id: Number(id_chat), idTimViec365: { $ne: 0 } };
            }

            let list = [],
                listUser = [],
                list_id_chat = [];
            const list_acc = await Users.aggregate([
                { $match: condition },
                {
                    $project: {
                        chat365_id: "$_id",
                        user_id: "$idTimViec365",
                        user_name: "$userName",
                        user_type: "$type",
                        email: "$email",
                        phone_tk: "$phoneTK",
                        pass: "$password",
                        percents: "$inForPerson.candidate.percents",
                        idQLC: "$user.idQLC",
                        idRaoNhanh365: "$user.idRaoNhanh365"
                    }
                }
            ]);

            if (list_acc.length > 0) {
                for (let i = 0; i < list_acc.length; i++) {
                    const element = list_acc[i];
                    list_id_chat.push(element.chat365_id);
                }


                // Ứng viên
                const ls_pm_use = await PermissionNotify.aggregate([{
                        $match: {
                            pn_use_id: { $ne: 0 },
                            pn_id_chat: { $in: list_id_chat }
                        }
                    }, {
                        $lookup: {
                            from: "Users",
                            localField: "pn_use_id",
                            foreignField: "idTimViec365",
                            as: "user",
                        }
                    },
                    { $unwind: "$user" },
                    { $match: { "user.type": { $ne: 1 } } },
                    {
                        $project: {
                            chat365_id: "$user._id",
                            user_id: "$user.idTimViec365",
                            user_name: "$user.userName",
                            user_type: "$user.type",
                            email: "$user.email",
                            phone_tk: "$user.phoneTK",
                            pass: "$user.password",
                            percents: "$inForPerson.candidate.percents",
                            idQLC: "$user.idQLC",
                            idRaoNhanh365: "$user.idRaoNhanh365"
                        }
                    }
                ]);

                listUser = list_acc.concat(ls_pm_use);
            }
            for (let i in listUser) {
                let user = listUser[i];

                listUser[i].token = await functions.createToken({
                        _id: user.chat365_id,
                        idTimViec365: user.user_id,
                        idQLC: user.idQLC,
                        idRaoNhanh365: user.idRaoNhanh365,
                        email: user.email,
                        phoneTK: user.phone_tk,
                        createdAt: functions.getTimeNow(),
                        type: user.type,
                        com_id: 0,
                    },
                    '1d'
                );
            }

            return functions.success(res, "", { listUser });
        } else {
            return functions.setError(res, "Thiếu tham số truyền lên");
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.checkAccount = async(req, res) => {
    try {
        let account = req.body.account,
            type = Number(req.body.type) || 0,
            idChat = Number(req.body.idChat) || 0,
            now = functions.getTimeNow();
        if (account) {
            // Giải thích: Nếu không truyền type_pass thì sẽ mặc định sẽ dùng pass mã hóa, còn không sẽ dùng pass bình thường phục vụ app QR

            let condition = {};
            let matchType = type == 0 ? { $ne: 1 } : type;
            if (type == 0) {

            }
            if (account.trim().includes('@')) {
                condition = { email: account, idTimViec365: { $ne: 0 }, type: matchType };
            } else {
                condition = { phoneTK: account, idTimViec365: { $ne: 0 }, type: matchType };
            }
            let project = {
                id_chat: "$_id",
                id_timviec: "$idTimViec365",
                name: "$userName",
                type: "$type",
                email: "$email",
                phone: "$phoneTK",
                password: "$password",
                city_id: "$city",
                address: "$address",
                percents: "$inForPerson.candidate.percents",
                createdAt: "$createdAt"
            }

            let list_acc = await Users.aggregate([
                { $match: condition },
                {
                    $project: project
                }
            ]);
            if (list_acc.length == 0) {
                condition.type = condition.type == 0 ? 1 : 0;
                list_acc = await Users.aggregate([
                    { $match: condition },
                    {
                        $project: project
                    }
                ]);
            }

            if (list_acc.length == 0) {

                // NTD
                list_acc = await PermissionNotify.aggregate([{
                        $match: {
                            pn_usc_id: { $ne: 0 },
                            pn_id_chat: idChat
                        }
                    }, {
                        $lookup: {
                            from: "Users",
                            localField: "pn_usc_id",
                            foreignField: "idTimViec365",
                            as: "user",
                        }
                    },
                    { $unwind: "$user" },
                    { $match: { "user.type": 1 } },
                    {
                        $project: project
                    }
                ]);
                if (list_acc.length == 0) {
                    // Ứng viên
                    list_acc = await PermissionNotify.aggregate([{
                            $match: {
                                pn_use_id: { $ne: 0 },
                                pn_id_chat: idChat
                            }
                        }, {
                            $lookup: {
                                from: "Users",
                                localField: "pn_use_id",
                                foreignField: "idTimViec365",
                                as: "user",
                            }
                        },
                        { $unwind: "$user" },
                        { $match: { "user.type": { $ne: 1 } } },
                        {
                            $project: project
                        }
                    ]);
                }
            }
            if (list_acc.length) {
                let user = list_acc[0];
                let com_id = user.type == 1 ? user.id_timviec : 0;
                const [token, refreshToken, nameCity, checkPoint] = await Promise.all([
                    functions.createToken({
                            _id: user.id_chat,
                            idTimViec365: user.id_timviec,
                            idQLC: user.idQLC,
                            idRaoNhanh365: user.idRaoNhanh365,
                            email: user.email,
                            phoneTK: user.phone,
                            createdAt: user.createdAt,
                            type: user.type,
                            com_id: com_id,
                        },
                        '1d'
                    ),
                    functions.createToken({ userId: user.id_chat, createTime: now },
                        '1y'
                    ),
                    City.findOne({ _id: user.city_id }).select('name -_id'),
                    // Lấy điểm còn lại của công ty
                    functions.getDatafindOne(PointCompany, { usc_id: com_id })
                ]);
                user.CityName = nameCity ? nameCity.name : "";
                user.token = token ? token : "";
                user.refreshToken = refreshToken ? refreshToken : "";
                user.point = checkPoint ? checkPoint.point_usc : 0;

                let listNew = await New.find({ new_user_id: user.id_timviec }).select('new_id').lean();
                let listNewId = []
                listNew.forEach((item, i) => {
                    listNewId.push(item.new_id);
                })
                user.list_new = listNewId;
                return functions.success(res, "", { user });
            } else {
                let condition = {};
                if (account.trim().includes('@')) {
                    condition = { email: account, type };
                } else {
                    condition = { phoneTK: account, type };
                }
                let userQlc = await Users.aggregate([
                    { $match: condition },
                    {
                        $project: project
                    }
                ]);
                if (userQlc.length) {
                    let user = userQlc[0];
                    let com_id = userQlc.type == 1 ? userQlc.id_timviec : 0;
                    const token = await functions.createToken({
                            _id: user.id_chat,
                            idTimViec365: user.id_timviec,
                            idQLC: user.idQLC,
                            idRaoNhanh365: user.idRaoNhanh365,
                            email: user.email,
                            phoneTK: user.phone,
                            createdAt: user.createdAt,
                            type: user.type,
                            com_id: com_id,
                        },
                        '1d'
                    )
                    user.token = token ? token : "";
                    return functions.success(res, "", { userQlc: user });
                }
            }
            return functions.setError(res, "Không tồn tại tài khoản");
        } else {
            return functions.setError(res, "Thiếu tham số truyền lên");
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.deleteVideo = async(req, res) => {
    try {
        const user = req.user.data;
        const { type } = req.body; // 1: Xóa video trong kho, 2: Xóa video của tin tuyển dụng, 3: Xóa video ứng viên
        if (type && [1, 2, 3].indexOf(type)) {

            // Xử lý xóa video trong kho
            if (user.type == 1 && type == 1) {
                const company = await Users.findOne({ _id: user._id }, {
                    createdAt: 1,
                    "inForCompany.timviec365.usc_video": 1,
                    "inForCompany.timviec365.usc_video_type": 1,
                }).lean();
                if (company) {

                }
                return functions.setError(res, "Công ty không tồn tại");
            }
            // Xử lý xóa video trong tin
            else if (user.type == 1 && type == 2) {

            }
            // Xử lý xóa video của ứng viên
            else if (user.type == 0 && type == 3) {
                const array = await Users.aggregate([
                    { $match: { _id: user._id } },
                    {
                        $project: {
                            cv_video: "$inForPerson.candidate.cv_video",
                            cv_video_type: "$inForPerson.candidate.cv_video_type",
                            use_create_time: "$createdAt"
                        }
                    }
                ]);
                const candidate = array[0];
                if (candidate.cv_video != '' && candidate.cv_video_type == 1) {
                    const dir = `../storage/base365/timviec365/pictures/cv/${functions.convertDate(candidate.use_create_time, true)}`;
                    const filePath = `${dir}/${candidate.cv_video}`;
                    await fs.access(filePath, fs.constants.F_OK, (error) => {
                        if (error) {} else {
                            // Tệp tin tồn tại
                            fs.unlink(filePath, (err) => {
                                if (err) throw err;
                            });
                        }
                    });
                    await Users.updateOne({ _id: user._id }, {
                        $set: { "inForPerson.candidate.cv_video": "" }
                    });
                    return functions.success(res, "Xóa file thành công");
                }
                return functions.success(res, "Không có thông tin cần xóa");
            }
        }
        return functions.setError(res, "Chưa truyền đối tượng cần xóa");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}