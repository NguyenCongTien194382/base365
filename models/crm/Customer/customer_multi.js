const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_customer_multi = new Schema({
   id : {
    type : Number,
    require : true
   },
   customer_id : {
    type : Number
   },
   link : {
    type : String
   }
},{
    collection: 'CRM_customer_multi',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("crm_customer_multi", crm_customer_multi );