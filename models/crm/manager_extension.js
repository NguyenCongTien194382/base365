const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_manager_extension = new Schema({
   id : {
    type : Number,
    require : true
   },
   company_id : {
    type : Number
   },
   ext_id : {
    type : Number
   },
   ext_id : {
    type : Number
   },
   ext_number : {
    type : Number,
   },
   ext_password : {
    type : String
   },
   emp_id : {
    type : String,
   },
   created_at : {
    type : Date
   },
   updated_at : {
    type : Date
   }
},{
    collection: 'CRM_manager_extension',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("crm_manager_extension", crm_manager_extension);