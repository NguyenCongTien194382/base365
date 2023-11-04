const mongoose = require('mongoose');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');
const MdtdCvUvVsNew = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    idUser: {
        type: Number,
        default: 0
    },
    idNew: {
        type: Number,
        default: 0
    },
    point: {
        type: String,
        default: null
    },
    time: {
        type: String,
        default: null
    }
}, {
    collection: 'Tv365MdtdCvUvVsNew',
    versionKey: false,
    timestamp: true
})
module.exports = connection.model("Tv365MdtdCvUvVsNew", MdtdCvUvVsNew);