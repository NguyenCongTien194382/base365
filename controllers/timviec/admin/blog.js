const PostsTV365 = require('../../../models/Timviec365/Blog/Posts')
const CategoryJob = require('../../../models/Timviec365/CategoryJob')


const functions = require('../../../services/functions')
const fs = require('fs');

// Lấy danh sách Blog
exports.listBlog = async(req, res) => {
    try {
        let page = req.body.page
        let pageSize = req.body.pageSize
        page = page ? Number(page) : 1
        pageSize = pageSize ? Number(pageSize) : 30
        const id = req.body.id ? req.body.id : ''
        const title = req.body.title ? req.body.title : ''
        const admin_id = req.body.admin_id ? Number(req.body.admin_id) : null
        const new_category_id = req.body.new_category_id ? Number(req.body.new_category_id) : null
        const new_301 = req.body.new_301 ? true : false
        const listNews = PostsTV365.aggregate([{
                $addFields: {
                    new_id_string: { $toString: '$new_id' },

                }
            },
            {
                $match: {
                    'new_id_string': {
                        $regex: id,
                        $options: 'i'
                    },
                    'new_title': {
                        $regex: title,
                        $options: 'i'
                    },
                    'new_new': 0,
                    $expr: {
                        $and: [{
                                $cond: {
                                    if: { $eq: [admin_id, null] },
                                    then: true,
                                    else: { $eq: ["$admin_id", admin_id] }
                                },
                            },
                            {
                                $cond: {
                                    if: { $eq: [new_category_id, null] },
                                    then: true,
                                    else: { $eq: ["$new_category_id", new_category_id] }
                                }
                            }
                        ]
                    },
                }
            },
            {
                $lookup: {
                    from: 'AdminUser',
                    localField: 'admin_id',
                    foreignField: 'adm_id',
                    as: 'admin'
                }
            },
            { $unwind: '$admin' },
            {
                $lookup: {
                    from: 'AdminUser',
                    localField: 'new_admin_edit',
                    foreignField: 'adm_id',
                    as: 'admin_edit'
                }
            },
            {
                $unwind: {
                    path: '$admin_edit',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'CategoryBlog',
                    localField: 'new_category_id',
                    foreignField: '_id',
                    as: 'cate'
                }
            },
            { $unwind: '$cate', },
            {
                $project: {
                    _id: 0,
                    'new_id': '$new_id',
                    'admin_id': '$admin.adm_name',
                    'new_title': '$new_title',
                    'new_title_rewrite': '$new_title_rewrite',
                    'new_301': '$new_301',
                    'new_category_id': '$cate.name',
                    'new_picture': '$new_picture',
                    'new_date': '$new_date',
                    'new_admin_edit': '$admin_edit.adm_name',
                    'new_date_last_edit': '$new_date_last_edit',
                    'new_mail': '$new_mail',
                    'new_hits': '$new_hits',
                    'new_hot': '$new_hot',
                    'new_active': '$new_active',
                }
            },
            {
                $sort: { 'new_date': -1 }
            },
            {
                $skip: (page - 1) * pageSize
            },
            {
                $limit: pageSize
            },
        ])
        const totalNews = PostsTV365.aggregate([{
                $addFields: {
                    new_id_string: { $toString: '$new_id' },
                }
            },
            {
                $match: {
                    'new_id_string': {
                        $regex: id,
                        $options: 'i'
                    },
                    'new_title': {
                        $regex: title,
                        $options: 'i'
                    },
                    'new_new': 0,
                    $expr: {
                        $and: [{
                                $cond: {
                                    if: { $eq: [admin_id, null] },
                                    then: true,
                                    else: { $eq: ["$admin_id", admin_id] }
                                }
                            },
                            {
                                $cond: {
                                    if: { $eq: [new_category_id, null] },
                                    then: true,
                                    else: { $eq: ["$new_category_id", new_category_id] }
                                }
                            }
                        ]
                    },
                }
            },
            {
                $count: 'total'
            }
        ])
        const [listArr, total] = await Promise.all([listNews, totalNews])
        let list = []
        listArr.forEach((value, index) => {
            const {
                new_id,
                admin_id,
                new_title,
                new_title_rewrite,
                new_category_id,
                new_date,
                new_picture,
                new_admin_edit,
                new_date_last_edit,
                new_mail,
                new_hits,
                new_hot,
                new_active,
            } = value
            list[index] = {
                new_id,
                admin_id,
                new_title,
                new_title_rewrite,
                new_category_id,
                new_date,
                new_admin_edit,
                new_date_last_edit,
                new_mail,
                new_hits,
                new_hot,
                new_active,
                new_picture: `${process.env.cdn}/pictures/news/${new_picture}`,
            }
            if (new_301) list[index].new_301 = value.new_301
        })
        return await functions.success(res, "Danh sách", { list: list ? list : [], total: total[0]['total'] ? total[0]['total'] : 0 });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Lấy danh sách tag ứng viên ngành nghề
exports.listCateJob = async(req, res) => {
    try {
        const list = await CategoryJob.find({ cat_active: 1 }, { cat_id: 1, cat_name: 1, _id: 0 }).lean()
        return await functions.success(res, "Danh sách", { list: list ? list : [] });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Thêm mới news
exports.addBlog = async(req, res) => {
    try {
        if (!req.body.new_title || !req.body.new_category_id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = await functions.getMaxIdByField(PostsTV365, 'new_id')
        const {
            admin_id,
            new_category_id,
            new_title,
            new_title_rewrite,
            new_cate_url,
            new_vl,
            new_tt,
            new_des,
            new_tag_cate,
            new_teaser,
            new_keyword,
            new_date,
            new_active,
            new_hot,
            new_description,
            new_tdgy,
            new_ndgy,
        } = req.body
        if (req.file) {
            const size = req.file.size / 1024
            if ((req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') && size < 300000) {
                const new_picture = req.file.destination.slice(-10) + '/' + req.file.filename
                await new PostsTV365({
                    new_id: id,
                    admin_id,
                    new_301: "",
                    new_category_id,
                    new_title,
                    new_title_rewrite,
                    new_picture,
                    new_cate_url,
                    new_vl,
                    new_tt,
                    new_des,
                    new_tag_cate,
                    new_teaser,
                    new_keyword,
                    new_date,
                    new_active,
                    new_hot,
                    new_description,
                    new_tdgy,
                    new_ndgy,
                }).save()
                return functions.success(res, "Thêm thành công")
            } else {
                if (req.file)
                    fs.unlink(req.file.path, (e) => {
                        null
                    })
                return functions.setError(res, 'Chỉ được chọn ảnh có kích thước nhỏ hơn 300000Kb')
            }
        } else {
            await new PostsTV365({
                new_id: id,
                admin_id,
                new_301: "",
                new_category_id,
                new_title,
                new_title_rewrite,
                new_cate_url,
                new_vl,
                new_tt,
                new_des,
                new_tag_cate,
                new_teaser,
                new_keyword,
                new_date,
                new_active,
                new_hot,
                new_description,
                new_tdgy,
                new_ndgy,
            }).save()
            return functions.success(res, "Thêm thành công")
        }
    } catch (e) {
        if (req.file)
            fs.unlink(req.file.path, (e) => {
                null
            })
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// chi tiết news
exports.detailBlog = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const blog = await PostsTV365.findOne({ new_id: id }).lean()
        if (!blog) return functions.setError(res, "Không tìm thấy thông tin blog")
        return functions.success(res, "Chi tiết blog", { blog })
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// Sửa news
exports.editBlog = async(req, res) => {
    try {
        if (!req.body.new_title)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const now = functions.getTimeNow()
        const id = Number(req.body.id)
        const {
            new_admin_edit,
            new_category_id,
            new_category_cb,
            new_title,
            new_title_rewrite,
            new_canonical,
            new_cate_url,
            new_vl,
            new_tt,
            new_des,
            new_tag_cate,
            new_teaser,
            new_keyword,
            new_date_last_edit,
            new_active,
            new_hot,
            new_description,
            new_tdgy,
            new_ndgy,
        } = req.body

        if (req.file) {
            const size = req.file.size / 1024
            if ((req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') && size < 300000) {
                const new_picture = req.file.destination.slice(-10) + '/' + req.file.filename
                await PostsTV365.updateOne({ new_id: id }, {
                    new_admin_edit,
                    new_category_id,
                    new_category_cb,
                    new_title,
                    new_title_rewrite,
                    new_picture,
                    new_canonical,
                    new_cate_url,
                    new_vl,
                    new_tt,
                    new_des,
                    new_tag_cate,
                    new_teaser,
                    new_keyword,
                    new_date_last_edit,
                    new_active,
                    new_hot,
                    new_description,
                    new_tdgy,
                    new_ndgy,
                })
                return functions.success(res, "Sửa thành công")
            } else {
                if (req.file)
                    fs.unlink(req.file.path, (e) => {
                        null
                    })
                return functions.setError(res, 'Chỉ được chọn ảnh có kích thước nhỏ hơn 300000Kb')
            }
        } else {
            await PostsTV365.updateOne({ new_id: id }, {
                new_admin_edit,
                new_category_id,
                new_category_cb,
                new_title,
                new_title_rewrite,
                new_canonical,
                new_cate_url,
                new_vl,
                new_tt,
                new_des,
                new_tag_cate,
                new_teaser,
                new_keyword,
                new_date_last_edit,
                new_active,
                new_hot,
                new_description,
                new_tdgy,
                new_ndgy,
            })
            return functions.success(res, "Sửa thành công")
        }

    } catch (e) {
        if (req.file)
            fs.unlink(req.file.path, (e) => {
                null
            })
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// active
exports.activeBlog = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const blog = await PostsTV365.findOne({ new_id: id })
        if (!blog) return functions.setError(res, "Không tìm thấy thông tin blog");
        if (blog.new_active === 1) await PostsTV365.updateOne({ new_id: id }, { new_active: 0 })
        if (blog.new_active === 0) await PostsTV365.updateOne({ new_id: id }, { new_active: 1 })
        return functions.success(res, "Thao tác thành công")
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// hot
exports.hotBlog = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const blog = await PostsTV365.findOne({ new_id: id })
        if (!blog) return functions.setError(res, "Không tìm thấy thông tin blog");
        if (blog.new_hot === 1) await PostsTV365.updateOne({ new_id: id }, { new_hot: 0 })
        if (blog.new_hot === 0) await PostsTV365.updateOne({ new_id: id }, { new_hot: 1 })
        return functions.success(res, "Thao tác thành công")
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// banner
exports.hitsBlog = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const blog = await PostsTV365.findOne({ new_id: id })
        if (!blog) return functions.setError(res, "Không tìm thấy thông tin blog");
        if (blog.new_hits === 1) await PostsTV365.updateOne({ new_id: id }, { new_hits: 0 })
        if (blog.new_hits === 0) await PostsTV365.updateOne({ new_id: id }, { new_hits: 1 })
        return functions.success(res, "Thao tác thành công")
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// mail
exports.mailBlog = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const blog = await PostsTV365.findOne({ new_id: id })
        if (!blog) return functions.setError(res, "Không tìm thấy thông tin blog");
        if (blog.new_mail === 1) await PostsTV365.updateOne({ new_id: id }, { new_mail: 0 })
        if (blog.new_mail === 0) await PostsTV365.updateOne({ new_id: id }, { new_mail: 1 })
        return functions.success(res, "Thao tác thành công")
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// delete blog
exports.deleteBlog = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const blog = await PostsTV365.findOne({ new_id: id }).lean()
        if (!blog) return functions.setError(res, "Không tìm thấy thông tin blog")
        await PostsTV365.deleteOne({ new_id: id })
        return functions.success(res, "Thao tác thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}