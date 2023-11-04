const mongoose = require('mongoose');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');
const Tv365PermissionNotifySchema = new mongoose.Schema({
    pn_id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    pn_usc_id: {
        type: Number,
        default: 0
    },
    pn_use_id: {
        type: Number,
        default: 0
    },
    pn_id_chat: {
        type: Number,
        default: null
    },
    pn_id_new: {
        type: Number,
        default: 0
    },
    pn_type: {
        type: Number,
        default: 0
    },
    pn_type_noti: {
        type: String,
        default: null
    },
    setup_noti: {
        type: String,
        default: null
    },
    pn_created_at: {
        type: Number,
        default: 0
    }
}, {
    collection: 'Tv365PermissionNotify',
    versionKey: false,
    timestamp: true
})
module.exports = connection.model("Tv365PermissionNotify", Tv365PermissionNotifySchema);