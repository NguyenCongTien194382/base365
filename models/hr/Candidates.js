const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HR_CandidateSchema = new Schema({
    //Id 
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },

    name: {
        type: String,
        default:null
    },

    email: {
        type: String,
        default:null

    },

    phone: {
        type: String,
        default:null

    },
    cvFrom: {
        type: String,
        default:null

    },
    userRecommend: {
        type: Number,
        require:true
    },

    recruitmentNewsId: {
        type: Number,
        default:null

    },
    timeSendCv:{
        type: Date,
        default: null

    },
    interviewTime: {
        type: Date,
        default: null

    },
    interviewResult: {
        type: Number,
        default:null

    },
    interviewVote: {
        type: Number,
        default:null

    },
    salaryAgree: {
        type: Number,
        default:0

    }, 
    status: {
        type: String,
        default:0

    }, 
    cv: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now()

    },
    updatedAt: {
        type: Date,
        default: null

    },
    isDelete: {
        type: Number,
        default:0

    },
    comId: {
        type: Number,
        require:true
    },
    isOfferJob: {
        type: Number,
        default:0
    },
    gender: {
        type: Number,
        require:true

    },
    birthday: {
        type: Date,
        default: null

    },
    education: {
        type: Number,
        require:true

    },
    exp: {
        type: Number,
        require:true

    },
    isMarried: {
        type: Number,
        require:true

    },
    address: {
        type: String,
        require:true

    },
    userHiring: {
        type: Number,
        require:true

    },
    starVote: {
        type: Number,
        require:true

    },
    school: {
        type: String,
        require:true

    },
    hometown: {
        type: String,
        require:true

    },
    isSwitch: {
        type: Number,
        require:true,
        default:0
    },
    epIdCrm: {
        type: Number,
        require:true,
        default:0
    },
}, {
    collection: 'HR_Candidates',
    versionKey: false,
    timestamp: true
});
module.exports = mongoose.model("HR_Candidates", HR_CandidateSchema);