const Users = require('../../models/Users');
const applyForJob = require('../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');
const Tv365PointCompany = require('../../models/Timviec365/UserOnSite/Company/ManagerPoint/PointCompany');
const functions = require('../../services/functions');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017/api-base365";
let db;
let dbo
let connect = async() => {
    db = await MongoClient.connect(url);
    dbo = db.db("api-base365");
};
connect();

// xem người dùng này ứng với bao nhiêu điểm 

// Định nghũa 
// chỉ có 2 lựa chọn cho người dùng 
// 1. chỉ chat 
// 2. mở thông tin ứng viên bao gồm cả chat, cả xem thông tin 

let listException = [1111123088, 1111123087, 1111123077, 1111123061, 1111122950, 1111123093, 1111123086, 1111123077]
exports.checkPointUser = async(req, res) => {
    try {
        let usc_id = Number(req.body.usc_id);
        let userId = Number(req.body.userId);
        let status = Number(req.body.status);
        // 1: chỉ chat 
        // 2: chỉ xem thông tin ứng viên 
        // 3: xem cả chat và thông tin ứng viên 

        let point = 0;
        let level = 0;
        let user = await Users.findOne({ idTimViec365: userId, type: { $ne: 1 } }, { password: 0, email: 0, phoneTK: 0 }).lean();
        let isAnhSao = (user && user.inForPerson && user.inForPerson.candidate) ? user.inForPerson.candidate.anhsao_badge : 0;
        let star3 = (user && user.inForPerson && user.inForPerson.candidate && user.inForPerson.candidate.star3) ? user.inForPerson.candidate.star3 : 0;
        let time_active_star3 = (user && user.inForPerson && user.inForPerson.candidate && user.inForPerson.candidate.time_active_star3) ? user.inForPerson.candidate.time_active_star3 : 0;
        let timeago = new Date().getTime() / 1000 - 48 * 3600;
        if (time_active_star3 < timeago) {
            star3 = 0;
        };

        if (isAnhSao == 1) {
            level = 1;
        };

        let time = Number((new Date().getTime() / 1000 - 48 * 3600).toFixed(0));
        let check_hoso = await applyForJob.findOne({ nhs_use_id: userId, nhs_time: { $gte: time }, nhs_kq: { $nin: [10, 11] } });
        if (check_hoso) {
            level = 2;
        }

        if (star3 == 1) {
            level = 3;
        }

        if (level == 0) {
            point = 1
        }
        if (level == 1) {
            point = 2
        }
        if (level == 2) {
            point = 3
        }
        if (level == 3) {
            point = 5;
        };

        let level_origin = level;
        // nếu còn điểm ở bảng cũ thì điểm mặc định ở mức thấp nhất 
        let data_diem = await dbo
            .collection('Tv365PointCompanyOld')
            .find({
                usc_id: usc_id
            })
            .toArray();
        if (data_diem && data_diem.length) {
            data_diem = data_diem[0];
            if (data_diem.point_usc > 0) {
                level = 0;
                point = 1;
            }
        };

        // check exception 
        if (listException.find((e) => e == usc_id)) {
            point = 1;
        }

        // nếu mớ cả chat thì nhân đôi 
        if (status == 3) {
            point = point * 2;
        };

        return functions.success(res, "Thông tin điểm", {
            data: {
                usc_id: usc_id,
                point: point,
                level: level,
                level_origin: level_origin,
                userId: userId,
                user,
                //anhsao_infor: user.inForPerson.candidate.anhsao_badge
            }
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message)
    }
}

// lấy danh sách người dùng đạt huy hiệu ánh sao 
exports.takeListUserBadge = async(req, res) => {
    try {
        const pageSize = req.body.pageSize ? Number(req.body.pageSize) : 30;
        const page = req.body.page ? Number(req.body.page) : 1;
        let skip = (page - 1) * pageSize;
        let time = new Date().getTime() / 1000 - 48 * 3600;
        time = Number(time.toFixed(0));
        let condition = {
            idTimViec365: { $ne: 0 },
            type: { $ne: 1 },
            "inForPerson.candidate": { $ne: null }
        };
        if (req.body.cv_cate_id) {
            condition["inForPerson.candidate.cv_cate_id"] = { $all: [Number(req.body.cv_cate_id)] }
        };
        if (req.body.cv_city_id) {
            condition["inForPerson.candidate.cv_city_id"] = { $all: [Number(req.body.cv_city_id)] }
        };
        let matchor = [];
        if (Number(req.body.level) == 1) {
            matchor.push({
                "inForPerson.candidate.anhsao_badge": 1, // ánh sao thường
                "inForPerson.candidate.star3": { $ne: 1 },
                "ApplyForJob.nhs_time": { $lte: time }
            });
        } else if (Number(req.body.level) == 2) {
            matchor.push({
                "ApplyForJob.nhs_time": { $gte: time }, // ánh sao thường
                "ApplyForJob.nhs_kq": { $nin: [10, 11] },
                "inForPerson.candidate.star3": { $ne: 1 },
            });

        } else if (Number(req.body.level) == 3) {
            let timeago = new Date().getTime() / 1000 - 48 * 3600;
            matchor.push({
                "inForPerson.candidate.star3": 1, // ánh sao thường
                "inForPerson.candidate.time_active_star3": { $gte: timeago }
            })
        } else {
            matchor = [{
                    "inForPerson.candidate.anhsao_badge": 1 // ánh sao thường
                },
                {
                    "ApplyForJob.nhs_time": { $gte: time },
                    "ApplyForJob.nhs_kq": { $nin: [10, 11] }
                },
                {
                    "inForPerson.candidate.star3": 1 // ánh sao cấp 3
                }
            ]
        };
        let aggregation = [{
                $sort: {
                    updatedAt: -1
                }
            },
            {
                $match: condition
            },
            {
                $lookup: {
                    from: 'ApplyForJob',
                    localField: 'idTimViec365',
                    foreignField: 'nhs_use_id',
                    as: 'ApplyForJob'
                }
            },
            {
                $match: {
                    $or: matchor
                }
            },
            {
                $skip: skip
            },
            {
                $limit: pageSize
            }
        ]
        let listUser = await Users.aggregate(aggregation)

        let listFinal = [];
        for (let i = 0; i < listUser.length; i++) {
            let obj = listUser[i];
            let level = 0;
            if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.anhsao_badge) {
                if (obj.inForPerson.candidate.anhsao_badge == 1) {
                    level = 1;
                }
            };
            let listJobApply = obj.ApplyForJob;
            if (listJobApply.find((e) => (e.nhs_time >= time))) {
                level = 2;
            };
            if (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.star3) {
                if (obj.inForPerson.candidate.star3 == 1) {
                    level = 3;
                };
            }
            if (level > 0) {
                // check lại loại ứng viên phải là trạng thái điểm cao nhất 
                let flag = true;
                if (Number(req.body.level) == 1) {
                    if (listJobApply.find((e) => (e.nhs_time >= time))) {
                        flag = false;
                    }
                };
                if (flag) {
                    listFinal.push({
                        use_gioi_tinh: (obj.inForPerson && obj.inForPerson.account && obj.inForPerson.account.gender) ? obj.inForPerson.account.gender : 1,
                        use_logo: functions.getImageUv(
                            obj.createdAt,
                            obj.avatarUser
                        ),
                        use_create_time: obj.createdAt,
                        use_update_time: obj.updatedAt,
                        use_first_name: obj.userName,
                        use_id: obj.idTimViec365,
                        chat365_id: obj._id,
                        cv_title: (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_title) ? obj.inForPerson.candidate.cv_title : "",
                        cv_city_id: (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_city_id) ? obj.inForPerson.candidate.cv_city_id : [],
                        cv_cate_id: (obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_cate_id) ? obj.inForPerson.candidate.cv_cate_id : [],
                        use_city: obj.city || 0,
                        use_quanhuyen: obj.district || 0,
                        userName: obj.userName,
                        cv_exp: (obj.inForPerson && obj.inForPerson.account && obj.inForPerson.account.experience) ? obj.inForPerson.account.experience : 0,
                        isOnline: obj.isOnline,
                        level,
                    });
                }
            }
        }
        return res.json({
            data: {
                listUser: listFinal,
                aggregation
            }
        });
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.setUpToDiamond = async(req, res) => {
    try {
        const userId = Number(req.body.userId);
        const status = Number(req.body.status);
        // console.log(req.body);
        await Users.updateMany({ idTimViec365: userId, type: 0 }, {
            $set: {
                "inForPerson.candidate.star3": status,
                "inForPerson.candidate.time_active_star3": new Date().getTime() / 1000
            }
        });
        // console.log("Update thành công")
        return res.json({
            data: {
                message: "Thành công"
            }
        })
    } catch (error) {
        return functions.setError(res, error.message)
    }
}

exports.checkPointUserForUsed = async(req, res) => {
    try {
        //console.log("trù ngầm checkPointUserForUsed", req.body)
        let usc_id = Number(req.body.usc_id);
        let userId = Number(req.body.userId);
        let status = Number(req.body.status);
        // 1: chỉ chat 
        // 2: chỉ xem thông tin ứng viên 
        // 3: xem cả chat và thông tin ứng viên 

        let point = 0;
        let level = 0;
        let user = await Users.findOne({ idTimViec365: userId, type: { $ne: 1 } }, { password: 0, email: 0, phoneTK: 0 }).lean();
        let isAnhSao = (user.inForPerson && user.inForPerson.candidate) ? user.inForPerson.candidate.anhsao_badge : 0;
        let star3 = (user.inForPerson && user.inForPerson.candidate && user.inForPerson.candidate.star3) ? user.inForPerson.candidate.star3 : 0;
        let time_active_star3 = (user && user.inForPerson && user.inForPerson.candidate && user.inForPerson.candidate.time_active_star3) ? user.inForPerson.candidate.time_active_star3 : 0;
        let timeago = new Date().getTime() / 1000 - 48 * 3600;
        if (time_active_star3 < timeago) {
            star3 = 0;
        };

        if (isAnhSao == 1) {
            level = 1;
        };

        let time = Number((new Date().getTime() / 1000 - 48 * 3600).toFixed(0));
        let check_hoso = await applyForJob.findOne({ nhs_use_id: userId, nhs_time: { $gte: time }, nhs_kq: { $nin: [10, 11] } });
        if (check_hoso) {

            level = 2;
        }

        if (star3 == 1) {
            level = 3;
        }

        if (level == 0) {
            point = 1
        }
        if (level == 1) {
            point = 2
        }
        if (level == 2) {
            point = 3
        }
        if (level == 3) {
            point = 5;
        };

        let level_origin = level;
        // nếu còn điểm ở bảng cũ thì điểm mặc định ở mức thấp nhất 
        let data_diem = await dbo
            .collection('Tv365PointCompanyOld')
            .find({
                usc_id: usc_id
            })
            .toArray();
        // console.log("data_diem", data_diem);
        if (data_diem && data_diem.length) {
            data_diem = data_diem[0];
            if (data_diem.point_usc > 0) {
                level = 0;
                point = 1;
            }
        };
        // check exception 
        if (listException.find((e) => e == usc_id)) {
            point = 1;
        }
        // nếu mớ cả chat thì nhân đôi 
        if (status == 3) {
            point = point * 2;
        };

        // trừ điểm cũ
        if (data_diem) {
            //console.log("Điểm cũ", data_diem.point_usc);
            //console.log("Điểm mới", data_diem.point_usc - point)
            await dbo.collection('Tv365PointCompanyOld').updateOne({
                usc_id: usc_id
            }, {
                $set: {
                    point_usc: data_diem.point_usc - point
                }
            })
        }

        return functions.success(res, "Thông tin điểm", {
            data: {
                usc_id: usc_id,
                point: point,
                level: level,
                level_origin: level_origin,
                userId: userId,
                user,
                anhsao_infor: user.inForPerson.candidate.anhsao_badge
            }
        });
    } catch (error) {
        return functions.setError(res, error.message)
    }
}