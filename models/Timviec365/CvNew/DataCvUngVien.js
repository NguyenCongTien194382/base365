const mongoose = require('mongoose');
const axios = require('axios');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');
const DataCvUngVienSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        require: true
    },
    idCV: {
        type: Number,
        require: true
    },
    idUV: {
        type: Number,
        require: true
    },
    data: {
        type: Object,
        require: true
    }
}, {
    collection: 'DataCvUngVien',
    versionKey: false,
    timestamp: true
})


let DataCvUngVien = connection.model("DataCvUngVien", DataCvUngVienSchema);




module.exports = DataCvUngVien;