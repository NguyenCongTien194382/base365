const mongoose = require('mongoose');
const PostsTV365Schema = new mongoose.Schema({
    new_id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    admin_id: {
        // ID của admin đăng bài
        type: Number,
        default: 0
    },
    lang_id: {
        type: Number,
        default: 1
    },
    new_title: {
        // Tiêu đề của bài viết
        type: String,
        default: null
    },
    new_title_rewrite: {
        // Slug của bài viết (sinh ra theo tiêu đề)
        type: String,
        default: null
    },
    new_301: {
        // Link điều hướng 301
        type: String,
        default: null
    },
    new_canonical: {
        // Link canonical tương ứng mà seo muốn đặt
        type: String,
        default: null
    },
    new_mail: {
        type: Number,
        default: 0
    },
    new_picture: {
        // Ảnh đại diện bài viết
        type: String,
        default: null
    },
    new_teaser: {
        type: String,
        default: null
    },
    new_description: {
        // Nội dung bài viết
        type: String,
        default: null
    },
    new_tt: {
        // Nội dung tiêu đề thẻ meta title
        type: String,
        default: null
    },
    new_des: {
        // Nội dung tiêu đề thẻ meta description
        type: String,
        default: null
    },
    new_keyword: {
        // Nội dung tiêu đề thẻ meta keyword
        type: String,
        default: null
    },
    new_video: {
        // Đường dẫn video 
        type: String,
        default: null
    },
    new_category_id: {
        // ID của danh mục blog
        type: Number,
        default: 0
    },
    new_category_cb: {
        // ID của ngành nghề liên quan
        type: Number,
        default: 0
    },
    new_date: {
        // Thời điểm tạo bài viết
        type: Number,
        default: 0
    },
    new_admin_edit: {
        // Thời điểm chỉnh sửa bài viết
        type: Number,
        default: 0
    },
    new_date_last_edit: {
        type: Number,
        default: 0
    },
    new_order: {
        // Mức độ ưu tiên
        type: Number,
        default: 0
    },
    new_hits: {
        // Có phải tin hot hay không
        type: Number,
        default: 0
    },
    new_active: {
        // Tin có được kích hoạt hay không
        type: Number,
        default: 1
    },
    new_cate_url: [{
        // Đường dẫn ngành nghề liên quan
        type: String,
        default: null
    }],
    new_hot: {
        // Có phải tin hot hay không
        type: Number,
        default: 0
    },
    new_new: {
        type: Number,
        default: 0
    },
    new_view: {
        // Lượt xem
        type: Number,
        default: 0
    },
    new_url_lq: {
        // Danh sách ID liên quan (có thể giờ ko dùng nữa)
        type: String,
        default: null
    },
    new_tag_cate: {
        // ID ngành nghề
        type: Number,
        default: 0,
    },
    new_vl: {
        // Từ khóa việc làm
        type: String,
        default: null
    },
    new_tdgy: {
        // Tiêu đề gợi ý
        type: String,
        default: null
    },
    new_ndgy: {
        // Nội dung gợi ý
        type: String,
        default: null
    },
    new_audio: {
        // Đường dẫn audio
        type: String,
        default: ''
    },
    new_trans_audio: {
        // Số lượng audio đã chuyển giọng
        type: Number,
        default: 0
    },
    new_check_grammar: {
        //Check ngữ pháp
        type: Number,
        default: 0,
    },
}, {
    collection: 'PostsTV365',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("PostsTV365", PostsTV365Schema);