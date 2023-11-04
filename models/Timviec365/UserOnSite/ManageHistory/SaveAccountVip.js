const mongoose = require('mongoose');
const TV365SaveAccountVIPSchema = new mongoose.Schema(
    {

        id: {
            type: Number,
            default: 0,
        },
        userId: {
            type: Number,
            default: 0,
        },
        //0: ứng viên, 1: ntd
        userType: {
            type: Number,
            default: 0,
        },
        //loại tài khoản vip
        type_vip: {
            type: Number,
            default: 0,
        },
        //thời gian nâng cấ
        time: {
            type: Number,
            default: 0,
        },
    },
    {
        collection: "TV365SaveAccountVIP"
    })
module.exports = mongoose.model("TV365SaveAccountVIP", TV365SaveAccountVIPSchema);