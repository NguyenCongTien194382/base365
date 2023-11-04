const mongoose = require('mongoose');
const GV365MissionJob = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	process_id: { type: Number, required: true },
	mission_id: { type: Number, default: null },
	job_name: { type: String, default: null },
	staff_id: { type: Number, default: null },
	status: { type: Number, default: '1' }, // 1 đang lam 2 Hoan f thnahf
	date_limit: { type: String, default: null },
	hour_limit: { type: String, default: null },
	id_giaoviec: { type: Number, default: null },
	congty_or_nhanvien: { type: Number, default: null }, // 1.Công ty else nhân viên
	nhanvien_danhgia: { type: Number, default: '1' },
	quanli_danhgia: { type: Number, default: '1' },
	process_percent: { type: Number, default: '0' },
	status_or_late: { type: Number, default: null }, // 1 dang làm 2 hoàn thành 3 hoàn thành muôn
	hoanthanhluc: { type: Number, default: null },
	created_at: { type: Number, default: null },
	card_job: { type: String, default: null },
});

module.exports = mongoose.model('GV365MissionJob', GV365MissionJob);
