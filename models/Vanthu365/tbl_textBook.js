const mongoose = require('mongoose');
const textBook = new mongoose.Schema({
    _id: {
        type: Number
    },
    name_book: {
        type: String,
        max: 255
    },
    nguoi_tao: {
        type: Number
    },
    com_id: {
        type: Number
    },
    year: {
        type: Number
    },
    check_year: {
        type: Number,
        default: 0
    },
    creat_date: {
        type: Number
    }


});

module.exports = mongoose.model('Vanthu_text_book', textBook);