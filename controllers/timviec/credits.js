const functions = require('../../services/functions');
const CreditsHistory = require('../../models/Timviec365/UserOnSite/Company/ManageCredits/CreditsHistory');
const SaveExchangePointMoney = require('../../models/Timviec365/UserOnSite/ManageHistory/SaveExchangePointMoney');
const SaveExchangePoint = require('../../models/Timviec365/UserOnSite/ManageHistory/SaveExchangePoint');
const ManagePointHistory = require('../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory');
const PointCompany = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany')
const NewTV365 = require('../../models/Timviec365/UserOnSite/Company/New')
const Users = require('../../models/Users');

const getIP = (req) => {
    let forwardedIpsStr = req.header('x-forwarded-for');
    let ip = '';
    if (forwardedIpsStr) {
        ip = forwardedIpsStr.split(',')[0];
    } else {
        ip = req.socket.remoteAddress
    }
    return ip;
}


const recordCreditsHistory = async(usc_id, type, amount, admin_id, ip_user, content, balance, action, content_id) => {
    let _id = 0;
    let latestHistory = await CreditsHistory.findOne({}).sort({ _id: -1 });
    if (latestHistory) _id = latestHistory._id + 1;
    let doc = await (new CreditsHistory({
        //idTimViec365
        usc_id,
        _id,
        amount,
        /**
         * Loại lịch sử: 
         * - 0: Sử dụng
         * - 1: Nạp tiền
         */
        type,
        used_day: functions.getTimeNow(),
        admin_id,
        ip_user,
        content,
        balance,
        action,
        content_id
    })).save()
    return doc
}

exports.recordCreditsHistory = recordCreditsHistory;

const recordSaveExchangePoint = async(usc_id, point, money, point_later) => {
    let id = 0;
    let creditExchangeHistory = await SaveExchangePointMoney.findOne({}).sort({ id: -1 })
    if (creditExchangeHistory) {
        id = creditExchangeHistory.id + 1;
    }
    let doc = await (new SaveExchangePointMoney({
        id,
        userId: usc_id,
        userType: 1,
        point,
        money,
        point_later,
        is_used: 1,
        time: functions.getTimeNow(),
    })).save()
    return doc
}

//Validate và lấy ID timviec365
const getTimviec365Id = async(req, res) => {
    if (!req.user || !req.user.data) return false;
    let usc_id = req.user.data.idTimViec365;
    let company = await Users.findOne({ idTimViec365: usc_id, type: 1 });
    if (!company) {
        return false;
    }
    return usc_id;
}

const createNewManagePointHistory = async(usc_id) => {
    let id = 0;
    let pointHistory = await ManagePointHistory.findOne().sort({ id: -1 });
    if (pointHistory) id = num(pointHistory.id) + 1;
    await new ManagePointHistory({ id, userId: usc_id }).save();
}

const handleHistoryPointUpdate = async(history, newPoints, amount) => {
    let percentage = 1 - (newPoints / history.point_to_change);
    let points = history.point_to_change - newPoints;
    let fields = [
            "point_time_active",
            "point_see",
            "point_use_point",
            "point_share_social_new",
            "point_share_social_url",
            "point_share_social_user",
            "point_vote",
            "point_next_page",
            "point_see_em_apply",
            "point_vip",
            "point_TiaSet",
            "point_comment",
            "point_ntd_comment",
            "point_be_seen_by_em",
            "point_content_new"
        ]
        //Trừ đều điểm của tất cả trường điểm theo % thay đổi
    fields.forEach(field => {
        history[field] -= num(history[field]) * percentage;
    })
    history.point_to_change = newPoints;
    await recordSaveExchangePoint(history.userId, points, amount, newPoints);
    let usedPoints = await getTotalUsedHistoryPoint(history.userId);
    //Trường sum là tổng cả điểm đã dùng và chưa dùng
    history.sum = history.point_to_change + usedPoints;
    await history.save();
}
exports.handleHistoryPointUpdate = handleHistoryPointUpdate;

function num(value) {
    if (!value) return 0;
    return Number(value);
}

const getTotalUsedHistoryPoint = async(usc_id) => {
    try {
        let exchangeHistoryMoney = await SaveExchangePointMoney.find({ userId: usc_id });
        let exchangeHistory = await SaveExchangePoint.find({ userId: usc_id });
        let totalEH;
        let totalEHM;
        if (!exchangeHistory || !exchangeHistory.length) totalEH = 0;
        if (!exchangeHistoryMoney || !exchangeHistoryMoney.length) totalEHM = 0;
        totalEH = exchangeHistory.reduce((acc, val) => acc + num(val.point), 0);
        totalEHM = exchangeHistoryMoney.reduce((acc, val) => acc + num(val.point), 0);
        return totalEH + totalEHM;
    } catch (error) {
        console.log(error);
        return null;
    }
}

exports.getTotalUsedHistoryPoint = getTotalUsedHistoryPoint;

