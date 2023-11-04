const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShiftSchema = new Schema({
    //Id của ca làm việc
    shift_id: {
        type: Number,
        unique: true
    },
    //Id của công ty
    com_id: {
        type: Number
    },
    //Tên ca làm việc
    shift_name: {
        type: String,
    },
    //Thời điểm tạo ca làm việc
    start_time: {
        type: String,
        default: null
    },
    //Giớ check in sớm nhất
    start_time_latest: {
        type: String,
        default: null
    },
    //Giờ hết ca
    end_time: {
        type: String,
        default: null
    },
    //Giớ check out muộn nhất
    end_time_earliest: {
        type: String,
        default: null
    },

    create_time: {
        type: Date,
        default: Date.now
    },
    //Id hình thức tính công
    over_night: {
        type: Number,
        default: 0
    },
    //Hình thức tính công
    shift_type: {
        type: Number,
        default: 1
    },
    //Số công theo ca
    num_to_calculate: {
        type: Number,
        default: 1
    },
    //Số tiền theo ca
    num_to_money: {
        type: Number,
        default: 0
    },
    is_overtime: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 1
    },
    relaxTime:[
        {
            start_time_relax: {
                type: String,
                default: null
            },
            end_time_relax: {
                type: String,
                default: null
            },
        }
    ],
    flex: {
        //0: chấm công linh hoạt, 1: chấm công quy chuẩn
        type: Number,
        default:0
    }
}, {
    collection: 'QLC_Shifts',
    versionKey: false
})

module.exports = mongoose.model("QLC_Shifts", ShiftSchema);