const mongoose = require("mongoose");
const model_KiemKe = new mongoose.Schema({
    id_kiemke: {
        type: Number,
        required: true
    },
    id_cty: {
        type: Number
    },
    id_ts: {
        type: {
            ds_ts: {
                type: []
            }
        },
        default: null
    },
    id_ngtao_kk: {
        type: Number
    },
    id_ngduyet_kk: {
        type: Number
    },
    id_ng_kiemke: {
        type: Number
    },
    kk_loai: {
        type: Number
    },
    kk_loai_time: {
        type: Number
    },
    kk_noidung: {
        type: String
    },
    kk_ky: {
        type: Number,
    },
    kk_denngay: {
        type: Number
    },
    kk_donvi: {
        type: Number
    },
    kk_batdau: {
        type: Number
    },
    kk_ketthuc: {
        type: Number
    },
    kk_hoanthanh: {
        type: Number
    },
    kk_ngayduyet: {
        type: Number
    },
    kk_trangthai: {
        type: Number
    },
    kk_tiendo: {
        type: Number
    },
    kk_type_quyen: {
        type: Number
    },
    kk_id_ng_xoa: {
        type: Number
    },
    xoa_kiem_ke: {
        type: Number
    },
    kk_date_create: {
        type: Number
    },
    kk_date_delete: {
        type: Number
    },
    kk_type_quyen_xoa: {
        type: Number,
    },
    kk_type_quyen_duyet: {
        type: Number
    }

},
{
    collection: "QLTS_Kiem_Ke",
    versionKey: false
});
module.exports = mongoose.model("QLTS_Kiem_Ke", model_KiemKe);