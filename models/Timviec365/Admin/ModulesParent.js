const mongoose = require('mongoose');
const moduleSchema = new mongoose.Schema({
    mod_id: {
        type: Number,
        required: true,
        unique: true
    },
    mod_name: String,
    mod_order: {
        type: Number,
        default: 0
    },
}, {
    collection: 'Tv365ModulesParent',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365ModulesParent", moduleSchema);