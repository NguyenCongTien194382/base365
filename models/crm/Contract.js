//model này dùng để quản lý các hợp đồng mẫu
const mongoose = require('mongoose')
const { collection } = require('../Users')

const ContractSchema = mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    creator: {
        type: {
            // id người khởi tạo
            createId: {
                type: Number,
                require: true
            },
            createName: {
                type: Number,
                require: true
            },
        },
        require: true
    },
    isDelete: {
        //trạng thái xoá hay chưa 0 là chưa xoá, 1 là đã xoá
        type: Number,
        default: 0
    },
    contractName: {
        type: String,
        default: null
    },
    contractForm: {
        //lưu file doc ... chưa chắc chắn cần cập nhật lại
        data: Buffer,
        contentType: String,
        originalName: String
    },
    editFields: {
        // dánh sách trường ghi chú chỉnh sửa
        type: [{
            keyword: {
                // ký tự tìm kiếm
                type: String,
            },
            index: {
                // vị trí trong dánh sách kết quả tìm kiếm
                type: [Number],
                default: []

            },
            fieldsName: {
                // tên trường ghi chú chỉnh sửa 
                type: String,
            },
            statusFiled: {
                // trạng thái field đã xoá hay chưa 
                type: Boolean,
                default: false
            }
        }]
    }

}, {
    collection: "Contract",
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("Contract", ContractSchema)