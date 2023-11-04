const functions = require('../../services/functions'),
    BoDe = require('../../models/Timviec365/Blog/BoDe'),
    BoDeNews = require('../../models/Timviec365/Blog/BoDeNews'),
    BoDeTag = require('../../models/Timviec365/Blog/BoDeTag'),
    TagBlog = require('../../models/Timviec365/Blog/TagBlog'),
    serviceBlog = require('../../services/timviec365/blog');


exports.home = async(req, res, next) => {

    // Lấy tổng số bộ đề
    const count = await functions.findCount(BoDe);

    // Lấy nội dung seo
    let dataSeo = await BoDeNews.findOne({ _id: 0 }, "bdn_name bdn_title bdn_teaser bdn_description").lean();
    dataSeo.bdn_description = dataSeo.bdn_description.replaceAll('src="', 'src="' + functions.hostCDN());

    // Lấy nội dung cuối bài viết
    let list_cate_id8 = await BoDeNews.find({ bdn_cate_id: 8 }, "bdn_name bdn_id bdn_cate_id bdn_avatar bdn_teaser bdn_url").sort({ _id: -1 }).limit(3),
        list_cate_id7 = await BoDeNews.find({ bdn_cate_id: 7 }, "bdn_name bdn_id bdn_cate_id bdn_avatar bdn_teaser").sort({ _id: -1 }).limit(6);

    for (let i = 0; i < list_cate_id8.length; i++) {
        const element = list_cate_id8[i];
        element.bdn_avatar = await functions.getPictureBlogTv365(element.bdn_avatar)
    }

    for (let j = 0; j < list_cate_id7.length; j++) {
        const element = list_cate_id7[j];
        element.bdn_avatar = await functions.getPictureBlogTv365(element.bdn_avatar)
    }

    await functions.success(res, "Trả về kết quả thành công", {
        dataSeo,
        list_cate_id8,
        list_cate_id7,
        count
    });
}

exports.cate = async(req, res, next) => {
    const request = req.body,
        bdid = Number(request.bdid) || 0;

    if (bdid) {
        const cate = await BoDe.findOne({ _id: bdid }, "bd_cate bd_id bd_description bd_keyword bd_title").lean();

        if (cate) {
            const page = Number(request.page) || 1,
                pageSize = Number(request.pageSize) || 10,
                condition = { bdn_cate_id: bdid };

            // Lấy danh sách bài viết của danh mục
            let list = await BoDeNews.find(condition, "bdn_name bdn_url bdn_id bdn_avatar bdn_time bdn_teaser").sort({
                _id: -1
            }).skip((page - 1) * pageSize).limit(pageSize);

            for (let i = 0; i < list.length; i++) {
                const element = list[i];
                element.bdn_avatar = functions.getPictureBlogTv365(element.bdn_avatar);
            }

            // Tính tổng
            const count = functions.findCount(BoDeNews, condition);

            return await functions.success(res, "Thông tin danh mục", {
                data: {
                    cate,
                    list,
                    count
                }
            });
        }
        return await functions.setError(res, "Không tồn tại danh mục", 404);
    }
    return await functions.setError(res, "Thiếu thông tin");
}

