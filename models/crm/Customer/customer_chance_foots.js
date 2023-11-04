const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_customer_chance_foots = new Schema({
   id : {
    type : Number,
    require : true
   },
   chance_id : {
    type : Number
   },
   foots_id : {
    type : Number
   },
   foots_name : {
    type : String
   },
   unit_of_measure : {
    type : String
   },
   quantity : {
    type : Number
   },
   price : {
    type : Number
   },
   discount_rate : {
    type : Number
   },
   discount_money : {
    type : Number
   },
   tax : {
    type : Number
   },
   tax_money : {
    type : Number
   }
},{
    collection: 'CRM_customer_chance_foots',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("crm_customer_chance_foots", crm_customer_chance_foots);