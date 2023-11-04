const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vanthu_phong_ban = new Schema({
    _id : {
        type : Number
    },
    ten_phong_ban :{
        type : String
    },
    thanh_vien :{
        type : Number
    },
    create_date_phongban :{
        type : Date
    }

})
module.exports = mongoose.model("Vanthu_phong_ban",Vanthu_phong_ban)