const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HR_CategorySchema = new Schema({
    // Id 
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // tên
    name: {
        type: String,
        default: null
    },
    title: {
        type: String,
        default: null

    },
    tags: {
        type: String,
        default: null

    },
    // mô tả
    description: {
        type: String,
        default: null

    },
    keyword: {
        type: String,
        default: null

    },
    parentId: {
        type: Number,
        default: null

    },
    lq: {
        type: String,
        require: true
    },
    count: {
        type: Number,
        default: 0
    },
    countVl: {
        type: Number,
        default: 0
    },
    order: {
        type: Number,
        default: 0
    },
    active: {
        type: Number,
        default: 1
    }, 
    hot: {
        type: Number,
        default: 0
    }, 
    ut: {
        type: String,
        require: true
    },
    only: {
        type: Number,
        require: true,
        default:0
    },
    except: {
        type: String,
        require: true
    },
    tlq: {
        type: String,
        require: true
    },
    tlqUv: {
        type: String,
        require: true
    },
}, {
    collection: 'HR_Categorys',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_Categorys", HR_CategorySchema);