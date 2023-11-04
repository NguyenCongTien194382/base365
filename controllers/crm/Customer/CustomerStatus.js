const functions = require("../../../services/functions");
const CustomerStatus = require("../../../models/crm/Customer/customer_status");
const User = require("../../../models/Users");

// hiển thị + tìm kiếm
exports.getList = async(req, res) => {
    try {
        let { stt_name, page, pageSize } = req.body; // Thêm tham số page và pageSize
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            const com_id = req.user.data.com_id;
            page = page || 1;
            pageSize = pageSize || 10;
            let query = {
                com_id: com_id,
                is_delete: 0,
            };
            if (stt_name) {
                query.stt_name = { $regex: stt_name, $options: "i" };
            }

            let count = await CustomerStatus.countDocuments(query); // Tính tổng số bản ghi thỏa mãn query

            let data = await CustomerStatus.find(query)
                .select("stt_id stt_name created_user type_created status is_delete created_at updated_at")
                .sort({ stt_id: -1 })
                .skip((page - 1) * pageSize) // Bỏ qua các bản ghi trước trang cần lấy
                .limit(pageSize) // Giới hạn số bản ghi trên mỗi trang
                .lean();

            let listUser = await User.find({ "inForPerson.employee.com_id": com_id })
                .select("idQLC userName")
                .lean();

            // for (let i = 0; i < data.length; i++) {
            //     let element = data[i];
            //     let employee = listUser.find(e => Number(e.idQLC) == Number(element.created_user));
            //     if (employee) {
            //         element.userName = employee.userName;
            //     } else {
            //         element.userName = "";
            //     }
            // }
            {
                return res
                    .status(200)
                    .json({
                        result: true,
                        message: "Danh sách tình trạng",
                        data: data,
                        count: count,
                        error: null,
                    });
            }
        } else {
            return functions.setError(res, "không có quyền truy cập", 400);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// tạo mới
exports.create = async(req, res) => {
    try {
        let { stt_name } = req.body;
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            const com_id = req.user.data.com_id;
            const creator_id = req.user.data.idQLC;
            const type_created = req.user.data.type;
            const maxIDStatus = await functions.getMaxIdByField(
                CustomerStatus,
                "stt_id"
            );
            const checkCs = await CustomerStatus.findOne({
                com_id: com_id,
                stt_name: stt_name,
            });
            if (checkCs) {
                return functions.setError(res, "tên tình trạng  đã được sử dụng", 400);
            } else {
                let createStatus = new CustomerStatus({
                    stt_id: maxIDStatus,
                    stt_name: stt_name,
                    com_id: com_id,
                    status: 1,
                    type_created: type_created,
                    created_user: creator_id,
                    is_delete: 0,
                    created_at: functions.getTimeNow(),
                    updated_at: functions.getTimeNow(),
                });
                let saveCs = await createStatus.save();
                return functions.success(res, "thêm thành công", { saveCs });
            }
        } else {
            return functions.setError(res, "không có quyền truy cập", 400);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

exports.update = async(req, res) => {
    try {
        let { stt_id, stt_name, status } = req.body;
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            const com_id = req.user.data.com_id;
            if (!stt_id) {
                return functions.setError(res, "stt_id không được bỏ trống", 400);
            }
            if (typeof stt_id !== "number" && isNaN(Number(stt_id))) {
                return functions.setError(res, "stt_id phải là 1 số", 400);
            }
            let updateCs = await CustomerStatus.findOneAndUpdate({ stt_id: stt_id, com_id: com_id }, {
                $set: {
                    stt_name: stt_name,
                    status: status,
                    updated_at: functions.getTimeNow(),
                },
            }, { new: true });
            if (!updateCs) {
                return functions.setError(
                    res,
                    "Không tìm thấy bản ghi phù hợp để thay đổi",
                    400
                );
            }
            return functions.success(res, "edit data success", { updateCs });
        } else {
            return functions.setError(res, "không có quyền truy cập", 400);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

exports.delete = async(req, res) => {
    try {
        let { stt_id } = req.body;
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            const com_id = req.user.data.com_id;
            if (!stt_id) {
                return functions.setError(res, "stt_id không được bỏ trống", 400);
            }
            if (typeof stt_id !== "number" && isNaN(Number(stt_id))) {
                return functions.setError(res, "stt_id phải là 1 số", 400);
            }
            let updateCs = await CustomerStatus.findOneAndUpdate({ stt_id: stt_id, com_id: com_id }, {
                $set: {
                    is_delete: 1,
                },
            }, { new: true });
            if (!updateCs) {
                return functions.setError(
                    res,
                    "Không tìm thấy bản ghi phù hợp để xóa",
                    400
                );
            }
            return functions.success(
                res,
                "xóa thành công thêm vào danh sách đã xóa", { updateCs }
            );
        } else {
            return functions.setError(res, "không có quyền truy cập", 400);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

exports.details = async(req, res) => {
    try {
        let { stt_id } = req.body;
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            const com_id = req.user.data.com_id;
            if (!stt_id) {
                return functions.setError(res, "stt_id không được bỏ trống", 400);
            }
            if (typeof stt_id !== "number" && isNaN(Number(stt_id))) {
                return functions.setError(res, "stt_id phải là 1 số", 400);
            }
            let data = await CustomerStatus.findOne({
                stt_id: stt_id,
                com_id: com_id,
            }).select("stt_id stt_name status is_delete");
            if (!data) {
                return functions.setError(res, "không tìm thấy bản ghi phù hợp", 400);
            } {
                return res
                    .status(200)
                    .json({ result: true, message: "Thông tin tình trạng", data: data });
            }
        } else {
            return functions.setError(res, "không có quyền truy cập", 400);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};