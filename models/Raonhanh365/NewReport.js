const mongoose = require('mongoose');
const ReportNewschema = new mongoose.Schema({
    _id:{
        type:Number,
        require:true
    },
    id_user:{
        type:Number,
        require:true
    },
    id_new:{
        type:Number,
        require:true
    },
    problem:{
        type: String,
        require:true
    },
    reportDetail:{
        type: String,
        require:true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    fixed: {
        type: Number,
        Default: 0
    }

},{
    collection: 'RN365_ReportNews',
    versionKey: false,
    timestamp: true
});
module.exports = mongoose.model("RN365_ReportNews", ReportNewschema);