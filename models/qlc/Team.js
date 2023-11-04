const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    //ID của tổ
    team_id: {
        type: Number,
        required: true
    },
    //ID phòng ban của tổ
    dep_id: {
        type: Number,
        required: true
    },
    com_id: {
        type: Number,
        required: true
    },
    //Tên của tổ
    team_name: {
        type: String,
    }
}, {
    collection: 'QLC_Teams',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model('QLC_Teams', TeamSchema)