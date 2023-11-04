const mongoose = require('mongoose');
const Tv365TagsSchema = new mongoose.Schema({
    tag_id: {
        type: Number,
        required: true,
    },
    tag_keyword: String,
    tag_link: String,
    tag_link_active: Number,
    tag_chinh: String,
    tag_city: Number,
    tag_active: Number,
}, {
    collection: 'Tv365Tags',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365Tags", Tv365TagsSchema);