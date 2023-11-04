const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const GV365Meeting = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	com_id: { type: Number, default: null },
	name_meeting: { type: String, default: null },
	content: { type: String },
	date_start: { type: String, default: null },
	time_start: { type: String, required: true },
	time_estimated: { type: String, default: null },
	department_id: { type: String, default: null },
	staff_owner: { type: String, default: null },// Chủ trì
	staff_ecretary: { type: String, default: null },// Thư ký
	staff_preparation: { type: String, default: null },// Chuẩn bị
	staff_take_in: { type: String, required: true },// Tham gia
	address_links: { type: String, default: null },
	is_send_mail: { type: Number, required: true },// 0.ko gui,1.co gui
	type: { type: String, default: null },// 1.Trực tiếp 2.Online trực tuyến
	is_delete: { type: Number, default: '0' },
	is_cancel: { type: Number, default: '0' },// 0.Không huỷ 1.Bị Huỷ
	deleted_at: { type: Number, default: null },
	date_deleted_at: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
});

GV365Meeting.plugin(mongoose_delete, {
	overrideMethods: 'all',
});

module.exports = mongoose.model('GV365Meeting', GV365Meeting);
