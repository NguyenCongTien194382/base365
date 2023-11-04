

const router = require('express').Router();
const individualController = require('../../controllers/qlc/Individual.controller');

//-----------------------------------API crud-----------------------------------
//API tao moi ca nhan
router.post("/",individualController.createIndividual);

//API thay doi thong tin ca nhan
router.put("/",individualController.editIndividual);

//API xoa ca nhan theo idQLC
router.delete("/", individualController.deleteIndividual);

//-------------------------------API search individual by fields(idQLC, exp, candiHocVan, .....)-------------------------------

router.post("/search", individualController.getListIndividualByFields);

module.exports = router