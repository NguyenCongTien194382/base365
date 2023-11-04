 //thiết kế cv
 const mongoose = require('mongoose');
 const CVDesignSchema = new mongoose.Schema({
     _id: {
         type: Number,
         require: true
     },
     name: {
         type: String
     },
     alias: {
         type: String
     },
     metaH1: {
         type: String
     },
     content: {
         type: String
     },
     metaTitle: {
         type: String
     },
     metaKey: {
         type: String
     },
     metaDes: {
         type: String
     },
     metaTt: {
         type: String
     },
     status: {
         type: Number
     }
 }, {
     collection: 'CVDesign',
     versionKey: false
 });

 module.exports = mongoose.model("CVDesign", CVDesignSchema)