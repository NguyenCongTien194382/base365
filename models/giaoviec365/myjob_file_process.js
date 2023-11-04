const mongoose = require('mongoose');
const GV365MyjobFileProcess = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	job_id: { type: Number, default: null },
	mission_id: { type: Number, default: null },
	process_id: { type: Number, default: null },
	name_file: { type: String, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
	upload_by: { type: Number, default: null },
	is_delete: { type: Number, default: '0' },
});

module.exports = mongoose.model('GV365MyjobFileProcess', GV365MyjobFileProcess);
