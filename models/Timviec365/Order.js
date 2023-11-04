const mongoose = require('mongoose');
const Tv365OrderSchema = new mongoose.Schema({

    id: {
        type: Number,
        default: 0
    },
    //mã đơn hàng
    code_order: {
        type: String,
        default: null
    },
    //id chuyên viên chăm sóc
    admin_id: {
        type: Number,
        default: 0
    },
    //id Khách hàng
    id_user: {
        type: Number,
        default: 0
    },
    //0: UV, 1:NTD
    type_user: {
        type: Number,
        default: 0
    },
    //tên khách hàng
    name: {
        type: String,
        default: null
    },
    //số điện thoại KH
    phone: {
        type: String,
        default: null
    },
    //email khách hàng
    email: {
        type: String,
        default: null
    },
    //tổng số lượng các sản phẩm đơn hàng
    count: {
        type: Number,
        default: 0
    },
    //giá tổng tiền gốc các sp 
    price: {
        type: Number,
        default: 0
    },
    //tổng chiết khấu các sản phẩm
    chiet_khau: {
        type: Number,
        default: 0
    },
    //khuyến mãi vip
    discount_vip: {
        type: Number,
        default: 0
    },
    //tiền khuyến mại
    discount_fee: {
        type: Number,
        default: 0
    },
    //'phí VAT. ( %)
    vat_fee: {
        type: Number,
        default: 0
    },
    //tổng số tiền cuối cùng các sp trong đơn hàng
    final_price: {
        type: Number,
        default: 0
    },
    //trạng thái đơn hàng (0: đơn chờ duyệt, 1: đơn đang hoạt động, 2: đơn hoàn thành, 3: đơn hết hạn, 4: đơn bị hủy)
    status: {
        type: Number,
        default: 0
    },
    //0: chưa gửi tổng đài, 1: tổng đài đã nhận và đag chờ duyệt, 2: tổng đài đã duyệt, 3 tổng đài từ chối
    admin_accept: {
        type: Number,
        default: 0
    },
    //thời gian chuyên viên duyệt đơn hàng
    accept_time_1: {
        type: Number,
        default: 0
    },
    //tiền thực chuyên viên nhận
    money_received: {
        type: Number,
        default: 0
    },
    //số tiền mặt hoàn khi mua hàng
    money_bonus: {
        type: Number,
        default: 0
    },
    //tiền thực nhận
    money_real_received: {
        type: Number,
        default: 0
    },
    //thời gian tổng đài duyệt đơn hàng
    accept_time_2: {
        type: Number,
        default: 0
    },
    //link pdf hóa đơn
    bill_pdf: {
        type: String,
        default: null
    },
    //1: dịch vụ chưa đc sử dụng(dành cho ghim tin sau)
    use_order: {
        type: Number,
        default: 0
    },
    hide_admin: {
        type: Number,
        default: 0
    },
    //thời gian khởi tạo
    create_time: {
        type: Number,
        default: 0
    },
    name_bank: {
        type: String,
        default: null
    },
    account_bank: {
        type: String,
        default: null
    },
    account_holder: {
        type: String,
        default: null
    },
    content_bank: {
        type: String,
        default: null
    },
    admin_note: {
        type: String,
        default: null
    },
    automatic: {
        type: Number,
        default: 0
    }
}, {
    collection: 'Tv365Order',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365Order", Tv365OrderSchema);