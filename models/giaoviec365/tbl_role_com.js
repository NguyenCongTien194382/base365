const mongoose = require("mongoose");
const GV365TblRoleCom =new mongoose.Schema({
    id: {type: Number, required: true},
    com_id: {type: Number, required: true},
    role_id: {type: Number, required: true},
    permission: {type: String, required: true}
})
module.exports = mongoose.model('GV365TblRoleCom', GV365TblRoleCom)