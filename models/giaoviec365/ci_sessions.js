const mongoose = require('mongoose');
const GV365CiSessions = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	ip_address: { type: String, required: true },
	timestamp: { type: Number, default: '0', required: true },
	data: { type: Buffer, required: true },
});

module.exports = mongoose.model('GV365CiSessions', GV365CiSessions);
