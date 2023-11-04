//cv ứng viên
const mongoose = require('mongoose');
const TblHistoryViewedSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        autoIncrement: true
    },
    id_uv: {
        type: Number,
        default: 0
    },
    id_new: {
        type: Number,
        default: 0
    },
    time_view: {
        type: Number,
        default: 0
    },
    time_out: {
        type: Number,
        default: 0
    }
}, {
    collection: 'Tv365TblHistoryViewed',
    versionKey: false
});

module.exports = mongoose.model("Tv365TblHistoryViewed", TblHistoryViewedSchema);