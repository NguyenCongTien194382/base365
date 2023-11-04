//Model này dùng để 
const mongoose = require('mongoose')


const HistoryCustomerCare = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    id_customer: {
        //
        type: Number,
        required: true
    },
    id_customer_care: {
        //
        type: Number,
        required: true
    },
    days: {
        //
        type: String,
        required: true
    },
    weeks: {
        //
        type: String,
    },
    month: {
        //
        type: Number,
        required: true
    },
    count: {
        //
        type: Number,
    },
    start_date: {
        //
        type: Date,
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

module.exports = mongoose.model('HistoryCustomerCare', HistoryCustomerCare);