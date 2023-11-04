const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const GV365JobsFiles = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	job_id: { type: Number, default: null },
	name_file: { type: String, default: null },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
	project_id: { type: Number, default: null },
	is_delete: { type: Number, default: '0' },
});

GV365JobsFiles.plugin(mongoose_delete, {
	overrideMethods: 'all',
});

module.exports = mongoose.model('GV365JobsFiles', GV365JobsFiles);
