const functions = require('../../../services/functions');
const service = require('../../../services/CRM/CRMservice');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const FormContract = require("../../../models/crm/Contract/FormContract");
const DetailFormContract = require("../../../models/crm/Contract/DetailFormContract");

exports.read_file = async(req, res) => {
    try {
        const req_file = req.files;
        const user = req.user.data;
        if (req_file) {
            let data = new FormData();
            data.append('file', fs.createReadStream(req_file.file.path));
            const id_file = `${user.com_id}_${functions.randomNumber}`;
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `http://43.239.223.117:4000/upload_file?sess_id=${id_file}`,
                data: data
            };

            const response = await axios.request(config);
            const result = response.data.data.item;
            return service.success(res, "Đọc file thành công", { id_file, result });

        }
        return service.setError(res, "Chưa tải file");
    } catch (e) {
        console.log(e)
        return service.setError(res, e.message)
    }
}

exports.search = async(req, res) => {
    try {
        const user = req.user.data;
        const input_file = req.body.input_file;
        const text_change = req.body.text_change;

        if (input_file && text_change) {
            let data = new FormData();
            data.append('text_change', text_change);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `http://43.239.223.117:4000/search?sess_id=${user.com_id}&input_file=${input_file}`,
                data: data
            };
            const response = await axios.request(config);
            const result = response.data.data.item;
            return service.success(res, "Tìm kiếm từ trong file thành công", { result });
        }
        return service.setError(res, "Thiếu tham số input_file và text_change");
    } catch (error) {
        return service.setError(res, error.message);
    }
}
exports.replace = async(req, res) => {
    try {

    } catch (error) {
        return service.setError(res, error.message);
    }
};

exports.view = async(req, res) => {
    try {
        const user = req.user.data;
        const { contract_id } = req.body;
        if (contract_id) {
            const formContract = await FormContract.findOne({ id: contract_id }).select("path_file");
            if (formContract) {
                const path = formContract.path_file;
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `http://43.239.223.117:4000/view?sess_id=${user.com_id}&input_file=${path}`,
                };
                const response = await axios.request(config);
                const result = response.data.data.item;
                const get_detail_form_contract = await DetailFormContract.find({ id_form_contract: contract_id }).lean();


                return service.success(res, "Dữ liệu trả về thành công", { result, get_detail_form_contract });
            }
            return service.setError(res, "Hợp đồng không tồn tại");
        }
        return service.setError(res, "Chưa truyền contract_id");
    } catch (error) {
        return service.setError(res, error.message);
    }
}