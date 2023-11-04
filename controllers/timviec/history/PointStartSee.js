const functions = require("../../../services/functions");
const { saveHistory, userExists } = require("./utils");
const ManagePointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");
const SaveSeeNewByEm = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveSeeNewByEm");
const User = require("../../../models/Users");

// điểm ứng viên xem tin tuyển dụng 
const handleStartSee = async(userId, type, idNew, hostId, url) => {
        try {
            let userSeen = await User.findOne({ idTimViec365: userId, type: type });
            let host = await userExists(hostId, 1);
            if (userSeen && host) {
                let now = new Date().getTime() / 1000;
                now = Math.round(now);
                let end = now + 1;
                let duration = 1;
                await (new SaveSeeNewByEm({
                    userId: userId,
                    type: type,
                    name: userSeen.userName,
                    start: now,
                    end: end,
                    duration: duration,
                    url: url,
                    newId: idNew,
                    hostId: hostId,
                })).save()
            } else {
                return false;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    }
    // api 
exports.startSee = async(req, res, next) => {
        try {
            let {
                UserId,
                Type,
                IdNew,
                HostId,
                Url,
            } = req.body;
            if (UserId && Type && IdNew && HostId && Url) {
                await handleStartSee(UserId, Type, IdNew, HostId, Url);
                return functions.success(res, "Thành công", {
                    result: true
                })
            } else {
                return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
            }
        } catch (error) {
            console.log(error)
            return functions.setError(res, "Đã có lỗi xảy ra", 500);
        }
    }
    // function end see 
const handleEndSee = async(idChat) => {
        try {
            let user = await User.findOne({ _id: idChat });
            let userId = user.idTimViec365;
            let userType = user.type;
            let nextPage = await SaveSeeNewByEm.findOne({
                userId: userId,
                type: userType
            }).sort({ start: -1 })

            if (nextPage) {
                userId = nextPage.hostId;
                userType = 1;
                let time = (new Date().getTime() / 1000) + 1;
                let duration = time - nextPage.start;
                if (nextPage.end - nextPage.start <= 2) {
                    await SaveSeeNewByEm.updateOne({ id: nextPage.id }, {
                        $set: {
                            end: time,
                            duration: duration
                        }
                    })

                    const POINT_LIMIT = 10;
                    let point = duration / 3 / 60;

                    let history = await ManagePointHistory.findOne({
                        userId: userId,
                        type: userType
                    })
                    if (history) {
                        let oldPoints = history.point_be_seen_by_em;
                        history.point_be_seen_by_em = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
                    } else {
                        point = point > POINT_LIMIT ? POINT_LIMIT : point;
                        history = new ManagePointHistory({
                            userId: userId,
                            type: userType,
                            point_to_change: point,
                            point_be_seen_by_em: point,
                            sum: point
                        });
                    }
                    await saveHistory(history);
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
    // api 
exports.endSee = async(req, res, next) => {
    try {
        let {
            idChat
        } = req.body;
        if (idChat) {
            await handleEndSee(idChat);
            return functions.success(res, "Thành công", {
                result: true
            })
        } else {
            return functions.setError(res, "Đã có lỗi xảy ra", 500);
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}