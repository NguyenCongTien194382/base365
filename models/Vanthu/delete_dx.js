const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vanthu_delete_dx = new Schema({
    _id : {
        type : Number,
        required : true
    },
    user_del: {
        type: Number
    },
    user_del_com: {
        type: Number
    },
    id_dx_del: {
        type: Number
    },
    time_del: {
        type: Date
    }
})
module.exports = mongoose.model("Vanthu_delete_dx", Vanthu_delete_dx);