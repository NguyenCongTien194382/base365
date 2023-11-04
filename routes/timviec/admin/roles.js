var express = require('express');
var router = express.Router();
const RolesController = require('../../../controllers/timviec/admin/roles');
const authJwt = require('../../../middleware/authJwt');
let formData = require('express-form-data');


router.get('/', RolesController.getRoles);
router.post('/addRole1', formData.parse(), RolesController.addRole1);
router.post('/addRole2', formData.parse(), RolesController.addRole2);
router.post('/addRole3', formData.parse(), RolesController.addRole3);

router.post('/updateRole', formData.parse(), RolesController.updateRole);
router.post('/getAllRoles', formData.parse(), RolesController.getAllRoles);
router.post('/getUserRoles', formData.parse(), RolesController.getUserRoles);
router.post('/getDetailsRole', formData.parse(), RolesController.getDetailsRole)
router.post('/deleteDetailsRole', formData.parse(), RolesController.deleteDetailsRole)

router.post('/addRoles', formData.parse(), RolesController.addRoles)
router.post('/CUDRoles', formData.parse(), RolesController.CUDRoles)


router.post('/checkUserRole', formData.parse(), authJwt.checkUserRole, (req, res) => {
    if (req.isAdmin) {
        RolesController.getAllRoles(req, res)
    } else {
        RolesController.getUserRoles(req, res)
    }
});


module.exports = router;
