const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vanthu_message = new Schema({
    _id : {
        type : Number
    },
    id_user_sent : {
        type : Number
    },
    id_user_nhan : {
        type : Number
    },
    text_mes : {
        type : String
    },
    image_mes : {
        type : String
    }
})
module.exports = mongoose.model("Vanthu_message",Vanthu_message)