const mongoose = require('mongoose');
const GV365MeetingStaffs = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	meeting_id: { type: Number, default: null },
	staff_id: { type: Number, default: null },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
});

module.exports = mongoose.model('GV365MeetingStaffs', GV365MeetingStaffs);
