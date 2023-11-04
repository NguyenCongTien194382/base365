const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const GV365Jobs = new mongoose.Schema({
	job_id: { type: Number, required: true, unique: true },
	project_id: { type: Number, default: null },
	job_group_id: { type: Number, default: null },
	job_name: { type: String, default: null },
	job_card: { type: String, default: null },
	job_description: { type: String, default: null },
	job_member: { type: String, default: null },
	job_follow: { type: String, default: null },
	date_start: { type: String, default: null },
	date_end: { type: String, default: null },
	time_in: { type: String, default: null },
	time_out: { type: String, default: null },
	result: { type: Number, default: null },
	job_parent: { type: Number, default: null },
	is_deleted: { type: Number, default: '0' }, // 0 chưa xóa 1 đã xóa
	com_id: { type: Number, default: null },
	process_percent: { type: Number, default: '0' }, // Phần trăm công việc hoàn thành
	content: { type: String, required: true }, // Ghi chú cập nhật công việc
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	upNumberd_at: { type: Number, default: null },
	nhanvien_danhgia: { type: Number, default: '1' },
	quanli_danhgia: { type: Number, default: '1' },
	status: { type: Number, default: '1' }, // 1 dang làm 2 hoàn thành
	status_or_late: { type: Number, default: '1' }, // 1 dang làm 2 hoàn thành 3 hoàn thành muôn
	hoanthanhluc: { type: String, default: null },
	id_giaoviec: { type: Number, default: null },
	congty_or_nhanvien: { type: Number, default: null },
});

GV365Jobs.plugin(mongoose_delete, {
	overrideMethods: 'all',
});

module.exports = mongoose.model('GV365Jobs', GV365Jobs);
