const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProcessTrainingSchema = new Schema({
    // id tiến trình training
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // tên tiến trình
    name: {
        type: String,
        default: null
    },
    // mô tả
    description: {
        type: String,
        default: null
    },
    // id công ty
    comId: {
        type: Number,
        require: true,
    },
    // trạng thái xoá
    isDelete: {
        type: Number,
        default: 0
    },
    // thời gian tạo
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // thời gian update
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    // thời gian xoá
    deletedAt: {
        type: Date,
        require: Date.now()
    }
},{
    collection: 'HR_ProcessTraining',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_ProcessTraining",ProcessTrainingSchema);
