const mongoose = require('mongoose');
const QLTS_Cap_Phat = new mongoose.Schema({
    cp_id: {
        type: Number,
        require: true,
        unique: true
    },
    cap_phat_taisan: {
        ds_ts: {
            type: [
              {
                ts_id: {
                  type: Number
                },
                sl_cp: {
                  type: Number
                }
            }
            ]
        }
    },
    id_cty: {
        type: Number,
    },
    id_nhanvien: {
        type: Number,
        default: 0,
    },
    id_phongban: {
        type: Number,
        default: 0,
    },
    id_ng_daidien: {
        type: Number
    },
    id_ng_thuchien: {
        type: Number
    },
    ts_daidien_nhan: {
        type: String
    },
    cp_ngay: {
        type: Number
    },
    cp_hoanthanh: {
        type: Number
    },
    //1:xác nhận bàn giao;2: từ chối bàn giao;4: từ chối tiếp nhận;5:hoàn thành;6 tieeps nhận
    cp_trangthai: {
        type: Number
    },
    loai_capphat: {
        type: Number
    },
    cp_vitri_sudung: {
        type: String
    },
    cp_lydo: {
        type: String
    },
    cp_type_quyen: {
        type: Number
    },
    cp_da_xoa:{
        type: Number,
        default : 0 
    },
    cp_id_ng_tao: {
        type: Number
    },
    cp_id_ng_xoa: {
        type: Number
    },
    cp_da_xoa: {
        type: Number,
        default : 0
    },
    cp_date_create: {
        type: Number
    },
    cp_date_delete: {
        type: Number
    },
    cp_type_quyen_xoa: {
        type: Number
    },
    cp_tu_choi_ban_giao: {
        type: String
    },
    cp_tu_choi_tiep_nhan: {
        type: String
    }

},
    {
        collection: "QLTS_Cap_Phat",
        versionKey: false
    })
module.exports = mongoose.model("QLTS_Cap_Phat", QLTS_Cap_Phat);