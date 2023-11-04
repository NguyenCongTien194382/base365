//Model này dùng để 
const mongoose = require('mongoose')


const DetailPriceList = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    id_table_price: {
        //
        type: Number,
        required: true
    },
    sum_1: {
        //
        type: Number,
        required: true
    },
    id_product: {
        //
        type: Number,
        required: true
    },
    quantity: {
        //
        type: String,
    },
    tax: {
        //
        type: String,
        required: true
    },
    discount: {
        //
        type: String,
    },
    type_discount: {
        //
        type: String,
        required: true
    },
    sum: {
        //
        type: String,
        required: true
    },
    created_at: {
        //
        type: Number,
        required: true
    },
    updated_at: {
        //
        type: String,
        required: true
    },
    
});

module.exports = mongoose.model('DetailPriceList', DetailPriceList);