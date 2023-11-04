const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const GV365QlyDiaDiem = new mongoose.Schema({
	id: { type: Number, required: true },
	name: { type: String, default: null },
	dvsd: { type: String, default: null },
	address: { type: String, default: null },
	com_id: { type: Number, default: null },
	created_at: { type: Number, default: null },
	updated_at: { type: Number, default: null },
});

GV365QlyDiaDiem.plugin(mongoose_delete, {
	overrideMethods: 'all',
});

module.exports = mongoose.model('GV365QlyDiaDiem', GV365QlyDiaDiem);
