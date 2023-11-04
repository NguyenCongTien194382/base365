const mongoose = require('mongoose');
const nguoiDuyetVanBan = new mongoose.Schema({
    _id: {
        type: Number
    },
    id_vb_duyet: {
        type: Number
    },
    id_user_duyet: {
        type: Number
    },
    time_duyet: {
        type: Number
    }
});
module.exports = mongoose.model("Vanthu_user_duyet_vb", nguoiDuyetVanBan);