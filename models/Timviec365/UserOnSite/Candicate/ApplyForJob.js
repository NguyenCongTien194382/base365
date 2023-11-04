const mongoose = require('mongoose');
const applyForJobSchema = new mongoose.Schema({
    nhs_id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    nhs_use_id: {
        type: Number,
        default: 0,
    },
    nhs_new_id: {
        type: Number,
        default: 0,
    },
    nhs_com_id: {
        //id công ty
        type: Number,
        default: 0,
    },
    nhs_time: {
        //thời gian ứng tuyển
        type: Number,
        default: 0,
    },
    nhs_active: {
        // xác nhận ứng tuyển 
        type: Number,
        default: 1
    },
    nhs_kq: {
        // kết quả ứng tuyển
        type: Number,
        default: 0
    },
    nhs_time_pv: {
        // thời gian phỏng vấn
        type: Number,
        default: 0
    },
    nhs_time_tvs: {
        type: Number,
        default: 0
    },
    nhs_time_tve: {
        type: Number,
        default: 0
    },
    nhs_text: {
        // Ghi chú 
        type: String,
        default: null
    },
    nhs_cv: {
        // file cv
        type: String,
        default: null
    },
    check_ut: {
        // 1: tự ứng tuyển | 2: chuyên viên gửi ứng viên | 3: chuyên viên gửi UV trong nop_ho_so_nvt | 4: chuyên viên gửi trong admin | 5: tự ứng tuyển trong admin | 6: API app | 7: chuyên viên gửi UV trong api app | 8: api UT QR | 9: chuyên viên gửi UV trong api Qr | 10: trong admin/ungvien/add_crm | 11: trong admin/ungvien/add | 12:  trong admin/ungvien/ajax_cvuv | 13: admin/ungvien/edit_unset_crm | 14: api_winform/nop_ho_so | 15: chuyên viên gửi UV trong api_winform/nop_ho_so | 16: codelogin/register_cv2 | 17: codelogin/register_cv2_new | 18: service/nop_ho_so | 19: chuyên viên gửi trong service/nop_ho_so | 20: service/nop_ho_so_new | 21: chuyên viên gửi trong service/nop_ho_so_new
        type: Number,
        default: 0
    },
    nhs_thuungtuyen: {
        type: String,
        default: null
    },
    // Xác nhận ứng tuyển sai
    nhs_xn_uts: {
        type: Number,
        default: 0
    },
    new_seen: {
        type: Number,
        default: 0
    }
}, {
    collection: 'ApplyForJob',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("ApplyForJob", applyForJobSchema);