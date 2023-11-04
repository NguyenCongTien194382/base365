const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const managerUserSchema = new Schema({
    //ID nhân viên  
    _id: {
        type: Number,
        required: true
    },
    //Tên nhân viên     
    userName: {
        type: String,
    },
    
    //id cty 
    CompanyId: {
        type: Number,
    },

    // số điện thoại nhân viên  
    userPhone: {
        type: Number
    },
    userpositionID: {
        // Cấp bậc của nhân viên trong công ty
        type: Number,
        default: 0},

    //Email nhân viên
    userEmail: {
        type: String,
    },

    // địa chỉ của nhân viên trong công ty
    userAddress: {
    type: String,
    },

    //Săp xếp theo thứ tự
    userOrder: {
        type: Number
    }
})


module.exports = mongoose.model('managerUser', managerUserSchema)