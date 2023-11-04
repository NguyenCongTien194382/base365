const mongoose = require('mongoose');
const GV365ConfigBackground = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	id_user: { type: Number, required: true },
	background: { type: String, required: true },
	code: { type: Number, default: null },
	type: { type: String, required: true },
});

module.exports = mongoose.model('GV365ConfigBackground', GV365ConfigBackground);
