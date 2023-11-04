const mongoose = require("mongoose");
const GV365MeetingPermissions = new mongoose.Schema({
    role_id: {type: Number, required: true, unique: true,},
    role_name: {type: String, required: true,},
})

module.exports =  mongoose.model('GV365MeetingPermissions', GV365MeetingPermissions)
