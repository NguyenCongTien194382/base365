const mongoose = require('mongoose');
const GV365Devices = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	user_id: { type: Number, default: null },
	info_brower: { type: String, required: true },
	last_login: { type: String, required: true },
	device_type: { type: Number, default: '0' },
	login_type: { type: Number, default: '0' },
	created_at: { type: Number, required: true },
});

module.exports = mongoose.model('GV365Devices', GV365Devices);
