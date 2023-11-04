
//Model này dùng để 
const mongoose = require('mongoose')


const DetailEmailSms = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    id_email_sms : {

        type : Number,
    },
    id_cus : {

        type : Number,
    },
    created_at : {

        type : Date,
    },
    updated_at : {

        type : Date,
    },
});

module.exports = mongoose.model('DetailEmailSms', DetailEmailSms);
