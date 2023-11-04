const mongoose = require('mongoose');
const GV365JobProcess = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	process_percentage: { type: Number, default: null },
	note: { type: String, default: null },
});

module.exports = mongoose.model('GV365JobProcess', GV365JobProcess);
