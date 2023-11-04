const campainList = require('../../models/Timviec365/Campain/Campain');
const pointList = require('../../models/Timviec365/Campain/Point');
const functions = require('../../services/functions');
const Users = require('../../models/Users');
const NewTV365 = require('../../models/Timviec365/UserOnSite/Company/New');

// nạp điểm

exports.addPoint = async(req, res) => {
    try {
        const { user_id, cd_diem, user_type } = req.body;
        if (user_id && cd_diem) {
            let CheckPoint = await pointList
                .findOne({ user_id: user_id })
                .lean();
            if (CheckPoint) {
                await pointList.updateOne({
                    user_id: { $in: CheckPoint.user_id },
                    user_type: { $in: CheckPoint.user_type },
                }, { $inc: { cd_diem: cd_diem } });
            } else {
                const Campain = new pointList({
                    user_id: user_id,
                    cd_diem: cd_diem,
                    user_type,
                });
                await Campain.save(); // chạy đồng bộ
            }
            return functions.success(res, 'Nạp thành công');
        } else {
            return functions.setError(res, 'Cần điền đầy đủ thông tin', 400);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// danh sách điểm nạp
exports.getPointList = async(req, res) => {
    try {
        let { user_id, user_type, limit, page } = req.body;
        page = Number(page);
        limit = Number(limit);
        if (!page) page = 1;
        if (!limit) limit = 10;
        let skip = limit * (page - 1);
        let match = {};
        if (user_id) {
            match = { user_id: Number(user_id), user_type: Number(user_type) };
        }

        let data = await pointList.aggregate([{
                $match: match,
            },
            {
                $lookup: {
                    from: 'Users',
                    let: {
                        user_id: '$user_id',
                        user_type: '$user_type',
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$idTimViec365', '$$user_id'] },
                                    { $eq: ['$type', '$$user_type'] },
                                ],
                            },
                        },
                    }, ],
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            { $skip: skip },
            { $limit: limit },
            {
                $sort: {
                    cd_diem: -1,
                },
            },
            {
                $project: {
                    cd_diem: '$cd_diem',
                    user_id: '$user_id',
                    user_type: '$user_type',
                    comName: '$user.userName',
                    email: '$user.email',
                    phoneTK: '$user.phoneTK',
                },
            },
        ]);
        let total = data.length;
        return functions.success(res, 'Danh sách ngân sách', { data, total });
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// danh sách chiến dịch
exports.getcampainList = async(req, res) => {
    try {
        let { user_id, user_type, limit, page } = req.body;
        let query = {
            user_id: Number(user_id),
            user_type: Number(user_type),
            cd_trangthai: { $ne: 3 },
        };
        if (!page) page = 1;
        if (!limit) limit = 10;
        let skip = limit * (page - 1);
        let count = await campainList.countDocuments(query); // Tính tổng số bản ghi thỏa mãn query
        let data = await campainList
            .find(query)
            .sort({ cd_id: -1 })
            .skip(skip)
            .limit(limit) // Giới hạn số bản ghi trên mỗi trang
            .lean(); {
            return functions.success(res, 'Danh sách chiến dịch', {
                data: { data, count },
            });
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// thêm chiến dịch

exports.addCampain = async(req, res) => {
    try {
        const {
            cd_tin,
            cd_timestart,
            cd_timeend,
            cd_checkbox,
            cd_gpa,
            cd_goiy,
            cd_tukhoa,
            cd_ngansach,
            user_id,
        } = req.body;
        let cd_id = 0;
        let gpa;
        if (cd_checkbox == 1) {
            gpa = cd_gpa;
        } else {
            let CampainGpa = await campainList
                .findOne({})
                .sort({ cd_gpa: -1 })
                .lean();
            gpa = CampainGpa.cd_gpa;
        }
        let PointCheck = await pointList
            .findOne({ user_id: user_id, cd_diem: { $gt: cd_ngansach } })
            .lean();
        if (PointCheck) {
            if (gpa < cd_ngansach) {
                let CampainMax = await campainList
                    .findOne({})
                    .sort({ cd_id: -1 })
                    .lean();
                if (CampainMax) {
                    cd_id = Number(CampainMax.cd_id) + 1;
                }
                const Campain = new campainList({
                    cd_id: cd_id,
                    cd_tin: cd_tin,
                    cd_timestart: cd_timestart,
                    cd_timeend: cd_timeend,
                    cd_checkbox: cd_checkbox,
                    cd_gpa: gpa,
                    cd_goiy: cd_goiy,
                    cd_tukhoa: cd_tukhoa,
                    cd_ngansach: cd_ngansach,
                    user_id: user_id,
                    cd_cpm: cd_gpa * 0.1,
                    cd_cpc: cd_gpa * 0.2,
                    cd_chuyendoi: cd_gpa * 0.5,
                });
                await pointList.findOneAndUpdate({ user_id: user_id }, { $inc: { cd_diem: -cd_ngansach } });
                await Campain.save(); // chạy đồng bộ
                return functions.success(res, 'Thành công');
            } else {
                return functions.setError(
                    res,
                    'GPA phải ít hơn ngân sách, vui lòng nhập lại!',
                    400
                );
            }
        } else {
            return functions.setError(
                res,
                'Bạn không đủ điểm, hãy nạp điểm ngay!',
                400
            );
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// chỉnh sửa chiến dịch thay đổi gpa và thêm ngân sách

exports.editCampain = async(req, res) => {
    try {
        let { cd_id, cd_gpa, cd_ngansach, user_id } = req.body;
        let cd = await campainList
            .findOne({ user_id: user_id, cd_id: cd_id })
            .lean();
        if (cd_gpa < cd.cd_ngansach && cd_gpa && cd_ngansach) {
            // const user_id = await campainList
            let PointCheck = await pointList
                .findOne({ user_id: user_id, cd_diem: { $gt: cd_ngansach } })
                .lean();
            if (PointCheck) {
                await campainList.findOneAndUpdate({ cd_id: cd_id }, {
                    cd_gpa: cd_gpa,
                    $inc: { cd_ngansach: cd_ngansach },
                    cd_cpm: cd_gpa * 0.1,
                    cd_cpc: cd_gpa * 0.2,
                    cd_chuyendoi: cd_gpa * 0.5,
                });
                await pointList.findOneAndUpdate({ user_id: user_id }, { $inc: { cd_diem: -cd_ngansach } });
                return functions.success(res, 'chỉnh sửa thành công!');
            } else {
                return functions.setError(
                    res,
                    'GPA phải ít hơn ngân sách hiện tại, vui lòng nhập lại!',
                    400
                );
            }
        } else {
            if (cd_gpa && cd_gpa < cd.cd_ngansach) {
                await campainList.findOneAndUpdate({ cd_id: cd_id }, {
                    cd_gpa: cd_gpa,
                    cd_cpm: cd_gpa * 0.1,
                    cd_cpc: cd_gpa * 0.2,
                    cd_chuyendoi: cd_gpa * 0.5,
                });
                return functions.success(res, 'chỉnh sửa thành công!');
            } else {
                if (cd_ngansach) {
                    let PointCheck = await pointList
                        .findOne({
                            user_id: user_id,
                            cd_diem: { $gt: cd_ngansach },
                        })
                        .lean();
                    if (PointCheck) {
                        await campainList.findOneAndUpdate({ cd_id: cd_id }, {
                            $inc: { cd_ngansach: cd_ngansach },
                        });
                        await pointList.findOneAndUpdate({ user_id: user_id }, { $inc: { cd_diem: -cd_ngansach } });
                        return functions.success(res, 'chỉnh sửa thành công!');
                    } else {
                        return functions.setError(
                            res,
                            'Bạn không đủ điểm, hãy nạp điểm ngay!',
                            400
                        );
                    }
                } else {
                    return functions.setError(
                        res,
                        'GPA phải ít hơn ngân sách hiện tại, vui lòng nhập lại!',
                        400
                    );
                }
            }
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// chi tiết chiến dịch - bình đã sửa
exports.detailCampain = async(req, res, next) => {
    try {
        let cd_id = Number(req.body.cd_id),
            user_id = Number(req.body.user_id),
            user_type = Number(req.body.user_type);
        if (isNaN(cd_id) || isNaN(user_id))
            return functions.setError(
                res,
                'Thông tin truyền lên không đầy đủ',
                400
            );
        let campaignData = await campainList
            .find({
                cd_id: cd_id,
                user_id: user_id,
                user_type: user_type,
            })
            .lean();
        if (!campaignData.length)
            return functions.setError(res, 'Không tìm thấy chiến dịch', 404);
        return functions.success(res, 'Thành công', { data: campaignData[0] });
    } catch (err) {
        console.log(err);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

// tắt chiến dịch
exports.deleteCampain = async(req, res) => {
    try {
        let { cd_id } = req.body;
        if (!cd_id) {
            return functions.setError(res, 'cd_id không được bỏ trống', 400);
        }
        if (typeof cd_id !== 'number' && isNaN(Number(cd_id))) {
            return functions.setError(res, 'cd_id phải là 1 số', 400);
        }
        let updateCd = await campainList.findOneAndUpdate({ cd_id: cd_id }, {
            $set: {
                cd_trangthai: 0,
            },
        });
        if (!updateCd) {
            return functions.setError(
                res,
                'Không tìm thấy chiến dịch cần xóa',
                400
            );
        }
        return functions.success(res, 'Xóa chiến dịch thành công');
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// tìm kiếm từ khóa mở rộng

exports.findCampain = async(req, res) => {
    try {
        let currentDate = new Date();
        let listData = await campainList
            .find({
                cd_tukhoa: new RegExp(req.body.text, 'i'),
                cd_trangthai: 1,
                cd_step: { $eq: 4 },
                cd_timestart: { $lt: currentDate },
                $or: [{ cd_timeend: 0 }, { cd_timeend: { $gt: currentDate } }],
                $expr: {
                    $lt: ['$cd_cpm', '$cd_ngansach'],
                },
            })
            .sort({ cd_gpa: -1, cd_id: -1 })
            .limit(6)
            .lean();
        if (listData.length > 0) {
            // Tính tổng các giá trị từ danh sách listData
            listData.forEach(async(doc) => {
                const totalTuongTac = doc.cd_tuongtac + 1;
                const totalNganSach = doc.cd_ngansach;
                const totalLuotNhap = doc.cd_luotnhap;
                const totalLuotUngTuyen = doc.cd_luotungtuyen;
                const totalCPM = doc.cd_cpm;
                const cd_id = doc.cd_id;
                const totalchiphi = Number(doc.cd_chiphi);
                // Tính giá trị trung bình cho cd_tile và cd_ngansach
                const tile =
                    totalTuongTac === 0 ?
                    0 :
                    (totalLuotNhap + totalLuotUngTuyen) / totalTuongTac;
                const cd_ngansach = totalNganSach - totalCPM;
                const cd_chiphi = totalchiphi + totalCPM;

                // Cập nhật trường cd_tuongtac, cd_tile, và cd_ngansach cho các tài liệu đã tìm thấy
                await campainList.updateOne({ cd_id: cd_id }, {
                    $inc: { cd_tuongtac: 1 },
                    $set: {
                        cd_tile: tile,
                        cd_ngansach: cd_ngansach,
                        cd_chiphi: cd_chiphi,
                    },
                });
            });
        }

        return functions.success(res, 'Danh sách kết quả tìm kiếm:', {
            data: listData,
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// tìm kiếm chính xác

exports.findexactCampain = async(req, res) => {
    try {
        let currentDate = new Date();
        const text = req.body.text.toString();
        let listData = await campainList
            .find({
                cd_tin: { $regex: `^${text}$`, $options: 'i' },
                cd_trangthai: 1,
                cd_step: { $eq: 4 },
                cd_timestart: { $lt: currentDate },
                $or: [{ cd_timeend: 0 }, { cd_timeend: { $gt: currentDate } }],
                $expr: {
                    $lt: ['$cd_cpm', '$cd_ngansach'],
                },
            })
            .sort({ cd_gpa: -1, cd_id: -1 })
            .limit(6);
        if (listData.length > 0) {
            // Tính tổng các giá trị từ danh sách listData
            listData.forEach(async(doc) => {
                const totalTuongTac = doc.cd_tuongtac + 1;
                const totalNganSach = doc.cd_ngansach;
                const totalLuotNhap = doc.cd_luotnhap;
                const totalLuotUngTuyen = doc.cd_luotungtuyen;
                const totalCPM = doc.cd_cpm;
                const cd_id = doc.cd_id;
                const totalchiphi = Number(doc.cd_chiphi);
                // Tính giá trị trung bình cho cd_tile và cd_ngansach
                const tile =
                    totalTuongTac === 0 ?
                    0 :
                    (totalLuotNhap + totalLuotUngTuyen) / totalTuongTac;
                const cd_ngansach = totalNganSach - totalCPM;
                const cd_chiphi = totalchiphi + totalCPM;

                // Cập nhật trường cd_tuongtac, cd_tile, và cd_ngansach cho các tài liệu đã tìm thấy
                await campainList.updateOne({ cd_id: cd_id }, {
                    $inc: { cd_tuongtac: 1 },
                    $set: {
                        cd_tile: tile,
                        cd_ngansach: cd_ngansach,
                        cd_chiphi: cd_chiphi,
                    },
                });
            });
        }
        return functions.success(res, 'Danh sách kết quả tìm kiếm:', {
            data: listData,
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// tăng lượt nhấp chuột
exports.addClickCampain = async(req, res) => {
    try {
        functions.success(res, 'Cập nhật thành công');
        let currentDate = functions.getTimeNow();
        let { cd_new_id } = req.body;
        const cd = await campainList
            .findOne({
                cd_new_id: cd_new_id,
                cd_trangthai: 1,
                cd_step: { $eq: 4 },
                cd_timestart: { $lt: currentDate },
                $or: [{ cd_timeend: 0 }, { cd_timeend: { $gt: currentDate } }],
                $expr: {
                    $lt: [
                        { $add: ['$cd_cpm', '$cd_cpc', '$cd_chuyendoi'] },
                        '$cd_ngansach',
                    ],
                },
            })
            .sort({ cd_gpa: -1 })
            .lean();
        if (!cd) return false;
        //functions.setError(res, 'Không tìm thấy chiến dịch');
        const totalTuongTac = cd.cd_tuongtac + 1;
        const totalNganSach = Number(cd.cd_ngansach);
        const totalLuotNhap = cd.cd_luotnhap + 1;
        const totalLuotUngTuyen = cd.cd_luotungtuyen;
        const totalCPC = Number(cd.cd_cpc);
        const totalchiphi = Number(cd.cd_chiphi);
        // Tính giá trị trung bình cho cd_tile và cd_ngansach
        const tile =
            totalTuongTac === 0 ?
            0 :
            (totalLuotNhap + totalLuotUngTuyen) / totalTuongTac;
        const cd_ngansach = totalNganSach - totalCPC;
        const cd_chiphi = totalchiphi + totalCPC;

        await campainList.updateOne({ cd_id: cd.cd_id }, {
            $inc: { cd_tuongtac: 1, cd_luotnhap: 1 },
            $set: {
                cd_tile: tile,
                cd_ngansach: cd_ngansach,
                cd_chiphi: cd_chiphi,
            },
        });
        return true;
    } catch (e) {
        console.log("addClickCampain", e);
        return false;
        //functions.setError(res, e.message);
    }
};

// tăng lượt ứng tuyển
exports.addApplyCampain = async(req, res) => {
    try {
        let currentDate = functions.getTimeNow();
        let { cd_new_id } = req.body;
        const cd = await campainList
            .findOne({
                cd_new_id: cd_new_id,
                cd_trangthai: 1,
                cd_step: { $eq: 4 },
                cd_timestart: { $lt: currentDate },
                $or: [{ cd_timeend: 0 }, { cd_timeend: { $gt: currentDate } }],
                $expr: {
                    $lt: [
                        { $add: ['$cd_cpm', '$cd_cpc', '$cd_chuyendoi'] },
                        '$cd_ngansach',
                    ],
                },
            })
            .sort({ cd_gpa: -1 })
            .lean();
        if (!cd) return functions.setError(res, 'Không tìm thấy chiến dịch');
        const totalTuongTac = cd.cd_tuongtac + 1;
        const totalNganSach = Number(cd.cd_ngansach);
        const totalLuotNhap = cd.cd_luotnhap;
        const totalLuotUngTuyen = cd.cd_luotungtuyen + 1;
        const totalchuyendoi = Number(cd.cd_chuyendoi);
        const totalchiphi = Number(cd.cd_chiphi);
        // Tính giá trị trung bình cho cd_tile và cd_ngansach
        const tile =
            totalTuongTac === 0 ?
            0 :
            (totalLuotNhap + totalLuotUngTuyen) / totalTuongTac;
        const cd_ngansach = totalNganSach - totalchuyendoi;
        const cd_chiphi = totalchiphi + totalchuyendoi;

        await campainList.updateOne({ cd_id: cd.cd_id }, {
            $inc: { cd_tuongtac: 1, cd_luotungtuyen: 1 },
            $set: {
                cd_tile: tile,
                cd_ngansach: cd_ngansach,
                cd_chiphi: cd_chiphi,
            },
        });
        return functions.success(res, 'Ok');
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// hiển thị tổng quan các số liệu
exports.getStatisticCampain = async(req, res) => {
    try {
        const { cd_timestart, cd_timeend, user_id, user_type, type } = req.body;
        let total = [];
        const aggregationPipeline = [{
                $match: {
                    cd_create_time: {
                        $gte: Number(cd_timestart),
                        $lte: Number(cd_timeend),
                    },
                    user_id: Number(user_id),
                    user_type: Number(user_type),
                    cd_step: { $eq: 4 },
                },
            },
            {
                $group: {
                    _id: null,
                    luotnhap: { $sum: '$cd_luotnhap' },
                    luotungtuyen: { $sum: '$cd_luotungtuyen' },
                    tuongtac: { $sum: '$cd_tuongtac' },
                    chiphi: { $sum: '$cd_chiphi' },
                    tile: { $avg: '$cd_tile' },
                    cpc: { $avg: '$cd_cpc' },
                    chuyendoi: { $avg: '$cd_chuyendoi' },
                    cpm: { $avg: '$cd_cpm' },
                },
            },
        ];

        const result = await campainList.aggregate(aggregationPipeline);
        if (result.length > 0) {
            const luothienthi =
                result[0].tuongtac -
                result[0].luotnhap -
                result[0].luotungtuyen;
            total.push({
                luotnhap: result[0].luotnhap,
                luotungtuyen: result[0].luotungtuyen,
                tuongtac: result[0].tuongtac,
                chiphi: result[0].chiphi,
                tile: result[0].tile,
                cpc: result[0].cpc,
                chuyendoi: result[0].chuyendoi,
                cpm: result[0].cpm,
                luothienthi: luothienthi,
            });
        } else {
            total.push({
                luotnhap: 0,
                luotungtuyen: 0,
                tuongtac: 0,
                chiphi: 0,
                tile: 0,
                cpc: 0,
                chuyendoi: 0,
                cpm: 0,
                luothienthi: 0,
            });
        }

        switch (type) {
            case '1':
                {
                    // Tính sự chênh lệch giữa hai ngày (kết quả là số mili giây)
                    const difference = cd_timeend - cd_timestart;

                    // Chuyển đổi sự chênh lệch thành số giờ
                    const numberOfHours = Math.floor(difference / (60 * 60));

                    let results = [];
                    for (let i = 1; i <= numberOfHours + 1; i++) {
                        const aggregationPipeline = [{
                                $match: {
                                    cd_create_time: {
                                        $gte: Number(cd_timestart) +
                                            Number((i - 1) * 60 * 60),
                                        $lte: Number(cd_timestart) +
                                            Number(i * 60 * 60),
                                    },
                                    user_id: Number(user_id),
                                    user_type: Number(user_type),
                                    cd_step: { $eq: 4 },
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    luotnhap: { $sum: '$cd_luotnhap' },
                                    luotungtuyen: { $sum: '$cd_luotungtuyen' },
                                    tuongtac: { $sum: '$cd_tuongtac' },
                                    chiphi: { $sum: '$cd_chiphi' },
                                    tile: { $avg: '$cd_tile' },
                                    cpc: { $avg: '$cd_cpc' },
                                    chuyendoi: { $avg: '$cd_chuyendoi' },
                                    cpm: { $avg: '$cd_cpm' },
                                },
                            },
                        ];
                        const result = await campainList.aggregate(
                            aggregationPipeline
                        );
                        const date =
                            Number(cd_timestart) + Number((i - 1) * 60 * 60);
                        if (result.length > 0) {
                            const luothienthi =
                                result[0].tuongtac -
                                result[0].luotnhap -
                                result[0].luotungtuyen;
                            results.push({
                                luotnhap: result[0].luotnhap,
                                luotungtuyen: result[0].luotungtuyen,
                                tuongtac: result[0].tuongtac,
                                chiphi: result[0].chiphi,
                                tile: result[0].tile,
                                cpc: result[0].cpc,
                                chuyendoi: result[0].chuyendoi,
                                cpm: result[0].cpm,
                                luothienthi: luothienthi,
                                date: date,
                            });
                        } else {
                            results.push({
                                luotnhap: '',
                                luotungtuyen: '',
                                tuongtac: '',
                                chiphi: '',
                                tile: '',
                                cpc: '',
                                chuyendoi: '',
                                cpm: '',
                                luothienthi: '',
                                date: date,
                            });
                        }
                    }

                    return res.status(200).json({
                        result: true,
                        message: 'Kết quả',
                        data: { results, total: total[0] },
                        error: null,
                    });
                    break;
                }
            case '2':
                {
                    // Tính sự chênh lệch giữa hai ngày (kết quả là số mili giây)
                    const difference = cd_timeend - cd_timestart;

                    // Chuyển đổi sự chênh lệch thành số ngày
                    const numberOfDays = Math.floor(difference / (60 * 60 * 24));

                    let results = [];
                    for (let i = 1; i <= numberOfDays + 1; i++) {
                        const aggregationPipeline = [{
                                $match: {
                                    cd_create_time: {
                                        $gte: Number(cd_timestart) +
                                            Number((i - 1) * 60 * 60 * 24),
                                        $lte: Number(cd_timestart) +
                                            Number(i * 60 * 60 * 24),
                                    },
                                    user_id: Number(user_id),
                                    user_type: Number(user_type),
                                    cd_step: { $eq: 4 },
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    luotnhap: { $sum: '$cd_luotnhap' },
                                    luotungtuyen: { $sum: '$cd_luotungtuyen' },
                                    tuongtac: { $sum: '$cd_tuongtac' },
                                    chiphi: { $sum: '$cd_chiphi' },
                                    tile: { $avg: '$cd_tile' },
                                    cpc: { $avg: '$cd_cpc' },
                                    chuyendoi: { $avg: '$cd_chuyendoi' },
                                    cpm: { $avg: '$cd_cpm' },
                                },
                            },
                        ];

                        const result = await campainList.aggregate(
                            aggregationPipeline
                        );
                        const date =
                            Number(cd_timestart) + Number((i - 1) * 60 * 60 * 24);
                        if (result.length > 0) {
                            const luothienthi =
                                result[0].tuongtac -
                                result[0].luotnhap -
                                result[0].luotungtuyen;
                            results.push({
                                luotnhap: result[0].luotnhap,
                                luotungtuyen: result[0].luotungtuyen,
                                tuongtac: result[0].tuongtac,
                                chiphi: result[0].chiphi,
                                tile: result[0].tile,
                                cpc: result[0].cpc,
                                chuyendoi: result[0].chuyendoi,
                                cpm: result[0].cpm,
                                luothienthi: luothienthi,
                                date: date,
                            });
                        } else {
                            results.push({
                                luotnhap: 0,
                                luotungtuyen: 0,
                                tuongtac: 0,
                                chiphi: 0,
                                tile: 0,
                                cpc: 0,
                                chuyendoi: 0,
                                cpm: 0,
                                luothienthi: 0,
                                date: date,
                            });
                        }
                    }
                    return res.status(200).json({
                        result: true,
                        message: 'Kết quả',
                        data: { results, total: total[0] },
                        error: null,
                    });
                }
            case '3':
                {
                    // Tính sự chênh lệch giữa hai ngày (kết quả là số mili giây)
                    const difference = cd_timeend - cd_timestart;

                    // Chuyển đổi sự chênh lệch thành số tuần
                    const numberOfWeeks = Math.floor(
                        difference / (60 * 60 * 24 * 7)
                    );

                    let results = [];
                    for (let i = 1; i <= numberOfWeeks + 1; i++) {
                        const aggregationPipeline = [{
                                $match: {
                                    cd_create_time: {
                                        $gte: Number(cd_timestart) +
                                            Number((i - 1) * 60 * 60 * 24 * 7),
                                        $lte: Number(cd_timestart) +
                                            Number(i * 60 * 60 * 24 * 7),
                                    },
                                    user_id: Number(user_id),
                                    user_type: Number(user_type),
                                    cd_step: { $eq: 4 },
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    luotnhap: { $sum: '$cd_luotnhap' },
                                    luotungtuyen: { $sum: '$cd_luotungtuyen' },
                                    tuongtac: { $sum: '$cd_tuongtac' },
                                    chiphi: { $sum: '$cd_chiphi' },
                                    tile: { $avg: '$cd_tile' },
                                    cpc: { $avg: '$cd_cpc' },
                                    chuyendoi: { $avg: '$cd_chuyendoi' },
                                    cpm: { $avg: '$cd_cpm' },
                                },
                            },
                        ];

                        const result = await campainList.aggregate(
                            aggregationPipeline
                        );
                        const date =
                            Number(cd_timestart) +
                            Number((i - 1) * 60 * 60 * 24 * 7);
                        if (result.length > 0) {
                            const luothienthi =
                                result[0].tuongtac -
                                result[0].luotnhap -
                                result[0].luotungtuyen;
                            results.push({
                                luotnhap: result[0].luotnhap,
                                luotungtuyen: result[0].luotungtuyen,
                                tuongtac: result[0].tuongtac,
                                chiphi: result[0].chiphi,
                                tile: result[0].tile,
                                cpc: result[0].cpc,
                                chuyendoi: result[0].chuyendoi,
                                cpm: result[0].cpm,
                                luothienthi: luothienthi,
                                date: date,
                            });
                        } else {
                            results.push({
                                luotnhap: 0,
                                luotungtuyen: 0,
                                tuongtac: 0,
                                chiphi: 0,
                                tile: 0,
                                cpc: 0,
                                chuyendoi: 0,
                                cpm: 0,
                                luothienthi: 0,
                                date: date,
                            });
                        }
                    }

                    return res.status(200).json({
                        result: true,
                        message: 'Kết quả',
                        data: { results, total: total[0] },
                        error: null,
                    });
                    break;
                }
            case '4':
                {
                    let startinput = new Date(Number(cd_timestart) * 1000);
                    let start = startinput.toLocaleDateString('vi-VN');
                    let endinput = new Date(Number(cd_timeend) * 1000);
                    let end = endinput.toLocaleDateString('vi-VN');
                    let startDate = start.split('/');
                    let endDate = end.split('/');
                    // Lấy ra thành phần tháng (ở vị trí index 1 trong mảng parts)
                    let startMonth = parseInt(startDate[0]); // Chuyển đổi thành số nguyên
                    let endMonth = parseInt(endDate[0]);
                    let startYear = parseInt(startDate[2]);
                    let endYear = parseInt(endDate[2]);
                    let results = [];
                    if (startMonth == endMonth && startYear == endYear) {
                        const aggregationPipeline = [{
                                $match: {
                                    cd_create_time: {
                                        $gte: cd_timestart,
                                        $lte: cd_timeend,
                                    },
                                    user_id: Number(user_id),
                                    user_type: Number(user_type),
                                    cd_step: { $eq: 4 },
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    luotnhap: { $sum: '$cd_luotnhap' },
                                    luotungtuyen: { $sum: '$cd_luotungtuyen' },
                                    tuongtac: { $sum: '$cd_tuongtac' },
                                    chiphi: { $sum: '$cd_chiphi' },
                                    tile: { $avg: '$cd_tile' },
                                    cpc: { $avg: '$cd_cpc' },
                                    chuyendoi: { $avg: '$cd_chuyendoi' },
                                    cpm: { $avg: '$cd_cpm' },
                                },
                            },
                        ];
                        const result = await campainList.aggregate(
                            aggregationPipeline
                        );
                        if (result.length > 0) {
                            const luothienthi =
                                result[0].tuongtac -
                                result[0].luotnhap -
                                result[0].luotungtuyen;
                            results.push({
                                luotnhap: result[0].luotnhap,
                                luotungtuyen: result[0].luotungtuyen,
                                tuongtac: result[0].tuongtac,
                                chiphi: result[0].chiphi,
                                tile: result[0].tile,
                                cpc: result[0].cpc,
                                chuyendoi: result[0].chuyendoi,
                                cpm: result[0].cpm,
                                luothienthi: luothienthi,
                                date: `Tháng ${startMonth}/${startYear}`,
                            });
                        } else {
                            results.push({
                                luotnhap: 0,
                                luotungtuyen: 0,
                                tuongtac: 0,
                                chiphi: 0,
                                tile: 0,
                                cpc: 0,
                                chuyendoi: 0,
                                cpm: 0,
                                luothienthi: 0,
                                date: `Tháng ${startMonth}/${startYear}`,
                            });
                        }
                    } else {
                        // Tạo mảng các tháng từ ngày bắt đầu đến ngày kết thúc
                        const monthArray = [];
                        const currentDate = new Date(startinput);

                        while (currentDate <= endinput) {
                            const year = currentDate.getFullYear();
                            const month = currentDate.getMonth() + 1; // Lưu ý: getMonth() trả về tháng từ 0 đến 11
                            monthArray.push({ year, month });
                            currentDate.setMonth(currentDate.getMonth() + 1);
                        }

                        monthArray.pop();
                        for (const { year, month }
                            of monthArray) {
                            const firstday = new Date(year, month - 1, 1); // Tháng trong JavaScript từ 0 đến 11, nên trừ đi 1
                            const lastday = new Date(year, month, 0);
                            const firstDayOfMonth = Math.floor(
                                firstday.getTime() / 1000
                            );
                            const lastDayOfMonth = Math.floor(
                                lastday.getTime() / 1000
                            );
                            const aggregationPipeline = [{
                                    $match: {
                                        cd_create_time: {
                                            $gte: firstDayOfMonth,
                                            $lte: lastDayOfMonth,
                                        },
                                        user_id: Number(user_id),
                                        user_type: Number(user_type),
                                        cd_step: { $eq: 4 },
                                    },
                                },
                                {
                                    $group: {
                                        _id: null,
                                        luotnhap: { $sum: '$cd_luotnhap' },
                                        luotungtuyen: { $sum: '$cd_luotungtuyen' },
                                        tuongtac: { $sum: '$cd_tuongtac' },
                                        chiphi: { $sum: '$cd_chiphi' },
                                        tile: { $avg: '$cd_tile' },
                                        cpc: { $avg: '$cd_cpc' },
                                        chuyendoi: { $avg: '$cd_chuyendoi' },
                                        cpm: { $avg: '$cd_cpm' },
                                    },
                                },
                            ];
                            const result = await campainList.aggregate(
                                aggregationPipeline
                            );
                            if (result.length > 0) {
                                const luothienthi =
                                    result[0].tuongtac -
                                    result[0].luotnhap -
                                    result[0].luotungtuyen;
                                results.push({
                                    luotnhap: result[0].luotnhap,
                                    luotungtuyen: result[0].luotungtuyen,
                                    tuongtac: result[0].tuongtac,
                                    chiphi: result[0].chiphi,
                                    tile: result[0].tile,
                                    cpc: result[0].cpc,
                                    chuyendoi: result[0].chuyendoi,
                                    cpm: result[0].cpm,
                                    luothienthi: luothienthi,
                                    date: `Tháng ${month}/${year}`,
                                });
                            } else {
                                results.push({
                                    luotnhap: 0,
                                    luotungtuyen: 0,
                                    tuongtac: 0,
                                    chiphi: 0,
                                    tile: 0,
                                    cpc: 0,
                                    chuyendoi: 0,
                                    cpm: 0,
                                    luothienthi: 0,
                                    date: `Tháng ${month}/${year}`,
                                });
                            }
                        }

                        const firstday = new Date(endYear, endMonth - 1, 1); // Ngày đầu tiên tháng cuối cùng
                        const firstDayOfMonth = Math.floor(
                            firstday.getTime() / 1000
                        );
                        const aggregationPipeline = [{
                                $match: {
                                    cd_create_time: {
                                        $gte: firstDayOfMonth,
                                        $lte: cd_timeend,
                                    },
                                    user_id: Number(user_id),
                                    user_type: Number(user_type),
                                    cd_step: { $eq: 4 },
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    luotnhap: { $sum: '$cd_luotnhap' },
                                    luotungtuyen: { $sum: '$cd_luotungtuyen' },
                                    tuongtac: { $sum: '$cd_tuongtac' },
                                    chiphi: { $sum: '$cd_chiphi' },
                                    tile: { $avg: '$cd_tile' },
                                    cpc: { $avg: '$cd_cpc' },
                                    chuyendoi: { $avg: '$cd_chuyendoi' },
                                    cpm: { $avg: '$cd_cpm' },
                                },
                            },
                        ];
                        const result = await campainList.aggregate(
                            aggregationPipeline
                        );
                        if (result.length > 0) {
                            const luothienthi =
                                result[0].tuongtac -
                                result[0].luotnhap -
                                result[0].luotungtuyen;
                            results.push({
                                luotnhap: result[0].luotnhap,
                                luotungtuyen: result[0].luotungtuyen,
                                tuongtac: result[0].tuongtac,
                                chiphi: result[0].chiphi,
                                tile: result[0].tile,
                                cpc: result[0].cpc,
                                chuyendoi: result[0].chuyendoi,
                                cpm: result[0].cpm,
                                luothienthi: luothienthi,
                                date: `Tháng ${endMonth}/${endYear}`,
                            });
                        } else {
                            results.push({
                                luotnhap: 0,
                                luotungtuyen: 0,
                                tuongtac: 0,
                                chiphi: 0,
                                tile: 0,
                                cpc: 0,
                                chuyendoi: 0,
                                cpm: 0,
                                luothienthi: 0,
                                date: `Tháng ${endMonth}/${endYear}`,
                            });
                        }
                    }

                    return res.status(200).json({
                        result: true,
                        message: 'Kết quả',
                        data: { results, total: total[0] },
                        error: null,
                    });
                }
            case '5':
                {
                    let startinput = new Date(Number(cd_timestart) * 1000);
                    let start = startinput.toLocaleDateString('vi-VN');
                    let endinput = new Date(Number(cd_timeend) * 1000);
                    let end = endinput.toLocaleDateString('vi-VN');
                    let startDate = start.split('/');
                    let endDate = end.split('/');
                    // Lấy ra thành phần tháng (ở vị trí index 1 trong mảng parts)
                    let startMonth = parseInt(startDate[0]); // Chuyển đổi thành số nguyên
                    let endMonth = parseInt(endDate[0]);
                    let startYear = parseInt(startDate[2]);
                    let endYear = parseInt(endDate[2]);
                    let results = [];
                    const years = [];
                    for (let year = startYear; year <= endYear; year++) {
                        years.push(year);
                    }

                    function getQuarterFromDate(date) {
                        const month = date.getMonth() + 1; // Lấy tháng từ 1 đến 12
                        return Math.ceil(month / 3); // Tính quý dựa trên tháng
                    }

                    const startpart = Math.ceil(startMonth / 3);
                    const endpart = Math.ceil(endMonth / 3);
                    if (startpart == endpart && startYear == endYear) {
                        const aggregationPipeline = [{
                                $match: {
                                    cd_create_time: {
                                        $gte: cd_timestart,
                                        $lte: cd_timeend,
                                    },
                                    user_id: Number(user_id),
                                    user_type: Number(user_type),
                                    cd_step: { $eq: 4 },
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    luotnhap: { $sum: '$cd_luotnhap' },
                                    luotungtuyen: { $sum: '$cd_luotungtuyen' },
                                    tuongtac: { $sum: '$cd_tuongtac' },
                                    chiphi: { $sum: '$cd_chiphi' },
                                    tile: { $avg: '$cd_tile' },
                                    cpc: { $avg: '$cd_cpc' },
                                    chuyendoi: { $avg: '$cd_chuyendoi' },
                                    cpm: { $avg: '$cd_cpm' },
                                },
                            },
                        ];
                        const result = await campainList.aggregate(
                            aggregationPipeline
                        );
                        if (result.length > 0) {
                            const luothienthi =
                                result[0].tuongtac -
                                result[0].luotnhap -
                                result[0].luotungtuyen;
                            results.push({
                                luotnhap: result[0].luotnhap,
                                luotungtuyen: result[0].luotungtuyen,
                                tuongtac: result[0].tuongtac,
                                chiphi: result[0].chiphi,
                                tile: result[0].tile,
                                cpc: result[0].cpc,
                                chuyendoi: result[0].chuyendoi,
                                cpm: result[0].cpm,
                                luothienthi: luothienthi,
                                date: `Quý ${startpart}/${startYear}`,
                            });
                        } else {
                            results.push({
                                luotnhap: 0,
                                luotungtuyen: 0,
                                tuongtac: 0,
                                chiphi: 0,
                                tile: 0,
                                cpc: 0,
                                chuyendoi: 0,
                                cpm: 0,
                                luothienthi: 0,
                                date: `Quý ${startpart}/${startYear}`,
                            });
                        }
                    } else {
                        // Tạo mảng các tháng từ ngày bắt đầu đến ngày kết thúc
                        const monthArray = [];
                        const currentDate = new Date(startinput);

                        while (currentDate <= endinput) {
                            const year = currentDate.getFullYear();
                            const month = currentDate.getMonth() + 1; // Lưu ý: getMonth() trả về tháng từ 0 đến 11
                            const part = Math.ceil(month / 3);
                            monthArray.push({ year, part });
                            currentDate.setMonth(part * 3);
                        }
                        monthArray.pop();
                        for (const { year, part }
                            of monthArray) {
                            const firstday = new Date(year, (part - 1) * 3, 1); // Tháng trong JavaScript từ 0 đến 11, nên trừ đi 1
                            const lastday = new Date(year, part * 3, 0);
                            const firstDayOfMonth = Math.floor(
                                firstday.getTime() / 1000
                            );
                            const lastDayOfMonth = Math.floor(
                                lastday.getTime() / 1000
                            );

                            const aggregationPipeline = [{
                                    $match: {
                                        cd_create_time: {
                                            $gte: firstDayOfMonth,
                                            $lte: lastDayOfMonth,
                                        },
                                        user_id: Number(user_id),
                                        user_type: Number(user_type),
                                        cd_step: { $eq: 4 },
                                    },
                                },
                                {
                                    $group: {
                                        _id: null,
                                        luotnhap: { $sum: '$cd_luotnhap' },
                                        luotungtuyen: { $sum: '$cd_luotungtuyen' },
                                        tuongtac: { $sum: '$cd_tuongtac' },
                                        chiphi: { $sum: '$cd_chiphi' },
                                        tile: { $avg: '$cd_tile' },
                                        cpc: { $avg: '$cd_cpc' },
                                        chuyendoi: { $avg: '$cd_chuyendoi' },
                                        cpm: { $avg: '$cd_cpm' },
                                    },
                                },
                            ];
                            const result = await campainList.aggregate(
                                aggregationPipeline
                            );
                            if (result.length > 0) {
                                const luothienthi =
                                    result[0].tuongtac -
                                    result[0].luotnhap -
                                    result[0].luotungtuyen;
                                results.push({
                                    luotnhap: result[0].luotnhap,
                                    luotungtuyen: result[0].luotungtuyen,
                                    tuongtac: result[0].tuongtac,
                                    chiphi: result[0].chiphi,
                                    tile: result[0].tile,
                                    cpc: result[0].cpc,
                                    chuyendoi: result[0].chuyendoi,
                                    cpm: result[0].cpm,
                                    luothienthi: luothienthi,
                                    date: `Quý ${part}/${year}`,
                                });
                            } else {
                                results.push({
                                    luotnhap: 0,
                                    luotungtuyen: 0,
                                    tuongtac: 0,
                                    chiphi: 0,
                                    tile: 0,
                                    cpc: 0,
                                    chuyendoi: 0,
                                    cpm: 0,
                                    luothienthi: 0,
                                    date: `Quý ${part}/${year}`,
                                });
                            }
                        }
                        let endpart = getQuarterFromDate(endinput);
                        const firstday = new Date(endYear, (endpart - 1) * 3, 1); // Ngày đầu tiên quý cuối cùng
                        const firstDayOfMonth = Math.floor(
                            firstday.getTime() / 1000
                        );

                        const aggregationPipeline = [{
                                $match: {
                                    cd_create_time: {
                                        $gte: firstDayOfMonth,
                                        $lte: cd_timeend,
                                    },
                                    user_id: Number(user_id),
                                    user_type: Number(user_type),
                                    cd_step: { $eq: 4 },
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    luotnhap: { $sum: '$cd_luotnhap' },
                                    luotungtuyen: { $sum: '$cd_luotungtuyen' },
                                    tuongtac: { $sum: '$cd_tuongtac' },
                                    chiphi: { $sum: '$cd_chiphi' },
                                    tile: { $avg: '$cd_tile' },
                                    cpc: { $avg: '$cd_cpc' },
                                    chuyendoi: { $avg: '$cd_chuyendoi' },
                                    cpm: { $avg: '$cd_cpm' },
                                },
                            },
                        ];
                        const result = await campainList.aggregate(
                            aggregationPipeline
                        );
                        if (result.length > 0) {
                            const luothienthi =
                                result[0].tuongtac -
                                result[0].luotnhap -
                                result[0].luotungtuyen;
                            results.push({
                                luotnhap: result[0].luotnhap,
                                luotungtuyen: result[0].luotungtuyen,
                                tuongtac: result[0].tuongtac,
                                chiphi: result[0].chiphi,
                                tile: result[0].tile,
                                cpc: result[0].cpc,
                                chuyendoi: result[0].chuyendoi,
                                cpm: result[0].cpm,
                                luothienthi: luothienthi,
                                date: `Quý ${endpart}/${endYear}`,
                            });
                        } else {
                            results.push({
                                luotnhap: 0,
                                luotungtuyen: 0,
                                tuongtac: 0,
                                chiphi: 0,
                                tile: 0,
                                cpc: 0,
                                chuyendoi: 0,
                                cpm: 0,
                                luothienthi: 0,
                                date: `Quý ${endpart}/${endYear}`,
                            });
                        }
                    }

                    return res.status(200).json({
                        result: true,
                        message: 'Kết quả',
                        data: { results, total: total[0] },
                        error: null,
                    });
                    break;
                }
            default:
                res.status(404).json({ message: 'Resource not found' });
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// cập nhật trạng thái chiến dịch - bình viết
exports.updateStatusCampain = async(req, res) => {
    try {
        let { cd_id, user_id, user_type, cd_trangthai } = req.body;

        if (isNaN(cd_id) || isNaN(user_id) || cd_trangthai <= 0)
            return functions.setError(
                res,
                'Thông tin truyền lên không đầy đủ',
                400
            );
        let campaignData = await campainList
            .findOne({
                cd_id: cd_id,
                user_id: user_id,
                user_type: user_type,
            })
            .lean();
        if (!campaignData)
            return functions.setError(res, 'Không tìm thấy chiến dịch', 404);
        let updateCd = await campainList.findOneAndUpdate({ cd_id: campaignData['cd_id'] }, {
            $set: {
                cd_trangthai: cd_trangthai,
            },
        });
        if (!updateCd) {
            return functions.setError(
                res,
                'Cập nhật trạng thái chiến dịch thất bại',
                400
            );
        }
        return functions.success(
            res,
            'Cập nhật trạng thái chiến dịch thành công'
        );
    } catch (e) {
        console.log(e);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

// chỉnh sửa chiến dịch thay đổi ngày tháng - bình viết
exports.updateDateCampain = async(req, res) => {
    try {
        let { cd_id, user_id, user_type, cd_timestart, cd_timeend } = req.body;
        if (isNaN(cd_id) || isNaN(user_id) || cd_timestart <= 0)
            return functions.setError(
                res,
                'Thông tin truyền lên không đầy đủ',
                400
            );
        let campaignData = await campainList
            .findOne({
                cd_id: cd_id,
                user_id: user_id,
                user_type: user_type,
            })
            .lean();
        if (!campaignData)
            return functions.setError(res, 'Không tìm thấy chiến dịch', 404);
        if (cd_timeend > 0 && cd_timestart > cd_timeend)
            return functions.setError(
                res,
                'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc',
                404
            );
        let updateCd = await campainList.findOneAndUpdate({ cd_id: campaignData['cd_id'] }, {
            $set: {
                cd_timestart: cd_timestart,
                cd_timeend: cd_timeend,
            },
        });
        if (!updateCd) {
            return functions.setError(
                res,
                'Cập nhật ngày chiến dịch thất bại',
                400
            );
        }
        return functions.success(res, 'Cập nhật ngày chiến dịch thành công');
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// cập nhật gpa chiến dịch - bình viết
exports.updateGpaCampain = async(req, res) => {
    try {
        let { cd_id, cd_gpa, user_id, user_type } = req.body;
        if (isNaN(cd_id) || isNaN(user_id) || cd_gpa <= 0)
            return functions.setError(
                res,
                'Thông tin truyền lên không đầy đủ',
                400
            );
        let campaignData = await campainList
            .findOne({
                cd_id: cd_id,
                user_id: user_id,
                user_type: user_type,
            })
            .lean();
        if (!campaignData)
            return functions.setError(res, 'Không tìm thấy chiến dịch', 404);
        if (cd_gpa > campaignData['cd_ngansach'])
            return functions.setError(
                res,
                'Giá thầu không được lớn hơn ngân sách',
                404
            );
        let updateCd = await campainList.findOneAndUpdate({ cd_id: campaignData['cd_id'] }, {
            $set: {
                cd_gpa: cd_gpa,
                cd_cpm: cd_gpa * 0.1,
                cd_cpc: cd_gpa * 0.2,
                cd_chuyendoi: cd_gpa * 0.5,
            },
        });
        if (!updateCd) {
            return functions.setError(
                res,
                'Cập nhật giá thầu chiến dịch thất bại',
                400
            );
        }
        return functions.success(
            res,
            'Cập nhật giá thầu chiến dịch thành công'
        );
    } catch (e) {
        console.log(e);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

// cập nhật ngân sách chiến dịch - bình viết
exports.updateNganSachCampain = async(req, res) => {
    try {
        let { cd_id, cd_ngansach, user_id, user_type } = req.body;
        if (isNaN(cd_id) || isNaN(user_id) || cd_ngansach <= 0)
            return functions.setError(
                res,
                'Thông tin truyền lên không đầy đủ',
                400
            );
        let campaignData = await campainList
            .findOne({
                cd_id: cd_id,
                user_id: user_id,
                user_type: user_type,
            })
            .lean();
        if (!campaignData)
            return functions.setError(res, 'Không tìm thấy chiến dịch', 404);
        let checkPoint = await pointList
            .findOne({ user_id: user_id, cd_diem: { $gt: cd_ngansach } })
            .lean();
        if (checkPoint) {
            await campainList.findOneAndUpdate({ cd_id: cd_id }, {
                $inc: { cd_ngansach: cd_ngansach },
            });
            await pointList.findOneAndUpdate({ user_id: user_id }, { $inc: { cd_diem: -cd_ngansach } });
            return functions.success(
                res,
                'Cập nhật ngân sách chiến dịch thành công'
            );
        } else {
            return functions.setError(
                res,
                'Bạn không đủ điểm, hãy nạp điểm ngay!',
                400
            );
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

// Thêm chiến dịch form 1
exports.createCampaignB1 = async(req, res) => {
    try {
        let {
            cd_id,
            user_id,
            user_type,
            cd_new_id,
            cd_timestart,
            cd_timeend,
            cd_step,
        } = req.body;
        if (isNaN(cd_new_id) || isNaN(user_id) || isNaN(cd_timestart))
            return functions.setError(
                res,
                'Thông tin truyền lên không đầy đủ',
                400
            );
        let checkUser = await Users.findOne({
            idTimViec365: user_id,
            type: user_type,
        });
        if (!checkUser)
            return functions.setError(res, 'Người dùng không tồn tại', 400);
        let checkNew = await NewTV365.findOne({ new_id: cd_new_id });
        if (!checkNew)
            return functions.setError(res, 'Tin tuyển dụng không tồn tại', 400);
        let time = functions.getTimeNow();
        if (cd_id > 0) {
            let campaignData = await campainList
                .findOne({
                    cd_id: cd_id,
                    user_id: user_id,
                    user_type: user_type,
                })
                .lean();
            if (!campaignData)
                return functions.setError(
                    res,
                    'Không tìm thấy chiến dịch',
                    404
                );
            let updateCd = await campainList.findOneAndUpdate({ cd_id: campaignData['cd_id'] }, {
                $set: {
                    cd_new_id: cd_new_id,
                    cd_tin: checkNew['new_title'],
                    cd_timestart: cd_timestart,
                    cd_timeend: cd_timeend,
                    cd_step: cd_step,
                },
            });
            if (!updateCd) {
                return functions.setError(
                    res,
                    'Cập nhật chiến dịch thất bại',
                    400
                );
            }
            return functions.success(res, 'Cập nhật chiến dịch thành công');
        } else {
            let id_campaign = 1;
            let latestCampaign = await campainList
                .findOne()
                .sort({ cd_id: -1 })
                .lean();
            if (latestCampaign) id_campaign = latestCampaign.cd_id + 1;
            cd_timeend = cd_timeend ? cd_timeend : 0;
            let saveCampaign = await new campainList({
                cd_id: id_campaign,
                user_id: user_id,
                user_type: user_type,
                cd_new_id: cd_new_id,
                cd_tin: checkNew['new_title'],
                cd_timestart: cd_timestart,
                cd_timeend: cd_timeend,
                cd_trangthai: 1,
                cd_step: 1,
                cd_create_time: time,
            }).save();
            return functions.success(res, 'Tạo chiến dịch thành công', {
                saveCampaign,
            });
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

// kiểm tra xem đã có GPA lớn nhất chưa
exports.gpaCampainMax = async(req, res) => {
    try {
        let CampainGpa = await campainList
            .findOne({})
            .sort({ cd_gpa: -1 })
            .lean();
        let gpa = 0;
        if (CampainGpa) {
            gpa = CampainGpa.cd_gpa;
        }
        return functions.success(res, 'Gpa_max', {
            gpa: gpa,
        });
    } catch (e) {
        console.log(e);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

// Thêm chiến dịch form 2
exports.createCampaignB2 = async(req, res) => {
    try {
        let { cd_id, user_id, user_type, cd_checkbox, cd_gpa, cd_step } =
        req.body;
        if (isNaN(cd_id) || isNaN(user_id))
            return functions.setError(
                res,
                'Thông tin truyền lên không đầy đủ',
                400
            );
        let checkUser = await Users.findOne({
            idTimViec365: user_id,
            type: user_type,
        });
        if (!checkUser)
            return functions.setError(res, 'Người dùng không tồn tại', 400);
        let campaignData = await campainList
            .findOne({
                cd_id: cd_id,
                user_id: user_id,
                user_type: user_type,
            })
            .lean();
        if (!campaignData)
            return functions.setError(res, 'Không tìm thấy chiến dịch', 404);

        let updateCd = await campainList.findOneAndUpdate({ cd_id: campaignData['cd_id'] }, {
            $set: {
                cd_checkbox: cd_checkbox,
                cd_gpa: cd_gpa,
                cd_cpm: cd_gpa * 0.1,
                cd_cpc: cd_gpa * 0.2,
                cd_chuyendoi: cd_gpa * 0.5,
                cd_step: cd_step,
            },
        });
        if (!updateCd) {
            return functions.setError(
                res,
                'Cập nhật giá thầu chiến dịch thất bại',
                400
            );
        }
        return functions.success(
            res,
            'Cập nhật giá thầu chiến dịch thành công'
        );
    } catch (e) {
        console.log(e);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

// Thêm chiến dịch form 3
exports.createCampaignB3 = async(req, res) => {
    try {
        let { cd_id, user_id, user_type, cd_tukhoa, cd_goiy, cd_step } =
        req.body;
        if (isNaN(cd_id) || isNaN(user_id) || cd_tukhoa == '')
            return functions.setError(
                res,
                'Thông tin truyền lên không đầy đủ',
                400
            );
        let checkUser = await Users.findOne({
            idTimViec365: user_id,
            type: user_type,
        });
        if (!checkUser)
            return functions.setError(res, 'Người dùng không tồn tại', 400);
        let campaignData = await campainList
            .findOne({
                cd_id: cd_id,
                user_id: user_id,
                user_type: user_type,
            })
            .lean();
        if (!campaignData)
            return functions.setError(res, 'Không tìm thấy chiến dịch', 404);

        let updateCd = await campainList.findOneAndUpdate({ cd_id: campaignData['cd_id'] }, {
            $set: {
                cd_tukhoa: cd_tukhoa,
                cd_goiy: cd_goiy,
                cd_step: cd_step,
            },
        });
        if (!updateCd) {
            return functions.setError(
                res,
                'Cập nhật giá thầu chiến dịch thất bại',
                400
            );
        }
        return functions.success(
            res,
            'Cập nhật giá thầu chiến dịch thành công'
        );
    } catch (e) {
        console.log(e);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

// Thêm chiến dịch form 4
exports.createCampaignB4 = async(req, res) => {
    try {
        let { user_id, user_type, cd_ngansach, cd_id } = req.body;
        cd_ngansach = Number(cd_ngansach);
        if (isNaN(cd_id) || isNaN(user_id) || cd_ngansach <= 0)
            return functions.setError(
                res,
                'Thông tin truyền lên không đầy đủ',
                400
            );
        let checkUser = await Users.findOne({
            idTimViec365: user_id,
            type: user_type,
        });
        if (!checkUser)
            return functions.setError(res, 'Người dùng không tồn tại', 400);
        let campaignData = await campainList
            .findOne({
                cd_id: cd_id,
                user_id: user_id,
                user_type: user_type,
            })
            .lean();
        if (!campaignData)
            return functions.setError(res, 'Không tìm thấy chiến dịch', 404);

        const gpa = Number(campaignData.cd_gpa);
        let checkPoint = await pointList
            .findOne({ user_id: user_id, cd_diem: { $gt: cd_ngansach } })
            .lean();
        if (checkPoint) {
            if (gpa < cd_ngansach) {
                let updateCd = await campainList.findOneAndUpdate({ cd_id: campaignData['cd_id'] }, {
                    $set: {
                        cd_ngansach: cd_ngansach,
                        cd_step: 4,
                    },
                });
                if (!updateCd) {
                    return functions.setError(
                        res,
                        'Cập nhật giá thầu chiến dịch thất bại',
                        400
                    );
                }
                await pointList.findOneAndUpdate({ user_id: user_id }, { $inc: { cd_diem: -cd_ngansach } });
                return functions.success(
                    res,
                    'Cập nhật giá thầu chiến dịch thành công'
                );
            } else {
                return functions.setError(
                    res,
                    'Ngân sách phải lớn hơn giá thầu',
                    400
                );
            }
        } else {
            return functions.setError(
                res,
                'Bạn không đủ điểm, hãy nạp điểm ngay!',
                400
            );
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

// lấy danh sách các tin tuyển dụng đang thực hiện = chưa tạo xong
exports.listCampaignProcessing = async(req, res) => {
    try {
        let { user_id, user_type } = req.body;
        if (isNaN(user_id))
            return functions.setError(
                res,
                'Thông tin truyền lên không đầy đủ',
                400
            );
        let campaignData = await campainList
            .find({
                user_id: user_id,
                user_type: user_type,
                cd_step: { $lt: 4 },
            })
            .select('cd_id cd_tin')
            .lean();

        if (!campaignData.length)
            return functions.setError(res, 'Không tìm thấy chiến dịch', 404);
        return functions.success(res, 'Thành công', { list: campaignData });
    } catch (e) {
        console.log(e);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};

// Lấy 6 tin tuyển dụng có quảng cáo
exports.listNewCampaign = async(req, res) => {
    try {
        let { keyword, page, limit } = req.body;
        page = Number(page) || 1;
        limit = Number(limit) || 6;
        let skip = limit * (page - 1),
            currentDate = functions.getTimeNow(),
            match = {
                cd_trangthai: 1,
                cd_step: { $eq: 4 },
                cd_timestart: { $lt: currentDate },
                $or: [{ cd_timeend: 0 }, { cd_timeend: { $gt: currentDate } }],
                $expr: {
                    $lt: [
                        { $add: ['$cd_cpm', '$cd_cpc', '$cd_chuyendoi'] },
                        '$cd_ngansach',
                    ],
                },
            };
        if (keyword) {
            match['cd_tukhoa'] = { $regex: keyword, $options: 'i' };
        }
        let listCampaign = await campainList.aggregate([{
                $match: match,
            },
            {
                $sort: { cd_gpa: -1, cd_id: -1 },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ]);
        let list_new = [];
        if (listCampaign.length > 0) {
            // Tính tổng các giá trị từ danh sách listData
            listCampaign.forEach(async(doc) => {
                const totalTuongTac = doc.cd_tuongtac + 1;
                const totalNganSach = doc.cd_ngansach;
                const totalLuotNhap = doc.cd_luotnhap;
                const totalLuotUngTuyen = doc.cd_luotungtuyen;
                const totalCPM = doc.cd_cpm;
                const cd_id = doc.cd_id;
                const totalchiphi = Number(doc.cd_chiphi);
                // Tính giá trị trung bình cho cd_tile và cd_ngansach
                const tile =
                    totalTuongTac === 0 ?
                    0 :
                    (totalLuotNhap + totalLuotUngTuyen) / totalTuongTac;
                const cd_ngansach = totalNganSach - totalCPM;
                const cd_chiphi = totalchiphi + totalCPM;

                // Cập nhật trường cd_tuongtac, cd_tile, và cd_ngansach cho các tài liệu đã tìm thấy
                // await campainList.updateOne(
                //   { cd_id: cd_id },
                //   {
                //     $inc: { cd_tuongtac: 1 },
                //     $set: {
                //       cd_tile: tile,
                //       cd_ngansach: cd_ngansach,
                //       cd_chiphi: cd_chiphi,
                //     },
                //   }
                // );

                list_new.push(doc.cd_new_id);
            });
        }
        return functions.success(res, 'Thành công', {
            listNew: list_new.join(','),
        });
    } catch (e) {
        console.log(e);
        return functions.setError(res, 'Đã có lỗi xảy ra', 400);
    }
};