exports.search = async(req, res, next) => {
    try {
        const request = req.body,
            page = Number(request.page) || 1,
            pageSize = Number(request.pageSize) || 10,
            keyword = request.keyword;
        if (keyword) {
            const regex = new RegExp(keyword, "i");
            let list = await BoDeNews.find({ bdn_name: regex })
                .select("bdn_name bdn_url bdn_id bdn_avatar bdn_teaser bdn_time")
                .sort({ _id: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize);

            for (let i = 0; i < list.length; i++) {
                const element = list[i];
                element.bdn_avatar = await functions.getPictureBlogTv365(element.bdn_avatar)
            }

            // Lấy tổng
            const count = await BoDeNews.countDocuments({ bdn_name: regex });

            return await functions.success(res, "Danh sách tìm kiếm", {
                data: { list, count }
            });
        }
        return await functions.setError(res, "Không có thông tin tìm kiếm");
    } catch (error) {
        return await functions.setError(res, error.message);
    }
}

exports.search_tag = async(req, res, next) => {
    const request = req.body,
        active = Number(request.active) || 1,
        page = Number(request.page) || 1,
        pageSize = Number(request.pageSize) || 10,
        keyid = Number(request.keyid),
        keyword = request.keyword;
    let condition = { bmt_active: active };

    if (keyid) {
        condition._id = keyid;
    }

    if (keyword) {
        const regex = new RegExp(keyword, "i");
        condition = { bdt_name: regex };
    }

    let list = await BoDeTag.find(condition).sort({ _id: -1 }).skip((page - 1) * pageSize).limit(pageSize);
    let count = await BoDeTag.countDocuments(condition);
    return await functions.success(res, "Danh sách tìm kiếm", {
        data: { list, count }
    });

}

exports.detail = async(req, res, next) => {
    const request = req.body;
    let newid = request.newid;
    if (newid) {
        newid = Number(newid);
        let result = await BoDeNews.aggregate([{
                $match: {
                    _id: newid
                }
            },
            {
                $lookup: {
                    from: "BoDe",
                    localField: "bdn_cate_id",
                    foreignField: "_id",
                    as: "BoDe"
                }
            },
            {
                $project: {
                    bdn_name: 1,
                    bdn_id: 1,
                    bdn_301: 1,
                    bdn_audio: 1,
                    bdn_picture_web: 1,
                    bdn_picture_web2: 1,
                    bdn_cate_url: 1,
                    bdn_link_web: 1,
                    bdn_sapo: 1,
                    bdn_cate_id: 1,
                    bdn_avatar: 1,
                    bdn_tag_id: 1,
                    bdn_teaser: 1,
                    bdn_title: 1,
                    bdn_url: 1,
                    bdn_description: 1,
                    bdn_time: 1,
                    bd_cate: "$BoDe.bd_cate",
                    bd_id: 1,
                    bdn_view: 1,
                    bdn_dg: 1,
                    bdn_point_dg: 1
                }
            }
        ]);
        if (result) {
            const detail = result[0];

            // Xử lý đường dẫn ảnh
            detail.bdn_avatar = functions.getPictureBlogTv365(detail.bdn_avatar);
            detail.bdn_description = functions.renderCDNImage(detail.bdn_description);
            detail.bd_cate = detail.bd_cate[0];

            // Cập nhật view
            await BoDeNews.updateOne({ _id: newid }, {
                $set: {
                    bdn_view: detail.bdn_view + 1
                }
            });
            // Lấy ra 2 bài gần nhất
            const listNear = await BoDeNews.find({
                    _id: { $lt: newid }
                })
                .select("bdn_name _id")
                .sort({ _id: -1 })
                .limit(2);

            // Lấy ra bài viết liên quan
            const listLQ = await BoDeNews.find({
                    _id: { $lt: newid },
                    bdn_cate_id: detail.bdn_cate_id
                })
                .select("bdn_name bdn_id bdn_avatar bdn_teaser bdn_time")
                .sort({ _id: -1 })
                .limit(4);

            for (let j = 0; j < listLQ.length; j++) {
                const element = listLQ[j];
                element.bdn_avatar = await functions.getPictureBlogTv365(element.bdn_avatar);
            }

            // Lấy ra từ khóa liên quan
            const title = detail.bdn_title != "" ? detail.bdn_title : detail.bdn_name,
                listTag = await serviceBlog.relatedkeywords(title);

            // Lấy ra tag câu hỏi tuyển dụng bên phải
            // let key_tag = detail.bd_cate;
            // const count = await BoDeTag.aggregate([{
            //         $match: {
            //             bdt_name: {
            //                 $regex: key_tag.replace(' ', '|')
            //             }
            //         }
            //     },
            //     {
            //         $count: "numrow"
            //     }
            // ]);
            let result_list_tag = [];
            // if (count.length <= 15) {
            //     const end = 15 - count.length;
            //     const list_tag_1 = await BoDeTag.find({ bdt_name: { $regex: key_tag } }).sort({ bdt_active: -1, bdt_id: -1 }).select({ bdt_name: 1, _id: 1 });
            //     for (let i = 0; i < list_tag_1.length; i++) {
            //         const element = list_tag_1[i];
            //         result_list_tag.push(element);
            //     }
            //     const list_tag_2 = await BoDeTag.find({ bdt_name: { $not: key_tag } }).sort({ bdt_active: -1, bdt_id: -1 }).limit(end);
            //     for (let j = 0; j < list_tag_2.length; j++) {
            //         const element = list_tag_2[j];
            //         result_list_tag.push(element);
            //     }
            // } else {

            // }

            return await functions.success(res, "Thông tin chi tiết bài viết", {
                detail,
                listNear,
                listLQ,
                listTag,
                listTagRight: result_list_tag
            });
        }
        return await functions.setError(res, "Không tồn tại bài viết", 404);
    }
    return await functions.setError(res, "Thiếu tham số truyền lên");
}