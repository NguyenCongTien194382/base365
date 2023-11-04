const mongoose = require('mongoose');
const Schema = mongoose.Schema
const TagsSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        //like cho tin nao
        type: String,
        default: null,
    },
    parentId: {
        //thich/tym/haha/phan no
        type: Number,
        default: 0,
    },
    typeTags: {
        //id cua commnet
        type: Number,
        default: 0,
    },
    cateId: {
        //ten
        type: Number,
        default: null,
    },
    type: {
        //avatar
        type: Number,
        default: null,
    }

}, {
    collection: 'RN365_Tags',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_Tags", TagsSchema);