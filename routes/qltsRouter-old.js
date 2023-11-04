var express = require('express');
var router = express.Router();
var functions = require('../services/functions');
const toolData = require('./qlts/toolRouter')
const taisanRouter = require('./qlts/taiSanRouter')
const nhomTsRouter = require('./qlts/nhomTaiSanRouter')
const loaiTsRouter = require('./qlts/loaiTaiSanRouter')
const vitriTsRouter = require('./qlts/viTriTaiSanRouter')
var capPhat = require('./qlts/CapPhat.js')
var DanhSach = require('./qlts/DanhSach.js')
var ThuHoi = require('./qlts/ThuHoi.js')
var mat = require('./qlts/matRouter')
var huy = require('./qlts/huyRouter')
var SuaChua = require('./qlts/SuaChua_BaoDuong/SuaChua');
var kiemKeRouter = require('./qlts/kiemKeRouter');
var DieuChuyenBanGiao = require("./qlts/DieuChuyenBanGiao/DieuChuyenViTri");
var BaoDuong = require('./qlts/SuaChua_BaoDuong/BaoDuong/TaiSanCanBaoDuong');
var QuyDinhBaoDuong = require('./qlts/SuaChua_BaoDuong/BaoDuong/QuyDinhBaoDuong');
var TheoDoiCongSuat = require('./qlts/SuaChua_BaoDuong/BaoDuong/TheoDoiCongSuat');
var xoaGanDay = require('./qlts/duLieuXoaRoute')
var DieuChuyenBanGiaoDVQL = require("./qlts/DieuChuyenBanGiao/DieuChuyenDonViQuanLi");
var BanGiao = require("./qlts/DieuChuyenBanGiao/BanGiao");
var TrangChu = require("./qlts/TrangChu");
var DieuChuyenBanGiaoDT = require('./qlts/DieuChuyenBanGiao/DieuchuyenDoiTuong')
var thanhly = require('./qlts/thanhLyRouter')
var phanQuyen = require('./qlts/phanQuyen')

//Api tool quét data
router.use('/tool', toolData)

//Api tài sản
router.use('/taisan', taisanRouter)
router.use('/CapPhat', capPhat);
router.use('/ThuHoi', ThuHoi);

// nhóm tài sản
router.use('/nhomts', nhomTsRouter)

//loại tài sản
router.use('/loaits', loaiTsRouter)

// vị trí tài sản
router.use('/vitrits', vitriTsRouter)
//API mất huỷ thanh lý
router.use('/mat', mat)
router.use('/huy', huy)
//api kiem ke
router.use('/kiemKe', functions.checkToken, kiemKeRouter);

//api Phân quyền
router.use('/phanQuyen', phanQuyen)


router.use('/DieuChuyenBanGiao/DVQL', DieuChuyenBanGiaoDVQL);
router.use('/DieuChuyenBanGiaoDoiTuong', DieuChuyenBanGiaoDT)
//suachua-baoduong
router.use('/SuaChua', SuaChua);
router.use('/BaoDuong', BaoDuong);
router.use('/QuyDinhBaoDuong', QuyDinhBaoDuong);
router.use('/DieuChuyenBanGiao', DieuChuyenBanGiao);
router.use('/TheoDoiCongSuat', TheoDoiCongSuat);

// điều chuyển bàn giao 
router.use('/DieuChuyenBanGiao', DieuChuyenBanGiao);

// Dữ liệu xoá gần đây
router.use('/xoa', xoaGanDay)
router.use('/thanhly',thanhly)
router.use('/DieuChuyenBanGiao/DVQL', DieuChuyenBanGiaoDVQL);

router.use('/BanGiao', BanGiao);

router.use('/TrangChu', TrangChu);
router.use('/DanhSach', DanhSach);
module.exports = router