const mongoose = require('mongoose');
const Tv365TblFooterSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String
    },
    content: {
        type: String
    },
    content_thu: {
        type: String
    },
    diachi: {
        type: String
    },
    email: {
        type: String
    },
    face: {
        type: String
    },
    google: {
        type: String
    },
    yoube: {
        type: String
    },
    logo: {
        type: String
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
    meta_footer: {
        type: String
    },
    anatic: {
        type: String
    },
    map: {
        type: String
    },
    status: {
        type: Number
    },
    meta_estimate: {
        type: String
    },
    meta_descestimate: {
        type: String
    },
    meta_titleestimate: {
        type: String
    },
    estimateh1: {
        type: String
    }

}, {
    collection: 'Tv365TblFooter',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365TblFooter", Tv365TblFooterSchema);