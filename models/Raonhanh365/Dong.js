const mongoose = require('mongoose');
const RN365_DongSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        
        type: Number,
        required: true,
    },
    idCate: {
        type: Number,
        required: true,
    },
}, {
    collection: 'RN365_Dong',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_Dong", RN365_DongSchema);