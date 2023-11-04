const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PerUser = new Schema({
    //Id 
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
  
    userId: {
        type: Number,
    },
    perId: {
        type: Number,
    },
    barId: {
        type: Number,
    },
}, {
    collection: 'HR_PerUsers',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_PerUsers", PerUser);