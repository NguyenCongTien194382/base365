//Model này dùng để 
const mongoose = require('mongoose')


const AppointmentSchedule = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    schedule_name: {
        //
        type: String,
        required: true
    },
    cus_id: {
        //
        type: Number,
        required: true
    },
    ep_id: {
        //
        type: Number,
        required: true
    },
    address: {
        //
        type: String,
    },
    start_date_schedule: {
        //
        type: Date,
        required: true
    },
    end_date_schedule: {
        //
        type: Date,
    },
    schedule_status: {
        //
        type: Number,
        required: true
    },
    reason_cancel: {
        //
        type: String,
        // required: true
    },
    description: {
        //
        type: String,
        // required: true
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

module.exports = mongoose.model('AppointmentSchedule', AppointmentSchedule);