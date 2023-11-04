const router = require('express').Router()
const formData = require('express-form-data')
const CallAI = require('../../controllers/qlc/CallAI')
//cap nhat khuon mat
router.post('/detectFace', formData.parse(), CallAI.DetectFace)
router.post('/updateFace', formData.parse(), CallAI.UpdateFace)
module.exports = router
