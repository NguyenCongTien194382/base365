const mongoose = require('mongoose');
const Mail365NTDSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    usc_id: {
        type: Number,
        default: 0
    },
    mid: {
        type: Number,
        default: 0
    },
    html: {
        type: String,
        default: null
    },
    html_send: {
        type: String,
        default: null
    },
    status: {
        type: Number,
        default: 0
    },
    guid: {
        type: String,
        default: null
    },
}, {
    collection: 'Mail365NTD',
    versionKey: false
});

module.exports = mongoose.model('Mail365NTD', Mail365NTDSchema);