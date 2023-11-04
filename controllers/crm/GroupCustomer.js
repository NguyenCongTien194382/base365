// const GroupCustomer = require("../../models/crm/GroupCustomer")
const functions = require('../../services/functions')
const Customer_group = require("../../models/crm/Customer/customer_group");
const Customer = require('../../models/crm/Customer/customer');
exports.getListGroup = async(req, res) => {

    try {
        let name_gr = req.body.name_gr;
        let skip = Number(req.body.skip) || 1;
        let limit = Number(req.body.limit) || 10;
        let list_Cus_gr = [];
        let new_gr_khach_hang = {};
        let Cus_gr = await Customer_group.find({ gr_name: { $regex: `${name_gr}` }, group_parent: 0 }).skip((skip - 1) * limit).limit(limit);
        let cus_gr_all = await Customer_group.find().skip((skip - 1) * limit).limit(limit);
        for (let i = 0; i < Cus_gr.length; i++) {
            if (Cus_gr[i].group_parent == 0) {
                new_gr_khach_hang.gr_id = Cus_gr[i].gr_id;
                new_gr_khach_hang.gr_name = Cus_gr[i].gr_name;
                new_gr_khach_hang.gr_description = Cus_gr[i].gr_description;
                new_gr_khach_hang.group_parent = Cus_gr[i].group_parent;
                new_gr_khach_hang.company_id = Cus_gr[i].company_id;
                new_gr_khach_hang.dep_id = Cus_gr[i].dep_id;
                new_gr_khach_hang.emp_id = Cus_gr[i].emp_id;
                new_gr_khach_hang.count_customer = Cus_gr[i].count_customer;
                new_gr_khach_hang.is_delete = Cus_gr[i].is_delete;
                new_gr_khach_hang.created_at = Cus_gr[i].created_at;
                new_gr_khach_hang.updated_at = Cus_gr[i].updated_at;
                new_gr_khach_hang.list_child = []
                list_Cus_gr.push(new_gr_khach_hang);
            }
        }
        for (let i = 0; i < list_Cus_gr.length; i++) {
            for (let j = 0; j < cus_gr_all.length; j++) {
                if (cus_gr_all[j].group_parent == list_Cus_gr[i].gr_id) {
                    let childs = list_Cus_gr[i].list_child;
                    childs.push(cus_gr_all[j]);
                    list_Cus_gr[i].list_child = childs;
                }
            }
        }
        return res.status(200).json({ data: list_Cus_gr, count: list_Cus_gr.length, message: "success" });
    } catch (error) {
        console.error("Failed to show", error);
        res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
    }


}


exports.createGroup = async(req, res) => {

    try {
        const {
            groupName,
            groupDescription,
            groupParents,
            companyId,
            dep_id,
            emp_id,


        } = req.body
        if (!groupName) {
            //kiểm tra thuộc tính groupName truyền vào
            functions.setError(res, "groupName must not leave empty")
        } else {
            let maxId = 0;
            let Cus_gr = await Customer_group.findOne({}, {}, { sort: { gr_id: -1 } }).lean() || 0;
            if (Cus_gr) {
                maxId = Cus_gr.gr_id;
            }

            let group = new Customer_group({
                gr_id: maxId + 1,
                gr_name: groupName,
                gr_description: groupDescription,
                group_parent: groupParents,
                company_id: companyId,
                dep_id: dep_id,
                emp_id: emp_id,
                created_at: new Date().getTime(),
                updated_at: new Date().getTime(),

            })
            await group.save();
            return res.status(200).json({ data: group, message: "success" });

        }
    } catch (error) {
        console.error("Failed to show", error);
        res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
    }


}
exports.update = async(req, res) => {
    try {
        let {
            id,
            groupName,
            groupDescription,
            groupParents,
            companyId,
            departmentId,
            employeeShare_id,
            emp_id
        } = req.body;
        let new_GR_KH;
        // await functions.getDatafindOneAndUpdate(Customer_group, { gr_id: URLSearchParams.id }, {
        if (departmentId == "all") {
            // employeeShare_id = 'all';
            new_GR_KH = await Customer_group.findOneAndUpdate({ gr_id: id, company_id: companyId, }, {
                gr_name: groupName,
                gr_description: groupDescription,
                group_parent: groupParents,
                company_id: companyId,
                dep_id: "all",
                emp_id: emp_id,
                updated_at: new Date().getTime()
            });

        } else if (departmentId != '') {
            if (employeeShare_id == 'all') {
                new_GR_KH = await Customer_group.findOneAndUpdate({ gr_id: id, company_id: companyId, }, {
                    gr_name: groupName,
                    gr_description: groupDescription,
                    group_parent: groupParents,
                    company_id: companyId,
                    dep_id: departmentId,
                    emp_id: "all",
                    updated_at: new Date().getTime()
                });
            } else if (employeeShare_id != '') {
                new_GR_KH = await Customer_group.findOneAndUpdate({ gr_id: id, company_id: companyId, }, {
                    gr_name: groupName,
                    gr_description: groupDescription,
                    group_parent: groupParents,
                    company_id: companyId,
                    dep_id: departmentId,
                    emp_id: employeeShare_id,
                    updated_at: new Date().getTime()
                });
            }
        }
        return res.status(200).json({ data: new_GR_KH, message: "update thanh cong" });
    } catch (error) {
        console.error("Failed to edit", error);
        res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
    }




}
exports.delete = async(req, res) => {
    try {
        const listDeleteId = req.body.listDeleteId;
        if (!listDeleteId || !Array.isArray(listDeleteId)) {
            functions.setError(res, "listDeleteId must not leave empty")
        } else {
            await Customer_group.findOneAndUpdate({ _id: { $in: listDeleteId } }, { is_delete: 1 })
                .then(() => functions.success(res, "Group Customer deleted successfully"))
                .catch((err) => functions.setError(res, err.message))
        }
    } catch (error) {
        console.error("Failed to delete", error);
        res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
    }

}

exports.detail_groupKH = async(req, res) => {
    try {
        let id_gr = req.body.id_gr;
        let skip = req.body.skip || 1;
        let limit = req.body.limit || 10;
        if (!isNaN(id_gr)) {
            let list_kh = await Customer.find({ group_id: id_gr }).skip((skip - 1) * limit).limit(limit);
            return res.status(200).json({ data: list_kh, message: "success" });
        } else {
            return res.status(404).json({ message: "bad reqest" });
        }
    } catch (error) {
        console.error("Failed to edit", error);
        res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình xử lý." });
    }
}