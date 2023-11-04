const New = require('../models/Timviec365/UserOnSite/Company/New');
const axios = require('axios');
const functions = require("../services/functions");

exports.checkExistTitle = async(comID, title, newID = null) => {
    let condition = {
        userID: comID,
        title: title
    };

    if (newID) condition._id = { $ne: newID };

    const result = await New.findOne(condition).lean();
    if (result) {
        return false;
    } else {
        return true;
    }
}

exports.checkSpecalCharacter = async(title) => {
    var pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return pattern.test(title);
}

exports.foundKeywordHot = async(title) => {
    if ((title.indexOf("hot") || title.indexOf("tuyển gấp") || title.indexOf("cần gấp") || title.indexOf("lương cao")) > -1) return false;
    else return true;
}

exports.recognition_tag_tin = async(cateID, title, description, require) => {
    let result;
    try {
        let takeData = await axios({
            method: "post",
            url: "http://43.239.223.10:5001/recognition_tag_tin",
            data: {
                key_cat_lq: cateID,
                new_title: title,
                new_mota: description,
                new_yeucau: require
            },
            headers: { "Content-Type": "multipart/form-data" }
        });
        result = takeData.data.data.items;
    } catch (error) {
        result = "";
    }
    return result;
}

exports.getMoney = async(typeNewMoney, money, minValue, maxValue) => {
    switch (Number(typeNewMoney)) {
        case 1:
            maxValue = null;
            minValue = null;
            break;
        case 2:
            for (const threshold of functions.thresholds) {
                if (minValue >= threshold.minValue && minValue < threshold.maxValue) {
                    money = threshold.money;
                    break;
                }
            }
            maxValue = null;
            break;
        case 3:
            for (const threshold of functions.thresholds) {
                if (maxValue > threshold.minValue && maxValue <= threshold.maxValue) {
                    money = threshold.money;
                    break;
                }
            }
            minValue = null;
            break;
        case 4:
            for (const threshold of functions.thresholds) {
                if (minValue >= threshold.minValue && maxValue <= threshold.maxValue) {
                    money = threshold.money;
                    break;
                }
            }
            minValue = null;
            break;
        case 5:
            money = money;
            break;
        default:
            break;
    }
    return { money, maxValue, minValue };
}