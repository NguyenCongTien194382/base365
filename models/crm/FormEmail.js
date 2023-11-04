//Model này dùng để 
const mongoose = require('mongoose')


const FormEmail = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    company_id: {
        //
        type: Number,
        required: true
    },
    name_form_email: {
        //
        type: String,
        required: true
    },
    title_form_email: {
        //
        type: String,
        required: true
    },
    content_form_email: {
        //
        type: String,
    },
    user_create_id: {
        //
        type: Number,
        required: true
    },
    user_create_type: {
        //
        type: Number,
    },
    user_edit_id: {
        //
        type: Number,
        required: true
    },
    user_edit_type: {
        //
        type: Number,
        required: true
    },
    is_delete: {
        //
        type: Number,
        required: true
    },
    created_at: {
        //
        type: Date,
        required: true
    },
    updated_at: {
        //
        type: Date,
        required: true
    },
    
});

module.exports = mongoose.model('FormEmail', FormEmail);