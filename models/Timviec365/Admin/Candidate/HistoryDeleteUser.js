const mongoose = require('mongoose');
const HistoryDeleteUserSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
        unique: true
    },
    use_email: {
        type: String,
        default: null
    },
    use_phone_tk: {
        type: String,
        default: null
    },
    use_first_name: {
        type: String,
        default: null
    },
    use_pass: {
        type: String,
        default: null
    },
    use_type: {
        type: Number,
        default: 0
    },
    use_create_time: {
        type: Number,
        default: 0
    },
    use_update_time: {
        type: Number,
        default: 0
    },
    user_reset_time: {
        type: Number,
        default: 0
    },
    use_logo: {
        type: String,
        default: null
    },
    use_phone: {
        type: String,
        default: null
    },
    use_gioi_tinh: {
        type: Number,
        default: 0
    },
    use_birth_day: {
        type: Number,
        default: 0
    },
    use_birth_mail: {
        type: String,
        default: null
    },
    use_city: {
        type: Number,
        default: 0
    },
    use_quanhuyen: {
        type: Number,
        default: 0
    },
    use_address: {
        type: String,
        default: null
    },
    use_hon_nhan: {
        type: Number,
        default: 0
    },
    use_view: {
        type: Number,
        default: 0
    },
    use_noti: {
        type: Number,
        default: 0
    },
    use_show: {
        type: Number,
        default: 0
    },
    use_show_cv: {
        type: Number,
        default: 0
    },
    use_active: {
        type: Number,
        default: 0
    },
    use_authentic: {
        type: Number,
        default: 0
    },
    use_lat: {
        type: String,
        default: null
    },
    use_long: {
        type: String,
        default: null
    },
    use_td: {
        type: Number,
        default: 0
    },
    send_vip_time: {
        type: Number,
        default: 0
    },
    use_stop_mail: {
        type: Number,
        default: 0
    },
    usc_mail_app: {
        type: Number,
        default: 0
    },
    use_utl: {
        type: Number,
        default: 0
    },
    use_ssl: {
        type: Number,
        default: 0
    },
    use_mail_vt: {
        type: Number,
        default: 0
    },
    use_qc: {
        type: Number,
        default: 0
    },
    use_check: {
        type: Number,
        default: 0
    },
    user_xac_thuc: {
        type: Number,
        default: 0
    },
    dk: {
        type: Number,
        default: 0
    },
    chat365_id: {
        type: Number,
        default: 0
    },
    chat365_secret: {
        type: String,
        default: null
    },
    cv_title: {
        type: String,
        default: null
    },
    cv_hocvan: {
        type: Number,
        default: 0
    },
    cv_exp: {
        type: Number,
        default: 0
    },
    cv_muctieu: {
        type: String,
        default: null
    },
    cv_cate_id: {
        type: String,
        default: null
    },
    cv_city_id: {
        type: String,
        default: null
    },
    cv_address: {
        type: String,
        default: null
    },
    cv_capbac_id: {
        type: Number,
        default: 0
    },
    cv_money_id: {
        type: Number,
        default: 0
    },
    cv_loaihinh_id: {
        type: Number,
        default: 0
    },
    cv_time: {
        type: Number,
        default: 0
    },
    cv_time_dl: {
        type: Number,
        default: 0
    },
    cv_kynang: {
        type: String,
        default: null
    },
    cv_tc_name: {
        type: String,
        default: null
    },
    cv_tc_cv: {
        type: String,
        default: null
    },
    cv_tc_dc: {
        type: String,
        default: null
    },
    cv_tc_phone: {
        type: String,
        default: null
    },
    cv_tc_email: {
        type: String,
        default: null
    },
    cv_tc_company: {
        type: String,
        default: null
    },
    cv_video: {
        type: String,
        default: null
    },
    cv_video_type: {
        type: Number,
        default: 0
    },
    cv_video_active: {
        type: Number,
        default: 0
    },
    hs_create_time: {
        type: Number,
        default: 0
    },
    hs_link: {
        type: String,
        default: null
    },
    hs_name: {
        type: String,
        default: null
    },
    delete_time: {
        type: Number,
        default: 0
    }
}, {
    collection: 'Tv365HistoryDeleteUser',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365HistoryDeleteUser", HistoryDeleteUserSchema);