const mongoose = require('mongoose');
const GV365JobsContents = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	staff_id: { type: Number, default: null },
	name: { type: String, default: null },
	time: { type: Number, default: null },
	date: { type: Number, default: null },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
});

module.exports = mongoose.model('GV365JobsContents', GV365JobsContents);
