const mongoose = require('mongoose');
const LoveNewschema = new mongoose.Schema({
    _id:{
        type:Number,
        require:true
    },
    id_new:{
        type:Number,
        require:true
    },
    id_user:{
        type:Number,
        require:true
    },
    usc_type:{
        type:Number,
        require:true
    },
    createdAt:{
        type:Date,
        require:true
    }

}
, {
    collection: 'RN365_LoveNews',
    versionKey: false,
    timestamp: true
});
module.exports = mongoose.model("RN365_LoveNews", LoveNewschema);