var express = require('express');
var router = express.Router();

var adddeXuat = require("../routes/vanthu/DeXuat/create_dx")
var settingDXroutes = require('./vanthu/SettingRoutes')
var cateDXroutes = require('./vanthu/cateDeXuatRoutes');
var toolVT = require('./vanthu/RoutertoolVT')
var DeleteDX = require('./vanthu/DeXuat/delete_Dx')
var EditDX = require('./vanthu/DeXuat/edit_deXuat')
var TKNP = require('./vanthu/DeXuat/thong_ke_nghi_phep')
var EditDXSend = require('./vanthu/DeXuat/User_Dx')
var homeQLCV = require('./vanthu/QuanLyCongVan/homeRoute')
var home = require('./vanthu/GuiNhanCongVan/homeRoute')
var vanBanDi = require('./vanthu/GuiNhanCongVan/vanBanDiRoute')
var vanBanDen = require('./vanthu/GuiNhanCongVan/vanBanDenRoute')
var setting = require('./vanthu/GuiNhanCongVan/settingRoute')
var homeRoute = require('./vanthu/QuanLyCongVan/homeRoute')
var listVanBan = require('./vanthu/QuanLyCongVan/listTextRoute')
// var guiNhanCongVan = require('./vanthu/GuiNhanCongVan/vanBanDiRoute')
var contract = require('./vanthu/QuanLyCongVan/contractRoute')
var history = require('./vanthu/QuanLyCongVan/historyUpdateRoute')
var dataDelete = require('./vanthu/QuanLyCongVan/dataDidDeleteRoute')
var settingqlcv = require('./vanthu/QuanLyCongVan/settingRoute.js')

//Api thêm mới các loại đề xuất
router.use('/vanthu/dexuat',adddeXuat);

//Api setting đề xuất
router.use('/vanthu/setting',settingDXroutes);

//Api  de xuat và hiển thị đề xuất
router.use('/vanthu/catedx',cateDXroutes);

//Api xóa để xuất và sửa đề xuất
router.use('/vanthu/deletedx',DeleteDX);
router.use('/vanthu/editdx',EditDX);

//Api gửi nhận đề xuất
router.use('/vanthu/DeXuat',EditDXSend);

router.use('/vanthu/thongkenp',TKNP);

router.use('/vanthu/trangchu',homeQLCV);

router.use('/vanthu/listVanBan',listVanBan);

router.use('/vanthu/contract',contract);

router.use('/vanthu/history',history)

router.use('/vanthu/dataDelete',dataDelete)

router.use('/vanthu/trangchu',homeRoute)

router.use('/vanthu/setting',settingqlcv)
//Api tool quét data văn thư
router.use('/tooldata',toolVT)

//----------------------------------------------------------Gui Nhan Cong Van------------------------------------
//--Van Ban Di
router.use('/vanthu/guiNhanCongVan/home', home);
router.use('/vanthu/guiNhanCongVan/vanBanDi', vanBanDi);
router.use('/vanthu/guiNhanCongVan/vanBanDen', vanBanDen);
router.use('/vanthu/guiNhanCongVan/setting', setting);

module.exports = router