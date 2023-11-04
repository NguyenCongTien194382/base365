const mongoose = require('mongoose');
const CreditsHistorySchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    usc_id: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    },
    /**
     * Loại lịch sử:
     * - 0: Sử dụng (-)
     * - 1: Nạp tiền (+)
     * - 2: Đổi từ điểm uy tín
     */
    type: {
        type: Number,
        default: 0
    },
    used_day: {
        type: Number,
        default: 0
    },
    //ID của admin nạp tiền
    admin_id: {
        type: Number,
        default: -1
    },
    ip_user: {
        type: String,
        default: null
    },
    content: {
        type: String,
        default: null
    },
    balance: {
        type: Number,
        default: 0
    },
    /**
     * 0: Nạp tiền
     * 1: Xem ứng viên
     * 2: Làm mới tin
     * 3: Ghim tin
     * 4: Cộng tiền đổi điểm uy tín
     * 5: Cộng tiền thưởng sau mua hàng
     * 6: Trừ tiền khi sử dụng điểm khuyến mãi mua hàng
     */
    action: {
        type: Number,
        default: -1
    },
    content_id: {
        type: Number,
        default: 0
    },
    refund: {
        type: Number,
        default: 0
    }
}, {
    collection: "Tv365CreditsHistory"
})
module.exports = mongoose.model("Tv365CreditsHistory", CreditsHistorySchema);