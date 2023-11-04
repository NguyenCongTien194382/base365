const mongoose = require('mongoose');
const Schema = mongoose.Schema
const LanguagesSchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    path: {
        type: String,
        require: true
    },
    image: {
        type: String,
        default: null
    },
    domain: {
        type: String,
        default: null
    },
}, {
    collection: 'RN365_Languages',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_Languages", LanguagesSchema);