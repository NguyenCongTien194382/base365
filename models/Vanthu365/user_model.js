const mongoose = require('mongoose');
const userModel = new mongoose.Schema({
    _id: {
        type: Number
    },
    id_user: {
        type: Number
    },
    type_cong_ty: {
        type: String,
        max: 255
    },
    type_ngoai: {
        type: String,
        max: 255
    },
    duyet_pb: {
        type: String,
        max: 255
    },
    duyet_tung_pb: {
        type: String,
        max: 255
    },
    create_time: {
        type: Number
    }

});
module.exports = mongoose.model('Vanthu_user_model', userModel);