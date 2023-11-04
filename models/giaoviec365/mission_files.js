const mongoose = require('mongoose');
const GV365MissionFiles = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	mission_id: { type: Number, default: null },
	name_file: { type: String, default: null },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
	is_delete: { type: String, default: '0' },
});

module.exports = mongoose.model('GV365MissionFiles', GV365MissionFiles);
