const mongoose = require('mongoose');
const saveCandidateSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    // id company
    usc_id: {
        type: Number,
        default: 0
    },
    //id  ứng viên
    use_id: {
        type: Number,
        default: 0
    },
    // thời gian lưu
    save_time: {
        type: Number,
        default: 0
    }
}, {
    collection: 'SaveCandidate',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("SaveCandidate", saveCandidateSchema);