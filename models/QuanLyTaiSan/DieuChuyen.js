const mongoose = require("mongoose");
const { isNullOrUndefined } = require("util");
const model_Dieuchuyen = new mongoose.Schema({
    dc_id: {
        type: Number,
        require: true,
        unique: true
    },
    id_cty: {
        type: Number,
        require: true
    },
    dieuchuyen_taisan: {
        ds_dc: {
            type: [
                {
                    ts_id: {
                        type: Number
                    },
                    sl_ts: {
                        type: Number
                    }
                }
            ]
        }
    },
    taisan_thucnhan: {
        type: String,
        default: null
    },
    id_ng_thuchien: {

        type: Number,
        default: 0,
    },
    id_cty_dang_sd: {
        type: Number,
        default: 0
    },
    id_pb_dang_sd: {
        type: Number,
        default: 0
    },
    id_daidien_dangsd: {
        type: Number,
        default: 0,
    },
    id_nv_dangsudung: {
        type: Number,
        default: 0,
    },
    id_cty_nhan: {
        type: Number,
        default: 0
    },
    id_nv_nhan: {
        type: Number,
        default: 0
    },
    id_pb_nhan: {
        type: Number,
        default: 0
    },
    id_daidien_nhan: {
        type: Number,
        default: 0,
    },
    dc_ngay: {
        type: Number,
        default: 0
    },
    dc_hoan_thanh: {
        type: Number,
        default: 0
    },
    dc_trangthai: {
        type: Number,
        default: 0,
    },
    dc_tu: {
        type: String,
        default: null
    },
    dc_den: {
        type: String,
        default: null
    },
    dc_lydo: {
        type: String,
        default: null
    },
    dc_lydo_tuchoi: {
        type: String,
        default: null
    },
    dc_lydo_tuchoi_tiepnhan: {
        type: String,
        default: null
    },
    dc_ghichu_tiepnhan: {
        type: String,
        default: null
    },
    vi_tri_dc_tu: {
        type: Number,
        default: null
    },
    dc_vitri_tsnhan: {
        type: Number,
        default: null
    },
    vitri_ts_daidien: {
        type: Number,
        //  default: isNullOrUndefined,
        default: 0
    },
    dc_type_quyen: {
        type: Number,
        default: 0
    },
    dc_type: {
        type: Number,
        default: 0,
    },
    id_ng_xoa_dc: {
        type: Number,
        default: 0
    },
    id_ng_tao_dc: {
        type: Number,
        default: 0
    },
    xoa_dieuchuyen: {
        type: Number,
        default: 0,
    },
    dc_date_delete: {
        type: Number,
        default: 0
    },
    dc_date_create: {
        type: Number,
        default: 0
    },
    dc_type_quyen_xoa: {
        type: Number,
        default: 0,
    }
}, {
    collection: "QLTS_Dieu_Chuyen",
    versionKey: false
}
);
module.exports = mongoose.model("QLTS_Dieu_Chuyen", model_Dieuchuyen);