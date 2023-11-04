const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const GV365MeetingComments = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	meeting_id: { type: Number, default: null },
	staff_id: { type: String, default: null },
	content: { type: String },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
});

GV365MeetingComments.plugin(mongoose_delete, {
	overrideMethods: 'all',
});

module.exports = mongoose.model('GV365MeetingComments', GV365MeetingComments);
