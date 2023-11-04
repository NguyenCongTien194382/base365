const mongoose = require('mongoose');
const Schema = mongoose.Schema
const RegisterFailSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    phone: {
        
        type: String,
        default: null,
    },
    email: {
        
        type: String,
        default: null,
    },
    emailHt: {
        
        type: String,
        default: null,
    },
    name: {
        //ten
        type: String,
        default: null,
    },
    mk: {
        
        type: String,
        default: null,
    },
    time: {
        //tg dang ky
        type: Date,
        default: Date.now(),
    },
    err: {
        type: String,
        default: null,
    },
    type: {
        //avatar
        type: Number,
        default: 1,
    }

}, {
    collection: 'RN365_RegisterFail',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_RegisterFail", RegisterFailSchema);