const mongoose = require("mongoose");
const return_product = new mongoose.Schema({
    id: {
        type: Number
    },
    comp_id: {
        type: Number
    },
    customer_id: {
        type: Number
    },
    emp_id: {
        type: Number
    },
    contact_customer_id: {
        type: Number
    },
    user_name: {
        type: String
    },
    user_phone: {
        type: String
    },
    order_id: {
        type: Number
    },
    explanation: {
        type: String
    },
    status: {
        type: Number
    },
    status_action: {
        type: Number
    },
    country_bill: {
        type: Number
    },
    city_bill: {
        type: Number
    },
    district_bill: {
        type: Number
    },
    ward_bill: {
        type: Number
    },
    address_bill: {
        type: String
    },
    area_code_bill: {
        type: String
    },
    address_in_bill: {
        type: String
    },
    suggested_date: {
        type: Number
    },
    sum: {
        type: Number
    },
    description: {
        type: String
    },
    is_delete: {
        type: Number
    },
    active_by_warehouse: {
        type: Number
    },
    created_at: {
        type: Number
    },
    updated_at: {
        type: Number
    }
}, {
    collection: "CRM_return_product"
});
module.exports = mongoose.model("CRM_return_product", return_product);