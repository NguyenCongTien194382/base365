const functions = require("../../services/functions");
const CompanyCoordinate = require('../../models/qlc/CompanyCoordinate');

exports.add = async(req, res) => {
    try {

    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.list = async(req, res) => {
    try {
        const user = req.user.data;
        if (user.type == 1) {
            const com_id = user.com_id;
            const list_child = await CompanyCoordinate.find({ com_id: com_id, status: 1 });
            const total = await CompanyCoordinate.countDocuments({ com_id: com_id, status: 1 });
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

exports.delete = async(req, res) => {
    try {
        const user = req.user.data;
        if (user.type == 1) {
            const com_id = user.com_id;
            const cor_id = req.body.cor_id;
            if (cor_id) {
                const coordinate = await CompanyCoordinate.findOne({ cor_id, status: 1 });
                if (coordinate) {
                    await CompanyCoordinate.updateOne({ cor_id }, {
                        $set: { status: 0 }
                    });
                    return functions.success(res, 'Cập nhật thành công');
                }
                return functions.setError(res, "Tọa độ chấm công không tồn tại");
            }
            return functions.setError(res, "Chưa truyền tham số cor_id");
        }
        return functions.setError(res, "Tài khoản không phải công ty");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.set_coordinate_default = async(req, res) => {
    try {
        const user = req.user.data;
        if (user.type == 1) {
            const cor_id = req.body.cor_id;
            if (cor_id) {
                const coordinate = await CompanyCoordinate.findOne({ cor_id, is_default: 1 });
                if (!coordinate) {

                    // Cập nhật toàn bộ tọa độ về trạng thái bình thường
                    await CompanyCoordinate.updateMany({ com_id: user.com_id }, {
                        $set: { is_default: 0 }
                    });
                    // Cập nhật tọa độ được chọn làm trạng thái mặc định
                    await CompanyCoordinate.updateOne({ cor_id }, {
                        $set: { is_default: 1 }
                    });
                    return functions.success(res, 'Cập nhật thành công');
                }
                return functions.setError(res, "Tọa độ công ty đã là mặc định");
            }
            return functions.setError(res, "Chưa truyền tham số cor_id");
        }
        return functions.setError(res, "Tài khoản không phải công ty");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}