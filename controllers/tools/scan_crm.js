const functions = require("../../services/functions");
const serviceCandi = require("../../services/timviec365/candidate");
const SaveCvCandi = require("../../models/Timviec365/UserOnSite/Candicate/SaveCvCandi");
const Profile = require('../../models/Timviec365/UserOnSite/Candicate/Profile');
const Customer = require('../../models/crm/Customer/customer');
const AdminUser = require('../../models/Timviec365/Admin/AdminUser');

const Users = require("../../models/Users");

const fs = require("fs");
const axios = require("axios");

var mongoose = require('mongoose');



//chạy tool
// const backgroundTasks = require('./services/timviec365/toolWritedByDat/background_task');

// console.log('Tool started');

const DB_URL = 'mongodb://127.0.0.1:27017/api-base365';
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));


const scan_crm = async(adm_bophan) => {
    let Admin = await AdminUser.findOne({ adm_bophan }).lean();
    console.log('admin:', Admin);
    if (Admin) {
        let listCom = await Users.find({ type: 1, "inForCompany.usc_kd": adm_bophan }).lean();
        for (key in listCom) {
            let com = listCom[key];
            // console.log(Admin);
            await Customer.updateOne({ id_cus_from: String(com.idTimViec365), cus_from: 'tv365' }, { $set: { emp_id: Admin.emp_id } });
            console.log('ok: ', com.idTimViec365);
        }
    }
};

scan_crm(4);