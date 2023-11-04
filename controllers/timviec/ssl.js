const functions = require('../../services/functions');
const New = require('../../models/Timviec365/UserOnSite/Company/New');
const Category = require('../../models/Timviec365/CategoryJob');
const SalaryLevel = require('../../models/Timviec365/SalaryLevel');
const KeyWordSSl = require('../../models/Timviec365/KeyWordSSL');
const TblFooter = require('../../models/Timviec365/TblFooter');
const salarylevel = require('../../models/Timviec365/SalaryLevel');

exports.home = async(req, res) => {
    try {
        const seo = await TblFooter.findOne({ id: 1 }).lean();
        return functions.success(res, "Trang chủ", { data: seo });
    } catch (error) {
        return functions.setError(res, error);
    }
}

exports.getkeyword = async(req, res) => {
    try {
        const { keyword, idkeyw } = req.body;
        let condition = {};
        if (keyword || idkeyw) {
            if (keyword) {
                condition = { key_ssl_name: keyword, ...condition };
            }
            if (idkeyw) {
                condition = { key_ssl_id: idkeyw, ...condition };
            }

            const result = await KeyWordSSl.findOne(condition).limit(1).lean();
            if (result) {
                return functions.success(res, "Kết quả", { data: result });
            }
            return functions.setError(res, "Từ khóa không tồn tại");
        }
        return functions.setError(res, "chưa truyền từ khóa");
    } catch (error) {
        return functions.setError(res, error);
    }
}

exports.findSalary = async(req, res, next) => {
    try {
        const cityID = [req.body.cityID];
        const keyword = req.body.keyword || '';
        let data = [];
        if (cityID[0]) {
            data = await New.aggregate([{
                    $match: {
                        cityID: { $in: cityID },
                        title: { $regex: `${keyword}`, $options: "i" }
                    }
                },
                {
                    $group: {
                        _id: '$money',
                        cityID: { $first: '$cityID' },
                        title: { $first: '$title' },
                        CountLevel: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'SalaryLevel',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'salaryLevel'
                    }
                },
                {
                    $unwind: '$salaryLevel'
                },
                {
                    $project: {
                        _id: 0,
                        city: '$cityID',
                        title: '$salaryLevel.title',
                        _id: '$salaryLevel._id',
                        CountLevel: 1
                    }
                }
            ]);
        } else {
            data = await New.aggregate([{
                    $match: {
                        title: { $regex: `${keyword}`, $options: "i" }
                    }
                },
                {
                    $group: {
                        _id: '$money',
                        cityID: { $first: '$cityID' },
                        title: { $first: '$title' },
                        CountLevel: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'SalaryLevel',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'salaryLevel'
                    }
                },
                {
                    $unwind: '$salaryLevel'
                },
                {
                    $project: {
                        _id: 0,
                        city: '$cityID',
                        title: '$salaryLevel.title',
                        _id: '$salaryLevel._id',
                        CountLevel: 1
                    }
                }
            ]);
        }


        if (data.length) return await functions.success(res, 'Thành công', { data });

        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

exports.search = async(req, res) => {
    try {
        const request = req.body,
            city = request.city,
            cate = request.cate,
            keyword = request.keyword;


    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.cate = async(req, res) => {
    try {
        const request = req.body,
            idkeyw = request.idkeyw;

        if (idkeyw) {
            const item = await KeyWordSSl.findOne({
                key_ssl_id: idkeyw
            }).lean();

            if (item) {
                const now = new Date();
                const timenow = now.toISOString().split('T')[0];
                const timenow1 = new Date(now.getTime() - 360 * 24 * 60 * 60 * 1000);
                const timenow1Formatted = timenow1.toISOString().split('T')[0];
            }
            return functions.setError(res, "Không tồn tại ngành nghề này");
        }
        return functions.setError(res, "Thiếu thông tin truyền lên");

    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.show_ssl = async(req, res) => {
    const timenow = new Date();
    const timenow1 = new Date(timenow.getTime() - 30 * 24 * 60 * 60 * 1000);
    const timenow2 = new Date(timenow.getTime() - 60 * 24 * 60 * 60 * 1000);

    const list = await New.aggregate([{
            $match: {
                new_han_nop: { $gt: timenow1 },
            }
        },
        {
            $lookup: {
                from: 'Category',
                localField: 'new_cat_id',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $unwind: '$category'
        },
        {
            $group: {
                // _id: '$category.cat_name',
                cat_id: { $first: '$category._id' },
                sobaiviet: { $sum: 1 },
                tongtien: { $sum: '$new_money' },
                tongthuongluong: { $sum: { $cond: [{ $eq: ['$new_money', 1] }, 1, 0] } },
                tong13: { $sum: { $cond: [{ $eq: ['$new_money', 2] }, 1, 0] } },
                tong35: { $sum: { $cond: [{ $eq: ['$new_money', 3] }, 1, 0] } },
                tong57: { $sum: { $cond: [{ $eq: ['$new_money', 4] }, 1, 0] } },
                tong710: { $sum: { $cond: [{ $eq: ['$new_money', 5] }, 1, 0] } },
                tong1012: { $sum: { $cond: [{ $eq: ['$new_money', 6] }, 1, 0] } },
                tong1520: { $sum: { $cond: [{ $eq: ['$new_money', 7] }, 1, 0] } },
                tong2025: { $sum: { $cond: [{ $eq: ['$new_money', 8] }, 1, 0] } },
                tong300: { $sum: { $cond: [{ $eq: ['$new_money', 9] }, 1, 0] } },
                tong2030: { $sum: { $cond: [{ $eq: ['$new_money', 10] }, 1, 0] } },
                tong1215: { $sum: { $cond: [{ $eq: ['$new_money', 11] }, 1, 0] } },
                tong2530: { $sum: { $cond: [{ $eq: ['$new_money', 12] }, 1, 0] } }
            }
        },
        {
            $sort: {
                cat_id: 1
            }
        },
        {
            $limit: 30
        }
    ]);

    return functions.success(res, "Danh sách", {
        data: tg
    });
}

exports.GetAllLuongBangCapNganhNghe = async(req, res) => {
    try {
        // const currentTime = 1658163600; // Thời gian hiện tại
        const keyword = 'buu-chinh-vien-thong'; // Từ khóa tìm kiếm

        const result = await New.aggregate([{
                $match: {
                    // new_han_nop: { $gt: currentTime },
                    $or: [
                        { new_title: { $regex: keyword, $options: 'i' } },
                        { new_title: { $regex: new RegExp(`.*${keyword}.*`, 'i') } }
                    ]
                }
            },
            {
                $group: {
                    _id: '$new_money',
                    Tile: { $first: '$Tile' },
                    salarylevelid: { $first: '$salarylevelid' },
                    CountLevel: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'salarylevel',
                    localField: 'salarylevelid',
                    foreignField: 'salarylevelid',
                    as: 'salarylevel'
                }
            },
            {
                $unwind: '$salarylevel'
            },
            {
                $project: {
                    new_city: '$new_city',
                    Tile: '$Tile',
                    salarylevelid: '$salarylevelid',
                    CountLevel: '$CountLevel'
                }
            }
        ]);

        return functions.success(res, "zxczxc", { result });
    } catch (error) {
        return functions.setError(res, error);
    }
}