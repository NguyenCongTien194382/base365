const mongoose = require("mongoose");
const promotion_product = new mongoose.Schema({
    id: {
        type: Number
    },
    promotion_id: {
        type: Number
    },
    product_id: {
        type: String
    },
    buy_product_type: {
        type: Number
    },
    quantity: {
        type: String
    },
    price_endow: {
        type: Number
    },
    price_endow_max: {
        type: Number
    },
    percent_endow: {
        type: Number
    },
    bonus_product_type: {
        type: Number
    },
    bonus_product_list: {
        type: String,
        default: null
    },
    bonus_product_quantity: {
        type: String,
        default: null
    },
    bonus_product_max: {
        type: Number
    },
    min_money: {
        type: Number
    },
    is_delete: {
        type: Number
    }
}, {
    collection: "CRM_promotion_product"
});
module.exports = mongoose.model("CRM_promotion_product", promotion_product);