const mongoose = require("mongoose");
const city2 = new mongoose.Schema({
    cit_id: {
        type: Number
    },
    cit_name: {
        type: String
    },
    cit_order: {
        type: Number
    },
    cit_parent: {
        type: Number
    }

}, {
    collection: "CRM_city2"
});
module.exports = mongoose.model("CRM_city2", city2);