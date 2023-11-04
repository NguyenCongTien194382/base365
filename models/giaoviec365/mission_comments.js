const mongoose = require('mongoose');
const GV365MissionComments = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	mission_id: { type: Number, default: null },
	staff_id: { type: String, default: null },
	content: { type: String },
	com_id: { type: Number, default: null },
	created_at: { type: Number, default: null },
});

module.exports = mongoose.model('GV365MissionComments', GV365MissionComments);
