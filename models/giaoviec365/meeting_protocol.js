const mongoose = require('mongoose');
const GV365MeetingProtocol = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	name_file: { type: String, required: true },
	size_file: { type: Number, required: true },
	meeting_id: { type: Number, required: true },
	created_at: { type: Number, required: true },
	staff_id: { type: Number, default: null },
});

module.exports = mongoose.model('GV365MeetingProtocol', GV365MeetingProtocol);
