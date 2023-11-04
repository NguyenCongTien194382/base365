const functions = require('../../services/functions')
const Blog = require('../../models/Timviec365/Blog/Posts')
const AdminUser = require('../../models/Timviec365/Admin/AdminUser')
const CategoryBlog = require('../../models/Timviec365/Blog/Category')
const TagBlog = require('../../models/Timviec365/Blog/TagBlog')
const NewAuthor = require('../../models/Timviec365/Blog/NewAuthor')
const serviceBlog = require('../../services/timviec365/blog')

const axios = require('axios');

// hàm lấy danh sách blog trang chủ
exports.listBlog = async(req, res, next) => {
    try {
        let page = req.body.page || 1,
            pageSize = req.body.pageSize || 25,
            dataHot = [],
            dataHSTD = [],
            dataCNDN = [],
            dataVP = [],
            dataLuongThuong = [],
            last_id;

        const skip = (page - 1) * pageSize,
            start_hs = skip / pageSize * 4;

        // Lấy bài viết blog hot new + tin nổi bật
        let blogs = await Blog.aggregate([{
                $match: {
                    new_active: 1,
                    new_301: ""
                }
            },
            { $sort: { new_id: -1 } },
            { $skip: skip },
            { $limit: pageSize },
            {
                $lookup: {
                    from: "AdminUser",
                    localField: "admin_id",
                    foreignField: "adm_id",
                    as: "AdminUser"
                }
            },
            {
                $unwind: "$AdminUser"
            },
            {
                $project: {
                    new_id: 1,
                    new_title: 1,
                    new_title_rewrite: 1,
                    new_date: 1,
                    new_teaser: 1,
                    new_picture: 1,
                    new_new: 1,
                    admin_id: "$AdminUser.adm_id",
                    adm_name: "$AdminUser.adm_name",
                }
            }
        ]);
        for (let i = 0; i < blogs.length; i++) {
            const element = blogs[i];
            element.new_picture = functions.getPictureBlogTv365(element.new_picture);
            last_id = element.new_id
        }

        // Lấy bài viết hồ sơ tuyển dụng
        let blogHSTD = await Blog.aggregate([{
                $match: {
                    new_active: 1,
                    new_301: "",
                    new_id: { $lt: Number(last_id) },
                    new_category_id: {
                        $in: [
                            24, 41, 61, 63, 109, 111
                        ]
                    }
                }
            },
            { $sort: { new_id: -1 } },
            { $skip: start_hs },
            { $limit: 4 },
            {
                $lookup: {
                    from: "AdminUser",
                    localField: "admin_id",
                    foreignField: "adm_id",
                    as: "AdminUser"
                }
            },
            {
                $unwind: "$AdminUser"
            },
            {
                $project: {
                    new_id: 1,
                    new_title: 1,
                    new_title_rewrite: 1,
                    new_date: 1,
                    new_teaser: 1,
                    new_picture: 1,
                    new_new: 1,
                    admin_id: "$AdminUser.adm_id",
                    adm_name: "$AdminUser.adm_name"
                }
            }
        ]);
        for (let j = 0; j < blogHSTD.length; j++) {
            const element = blogHSTD[j];
            element.new_picture = functions.getPictureBlogTv365(element.new_picture);
        }

        // Lấy bài viết cẩm nang doanh nghiệp
        let blogCNDN = await Blog.aggregate([{
                $match: {
                    new_active: 1,
                    new_301: "",
                    new_id: { $lt: Number(last_id) },
                    new_category_id: {
                        $in: [
                            23, 27, 29, 31, 51, 53, 117, 153, 155, 157
                        ]
                    }
                }
            },
            { $sort: { new_id: -1 } },
            { $skip: start_hs },
            { $limit: 4 },
            {
                $lookup: {
                    from: "AdminUser",
                    localField: "admin_id",
                    foreignField: "adm_id",
                    as: "AdminUser"
                }
            },
            {
                $unwind: "$AdminUser"
            },
            {
                $project: {
                    "new_id": 1,
                    "new_title": 1,
                    "new_title_rewrite": 1,
                    "new_date": 1,
                    "new_teaser": 1,
                    "new_picture": 1,
                    "new_new": 1,
                    "admin_id": "$AdminUser.adm_id",
                    "adm_name": "$AdminUser.adm_name"
                }
            }
        ]);
        for (let k = 0; k < blogCNDN.length; k++) {
            const element = blogCNDN[k];
            element.new_picture = functions.getPictureBlogTv365(element.new_picture);
        }

        // Lấy blog chuyện văn phòng
        let blogVP = await Blog.aggregate([{
                $match: {
                    new_active: 1,
                    new_301: "",
                    new_id: { $lt: Number(last_id) },
                    new_category_id: {
                        $in: [
                            25, 55, 133, 135
                        ]
                    }
                }
            },
            { $sort: { new_id: -1 } },
            { $skip: start_hs },
            { $limit: 3 },
            {
                $lookup: {
                    from: "AdminUser",
                    localField: "admin_id",
                    foreignField: "adm_id",
                    as: "AdminUser"
                }
            },
            {
                $unwind: "$AdminUser"
            },
            {
                $project: {
                    "new_id": 1,
                    "new_title": 1,
                    "new_title_rewrite": 1,
                    "new_date": 1,
                    "new_teaser": 1,
                    "new_picture": 1,
                    "new_new": 1,
                    "admin_id": "$AdminUser.adm_id",
                    "adm_name": "$AdminUser.adm_name"
                }
            }
        ]);
        for (let l = 0; l < blogVP.length; l++) {
            const element = blogVP[l];
            element.new_picture = functions.getPictureBlogTv365(element.new_picture);
        }

        // Lấy blog lương thưởng
        let blogLT = await Blog.aggregate([{
                $match: {
                    new_active: 1,
                    new_301: "",
                    new_id: { $lt: Number(last_id) },
                    new_category_id: {
                        $in: [
                            45, 49, 105
                        ]
                    }
                }
            },
            { $sort: { new_id: -1 } },
            { $skip: start_hs },
            { $limit: 3 },
            {
                $lookup: {
                    from: "AdminUser",
                    localField: "admin_id",
                    foreignField: "adm_id",
                    as: "AdminUser"
                }
            },
            {
                $unwind: "$AdminUser"
            },
            {
                $project: {
                    "new_id": 1,
                    "new_title": 1,
                    "new_title_rewrite": 1,
                    "new_date": 1,
                    "new_teaser": 1,
                    "new_picture": 1,
                    "new_new": 1,
                    "admin_id": "$AdminUser.adm_id",
                    "adm_name": "$AdminUser.adm_name"
                }
            }
        ]);
        for (let m = 0; m < blogLT.length; m++) {
            const element = blogLT[m];
            element.new_picture = functions.getPictureBlogTv365(element.new_picture);
        }

        // Tính tổng
        const count = await functions.findCount(Blog, {
            new_active: 1,
            new_301: ""
        });
        return functions.success(res, "Lấy danh sách blog thành công", {
            dataHot: blogs,
            dataHSTD: blogHSTD,
            dataCNDN: blogCNDN,
            dataVP: blogVP,
            dataLuongThuong: blogLT,
            count
        });

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// Lấy toàn bộ tin tức theo phân trang
exports.getAllListBlog = async(req, res, next) => {
    try {
        let page = req.body.page || 1,
            pageSize = req.body.pageSize || 3000,
            dataBlog = [],
            last_id;

        const skip = (page - 1) * pageSize;

        let blogs = await Blog.aggregate([{
                $match: {
                    new_active: 1,
                    new_301: { $ne: "" }
                }
            },
            { $sort: { _id: -1 } },
            { $skip: skip },
            { $limit: pageSize },
            {
                $lookup: {
                    from: "AdminUser",
                    localField: "admin_id",
                    foreignField: "adm_id",
                    as: "AdminUser"
                }
            },
            {
                $unwind: "$AdminUser"
            },
            {
                $project: {
                    new_id: 1,
                    new_title: 1,
                    new_title_rewrite: 1,
                    new_date: 1,
                    new_teaser: 1,
                    new_picture: 1,
                    new_new: 1,
                    admin_id: "$AdminUser.adm_id",
                    adm_name: "$AdminUser.adm_name",
                }
            }
        ]);
        for (let i = 0; i < blogs.length; i++) {
            const element = blogs[i];
            element.new_picture = functions.getPictureBlogTv365(element.new_picture);
            last_id = element.new_id
        }
        // Tính tổng
        const count = await functions.findCount(Blog, {
            new_active: 1,
            new_301: ""
        });
        return functions.success(res, "Lấy danh sách blog thành công", {
            dataBlog: blogs,
            count
        });

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.detail = async(req, res, next) => {
    try {
        let idBlog = req.body.blog_id;

        if (idBlog) {
            let blog = await Blog.aggregate([{
                    $match: {
                        new_id: Number(idBlog),
                        new_active: 1,
                        new_new: { $ne: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "AdminUser",
                        localField: "admin_id",
                        foreignField: "adm_id",
                        as: "AdminUser"
                    }
                },
                {
                    $unwind: "$AdminUser"
                },
                {
                    $lookup: {
                        from: "CategoryBlog",
                        localField: "new_category_id",
                        foreignField: "_id",
                        as: "CategoryBlog"
                    }
                },
                {
                    $unwind: "$CategoryBlog"
                },
                {
                    $project: {
                        _id: 0,
                        new_id: 1,
                        new_title: 1,
                        new_title_rewrite: 1,
                        new_picture: 1,
                        new_tt: 1,
                        new_des: 1,
                        new_teaser: 1,
                        new_video: 1,
                        new_date_last_edit: 1,
                        new_date: 1,
                        new_view: 1,
                        new_hits: 1,
                        new_description: 1,
                        new_canonical: 1,
                        new_cate_url: 1,
                        new_category_id: 1,
                        new_301: 1,
                        new_audio: 1,
                        new_tdgy: 1,
                        new_ndgy: 1,
                        cat_id: "$CategoryBlog._id",
                        cat_name: "$CategoryBlog.name",
                        cat_name_rewrite: "$CategoryBlog.nameRewrite",
                        cat_link: "$CategoryBlog.link",
                        admin_id: "$AdminUser.adm_id",
                        adm_name: "$AdminUser.adm_name",
                        new_trans_audio: 1
                    }
                },
                { $limit: 1 }
            ]);
            if (blog.length > 0) {
                let blogDetail = blog[0];

                // Cập nhật đường dẫn ảnh
                blogDetail.new_picture = functions.getPictureBlogTv365(blogDetail.new_picture);
                blogDetail.new_description = blogDetail.new_description.replaceAll('src="', 'src="' + functions.hostCDN());

                // Lấy ra bài viết liên quan
                let blogLQ = await Blog.aggregate([{
                        $match: {
                            new_id: { $ne: Number(idBlog) },
                            new_active: 1,
                            new_301: 1,
                            new_new: { $ne: 1 },
                            new_301: "",
                            new_new: 0,
                            new_category_id: blogDetail.new_category_id
                        }
                    },
                    {
                        $sort: {
                            new_date: -1
                        }
                    },
                    { $limit: 9 },
                    {
                        $lookup: {
                            from: "AdminUser",
                            localField: "admin_id",
                            foreignField: "adm_id",
                            as: "AdminUser"
                        }
                    },
                    {
                        $unwind: "$AdminUser"
                    },
                    {
                        $project: {
                            _id: 0,
                            new_id: 1,
                            new_title: 1,
                            new_title_rewrite: 1,
                            new_picture: 1
                        }
                    }
                ]);

                for (let i = 0; i < blogLQ.length; i++) {
                    const element = blogLQ[i];
                    element.new_picture = functions.getPictureBlogTv365(element.new_picture);
                }

                // Từ khóa liên quan
                const listTag = await serviceBlog.relatedkeywords(blogDetail.new_title)

                return functions.success(res, "Lấy danh sách blog thành công", { blogDetail, blogLQ, listTag });
            }
            return functions.setError(res, 'không tồn tại', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

exports.getAuthorDetail = async(req, res, next) => {
    try {
        let idAdmin = Number(req.body.admin_id);
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        if (idAdmin && page && pageSize) {
            let result = await AdminUser.aggregate([{
                    $match: {
                        adm_id: idAdmin
                    }
                },
                {
                    $lookup: {
                        from: "NewAuthor",
                        localField: "adm_id",
                        foreignField: "adm_id",
                        as: "newAuthor"
                    }
                },
                {
                    $project: {
                        admin_id: "$adm_id",
                        adm_name: "$adm_name",
                        adm_author: "$adm_author",
                        author_content: "$newAuthor.author_content",
                        author_img: "$newAuthor.author_img"
                    }
                }
            ]);
            if (result.length > 0) {
                const admin = result[0];
                let author_content = admin.author_content[0];
                if (author_content != "") {
                    author_content = author_content.replaceAll('src="', 'src="' + functions.hostCDN());
                }
                admin.author_content = author_content;
                admin.author_img = functions.hostCDN() + "/images/" + admin.author_img[0];

                // Phân trang lấy các bài viết của tác giả
                const skip = (page - 1) * pageSize;
                const limit = pageSize;
                let condition = {
                    new_301: "",
                    new_hot: 0,
                    new_new: 0,
                    new_active: 1
                };

                // Nếu là tài khoản admin thì lấy những bài viết của tác giả id: 4,36,38
                if (idAdmin == 4) {
                    condition.admin_id = { $in: [4, 36, 38] };
                } else {
                    condition.admin_id = idAdmin;
                }
                const blogs = await functions.pageFind(Blog, condition, { new_id: -1 }, skip, limit);

                let data = [];
                for (let m = 0; m < blogs.length; m++) {
                    const element = blogs[m];
                    element.adm_name = admin.adm_name;
                    element.admin_id = admin.admin_id;
                    element.new_picture = functions.getPictureBlogTv365(element.new_picture);
                }
                const totalPages = await functions.findCount(Blog, condition);

                return functions.success(res, "Lấy danh sách blog thành công", { admin: admin, totalPages: totalPages, blogs: blogs });
            }
            return functions.setError(res, 'không tồn tại', 404)
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy ra danh sách danh mục 
let back_up_category = [];
exports.getListCategoryBlog = async(req, res, next) => {
    try {
        let categories = [];
        if (back_up_category.length) {
            categories = back_up_category
        } else {
            categories = await functions.getDatafind(CategoryBlog);
            back_up_category = categories;
        }
        return functions.success(res, "Lấy danh sách blog thành công", { categories });
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// hàm lấy ra danh sách danh mục của blog
exports.getListBlogByCate = async(req, res, next) => {
    try {
        const request = req.body,
            array = [14, 21, 17, 16];
        let cateID = Number(request.cate_id),
            page = Number(request.page) || 1,
            pageSize = Number(request.pageSize) || 10,
            skip = (page - 1) * pageSize;
        if (cateID && array.indexOf(cateID) == -1) {
            const category = await functions.getDatafindOne(CategoryBlog, { _id: cateID });
            if (category) {
                // Điều kiện xử lý
                const aggregate = [{
                        $match: {
                            new_category_id: cateID,
                            new_hot: 0,
                            new_active: 1,
                            new_301: ""
                        }
                    },
                    {
                        $lookup: {
                            from: "AdminUser",
                            localField: "admin_id",
                            foreignField: "adm_id",
                            as: "AdminUser"
                        }
                    },
                    {
                        $unwind: "$AdminUser"
                    }
                ];

                // Lấy blog trong danh mục
                let blog = await Blog.aggregate(
                    [...aggregate,
                        { $sort: { new_id: -1 } },
                        { $skip: skip },
                        { $limit: pageSize },
                        {
                            $project: {
                                "new_id": 1,
                                "new_title": 1,
                                "new_title_rewrite": 1,
                                "new_date": 1,
                                "new_teaser": 1,
                                "new_picture": 1,
                                "new_new": 1,
                                "admin_id": "$AdminUser.adm_id",
                                "adm_name": "$AdminUser.adm_name"
                            }
                        }
                    ]);

                let data = [],
                    total = 0;
                for (let m = 0; m < blog.length; m++) {
                    const element = blog[m];
                    element.new_picture = functions.getPictureBlogTv365(element.new_picture);
                }
                if (blog.length > 0) {
                    let countBlog = await Blog.aggregate([...aggregate, { $count: "total" }]);
                    total = countBlog[0].total;
                }
                return functions.success(res, "Lấy danh sách blog thành công", { data: { category, data: blog, total } });
            } else {
                return functions.setError(res, 'Không tồn tại danh mục', 404)
            }
        }
        return functions.setError(res, 'không đủ dữ liệu', 404)

    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
}

// //tool run always
// const translateTextToAudio1 = async(res, req, next) => {
//     let i = -1;
//     while (true) {
//         try {
//             i++;
//             if (i == 4) {
//                 i = -1;
//                 await new Promise((resolve) => setTimeout(resolve, 60000));
//             }
//             const blogCheck = await Blog.find({
//                     $and: [{
//                             $or: [{
//                                     new_trans_audio: {
//                                         $lt: 4,
//                                     },
//                                 },
//                                 {
//                                     new_trans_audio: null,
//                                 },
//                             ],
//                         },
//                         { new_301: '' },
//                     ],
//                 }, {
//                     _id: 0,
//                     new_id: 1,
//                     new_trans_audio: 1,
//                     new_audio: 1,
//                     new_title: 1,
//                     new_teaser: 1,
//                     new_description: 1,
//                 })
//                 .sort({ new_date_last_edit: -1 })
//                 .limit(1);
//             if (blogCheck.length < 1) {
//                 // console.log("You don't have any blog to trans audio");
//                 continue;
//             }
//             const blog = blogCheck[0];
//             let text =
//                 blog.new_title.replace(/<[^>]*>/g, '') +
//                 blog.new_teaser.replace(/<[^>]*>/g, '') +
//                 blog.new_description.replace(/<[^>]*>/g, '');
//             const count = blog.new_trans_audio ? blog.new_trans_audio : 0;
//             if (count == 4) continue;
//             const new_id = blog.new_id;
//             // console.log('Translated text of blog to audio : ' + new_id);
//             let linkAudio = blog.new_audio;
//             text = functions.formatText(text);
//             const data = await axios({
//                 method: 'post',
//                 url: 'http://43.239.223.5:5113/tts',
//                 data: {
//                     text: text.replace('"', "'"),
//                     voice_id: count + 1,
//                     volume: 0,
//                 },
//                 headers: {
//                     'Content-Type': 'application/json', // Đặt Content-Type thành application/json
//                 },
//             });
//             if (!data) {
//                 continue;
//             }
//             if (!data.data) continue;
//             const base64 = data.data.data;
//             const result = serviceBlog.uploadAudio(new_id, base64);
//             if (count == 0) linkAudio = result;
//             else {
//                 linkAudio += ',' + result;
//             }
//             if (!result) {
//                 console.log('error uploading audio');
//                 continue;
//             }
//             await Blog.updateOne({
//                 new_id: new_id,
//             }, {
//                 new_audio: linkAudio,
//                 new_trans_audio: count + 1,
//             });
//             // console.log('Trans text blog to audio is successfully ' + new_id);
//         } catch (e) {
//             console.log(e.message);
//         }
//     }
// };

// translateTextToAudio1();