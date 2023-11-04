const mongoose = require('mongoose');
const evaluationSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    // id company
    uscID: {
        type: Number,
        required: true
    },
    //đánh giá chuyên viên
    dgc: {
        type: String,
        default: null
    },
    // đánh giá web
    dgtv: {
        type: String,
        default: null
    },
    // thời gian đánh giá
    dgTime: {
        type: Date,
    }
}, {
    collection: 'Evaluation',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Evaluation", evaluationSchema);