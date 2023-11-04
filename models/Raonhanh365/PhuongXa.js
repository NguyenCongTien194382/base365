const mongoose = require('mongoose');
const Schema = mongoose.Schema
const PhuongXaSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        default: null,
    },
    prefix: {
        type: String
    },
    province_id: {
        type: Number,

    },
    district_id: {
        type: Number,
    },

}, {
    collection: 'RN365_PhuongXaSchemas',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_PhuongXaSchemas", PhuongXaSchema);