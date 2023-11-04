const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_customer_chance = new Schema({
   id : {
    type : Number,
    require : true
   },
   name : {
    type : String,
    default : ""
   },
   com_id : {
    type : Number
   },
   cus_id : {
    type : String,
    default : ""
   },
   contact_id : {
    type : String,
    default : 0
   },
   type : {
    type : String,
    default :""
   },
   group_commodities : {
    type : Number,
    default : null
   },
   money : {
    type : Number
   },
   stages : {
    type : Number
   },
   success_rate : {
    type : Number
   },
   expected_sales : {
    type : String,
    default : null
   },
   expected_end_date : {
    type : Date
   },
   campaign_id : {
    type : Number
   },
   soure : {
    type : String
   },
   emp_id : {
    type : Number
   },
   discount_total_rate : {
    type : String
   },
   discount_total_money : {
    type : String
   },
   total_money : {
    type : Number
   },
   description : {
    type : String
   },
   country_change : {
    type : String
   },
   city_chance : {
    type : String
   },
   district_chace : {
    type : String
   },
   ward_chance : {
    type : Number
   },
   street_chance : {
    type : Number
   },
   area_code_chance : {
    type : String
   },
   address_chance : {
    type : String
   },
   share_all :{
    type : String
   },
   user_id_create : {
    type : Number
   },
   user_id_edit : {
    type : Number
   },
   result : {
    type : Number
   },
   reason : {
    type : String
   },
   time_complete : {
    type : String
   },
   delete_chance : {
    type : Number
   },
   created_at : {
    type : Date
   },
   update_at : {
    type : Date
   }
},{
    collection: 'CRM_customer_chance',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("crm_customer_chance", crm_customer_chance);