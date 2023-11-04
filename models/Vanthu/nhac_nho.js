const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vanthu_nhac_nho = new Schema({
    _id : {
        type : Number
    },
    id_dx : {
        type : Number
    },
    time_dx : {
        type : Date
    }
})
module.exports = mongoose.model("Vanthu_nhac_nho", Vanthu_nhac_nho)