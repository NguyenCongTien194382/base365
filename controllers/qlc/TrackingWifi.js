const functions = require("../../services/functions");
// const users = require("../../models/Users")
// const calEmp = require("../../models/qlc/CalendarWorkEmployee")
const CompanyWifi = require("../../models/qlc/TrackingWifi")
    // đổ danh sách wifi chấm công 
exports.getlist = async(req, res) => {
    try {
        const com_id = req.user.data.com_id;
        const type = req.user.data.type;
        let wifi_id = req.body.wifi_id;

        if (type == 1) {
            let condition = { com_id: com_id };
            if (wifi_id) condition.wifi_id = wifi_id

            const data = await CompanyWifi.find(condition).lean();
            const count = await CompanyWifi.countDocuments(condition);
            return functions.success(res, 'Lấy thành công', { totalItems: count, items: data });
        }
        return functions.setError(res, "Tài khoản không phải Công ty");

    } catch (err) {
        return functions.setError(res, err.message)
    }


}

//tạo để test
exports.Create = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        const { name_wifi, mac_address } = req.body;


        if (com_id && name_wifi) {

            let maxId = await CompanyWifi.findOne({}, { wifi_id: 1 }, { sort: { wifi_id: -1 } }).lean() || 0
            const wifi_id = Number(maxId.wifi_id) + 1 || 1;

            const tracking = new CompanyWifi({
                wifi_id: wifi_id,
                com_id: com_id,
                name_wifi: name_wifi,
                create_time: functions.getTimeNow(),
                ip_address: functions.get_client_ip(req),
                mac_address: mac_address,
            });
            await tracking.save()
            return functions.success(res, "tạo thành công");
        }
        return functions.setError(res, "thiếu trường tên wifi và địa chỉ IP");
    } catch (e) {
        return functions.setError(res, e.message);

    }
};

exports.edit = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        const wifi_id = req.body.wifi_id

        const { name_wifi, ip_address, mac_address, is_default, status } = req.body;
        const data = await functions.getDatafindOne(CompanyWifi, { wifi_id: wifi_id });
        if (data) {
            await functions.getDatafindOneAndUpdate(CompanyWifi, { com_id: com_id, wifi_id: wifi_id }, {
                com_id: com_id,
                status: status,
                name_wifi: name_wifi,
                is_default: is_default,
                ip_address: ip_address,
                mac_address: mac_address,
            })
            return functions.success(res, "Sửa thành công", { data })
        }
        return functions.setError(res, "wifi không tồn tại");
    } catch (e) {
        return functions.setError(res, e.message);

    }
};
exports.delete = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
            // const com_id = req.body.com_id
        const wifi_id = req.body.wifi_id
        if (com_id && wifi_id) {
            const data = await functions.getDatafindOne(CompanyWifi, { wifi_id: wifi_id });
            if (data) {
                functions.getDataDeleteOne(CompanyWifi, { com_id: com_id, wifi_id: wifi_id })
                return functions.success(res, "xóa thành công !", { data })
            }
            return functions.setError(res, "không tồn tại!", 510);
        }
        return functions.setError(res, "Thiếu trường Wifi_id ");
    } catch (error) {
        return functions.setError(res, error.message)
    }
};

exports.set_company_wifi_default = async(req, res) => {
    try {
        const user = req.user.data;
        if (user.type == 1) {
            const { wifi_id } = req.body;
            if (wifi_id) {
                const com_id = user.com_id;
                const company_wifi = await CompanyWifi.findOne({ wifi_id, is_default: 1 });
                if (!company_wifi) {
                    await CompanyWifi.updateMany({ com_id }, { $set: { is_default: 0 } });
                    await CompanyWifi.updateOne({ wifi_id }, { $set: { is_default: 1 } });
                    return functions.success(res, "Cập nhật thành công");
                }
                return functions.setError(res, "Wifi ko tồn tại hoặc đã được cài đặt mặc định");
            }
            return functions.setError(res, "Thiếu trường wifi_id ");
        }
        return functions.setError(res, "Không phải tài khoản công ty", );
    } catch (error) {
        return functions.setError(res, error.message)
    }
}