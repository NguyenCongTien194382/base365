const mongoose = require('mongoose');
const Schema = mongoose.Schema
const OrderSchema = new mongoose.Schema({
    _id: {
        //id đơn hàng
        type: Number,
        required: true,
    },
    sellerId: {
        //id người bán hàng
        type: Number,
        default: 0,
    },
    buyerId: {
        //id người mua hàng
        type: Number,
        default: 0,
    },
    name: {
        // tên người mua
        type:String
    },
    phone: {
        // số điện thoại liên hệ
        type:String
    },
    paymentMethod: {
        //phương thức thanh toán
        type: Number,
        default: 0
    },
    deliveryAddress: {
        //địa chỉ nhận hàng
        type: String,
        default: null
    },
    newId: {
        //id tin đăng bán
        type: Number,
        default: 0,
    },
    codeOrder: {
        //mã đơn hàng
        type: Number,
        default: 0
    },
    quantity: {
        //số lượng đặt mua
        type: Number,
        default: 0,
    },
    classify: {
        //phân loại sản phẩm mua
        type: String,
        default: null
    },
    unitPrice: {
        //đơn giá
        type: Number,
        default: 0
    },
    promotionType: {
        //loại khuyến mãi
        type: Number,
        default: 0
    },
    promotionValue: {
        //giá trị khuyến mãi
        type: Number,
        default: 0
    },
    shipType: {
        //loại vận chuyển
        type: Number,
        default: 0
    },
    shipFee: {
        //phí vận chuyển
        type: Number,
        default: 0
    },
    createdAt:{
        type: Date,
        default: new Date(Date.now())
    },
    note: {
        //ghi chú cho người bán
        type: String,
        default: null
    },
    paymentType: {
        //loại thanh toán, 1:thanh toán toàn bộ, 2: đặt cọc
        type: Number,
        default: 0
    },
    bankName: {
        //tên ngân hàng
        type: String,
        default: null
    },
    amountPaid: {
        //số tiền đã thanh toán
        type: Number,
        default: 0
    },
    totalProductCost: {
        //tổng tiền sản phẩm
        type: Number,
        default: 0
    },
    buyTime: {
        //thời gian người mua xác nhận mua đơn hàng
        type: Date,
        default: new Date()
    },
    status: {
       // 0: chờ xác nhận, 1: đang xử lý, 2:đang giao, 3: đã giao, 4: giao hàng thành công, 5: hủy đơn hàng 6 : đang ứng tuyển 
        type: Number,
        default: 0
    },
    sellerConfirmTime: {
        //thời gian người bán xác nhận bán hàng:
        type: Date,
    },
    deliveryStartTime: {
        //thời gian bắt đầu giao hàng
        type: Date
    },
    totalDeliveryTime: {
        //thời gian kết thúc giao hàng
        type: String,
        default: null
    },
    buyerConfirm: {
        //người mua xác nhận đã được giao hàng
        type: Number,
        default: 0
    },
    buyerConfirmTime: {
        //thời gian người mua xác nhận đơn hàng
        type: Date
    },
    deliveryEndTime: {
        //thời gian giao hàng hoàn tất
        type: Date
    },
    deliveryFailedTime: {
        //thời gian giao hàng thất bại
        type: Date
    },
    deliveryFailureReason: {
        //lí do giao hàng thất bại
        type: String,
        default: null
    },
    cancelerId: {
        //id người hủy đơn hàng
        type: Number,
        default: 0
    },
    orderCancellationTime: {
        //thời gian hủy đơn hàng
        type: Date
    },
    orderCancellationReason: {
        //lí do hủy đơn hàng
        type: String,
        default: null
    },
    buyerCancelsDelivered: {
        //người mua hủy đơn hàng đã giao
        type: Number,
        default: 0
    },
    buyerCancelsDeliveredTime: {
        //thời gian người mua hủy đơn hàng đã giao
        type: Date,
    },
    orderActive: {
        //1: admin xác nhận đã nhận được tiền chuyển khoản
        type: Number,
        default: 0
    },
    distinguish: {
        //phân biêt: 0 là mua 1 sản phẩm, khác 0 là mua nhiều sản phẩm
        type: Number,
        default: 0
    }

}, {
    collection: 'RN365_Order',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_Order", OrderSchema);