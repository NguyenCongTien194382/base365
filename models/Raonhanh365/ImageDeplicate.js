const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ImageDeplicateSchema = new mongoose.Schema({
    id: {
        type: Number,
        require: true
    },
    usc_id: {
        type: Number,
        default: 0
    },
    img_check: {
        type: String,
        default: null
    },
    list_img_dep: {
        type: String,
        default: null
    },
    new_id: {
        type: Number,
        default: 0
    },
    create_time: {
        type: Number,
        default: 0
    },
    active: {
        type: Number,
        default: 0
    },
}, {
    collection: 'RN365_ImageDeplicate',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_ImageDeplicate", ImageDeplicateSchema);