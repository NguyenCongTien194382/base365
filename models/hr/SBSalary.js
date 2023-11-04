const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SBSalarySchema = new Schema({
    // id tu dong tang
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    
    depId: {
        type: Number,
        default: 0 
    },
    
    positionId: {
        type: Number,
        default: 0 
    },
    
    salaryBasic: {
        type: Number,
        default: 0
    },
    
    timeUp: {
        type: Date,
        default: Date.now()
    },
    
    reason: {
        type: String,
        default: null
    },
    
    decision: {
        type: String,
        default: null
    },
    upDown: {
      type: Number,
      default: null
    }
},{
    collection: 'HR_SBSalary',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_SBSalary",SBSalarySchema);