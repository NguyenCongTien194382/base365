const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vanthu_ly_do = new Schema({
    _id : {
        type : Number,
        required : true
    },
    type_ld : {
        type : Number,
    },
    nd_ld : {
        type : String,
    },
    id_dx : {
        type : Number
    },
    time_created : {
        type : Date
    }
})
module.exports = mongoose.model("Vanthu_ly_do",Vanthu_ly_do)