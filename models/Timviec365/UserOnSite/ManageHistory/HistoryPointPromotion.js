

const mongoose = require('mongoose');
const TV365HistoryPointPromotionSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            default: 0,
        },
        userId: {
            type: Number,
            default: 0,
        },
        userType: {
            type: Number,
            default: 0,
        },
        // 'id đơn hàng'
        order_id: {
            type: Number,
            default: 0,
        }, 
        // 'số điểm đổi'
        point: {
            type: Number,
            default: 0,
        }, 
        time: {
            type: Number,
            default: 0,
        },
    },
    {
        collection: "TV365HistoryPointPromotion"
    })
module.exports = mongoose.model("TV365HistoryPointPromotion", TV365HistoryPointPromotionSchema);