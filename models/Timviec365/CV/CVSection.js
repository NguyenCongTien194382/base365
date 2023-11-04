// chuyên mục các bài viết về cv
const mongoose = require("mongoose");
const CVSectionSchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    name: {
        //tên chuyên mục
        type: String,
    },
    alias: {
        //tên chuyên mục không tiếng việt
        type: String
    },
    content: {
        //nôi dung chuyên mục trong thẻ <p>
        type: String
    },
    image: {
        //tên ảnh chuyên mục
        type: String
    },
    parent: {
        type: Number
    },
    menu: {
        type: Number
    },
    sort: {
        //sắp xếp danh mục
        type: Number
    },
    metaTitle: {
        //tiêu đề chuyên mục
        type: String
    },
    metaKey: {
        //từ khóa tìm kiếm chuyên mục
        type: String
    },
    metaDes: {
        //chú thích chuyên mục
        type: String
    },

}, {
    collection: 'CVSection',
    versionKey: false
});

module.exports = mongoose.model("CVSection", CVSectionSchema)