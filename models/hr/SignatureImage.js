const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// chu ky cua nhan vien
const SignatureImageSchema = new Schema({
    // id tu dong tang
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // id nhan vien
    empId: {
        type: Number,
        require: true
    },
    // ten anh
    imgName: {
        type: String,
        default: null 
    },
    // thoi gian tao
    createdAt: {
        type: Date,
        default: Date.now() 
    },
    //bi xoa chua
    isDelete: {
        type: Number,
        default: 0
    },
    //thoi gian xoa
    deletedAt: {
        type: Date,
        default: Date.now() 
    }
},{
    collection: 'HR_SignatureImages',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_SignatureImages",SignatureImageSchema);
