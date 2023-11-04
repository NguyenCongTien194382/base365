const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Feedback = new Schema({
    id_user: { // ID chat của người phản hồi
        type: Number
    },
    feed_back: {
        type: String
    },
    rating: { // so sao
        type: Number,
        default: 0
    },
    create_date: { //thời điểm tao
        type: Number,
        default: 0
    },
    app_name: { //
        type: String,
        default: null
    },
    from_source: { //nguon
        type: Number,
        default: 1
    },
}, {
    collection: 'QLC_Feedbacks',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model('QLC_Feedbacks', Feedback);