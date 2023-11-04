const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const GV365TblPhanquyenNew = new mongoose.Schema({
	id: { type: Number, required: true },
	id_user: { type: Number, Default: null },
	com_id: { type: Number, Default: null },
	vaitro_id: { type: Number, Default: null },
});

GV365TblPhanquyenNew.plugin(mongoose_delete, {
	overrideMethod: 'all',
});

module.exports = mongoose.model('GV365TblPhanquyenNew', GV365TblPhanquyenNew);
