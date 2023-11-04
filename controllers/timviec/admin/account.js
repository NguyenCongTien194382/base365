const AdminUser = require('../../../models/Timviec365/Admin/AdminUser');
const AdminUserRight = require('../../../models/Timviec365/Admin/AdminUserRight');
const functions = require('../../../services/functions');
const ModulesParent = require("../../../models/Timviec365/Admin/ModulesParent");
const Modules = require("../../../models/Timviec365/Admin/Modules");
exports.list = async(req, res) => {
    try {
        const list = await AdminUser.find({
                adm_loginname: { $ne: 'admin' }
            })
            .sort({ adm_loginname: 1, adm_active: -1 })
            .lean();
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            const listName = await AdminUserRight.aggregate([
                { $match: { adu_admin_id: element.adm_id } },
                {
                    $lookup: {
                        from: "Tv365Modules",
                        localField: "adu_admin_module_id",
                        foreignField: "mod_id",
                        as: "module"
                    }
                },
                { $unwind: "$module" },
                {
                    $project: {
                        _id: 0,
                        mod_name: "$module.mod_name"
                    }
                }
            ]);
            element.listName = listName;
        }
        return functions.success(res, "Danh sách tài khoản admin", { list });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}

exports.active = async(req, res) => {
    try {
        const { adm_id, adm_active } = req.body;
        await AdminUser.updateOne({ adm_id }, {
            $set: { adm_active: adm_active }
        });
        return functions.success(res, "Cập nhật thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// hàm đăng ký 
exports.add = async(req, res) => {
    try {
        let request = req.body,
            adm_loginname = request.adm_loginname,
            adm_password = request.adm_password,
            adm_email = request.adm_email,
            adm_name = request.adm_name,
            adm_phone = request.adm_phone,
            module_list = request.module_list,
            adm_all_category = request.adm_all_category,
            adm_access_category = request.adm_access_category,
            user_lang_id = request.user_lang_id;
        if (adm_loginname && adm_name && adm_phone && adm_password && adm_email) {
            let checkEmail = await functions.checkEmail(email);
            let checkPhone = await functions.checkPhoneNumber(phone);
            if (checkEmail && checkPhone) {
                let admin = await functions.getDatafindOne(AdminUser, { adm_loginname });
                if (admin == null) {
                    let maxID = await AdminUser.findOne({}, { adm_id: 1 }).sort({ adm_id: -1 }).lean();
                    const adm_id = Number(maxIDModules.adm_id) + 1;
                    if (module_list && module_list.length > 0) {
                        for (let i = 0; i < module_list.length; i++) {
                            let maxIDModules = await AdminUserRight.findOne({}, { adu_admin_id: 1 }).sort({ adu_admin_id: -1 }).lean();
                            let adminRight = new AdminUserRight({
                                adu_admin_id: adm_id,
                                adu_admin_module_id: Number(maxID.adm_id) + 1,
                                adu_admin_module_id: modules[i].adu_admin_module_id,
                                adu_add: modules[i].adu_add,
                                adu_edit: modules[i].adu_edit,
                                adu_delete: modules[i].adu_delete,
                            })
                            await adminRight.save();
                        }
                    }
                    let adminUser = new AdminUser({
                        adm_id: adm_id,
                        adm_loginname: adm_loginname,
                        adm_password: md5(adm_password),
                        adm_name: adm_name,
                        adm_email: adm_email,
                        adm_all_category: adm_all_category,
                        adm_access_category: adm_access_category,
                        lang_id: lang_id,
                    })
                    console.log(adminUser);
                    await adminUser.save();
                    return functions.success(res, 'thêm mới thành công');
                }
                return functions.setError(res, 'tên đăng nhập đã tồn tại');
            }
            return functions.setError(res, 'email hoặc sô điện thoại không đúng định dạng');
        }
        return functions.setError(res, 'không đủ dữ liệu');
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy thông tin chi tiết admin
exports.detail = async(req, res) => {
    try {
        let adm_id = req.body.adm_id;
        if (adm_id) {
            let admin = await functions.getDatafindOne(AdminUser, { adm_id });
            if (admin) {
                const listMod = await AdminUserRight.aggregate([
                    { $match: { adu_admin_id: Number(adm_id) } },
                    {
                        $lookup: {
                            from: "Tv365Modules",
                            localField: "adu_admin_module_id",
                            foreignField: "mod_id",
                            as: "module"
                        }
                    },
                    { $unwind: "$module" },
                    {
                        $project: {
                            _id: 0,
                            mod_id: "$module.mod_id",
                            mod_name: "$module.mod_name"
                        }
                    }
                ]);
                admin.list_module = listMod;
                return functions.success(res, 'lấy dữ liệu thành công', admin)
            }
            return functions.setError(res, 'admin không tồn tại', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)
    } catch (error) {
        return functions.setError(res, error)
    }
};

// hàm cập nhập admin 
exports.edit = async(req, res) => {
    try {
        let request = req.body,
            adm_id = request.adm_id,
            adm_loginname = request.adm_loginname,
            adm_password = request.adm_password,
            adm_email = request.adm_email,
            adm_name = request.adm_name,
            adm_phone = request.adm_phone,
            module_list = request.module_list,
            adm_all_category = request.adm_all_category,
            adm_access_category = request.adm_access_category,
            user_lang_id = request.user_lang_id;
        let checkAdmin = await functions.getDatafindOne(AdminUser, { adm_id: adm_id });
        if (checkAdmin) {
            if (adm_name && adm_phone && adm_email) {
                let checkEmail = await functions.checkEmail(adm_email);
                let checkPhone = await functions.checkPhoneNumber(adm_phone);
                if (checkEmail && checkPhone) {
                    if (module_list && module_list.length > 0) {
                        await AdminUserRight.deleteMany({ adu_admin_module_id: adm_id });
                        for (let i = 0; i < module_list.length; i++) {
                            let maxIDModules = await AdminUserRight.findOne({}, { adu_admin_id: 1 }).sort({ adu_admin_id: -1 }).lean();
                            let adminRight = new AdminUserRight({
                                adu_admin_id: adm_id,
                                adu_admin_module_id: Number(maxID.adm_id) + 1,
                                adu_admin_module_id: modules[i].adu_admin_module_id,
                                adu_add: modules[i].adu_add,
                                adu_edit: modules[i].adu_edit,
                                adu_delete: modules[i].adu_delete,
                            })
                            await adminRight.save();
                        }
                    }
                    await AdminUser.updateOne({ adm_id: adm_id }, {
                        $set: {
                            adm_name: adm_name,
                            adm_email: adm_email,
                            adm_all_category: adm_all_category,
                            adm_access_category: adm_access_category,
                            lang_id: user_lang_id,
                        }
                    });
                    return functions.success(res, 'cập nhập thành công');
                }
                return functions.setError(res, 'email hoặc sô điện thoại không đúng định dạng');
            }
            return functions.setError(res, 'không đủ dữ liệu');
        }
        return functions.setError(res, 'tài khoản không tồn tại');

    } catch (error) {
        return functions.setError(res, error.message)
    }
}