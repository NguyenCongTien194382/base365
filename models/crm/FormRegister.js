//Model này dùng để 
const mongoose = require('mongoose')


const FormRegister = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    id_form: {
        //
        type: Number,
        required: true
    },
    name: {
        //
        type: String,
        required: true
    },
    phone_number: {
        //
        type: Number,
        required: true
    },
    email: {
        //
        type: String,
    },
    gender: {
        //
        type: Number,
        required: true
    },
    birthday: {
        //
        type: Date,
    },
    address: {
        //
        type: String,
        required: true
    },
    question: {
        //
        type: String,
        required: true
    },
    answer: {
        //
        type: String,
        required: true
    },
    choose_answer: {
        //
        type: String,
        required: true
    },
    type: {
        //
        type: String,
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

module.exports = mongoose.model('FormRegister', FormRegister);