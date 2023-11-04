const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_customer_chance_file = new Schema({
   id : {
    type : Number,
    require : true
   },
   file_name : {
    type : String
   },
   cus_id : {
    type : Number
   },
   user_created_id:{
    type : Number
   },
   chance_id : {
    type : Number
   },
   file_size : {
    type : Number
   },
   created_at : {
    type : Date
   },
   update_at : {
    type : Date
   }
},{
    collection: 'CRM_customer_chance_file',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("crm_customer_chance_file", crm_customer_chance_file);