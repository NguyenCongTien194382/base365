const mongoose = require('mongoose');
const GV365TblVaitro = new mongoose.Schema({
	id: { type: Number, required: true },
	name: { type: String, default: null },
	mota: { type: String, default: null },
	com_id: { type: Number, default: null },
	duan_dscv: { type: String, default: null },
	duan_quytrinh: { type: String, default: null },
	tailieucongviec: { type: String, default: null },
	tailieucuatoi: { type: String, default: null },
	diadiem: { type: String, default: null },
	phonghop: { type: String, default: null },
	cuochop: { type: String, default: null },
	congvieccuatoi: { type: String, default: null },
	baocao_quytrinh: { type: String, default: null },
	baocao_duan: { type: String, default: null },
	dulieudaxoa: { type: String, default: null },
	phanquyen_vaitro: { type: String, default: null },
	phanquyen_nguoidung: { type: String, default: null },
	caidat: { type: String, default: null },
});
module.exports = mongoose.model('GV365TblVaitro', GV365TblVaitro);
