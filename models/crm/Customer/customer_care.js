const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_customer_care = new Schema({
   id : {
    type : Number,
    require : true
   },
   name : {
    type : String,
    default : ""
   },
   id_creator : {
    type : Number
   },
   option_care : {
    type : String,
    default : ""
   },
   set_up_calendar : {
    type : Number,
    default : 0
   },
   description : {
    type : String,
    default :""
   },
   count : {
    type : Number,
    default : null
   },
   company_id : {
    type : Number
   },
   emp_id : {
    type : Number
   },
   is_delete : {
    type : Number
   },
   site : {
    type : String,
    default : null
   },
   created_at : {
    type : Date
   },
   update_at : {
    type : Date
   }
},{
    collection: 'CRM_customer_care',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("crm_customer_care", crm_customer_care);