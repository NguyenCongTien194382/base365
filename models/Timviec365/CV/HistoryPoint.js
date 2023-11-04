//cv
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const HistoryPoint = new mongoose.Schema({
    chp_id: {
        type: Number,
        require: true,
        unique: true
    },
    chp_cv_id: {
        type: Number,
    },
    chp_cate_id: {
        type: Number,
        default: 0
    },
    chp_point: {
        type: Number,
    },
    chp_created_at: {
        type: Number,
    }
}, {
    collection: 'Cv365HistoryPoint',
    versionKey: false
});
module.exports = mongoose.model("Cv365HistoryPoint", HistoryPoint);