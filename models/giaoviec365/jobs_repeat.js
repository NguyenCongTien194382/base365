const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const GV365JobsRepeat = new mongoose.Schema({
	job_id: { type: Number, required: true, unique: true },
	project_id: { type: Number, default: null },
	job_group_id: { type: Number, default: null },
	job_name: { type: String, default: null },
	job_member: { type: Number, default: null },
	date_start: { type: String, default: null },
	date_end: { type: String, default: null },
	time_in: { type: String, default: null },
	time_out: { type: String, default: null },
	type_repeat: { type: Number, default: null }, // 1 tháng 2 tuần
	day_repeat: { type: String, default: null }, // Lap lai theo tuan
	date_repeat: { type: String, default: null }, // Lap lai theo thang
	com_id: { type: Number, default: null },
	id_giaoviec: { type: Number, default: null },
	congty_or_nhanvien: { type: Number, default: null },
});

GV365JobsRepeat.plugin(mongoose_delete, {
	overrideMethods: 'all',
});

module.exports = mongoose.model('GV365JobsRepeat', GV365JobsRepeat);
