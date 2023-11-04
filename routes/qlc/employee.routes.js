

const router = require('express').Router();
const employeeController = require('../../controllers/qlc/Employee.controller');

//-----------------------------------API crud-----------------------------------
//API tao moi nhan vien
router.post("/",employeeController.createEmployee);

//API lay danh sach tat ca nhan vien hoac lay ra 1 nhan vien theo idQLC;
router.get("/",employeeController.getEmployee);

//API thay doi thong tin nhan vien
router.put("/",employeeController.editEmployee);

//API xoa nhan vien theo idQLC
router.delete("/", employeeController.deleteEmployee);

//-------------------------------API search by fields-------------------------------
//search by muti fields
router.post("/search", employeeController.getListEmployeeByFields);

module.exports = router