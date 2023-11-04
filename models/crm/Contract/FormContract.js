const mongoose = require('mongoose')

//hợp đồng
const FormContract = new mongoose.Schema({
    id: {
        //id hợp đồng 
        type: Number,
        required: true
    },
    name: {
        //tên hợp đồng 
        type: String,
        required: true
    },
    path_file: {
        //đường dẫn file
        type: String,
        // required: true
    },
    com_id: {
        //id công ty
        type: Number,
        required: true
    },
    ep_id: {
        //id nhân viên
        type: Number,
        default: 0
    },
    id_file: {
        //id file
        type: String,
        required: true
    },
    is_delete: {
        //xóa hay chưa 
        type: Number,
        default: 0,
    },
    created_at: {
        //thời điểm tạo 
        type: Number,
        default: 0,
    },
    updated_at: {
        //thời điểm cập nhật 
        type: Number,
        default: 0,
    },
}, {
    collection: 'CRM_FormContract',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('CRM_FormContract', FormContract);