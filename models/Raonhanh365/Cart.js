const mongoose = require('mongoose');
const Schema = mongoose.Schema
const CartSchema = new mongoose.Schema({
    _id: {
        //id gio hang
        type: Number,
        required: true,
    },
    userId: {
        //id người dung
        type: Number,
        default: 0,
    },
    newsId: {
        //id tin dang
        type: Number,
        default: 0,
    },
    type: {
        //phan loai
        type: String,
        default: null
    },

    quantity: {
        //số lượng gio hang
        type: Number,
        default: 0,
    },
    unit: {
        type: Number,
        default: 0
    },
    tick: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Number,
        default: 0
    },

}, {
    collection: 'RN365_Cart',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_Cart", CartSchema);