const mongoose = require('mongoose');
const ContactSchema = mongoose.Schema({
    _id:{
        type:Number,
        require:true    
    },
    name :{
        type:String,
        default:null    
    },
    address:{
        type:String,
        default :null,
    },
    phone:{
        type:String ,
        default: null 
    },
    email:{
        type:String,
        default:null 
    },
    content:{
        type:String,
        default:null     
    },
    date:{
        type:Date,
        default:Date.now()   
    },
    type:{
        type:Number,
        default: 0
    }
}, {
    collection: 'RN365_Contact',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("RN365_Contact", ContactSchema);