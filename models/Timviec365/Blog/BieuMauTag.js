const mongoose = require('mongoose');
const BieuMauTagSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    bmt_name: {
        type: String,
        default: null
    },
    bmt_301: {
        type: String,
        default: null
    },
    bmt_title: {
        type: String,
        default: null
    },
    bmt_des: {
        type: String,
        default: null
    },
    bmt_key: {
        type: String,
        default: null
    },
    bmt_active: {
        type: Number,
        default: null
    }
}, {
    collection: 'BieuMauTag',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("BieuMauTag", BieuMauTagSchema);