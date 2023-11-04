const mongoose = require('mongoose');
const AdminNhanSuUvSchema = new mongoose.Schema({
    id_nsuv: {
        type: Number,
        required: true,
    },
    id_uv: {
        type: Number,
        required: true,
    },
    emp_id: {
        type: Number,
        required: true,
    },
    com_id: {
        type: Number,
    },
    active: {
        type: Number,
        default: 0
    },
    time_created: {
        type: Number,
        required: true,
    }
}, {
    collection: 'Tv365AdminNhanSuUv',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365AdminNhanSuUv", AdminNhanSuUvSchema);