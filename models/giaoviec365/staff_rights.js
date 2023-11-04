const mongoose = require('mongoose');
const GV365StaffRights = new mongoose.Schema({
	staff_right_id: { type: Number, required: true },
	role_id: { type: Number, default: null },
	staff_id: { type: Number, default: null },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
});
module.exports = mongoose.model('GV365StaffRights', GV365StaffRights);
