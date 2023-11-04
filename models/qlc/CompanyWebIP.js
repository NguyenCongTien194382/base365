const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanyWebIP = new Schema({
    ip_id: {
        type: Number,
        unique: true
    },
    name_ip: {
        type: String,
        default: null
    },
    com_id: {
        type: Number,
        default: 0
    },
    ip_address: {
        type: String,
        default: null
    },
    type: {
        type: Number,
        default: 1
    },
    create_time: {
        type: Number,
        default: 0

    },
    is_default: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 1
    },

}, {
    collection: 'QLC_CompanyWebIP',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("QLC_CompanyWebIP", CompanyWebIP);