const mongoose = require("mongoose");
const list_new = new mongoose.Schema({
    id: {
        type: String
    },
    com_id: {
        type: Number,

    },
    cus_id: {
        type: Number
    },
    id_new: {
        type: String
    },
    title: {
        type: String
    },
    content: {
        type: String,
        default: null
    },
    link: {
        type: String
    },
    resoure: {
        type: String
    },
    created_at: {
        type: Number
    },
    updated_at: {
        type: Number
    }

},
    {
        collection: "CRM_list_new_3312"

    });
module.exports = mongoose.model("CRM_list_new_3312", list_new);