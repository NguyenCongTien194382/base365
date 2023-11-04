const mongoose = require('mongoose');
const GV365JobOfJob = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	project_id: { type: Number, default: null },
	job_id: { type: Number, default: null },
	job_name_job: { type: String, default: null },
	staff_id: { type: Number, default: null },
	status: { type: Number, default: '1' }, // 1 dang làm 2 hoàn thành
	date_limit: { type: String, default: null },
	hour_limit: { type: String, default: null },
	id_giaoviec: { type: Number, default: null },
	congty_or_nhanvien: { type: Number, default: null },
	com_id: { type: Number, default: null },
});

module.exports = mongoose.model('GV365JobOfJob', GV365JobOfJob);
