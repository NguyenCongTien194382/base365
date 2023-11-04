const mongoose = require('mongoose');
const BoDeSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    bd_cate: {
        type: String,
        default: null
    },
    bd_order: {
        type: Number,
        default: null
    },
    bd_footer_order: {
        type: Number,
        default: null
    },
    bd_description: {
        type: String,
        default: null
    },
    bd_keyword: {
        type: String,
        default: null
    },
    bd_title: {
        type: String,
        default: null
    },
    bd_mota: {
        type: String,
        default: null
    },
}, {
    collection: 'BoDe',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("BoDe", BoDeSchema);