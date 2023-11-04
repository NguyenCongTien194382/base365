const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const GV365MyjobFileProject = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	job_id: { type: Number, default: null },
	job_group_id: { type: Number, default: null },
	project_id: { type: Number, default: null },
	name_file: { type: String, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
	upload_by: { type: Number, default: null },
	is_delete: { type: Number, default: '0' },
});

GV365MyjobFileProject.plugin(mongoose_delete, {
	overrideMethods: 'all',
});

module.exports = mongoose.model('GV365MyjobFileProject', GV365MyjobFileProject);
