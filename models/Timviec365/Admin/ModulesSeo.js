const mongoose = require('mongoose');
const ModuleSeoSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    title: String,
    h1: String,
    sapo: String,
    module: String,
    meta_title: String,
    meta_des: String,
    meta_key: String,
    time_edit: Date
}, {
    collection: 'ModuleSeo',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("ModuleSeo", ModuleSeoSchema);