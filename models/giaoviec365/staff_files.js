const mongoose = require('mongoose');
const GV365StaffFiles = new mongoose.Schema({
	id: { type: Number, required: true },
	folde_id: { type: Number, default: null },
	name_file: { type: String, default: null },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
});
module.exports = mongoose.model('GV365StaffFiles', GV365StaffFiles);
