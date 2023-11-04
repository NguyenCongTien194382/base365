const mongoose = require('mongoose');
const TV365SaveExchangePointMoneySchema = new mongoose.Schema(
    {
        id:{
            type: Number,
            default: 0,
        },
        userId:{
            type: Number,
            default: 0,
        },
        userType:{
            type: Number,
            default: 0,
        },
        //'điểm đổi',
        point:{
            type: Number,
            default: 0,
        },
        //'số tiền tương ứng(VND)',
        money:{
            type: Number,
            default: 0,
        },
        //'số điểm còn lại',
        point_later:{
            type: Number,
            default: 0,
        },
        //'0: chưa dùng tiền mua hàng, 1: đã dùng mua hàng',
        is_used:{
            type: Number,
            default: 0,
        },
        time:{
            type: Number,
            default: 0,
        }
    },
    {
        collection: "TV365SaveExchangePointMoney"
    })
module.exports = mongoose.model("TV365SaveExchangePointMoney", TV365SaveExchangePointMoneySchema);