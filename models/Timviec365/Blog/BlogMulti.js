const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const blogMultiSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    adminId: {
        type: Number,
        required: true,
        default: 0
    },
    langId: {
        type: Number,
        required: true,
        default: 1
    },
    name: String,
    title: {
        type: String,
        required: true,
    },
    keyword: {
        type: String,
        required: true,
    },
    nameRewrite: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    picture: String,
    type: String,
    form: String,
    description: {
        type: String,
        required: true,
    },
    parentId: {
        type: Number,
        required: true,
        default: 0
    },
    hasChild: {
        type: Number,
        required: true,
        default: 1
    },
    order: {
        type: Number,
        required: true,
    },
    date: {
        type: Number,
        required: true,
    },
    active: {
        type: Number,
        required: true,
        default: 1
    },
    show: {
        type: Number,
        required: true,
        default: 0
    },
    home: {
        type: Number,
        required: true,
        default: 0
    },
})