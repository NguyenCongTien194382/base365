const mongoose = require('mongoose');
const tbl_qlcv_role = mongoose.Schema({
    _id: { type: Number },
    ro_user_id: { type: Number },
    ro_usc_id: { type: Number },
    ro_list_vb: { type: String, max: 255 },
    ro_list_hd: { type: String, max: 255 },
    ro_seach_vb: { type: String, max: 255 },
    ro_lsu_vb: { type: String, max: 255 },
    ro_thongke_vb: { type: String, max: 255 },
    ro_dele_vb: { type: String, max: 255 },

});

module.exports = mongoose.model("Vanthu_qlcv_role", tbl_qlcv_role);