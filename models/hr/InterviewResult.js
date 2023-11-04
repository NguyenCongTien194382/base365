const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ResultInterviewSchema = new Schema({
    // id
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // id ung vien
    canId: {
        type: Number,
        require: true
    },
    // id nhan vien phong van
    empInterview: {
        type: Number,
        require: true
    },
    // id cua quy trinh phong van
    processInterviewId: {
        type: Number,
        require: true,
    },
    // email cua ung vien
    canEmail: {
        type: String,
        default: null
    },
    // luong huu
    resiredSalary: {
        type: Number,
        default: 0
    },
    // luong co ban
    salary: {
        type: Number,
        default: 0
    },
    // thời gian phong van
    interviewTime: {
        type: Date,
        default: Date.now()
    },
    // noi dung 
    contentsend: {
        type: String,
        default: null,
    },
    //chua ro
    isSwitch: {
        type: Number,
        default: 0,
    },
    // ghi chu
    note: {
        type: String,
        default: null,
    },
    // id nhan vien quan ly khach hang
    empCrmId: {
        type: Number,
        default: 0,
    },
    // thoi gian tao
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    // dl them cua bang schedue_interview

    //id tin tuyen dung
    newsId: {
        type: Number,
        require: true,
    },
    //id ket qua
    result: {
        type: Number,
        default: 0,
    },
    //ten cua hr
    hrName: {
        type: String,
        default: null,
    }, 
    //so luong binh chon
    vote: {
        type: Number,
        default: 0,
    },
    //ky nang giao tiep
    communicationSkill: {
        type: Number,
        default: 0,
    },
    //ky nang noi bat
    advancedSkill: {
        type: Number,
        default: 0,
    },
    //ngoai ngu
    foreignLanguage: {
        type: Number,
        default: 0,
    },
    //ky nang khac
    anotherSkill: {
        type: String,
        default: null,
    },
    //khac
    another: {
        type: String,
        default: null,
    },

    //cac truong cua bang invite_interview

    //vi tri ung tuyen
    posApply: {
        type: String,
        default: null,
    },
    //ten ung vien
    canName: {
        type: String,
        default: null,
    },
    //ghi chu test
    noteTest: {
        type: String,
        default: null,
    },
});

module.exports = mongoose.Schema("HR_ResultInterviews",ResultInterviewSchema);
