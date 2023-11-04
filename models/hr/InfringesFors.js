const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InfringesForSchema = new Schema({
    //Id vi phạm
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // Tên vi phạm
    infringeName: {
        type: String,
        require: true,
        default:null
    },
    //  Căn cứ quy định 
    regulatoryBasis: {
        type: String,
        require: true

    },
    // Số quy định xử lý vi phạm
    numberViolation: {
        type: String,
        require: true

    },
    // Danh sách nhân viên
    listUser: [{
            // Id nhân viên
            userId: {
                type: Number
            },
            // Tên nhân viên
            name: {
                type: String
            },
    }],
    // Người tạo khen thưởng
    createdBy: {
        type: String,
        default:null
        
    },
    // Ngày tạo vi phạm
    infringeAt: {
        type: Date,
        default:null
    },
    // Loại phạt vi phạm
    infringeType: {
        type: String,
        default: null
    },
    // 
    type: {
        type: Number,
        default: null

    },
    // Id công ty có quyết định xử lý vi phạm
    comId: {
        type: Number,
        require: true

    },
    // Id phòng của nhân viên vi phạm
    depId: {
        type: Number,
        require: true

    },
    // Tên phòng của nhân viên vi phạm
    depName: {
        type: String,
        require: true

    },
    // Ngày tạo quyết định
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // Ngày xoá quyết định
    deleteAt: {
        type: Date,
        default: null
    }
}, {
    collection: 'HR_InfringesFors',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_InfringesFors", InfringesForSchema);