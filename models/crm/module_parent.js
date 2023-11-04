const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_module_parent = new Schema({
   id : {
    type : Number,
    require : true
   },
   module_name : {
    type : String,
   },
   mod_order : {
    type : Number,
    default : 0
   }
},{
    collection: 'CRM_module_parent',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("crm_module_parent", crm_module_parent);