const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const InviteInterviewSchema = new Schema({
    // id
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
     //vi tri ung tuyen
    posApply: {
        type: String,
        default: null,
    },
    // id ung vien
    canId: {
        type: Number,
        require: true
    },
    // email cua ung vien
    canEmail: {
        type: String,
        default: null
    },
    //ten ung vien
    canName: {
        type: String,
        default: null,
    },
    //ten cua hr
    hrName: {
        type: String,
        default: null,
    }, 
     // noi dung 
    content: {
        type: String,
        default: null,
    },
    // ghi chu
    note: {
        type: String,
        default: null,
    },
    //ghi chu test
    noteTest: {
        type: String,
        default: null,
    },
},{
    collection: 'HR_InviteInterviews',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_InviteInterviews",InviteInterviewSchema);
