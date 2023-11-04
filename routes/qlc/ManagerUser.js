const router = require('express').Router()
const managerUserController = require('../../controllers/qlc/ManageUser')
const formData = require('express-form-data')
const functions = require('../../services/functions')

//API lấy danh sách nhân viên
router.post(
  '/list',
  formData.parse(),
  functions.checkToken,
  managerUserController.getlistAdmin
)

// API lấy ds nhân viên cả chưa duyệt
router.post(
  '/listAllEmps',
  formData.parse(),
  functions.checkToken,
  managerUserController.getlistAdminAll
)

//API tạo mới một User
router.post(
  '/create',
  formData.parse(),
  functions.checkToken,
  managerUserController.createUser
)

//API thay dổi thông tin của một user
router.post(
  '/edit',
  formData.parse(),
  functions.checkToken,
  managerUserController.editUser
)

// API duyệt 1 ds nhân viên
router.post(
  '/verifyListUsers',
  formData.parse(),
  functions.checkToken,
  managerUserController.verifyListUsers
)

// API lấy toàn bộ nhân viên không phân trang
router.post('/listAll', functions.checkToken, managerUserController.listAll)

// API xóa nhân viên ra khỏi công ty
router.post(
  '/del',
  formData.parse(),
  functions.checkToken,
  managerUserController.deleteUser
)

router.post("/del/dep", formData.parse(), functions.checkToken, managerUserController.deleteUser_Deparment);

module.exports = router
