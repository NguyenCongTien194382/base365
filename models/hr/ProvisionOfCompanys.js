const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProvisionOfCompanySchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },

    description: {
        type: String,
        require:true
    },

    isDelete: {
        type: Number,
        default: 0
    },

    name: {
        type: String,
        require: true,
    },
   
    timeStart: {
        type: Date,
        require: true,  
    },

    supervisorName: {
        type: String,
        require: true,  
    },
    comId: {
        type: Number,
        require: true,  

    },
    // thời gian xoá
    file: {
        type: String,
    },
    createdAt: {
        type: Date,
        require: true,  

    },
    deletedAt: {
        type: Date,
    },

},{
    collection: 'HR_ProvisionOfCompanys',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_ProvisionOfCompanys",ProvisionOfCompanySchema);
