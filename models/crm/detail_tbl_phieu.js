const mongoose = require("mongoose");
const detail_tbl_phieu = new mongoose.Schema({
    id: {
        type: Number
    },
    id_phieu: {
        type: Number
    },
    pay_option: {
        type: Number
    },
    price: {
        type: Number
    },
    id_fundbook: {
        type: Number
    },
    created_at: {
        type: Number
    },
    updated_at: {
        type: Number
    }
}, {
    collection: "CRM_detail_tbl_phieu",
});
module.exports = mongoose.model("CRM_detail_tbl_phieu", detail_tbl_phieu);