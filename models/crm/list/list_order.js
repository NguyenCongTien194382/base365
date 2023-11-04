
const mongoose = require('mongoose');
const list_order = new mongoose.Schema({
    id: {
        type: Number
    },
    comp_id: {
        type: Number
    },
    id_customer: {
        type: Number
    },
    emp_id: {
        type: Number
    },
    order_date: {
        Type: Number
    },
    quote_id: {
        type: Number
    },
    chance_id: {
        type: Number
    },
    campaign_id: {
        type: Number
    },
    explanation: {
        type: String
    },
    category_order: {
        type: Number,
    },
    number_of_days_owed: {
        type: Number
    },
    delivery_term: {
        type: Number
    },
    payment_expires_date: {
        type: Number
    },
    discount: {
        type: String
    },
    percent_discount: {
        type: Number
    },
    discount_type: {
        type: Number
    },
    is_delete: {
        type: Number,
    },
    status: {
        type: Number
    },
    delivery_status: {
        type: Number
    },
    actual_amount_earned: {
        type: Number
    },
    order_fulfillment_costs: {
        type: Number
    },
    status_pay: {
        type: Number
    },
    invoicing: {
        type: Number
    },
    contact_user_id: {
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
        type: String,
        default: null
    },
    area_code_bill: {
        type: String,
        default: null
    },
    address_in_bill: {
        type: String,
        default: null
    },
    email_receive: {
        type: String,
        default: null
    },
    receive_user: {
        type: Number
    },
    phone: {
        type: Number,
        default: null
    },
    receive_country: {
        type: Number
    },
    receive_city: {
        type: Number
    },
    receive_district: {
        type: Number
    },
    receive_ward: {
        type: Number
    },
    receive_address: {
        type: String,
        default: null
    },
    receive_area_code: {
        type: String,
        default: null
    },
    address_delivery: {
        type: String,
        default: null
    },
    description: {
        type: String,
    },
    sum: {
        type: Number
    },
    share_all: {
        type: Number
    },
    created_date: {
        type: Number

    },
    type: {
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
    collection: "CRM_list_order"
});
module.exports = mongoose.model("CRM_list_order", list_order);