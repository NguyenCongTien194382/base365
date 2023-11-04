const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const GV365TblFileTongquan = new mongoose.Schema({
	id: { type: Number, required: true },
	name_file: { type: String, required: false, default: null },
	size_file: { type: String, required: false, default: null },
	com_id: { type: Number, default: null },
	created_at: { type: Number, default: null },
	is_delete: { type: Number, default: '0' },
	created_by: { type: Number, default: null },
	created_id: { type: Number, default: null },
	deleted_at: { type: Number, default: null },
	type_project: { type: Number, default: null },// 1 Dự án, 2 Quy trình
	meber_duan: { type: String, default: null },
});

GV365TblFileTongquan.plugin(mongoose_delete, {
	overrideMethods: 'all',
});
module.exports = mongoose.model('GV365TblFileTongquan', GV365TblFileTongquan);
