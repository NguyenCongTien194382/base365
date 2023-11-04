const mongoose = require("mongoose");
const model_ThuHoi = new mongoose.Schema({
    thuhoi_id: {
        type: Number,
        require: true,
        unique: true
    },
    thuhoi_ng_tao: {
        type: Number
    },
    th_type_quyen: {
        type: Number
    },
    thuhoi_taisan: {
        ds_thuhoi: {
          type: [
            {
              ts_id: {
                type: Number
              },
              sl_th: {
                type: Number
              }
            }
          ]
        }
    },
    id_cty: {
        type: Number
    },
    id_ng_thuhoi: {
        type: Number
    },
    id_ng_dc_thuhoi: {
        type: Number
    },
    id_pb_thuhoi: {
        type: Number
    },
    th_dai_dien_pb: {
        tpye: Number
    },
    thuhoi_ngay: {
        type: Number
    },
    thuhoi_hoanthanh: {
        type: Number
    },
    thuhoi_soluong: {
        type: Number
    },
    type_thuhoi: {//0: thu hồi 1 ts; 1: thu hồi nhiều tài sản',
        type: Number,
        default : 0
    },
    thuhoi_trangthai: {//1: đồng ý thu hồi, 2: từ chối thu hồi,3:nhận bàn giao;4: từ chối bàn giao, 5: đồng ý nhận thu hồi; 6 từ chối nhận ts thu hồi',
        type: Number
    },
    thuhoi__lydo: {
        type: String
    },
    loai_thuhoi: {//0: thu hồi nv; 1: thu hồi pb'
        type: Number
    },
    thuhoi_type_quyen: {
        type: String
    },
    thuhoi_id_ng_xoa: {
        type: Number
    },
    xoa_thuhoi: {
        type: Number,
        default : 0 
    },
    thuhoi_date_create: {
        type: Number
    },
    thuhoi_date_delete: {
        type: Number
    },
    th_ly_do_tu_choi_ban_giao: {
        type: String
    },
    th_ly_do_tu_choi_nhan: {
        type: String
    },
    th_ly_do_tu_choi_thuhoi: {
        type: String
    }
},
    {
        collection: "QLTS_ThuHoi",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_ThuHoi", model_ThuHoi);