const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vanthu_de_xuat_xu_ly = new Schema({
    id_dx: {
        type: Number,
        required : true
    },
    id_vb : {
        type : Number
    },
    user_xu_ly : {
        type : Number
    },
    y_kien_xu_ly : {
        type : String
    },
    ghi_chu : {
        type : String
    }
})
module.exports = mongoose.model("Vanthu_de_xuat_xu_ly", Vanthu_de_xuat_xu_ly);