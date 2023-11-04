//chiến dịch
const mongoose = require("mongoose");
const CampainListSchema = new mongoose.Schema({
    // id chiến dịch
    cd_id: {
        type: Number,
        unique: true,
        autoIncrement: true,
    },
    // id user
    user_id: {
        type: Number,
        required: true,
        default: 0
    },
    // 0: UV, 1:NTD
    user_type: {
        type: Number,
        default: 0
    },
    // id tin tuyển dụng
    cd_new_id: {
        type: Number,
        default: 0
    },
    // tiêu đề tin tuyển dụng
    cd_tin: {
        type: String,
        default: null
    },
    // Ngày bắt đầu chiến dịch
    cd_timestart: {
        type: Number,
        default: 0
    },
    // Ngày kết thúc chiến dịch
    cd_timeend: {
        type: Number,
        default: 0
    },
    // trạng thái chiến dịch (1: bật, 2: tạm dừng, 3: xóa)
    cd_trangthai: {
        type: Number,
        default: 1,
    },
    // chọn đặt giá mỗi hành động mục tiêu
    cd_checkbox: {
        type: Boolean,
        default: false
    },
    // GPA mục tiêu(giá thầu)
    cd_gpa: {
        type: Number,
        default: 0
    },
    // các gợi ý từ khóa
    cd_goiy: {
        type: String,
        default: null
    },
    // từ khóa
    cd_tukhoa: {
        type: String,
        default: null
    },
    // Ngân sách
    cd_ngansach: {
        type: Number,
        default: 0,
    },
    // lượt tương tác(lượt xem + lượt ứng tuyển + lượt nhấp)
    cd_tuongtac: {
        type: Number,
        default: 0,
    },
    // tỷ lệ tương tác
    cd_tile: {
        type: Number,
        default: 0,
    },
    // chi phí/1 lượt hiển thị
    cd_cpm: {
        type: Number,
        default: 0,
    },
    // chi phí/1 lượt ứng tuyển = chi phí chuyển đổi
    cd_chuyendoi: {
        type: Number,
        default: 0,
    },
    // lượt nhấp
    cd_luotnhap: {
        type: Number,
        default: 0,
    },
    // lượt chuyển đổi = lượt ứng tuyển
    cd_luotungtuyen: {
        type: Number,
        default: 0,
    },
    // chi phí/1 lượt nhấp chuột
    cd_cpc: {
        type: Number,
        default: 0,
    },
    // Chi phí = số tiền của lượt nhấp + lượt xem + lượt Ứng tuyển
    cd_chiphi: {
        type: Number,
        default: 0,
    },
    cd_diemtoiuu: {
        type: String,
        default: null,
    },
    // bước hoàn thành chiến dịch(>= 4: chiến dịch đủ điều kiện)
    cd_step: {
        type: Number,
        default: 0,
    },
    // loại chiến dịch(mặc định là tìm kiếm)
    cd_type: {
        type: Number,
        default: 0,
    },
    // thời gian tạo chiến dịch
    cd_create_time: {
        type: Number,
        default: 0
    },
}, {
    collection: "CampainList",
    versionKey: false,
    timestamp: true,
});

module.exports = mongoose.model("CampainList", CampainListSchema);