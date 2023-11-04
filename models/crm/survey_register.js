const mongoose = require("mongoose");
const survey_register = mongoose.Schema({
    id: {
        type: Number
    },
    id_survey: {
        type: Number
    },
    phone_cus: {
        type: String
    },
    email_cus: {
        type: String
    },
    name_cus: {
        type: String
    },
    address: {
        type: String
    },
    question: {
        type: String
    },
    answer: {
        type: String
    }
},
    {
        collection: 'CRM_survey_register',
    });
module.exports = mongoose.model('CRM_survey_register', survey_register);