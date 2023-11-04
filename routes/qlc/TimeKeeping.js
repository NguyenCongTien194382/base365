const router = require('express').Router()
const Controller = require('../../controllers/qlc/TimeSheet')
    // const functions= require ("../../services/functions")
const formData = require('express-form-data')
const functions = require('../../services/functions')

// lịch sử chấm công được ghi lại
router.post(
    '/create/web',
    functions.checkToken,
    formData.parse(),
    Controller.SaveForWeb
)
router.post(
    '/create/webComp',
    functions.checkToken,
    formData.parse(),
    Controller.SaveForWebComp
)
router.post(
    '/com/success',
    formData.parse(),
    Controller.getListUserTrackingSuccess
)
router.post(
    '/com/false',
    formData.parse(),
    Controller.getlistUserNoneHistoryOfTracking
)
router.post(
    '/employee/home',
    functions.checkToken,
    formData.parse(),
    Controller.EmployeeHome
)

router.post(
    '/employee/splitTimeKeeping',
    formData.parse(),
    Controller.splitTimeKeeping
)

// Lịch sử điểm danh theo tài khoản công ty
router.post(
    '/get_history_time_keeping_by_company',
    functions.checkToken,
    formData.parse(),
    Controller.get_history_time_keeping_by_company
)
module.exports = router