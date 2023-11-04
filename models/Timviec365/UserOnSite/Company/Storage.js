const mongoose = require('mongoose');
const Tv365CompanyStorageSchema = new mongoose.Schema({
    id_usc_img: {
        type: Number,
        require: true,
        unique: true,
    },
    usc_id: {
        type: Number,
        require: true
    },
    image: {
        type: String,
        default: null,
    },
    video: {
        type: String,
        default: null,
    },
    active: {
        type: Number,
        default: 0
    },
    time_created: {
        type: Number,
        default: 0
    },
    time_update: {
        type: Number,
        default: 0
    }
}, {
    collection: 'Tv365CompanyStorage',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365CompanyStorage", Tv365CompanyStorageSchema);