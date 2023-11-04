const mongoose = require('mongoose');
const RN365_NhomThuCungSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        
        type: Number,
        required: true,
    },
    parentId:{
        type: Number,
        required: true,
    },
    idCate: {
        type: Number,
        required: true,
    },
}, {
    collection: 'RN365_NhomThuCung',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_NhomThuCung", RN365_NhomThuCungSchema);