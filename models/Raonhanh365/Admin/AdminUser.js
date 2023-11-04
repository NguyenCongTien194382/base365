const mongoose = require('mongoose');
const Schema = mongoose.Schema
const AdminUserSchema = new mongoose.Schema({
    _id: {
        //id admin
        type: Number,
        require: true
    },
    loginName: {
        //tên đăng nhập của admin
        type: String,
        require: true
    },
    password: {
        //mật khẩu của admin,
        type: String,
        require: true
    },
    name: {
        //tên admin
        type: String,
        default: null
    },
    email: {
        //tên email
        type: String,
        default: null
    },
    address: {
        //địa chỉ
        type: String,
        default: null
    },
    phone: {
        //số điện thoại
        type: String,
        default: null
    },
    mobile: {
        //só điện thoại
        type: String,
        default: null
    },
    accessModule: {
        //mô-đun truy cập
        type: String,
        default: null
    },
    accessCategory: {
        //danh mục truy cập
        type: String,
        default: null
    },
    date: {
        //ngày truy cập
        type: Date,
        default: new Date()
    },
    isAdmin: {
        //có phải là admin hay không
        type: Number,
        default: 0
    },
    active: {
        //admin này có hoạt động ko
        type: Number,
        default: 0
    },
    langId: {
        //id ngôn ngữ
        type: Number,
        default: 0
    },
    delete: {
        type: Number,
        default: 0
    },
    allCategory: {
        type: Number,
        default: 0
    },
    editAll: {
        type: Number,
        default: 0
    },
    adminId: {
        type: Number,
        default: 0
    },
    department: {
        //admin thuộc bộ phận nào
        type: Number,
        default: 0
    },
    empId: {
        //id nhân viên
        type: Number,
        default: 0
    },
    employer: {
        //nhà tuyển dụng ?
        type: Number,
        default: 0
    }
}, {
    collection: 'RN365_AdminUser',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_AdminUser", AdminUserSchema);