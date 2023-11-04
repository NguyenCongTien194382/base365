const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// chu ky cua nhan vien
const HR_ThuongPhatsSchema = new Schema({
    // id tu dong tang
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    userId:{
        type: Number,
        require: true
    },
    // id nhan vien
    comId: {
        type: Number,
        require: true
    },
    // ten anh
    price: {
        type: Number,
        default: null 
    },
    
    status: {
        type: Number,
    },
    case: {
        type: Number,
        default: 0
    },
    day: {
        type: Date,
   
    },
    month: {
        type: Date,

    },
    year: {
        type: Date,

    }
},{
    collection: 'HR_ThuongPhats',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_ThuongPhats",HR_ThuongPhatsSchema);
