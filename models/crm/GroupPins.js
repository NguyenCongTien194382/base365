//Model này dùng để 
const mongoose = require('mongoose')


const GroupPins = new mongoose.Schema({
    _id: {
        //id 
        type: Number,
        required: true
    },
    id : {
        
        type : Number,
    },
    user_id : {

        type : Number,
    },
    user_type : {

        type : Number,
    },
    group_id : {

        type : Number,
    },
    status : {

        type : Number,
    },
    is_parent : {

        type : Number,
    },
    created_at : {

        type : Number,
    },
    updated_at : {

        type : Number,
    },

});

module.exports = mongoose.model('GroupPins', GroupPins);

