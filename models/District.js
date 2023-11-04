const mongoose = require('mongoose');
const districtSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    // tên quận huyện
    name: String,
    // mức độ ưu tiên
    order: {
        type: Number,
        default: 0
    },
    // 1 là thành phố , null là quận huyện
    type: Number,
    count: {
        type: Number,
        default: 0
    },
    // id của thành phố 
    parent: {
        type: Number,
        required: true
    }
}, {
    collection: 'District',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("District", districtSchema);