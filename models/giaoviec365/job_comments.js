const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const GV365JobsComments = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	job_id: { type: Number, default: null },
	staff_id: { type: String, default: null },
	com_id: { type: Number, default: null },
	conent: { type: String },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
});

GV365JobsComments.plugin(mongoose_delete, {
	overrideMethods: 'all',
});

module.exports = mongoose.model('GV365JobsComments', GV365JobsComments);
