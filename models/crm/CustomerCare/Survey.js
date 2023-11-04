//Model này dùng để lưu Khảo sát trong chăm sóc khách hàng 
const mongoose = require('mongoose')


const listSurvey = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    title: {
        //
        type: String,
        required: true
    },
    url_survey: {
        //
        type: String,
        required: true
    },
    description: {
        //
        type: String,
    },
    create_date: {
        //
        type: String,
    },
    company_id: {
        //
        type: Number,
        required: true
    },
    emp_id: {
        //
        type: Number,
    },
    is_delete: {
        //
        type: Number,
        required: true
    },
    created_at: {
        //
        type: String,
        required: true
    },
    created_at: {
        //
        type: Number,
        required: true
    },
}, {
    collation: "listSurvey",
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('listSurvey', listSurvey);