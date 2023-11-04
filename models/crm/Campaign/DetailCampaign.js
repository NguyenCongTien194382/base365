//Model này dùng để 
const mongoose = require('mongoose')


const DetailCampaign = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    id_campagin: {
        //
        type: Number,
        required: true
    },
    id_cus: {
        //
        type: Number,
        required: true
    },
    status: {
        //
        type: Number,
        required: true
    },
    note: {
        //
        type: String,
    },
    emp_id: {
        //
        type: String,
        // required: true
    },
    is_delete: {
        //
        type: String,
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
})

module.exports = mongoose.model('DetailCampaign', DetailCampaign);