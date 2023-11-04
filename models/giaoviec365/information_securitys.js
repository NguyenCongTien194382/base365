const mongoose = require('mongoose');
const GV365InformationSecuritys = new mongoose.Schema({
	security_id: { type: Number, required: true, unique: true },
	staff_id: { type: Number, default: null },
	security_name: { type: String, default: null },
	time: { type: String, default: null },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
});

module.exports = mongoose.model(
	'GV365InformationSecuritys',
	GV365InformationSecuritys
);
