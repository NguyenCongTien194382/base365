const mongoose = require('mongoose');
const GV365TblPermissions = new mongoose.Schema({
	role_id: { type: Number, required: true },
	role_name: { type: String, required: false, default: null },
});
module.exports = mongoose.model('GV365TblPermissions', GV365TblPermissions);
