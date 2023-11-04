const mongoose = require('mongoose');
const EvaluateSchema = mongoose.Schema({
    _id:{
        type:Number,
        require:true    
    },
    newId :{
        type:Number,
        require:true    
    },
    userId:{
        type:Number,
        require :true,
    },
    blUser:{
        type:Number ,
        default:0  
    },
    parentId:{
        type:Number,
        default:0  
    },
    stars:{
        type:Number,
        default:0      
    },
    comment:{
        type:String,
        default:null   
    },
    time:{
        type:Date,
        default:Date.now()   
    },

    active :{
        type:Number,
        default:1 
    }, 
    showUsc :{
        type:Number,
        default:0  
    },
    csbl :{
        //chinh sua binh luan
        type:Number,
        default:1  
    },  
    csuaBl :{
        type:Number,
        default:0   
    }, 
    tgianHetcs :{
        type:Number,
        default:0       
    }
}, {
    collection: 'RN365_Evaluates',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("RN365_Evaluates", EvaluateSchema);