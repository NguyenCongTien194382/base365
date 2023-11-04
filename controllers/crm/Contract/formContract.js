const functions = require('../../../services/functions');
const services = require('../../../services/CRM/CRMservice')
const FormContract = require('../../../models/crm/Contract/FormContract')
const DetailFormContract = require('../../../models/crm/Contract/DetailFormContract')

const insert_detail_contact = async(id_contract, array) => {
    let id = 0;
    for (let index = 0; index < array.length; index++) {
        const element = array[index];

        const DetailFormContractMax = await DetailFormContract.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
        if (DetailFormContractMax) id = DetailFormContractMax.id;
        const item = new DetailFormContract({
            id: Number(id) + 1,
            id_form_contract: id_contract,
            new_field: element.new_field,
            old_field: element.old_field,
            index_field: element.index_field,
            default_field: element.default_field,
        });
        await item.save();
    }
}

exports.addContract = async(req, res) => {
    try {
        const user = req.user.data;
        const { filename, path_file, id_file, list_detail } = req.body;
        const now = functions.getTimeNow();
        let FormContractMax = await FormContract.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
        let id = 1;
        if (FormContractMax) {
            id = Number(FormContractMax.id) + 1
        };

        const com_id = user.com_id;
        const ep_id = user.type == 2 ? user.idQLC : 0;

        const formContract = new FormContract({
            id: id,
            name: filename,
            path_file: path_file,
            com_id: com_id,
            ep_id: ep_id,
            id_file: id_file,
            created_at: now,
            updated_at: now,
        });
        await formContract.save(); // chạy đồng bộ

        insert_detail_contact(id, list_detail);
        return services.success(res, "Thành công");
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message)
    }
}

exports.editContract = async(req, res) => {
    try {
        const user = req.user.data;
        const { contract_id, filename, path_file, id_file, list_detail } = req.body;
        const now = functions.getTimeNow();
        let FormContractMax = await FormContract.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
        let id = 1;
        if (FormContractMax) {
            id = Number(FormContractMax.id) + 1
        };

        const com_id = user.com_id;
        const ep_id = user.type == 2 ? user.idQLC : 0;

        await FormContract.updateOne({ id: contract_id }, {
            $set: {
                name: filename,
                path_file: path_file,
                com_id: com_id,
                ep_id: ep_id,
                id_file: id_file,
                updated_at: now,
            }
        });
        await DetailFormContract.deleteMany({ id_form_contract: contract_id });
        insert_detail_contact(id, list_detail);
        return services.success(res, "Thành công");
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message)
    }
}



exports.deleteContract = async(req, res) => {
    try {
        const { _id } = req.body;
        const data = await Contract.findOne({ _id: _id })
        if (!data) {
            functions.setError(res, " hop dong k ton tai ")
        } else {
            const result = await Contract.findOneAndUpdate({ _id: _id }, { $set: { is_delete: 1 } })
            functions.success(res, " xoa thanh cong ", { result })
        }
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message)
    }

}


exports.deleteDetailContract = async(req, res) => {
    try {
        const { _id } = req.body;
        const data = await detailContract.findOne({ id_form_contract: _id })
        if (!data) {
            functions.setError(res, " chi tiet hop dong k ton tai")
        } else {
            const result = await detailContract.deleteOne({ id_form_contract: _id })
            functions.success(res, " xoa thanh cong ", { result })
        }
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message)
    }

}

exports.list = async(req, res) => {
    try {
        const user = req.user.data;

        const list = await FormContract.find({
            com_id: user.com_id,
            is_delete: 0
        }).sort({ id: -1 }).lean();

        return services.success(res, 'Danh sách hợp đồng', { list });

    } catch (error) {
        return functions.setError(res, e.message)
    }
}