//Model này dùng để 
const mongoose = require('mongoose')


const DetailListOrder = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    
    
    id_product : {
        //
        type : Number,
    },
    id_parent : {
        //
        type : Number,
    },
    product_name : {
        //
        type : Number,
    },
    product_unit : {
        //
        type : Number,
    },
    quantity : {
        //
        type : Number,
    },
    price : {
        //
        type : String,
    },
    total : {
        //
        type : Number,
    },
    type_discount : {
        //
        type : Number,
    },
    percent_discount : {
        //
        type : Number,
    },
    discount : {
        //
        type : Number,
    },
    vat : {
        //
        type : Number,
    },
    percent_tax : {
        //
        type : Number,
    },
    tax_in_money : {
        //
        type : Number,
    },
    total_after_process : {
        //
        type : Number,
    },
    status : {
        //
        type : Number,
    },
    is_delete : {
        //
        type : Number,
    },
    created_at : {
        //
        type : Number,
    },

});

module.exports = mongoose.model('DetailListOrder', DetailListOrder);

