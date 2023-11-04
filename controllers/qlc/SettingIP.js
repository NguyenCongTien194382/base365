const functions = require("../../services/functions")
const SettingIP = require("../../models/qlc/SettingIP")



//lấy danh sách 

exports.getListByID = async(req, res) => {
    try {
        // const com_id = req.user.data.com_id
        const com_id = req.body.com_id

        const type = req.user.data.type
        if (type == 1) {
            const id_acc = req.body.id_acc;
            let condition = { id_com: com_id }
            if (id_acc) condition.id_acc = id_acc;
            const data = await SettingIP.find(condition).select('id_acc from_site ip_access created_time update_time').sort({ id_acc: -1 }).lean();
            if (data) {
                return functions.success(res, 'lấy thành công ', { data })
            }
            return functions.setError(res, 'không tìm thấy cài đặt IP')
        }
        return functions.setError(res, "Tài khoản không phải Công ty");
    } catch (error) {
        console.log(error);
        functions.setError(res, error.message);
    }
}

exports.getList = async(req, res) => {
    try {
        // const com_id = req.user.data.com_id

        const type = req.user.data.type
        if (type == 1) {
            let page = Number(req.body.page) || 1;
            let pageSize = Number(req.body.pageSize) || 10;
            const skip = (page - 1) * pageSize;
            const limit = pageSize;
            const com_id = req.body.com_id
            const id_acc = req.body.id_acc;
            const dep_id = req.body.dep_id;
            const team_id = req.body.team_id;
            const gr_id = req.body.gr_id;
            const comName = req.body.comName;
            let condition = {}
            if (com_id) condition.id_com = Number(com_id)
            if (id_acc) condition.id_acc = Number(id_acc);
            if (dep_id) condition.dep_id = Number(dep_id);
            if (team_id) condition.team_id = Number(team_id);
            if (gr_id) condition.gr_id = Number(gr_id);
            if (comName) condition.Name = { $regex: comName }
            const result = await SettingIP.aggregate([
                { $match: condition },
                { $skip: skip },
                { $limit: limit },
                { $sort: { id_acc: -1 } },
                {
                    $lookup: {
                        from: "Users",
                        localField: "id_com",
                        foreignField: "idQLC",
                        pipeline: [{
                            $match: {
                                $and: [
                                    { "type": 1 },
                                    { "idQLC": { $ne: 0 } },
                                    { "idQLC": { $ne: 1 } }
                                ]
                            },
                        }],
                        as: "info"
                    }
                },
                { $unwind: { path: "$info", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        id_acc: 1,
                        id_com: 1,
                        ip_access: 1,
                        Name: 1,
                        dep_id: 1,
                        team_id: 1,
                        gr_id: 1,
                        "Name_company": "$info.userName",
                    }
                },
                {
                    $facet: {
                        paginatedResults: [{ $skip: skip }, { $limit: limit }],
                        totalCount: [{
                            $count: 'count'
                        }]
                    }
                }

            ])
            if (result[0].totalCount.length > 0) {
                const data = result[0].paginatedResults;
                const totalCount = result[0].totalCount[0].count;
                return functions.success(res, "lấy thành công", { data, totalCount })
            }
            return functions.setError(res, "khong tim thay du lieu")
        }
        return functions.setError(res, "Tài khoản không phải Công ty");
    } catch (error) {
        console.log(error);
        functions.setError(res, error.message);
    }
}

//tạo 1 thiết lập Ip
exports.createIP = async(req, res) => {
        try {
            const com_id = req.user.data.com_id;
            const type = req.user.data.type;
            if (type == 1) {
                const list = req.body;
                if (list) {
                    for (let index = 0; index < list.length; index++) {
                        const element = list[index];
                        const maxId = await SettingIP.findOne({}, { id_acc: 1 }, { sort: { id_acc: -1 } }).lean();
                        const id_acc = Number(maxId.id_acc) + 1;
                        const newData = new SettingIP({
                            id_acc: id_acc,
                            id_com: com_id,
                            ip_access: element.ip_access,
                            from_site: element.from_site,
                            created_time: functions.getTimeNow()
                        });
                        await newData.save();
                    }
                    return functions.success(res, "Thành công");
                }
                return functions.setError(res, "thiếu thông tin IP hoặc from_site ");
            }
            return functions.setError(res, "Tài khoản không phải Công ty");

        } catch (error) {
            return functions.setError(res, error.message)
        }
    }
    //tạo 1 thiết lập Ip 
exports.create1IP = async(req, res) => {
    try {
        const { com_id, ip_access, Name, dep_id, team_id, gr_id } = req.body;
        const type = req.user.data.type;
        if (type == 1) {
            if (com_id && ip_access && Name && dep_id) {
                const maxId = await SettingIP.findOne({}, { id_acc: 1 }, { sort: { id_acc: -1 } }).lean() || 0;
                const id_acc = Number(maxId.id_acc) + 1 || 1;
                const newData = new SettingIP({
                    id_acc: id_acc,
                    id_com: com_id, //id cong ty con
                    ip_access: ip_access,
                    Name: Name,
                    dep_id: dep_id,
                    team_id: team_id,
                    gr_id: gr_id,
                    created_time: functions.getTimeNow()
                });
                await newData.save();
                return functions.success(res, "Thành công");
            }
            return functions.setError(res, "thiếu thông tin truyền lên ");
        }
        return functions.setError(res, "Tài khoản không phải Công ty");

    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.editsettingIP = async(req, res) => {
    try {
        const com_id = req.user.data.com_id;
        const type = req.user.data.type;
        if (type == 1) {
            const { id_acc, ip_access, from_site } = req.body;
            if (ip_access && from_site && com_id) {
                const settingIP = await SettingIP.findOne({ id_acc: id_acc });
                if (settingIP) {
                    await functions.getDatafindOneAndUpdate(SettingIP, { id_acc: id_acc }, {
                        from_site: from_site,
                        ip_access: ip_access,
                        update_time: new Date(),
                    })
                    return functions.success(res, " sửa thành công ");
                }
                return functions.setError(res, "IP không tồn tại!");
            }
            return functions.setError(res, "thiếu thông tin")
        }
        return functions.setError(res, "Tài khoản không phải Công ty");

    } catch (error) {
        return functions.setError(res, error.message)
    }

}

exports.deleteSetIpByID = async(req, res) => {
    try {
        const com_id = req.user.data.com_id;
        const type = req.user.data.type;
        if (type == 1) {
            const id_acc = req.body.id_acc;

            if (com_id && id_acc) {
                const settingIp = await functions.getDatafind(SettingIP, { id_acc: id_acc });
                if (settingIp) {
                    await functions.getDataDeleteOne(SettingIP, { id_acc: id_acc })
                    return functions.success(res, "xóa thành công")
                }
                return functions.setError(res, "không tìm thấy IP");
            }
            return functions.setError(res, "nhập id_acc cần xóa");
        }
        return functions.setError(res, "Tài khoản không phải Công ty");

    } catch (error) {
        return functions.setError(res, error.message)
    }
}