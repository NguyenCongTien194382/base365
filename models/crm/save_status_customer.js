//Model này dùng để 
const mongoose = require('mongoose')


const crm_save_status_customer = new mongoose.Schema({
    save_status : {
        type : Number
    },
    user_id: {
        type : Number
    },
    customer_id: {
        type : Number
    },
    type_user: {
        type : Number
    },
    save_status: {
        type : Number
    },
    save_created_at: {
        type : Date
    },
    save_updated_at: {
        type : Date
    },
},{
    collection: 'CRM_save_status_customer',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('crm_save_status_customer', crm_save_status_customer);

