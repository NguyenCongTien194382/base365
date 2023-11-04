const functions = require("../../../services/functions")
const fnc = require("../../../services/qlc/functions")
const feedback = require("../../../models/qlc/Feedback")
const report = require("../../../models/qlc/ReportError")
const user = require("../../../models/Users")
const comErr = require("../../../models/qlc/Com_error")
const md5 = require('md5');

//cai dat dich vu Vip
exports.setVip = async(req, res) => {
    try {
        let com_ep_vip = req.body.com_ep_vip
        let com_vip_time = req.body.com_vip_time
        let com_id = req.body.com_id
        let now = new Date()
        let inpput = new Date(com_vip_time)
        if (!com_id) {
            return functions.setError(res, "vui lòng nhập id công ty")
        } else if (com_ep_vip < 5) {
            return functions.setError(res, "số lượng nhân viên được đăng kí vip không được dưới 5")
        } else if (isNaN(com_ep_vip)) {
            functions.setError(res, "số lượng nhân viên phải là số")
        }
        // else if (Date.parse(now) > Date.parse(inpput)) {
        //     return functions.setError(res, "số ngày nhập phải lớn hơn hiện tại ")
        // } 
        else {
            let find = await user.findOne({ idQLC: com_id, type: 1 }).lean()
            if (!find) {
                return functions.setError(res, " không tìm thấy công ty ")
            } else {
                let data = await user.updateOne({ idQLC: com_id, type: 1 }, {
                    $set: {
                        'inForCompany.cds.com_vip': 1,
                        'inForCompany.cds.com_ep_vip': com_ep_vip,
                        'inForCompany.cds.com_vip_time': Date.parse(inpput) / 1000,
                    }
                })
                return functions.success(res, "cập nhật thành công ", { data })
            }
        }
    } catch (e) {
        functions.setError(res, e.message)
    }
}
exports.setVipOnly = async(req, res) => {
    try {
        let putVip = req.body.putVip;
        let putAuthen = req.body.putAuthen;
        let com_id = req.body.com_id;
        let find = await user.findOne({ idQLC: com_id, type: 1 }).lean();
        if (find) {
            if (putVip) { // putVip = 1 là cty vip; putVip = 2 là từng vip; putVip = 0 là chưa vip
                await user.updateOne({ idQLC: com_id, type: 1 }, {
                    $set: {
                        'inForCompany.cds.com_vip': putVip,
                    }
                })
                return functions.success(res, "cập nhật thành công ");
            } else if (putAuthen) {
                await user.updateOne({ idQLC: com_id, type: 1 }, {
                    $set: {
                        authentic: putAuthen,
                    }
                })
                return functions.success(res, "cập nhật thành công ");
            }
            return functions.setError(res, " vui lòng nhập trạng thái");
        }
        return functions.setError(res, "Công ty không tồn tại");
    } catch (e) {
        functions.setError(res, e.message)
    }
}
exports.listComErr = async(req, res) => {
    try {
        const request = req.body;
        const pageNumber = request.pageNumber || 1;
        let inputNew = request.inputNew
        let inputOld = request.inputOld
        let find = request.find
        let data = [];
        let listCondition = {};

        let checkNew1 = new Date(inputNew);
        checkNew1.setDate(checkNew1.getDate() + 1); // + 1 ngay
        let checkNew = Date.parse(checkNew1);
        let checkOld1 = new Date(inputOld)
        let checkOld = Date.parse(checkOld1)
        if (checkOld > checkNew) {
            await functions.setError(res, "thời gian nhập không đúng quy định")
        }
        if (inputNew || inputOld) listCondition['com_time_err'] = { $gte: checkOld, $lte: checkNew };

        if (find) listCondition["$or"] = [
            { "com_name": { $regex: find } },
            { "com_email": { $regex: find } },
            { "com_phone": { $regex: find } }
        ];

        data = await comErr.find(listCondition).skip((pageNumber - 1) * 25).limit(25).sort({ _id: -1 }).lean();
        if (data === []) {
            await functions.setError(res, 'Không có dữ liệu', 404);

        } else {
            let count = await feedback.countDocuments({})

            return functions.success(res, 'Lấy thành công', { data, count });
        }

    } catch (e) {
        functions.setError(res, e.message)
    }
}

