const mongoose = require('mongoose');
const axios = require('axios');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');
const DataSampleCvSchema = new mongoose.Schema({
    idCV: {
        type: Number,
        unique: true,
        require: true
    },
    data: {
        type: Object,
        require: true
    }
}, {
    collection: 'DataSampleCv',
    versionKey: false,
    timestamp: true
})


let DataSampleCv = connection.model("DataSampleCv", DataSampleCvSchema);




module.exports = DataSampleCv;