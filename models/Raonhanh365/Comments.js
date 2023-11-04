const mongoose = require('mongoose');
const CommentSchema = mongoose.Schema({
    _id:{
        type:Number,
        require:true    
    },
    url :{
        type:String,
        require:true    
    },
    parent_id:{
        type:Number,
        require :true,
        default:0 
    },
    content:{
        type:String ,
        default:null  
    },
    img:{
        type:String,
        default:null  
    },
    sender_idchat:{
        type:Number,
        require:true    
    },
    sender_name:{
        type:String,
        default:null   
    },
    sender_avatar:{
        type:String,
        default:null   
    },

    tag :{
        type:String,
        default:null     
    }, 
    ip :{
        type:String,
        require:true    
    },
    time :{
        type:Date,
        require:true    
    },  
    active :{
        type:Number,
        require:true ,
        default:1      
    }, 
    pb :{
        //1: đấu thầu
        type:Number ,
        require:true,
        default:0       
    }, 
    id_dh :{
        //	id đấu thầu
        type:Number ,
        require:true,
        default:0    
    },  
    unit :{
        type:Number ,
        require:true,
        default:0      
    }, 
    id_new :{
        // id tin mua
        type:Number ,
        require:true,
        default:0   
    },  
}, {
    collection: 'RN365_Comments',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("RN365_Comments", CommentSchema);