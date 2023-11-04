const mongoose = require("mongoose");
const bank = new mongoose.Schema({

    bank_code: {
        type: String

    },
    bank_name: {
        type: String
    }

}, {
    collection: " CRM_bank"
});
module.exports = mongoose.model("CRM_bank", bank);
