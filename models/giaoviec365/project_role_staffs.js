const mongoose = require('mongoose');
const GV365ProjectRoleStaffs = new mongoose.Schema({
	id: { type: Number, required: true },
	role_id: { type: Number, required: true },
	com_id: { type: Number, required: true },
	permission_project: { type: String, default: null },
});
module.exports = mongoose.model(
	'GV365ProjectRoleStaffs',
	GV365ProjectRoleStaffs
);
