const mongoose = require('mongoose');
const TblModulesSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    title: {
        type: String
    },
    h1: {
        type: String
    },
    sapo: {
        type: String
    },
    module: {
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
    time_edit: {
        type: Number
    }

}, {
    collection: 'TblModules',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("TblModules", TblModulesSchema);