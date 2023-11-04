const mongoose = require('mongoose');
const AdminUserRightSchema = new mongoose.Schema({
    adu_admin_id: {
        type: Number,
        required: true,
    },
    adu_admin_module_id: {
        type: Number,
        default: 0,
    },
    adu_add: {
        type: Number,
        default: 0,
    },
    adu_edit: {
        type: Number,
        default: 0,
    },
    adu_delete: {
        type: Number,
        default: 0,
    }
}, {
    collection: 'Tv365AdminUserRight',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365AdminUserRight", AdminUserRightSchema);