const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vanthu_history_handling_dx = new  Schema({
    _id : {
        type : Number,
        required : true
    },
    id_dx: {
        type : Number,
        default : null
    },
    id_user : {
        type : Number,
        default : null
    },
    type_handling : {
        type : Number
    },
    time :{
        type : Date
    }

})
module.exports = mongoose.model("Vanthu_history_handling_dx",Vanthu_history_handling_dx)