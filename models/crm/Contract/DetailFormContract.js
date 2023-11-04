//Model này dùng để 
const mongoose = require('mongoose')


const DetailFormContract = new mongoose.Schema({
    id: {
        //id 
        type: Number,
        required: true
    },
    id_form_contract: {
        // id hợp đồng
        type: Number,
        default: 0
    },
    new_field: {
        // tên trường mặc định hoặc trường chứa chữ cái tìm kiếm
        type: String,
        default: null
    },
    old_field: {
        // trường chữ cái tìm kiếm 
        type: String,
        default: null
    },
    index_field: {
        // thứ tự chữ cái thay đổi 
        type: String,
        default: null
    },
    default_field: {
        //thứ tự trong trường mặc định, nếu tạo trường mới thì index = 0
        type: Number,
        default: 0
    },
}, {
    collection: 'CRM_DetailFormContract',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('CRM_DetailFormContract', DetailFormContract);