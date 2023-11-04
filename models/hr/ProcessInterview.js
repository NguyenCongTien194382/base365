const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProcessInterviewSchema = new Schema({
    // id
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // ten giai doan phong van
    name: {
        type: String,
        require: true
    },
    //id cua giai doan truoc
    processBefore: {
        type: Number,
        default: 0
    },
    //giai doan phia truoc 1: Nhận việc, 2: Trượt, 3: Hủy, 4: Ký hợp đồng
    beforeProcess: {
        type: Number,
        default: 0
    },
    // id cong ty
    comId: {
        type: Number,
        require: true,
    },
    // thoi gian tao
    createdAt: {
        type: Date,
        default: Date.now(),
    },
},{
    collection: 'HR_ProcessInterviews',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_ProcessInterviews",ProcessInterviewSchema);
