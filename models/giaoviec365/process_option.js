const mongoose = require('mongoose');
const GV365ProcessOption = new mongoose.Schema({
	id: { type: Number, required: true },
	process_id: { type: Number, required: true },
	type_option: { type: Number, required: true }, // Loại dữ liệu
	name_option: { type: String, required: true },
	des_option: { type: String, required: true },
	is_required: { type: Number, required: true },
	with_stage: { type: Number, required: true },
	list_dropdown: { type: String, default: null },
	value_nhap: { type: String, default: null },
});
module.exports = mongoose.model('GV365ProcessOption', GV365ProcessOption);
