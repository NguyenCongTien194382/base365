const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const JobDescriptionsSchema = new Schema({
    // id mô tả công việc
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // tên công việc
    name:{
        type:String,
        default:null
    },
    // tên bộ phận
    depName:{
        type:String,
        default:null
    },
    // mô tả
    des:{
        type:String,
        default:null
    },
    // yêu cầu job
    jobRequire:{
        type:String,
        default:null
    },
    // bản đồ
    roadMap:{
        type:String,
        require:true
    },
    // id công ty
    comId:{
        type:Number,
        require:true
    },
    // thời gian tạo
    createdAt:{
        type:Date,
        default: Date.now()
    },
    //thoi gian sua
    updatedAt:{
        type:Date,
        default:null
    },
    // thời gian xoá
    deletedAt:{
        type:Date,
        default:null
    },
    // trạng thái xoá
    isDelete:{
        type:Number,
        default:0
    }
},{
    collection: 'HR_JobDescriptions',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_JobDescriptions", JobDescriptionsSchema);
