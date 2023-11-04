const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RemindSchema = new Schema({
    // id tu dong tang
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // loai
    type: {
        type: Number,
        default: 0 
    },
    // loai nhac nho
    remindType: {
        type: Number,
        default: 0 
    },
    // id ung vien
    canId: {
        type: Number,
        require: true,
    },
    //ho ten cua ung vien
    canName: {
        type: String,
        default: null
    },
    // id cong ty
    comId: {
        type: Number,
        require: true
    },
    // id nguoi dung
    userId: {
        type: Number,
        require: true
    },
    // thời gian nhac nho
    time: {
        type: Date,
        default: Date.now()
    },
    // thoi gian tao
    createdAt: {
        type: Date,
        default: Date.now(),
    },
},{
    collection: 'HR_Reminds',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_Reminds",RemindSchema);
