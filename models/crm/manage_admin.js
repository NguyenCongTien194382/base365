const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_manage_admin = new Schema({
   id : {
    type : Number,
    require : true
   },
   usc_kd : {
    type : Number,
   },
   id_qlc : {
    type : Number
   },
   name : {
    type : String,
   }
},{
    collection: 'CRM_manage_admin',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("crm_manage_admin", crm_manage_admin);