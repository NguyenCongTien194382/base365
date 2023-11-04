const mongoose = require('mongoose');
const moduleSchema = new mongoose.Schema({
    mod_id: {
        type: Number,
        required: true,
    },
    mod_name: String,
    mod_path: String,
    mod_listname: String,
    mod_listfile: String,
    mod_order: String,
    mod_help: String,
    lang_id: {
        type: Number,
        default: 1
    },
    mod_checkloca: {
        type: Number,
        default: 0
    },
    mod_parent: {
        type: Number,
        default: 0
    }
}, {
    collection: 'Tv365Modules',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365Modules", moduleSchema);