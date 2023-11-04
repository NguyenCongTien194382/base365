const mongoose = require('mongoose');
const Tv365OrderDetailsSchema = new mongoose.Schema({
    id:  {
    type: Number,
    default: 0
    },
    //mã đơn hàng
    order_id:  {
    type: Number,
    default: 0
    },
    //id sản phẩm
    product_id:  {
    type: Number,
    default: 0
    },
    //loại sản phẩm
    product_type:  {
    type: Number,
    default: 0
    },
    //giá gốc sp
    price:  {
    type: String,
    default: null
    },
    //phần trăm chiết khấu
    chiet_khau:  {
    type: String,
    default: null
    },
    //giá sp sau khi chiết khấu
    price_chiet_khau:  {
    type: String,
    default: null
    },
    //id tin tuyển dụng
    new_id:  {
    type: Number,
    default: 0
    },
    //số lượng sp
    count_product:  {
    type: Number,
    default: 0
    },
    //1: đơn hàng có gói dịch vụ chưa đc sử dụng(dành cho gói ghim tin sau)
    use_product: {
    type: Number,
    default: 0
    },
    date_start:  {
        type: Number,
        default: 0
    },
    created_at:  {
        type: Number,
        default: 0
    },
}, {
    collection: 'Tv365OrderDetails',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365OrderDetails", Tv365OrderDetailsSchema);