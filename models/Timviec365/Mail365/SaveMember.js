const mongoose = require('mongoose');
const Mail365SaveMemberSchema = new mongoose.Schema({
    usc_id: {
        type: Number
    },
    mid: {
        type: Number,
        default: 0
    },
    names: {
        type: String,
        default: null
    },
    emails: {
        type: String,
        default: null
    }
}, {
    collection: 'Mail365SaveMember',
    versionKey: false
});

module.exports = mongoose.model('Mail365SaveMember', Mail365SaveMemberSchema);