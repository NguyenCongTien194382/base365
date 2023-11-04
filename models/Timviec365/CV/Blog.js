const mongoose = require('mongoose');
const Cv365BlogSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        //tên cat cv
        type: String,
    },
    alias: {
        //thẻ cate cv
        type: String,
    },
    link_301: {
        //chú thích cat cv
        type: String
    },
    link_canonical: {
        //mô tả cat cv
        type: String
    },
    cid: {
        //Id của cat cha(cat to)
        type: Number
    },
    cate_blog: {
        type: Number
    },
    cate_cb: {
        type: Number
    },
    image: {
        // cat cv này có kích hoạt hay không
        type: String
    },
    file: {
        // cat này có hot hay không
        type: String
    },
    created_day: {
        // cat này có hot hay không
        type: Date
    },
    sapo: {
        // cat này có hot hay không
        type: String
    },
    content: {
        // cat này có hot hay không
        type: String
    },
    view: {
        // cat này có hot hay không
        type: Number
    },
    vip: {
        // cat này có hot hay không
        type: Number
    },
    status: {
        // cat này có hot hay không
        type: Number
    },
    uid: {
        // cat này có hot hay không
        type: Number
    },
    meta_title: {
        // cat này có hot hay không
        type: String
    },
    meta_key: {
        // cat này có hot hay không
        type: String
    },
    meta_des: {
        // cat này có hot hay không
        type: String
    },
    tin_lq: {
        // cat này có hot hay không
        type: String
    }
}, {
    collection: 'Cv365Blog',
    versionKey: false
});

module.exports = mongoose.model("Cv365Blog", Cv365BlogSchema);