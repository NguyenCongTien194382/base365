//const mongoose = require('mongoose');
const mongoose = require('mongoose');

const tbl_qlcv_edit = new mongoose.Schema({
    _id: {
        type: Number
    },
    ed_cv_id: {
        type: Number
    },
    ed_time: {
        type: Number
    },
    ed_type_user: {
        type: Number
    },
    edUser: {
        type: Number
    },
    ed_nd: {
        type: String
    },
    ed_usc_id: {
        type: Number
    }
})
module.exports = mongoose.model("vanthu_qlcv_edit", tbl_qlcv_edit);