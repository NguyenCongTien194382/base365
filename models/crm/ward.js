const mongoose = require('mongoose');
const ward = new mongoose.Schema({
    ward_id: {
        type: Number
    },
    ward_name: {
        type: String
    },
    district_id: {
        type: Number
    }
});
module.exports = mongoose.model('CRM_ward', ward);
