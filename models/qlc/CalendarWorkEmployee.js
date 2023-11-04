const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CC365_EmployeCycle = new Schema({
    epcy_id: { //ID danh sách nhân viên có lịch làm việc
        type: Number,
        required: true
    },
    ep_id: {
        type: Number
    },
    cy_id: { //ID cty
        type: Number
    },
    update_time: { //ID ca 
        type: Date
    }
}, {
    collection: 'CC365_EmployeCycle',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model('CC365_EmployeCycle', CC365_EmployeCycle);