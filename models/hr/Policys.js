const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelNameSchema = new Schema({
    // Id của chính sách
    id: {
        type: Number,
        required: true,
    },
    provisionId:{
        type: Number,
    },
    // ngày bắt đầu
    timeStart: { 
        type: Date
    },
    // người giám sát
    supervisorName: { 
        type: String 
    },
    // áp dng cho đối tượng nào
    applyFor: { 
        type: String
    },
    // nội dung
    content: {
         type: String
        },
    // Tạo bởi ai
    createdBy: {
         type: String 
        },
    //  xóa hay chưa
    isDelete: { 
        type: Number,
        
        default: 0
    },
    // tạo ngày nào
    createdAt: { 
        type: Date, default: Date.now() },
    //  tên quy định
    name: { 
        type: String
    },
    // tên file
    file: { 
        type: String, required: false
     },
    // xóa ngày nào
    deletedAt: { 
        type: Date,
        required: false 
    }
}, {
    collection: 'HR_Policys',
    versionKey: false,
    timestamp: true
});

const ModelName = mongoose.model('HR_Policys', ModelNameSchema);

module.exports = ModelName;