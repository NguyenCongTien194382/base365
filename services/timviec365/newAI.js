const New = require('../../models/Timviec365/UserOnSite/Company/New');
const HistoryNewPoint = require('../../models/Timviec365/HistoryNewPoint');
const LikePost = require('../../models/Timviec365/UserOnSite/LikePost');
const CommentPost = require('../../models/Timviec365/UserOnSite/CommentPost');
const PermissionNotify = require('../../models/Timviec365/PermissionNotify');
const axios = require('axios');
const functions = require("../../services/functions");
const SaveVote = require('../../models/Timviec365/SaveVote');
const NewTV365 = require('../../models/Timviec365/UserOnSite/Company/New');
const { userExists, saveHistory, getMaxID } = require("../../controllers/timviec/history/utils");
const ManagePointHistory = require("../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory")
exports.checkExistTitle = async(comID, title, newID = null) => {
    let condition = {
        new_user_id: Number(comID),
        new_title: title
    };

    if (newID) condition.new_id = { $ne: Number(newID) };

    const result = await New.findOne(condition).lean();
    if (result) {
        return false;
    } else {
        return true;
    }
}