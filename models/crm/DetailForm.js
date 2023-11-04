
//Model này dùng để 
const mongoose = require('mongoose')


const DetailForm = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    id_form : {
        //
        type : Number,
    },
    question : {
        //
        type : String,
    },
    answer : {
        //
        type : String,
    },
    answer_right : {
        //
        type : String,
    },
    type : {
        //
        type : Number,
    },
    created_at : {
        //
        type : Date,
    },
    updated_at : {
        //
        type : Date,
    },
    
    
    

});

module.exports = mongoose.model('DetailForm', DetailForm);

