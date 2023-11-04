const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const GV365ProcessStages = new mongoose.Schema({
	id: { type: Number, required: true },
	process_id: { type: Number, default: null },
	name: { type: String, default: null },
	stage_management: { type: String, default: null },
	stage_member: { type: String, default: null },
	stage_evaluate: { type: Number, default: null }, // Người nhận công việc sau khi chuyển giai đoạn
	completion_time: { type: String, default: null }, // Định lượng thời gian hoàn thành
	status_completion_time: { type: Number, default: null }, // Dieu chinh thoi han hoan thanh 1.Không thay đổi, 2.Thay đổi trong từng giai đoạn
	locations: { type: Number, default: '' }, // Vị trí đặt giai đoạn
	result: { type: Number, default: null }, // 1 rui ro cao 2 hoan thnah tot 3.cham tien do 4 tangtocdo
	is_delete: { type: Number, required: true },
	deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
	com_id: { type: Number, default: null },
});

GV365ProcessStages.plugin(mongoose_delete, {
	overrideMethods: 'all',
});

module.exports = mongoose.model('GV365ProcessStages', GV365ProcessStages);
