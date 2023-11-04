const mongoose = require('mongoose');
const GV365MissionContents = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	mission_id: { type: Number, default: null },
	content: { type: String },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
});

module.exports = mongoose.model('GV365MissionContents', GV365MissionContents);
