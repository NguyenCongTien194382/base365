const mongoose = require('mongoose');
const Schema = mongoose.Schema
const TagIndexSchema = new mongoose.Schema({
    _id: {
        //id index
        type: Number,
        required: true,
    },
    link: {
        //link tag
        type: String,
        default: null,
    },
    cateId: {
        //id danh muc
        type: Number,
        default: 0,
    },
    tags: {
        // tag
        type: Number
    },
    city: {
        // thanh pho/tinh
        type: Number,
        default: 0
    },
    district: {
        //quan/huyen
        type: Number,
        default: 0
    },
    tagsVL: {
        //chua ro
        type: Number,
        default: 0
    },
    job: {
        //chua ro
        type: Number,
        default: 0,
    },
    time: {
        //thoi gian
        type: Date,
        default: Date(Date.now())
    },
    active: {
        // tag dc su dung khong
        type: Number,
        default: 0,
    },
    classify: {
        //phân loại tags index
        type: Number,
        default: 0
    },

}, {
    collection: 'RN365_TagIndex',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_TagIndex", TagIndexSchema);