const mongoose = require('mongoose');
const Vanthu_settingDx = new mongoose.Schema({
    _id: { type: Number },
    com_id: { type: Number },
    type_setting: { type: Number ,
    default :0},
    type_browse: { type: Number ,
    default : 0},
    time_limit: { type: Number,
    default :0 },
    shift_id: { type: Number ,
    default :0},
    time_limit_l: { type: String },
    list_user: { type: String,
    default : "" },
    time_tp: { type: Number,
    default :0 },
    time_hh: { type: Number ,
        default :0},
    time_created: { type: Date },
    update_time: { type: Date, 
    default : 0},

});

module.exports = mongoose.model('Vanthu_Setting_Dx', Vanthu_settingDx);