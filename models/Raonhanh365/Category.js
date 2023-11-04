const mongoose = require('mongoose');
const Schema = mongoose.Schema
const CategorySchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    adminId: {
        // id admin
        type: Number,
        default: null
    },
    name: {
        //tên danh mục
        type: String,
        default: null
    },
    order: {
        //số thứ tự
        type: Number,
        default: null
    },
    type: {
        // chưa rõ
        type: Number,
        default: 0
    },
    hasChild: {
        // có danh mục con hay không
        type: Number,
        default: 0
    },
    active: {
        // hoạt động: 0||1
        type: Number,
        default: 1
    },
    parentId: {
        // nếu là 0:nó danh mục cha, 1 là danh mục con của 1,...   
        type: Number,
        default: 0,
    },
    show: {
        //chưa rõ
        type: Number,
        default: 1,
    },
    langId: {
        // ngôn ngữ: 1.tiếng Việt
        type: Number,
        default: null,
    },
    description: {
        // mô tả danh mục
        type: String,
        default: null,
    },
    md5: {
        type: String,
        default: null,
    },
    isCheck: {
        // nếu là 1 thì không có trong đăng tin mua
        type: Number,
        default: 0,
    },
}, {
    collection: 'RN365_Category',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('RN365_Category', CategorySchema);