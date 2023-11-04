const mongoose = require('mongoose');
const Tv365ManagerPointHistorySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    userId: {
        type: Number,
        default: 0
    },
    type: {
        type: Number,
        default: 0
    },
    point_time_active: {
        type: Number,
        default: 0
    },
    point_see: {
        type: Number,
        default: 0
    },
    point_see_new_uv: {
        type: Number,
        default: 0
    },
    point_use_point: {
        type: Number,
        default: 0
    },
    point_share_social_new: {
        type: Number,
        default: 0
    },
    point_share_social_url: {
        type: Number,
        default: 0
    },
    point_share_social_user: {
        type: Number,
        default: 0
    },
    point_vote: {
        type: Number,
        default: 0
    },
    point_vote_candidate: {
        type: Number,
        default: 0
    },
    point_next_page: {
        type: Number,
        default: 0
    },
    point_see_em_apply: {
        type: Number,
        default: 0
    },
    point_vip: {
        type: Number,
        default: 0
    },
    point_TiaSet: {
        type: Number,
        default: 0
    },
    point_comment: {
        type: Number,
        default: 0
    },
    point_ntd_comment: {
        type: Number,
        default: 0
    },
    point_be_seen_by_em: {
        type: Number,
        default: 0
    },
    point_content_new: {
        type: Number,
        default: 0
    },
    percent_content_new: {
        type: Number,
        default: 0
    },
    point_to_change: {
        type: Number,
        default: 0
    },
    point_evaluate_cv: {
        type: Number,
        default: 0
    },
    point_chat_uv: {
        type: Number,
        default: 0
    },
    point_ntd_seen: {
        type: Number,
        default: 0
    },
    point_ntd_evaluate: {
        type: Number,
        default: 0
    },
    point_seen_new_ntd: {
        type: Number,
        default: 0
    },
    sum: {
        type: Number,
        default: 0
    }
}, {
    collection: 'Tv365ManagerPointHistory',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365ManagerPointHistory", Tv365ManagerPointHistorySchema);