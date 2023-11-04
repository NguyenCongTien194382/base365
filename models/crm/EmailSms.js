//Model này dùng để 
const mongoose = require('mongoose');
const { Date } = require('mongoose/lib/schema/index');


const EmailSms = new mongoose.Schema({
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
    type: {
        //
        type: Number,
        required: true
    },
    campaign_id: {
        //
        type: Number,
        required: true
    },
    email_id: {
        //
        type: Number,
    },
    title: {
        //
        type: String,
        required: true
    },
    name: {
        //
        type: String,
    },
    content: {
        //
        type: String,
        // required: true
    },
    supplier: {
        //
        type: Number,
        required: true
    },
    all_receiver: {
        //
        type: Number,
        required: true
    },
    list_receiver: {
        //
        type: String,
        // required: true
    },
    email_reply: {
        //
        type: String,
        // required: true
    },
    info_system: {
        //
        type: Number,
        required: true
    },
    date_send_email: {
        //
        type: Date,
        required: true
    },
    time_send_email: {
        //
        type: Number,
        // required: true
    },
    user_create_id: {
        //
        type: Number,
        required: true
    },
    user_create_type: {
        //
        type: Number,
        required: true
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
    status: {
        //
        type: Number,
        // required: true
    },
    customer_id: {
        //
        type: Number,
        // required: true
    },
    time_service: {
        //
        type: Number,
        // required: true
    },
    sell_value: {
        //
        type: Number,
        // required: true
    },
    time_service_end: {
        //
        type: Number,
        // required: true
    },
    sell_value_end: {
        //
        type: Number,
        // required: true
    },
    cit_id: {
        //
        type: Number,
        // required: true
    },
    birth_day: {
        //
        type: Date,
        // required: true
    },
    birthday_end: {
        //
        type: Number,
        // required: true
    },
    emp_id: {
        //
        type: Number,
        // required: true
    },
    cus_date: {
        //
        type: Number,
        // required: true
    },
    cus_date_end: {
        //
        type: Number,
        // required: true
    },
    resoure: {
        //
        type: String,
        // required: true
    },
    gender: {
        //
        type: Number,
        // required: true
    },
    start_date: {
        //
        type: Number,
        // required: true
    },
    gr_id: {
        //
        type: Number,
        // required: true
    },
    send_time: {
        //
        type: Number,
        // required: true
    },
    site: {
        //
        type: Number,
        // required: true
    },
    id_color: {
        //
        type: Number,
        // required: true
    },
    is_delete: {
        //
        type: Number,
        // required: true
    },
    created_at: {
        //
        type: Date,
        // required: true
    },
    updated_at: {
        //
        type: Date,
        // required: true,
    },
});

module.exports = mongoose.model('EmailSms', EmailSms);