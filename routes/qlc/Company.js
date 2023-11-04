const router = require('express').Router()
const company = require('../../controllers/qlc/Company')
const functions = require("../../services/functions")
var formData = require('express-form-data')
    //Đăng kí tài khoản công ty 
router.post('/register', formData.parse(), company.register)
    //Đăng nhập tài khoản công ty
router.post('/login', formData.parse(), company.login)

router.post('/checkInput', formData.parse(), company.CheckUpdatePasswordByInput)
    // router.post('/login1Time', formData.parse(), company.login1Time)
    // api xác nhận OTP để xác minh tìa khoản
router.post('/verify', formData.parse(), functions.checkToken, company.verify);
//
router.post('/verifyCheckOTP', formData.parse(), functions.checkToken, company.verifyCheckOTP);

// hàm đổi mật khẩu 
router.post('/updateNewPassword', functions.checkToken, formData.parse(), company.updatePassword);
//
router.post('/updatePasswordbyInput', formData.parse(), company.updatePasswordbyInput);
// hàm cập nhập thông tin công ty
router.post('/updateInfoCompany', formData.parse(), functions.checkToken, company.updateInfoCompany);
// api api gửi mã OTP qua mail (quên mật khẩu) 
// router.post('/forgotPassword', formData.parse(), company.forgotPassword);
// // api 
router.post('/info', formData.parse(), functions.checkToken, company.info);

router.post('/update_type_timekeeping', functions.checkToken, formData.parse(), company.update_type_timekeeping);
router.post('/update_way_timekeeping', functions.checkToken, formData.parse(), company.update_way_timekeeping);


module.exports = router