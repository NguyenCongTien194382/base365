const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_customer_note = new Schema({
   id : {
    type : Number,
    require : true
   },
   content : {
    type : String
   },
   cus_id : {
    type : Number
   },
   user_created_id : {
    type : String
   },
   created_at : {
    type : Date
   },
   updated_at : {
    type : Date
   }
},{
    collection: 'CRM_customer_note',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("crm_customer_note", crm_customer_note );