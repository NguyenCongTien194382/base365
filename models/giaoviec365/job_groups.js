const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const GV365JobGroups = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	project_id: { type: Number, default: null },
	name: { type: String, default: null },
	card: { type: String, default: null },
	description: { type: String, default: null },
	project_manager: { type: String, required: true },
	project_member: { type: String, required: true },
	type: { type: Number, default: null },
	date_start: { type: String, required: true },
	date_end: { type: String, required: true },
	time_in: { type: String, default: null },
	time_out: { type: String, default: null },
	is_delete: { type: Number, default: '0' }, // 0. Chưa xóa, 1. Đã xóa
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
	process_percent: { type: String, default: null },
	nhanvien_danhgia: { type: Number, default: '1' },
	quanli_danhgia: { type: Number, default: '1' },
	job_group_status: { type: Number, default: '0' }, // 0.đang lam 1 hoàn thanh
	com_id: { type: Number, default: null },
});

GV365JobGroups.plugin(mongoose_delete, {
	overrideMethods: 'all',
});

module.exports = mongoose.model('GV365JobGroups', GV365JobGroups);
