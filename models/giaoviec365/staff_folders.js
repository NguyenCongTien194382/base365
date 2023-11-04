const mongoose = require('mongoose');
const GV365StaffFolders = new mongoose.Schema({
	id: { type: Number, required: true },
	name_folde: { type: String, default: null },
	staff_id: { type: Number, default: null },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
});
module.exports = mongoose.model('GV365StaffFolders', GV365StaffFolders);
