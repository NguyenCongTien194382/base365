const mongoose = require('mongoose');
const HR_CiSessionSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    timestamp : {
        type: Date,
        required: true,
        default: 0,
    },
    data: {
        type: String ,
        required: true,
    },
}, {
    collection: 'HR_CiSessions',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("HR_CiSessions", HR_CiSessionSchema);