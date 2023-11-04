const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_customer = new Schema({
    cus_id: { //id khách hàng
        type: Number,
        require: true
    },
    email: { // email khách hàng
        type: String,
        default: null
    },
    phone_number: { //sdt khách hàng
        type: String,
        default: null
    },
    name: { // tên khách hàng
        type: String,
        default: null
    },
    stand_name: { // tên viết tắt
        type: String,
        default: null
    },
    logo: { // link ảnh 
        type: String,
        default: null
    },
    birthday: { // ngày sinh
        type: Number,
        default: null
    },
    tax_code: { // mã số thuế
        type: Number,
        default: null
    },
    cit_id: { // id thành phố
        type: Number,
        default: null
    },
    district_id: { // id quận huyện
        type: Number,
        default: null
    },
    ward: { // phường
        type: Number,
        default: null
    },
    address: { // địa chỉ
        type: String,
        default: null
    },
    ship_invoice_address: { // địa chỉ giao hàng
        type: String,
        default: null
    },
    gender: { // giới tính
        type: Number,
        default: null
    },
    cmnd_ccnd_number: { // số cmt
        type: String,
        default: null
    },
    cmnd_ccnd_address: { // địa chỉ cmt
        type: String,
        default: null
    },
    cmnd_ccnd_time: { // thời gian chứng minh thư
        type: Number,
        default: 0
    },
    resoure: { // nguồn khách hàng
        type: Number,
        default: 0
    },
    description: { // mô tả khách hàng
        type: String,
        default: ""
    },
    introducer: {
        type: String,
        default: null
    },
    contact_name: {
        type: String,
        default: null
    },
    contact_email: {
        type: String,
        default: null
    },
    contact_phone: {
        type: String,
        default: null
    },
    contact_gender: {
        type: Number,
        default: 0
    },
    company_id: { // id cong ty 
        type: Number,
        default: 0
    },
    emp_id: { // id nhân viên phụ trách
        type: Number,
        default: 0
    },
    user_handing_over_work: { // id người bàn giao
        type: Number,
        default: 0
    },
    user_create_id: { //id nhân viên tạo
        type: Number,
        default: 0
    },
    user_create_type: { //id người tạo
        type: Number,
        default: 0
    },
    user_edit_id: { //id người sửa
        type: Number,
        default: 0
    },
    user_edit_type: { // loại sửa
        type: String,
        default: null
    },
    group_id: { // id nhóm
        type: Number,
        default: 0
    },
    status: { // trạng thái,khách hang
        type: Number,
        default: 0
    },
    business_areas: { // trợ lý kinh doanh
        type: Number,
        default: 0
    },
    category: {
        type: Number,
        default: 0
    },
    business_type: { //loại hình kinh doanh
        type: Number,
        default: 0
    },
    classify: { // phân loại
        type: Number,
        default: 0
    },
    bill_city: { // thông tin viết hóa đơn/ tỉnh thành phố
        type: Number,
        default: 0
    },
    bil_district: { // thông tin viết hóa đơn/ huyện
        type: Number,
        default: 0
    },
    bill_ward: { //thông tin viết hóa đơn / phường ,xã
        type: Number,
        default: 0
    },
    bill_address: { // thông tin viết hóa đơn / địa chỉ liên hệ
        type: String,
        default: null
    },
    bill_area_code: { // thông tin viết hóa đơn mã vùng
        type: String,
        default: null
    },
    bill_invoice_address: { // địa chỉ đơn hàng
        type: String,
        default: null
    },
    bill_invoice_address_email: { //Địa chỉ email nhận hóa đơn
        type: String,
        default: null
    },
    ship_city: { // thông tin giao hàng // tỉnh thành phố
        type: Number,
        default: 0
    },
    ship_area: { // Quận/Huyện:
        type: String,
        default: null
    },
    bank_id: { //id ngân hàng
        type: Number,
        default: 0
    },
    bank_account: { // tài khoản ngân hàng
        type: String,
        default: ""
    },
    revenue: { //Doanh thu/Ngân sách:
        type: Number,
        default: 0
    },
    size: { // quy mô nhân sự
        type: Number,
        default: 0
    },
    rank: { // Xếp hạng khách hàng
        type: Number,
        default: 0
    },
    website: { //website ngân hàng
        type: String,
        default: null
    },
    number_of_day_owed: { // Số ngày được nợ:
        type: Number,
        default: 0
    },
    deb_limit: { // hạn mức nợ
        type: Number,
        default: 0
    },
    share_all: {
        type: Number,
        default: 0
    },
    type: { // loại ? 1 công ty 2 khách hàng
        type: Number,
        default: 0
    },
    is_input: {
        type: Number,
        default: 0
    },
    is_delete: {
        type: Number,
        default: 0
    },
    created_at: { // thời gian tạo 
        type: Number,
        default: 0
    },
    updated_at: { // thời gian sửa
        type: Number,
        default: 0
    },
    id_cus_from: {
        type: String,
        default: null
    },
    cus_from: {
        type: String,
        default: null
    },
    link: {
        type: String,
        default: null
    }
}, {
    collection: 'CRM_customer',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("CRM_customer", crm_customer);