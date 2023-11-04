//Model này dùng để 
const mongoose = require('mongoose')


const Form = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    name: {
        //
        type: String,
        // required: true
    },
    phone_number: {
        //
        type: Number,
        // required: true
    },
    email: {
        //
        type: String,
        // required: true
    },
    gender: {
        //
        type: String,
    },
    birthday: {
        //
        type: String,
        // required: true
    },
    address: {
        //
        type: String,
    },
    name_form: {
        //
        type: String,
        required: true
    },
    url_form: {
        //
        type: String,
        required: true
    },
    start_date: {
        //
        type: Date,
        required: true
    },
    end_date: {
        //
        type: Date,
        required: true
    },
    emp_id: {
        //
        type: Number,
        required: true
    },
    company_id: {
        //
        type: Number,
        required: true
    },
    type: {
        //
        type: Number,
        required: true
    },
    status: {
        //
        type: Number,
        required: true
    },
    name_add_field: {
        //
        type: String,
        // required: true
    },
    add_field: {
        //
        type: String,
        // required: true
    },
    field_right: {
        //
        type: String,
        // required: true
    },
    count_open: {
        //
        type: Number,
        required: true,
    },
    is_delete: {
        //
        type: Number,
        required: true,
    },
    created_at: {
        //
        type: Date,
        required: true,
    },
    updated_at: {
        //
        type: Date,
        required: true,
    },

});

module.exports = mongoose.model('Form', Form);