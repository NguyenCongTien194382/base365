const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnotherSkillSchema = new Schema({
    // id tu dong tang
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // id ung vien
    canId: {
        type: Number,
        require: true
    },
    // ten hanh dong
    skillName: {
        type: String,
        default: null 
    },
    // so vote(max: 5)
    skillVote: {
        type: Number,
        default: 0 
    },
    //check action
    createAt: {
        type: Date,
        default: Date.now()
    }
},{
    collection: 'HR_AnotherSkills',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_AnotherSkills",AnotherSkillSchema);
