const mongoose = require('mongoose');
const Tv365CompanyVipSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    name_com: {
        type: String
    },
    alias: {
        type: String
    },
    banner: {
        type: String
    },
    logo: {
        type: String
    },
    images: {
        type: String
    },
    tieu_de: {
        type: String
    },
    content: {
        type: String
    },
    introduction: {
        type: String
    },
    map: {
        type: String
    },
    ct_301: {
        type: String
    },
    address: {
        type: String
    },
    meta_title: {
        type: String
    },
    meta_des: {
        type: String
    },
    meta_key: {
        type: String
    },
    meta_h1: {
        type: String
    },
    keyword: {
        type: String
    },
    new_tdgy: {
        type: String
    },
    new_ndgy: {
        type: String
    },
    admin_id: {
        type: Number
    },
    time_edit: {
        type: Number
    },
    status: {
        type: Number
    }
}, {
    collection: 'Tv365CompanyVip',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365CompanyVip", Tv365CompanyVipSchema);