const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SalarySchema = new Schema({
    // id tu dong tang
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    sb_id_user: {
        type: Number,
    },
    sb_id_com: {
        type: Number,
    },
    sb_salary_basic: {
        type: Number,
    },
    sb_salary_bh: {
        type: String,
    },
    sb_pc_bh: {
        type: Number,
    },
    sb_time_up: {
        type: Date,
    },
    sb_location: {
        type: Number,
    },
    sb_lydo: {
        type: String,
    },
    sb_quyetdinh: {
        type: String,
    },
    sb_first: {
        type: Number,
    },
    sb_time_created: {
        type: Date,
    },
}, {
    collection: 'HR_Salarys',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_Salarys", SalarySchema);
