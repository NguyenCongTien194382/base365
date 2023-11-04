const mongoose = require('mongoose');
const GV365MeetingRole = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	com_id: { type: Number, required: true },
	role_id: { type: Number, required: true },
	permission_meet_id: { type: String, default: null },
});

module.exports = mongoose.model('GV365MeetingRole', GV365MeetingRole);
