const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vanthu_ghi_chu = new Schema({
    id_note : {
        type : Number,
        required : true
    },
    id_vb : {
        type : Number,
        default: null
    },
    text_note : {
        type : String
    }

})
module.exports = mongoose.model("Vanthu_ghi_chu", Vanthu_ghi_chu);