// lay danh sach công ty
exports.listCom = async(req, res) => {
    try {
        const pageNumber = req.body.pageNumber || 1;
        const request = req.body;

        let fromWeb = request.fromWeb,
            inputNew = request.inputNew,
            inputOld = request.inputOld,
            find = request.find,
            findConditions = request.findConditions,
            com_id = request.com_id;

        let type = 1;
        let data = [];
        let listCondition = { fromWeb: "quanlychung" };
        let checkNew1 = new Date(inputNew);
        checkNew1.setDate(checkNew1.getDate() + 1); // + 1 ngay
        let checkNew = Date.parse(checkNew1) / 1000;
        let checkOld1 = new Date(inputOld)
        let checkOld = Date.parse(checkOld1) / 1000
        const currentDate = new Date();
        const previousDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)
        const inDay1 = new Date(previousDate)
        const inDay = Date.parse(inDay1) / 1000;

        if (checkOld > checkNew) {
            await functions.setError(res, "thời gian nhập không đúng quy định")
        }

        listCondition.type = 1;
        //tìm kiếm qua trang web
        // if (fromWeb) listCondition.fromWeb = fromWeb;
        if (com_id) {
            listCondition.idQLC = com_id;
        }

        if (inputNew || inputOld) listCondition['createdAt'] = { $gte: checkOld, $lte: checkNew };
        if (find) listCondition["$or"] = [
            { "userName": { $regex: find } },
            { "email": { $regex: find } },
            { "phoneTK": { $regex: find } }
        ];

        if (type) listCondition.type = type;
        //tiìm kiếm công ty đang vip thì cho vip = 1 
        if (findConditions == 1) {
            listCondition = {
                $and: [
                    { "inForCompany.cds.com_vip_time": { $ne: 0 } },
                    { "inForCompany.cds.com_vip_time": { $gt: functions.getTimeNow() } },
                    { "inForCompany.cds.com_vip": 1 }
                ]
            }
        }

        //tìm kiếm công ty từng vip thì cho time vip != 0
        if (findConditions == 2) {
            listCondition = {
                $and: [
                    { "inForCompany.cds.com_vip_time": { $ne: 0 } },
                    { "inForCompany.cds.com_vip_time": { $lt: functions.getTimeNow() } },
                    { "inForCompany.cds.com_vip": 1 }
                ]
            }
        }

        //tìm kiếm công ty chưa vip thì cho vip = 0 va time vip = 0
        if (findConditions == 3)
            listCondition['inForCompany.cds.com_vip'] = 0, listCondition['inForCompany.cds.com_vip_time'] = 0;
        //danh sach cty dang ki loi , chua kich hoat
        if (findConditions == 4)
            listCondition["authentic"] = 0;
        //danah sach cong ty ddang ki trong ngay
        if (findConditions == 5)
            listCondition['createdAt'] = { $gte: inDay }
            //danh sach cong ty su dung cham cong trong ngay
        if (findConditions == 6) {
            listCondition['inForCompany.cds.type_timekeeping'] = { $ne: 0 };
            listCondition['createdAt'] = { $gte: inDay }
        }
        data = await user.find(listCondition).select('userName email phoneTK phone emailContact address fromWeb createdAt status_com authentic inForCompany.cds.com_vip inForCompany.cds.com_ep_vip inForCompany.cds.com_vip_time idQLC').skip((pageNumber - 1) * 25).limit(25).sort({ _id: -1 }).lean();

        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            element.count_emp = await user.countDocuments({
                "inForPerson.employee.com_id": element.idQLC,
                "inForPerson.employee.ep_status": "Active",
            });
        }

        let count = await user.countDocuments(listCondition)

        return functions.success(res, 'Lấy thành công', { data, count });
    } catch (err) {
        return functions.setError(res, err.message);
    };
}

exports.updatePassword = async(req, res, next) => {
    try {
        let password = req.body.password;
        let com_id = req.body.com_id;
        if (password && com_id) {
            let checkPassword = await functions.verifyPassword(password)
            if (checkPassword) {
                return functions.setError(res, "sai dinh dang Mk", 404)
            }
            if (password.length < 6) {
                return functions.setError(res, 'Password quá ngắn', 400)
            }
            let find = await user.findOne({ idQLC: com_id, type: 1 }).lean()
            if (!find) {
                await functions.setError(res, " không tìm thấy công ty ")
            } else {
                await user.updateOne({ idQLC: com_id, type: 1 }, {
                    $set: {
                        password: md5(password),
                    }
                });
                return functions.success(res, 'cập nhập thành công')
            }

        } else {
            return functions.setError(res, "nhập thiếu thông tin", 404)

        }


    } catch (error) {
        return functions.setError(res, error)
    }
}

exports.getListFeedback = async(req, res) => {
    try {
        const pageNumber = req.body.pageNumber || 1;
        const request = req.body;
        const data = await feedback.aggregate([
            { $match: {} },
            { $sort: { _id: -1 } },
            { $skip: (pageNumber - 1) * 25 },
            { $limit: 25 },
            {
                $lookup: {
                    from: "Users",
                    localField: "id_user",
                    foreignField: "_id",
                    as: "user"
                }
            }, {
                $unwind: "$user"
            },
            {
                $project: {
                    feed_back: 1,
                    rating: 1,
                    userName: "$user.userName",
                    phone: "$user.phone",
                    emailContact: "$user.emailContact",
                    email: "$user.email",
                    createdAt: "$create_date"
                }
            }
        ]);

        // data = await feedback.find({}).skip((pageNumber - 1) * 25).limit(25).sort({ _id: -1 }).lean();
        if (data === []) {
            await functions.setError(res, 'Không có dữ liệu', 404);
        } else {
            let count = await feedback.countDocuments({})
            return functions.success(res, 'Lấy thành công', { data, count });
        }


    } catch (e) {
        return functions.setError(res, e.message)
    }

}
exports.getListReportErr = async(req, res) => {
    try {
        const pageNumber = req.body.pageNumber || 1;
        let skip = (pageNumber - 1) * 25;
        let data = await report.aggregate([{
                    $lookup: {
                        from: "Users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: "$user" },
                {
                    $sort: {
                        _id: -1
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: 25
                },
                {
                    $project: {
                        "id_report": "$id_report",
                        "user_id": "$user_id",
                        "detail_error": "$detail_error",
                        "gallery_image_error": "$gallery_image_error",
                        "time_create": "$time_create",
                        "from_source": "$from_source",
                        "user_id": "$user_id",
                        "userName": "$user.userName",
                        "type": "$user.type",
                        "phoneTK": "$user.phoneTK",
                        "emailContact": "$user.emailContact",
                        "email": "$user.email",
                    }
                },
            ])
            //.skip((pageNumber - 1) * 25).limit(25).sort({ _id: -1 });
        for (let i = 0; i < data.length; i++) {
            data[i].gallery_image_error = await fnc.createLinkFileErrQLC(data[i].type, data[i].user_id, data[i].gallery_image_error)
        }
        if (data === []) {
            await functions.setError(res, 'Không có dữ liệu', 404);
        } else {
            let count = await report.countDocuments({})
            return functions.success(res, 'Lấy thành công', { data, count });
        }

    } catch (e) {
        return functions.setError(res, e.message)
    }

}