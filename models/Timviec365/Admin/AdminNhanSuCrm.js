const mongoose = require('mongoose');
const AdminNhanSuCrmSchema = new mongoose.Schema({
    emp_id: {
        type: Number,
        required: true,
    },
    active: {
        type: Number,
        default: 0
    },
    time_created: {
        type: Number,
    }
}, {
    collection: 'Tv365AdminNhanSuCrm',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365AdminNhanSuCrm", AdminNhanSuCrmSchema);