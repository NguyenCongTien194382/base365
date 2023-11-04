//ngành đơn xin việc
const mongoose = require('mongoose');
const CategoryApplicationSchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    name: {
        type: String,
    },
    alias: {
        type: String
    },
    meta_h1: {
        type: String
    },
    content: {
        type: String
    },
    cid: {
        type: Number
    },
    meta_title: {
        type: String
    },
    meta_key: {
        type: String
    },
    meta_des: {
        type: String
    },
    meta_tt: {
        type: String
    },
    status: {
        type: Number
    }
}, {
    collection: 'CategoryApplication',
    versionKey: false
});

module.exports = mongoose.model('CategoryApplication', CategoryApplicationSchema);