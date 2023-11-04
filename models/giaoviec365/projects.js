const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const GV365Projects = new mongoose.Schema({
	project_id: { type: Number, required: true },
	com_id: { type: Number, default: null },
	project_name: { type: String, default: null },
	project_description: { type: String, default: null },
	time_in: { type: String, default: null },
	time_out: { type: String, default: null },
	date_start: { type: String, default: null },
	date_end: { type: String, default: null },
	project_card: { type: String, default: null },
	project_management: { type: String, default: null },
	project_member: { type: String, default: null },
	project_evaluate: { type: String, default: null },
	project_follow: { type: String, default: null },
	type: { type: Number, default: '0' }, // 0.đang lam 1 hoàn thanh
	project_type: { type: Number, default: '0' }, // '0. Dự án, 1. Công việc'
	link_congviec: { type: Number, default: null },
	description: { type: String, default: null },
	is_delete: { type: Number, default: '0' },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	created_by: { type: Number, default: null },
	updated_at: { type: Number, default: null },
	created_id: { type: Number, default: null },
	open_or_close: { type: Number, default: '1' }, // 1 Mo 2 đóng
	is_khancap: { type: Number, default: null },
});

GV365Projects.plugin(mongoose_delete, {
	overrideMethods: 'all',
});

module.exports = mongoose.model('GV365Projects', GV365Projects);
