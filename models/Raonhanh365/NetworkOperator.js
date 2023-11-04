const mongoose = require('mongoose');
const Schema = mongoose.Schema
const NetworkOperatorSchema = new mongoose.Schema({
    _id: {
        //id nhà mạng
        type: Number,
        required: true,
    },
    operator: {
        type: String,
        default: null
    },
    operatorName: {
        //tên nhà mạng
        type: String,
        default: null
    },
    discount: {
        //chiết khấu %
        type: Number,
        default: 0
    },
    active: {
        type: Number,
        default: 0
    }

}, {
    collection: 'RN365_NetworkOperator',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_NetworkOperator", NetworkOperatorSchema);