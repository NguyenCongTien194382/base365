const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_contact_customer = new Schema({
  contact_id : {
    type : Number,
    require : true
   },
   id_customer : {
    type : Number
   },
   middle_name : {
    type : String
   },
   name : {
    type : String
   },
   fullname : {
    type : String
   },
   vocative : {
    type : Number
   },
   logo : {
    type : String
   },
   contact_type : {
    type : String
   },
   titles : {
    type : Number
   },
   department : {
    type : Number
   },
   office_phone : {
    type : String
   },

   office_email : {
    type : String
   },
   personal_phone : {
    type : String
   },
   personal_email : {
    type : String
   },
   social : {
    type : String
   },
   social_detail : {
    type : String
   },
   source : {
    type : Number
   },
   country_contact : {
    type : Number
   },

   city_contact : {
    type : Number
   },
   district_contact : {
    type : Number
   },
   ward_contact : {
    type : String
   },
   street_contact : {
    type : String
   },
   address_contact : {
    type : String
   },
   area_code_contact : {
    type : String
   },
   country_ship : {
    type : String
   },
   city_ship : {
    type : String
   },
   district_ship : {
    type : Number
   },
   ward_ship : {
    type : String
   },
   street_ship : {
    type : String
   },
   address_ship : {
    type : String
   },
   area_code_ship : {
    type : String
   },
   description : {
    type : String
   },
   share_all : {
    type : Number
   },
   accept_phone :{
     type : Number
   },
   accept_email : {
    type : Number
   },
   user_create_id : {
    type : Number
   },
   user_create_type : {
    type : Number
   },
   user_edit_id : {
    type : Number
   },
   user_edit_type : {
    type : Number
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
    collection: 'CRM_contact_customer',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("crm_contact_customer", crm_contact_customer);