const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserUnsetSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    use_mail: {
        type: String,
        default: null
    },
    use_phone_tk: {
        type: String,
        default: null
    },
    use_email_lienhe: {
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
    use_phone: {
        type: String,
        default: null
    },
    use_city: {
        type: Number,
        default: 0
    },
    use_qh: {
        type: Number,
        default: 0
    },
    use_addr: {
        type: String,
        default: null
    },
    use_cv_tittle: {
        type: String,
        default: null
    },
    use_cv_city: {
        type: String,
        default: null
    },
    use_cv_cate: {
        type: String,
        default: null
    },
    use_create_time: {
        type: Number
    },
    use_link: {
        type: String,
        default: null
    },
    use_active: {
        type: Number,
        default: 0
    },
    use_delete: {
        type: Number,
        default: 0
    },
    type: {
        type: Number,
        default: 0
    },
    emp_id: {
        type: Number,
        default: 0
    },
    error: {
        type: Number,
        default: 0
    },
    u_regis: {
        type: Number,
        default: 0
    },
    list_notify: {
        type: Number,
        default: null
    }


}, {
    collection: 'Tv365UserUnset',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365UserUnset", UserUnsetSchema);