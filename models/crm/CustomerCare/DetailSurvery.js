 //Model này dùng để 
const mongoose = require('mongoose')


const DetailSurvery = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    
    id_survey : {

        type :Number,
    },
    title : {

        type :String,
    },
    description : {

        type :String,
    },
    question : {

        type :String,
    },
    answer : {

        type :String,
    },
    answer_right : {

        type :String,
    },
    small_title : {

        type :String,
    },
    small_description : {

        type :String,
    },
    url_image : {

        type :String,
    },
    url_video : {

        type :String,
    },
    type : {

        type :Number,
    },
    type_part : {

        type :Number,
    },
    created_at : {

        type :Date,
    },
    updated_at : {

        type :Date,
    },
    
    

});

module.exports = mongoose.model('DetailSurvery', DetailSurvery);
