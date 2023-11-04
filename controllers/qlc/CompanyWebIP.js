const functions = require("../../services/functions");
const CompanyWebIP = require('../../models/qlc/CompanyWebIP');

exports.list = async(req, res) => {
    try {
        const user = req.user.data;
        if (user.type == 1) {
            const com_id = user.com_id;
            const list_child = await CompanyWebIP.find({ com_id: com_id, status: 1 });
            const total = await CompanyWebIP.countDocuments({ com_id: com_id, status: 1 });
            return functions.success(res, '', {
                items: list_child,
                totalItems: total
            });
        }
        return functions.setError(res, "Tài khoản không phải công ty");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}