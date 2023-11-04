const mongoose = require("mongoose");
const model_NhacNho = new mongoose.Schema({
    id_nhac_nho :{
        type : Number,
        unique: true
    },
    id_cty:{
        type : Number
    },
    id_ts_nhac_nho:{
        type : Number
    },
    id_quy_dinh_bd:{
        type : Number
    },
    tan_suat:{
        type : Number
    },
    so_ngay_lap_lai:{
        type : Number
    },
    thoigian_or_congsuat:{
        type : Number
    },
    congsuat_hientai:{
        type : Number
    },
    cong_suat_nhac_nho:{
        type : Number
    },
    xem_or_chuaxem:{
        type : Number
    },
    ngay_nhac_nho:{
        type : Number
    },
    bd_lap_lai_theo:{
        type : Number
    }
    

},
{
    collection: "QLTS_Nhac_Nho",
    versionKey : false
});

module.exports = mongoose.model("QLTS_Nhac_Nho",model_NhacNho);