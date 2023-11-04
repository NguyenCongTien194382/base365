const functions = require('../../../services/CRM/CRMservice')
const crm_contract = require('../../../models/crm/Customer/contract')
const FormContract = require('../../../models/crm/Contract/FormContract')
const DetailFormContract = require('../../../models/crm/Contract/DetailFormContract')

exports.showContract = async(req, res) => {
    try {
        const { id_customer } = req.body;
        let com_id = '';
        if ((id_customer) == undefined) {
            functions.setError(res, "thieu thong tin")
        } else {
            if (req.user.data.type == 1) {
                com_id = req.user.data.com_id
                let data = await crm_contract.find({ id_customer: id_customer, com_id: com_id }, { id_form_contract: 1, user_created: 1, status: 1, created_at: 1 })
                if (data == undefined) {
                    return functions.setError(res, "khong có hợp đồng nào từng được tạo cho khách hàng này")

                }
                return functions.success(res, "lay thanh cong ", { data })
            }
            if (req.user.data.type == 2) {
                com_id = req.user.data.com_id
                let data = await crm_contract.find({ id_customer: id_customer, com_id: com_id }, { id_form_contract: 1, user_created: 1, status: 1, created_at: 1 })
                if (data == undefined) {
                    return functions.setError(res, "khong có hợp đồng nào từng được tạo cho khách hàng này")

                }
                return functions.success(res, "lay thanh cong ", { data })
            } else {
                return res.status(400).json({ error: 'Bạn không đủ quyền' })
            }

        }
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message)
    }
}

exports.showDetailContract = async(req, res) => {
    try {
        const com_id = req.user.data.com_id
        const idQLC = req.user.data.idQLC

        const { _id, id_customer, status, id_form_contract, path_dowload, is_delete } = req.body;
        let list = [];
        let ContractForCustumer = [];
        if (!com_id && !id_customer) {
            return functions.setError(res, "thieu thong tin")
        } else {
            const data = await DetailFormContract.find({ id_form_contract: _id })
            if (!data) {
                return functions.setError(res, "khong có hợp đong")
            } else {

                list = await FormContract.aggregate([{
                            $match: { id_form_contract: _id }
                        },
                        {
                            $lookup: {
                                from: "detailformcontracts",
                                localField: "_id",
                                foreignField: "id_form_contract",
                                as: "detailContracts"
                            }
                        }
                    ]) //$match sẽ lọc các bản ghi có id_form_contract bằng _id. Sau đó, $lookup sẽ join với collection DetailFormContract để lấy các bản ghi có id_form_contract bằng _id. Kết quả sẽ được trả về dưới dạng một mảng các object, mỗi object tương ứng với một bản ghi trong collection FormContract, và có thêm một trường detailContracts chứa các bản ghi trong collection DetailFormContract tương ứng. 
                if (!list) {
                    return functions.setError(res, "khong có hợp đong", 404)
                }
                // functions.success(res,"lay thanh cong", {list})
            }
        }
        let maxID1 = await functions.getMaxID(crm_contract);
        if (!maxID1) {
            maxID1 = 0
        };
        const _id1 = Number(maxID1) + 1;
        ContractForCustumer = new crm_contract({
            _id: _id1 || 1,
            id_customer: id_customer,
            user_created: idQLC,
            id_form_contract: id_form_contract,
            status: status,
            path_dowload: path_dowload,
            created_at: new Date(),
            is_delete: 0

        });
        await ContractForCustumer.save()
        return functions.success(res, "tao thanh cong", { list, ContractForCustumer })
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message)
    }
}

exports.deleteContract = async(req, res) => {
    try {
        const { _id, id_customer } = req.body;

        const data = await crm_contract.findOne({ _id: _id, id_customer: id_customer })
        if (!data) {
            functions.setError(res, " hop dong k ton tai ")
        } else {
            const result = await crm_contract.findOneAndUpdate({ _id: _id, id_customer: id_customer }, { $set: { is_delete: 1 } })
            functions.success(res, " xoa thanh cong ", { result })
        }
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message)
    }

}