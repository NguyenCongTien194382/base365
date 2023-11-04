const mongoose = require('mongoose');
const TV365HistoryCandidateCrmSchema = new mongoose.Schema({
    use_id: {
        type: Number,
        default: 0,
        require: true,
    },
    emp_id: {
        type: Number,
        default: 0,
    },
    time_created: {
        type: Number,
        default: 0,
    },
}, {
    collection: "TV365HistoryCandidateCrm"
})
module.exports = mongoose.model("TV365HistoryCandidateCrm", TV365HistoryCandidateCrmSchema);