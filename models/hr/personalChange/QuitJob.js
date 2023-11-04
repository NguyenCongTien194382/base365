const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QuitJobSchema = new Schema({
    // id tu dong tang
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },

    ep_id: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        require: true,
        default: null
    },
    // ly do
    note: {
        type: String,
        default: null,
    }
},{
    collection: 'HR_QuitJobs',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_QuitJobs",QuitJobSchema);