const mongoose = require('mongoose');
const AdminMenuOrderSchema = new mongoose.Schema({
    amo_admin: {
        type: Number,
        required: true,
    },
    amo_module: {
        type: Number,
    },
    amo_order: {
        type: Number,
    }
}, {
    collection: 'Tv365AdminMenuOrder',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365AdminMenuOrder", AdminMenuOrderSchema);