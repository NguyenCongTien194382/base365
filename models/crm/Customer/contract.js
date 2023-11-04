const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_contract = new Schema({

//hợp đồng bán - chi tiết KH
   _id : {
    type : Number,
    require : true
   },

   id_customer : {
    type : Number
   },

   user_created : {
    type : String
   },

   id_form_contract : {
    type : Number
   },

   status : {
    type : Number,
    default :0
   },

   emp_id : {
    type : Number,

   },
   comp_id : {
    type : Number
   },

   path_dowload : {
    type : String
   },

   is_delete : {
    type : Number
   },

   created_at : {
    type : Date
   },

   updated_at : {
    type : Date
   }

},
{
 collection: 'CRM_contract',
 versionKey: false,
 timestamp: true
})
module.exports = mongoose.model("crm_contract", crm_contract);