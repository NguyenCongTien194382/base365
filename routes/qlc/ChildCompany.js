const router = require('express').Router();
const CompanyController = require('../../controllers/qlc/ChildCompany')
const formData = require('express-form-data')
const functions = require("../../services/functions")

//API lấy tất cả dữ liệu cty 
router.post("/list", formData.parse(),functions.checkToken,  CompanyController.getListCompany);

//API tạo mới một cty
router.post("/create", formData.parse(),functions.checkToken,  CompanyController.createCompany);

//API thay dổi thông tin của một cty
router.post("/edit", formData.parse(), functions.checkToken, CompanyController.editCompany);



module.exports = router