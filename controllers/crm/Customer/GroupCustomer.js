// const GroupCustomer = require("../../models/crm/GroupCustomer")
const functions = require("../../../services/functions");
const serviceCRM = require("../../../services/CRM/CRMservice");
const Customer_group = require("../../../models/crm/Customer/customer_group");
const Users = require("../../../models/Users");

exports.getListGroup = async(req, res) => {
    try {
        let { page, gr_name, perPage, gr_id } = req.body;
        page = page || 1;
        perPage = perPage || 10; // Số lượng giá trị hiển thị trên mỗi trang
        const startIndex = (page - 1) * perPage;
        let query;
        const user = req.user.data;
        let com_id = user.com_id;
        if (user.type == 1) {
            query = {
                company_id: com_id,
                is_delete: 0,
                group_parent: 0
            };
        }

        if (user.type == 2) {
            let emp_id = user.idQLC;
            const employee = await Users.findOne({ idQLC: emp_id, type: user.type })
                .select("inForPerson.employee.dep_id")
                .lean();
            let dep_id = employee.inForPerson.employee.dep_id;
            query = {
                is_delete: 0,
                company_id: com_id,
                group_parent: 0,
                $or: [
                    { $and: [{ emp_id: "all" }, { dep_id: "all" }] },
                    { $and: [{ dep_id: { $regex: '(^|,)' + dep_id + '(,|$)' } }, { emp_id: { $regex: '(^|,)' + emp_id + '(,|$)' } }] },
                    { $and: [{ dep_id: "all" }, { emp_id: { $regex: '(^|,)' + emp_id + '(,|$)' } }] },
                    { $and: [{ dep_id: { $regex: '(^|,)' + dep_id + '(,|$)' } }, { emp_id: "all" }] },
                ],
            };
        }
        if (gr_name) {
            query.gr_name = { $regex: new RegExp(gr_name, "i") };
        }
        let count = await Customer_group.countDocuments(query);

        let parentGroups = await Customer_group.find(query)
            .sort({ updated_at: -1 })
            .skip(startIndex)
            .limit(perPage)
            .lean();

        // Lấy danh sách con cho mỗi đối tượng cha
        for (const parentGroup of parentGroups) {
            parentGroup.lists_child = await Customer_group.find({
                    group_parent: parentGroup.gr_id,
                    is_delete: 0,
                })
                .sort({ updated_at: -1 });
        }

        return res.status(200).json({
            result: true,
            message: "Danh sách nhóm KH",
            data: parentGroups,
            count: count,
            error: null,
        });
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
};

exports.details = async(req, res) => {
    try {
        let { gr_id } = req.body;
        if (req.user.data.type == 1 || req.user.data.type == 2) {
            const com_id = req.user.data.com_id;
            if (!gr_id) {
                return functions.setError(res, "gr_id không được bỏ trống", 400);
            }
            if (typeof gr_id !== "number" && isNaN(Number(gr_id))) {
                return functions.setError(res, "gr_id phải là 1 số", 400);
            }
            const checkGroup = await Customer_group.findOne({
                gr_id: gr_id,
                company_id: com_id,
            });
            if (!checkGroup) {
                return functions.setError(res, "không tìm thấy bản ghi phù hợp", 400);
            }
            return res.status(200).json({
                result: true,
                message: "Thông tin nhóm KH",
                data: checkGroup,
            });
        } else {
            return functions.setError(res, "Bạn không có quyền", 400);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

exports.createGroup = async(req, res) => {
    try {
        const { groupName, groupDescription, groupParents, dep_id, emp_id } = req.body;
        if (groupName) {
            if (req.user.data.type == 1) {
                const company_id = req.user.data.idQLC;
                let checkName = await Customer_group.findOne({
                    gr_name: groupName,
                    company_id: company_id,
                });
                const now = functions.getTimeNow();
                if (!checkName) {
                    let maxId = 0;
                    let Cus_gr = await Customer_group.findOne({}, { gr_id: 1 }, { sort: { gr_id: -1 } }).lean();
                    if (Cus_gr) {
                        maxId = Cus_gr.gr_id + 1;
                    }
                    let group = new Customer_group({
                        gr_id: maxId,
                        gr_name: groupName,
                        gr_description: groupDescription,
                        group_parent: groupParents !== null ? groupParents : 0,
                        company_id: company_id,
                        dep_id: dep_id,
                        emp_id: emp_id,
                        created_at: now,
                        updated_at: now,
                    });
                    await group.save();
                    return functions.success(res, "Tạo nhóm thành công", { group });
                } else {
                    return functions.setError(res, "tên đã được sử dụng");
                }
            }
            return functions.setError(res, "không có quyền truy cập");
            // if (req.user.data.type == 2) {
            //     company_id = req.user.data.inForPerson.employee.com_id;
            //     let checkName = await Customer_group.findOne({
            //         gr_name: groupName,
            //         company_id: company_id,
            //     });
            //     if (!checkName) {
            //         let depId = dep_id;
            //         let maxId = 0;
            //         let Cus_gr =
            //             (await Customer_group.findOne({}, {}, { sort: { gr_id: -1 } }).lean()) || 0;
            //         if (Cus_gr) {
            //             maxId = Cus_gr.gr_id;
            //         }
            //         let group = new Customer_group({
            //             gr_id: maxId,
            //             gr_name: groupName,
            //             gr_description: groupDescription,
            //             group_parent: groupParents !== null ? groupParents : 0,
            //             company_id: company_id,
            //             dep_id: dep_id,
            //             emp_id: emp_id,
            //             created_at: new Date(),
            //             updated_at: new Date(),
            //         });
            //         await group.save();
            //         return res.status(200).json({ data: group, message: "success" });
            //     } else {
            //         res.status(400).json({ error: "tên đã được sử dụng" });
            //     }
            // } else {
            //     return functions.setError(res, "không có quyền truy cập", 400);
            // }
        }
        return functions.setError(res, "Chưa truyền tên nhóm khách hàng");
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

exports.update = async(req, res) => {
    try {
        const {
            gr_id,
            name,
            group_cus_parent,
            description,
            share_group_child,
            dep_id,
            emp_id,
        } = req.body;
        if (name && gr_id) {
            // Kiểm tra sự tồn tại của nhóm khách hàng
            const check = await Customer_group.findOne({
                gr_name: name,
                gr_id: gr_id,
            });
            if (check) {
                return functions.setError(res, "tên nhóm khách hàng đã tồn tại", 400);
            }

            // Cập nhật nhóm khách hàng
            const updatedGroup = await Customer_group.findOneAndUpdate({ gr_id: gr_id }, {
                gr_name: name,
                gr_description: description,
                group_parent: group_cus_parent || 0,
                dep_id: dep_id,
                emp_id: emp_id,
                updated_at: functions.getTimeNow(),
            }, { new: true });

            if (updatedGroup) {
                // Chia sẻ nhóm khách hàng con
                if (updatedGroup.group_parent === 0 && share_group_child === 1) {
                    // Lấy danh sách nhóm khách hàng con
                    const list_gr_child = await Customer_group.find({
                        company_id: company_id,
                        group_parent: gr_id,
                        is_delete: 0,
                    });

                    const data_update_child = {
                        dep_id: dep_id,
                        emp_id: emp_id,
                        updated_at: functions.getTimeNow(),
                    };

                    const gr_id_child = list_gr_child.map((item) => item.gr_id);

                    if (gr_id_child.length > 0) {
                        const condition_update_child = { gr_id: { $in: gr_id_child } };
                        await Customer_group.updateMany(
                            condition_update_child,
                            data_update_child
                        );
                    }
                }

                return functions.success(res, "Chỉnh sửa nhóm khách hàng thành công!");
            } else {
                return functions.setError(res, "chia sẻ không thành công", 400);
            }
        } else {
            return functions.setError(res, "phải truyền name và gr_id", 400);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

exports.delete = async(req, res) => {
    try {
        const listDeleteId = req.body.listDeleteId;
        // Kiểm tra nếu listDeleteId không phải là mảng
        if (!Array.isArray(listDeleteId)) {
            return functions.setError(res, "listDeleteId phải là một mảng", 400);
        }
        // Kiểm tra số lượng phần tử trong mảng
        if (listDeleteId.length === 0) {
            return functions.setError(
                res,
                "listDeleteId phải chứa ít nhất một giá trị",
                400
            );
        }
        let numericIds = [];
        // Kiểm tra và chuyển đổi giá trị thành số
        if (listDeleteId.length === 1) {
            const numericId = Number(listDeleteId[0]);
            // Kiểm tra xem giá trị có phải là số hay không
            if (isNaN(numericId)) {
                return functions.setError(
                    res,
                    "listDeleteId phải là một mảng các giá trị số",
                    400
                );
            }
            numericIds.push(numericId);
        } else {
            numericIds = listDeleteId.map(Number);
            // Kiểm tra xem có giá trị không phải số trong mảng hay không
            if (numericIds.some(isNaN)) {
                return functions.setError(
                    res,
                    "listDeleteId must be an array of numeric values",
                    400
                );
            }
        }
        await Customer_group.deleteMany({ gr_id: { $in: numericIds } });
        return functions.success(res, "Group Customer deleted successfully");
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};