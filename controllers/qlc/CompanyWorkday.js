const functions = require("../../services/functions")
const WorkDay = require("../../models/qlc/CC365_CompanyWorkday")

exports.create = async(req, res) => {
    try {
        let com_id = req.user.data.com_id;
        let num_days = req.body.num_days;
        let month = req.body.month;
        let year = req.body.year;
        if (num_days) {
            const apply_month = year + "-" + month
            const fullMonth = apply_month + "-" + "01"
            let data = await WorkDay.findOne({ com_id: com_id, apply_month: fullMonth })
            if (!data) {
                const max = await WorkDay.findOne({}, { cw_id: 1 }).sort({ cw_id: -1 }).limit(1).lean() || 0
                const com = new WorkDay({
                    cw_id: Number(max.cw_id) + 1 || 1,
                    num_days: num_days,
                    apply_month: fullMonth,
                    com_id: com_id,
                })
                await com.save()
                return functions.success(res, "Tạo thành công", { data });
            } else {
                //nếu tìm thấy thì cập nhật 
                await WorkDay.updateOne({ com_id: com_id, apply_month: fullMonth }, {
                    $set: {
                        num_days: num_days,
                        apply_month: fullMonth,
                        com_id: com_id,
                    }
                })
                return functions.success(res, "cập nhật thành công");
            }
        }
        return functions.setError(res, "nhập thiếu trường")
    } catch (e) {
        return functions.setError(res, e.message)
    }
}

exports.detail = async(req, res) => {
    try {
        const com_id = req.user.data.com_id,
            dates = new Date(),
            months = req.body.month || ("0" + (dates.getMonth() + 1)).slice(-2),
            years = req.body.year || dates.getFullYear();
        let condition = {
            com_id: com_id,
            apply_month: `${years}-${months}-01`
        };
        let data = await WorkDay.findOne(condition).lean()
        if (data) {
            return functions.success(res, "lấy thành công", { data });
        }
        return functions.setError(res, "Bạn chưa cài đặt số ngày công tiêu chuẩn trong tháng " + months)

    } catch (e) {
        return functions.setError(res, e.message)
    }
}