const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportError = new Schema({
    user_id: { // kieu user
        type: Number,
        default: 0
    },
    device_id: {
        type: String,
        default: null
    },
    detail_error: {
        type: String,
        default: null
    },
    gallery_image_error: {
        type: String,
        default: null
    },
    time_create: {
        type: Number,
        default: 0
    },
    from_source: {
        type: Number,
        default: 1
    },
}, {
    collection: 'QLC_ReportError',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model('QLC_ReportError', ReportError);