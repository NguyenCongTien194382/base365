const mongoose = require('mongoose');
const RN365_BaoCaoSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    new_baocao: {
        type: Number,
        required: true,
    },
    user_baocao: {
        
        type: Number,
        required: true,
    },
    new_user: {
        type: Number,
        required: true,
    },
    tgian_baocao: {
        type: Number,
        required: true,
    },
    van_de: {
        type: Number,
        required: true,
    },
    mo_ta: {
        type: String,
        required: true,
    },
    da_xuly: {
        type: Number,
        default:0
    },   
}, {
    collection: 'RN365_BaoCao',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_BaoCao", RN365_BaoCaoSchema);