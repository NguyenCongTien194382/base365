const mongoose = require('mongoose');
const Tv365SaveVoteCandidateSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    userId: {
        type: Number,
        default: 0
    },
    user_type_vote: {
        type: Number,
        default: 0
    },
    star: {
        type: Number,
        default: 1
    },
    id_be_vote: {
        type: Number,
        default: 0
    },
    type_be_vote: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: null
    },
    type_create: {
        type: Number,
        default: 0
    },
    time: {
        type: Number,
        default: 0
    }
}, {
    collection: 'Tv365SaveVoteCandidate',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365SaveVoteCandidate", Tv365SaveVoteCandidateSchema);