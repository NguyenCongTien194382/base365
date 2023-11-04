//Model này là Sổ Quỹ - trong quản lí thu chi
const mongoose = require('mongoose')


const Fundbook = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    name: {
        //
        type: String,
        required: true
    },
    total_money: {
        //
        type: Number,
        required: true
    },
    id_supplier: {
        //
        type: Number,
        required: true
    },
    id_company: {
        //
        type: Number,
    },
    description: {
        //
        type: String,
        // required: true
    },
    id_manager: {
        //
        type: Number,
    },
    status: {
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

module.exports = mongoose.model('Fundbook', Fundbook);