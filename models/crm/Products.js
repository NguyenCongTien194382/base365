// Model này dùng để 
const mongoose = require('mongoose')


const Products = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    group_id : {
        //
        type : Number,
    },
    prod_name : {
        //
        type : String,
    },
    dvt : {
        //
        type : String,
    },
    product_image : {
        //
        type : String,
    },
    size : {
        //
        type : String,
    },
    min_inventory : {
        //
        type : String,
    },
    retail_prices : {
        //
        type : Number,
    },
    wholesale_prices : {
        //
        type : Number,
    },
    price_import : {
        //
        type : Number,
    },
    bao_hanh : {
        //
        type : Number,
    },
    expiration_date : {
        //
        type : Number,
    },
    product_origin : {
        //
        type : Number,
    },
    inventory : {
        //
        type : Number,
    },
    status : {
        //
        type : Number,
    },
    emp_id : {
        //
        type : Number,
    },
    company_id : {
        //
        type : Number,
    },
    prod_from_id : {
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
    updated_at : {
        //
        type : Number,
    },
    
    
            
});

module.exports = mongoose.model('Products', Products);

