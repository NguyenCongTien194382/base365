//Model này dùng để 
const mongoose = require('mongoose')


const GroupSupplier = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    gr_id : {
        //
        type: Number,
    },
    gr_name : {
        //
        type: String,
    },
    gr_description : {
        //
        type: String,
    },
    company_id : {
        //
        type: Number,
    },
    emp_id : {
        //
        type: Number,
    },
    is_delete : {
        //
        type: Number,
    },
    created_at : {
        //
        type: Number,
    },
    updated_at : {
        //
        type: Number,
    },
    
});

module.exports = mongoose.model('GroupSupplier', GroupSupplier);

