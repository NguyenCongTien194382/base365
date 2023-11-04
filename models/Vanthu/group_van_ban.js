const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vanthu_group_van_ban = new Schema({
    id_group_vb : {
        type : Number,
        required : true
    },
    name_group : {
        type : String,
        default : null
    },
    admin_group : {
        type : Number,
        default: null
    },
    user_view : {
        type : String,
        default : null
    },
    book_vb : {
        type : String,
        default : null
    },
    com_id : {
        type : Number,
        default : null
    }

})
module.exports = mongoose.model("Vanthu_group_van_ban",Vanthu_group_van_ban);