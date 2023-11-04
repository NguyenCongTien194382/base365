const Device = require("../../models/qlc/EmployeeDevice")
const timeSheet = require("../../models/qlc/TimeSheets")
const Users = require("../../models/Users")
const functions = require("../../services/functions")

exports.getlist = async(req, res) => {
    try {
        const com_id = Number(req.body.com_id);
        const type = req.user.data.type;
        const page = req.body.page || 1;
        const pageSize = req.body.pageSize || 10;
        // if(com_id == req.user.data.idQLC){
        // let dep_id = req.body.dep_id;
        // let findbyNameUser = req.body.findbyNameUser;
        let condition = {};

        if (type == 1) {
            // if (com_id) condition["com_id"] = Number(com_id)
            // if (dep_id) condition.dep_id = Number(dep_id)
            // if (findbyNameUser) condition["userName"] = { $regex: findbyNameUser };
            let data = await Users.aggregate([{
                    $match: {
                        "inForPerson.employee.com_id": com_id
                    }
                },
                { $sort: { ep_id: -1 } },
                { $skip: (page - 1) * pageSize },
                { $limit: pageSize },
                {
                    $lookup: {
                        from: "QLC_EmployeeDevice",
                        localField: "idQLC",
                        foreignField: "ep_id",
                        as: "listDevice"
                    }
                },
                { $unwind: "$listDevice" },
                {
                    $project: {
                        _id: 0,
                        ed_id: "$listDevice.ed_id",
                        current_device: "$listDevice.current_device",
                        current_device_name: "$listDevice.current_device_name",
                        new_device: "$listDevice.new_device",
                        new_device_name: "$listDevice.new_device_name",
                        ep_id: "$idQLC",
                        ep_email: "$email",
                        ep_name: "$userName",
                        dep_id: "$inForPerson.employee.dep_id",
                        com_id: "$inForPerson.employee.com_id",
                        ep_phone: "$phone",
                        ep_image: "$avatarUser",
                        position_id: "$inForPerson.employee.position_id",
                        ep_status: "$inForPerson.employee.ep_status",
                        com_id: "$inForPerson.employee.com_id",
                        // com_id: "$inForPerson.employee.com_id",
                        // com_id: "$inForPerson.employee.com_id",
                    }
                },
            ]);
            let total = 0;
            if (data.length > 0) {
                const countResult = await Users.aggregate([{
                        $match: {
                            "inForPerson.employee.com_id": com_id
                        }
                    },
                    {
                        $lookup: {
                            from: "QLC_EmployeeDevice",
                            localField: "idQLC",
                            foreignField: "ep_id",
                            as: "listDevice"
                        }
                    },
                    { $unwind: "$listDevice" },
                    { $count: "total" },
                ]);
                total = countResult[0].total;
            }
            return functions.success(res, 'Lấy thành công', { totalItems: total, items: data });
        }
        // }


        return functions.setError(res, "Tài khoản không phải Công ty");

    } catch (err) {

        return functions.setError(res, err.message)
    }


}

//tao moi yeu cau
exports.createDevice = async(req, res) => {
    try {
        const { ep_id, current_device_name, new_device_name, current_device, new_device, type_device } = req.body
            //check loi 
        if (ep_id && current_device) {
            let maxID = await Device.findOne({}, {}, { sort: { ed_id: -1 } }).lean() || 0

            const ed_id = Number(maxID.ed_id) + 1 || 1;
            const device = new Device({
                ed_id: ed_id,
                ep_id: ep_id,
                current_device: current_device,
                new_device: new_device,
                current_device_name: current_device_name,
                new_device_name: new_device_name,
                type_device: type_device,
            })
            await device.save()
            return functions.success(res, "tạo thành công", { device })
        }
        return functions.setError(res, "vui lòng nhập đủ ep_id và current_device")
    } catch (err) {

        return functions.setError(res, err.message)
    }

}

//duyet 
exports.add = async(req, res) => {
    try {
        ed_id = req.body.ed_id
        const data = await functions.getDatafindOne(Device, { ed_id: ed_id });
        if (data) {
            newIDDevice = data.new_device
            newNameDevice = data.new_device_name
            await functions.getDatafindOneAndUpdate(Device, { ed_id: ed_id }, {
                current_device: newIDDevice,
                current_device_name: newNameDevice,
                new_device: null,
                new_device_name: null,
            })
            await functions.getDatafindOneAndUpdate(timeSheet, { ed_id: ed_id, status: 2, ts_image: '' }, {
                is_success: 1,
            })
            return functions.success(res, "duyệt thành công");
        }
        return functions.setError(res, "ed_id không tồn tại ");
    } catch (err) {
        return functions.setError(res, err.message)
    }

}

exports.delete = async(req, res) => {
    try {
        const ed_id = req.body.ed_id
        if (ed_id) {
            const data = await functions.getDatafindOne(Device, { ed_id: ed_id });
            if (data) {
                functions.getDataDeleteOne(Device, { ed_id: ed_id })
                return functions.success(res, "xóa thành công !", { data })
            }
            return functions.setError(res, "không tồn tại!", 510);
        }
        return functions.setError(res, "Thiếu trường ed_id ", );
    } catch (error) {
        return functions.setError(res, error.message)
    }
};