const useCreditsHandler = async(usc_id, amount, action, content, content_id, ip = "") => {
    try {
        let pointCompany = await PointCompany.findOne({ usc_id });
        if (!pointCompany) {
            await (new PointCompany({
                usc_id: usc_id,
                money_usc: 0,
            })).save();
            return false;
        }
        if (pointCompany.money_usc < amount)
            return false;
        let doc = await PointCompany.findOneAndUpdate({ usc_id }, { $inc: { money_usc: -amount } }, { new: true });
        await recordCreditsHistory(
            usc_id,
            0,
            amount,
            null,
            ip,
            content,
            doc.money_usc,
            action,
            content_id);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
exports.useCreditsHandler = useCreditsHandler;

exports.useCreditsToRefreshNew = (amount) => {
    return async(req, res, next) => {
        try {
            let {
                new_id
            } = req.body;
            let newTV365 = await NewTV365.findOne({ new_id });
            if (!newTV365) return functions.setError(res, "Không tồn tại tin có ID này", 400);
            let usc_id = await getTimviec365Id(req, res);
            if (!usc_id) return functions.setError(res, "Không tồn tại công ty có ID này", 400);
            let result = await useCreditsHandler(
                usc_id,
                amount,
                2,
                newTV365.new_title,
                newTV365.new_id,
                getIP(req));
            if (result) {
                next();
            } else {
                return functions.setError(res, "Tài khoản của bạn không đủ để thực hiện hành động này", 400);
            }
        } catch (error) {
            console.log(error);
            return functions.setError(res, error)
        }
    }
}

exports.exchangePointToCredits = async(req, res) => {
    try {
        let {
            points
        } = req.body;
        let usc_id = await getTimviec365Id(req, res);
        if (!usc_id) return functions.setError(res, "Không tồn tại công ty có ID này", 400);;
        if (points) {
            points = Number(points);
            //Kiểm tra xem trường point có phải số nguyên hay không
            if (!Number.isInteger(points)) return functions.setError(res, "Trường point phải là số nguyên", 429);
            let pointHistory = await ManagePointHistory.findOne({ userId: usc_id });
            //Nếu chưa tồn tại lịch sử điểm uy tín thì tạo mới và trả 400 vì chưa có điểm 
            if (!pointHistory) {
                await createNewManagePointHistory(usc_id);
                return functions.setError(res, "Không đủ điểm để quy đổi", 400);
            }
            let availablePoints = num(pointHistory.point_to_change);
            if (points > availablePoints) return functions.setError(res, "Không đủ điểm để quy đổi", 400);

            const multiplier = 1000;
            const amount = points * multiplier;
            //Trừ đi số điểm đã đổi
            await handleHistoryPointUpdate(pointHistory, availablePoints - points, amount);
            //Tăng money cho người dùng
            let exists = await PointCompany.findOne({ usc_id });
            let doc;
            if (!exists) {
                doc = await (new PointCompany({
                    usc_id: usc_id,
                    money_usc: amount,
                })).save();
            } else {
                doc = await PointCompany.findOneAndUpdate({ usc_id }, { $inc: { money_usc: amount } }, { new: true });
            }
            //Ghi lại lịch sử
            await recordCreditsHistory(
                usc_id,
                2,
                amount,
                null,
                getIP(req),
                `Đổi ${functions.formatMoney(String(amount))} VND từ điểm uy tín`,
                doc.money_usc,
                4);
            return functions.success(res, "Đổi điểm thành công!")
        } else {
            return functions.setError(res, "Thiếu các trường cần thiết", 429);
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.getCreditBalance = async(req, res) => {
    try {
        let usc_id = await getTimviec365Id(req, res);
        if (!usc_id) return functions.setError(res, "Không tồn tại công ty có ID này", 400);;
        let doc = await PointCompany.findOne({ usc_id });
        if (!doc) {
            doc = await (new PointCompany({
                usc_id: usc_id,
                money_usc: 0,
            })).save();
        }
        return functions.success(res, "Thành công!", { money_usc: doc.money_usc ? doc.money_usc : 0 });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.getCreditsHistory = async(req, res) => {
    try {
        let {
            action,
            fromDate,
            toDate,
            page,
            limit
        } = req.query
        page = page - 1;
        let usc_id = await getTimviec365Id(req, res);
        let query = {};

        query['usc_id'] = usc_id;
        if (!fromDate || isNaN(Number(fromDate))) fromDate = 0;
        if (!toDate || isNaN(Number(toDate))) toDate = functions.getTimeNow();
        query["used_day"] = { $gte: fromDate, $lte: toDate };

        if (action) query['action'] = action;

        let docs = await CreditsHistory
            .find(query)
            .sort({ used_day: -1 })
            .skip(page * limit)
            .limit(limit);
        let count = await CreditsHistory.find(query).count();
        return functions.success(res, "Thành công!", { data: docs, count: count });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.getManagePointHistory = async(req, res) => {
    try {
        let { userId, userType } = req.body;
        if (!userId || !userType) return functions.setError(res, "Thiếu data truyền lên", 400);;
        let docs = await ManagePointHistory.findOne({ userId: userId, type: userType });
        return functions.success(res, "Thành công!", { data: docs });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.getCreditExchangeHistory = async(req, res) => {
    try {
        let usc_id = await getTimviec365Id(req, res);
        if (!usc_id) return functions.setError(res, "Không tồn tại công ty có ID này", 400);;
        let docs = await SaveExchangePointMoney.find({ userId: usc_id });
        return functions.success(res, "Thành công!", { data: docs });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}

exports.success = async(req, res) => {
    try {
        return functions.success(res, "Thành công!");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error)
    }
}