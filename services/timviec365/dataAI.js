const axios = require('axios');
const functions = require('../functions');
exports.call = async(data, url) => {
    let response = await axios({
        method: 'post',
        url: url,
        data: data,
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response
}
exports.createDataSearchCandi = async(data) => {
    try {
        data.site = "uvtimviec365_5";
        let url = "http://43.239.223.4:5002/create_data_ungvien",
            res = await this.call(data, url);
        url = "http://43.239.223.21:5002/create_data_ungvien",
            this.call(data, url);
        return res;
    } catch (e) {
        return false;
    }
}
exports.updateDataSearchCandi = async(data) => {
    try {
        data.site = "uvtimviec365_5";
        let url = "http://43.239.223.4:5002/update_data_ungvien";
        let res = await this.call(data, url);
        url = "http://43.239.223.21:5002/update_data_ungvien";
        this.call(data, url);
        // if (res.data.data == null) {
        //     console.log(data);
        // }
        return res;
    } catch (e) {
        return false;
    }
}
exports.updateDataSearchCandi2 = async(data) => {
    try {
        data.site = "uvtimviec365_5";
        let url = "http://43.239.223.21:5012/update_data_ungvien";
        let res = await this.call(data, url);
        url = "http://43.239.223.4:5002/update_data_ungvien";
        res = await this.call(data, url);
        return res;
    } catch (e) {
        return false;
    }
}
exports.updateDataSearchCandiCV = async(data) => {
    try {
        data.site = "uvtimviec365_5";
        let url = "http://43.239.223.4:5002/update_data_ungvien";
        let res = await this.call(data, url);
        return res;
    } catch (e) {
        return false;
    }
}
exports.addNew = async(new_id, new_title, new_addr, new_city, new_cap_bac, new_money, new_hinh_thuc, new_cat_id, new_lv, new_exp, new_user_id, new_han_nop, new_mota, new_yeucau, new_quyenloi, new_ho_so, new_ghim, new_qh_id, new_bang_cap, new_gioi_tinh, new_money_min = 0, new_money_max = 0, new_money_unit = 0, new_money_type = 0, usc_company = '', new_hot = 0, new_gap = 0, new_cao = 0) => {
    new_money_min = new_money_min ? new_money_min : 0;
    new_money_max = new_money_max ? new_money_max : 0;
    new_money_unit = new_money_unit ? new_money_unit : 0;
    new_money_type = new_money_type ? new_money_type : 0;
    data = {
        new_id: new_id,
        new_title: new_title,
        new_addr: new_addr,
        new_city: new_city,
        new_cap_bac: new_cap_bac,
        new_money: new_money,
        new_hinh_thuc: new_hinh_thuc,
        new_cat_id: new_cat_id,
        new_lv: new_lv,
        new_exp: new_exp,
        usc_id: new_user_id,
        new_create_time: functions.getTimeNow(),
        new_han_nop: new_han_nop,
        new_mota: new_mota,
        new_yeucau: new_yeucau,
        new_quyenloi: new_quyenloi,
        new_ho_so: new_ho_so,
        new_update_time: functions.getTimeNow(),
        new_ghim: new_ghim,
        site: 'timviec365',
        new_qh_id: new_qh_id,
        new_bang_cap: new_bang_cap,
        new_gioi_tinh: new_gioi_tinh,
        nm_min_value: new_money_min,
        nm_max_value: new_money_max,
        nm_unit: new_money_unit,
        nm_type: new_money_type,
        usc_company: usc_company,
        new_hot: new_hot,
        new_gap: new_gap,
        new_cao: new_cao,
    };
    let url = "http://43.239.223.4:5902/new_tin";
    let res = await this.call(data, url);

    url = "http://43.239.223.21:5006/new_tin";
    this.call(data, url);
    return res;
}

exports.updateNew = async(new_id, data = {}) => {
    // Cập nhật thông tin tin đăng
    arr_data = {
        new_id: new_id,
        new_update_time: functions.getTimeNow(),
        site: 'timviec365'
    };
    if (data.new_title) {
        arr_data.new_title = data.new_title;
    }
    if (data.new_addr) {
        arr_data.new_addr = data.new_addr;
    }
    if (data.new_city) {
        arr_data.new_city = data.new_city;
    }
    if (data.new_cap_bac) {
        arr_data.new_cap_bac = data.new_cap_bac;
    }
    if (data.new_money) {
        arr_data.new_money = data.new_money;
    }
    if (data.new_hinh_thuc) {
        arr_data.new_hinh_thuc = data.new_hinh_thuc;
    }
    if (data.new_cat_id) {
        arr_data.new_cat_id = data.new_cat_id;
    }
    if (data.new_lv) {
        arr_data.new_lv = data.new_lv;
    }
    if (data.new_exp) {
        arr_data.new_exp = data.new_exp;
    }
    if (data.new_han_nop) {
        arr_data.new_han_nop = data.new_han_nop;
    }
    if (data.new_mota) {
        arr_data.new_mota = data.new_mota;
    }
    if (data.new_yeucau) {
        arr_data.new_yeucau = data.new_yeucau;
    }
    if (data.new_quyenloi) {
        arr_data.new_quyenloi = data.new_quyenloi;
    }
    if (data.new_ho_so) {
        arr_data.new_ho_so = data.new_ho_so;
    }
    if (data.new_ghim) {
        arr_data.new_ghim = data.new_ghim;
    }
    if (data.new_gioi_tinh) {
        arr_data.new_gioi_tinh = data.new_gioi_tinh;
    }
    if (data.new_bang_cap) {
        arr_data.new_bang_cap = data.new_bang_cap;
    }
    if (data.new_qh_id) {
        arr_data.new_qh_id = data.new_qh_id;
    }
    if (data.nm_min_value) {
        arr_data.nm_min_value = data.nm_min_value;
    }
    if (data.nm_max_value) {
        arr_data.nm_max_value = data.nm_max_value;
    }
    if (data.nm_unit) {
        arr_data.nm_unit = data.nm_unit;
    }
    if (data.nm_type) {
        arr_data.nm_type = data.nm_type;
    }
    if (data.new_hot) {
        arr_data.new_hot = data.new_hot;
    }

    if (data.new_gap) {
        arr_data.new_gap = data.new_gap;
    }

    if (data.new_cao) {
        arr_data.new_cao = data.new_cao;
    }

    if (data.new_ghim) {
        arr_data.new_ghim = data.new_ghim;
    }
    let url = "http://43.239.223.4:5001/update_tin";
    let res = await this.call(arr_data, url);
    return res;
}