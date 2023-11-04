const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_customer_file = new Schema({
   stt_id : {
    type : Number,
    require : true
   },
   file_name : {
    type : String
   },
   cus_id : {
    type : Number
   },
   user_created_id : {
    type : Number
   },
   file_size : {
    type : Number
   },
   created_at : {
    type : Date
   }
},{
    collection: 'CRM_customer_file',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("crm_customer_file", crm_customer_file);