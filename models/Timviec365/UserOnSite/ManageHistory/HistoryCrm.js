const mongoose = require('mongoose');
const TV365HistoryCrmSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        require: true,
    },
    usc_id: {
        type: Number,
        default: 0,
        require: true,
    },
    usc_group: {
        type: Number,
        default: 0,
    },
    usc_status: {
        type: Number,
        default: 0,
    },
    time_created: {
        type: Number,
        default: 0,
    },
}, {
    collection: "TV365HistoryCrm"
})
module.exports = mongoose.model("TV365HistoryCrm", TV365HistoryCrmSchema);