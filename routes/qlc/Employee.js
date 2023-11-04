const router = require('express').Router()
const employee = require('../../controllers/qlc/Employee')
const functions = require('../../services/functions')
var formData = require('express-form-data')
//đăng kí tài khoản nhân viên
router.post('/register', formData.parse(), employee.register)
//đăng kí tài khoản nhân viên 2
router.post('/register2', formData.parse(), employee.register2)
//Đăng nhập tài khoản NV
router.post('/login', formData.parse(), employee.login)
// api xác nhận OTP để xác minh tìa khoản
router.post('/verify', formData.parse(), functions.checkToken, employee.verify)
//
router.post(
  '/verifyCheckOTP',
  formData.parse(),
  functions.checkToken,
  employee.verifyCheckOTP
)
// hàm đổi mật khẩu
router.post(
  '/updatePassword',
  functions.checkToken,
  formData.parse(),
  employee.updatePasswordbyToken
)
//
router.post(
  '/updatePasswordbyInput',
  formData.parse(),
  employee.updatePasswordbyInput
)
// hàm cập nhập thông tin NV
router.post(
  '/updateInfoEmployee',
  functions.checkToken,
  formData.parse(),
  employee.updateInfoEmployee
)

// hàm cập nhập thông tin NV dung comp tk
router.post(
  '/updateInfoEmployeeComp',
  functions.checkToken,
  formData.parse(),
  employee.updateInfoEmployeeComp
)

//Cập nhật ảnh nv
router.post(
  '/updateEmpAvatar',
  functions.checkToken,
  formData.parse(),
  employee.updateEmpAvatar
)

// api api gửi mã OTP qua mail (quên mật khẩu)
// router.post('/forgotPassword', formData.parse(), employee.forgotPassword);

router.post('/info', functions.checkToken, formData.parse(), employee.info)

router.post('/home', functions.checkToken, formData.parse(), employee.home)

// lấy token mới  từ rf token
router.post(
  '/getNewToken',
  functions.checkToken,
  formData.parse(),
  employee.getTokenFromRfToken
)

module.exports = router
