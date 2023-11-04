const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_notify = new Schema({
    notify_id : {
    type : Number,
    require : true
   },
   notify_type : {
    type : Number
   },
   notify_cus_name : {
    type : String
   },
   notify_group_name : {
    type : String
   },
   notify_cus_id : {
    type : Number,
   },
   emp_id : {
    type : Number
   },
   seen: {
    type : Number,
   },
   created_at : {
    type : Date
   }
},{
    collection: 'CRM_notify',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("crm_notify", crm_notify);