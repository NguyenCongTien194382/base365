const mongoose = require('mongoose');
const axios = require('axios');
const FormData = require('form-data');

let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');
const Tv365PointCompanySchema = new mongoose.Schema({
    usc_id: {
        type: Number,
        required: true,
    },
    point: {
        type: Number,
        default: 0,
    },
    point_usc: {
        type: Number,
        default: 0,
    },
    money_usc: {
        type: Number,
        default: 0,
    },
    point_bao_luu: {
        type: Number,
        default: 0,
    },
    chu_thich_bao_luu: {
        type: String,
        default: null,
    },
    day_reset_point: {
        type: Number,
        default: 0,
    },
    ngay_reset_diem_ve_0: {
        type: Number,
        default: 0,
    },
}, {
    collection: 'Tv365PointCompany',
    versionKey: false,
    timestamp: true
});

const HandleSave = async(obj) => {
    try {
        let data = new FormData();
        data.append("usc_id", obj.usc_id);
        data.append('point', "");
        data.append('point_usc', obj.point_usc || "");
        data.append('day_reset_point', obj.day_reset_point || "");
        data.append('ngay_reset_diem_ve_0', obj.ngay_reset_diem_ve_0 || "");
        data.append('point_bao_luu', obj.point_bao_luu || "");
        data.append('chu_thich_bao_luu', obj.chu_thich_bao_luu || "");
        data.append('table', 'PointCompany');
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://43.239.223.57:9006/add_company',
            data: data
        };

        await axios.request(config);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

}



Tv365PointCompanySchema.pre('save', function(next) {
    next();
    HandleSave(this);
});
Tv365PointCompanySchema.pre('updateOne', function(next) {
    next();
    HandleUpdate(this.getQuery());
});

let PointCompany = connection.model("Tv365PointCompany", Tv365PointCompanySchema);

const HandleUpdate = async(query) => {
    try {
        const point = await PointCompany.findOne(query);
        // if (point) {
        //     let data = new FormData();
        //     data.append("usc_id", point.usc_id);
        //     data.append('point', "");
        //     data.append('point_usc', point.point_usc || "");
        //     data.append('day_reset_point', point.day_reset_point || "");
        //     data.append('ngay_reset_diem_ve_0', point.ngay_reset_diem_ve_0 || "");
        //     data.append('point_bao_luu', point.point_bao_luu || "");
        //     data.append('chu_thich_bao_luu', point.chu_thich_bao_luu || "");
        //     data.append('table', 'PointCompany');
        //     let config = {
        //         method: 'post',
        //         maxBodyLength: Infinity,
        //         url: 'http://43.239.223.57:9006/add_company',
        //         data: data
        //     };

        //     await axios.request(config);
        //     return true;
        // }
    } catch (error) {
        console.log(error);
        return false;
    }
}
module.exports = PointCompany;