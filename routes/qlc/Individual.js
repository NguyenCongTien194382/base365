const router = require('express').Router()
const individual = require('../../controllers/qlc/Individual')
const functions = require("../../services/functions")
var formData = require('express-form-data')

//đăng kí tài khoản cá nhân 
router.post('/register', formData.parse(), individual.register)
    //Đăng nhập tài khoản công ty
router.post('/login', formData.parse(), individual.login)
    // api xác nhận OTP để xác minh tìa khoản
router.post('/verify', formData.parse(), functions.checkToken, individual.verify);

router.post('/verifyCheckOTP', formData.parse(), functions.checkToken, individual.verifyCheckOTP);
// hàm đổi mật khẩu 
router.post('/updatePassword', functions.checkToken, formData.parse(), individual.updatePassword);

router.post('/updatePasswordbyInput', formData.parse(), individual.updatePasswordbyInput);
// hàm cập nhập thông tin công ty
router.post('/updateInfoindividual', functions.checkToken, formData.parse(), individual.updateInfoindividual);

// api api gửi mã OTP qua mail (quên mật khẩu) 
// router.post('/forgotPasswordCheckMail', formData.parse(), individual.forgotPassword);
// api 
router.post('/info', formData.parse(), functions.checkToken, individual.info);




module.exports = router