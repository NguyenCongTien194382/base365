const Deparment = require("../../models/qlc/Deparment")
const functions = require("../../services/functions")
const Users = require("../../models/Users")
const fnc = require("../../services/qlc/functions")


exports.list = async(req, res) => {
    try {
        let com_id = req.body.com_id;
        /*  Nếu đăng nhập mà ko truyền lên com_id qua formData thì lấy com_id trong token */
        if (req.user && !com_id) {
            com_id = req.user.data.com_id;
        }

        let dep_id = req.body.dep_id;

        if (com_id) {
            let condition = { com_id: com_id };
            if (dep_id) {
                condition.dep_id = dep_id;
            }

            const data = await Deparment.find(condition).sort({ dep_id: -1 }).lean();
            const depID = data.map(item => item.dep_id);
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                element.total_emp = await functions.findCount(Users, {
                    "inForPerson.employee.com_id": com_id,
                    "inForPerson.employee.dep_id": element.dep_id,
                    type: 2,
                    "inForPerson.employee.ep_status": "Active"
                });

                const manager = await Users.findOne({
                    "inForPerson.employee.com_id": com_id,
                    "inForPerson.employee.dep_id": element.dep_id,
                    type: 2,
                    "inForPerson.employee.ep_status": "Active",
                    "inForPerson.employee.position_id": 6,
                }, { userName: 1 });
                element.manager = (manager) ? manager.userName : "";

                const deputy = await Users.findOne({
                    "inForPerson.employee.com_id": com_id,
                    "inForPerson.employee.dep_id": element.dep_id,
                    type: 2,
                    "inForPerson.employee.ep_status": "Active",
                    "inForPerson.employee.position_id": 5,
                }, { userName: 1 });
                element.deputy = (deputy) ? deputy.userName : "";

            }

            const totalItems = await Deparment.countDocuments(condition);
            return functions.success(res, 'Lấy thành công', { totalItems, items: data });
        }
        return functions.setError(res, 'Chưa truyền com_id');
    } catch (err) {
        console.log(err)
        return functions.setError(res, err.message)
    }
};
//API tạo mới một phòng ban
exports.createDeparment = async(req, res) => {
    try {

        const com_id = req.user.data.com_id,
            type = req.user.data.type;


        let now = new Date()
        if (type == 1) {

            const { dep_name, manager_id, dep_order } = req.body;
            if (com_id && dep_name) {
                //Lấy ID kế tiếp, nếu chưa có giá trị nào thì bằng 1
                const foundGateway = await Deparment.findOne({
                    com_id,
                    dep_name
                })
                if (foundGateway) {
                    return functions.setError(res, "Tên phòng ban đã tồn tại", 504);
                }
                let maxID = await Deparment.findOne({}, {}, { sort: { dep_id: -1 } }).lean() || 0;
                const deparments = new Deparment({
                    dep_id: Number(maxID.dep_id) + 1 || 1,
                    com_id: com_id,
                    dep_name: dep_name,
                    manager_id: manager_id,
                    dep_create_time: Date.parse(now),
                    dep_order: dep_order || 0,
                });

                await deparments.save();
                return functions.success(res, "Tạo thành công", { deparments });
            }
            return functions.setError(res, "Nhập thiếu thông tin", 504);
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);

    } catch (error) {
        return functions.setError(res, error.message)

    }
};
//API thay dổi thông tin của một phòng ban
exports.editDeparment = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
            // const com_id = req.body.com_id
        const type = req.user.data.type
        const dep_id = req.body.dep_id;
        if (type == 1) {
            const { dep_name, manager_id, dep_order } = req.body;

            const deparment = await functions.getDatafindOne(Deparment, { dep_id: dep_id });
            if (deparment) {
                const foundGateway = await Deparment.findOne({
                    dep_id: {
                        $ne: dep_id
                    },
                    com_id,
                    dep_name: dep_name,
                })

                if (foundGateway) {
                    return functions.setError(res, "Tên phòng ban đã tồn tại", 510)
                }
                await functions.getDatafindOneAndUpdate(Deparment, { com_id: com_id, dep_id: dep_id }, {
                    dep_name: dep_name,
                    manager_id: manager_id,
                    dep_order: dep_order,
                })
                return functions.success(res, "Sửa phòng ban thành công", { deparment })
            }
            return functions.setError(res, "Phòng ban không tồn tại", 510);
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (error) {
        return functions.setError(res, error.message)
    }
};
//API xóa một phòng ban theo id
exports.deleteDeparment = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
            // const com_id = req.body.com_id
        const type = req.user.data.type
        const dep_id = req.body.dep_id;
        if (type == 1) {

            if (com_id && dep_id) {
                // cập nhật thông tin phòng ban đã xóa = 0 cho user
                await Users.updateOne({ "inForPerson.employee.com_id": com_id, "inForPerson.employee.dep_id": dep_id }, { $set: { "inForPerson.employee.dep_id": 0 } })
                const deparment = await functions.getDatafindOne(Deparment, { com_id: com_id, dep_id: dep_id });
                if (deparment) {
                    functions.getDataDeleteOne(Deparment, { com_id: com_id, dep_id: dep_id })
                    return functions.success(res, "Delete deparment successfully!", { deparment })
                }
                return functions.setError(res, "Deparment not exist!", 510);

            }
            return functions.setError(res, "Thiếu id phòng ban muốn xóa hoặc thiếu id công ty", 502);
        }
        return functions.setError(res, "Tài khoản không phải Công ty", 604);
    } catch (error) {
        return functions.setError(res, error.message)
    }
};
// API xóa nhân viên khỏi phòng ban
// API luân chuyển phòng ban