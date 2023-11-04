const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vanthu_hide_cate_dx = new Schema({
    _id : {
        type : Number,
        required : true
    },
    id_com : {
        type : Number,
        default : null
    },
    id_cate_dx : {
        type : String,
        default : null
    }
})
module.exports = mongoose.model("Vanthu_hide_cate_dx",Vanthu_hide_cate_dx)