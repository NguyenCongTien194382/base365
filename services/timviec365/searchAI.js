const axios = require('axios');
const FormData = require('form-data');

exports.searchCandi = async(dataSearch) => {
    const form = new FormData();
    for (const [key, value] of Object.entries(dataSearch)) {
        form.append(key, value);
    }
    let urlAPI = "http://43.239.223.4:9221/search_uv";
    let response = await axios.post(urlAPI, form);
    let dataRes = response.data;
    let data = '';
    if (dataRes.data && dataRes.data.list_id) {
        data = dataRes.data;
    }
    return data;
}
exports.searchCandiTinhThanhNganhNghe = async(dataSearch) => {
    const form = new FormData();
    for (const [key, value] of Object.entries(dataSearch)) {
        form.append(key, value);
    }
    let urlAPI = "http://43.239.223.4:5002/search_ungvien";
    let response = await axios.post(urlAPI, form);
    let dataRes = response.data;
    let data = '';
    if (dataRes.data && dataRes.data.list_id) {
        data = dataRes.data;
    }
    return data;
}

exports.searchNew = async(dataSearch) => {
    const form = new FormData();
    for (const [key, value] of Object.entries(dataSearch)) {
        form.append(key, value);
    }
    let urlAPI = "http://43.239.223.4:5001/search_tin";
    let response = await axios.post(urlAPI, form);
    let dataRes = response.data;
    let data = '';
    if (dataRes.data && dataRes.data.list_id) {
        data = dataRes.data;
    }
    return data;
}