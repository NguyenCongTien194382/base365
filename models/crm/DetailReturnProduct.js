//Model này dùng để 
const mongoose = require('mongoose')


const DetailReturnProduct = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    
    parent_id : {
        type : Number,
    },
    product_id : {
        type : Number,
    },
    price : {
        type : Number,
    },
    quantity : {
        type : Number,
    },
    created_at : {
        type : Date,
    },
});

module.exports = mongoose.model('DetailReturnProduct', DetailReturnProduct);
