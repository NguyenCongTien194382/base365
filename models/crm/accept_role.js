const mongoose = require("mongoose");
const accept_role = new mongoose.Schema({
    id: {
        type: Number
    },
    id_role: {
        type: Number,
        default: null
    },
    id_module: {
        type: Number,
    },
    id_user: {
        type: Number
    },
    add: {
        type: Number
    },
    edit: {
        type: Number
    },
    delete: {
        type: Number
    },
    seen: {
        type: Number
    }
}, {
    collection: "CRM_accept_role"
});
module.exports = mongoose.model("CRM_accept_role", accept_role);