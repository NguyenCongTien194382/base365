const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const GV365Process = new mongoose.Schema({
	process_id: { type: Number, required: true, unique: true },
	com_id: { type: Number, default: null },
	process_name: { type: String, default: null },
	process_card: { type: String, default: null },
	process_management: { type: String, default: null },
	process_member: { type: String, default: null }, // Thành viên thưc hiện
	process_evaluate: { type: String, default: null }, // Thành viên đánh giá
	process_follow: { type: String, default: null }, // Thành viên theo dõi
	process_description: { type: String }, // Mô tả quy trình
	process_failure: { type: String, default: null }, // Lý do thất bại
	option: { type: String, default: null },
	time_in: { type: String, default: null },
	time_out: { type: String, default: null },
	date_start: { type: String, default: null },
	date_end: { type: String, default: null },
	process_status: { type: Number, default: '1' }, // 1.Đang thực hiên,2.Hoàn thanh, 3.thất bai
	process_open_close: { type: Number, default: '1' }, // 0.Close 1.Open
	is_delete: { type: Number, default: '0' },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
	created_by: { type: Number, default: null }, // 1Cong ty 2 Nhan vieen
	created_id: { type: Number, default: null }, // id nguoi tao
});

GV365Process.plugin(mongoose_delete, {
	overrideMethods: 'all',
});

module.exports = mongoose.model('GV365Process', GV365Process);
