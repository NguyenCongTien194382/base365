const router = require('express').Router();
// const GroupCustomerRouter = require('./groupCustomer')
const CustomerRouter = require('./Customer/CustomerRoutes')
const CustomerDetailsRoutes = require('./Customer/CustomerDetailsRoutes')
const GroupCustomerRoutes = require("./Customer/groupCustomer");
const formContract = require("./Contract/formContract");
const Contract = require("./Contract/ContractForCus");
const settingContract = require("./Setting/AccountAPI");
const CustomerContact = require("./Customer/CustomerContact");
const ToolCRM = require('../crm/toolCRM')
const Nhap_lieu = require('./Nhap_lieu')
const CustomerCare = require("../crm/CustomerCare/CustomerCare")
const CustomerStatus = require('../crm/Customer/CustomerStatus')
const contractAI = require('../crm/Contract/ContractAI');
router.use('/tool', ToolCRM)

// khách hàng
router.use('/customer', CustomerRouter)

//chi tiết khách hàng
router.use('/customerdetails', CustomerDetailsRoutes)

//nhóm khách hàng
router.use('/group', GroupCustomerRoutes);

//hợp đồng 
router.use('/contract', formContract);

//tình trạng khách hàng
router.use('/customerStatus', CustomerStatus)

//hợp đồng bán
router.use('/contractforcus', Contract);

//chăm sóc khách hàng
router.use('/cutomerCare', CustomerCare)

//cài đặt tong dai
router.use('/settingContract', settingContract);

//lien he KH
router.use('/CustomerContact', CustomerContact);

//nhập liệu
router.use('/nhaplieu', Nhap_lieu);

router.use('/contractAI', contractAI);
module.exports = router