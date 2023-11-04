const mongoose = require('mongoose');
const UserAddFailSchema = new mongoose.Schema({
    uf_id: {
        type: Number,
        required: true,
        autoIncrement: true
    },
    uf_id_fail: {
        type: Number,
        default: 0,
    },
    uf_email: {
        type: String,
        default: "",
    },
    uf_phone: {
        type: String,
        default: "",
    },
    uf_time: {
        type: Date,
        default: new Date()
    },
    uf_reason: {
        type: String,
        default: "",
    }
}, {
    collection: 'UserAddFails',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("UserAddFails", UserAddFailSchema);