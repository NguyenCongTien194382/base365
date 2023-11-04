const functions = require('../../services/functions'),
    BieuMau = require('../../models/Timviec365/Blog/BieuMau'),
    BieuMauTag = require('../../models/Timviec365/Blog/BieuMauTag'),
    BieuMauNew = require('../../models/Timviec365/Blog/BieuMauNew'),
    TagBlog = require('../../models/Timviec365/Blog/TagBlog');

exports.home = async(req, res) => {
    try {
        // Lấy dannh sách biểu mẫu
        const lists = await BieuMau.find().lean();

        // Xử lý thông tin theo dạng vòng lặp
        for (let i = 0; i < lists.length; i++) {
            const item = lists[i];

            // Lấy ra các bài viết thuộc từng biểu mẫu
            let listNews = await BieuMauNew.find({
                    bmn_cate_id: item._id
                })
                .select("bmn_file bmn_name bmn_id bmn_cate_id")
                .sort({ _id: -1 }).limit(10);
            item.listNews = listNews;
        }
        return await functions.success(res, "Thông tin trang chủ biểu mẫu", { data: lists });

    } catch (error) {
        return functions.setError(res, error.message);
    }
}


// Lấy danh sách danh mục
exports.cate = async(req, res) => {
    try {
        const lists = await BieuMau.find().sort({ _id: -1 }).lean();
        return await functions.success(res, "Thông tin danh mục biểu mẫu", { lists });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Lấy biểu mẫu theo id danh mục
exports.listcate = async(req, res) => {
    try {
        const request = req.body,
            page = Number(request.page) || 1,
            pageSize = Number(request.pageSize) || 10,
            id_bm = request.id_bm;

        if (id_bm) {
            // Lấy thông tin biểu mẫu cần tìm
            const bm = await BieuMau.findOne({ _id: id_bm }).lean();
            if (bm) {

                // Lấy danh sách biểu mẫu theo danh mục dạng phân trang
                const lists = await BieuMauNew.find({ bmn_cate_id: id_bm })
                    .select("bmn_name bmn_id bmn_avatar bmn_url bmn_time bmn_view bmn_teaser")
                    .skip((page - 1) * pageSize).limit(pageSize)
                    .sort({ _id: -1 }).lean();

                // Cập nhật thông tin hình ảnh
                for (let i = 0; i < lists.length; i++) {
                    const element = lists[i];
                    element.bmn_avatar = await functions.getPictureBlogTv365(element.bmn_avatar)
                }

                const result = { bm, lists };
                return await functions.success(res, "Thông tin danh mục biểu mẫu", { data: result });
            }
            return functions.setError(res, "Không tồn tại danh mục");
        }
        return functions.setError(res, "Thiếu thông tin");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Lấy bài viết theo 2 mục tài liệu mới
exports.tlm = async(req, res) => {
    try {
        const listghim = await BieuMauNew.find({ bmn_ghim: 1 }).select("bmn_name bmn_url bmn_id").sort({ _id: -1 }).limit(10),
            list = await BieuMauNew.find().select("bmn_name bmn_url bmn_id").sort({ _id: -1 }).limit(10);

        return await functions.success(res, "Danh sách tài liệu mới", {
            data: { listghim, list }
        });
    } catch (error) {

    }
}

exports.tag = async(req, res) => {
    const { keyid } = req.body;
    if (keyid) {
        const bmtag = await BieuMauTag.findOne({ _id: keyid });
        if (bmtag) {
            const keyword = bmtag.bmt_name;
            const condition = {
                $or: [
                    { bmn_name: { $regex: keyword, $options: 'i' } },
                    { bmn_tag_id: keyid }
                ]
            };

            // Lấy biểu mẫu theo tag
            const listNews = await BieuMauNew.find(condition, {
                bmn_name: 1,
                bmn_id: 1,
                bmn_avatar: 1,
                bmn_time: 1,
                bmn_teaser: 1,
                bmn_view: 1,
                bmn_url: 1
            }).lean();

            // Cập nhật đường dẫn ảnh
            for (let i = 0; i < listNews.length; i++) {
                const element = listNews[i];
                element.bmn_avatar = await functions.getPictureBlogTv365(element.bmn_avatar);
            }

            // Tính tổng
            const count = await BieuMauNew.countDocuments(condition);

            return await functions.success(res, "Danh sách bài viết theo tag", {
                data: {
                    bmtag,
                    listNews,
                    count
                }
            });
        }
        return await functions.setError(res, "Tag không tồn tại");
    }
    return await functions.setError(res, "Thiếu tham số");
}

// Tìm kiếm
exports.search = async(req, res) => {
    try {
        let keyword = req.body.keyword,
            page = req.body.page || 1,
            pageSize = req.body.pageSize || 10;
        if (keyword) {
            let db_qrs, count;
            const count_s = await BieuMauNew.countDocuments({ bmn_name: { $regex: keyword, $options: 'i' } });
            db_qrs = await BieuMauNew.find({ bmn_name: { $regex: keyword, $options: 'i' } })
                .select('bmn_name _id bmn_avatar bmn_time bmn_url bmn_teaser bmn_view')
                .sort({ _id: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            count = count_s;

            // Cập nhật hình ảnh
            for (let i = 0; i < db_qrs.length; i++) {
                const element = db_qrs[i];
                element.bmn_avatar = await functions.getPictureBlogTv365(element.bmn_avatar);
            }

            // if (count_s > 0) {

            // } else {
            //     keyword = keyword.trim();
            //     db_qrs = await BieuMauNew.find({ bmn_name: { $regex: keyword } })
            //         .select('bmn_name _id bmn_avatar bmn_time bmn_url bmn_teaser bmn_view')
            //         .sort({ _id: -1 })
            //         .skip((page - 1) * pageSize)
            //         .limit(pageSize);
            //     count = await BieuMauNew.countDocuments({ bmn_name: { $regex: keyword } });
            // }

            return await functions.success(res, "Kết quả tìm kiếm", {
                data: {
                    db_qrs,
                    count
                }
            });
        }
        return await functions.setError(res, "Thiếu tham số tìm kiếm");
    } catch (error) {
        return await functions.setError(res, error.message);
    }
}

// Chi tiết biểu mẫu
exports.detail = async(req, res) => {
    try {
        const newid = Number(req.body.newid);
        if (newid) {
            const result = await BieuMauNew.aggregate([{
                    $match: {
                        _id: newid
                    }
                },
                {
                    $lookup: {
                        from: "BieuMau",
                        localField: "bmn_cate_id",
                        foreignField: "_id",
                        as: "BieuMau"
                    }
                },
                {
                    $unwind: "$BieuMau"
                },
                {
                    $project: {
                        bmn_name: 1,
                        bmn_id: "$_id",
                        bmn_301: 1,
                        bmn_cate_id: 1,
                        bmn_avatar: 1,
                        bmn_tag_id: 1,
                        bmn_view: 1,
                        bmn_sapo: 1,
                        bmn_teaser: 1,
                        bmn_url: 1,
                        bmn_title: 1,
                        bmn_description: 1,
                        bmn_time: 1,
                        bmn_time_edit: 1,
                        bm_cate: 1,
                        bm_id: "$BieuMau._id",
                        bmn_dg: 1,
                        bmn_point_dg: 1
                    }
                }
            ]);
            if (result) {
                const bm = result[0];
                // Cập nhật lượt xem
                await BieuMauNew.updateOne({ _id: newid }, {
                    $set: {
                        bmn_view: bm.bmn_view + 1
                    }
                });

                // Cập nhật ảnh cdn
                bm.bmn_avatar = await functions.getPictureBlogTv365(bm.bmn_avatar)
                bm.bmn_description = await functions.renderCDNImage(bm.bmn_description);

                // Lấy ra 2 bài viết gợi ý
                const new_lt = await BieuMauNew.find({ _id: { $lt: newid } }).select("bmn_name _id bmn_url").sort({ _id: -1 }).limit(2);

                // Lấy 12 tag chủ đề theo tiêu đề
                let title;
                if (bm.bmn_title != '') {
                    title = bm.bmn_title;
                } else {
                    title = bm.bmn_name;
                }
                const list_cd = await TagBlog.find({ $text: { $search: title } }, { tag_url: 1, tag_key: 1 }).limit(12);

                // Lấy 6 tài liệu liên quan
                const list_reacted = await BieuMauNew.find({
                    _id: { $lt: newid },
                    bmn_cate_id: bm.bmn_cate_id
                }, {
                    bmn_name: 1,
                    bmn_avatar: 1,
                    bmn_teaser: 1,
                    bmn_time: 1
                }).limit(6);

                // Cập nhật hình ảnh
                for (let i = 0; i < list_reacted.length; i++) {
                    const element = list_reacted[i];
                    element.bmn_avatar = await functions.getPictureBlogTv365(element.bmn_avatar);
                }

                return await functions.success(res, "Thông tin chi tiết", {
                    data: { bm, new_lt, list_cd, list_reacted }
                });
            }
            return await functions.setError(res, "Không tồn tại bài viết");
        }
        return await functions.setError(res, "Thiếu tham số");
    } catch (error) {
        return await functions.setError(res, error.message);

    }

}