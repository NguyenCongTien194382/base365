const mongoose = require('mongoose');
const Schema = mongoose.Schema
const BlogSchema = new mongoose.Schema({
    _id: {
        //id blog
        type: Number,
        require: true
    },
    adminId: {
        //id của admin
        type: Number,
        default: 0
    },
    langId: {
        //id ngôn ngữ
        type: Number,
        default: 0
    },
    title: {
        //tiêu đề blog
        type: String,
        default: null
    },
    url: {
        //đường dẫn blog
        type: String,
        default: null
    },
    titleRewrite: {
        //tiêu đề blog được viết lại
        type: String,
        default: null
    },
    image: {
        //ảnh trong bài viết
        type: String,
        default: null
    },
    imageWeb: {
        //ảnh trên web
        type: String,
        default: null
    },
    teaser: {
        //giới thiệu
        type: String,
        default: null
    },
    keyword: {
        //từ khóa
        type: String,
        default: null
    },
    sapo: {
        //tom tắt
        type: String,
        default: null
    },
    des: {
        //mô tả bài viết
        type: String,
        default: null
    },
    detailDes: {
        //mo ta chi tiet
        type: String,
        default: null
    },
    sameId: {
        type: String,
        default: null
    },
    search: {
        type: String,
        default: null
    },
    source: {
        type: String,
        default: null
    },
    cache: {
        type: String,
        default: null
    },
    link: {
        // link blog
        type: String,
        default: null
    },
    linkMd5: {
        type: String,
        default: null
    },
    categoryId: {
        //id danh mục
        type: Number,
        default: 0
    },
    vgId: {
        type: Number,
        default: 0
    },
    status: {
        //trạng thái blog
        type: Number,
        default: 0
    },
    date: {
        //ngày đăng bài
        type: Date,
        default: new Date()
    },
    adminEdit: {
        //admin có edit hay ko
        type: Number,
        default: 0
    },
    dateLastEdit: {
        //thời gian cập nhật cuối cùng
        type: Date,
    },
    order: {
        type: Number,
        default: 0
    },
    totalVoteYes: {
        //tổng số vote yes
        type: Number,
        default: 0
    },
    totalVoteNo: {
        //tổng số vote No
        type: Number,
        default: 0
    },
    hit: {
        //tin tức này có hit ko
        type: Number,
        default: 0
    },
    active: {
        //có cho hiển thị ra ngoài tin tức ko: 1 có
        type: Number,
        default: 0
    },
    hot: {
        //tin tức này có hot hay ko
        type: Number,
        default: 0
    },
    new: {
        //tin tức này có mới hay không
        type: Number,
        default: 0
    },
    toc: {
        type: Number,
        default: 1
    },
    auto: {
        type: Number,
        default: 0
    },
    titleRelate: {
        //tiêu đề liên quan
        type: String,
        default: null
    },
    contentRelate: {
        type: String,
        default: null
    }

}, {
    collection: 'RN365_Blog',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_Blog", BlogSchema);