const priceList = require("../../models/Timviec365/PriceList/PriceList");
const functions = require("../../services/functions");

// danh mục bảng giá
exports.getPriceList = async(req, res, next) => {
    try {
        const data = await priceList.find().lean();
        let count = await priceList.countDocuments(data);

        if (data.length > 0)
            return await functions.success(res, "Thành công", { data, count });

        return await functions.setError(res, "Không có dữ liệu", 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// chi tiết gói dich vụ
exports.viewDetail = async(req, res, next) => {
    try {
        const type = req.body.type;
        const data = await priceList.find({ bg_type: type }).lean();

        if (data) return await functions.success(res, "Thành công", { data });

        return await functions.setError(res, "Không có dữ liệu", 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// thêm bảng giá

exports.addPrice = async(req, res) => {
    try {
        const {
            bg_type,
            bg_tuan,
            bg_time,
            bg_hoso,
            bg_gift_hoso,
            bg_time_gift_hoso,
            bg_gia,
            bg_chiet_khau,
            bg_thanh_tien,
            bg_handung,
            bg_the,
            bg_vat,
            bg_quyenloi,
            bg_uudai1,
            bg_uudai2,
            bg_uudai3,
            bg_cm1,
            bg_cm2,
            bg_cm3,
            bg_cm_logo,
            bg_show,
            bg_tk,
            bg_do,
            bg_hp,
            bg_ql_hd,
            bg_ud_hd,
            api_crm,
        } = req.body;
        let bg_id = 0;
        let PriceMax = await priceList.findOne({}).sort({ bg_id: -1 }).lean();
        if (PriceMax) {
            bg_id = Number(PriceMax.bg_id) + 1;
        }
        if (!bg_tuan) {
            return functions.setError(res, "Bạn chưa nhập số tuần", 400);
        }
        if (!bg_handung) {
            return functions.setError(res, "Bạn chưa nhập số tuần hạn dùng", 400);
        }
        if (!bg_gia) {
            return functions.setError(res, "Bạn chưa nhập giá dịch vụ", 400);
        }
        if (!bg_chiet_khau) {
            return functions.setError(res, "Bạn chưa nhập chiết khấu", 400);
        }
        if (!bg_handung) {
            return functions.setError(res, "Bạn chưa nhập số tuần hạn dùng", 400);
        }
        if (!bg_vat) {
            return functions.setError(res, "Bạn chưa nhập giá có VAT", 400);
        }
        if (!bg_the) {
            return functions.setError(res, "Bạn chưa nhập thẻ tặng", 400);
        }
        if (!bg_tk) {
            return functions.setError(res, "Bạn chưa nhập số tiết kiệm", 400);
        }

        const Price = new priceList({
            bg_id: bg_id,
            bg_type: bg_type,
            bg_tuan: bg_tuan,
            bg_time: bg_time,
            bg_hoso: bg_hoso,
            bg_gift_hoso: bg_gift_hoso,
            bg_time_gift_hoso: bg_time_gift_hoso,
            bg_gia: bg_gia,
            bg_chiet_khau: bg_chiet_khau,
            bg_thanh_tien: bg_thanh_tien,
            bg_handung: bg_handung,
            bg_the: bg_the,
            bg_vat: bg_vat,
            bg_quyenloi: bg_quyenloi,
            bg_uudai1: bg_uudai1,
            bg_uudai2: bg_uudai2,
            bg_uudai3: bg_uudai3,
            bg_cm1: bg_cm1,
            bg_cm2: bg_cm2,
            bg_cm3: bg_cm3,
            bg_cm_logo: bg_cm_logo,
            bg_show: bg_show,
            bg_tk: bg_tk,
            bg_do: bg_do,
            bg_hp: bg_hp,
            bg_ql_hd: bg_ql_hd,
            bg_ud_hd: bg_ud_hd,
            api_crm: api_crm,
        });
        await Price.save(); // chạy đồng bộ
        return functions.success(res, "Thành công");
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// chỉnh sửa bảng giá

exports.editPrice = async(req, res) => {
    try {
        let {
            bg_type,
            bg_tuan,
            bg_time,
            bg_hoso,
            bg_gift_hoso,
            bg_time_gift_hoso,
            bg_gia,
            bg_chiet_khau,
            bg_thanh_tien,
            bg_handung,
            bg_the,
            bg_vat,
            bg_quyenloi,
            bg_uudai1,
            bg_uudai2,
            bg_uudai3,
            bg_cm1,
            bg_cm2,
            bg_cm3,
            bg_cm_logo,
            bg_show,
            bg_tk,
            bg_do,
            bg_hp,
            bg_ql_hd,
            bg_ud_hd,
            api_crm,
            bg_id,
        } = req.body;

        await priceList.findOneAndUpdate({ bg_id: bg_id }, {
            bg_type: bg_type,
            bg_tuan: bg_tuan,
            bg_time: bg_time,
            bg_hoso: bg_hoso,
            bg_gift_hoso: bg_gift_hoso,
            bg_time_gift_hoso: bg_time_gift_hoso,
            bg_gia: bg_gia,
            bg_chiet_khau: bg_chiet_khau,
            bg_thanh_tien: bg_thanh_tien,
            bg_handung: bg_handung,
            bg_the: bg_the,
            bg_vat: bg_vat,
            bg_quyenloi: bg_quyenloi,
            bg_uudai1: bg_uudai1,
            bg_uudai2: bg_uudai2,
            bg_uudai3: bg_uudai3,
            bg_cm1: bg_cm1,
            bg_cm2: bg_cm2,
            bg_cm3: bg_cm3,
            bg_cm_logo: bg_cm_logo,
            bg_show: bg_show,
            bg_tk: bg_tk,
            bg_do: bg_do,
            bg_hp: bg_hp,
            bg_ql_hd: bg_ql_hd,
            bg_ud_hd: bg_ud_hd,
            api_crm: api_crm,
        });
        return functions.success(res, " chỉnh sửa  thành công!");
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// chi tiết bảng giá
exports.detailPrice = async(req, res, next) => {
    try {
        const bg_id = req.body.bg_id;
        const data = await priceList.find({ bg_id: bg_id }).lean();
        if (data) return await functions.success(res, "Thành công", { data });
        return await functions.setError(res, "Không có dữ liệu", 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};