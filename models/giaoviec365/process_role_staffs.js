const mongoose = require("mongoose");
const GV365ProcessRoleStaffs =new mongoose.Schema({
    id: {type: Number, required: true},
    role_id: {type: Number, required: true},
    com_id: {type: Number, required: true},
    permission_process: {type: String, default: ''},
})
module.exports = mongoose.model('GV365ProcessRoleStaffs', GV365ProcessRoleStaffs)