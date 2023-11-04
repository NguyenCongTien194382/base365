const router = require("express").Router();
const formData = require("express-form-data");
const controllers = require("../../../controllers/crm/Customer/Customer_Chance");
const functions= require ("../../../services/functions")


// danh sách cơ hội
router.post('/listChance',functions.checkToken,formData.parse(), controllers.listChance);

// tạo mới cơ hội
router.post('/createChange',functions.checkToken, formData.parse(), controllers.create_Chance);

//update co hoi
router.post('/updateCustomerChance',functions.checkToken, formData.parse(), controllers.update_chance);

//delete co hoi 
router.post('/deleteChance',functions.checkToken, formData.parse(), controllers.deleteChange);


module.exports = router;