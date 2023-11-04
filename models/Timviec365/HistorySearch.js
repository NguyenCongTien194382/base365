const mongoose = require('mongoose');
const HistorySearchSchema = new mongoose.Schema({
    user_id: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    },
    keyword: {
        type: String,
        default: ""
    },
    time: {
        type: Number,
        default: new Date().getTime() / 1000
    }
}, {
    collection: 'HistorySearch',
    versionKey: false
});

module.exports = mongoose.model("HistorySearch", HistorySearchSchema);