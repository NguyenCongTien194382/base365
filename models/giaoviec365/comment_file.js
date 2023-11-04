const mongoose = require('mongoose');
const GV365CommentFile = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	id_file: { type: Number, default: null },
	staff_id_comment: { type: Number, default: null },
	content: { type: String, default: null },
	com_id: { type: Number, default: null },
	created_at: { type: Number, default: null },
	com_or_staff: { type: Number, default: null }, //1 is cty, 2 is nv
});

module.exports = mongoose.model('GV365CommentFile', GV365CommentFile);
