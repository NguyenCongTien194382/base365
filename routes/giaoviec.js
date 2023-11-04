var express = require('express');
var router = express.Router();

var siteRouter = require('./GiaoViec365/site')
var projectRouter = require('./GiaoViec365/projects')
var fileRouter = require('./GiaoViec365/files')
var meetingRoomRouter = require('./GiaoViec365/meeting_room')
var meetingRouter = require('./GiaoViec365/meeting')
var meRouter = require('./GiaoViec365/me')
var deletedDataRouter = require('./GiaoViec365/deleted_data')
var accountRouter = require('./GiaoViec365/account')
var roleRouter = require('./GiaoViec365/permisson')

router.use('/roles', roleRouter)
router.use('/deleted-data', deletedDataRouter)
router.use('/login', accountRouter)
router.use('/meetings', meetingRouter)
router.use('/meeting-rooms', meetingRoomRouter)
router.use('/files', fileRouter)
router.use('/projects', projectRouter)
router.use('/me', meRouter)
router.use('/', siteRouter)

module.exports = router