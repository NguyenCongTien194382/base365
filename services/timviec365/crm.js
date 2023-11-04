const axios = require('axios');
const FormData = require('form-data');
const from = 'tv365';
const functions = require('../functions');
const Customer = require("../../models/crm/Customer/customer");

const AdminNhanSuCrm = require('../../models/Timviec365/Admin/AdminNhanSuCrm');
const AdminNhanSuUv = require('../../models/Timviec365/Admin/AdminNhanSuUv');

exports.addCustomer = async(name, email, phone, emp_id, id_cus_from, resoure, status, group, type, link_multi, from = 'tv365') => {
    try {
        const MaxId = await Customer.findOne({}, { cus_id: 1 }).sort({ cus_id: -1 });
        const cus_id = Number(MaxId.cus_id) + 1;

        let data = {
            cus_id,
            name,
            email,
            phone_number: phone,
            emp_id,
            resoure,
            status,
            group_id: group,
            type,
            created_at: functions.getTimeNow(),
            updated_at: functions.getTimeNow(),
            company_id: 10003087,
            id_cus_from,
            link: link_multi,
            cus_from: from
        };

        const customer = new Customer(data);
        await customer.save();
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

exports.editCustomer = async(name, email, phone, emp_id, group, id_cus_from, from = 'tv365') => {
    try {
        let data = { updated_at: functions.getTimeNow() };

        if (name) data.name = name;
        if (email) data.email = email;
        if (phone) data.phone = phone;
        if (id_cus_from) data.id_cus_from = id_cus_from;
        if (from) data.cus_from = from;
        if (group) data.group_id = group;
        await Customer.updateOne({ id_cus_from, cus_from: from }, {
            $set: data
        });
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

exports.sendataHr = async(lastname, email, phone, idTimViec365, link_multi, id_chat = 0, action = 'register') => {
    //Chia cho Nhân sự
    let lastNSUV = await AdminNhanSuUv.findOne({}).sort({ id_nsuv: -1 }).lean();
    let listNS = await AdminNhanSuCrm.find({}).lean();
    let lastNS = 0;
    if (lastNSUV) {
        lastNS = listNS.findIndex(NS => NS.emp_id == lastNSUV.emp_id);
    }
    lastNS = (lastNS > listNS.length - 1) ? 0 : lastNS;
    let empId = listNS[lastNS].emp_id;

    //Gửi sang CRM
    this.addCustomer(lastname, email, phone, empId, idTimViec365, 3, 12, 210, 1, link_multi, 'uv365_ns');
    //Lưu lại
    const getMaxIdAdminNS = await AdminNhanSuUv.findOne({}, { id_nsuv: 1 }).sort({ id_nsuv: -1 }).limit(1).lean();
    let dataNhanSuUv = {
        id_nsuv: getMaxIdAdminNS ? Number(getMaxIdAdminNS.id_nsuv) + 1 : 1,
        id_uv: idTimViec365,
        emp_id: empId,
        com_id: 10003087,
        active: 1,
        time_created: functions.getTimeNow()
    }
    let saveData = new AdminNhanSuUv(dataNhanSuUv);
    saveData.save();
}
const fakeData = async() => {
    let listNS = [155755, 203326, 897013, 561711];
    for (let i = 0; i < listNS.length; i++) {
        let dataNS = {
            emp_id: listNS[i],
            active: 1,
            time_created: 1655200523
        }
        let saveData = new AdminNhanSuCrm(dataNS);
        saveData.save();
    }
};
// fakeData();