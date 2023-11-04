const mongoose = require("mongoose");
const GV365TblRole =new mongoose.Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true}
})
module.exports = mongoose.model('GV365TblRole', GV365TblRole)