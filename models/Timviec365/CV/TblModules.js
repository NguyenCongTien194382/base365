const mongoose = require('mongoose');
const Cv365TblModulesSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    title: {
        type: String
    },
    sapo: {
        type: String
    },
    module: {
        type: String
    },
    meta_title: {
        type: String
    },
    meta_des: {
        type: String
    },
    meta_key: {
        type: String
    },
    list_bv: {
        type: String
    }

}, {
    collection: 'Cv365TblModules',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Cv365TblModules", Cv365TblModulesSchema);