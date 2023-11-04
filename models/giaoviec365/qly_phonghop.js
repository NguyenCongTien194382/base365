const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const GV365QlyPhongHop = new mongoose.Schema({
	id: { type: Number, required: true },
	name: { type: String, default: null },
	diadiem: { type: Number, default: null },
	succhua: { type: Number, default: null },
	trangthai: { type: Number, default: '1' }, // 1 đang hđ 2 ngưng
	com_id: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
});

GV365QlyPhongHop.plugin(mongoose_delete, {
	overrideMethods: 'all',
});

module.exports = mongoose.model('GV365QlyPhongHop', GV365QlyPhongHop);
