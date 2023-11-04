const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
    cat_id: {
        type: Number,
        required: true,
    },
    cat_name: {
        // tên ngành nghề
        type: String,
        required: true
    },
    cat_title: {
        // tiêu đề
        type: String,
        default: null
    },
    cat_tags: {
        // name tag
        type: String,
        default: null
    },
    cat_description: {
        // chi tiết 
        type: String,
        default: null
    },
    cat_keyword: {
        // từ khóa
        type: String,
        default: null
    },
    cat_mota: {
        // từ khóa
        type: String,
        default: null
    },
    cat_parent_id: {
        // id cha
        type: Number,
        default: 0
    },
    cat_lq: {
        // chi tiết 
        type: String,
        default: null
    },
    cat_count: {
        // tổng ứng viên của ngành nghề
        type: Number,
        default: 0
    },
    cat_count_vl: {
        // tổng việc làm của ngành nghề
        type: Number,
        default: 0
    },
    cat_order: {
        // ưu tiên
        type: Number,
        default: 0
    },
    cat_active: {
        // kích hoạt
        type: Number,
        default: 0
    },
    cat_hot: {
        // 
        type: Number,
        default: 0
    },
    cat_ut: {
        // 
        type: String,
        default: null
    },
    cat_only: {
        // 
        type: Number,
        default: 0
    },
    cat_except: {
        // 
        type: String,
        default: null
    },
    cat_tlq: {
        // 
        type: String,
        default: null
    },
    cat_tlq_uv: {
        // 
        type: String,
        default: null
    },
    cat_name_new: {
        // 
        type: String,
        default: null
    },
    cat_order_show: {
        // 
        type: Number,
        default: null
    },
}, {
    collection: 'CategoryJob',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("CategoryJob", jobSchema);