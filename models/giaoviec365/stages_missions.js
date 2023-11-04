const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const GV365StagesMissions = new mongoose.Schema({
	id: { type: Number, required: true },
	stage_id: { type: Number, default: null },
	process_id: { type: Number, default: null },
	name_misssion: { type: String, default: null },
	card: { type: String, default: null },
	misssion_description: { type: String, default: null },
	misssion_staff_id: { type: String, default: null },
	misssion_repeat: { type: Number, default: null },
	is_delete: { type: Number, default: null },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
	change_stage_at: { type: Number, default: null },
	hour_complete: { type: Number, default: null },
	quanli_danhgia: { type: Number, default: '1' }, // 1.Chờ đánh giá 2.Vượt KPI 3.Đạt YC 4.Chưa đạt yc
	nhanvien_danhgia: { type: Number, default: '1' },
	com_id: { type: Number, default: null },
	first_member: { type: Number, default: null },
	failed_reason: { type: String, default: null },
	result_job: { type: Number, default: '0' },
	id_giaovien: { type: Number, default: null },
	congty_or_nhanvien: { type: Number, default: null },
});

GV365StagesMissions.plugin(mongoose_delete, {
	overrideMethods: 'all',
});

module.exports = mongoose.model('GV365StagesMissions', GV365StagesMissions);
