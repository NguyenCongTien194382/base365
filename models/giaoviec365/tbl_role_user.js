const mongoose = require("mongoose");
const GV365TblRoleUser =new mongoose.Schema({
    id: {type: Number, required: true},
    ep_id: {type: Number, required: true},
    role_id: {type: Number, required: true}
})
module.exports = mongoose.model('GV365TblRoleUser', GV365TblRoleUser)