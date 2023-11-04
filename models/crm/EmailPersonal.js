//Model này dùng để 
const mongoose = require('mongoose')


const EmailPersonal = new mongoose.Schema({
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
    server_mail: {
        //
        type: String,
        required: true
    },
    port_number: {
        //
        type: Number,
        // required: true
    },
    address_send_mail: {
        //
        type: String,
    },
    name_mail: {
        //
        type: String,
        // required: true
    },
    name_login: {
        //
        type: String,
    },
    password: {
        //
        type: String,
        required: true
    },
    method_security: {
        //
        type: Number,
        required: true
    },
    number_email_sent: {
        //
        type: Number,
        // required: true
    },
    time_send_mail: {
        //
        type: String,
        // required: true
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
    is_delete: {
        //
        type: Number,
        required: true
    },
    

});

module.exports = mongoose.model('EmailPersonal', EmailPersonal);