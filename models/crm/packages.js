const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_packages = new Schema({
    id : {
        type : Number
    },
    id_cus : {
        type : Number
    },
    id_service : {
        type : Number
    },
    number : {
        type : Number
    },
    name : {
        type : String
    },
    email : {
        type : String
    },
    phone : {
        type : Number
    },
    address : {
        type : String
    },
    tax: {
        type : String
    },
    represent: {
        type : String
    },
    position: {
        type : String
    },
    vat: {
        type : Number
    },
    discount: {
        type : String
    },
    option_discount : {
        type : String
    },
    bank: {
        type : String
    },
    type : {
        type : Number
    },
    usc_type: {
        type : Number
    },
    usc_source_web : {
        type : String
    },
    total: {
        type : Number
    },
    created_at : {
        type : Date
    },
    updated_at : {
        type : Date
    },
},{
    collection: 'CRM_packages',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("CRM_packages", crm_packages );