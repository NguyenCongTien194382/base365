const mongoose = require('mongoose');
const GV365ProjectRoles = new mongoose.Schema({
	id: { type: Number, required: true },
	staff_id: { type: Number, default: null },
	project_id: { type: Number, default: null },
	name_role: { type: String, default: null },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
});
module.exports = mongoose.model('GV365ProjectRoles', GV365ProjectRoles);
