const functions = require('../../../services/functions');
const AdminUser = require('../../../models/Timviec365/Admin/AdminUser');
const QLC_Deparments = require('../../../models/qlc/Deparment');
const Users = require('../../../models/Users');
const AdminHR = require('../../../models/Timviec365/Admin/AdminNhanSuCrm');
const comID = 10003087;

//Lấy danh sách tài khoản nhân sự
exports.getListAccountPesonnel = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1;
        const perPage = Number(req.body.pageSize) || 20;
        const skip = (page - 1) * perPage;

        const listAccount = await AdminUser.aggregate([{
                $match: {
                    adm_bophan: 3
                }
            },
            {
                $skip: skip
            },
            {
                $limit: perPage
            },
            {
                $project: {
                    adm_id: 1,
                    adm_loginname: 1,
                    adm_password: 1,
                    adm_name: 1,
                    adm_email: 1,
                    adm_author: 1,
                    adm_isadmin: 1,
                    adm_active: 1,
                    admin_id: 1,
                    emp_id: 1
                }
            }
        ])

        var listAccount_1 = []

        // Thêm phòng ban
        for (const item of listAccount) {
            const emp_id = parseInt(item.emp_id);
            const data = await Users.findOne({ idQLC: emp_id })
                .select('inForPerson.employee.dep_id inForPerson.employee.com_id')
                .lean();

            if (data && data.inForPerson && data.inForPerson.employee) {
                const { com_id, dep_id } = data.inForPerson.employee;
                item.dep_id = dep_id;
                item.com_id = com_id;
                const deparment = await QLC_Deparments.findOne({ dep_id: dep_id, com_id: com_id })
                    .select('dep_name').lean()
                item.dep_name = deparment ? deparment.dep_name : ""
            } else {
                item.dep_name = ""
                item.dep_id = "";
                item.com_id = "";
            }
            listAccount_1.push(item);
        }

        const totalCount = await AdminUser.aggregate([{
                $match: {
                    adm_bophan: 3
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ])

        return functions.success(res, 'Lấy danh sách tài khoản nhân sự thành công', {
            listAccount: listAccount_1,
            total: totalCount[0].count
        });
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

//Lấy danh sách tài khoản kinh doanh
exports.listSaler = async(req, res) => {
    try {
        const page = Number(req.body.page) || 1;
        const perPage = Number(req.body.pageSize) || 30;
        const skip = (page - 1) * perPage;

        const listAccount = await AdminUser.aggregate([{
                $match: {
                    adm_bophan: { $ne: 0 }
                }
            },
            {
                $skip: skip
            },
            {
                $limit: perPage
            },
            {
                $project: {
                    adm_id: 1,
                    adm_loginname: 1,
                    adm_password: 1,
                    adm_name: 1,
                    adm_email: 1,
                    adm_author: 1,
                    adm_isadmin: 1,
                    adm_active: 1,
                    admin_id: 1,
                    emp_id: 1, // idQLC
                    adm_ntd: 1,
                    adm_bophan: 1
                }
            }
        ]);

        const listEmployee = await Users.aggregate([{
            $match: {
                "inForPerson.employee.com_id": comID
            }
        }, {
            $lookup: {
                from: "QLC_Deparments",
                localField: "inForPerson.employee.dep_id",
                foreignField: "dep_id",
                as: "deparment"
            }
        }, {
            $project: {
                ep_name: "$userName",
                dep_name: "$deparment.dep_name",
                ep_id: "$idQLC",
            }
        }]);

        for (let i = 0; i < listAccount.length; i++) {
            const element = listAccount[i];
            let dep_name = "";
            let ep_name = "";
            let ep_id = "";
            if (element.emp_id != 0) {
                const user = listEmployee.find(item => item.ep_id == element.emp_id);
                if (user) {
                    dep_name = user.dep_name.toString();
                    ep_name = user.ep_name;
                    ep_id = user.ep_id;
                }
            }
            element.dep_name = dep_name;
            element.ep_name = ep_name;
            element.ep_id = ep_id;
        }

        const totalCount = await AdminUser.aggregate([{
                $match: {
                    adm_bophan: { $ne: 0 }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ])

        return functions.success(res, 'Lấy danh sách tài khoản kinh doanh thành công', {
            data: listAccount,
            total: totalCount[0].count
        });
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

//Khóa tài khoản
exports.lockAccount = async(req, res) => {
    try {
        const adm_id = Number(req.body.adm_id);
        if (adm_id) {
            const admin = await AdminUser.findOne({
                adm_id: adm_id,
            }).select('adm_id adm_ntd').lean();

            if (admin) {
                const adm_ntd = Math.abs(admin.adm_ntd - 1);
                await AdminUser.updateOne({ adm_id }, { adm_ntd: adm_ntd });
                return functions.success(res, 'thành công');
            }
            return functions.setError(res, 'Không tìm thấy tài khoản');
        }
        return functions.setError(res, 'Chưa truyền adm_id');
    } catch (error) {
        return functions.setError(res, error.message)
    }

}

exports.updateInfor = async(req, res) => {
    try {
        const { adm_id, adm_loginname, adm_name, adm_email, adm_phone, adm_mobile, emp_id, emp_id_chat, adm_work247 } = req.body;
        if (adm_id) {
            const admin = await AdminUser.findOne({ adm_id });
            if (admin) {
                await AdminUser.updateOne({ adm_id }, {
                    $set: { adm_loginname, adm_name, adm_email, adm_phone, adm_mobile, emp_id, emp_id_chat, adm_work247 }
                });
                return functions.success(res, "Cập nhật thành công");
            }
            return functions.setError(res, "Không tìm thấy admin");

        }
        return functions.setError(res, "Chưa truyền adm_id");

    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.list_emp = async(req, res) => {
    try {
        let com_id = comID;
        if (req.body.com_id) {
            com_id = Number(req.body.com_id);
        }
        const listEmployee = await Users.aggregate([{
            $match: {
                "inForPerson.employee.com_id": com_id,
                "inForPerson.employee.ep_status": "Active"
            }
        }, {
            $lookup: {
                from: "QLC_Deparments",
                localField: "inForPerson.employee.dep_id",
                foreignField: "dep_id",
                as: "deparment"
            }
        }, {
            $project: {
                ep_name: "$userName",
                dep_name: "$deparment.dep_name",
                ep_id: "$idQLC",
            }
        }]);

        for (let i = 0; i < listEmployee.length; i++) {
            const element = listEmployee[i];
            element.dep_name = element.dep_name.toString();
        }
        return functions.success(res, 'Lấy ds nhân viên', {
            data: listEmployee
        });
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.getListAccountDataEntry = async(req, res) => {
    try {
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 30;
        let skip = (page - 1) * pageSize;
        let condition = { $and: [{ adm_nhaplieu: { $ne: 0 } }, { adm_nhaplieu: { $ne: 99 } }] }
        let dataNL = await AdminUser.aggregate([{
                $sort: { adm_id: -1 }
            },
            {
                $match: condition
            },
            {
                $skip: skip
            },
            {
                $limit: pageSize
            },
            {
                $project: {
                    _id: 1,
                    adm_id: 1,
                    adm_name: 1,
                    emp_id: 1,
                }
            }
        ])
        var listdataNL = [];
        // Thêm phòng ban
        for (const item of dataNL) {
            const emp_id = parseInt(item.emp_id);
            const data = await Users.findOne({ idQLC: emp_id })
                .select('userName inForPerson.employee.dep_id inForPerson.employee.com_id')
                .lean();
            if (data && data.inForPerson && data.inForPerson.employee) {
                const { com_id, dep_id } = data.inForPerson.employee;
                item.dep_id = dep_id;
                item.com_id = com_id;
                item.ep_name = data.userName;
                const deparment = await QLC_Deparments.findOne({ dep_id: dep_id, com_id: com_id })
                    .select('dep_name').lean()
                item.dep_name = deparment ? deparment.dep_name : ""
            } else {
                item.dep_name = ""
                item.dep_id = "";
                item.com_id = "";
            }
            listdataNL.push(item);
        }
        const countNL = await AdminUser.countDocuments(condition);
        return functions.success(res, "Danh sách admin nhập liệu", {
            data: listdataNL,
            count: countNL
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}

exports.ListAccountHR = async(req, res) => {
    try {
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 30;
        let skip = (page - 1) * pageSize;
        let dataNS = await AdminHR.aggregate([{
                $sort: { emp_id: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: pageSize
            },
            {
                $project: {
                    emp_id: 1,
                    active: 1,
                    time_created: 1,
                }
            }
        ])
        var listdataNS = [];
        // Thêm phòng ban
        for (const item of dataNS) {
            const emp_id = parseInt(item.emp_id);
            const data = await Users.findOne({ idQLC: emp_id })
                .select('userName inForPerson.employee.dep_id inForPerson.employee.com_id')
                .lean();
            if (data && data.inForPerson && data.inForPerson.employee) {
                const { com_id, dep_id } = data.inForPerson.employee;
                item.dep_id = dep_id;
                item.com_id = com_id;
                item.ep_name = data.userName;
                const deparment = await QLC_Deparments.findOne({ dep_id: dep_id, com_id: com_id })
                    .select('dep_name').lean()
                item.dep_name = deparment ? deparment.dep_name : ""
            } else {
                item.dep_name = ""
                item.dep_id = "";
                item.com_id = "";
            }
            listdataNS.push(item);
        }
        const countNL = await AdminHR.countDocuments();
        return functions.success(res, "Danh sách admin nhân sự", {
            data: listdataNS,
            count: countNL
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}

//Khóa tài khoản NS
exports.lockAccountNS = async(req, res) => {
    try {
        const emp_id = Number(req.body.emp_id);
        if (emp_id) {
            const admin = await AdminHR.findOne({
                emp_id: emp_id,
            }).select('emp_id active').lean();

            if (admin) {
                const adm_ntd = Math.abs(admin.active - 1);
                await AdminHR.updateOne({ emp_id }, { active });
                return functions.success(res, 'thành công');
            }
            return functions.setError(res, 'Không tìm thấy tài khoản');
        }
        return functions.setError(res, 'Chưa truyền emp_id');
    } catch (error) {
        return functions.setError(res, error.message)
    }

}
exports.addHR = async(req, res) => {
    try {
        let { id_emp, emp_active, time_created_emp } = req.body;
        if (id_emp) {
            let data = await new AdminHR({
                emp_id: id_emp,
                active: emp_active,
                time_created: time_created_emp,
            }).save()
            return functions.success(res, "Thêm thành công", { data })
        }
        return functions.setError(res, "Thiếu dữ liệu truyền lên");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}

exports.deleteHR = async(req, res) => {
    try {
        let { id_emp } = req.body;
        if (id_emp) {
            let data = await AdminHR.findOne({ emp_id: id_emp })
            if (data) {
                await AdminHR.deleteOne({ emp_id: id_emp })
                return functions.success(res, "Xóa nhân sự thành công")
            }
            return functions.setError(res, "Không tìm thấy nhân sự");
        }
        return functions.setError(res, "Thiếu dữ liệu truyền lên");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}