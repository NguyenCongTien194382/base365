const functions = require("../../../services/functions");
const { saveHistory, userExists } = require("./utils");
const ManagePointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");
const SaveSeeUserNewByEm = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveSeeUserNewByEm");
const User = require("../../../models/Users");

// Hoạt động xem (UV xem tin hoặc UV xem NTD , NTD xem UV)
exports.startSeeByEm = async(req, res, next) => {
    try {
        let {
            userId,
            type,
            newId,
            hostId,
            id_be_seen,
            type_be_seen,
        } = req.body;
        let userSeen = await User.findOne({ idTimViec365: userId, type: type });
        if (!userSeen) return functions.setError(res, "Không tìm thấy thông tin người dùng")
        let now = new Date().getTime() / 1000;
        now = Math.round(now);
        let start = now;
        let end = now + 1;
        let duration = 1;
        let dataInsert = {}
        let dataMatchDup = {}
        let checkNtd = false
        let checkNew = false
        if (id_be_seen && type_be_seen) checkNtd = true
        if (newId && hostId) checkNew = true
        if (!userId || !type) return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        if (!checkNtd && !checkNew) return functions.setError(res, "Thông tin truyền lên không đầy đủ", 400);
        if (checkNew) {
            let host = await User.findOne({ idTimViec365: hostId, type: 1 })
            if (!host) return functions.setError(res, "Không tìm thấy thông tin người đăng tin")
            dataInsert = {
                userId,
                type,
                start,
                end,
                duration,
                newId,
                hostId,
            }
            dataMatchDup = {
                userId,
                type,
                newId,
                hostId,
            }
        }
        if (checkNtd) {
            dataInsert = {
                userId,
                type,
                id_be_seen,
                type_be_seen,
                start,
                end,
                duration,
            }
            dataMatchDup = {
                userId,
                type,
                id_be_seen,
                type_be_seen,
            }
        }
        let isDuplicated = await SaveSeeUserNewByEm.findOne(dataMatchDup);
        if (!isDuplicated) {
            const id = await functions.getMaxIdByField(SaveSeeUserNewByEm, 'id')
            await new SaveSeeUserNewByEm({
                id,
                ...dataInsert
            }).save()
        } else {
            const check = isDuplicated.end - isDuplicated.start
            if (check <= 1) await SaveSeeUserNewByEm.updateOne(dataMatchDup, {
                start,
                end,
            })
            else {
                const id = await functions.getMaxIdByField(SaveSeeUserNewByEm, 'id')
                await new SaveSeeUserNewByEm({
                    id,
                    ...dataInsert
                }).save()
            }
        }
        // Cộng điểm NTD xem UV
        if (type === '1' && duration >= 1) {
            await SaveSeeUserNewByEm.updateOne({
                ...dataMatchDup,
                duration: 1
            }, { duration: 2 })
            let point_ntd = 1 / 300;
            let POINT_LIMIT_NTD = 10;
            let history_ntd = await ManagePointHistory.findOne({ userId: userId, type });
            if (history_ntd) {
                let oldPoints = history_ntd.point_see;
                history_ntd.point_see = oldPoints + point_ntd < POINT_LIMIT_NTD ? oldPoints + point_ntd : POINT_LIMIT_NTD;
            } else {
                point_ntd = point_ntd > POINT_LIMIT_NTD ? POINT_LIMIT_NTD : point_ntd;
                history_ntd = new ManagePointHistory({
                    userId: userId,
                    type: type,
                    point_to_change: point_ntd,
                    point_see: point_ntd,
                    sum: point_ntd
                });
            }
            await saveHistory(history_ntd);
        }
        // Cộng điểm UV xem tin
        if (type === '0' && checkNew && duration >= 1) {
            await SaveSeeUserNewByEm.updateOne({
                ...dataMatchDup,
                duration: 1
            }, { duration: 2 })
            const POINT_LIMIT = 10
            let point = 1 / 10
            let history = await ManagePointHistory.findOne({
                userId: userId,
                type: type
            })
            if (history) {
                let oldPoints = history.point_seen_new_ntd;
                history.point_seen_new_ntd = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
            } else {
                point = point > POINT_LIMIT ? POINT_LIMIT : point;
                history = new ManagePointHistory({
                    userId: userId,
                    type: 0,
                    point_seen_new_ntd: point,
                    sum: point
                });
            }
            await saveHistory(history)
        }
        // Cộng điểm UV xem NTD
        if (type === '0' && checkNtd && duration >= 1) {
            await SaveSeeUserNewByEm.updateOne({
                ...dataMatchDup,
                duration: 1
            }, { duration: 2 })
            const POINT_LIMIT = 10
            let point = 1 / 10
            let history = await ManagePointHistory.findOne({
                userId: userId,
                type: type
            })
            if (history) {
                let oldPoints = history.point_seen_new_ntd;
                history.point_seen_new_ntd = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
            } else {
                point = point > POINT_LIMIT ? POINT_LIMIT : point;
                history = new ManagePointHistory({
                    userId: userId,
                    type: 0,
                    point_seen_new_ntd: point,
                    sum: point
                });
            }
            await saveHistory(history)
        }
        return functions.success(res, "Thành công", {
            result: true
        })
    } catch (error) {
        console.log(error)
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}

exports.endSeeByEm = async(req, res, next) => {
    try {
        let web = ''
        let {
            idChat,
        } = req.body;
        if (idChat) {
            web = 'news'
            let match = {}
            if (web === 'news') match = { id_be_seen: 0, type_be_seen: 0 }
            if (web === 'ntd') match = { newId: 0, hostId: 0 }
            let user = await User.findOne({ _id: idChat });
            if (!user) return functions.setError(res, "Không tìm thấy thông tin người dùng")
            let userId = user.idTimViec365;
            let type = user.type;
            let nextPage = await SaveSeeUserNewByEm.findOne({
                duration: 2,
                userId: userId,
                type: type,
                ...match,
            }).sort({ start: -1 })
            if (nextPage) {

                const id = nextPage.id
                const newId = nextPage.newId
                const hostId = nextPage.hostId
                const id_be_seen = nextPage.id_be_seen
                const type_be_seen = nextPage.type_be_seen
                const start = nextPage.start
                const end = nextPage.end
                const now = functions.getTimeNow()
                const duration = now - start
                if (end - start <= 2) {
                    await SaveSeeUserNewByEm.updateOne({ id }, {
                        end: now,
                        duration,
                    })

                    // // UV xem NTD
                    // if(type === 0 && id_be_seen !== 0 && type_be_seen === 1){
                    //     // Cộng điểm UV
                    //     const POINT_LIMIT = 10
                    //     let point = 1/10
                    //     let history = await ManagePointHistory.findOne({
                    //         userId: userId,
                    //         type: type
                    //     })
                    //     if(history){
                    //         let oldPoints = history.point_seen_new_ntd;
                    //         history.point_seen_new_ntd = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
                    //     }
                    //     else {
                    //         point = point > POINT_LIMIT? POINT_LIMIT: point;
                    //         history = new ManagePointHistory({
                    //             userId: userId,
                    //             type: 0,
                    //             point_seen_new_ntd: point,
                    //             sum: point
                    //         });
                    //     }
                    //     await saveHistory(history)
                    // }

                    // UV xem tin
                    if (newId !== 0 && hostId !== 0) {
                        // // Cộng điểm UV
                        // const POINT_LIMIT = 10
                        // let point = 1/10
                        // let history = await ManagePointHistory.findOne({
                        //     userId: userId,
                        //     type: type
                        // })
                        // if(history){
                        //     let oldPoints = history.point_seen_new_ntd;
                        //     history.point_seen_new_ntd = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
                        // }
                        // else {
                        //     point = point > POINT_LIMIT? POINT_LIMIT: point;
                        //     history = new ManagePointHistory({
                        //         userId: userId,
                        //         type: 0,
                        //         point_seen_new_ntd: point,
                        //         sum: point
                        //     });
                        // }
                        // await saveHistory(history)

                        // Cộng điểm NTD
                        const POINT_LIMIT_NTD = 10
                        let point_ntd = duration / 3 / 60
                        let history_ntd = await ManagePointHistory.findOne({
                            userId: hostId,
                            type: 1,
                        })
                        if (history_ntd) {
                            let oldPoints = history_ntd.point_be_seen_by_em;
                            history_ntd.point_be_seen_by_em = oldPoints + point_ntd < POINT_LIMIT_NTD ? oldPoints + point_ntd : POINT_LIMIT_NTD;
                        } else {
                            point_ntd = point_ntd > POINT_LIMIT_NTD ? POINT_LIMIT_NTD : point_ntd;
                            history_ntd = new ManagePointHistory({
                                userId: hostId,
                                type: 1,
                                point_to_change: point_ntd,
                                point_be_seen_by_em: point_ntd,
                                sum: point_ntd
                            });
                        }
                        await saveHistory(history_ntd);
                    }

                    // NTD xem UV
                    if (type === 1 && id_be_seen !== 0 && type_be_seen === 0) {
                        // // Cộng điểm NTD
                        // let point_ntd = 1 / 300;
                        // let POINT_LIMIT_NTD = 10;
                        // let history_ntd = await ManagePointHistory.findOne({ userId: userId, type });
                        // if (history_ntd) {
                        //     let oldPoints = history_ntd.point_see;
                        //     history_ntd.point_see = oldPoints + point_ntd < POINT_LIMIT_NTD ? oldPoints + point_ntd : POINT_LIMIT_NTD;
                        // } else {
                        //     point_ntd = point_ntd > POINT_LIMIT_NTD ? POINT_LIMIT_NTD : point_ntd;
                        //     history_ntd = new ManagePointHistory({
                        //         userId: userId,
                        //         type: type,
                        //         point_to_change: point_ntd,
                        //         point_see: point_ntd,
                        //         sum: point_ntd
                        //     });
                        // }
                        // await saveHistory(history_ntd);

                        // Cộng điểm UV
                        const POINT_LIMIT = 10
                        let point = duration / 5 / 60
                        let history = await ManagePointHistory.findOne({
                            userId: id_be_seen,
                            type: 0,
                        })
                        if (history) {
                            let oldPoints = history.point_ntd_seen;
                            history.point_ntd_seen = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
                        } else {
                            point = point > POINT_LIMIT ? POINT_LIMIT : point;
                            history = new ManagePointHistory({
                                userId: id_be_seen,
                                type: 0,
                                point_ntd_seen: point,
                                sum: point
                            });
                        }
                        await saveHistory(history)
                    }
                }
                return functions.success(res, "Thành công", {
                    result: true
                })
            }
        }
        if (idChat) {
            web = 'ntd'
            let match = {}
            if (web === 'news') match = { id_be_seen: 0, type_be_seen: 0 }
            if (web === 'ntd') match = { newId: 0, hostId: 0 }
            let user = await User.findOne({ _id: idChat });
            if (!user) return functions.setError(res, "Không tìm thấy thông tin người dùng")
            let userId = user.idTimViec365;
            let type = user.type;
            let nextPage = await SaveSeeUserNewByEm.findOne({
                duration: 2,
                userId: userId,
                type: type,
                ...match,
            }).sort({ start: -1 })
            if (nextPage) {
                const id = nextPage.id
                const newId = nextPage.newId
                const hostId = nextPage.hostId
                const id_be_seen = nextPage.id_be_seen
                const type_be_seen = nextPage.type_be_seen
                const start = nextPage.start
                const end = nextPage.end
                const now = functions.getTimeNow()
                const duration = now - start
                if (end - start <= 2) {
                    await SaveSeeUserNewByEm.updateOne({ id }, {
                        end: now,
                        duration,
                    })

                    // // UV xem NTD
                    // if(type === 0 && id_be_seen !== 0 && type_be_seen === 1){
                    //     // Cộng điểm UV
                    //     const POINT_LIMIT = 10
                    //     let point = 1/10
                    //     let history = await ManagePointHistory.findOne({
                    //         userId: userId,
                    //         type: type
                    //     })
                    //     if(history){
                    //         let oldPoints = history.point_seen_new_ntd;
                    //         history.point_seen_new_ntd = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
                    //     }
                    //     else {
                    //         point = point > POINT_LIMIT? POINT_LIMIT: point;
                    //         history = new ManagePointHistory({
                    //             userId: userId,
                    //             type: 0,
                    //             point_seen_new_ntd: point,
                    //             sum: point
                    //         });
                    //     }
                    //     await saveHistory(history)
                    // }

                    // UV xem tin
                    if (newId !== 0 && hostId !== 0) {
                        // // Cộng điểm UV
                        // const POINT_LIMIT = 10
                        // let point = 1/10
                        // let history = await ManagePointHistory.findOne({
                        //     userId: userId,
                        //     type: type
                        // })
                        // if(history){
                        //     let oldPoints = history.point_seen_new_ntd;
                        //     history.point_seen_new_ntd = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
                        // }
                        // else {
                        //     point = point > POINT_LIMIT? POINT_LIMIT: point;
                        //     history = new ManagePointHistory({
                        //         userId: userId,
                        //         type: 0,
                        //         point_seen_new_ntd: point,
                        //         sum: point
                        //     });
                        // }
                        // await saveHistory(history)

                        // Cộng điểm NTD
                        const POINT_LIMIT_NTD = 10
                        let point_ntd = duration / 3 / 60
                        let history_ntd = await ManagePointHistory.findOne({
                            userId: hostId,
                            type: 1,
                        })
                        if (history_ntd) {
                            let oldPoints = history_ntd.point_be_seen_by_em;
                            history_ntd.point_be_seen_by_em = oldPoints + point_ntd < POINT_LIMIT_NTD ? oldPoints + point_ntd : POINT_LIMIT_NTD;
                        } else {
                            point_ntd = point_ntd > POINT_LIMIT_NTD ? POINT_LIMIT_NTD : point_ntd;
                            history_ntd = new ManagePointHistory({
                                userId: hostId,
                                type: 1,
                                point_to_change: point_ntd,
                                point_be_seen_by_em: point_ntd,
                                sum: point_ntd
                            });
                        }
                        await saveHistory(history_ntd);
                    }

                    // NTD xem UV
                    if (type === 1 && id_be_seen !== 0 && type_be_seen === 0) {
                        // // Cộng điểm NTD
                        // let point_ntd = 1 / 300;
                        // let POINT_LIMIT_NTD = 10;
                        // let history_ntd = await ManagePointHistory.findOne({ userId: userId, type });
                        // if (history_ntd) {
                        //     let oldPoints = history_ntd.point_see;
                        //     history_ntd.point_see = oldPoints + point_ntd < POINT_LIMIT_NTD ? oldPoints + point_ntd : POINT_LIMIT_NTD;
                        // } else {
                        //     point_ntd = point_ntd > POINT_LIMIT_NTD ? POINT_LIMIT_NTD : point_ntd;
                        //     history_ntd = new ManagePointHistory({
                        //         userId: userId,
                        //         type: type,
                        //         point_to_change: point_ntd,
                        //         point_see: point_ntd,
                        //         sum: point_ntd
                        //     });
                        // }
                        // await saveHistory(history_ntd);

                        // Cộng điểm UV
                        const POINT_LIMIT = 10
                        let point = duration / 5 / 60
                        let history = await ManagePointHistory.findOne({
                            userId: id_be_seen,
                            type: 0,
                        })
                        if (history) {
                            let oldPoints = history.point_ntd_seen;
                            history.point_ntd_seen = oldPoints + point < POINT_LIMIT ? oldPoints + point : POINT_LIMIT;
                        } else {
                            point = point > POINT_LIMIT ? POINT_LIMIT : point;
                            history = new ManagePointHistory({
                                userId: id_be_seen,
                                type: 0,
                                point_ntd_seen: point,
                                sum: point
                            });
                        }
                        await saveHistory(history)
                    }
                }
            }
            return functions.success(res, "Thành công", {
                result: true
            })
        } else {
            return functions.setError(res, "Thiếu thông tin truyền lên", 500);
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, "Đã có lỗi xảy ra", 500);
    }
}