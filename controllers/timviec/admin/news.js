const PostsTV365 = require('../../../models/Timviec365/Blog/Posts')
const CategoryBlog = require('../../../models/Timviec365/Blog/Category')
const AdminUser = require('../../../models/Timviec365/Admin/AdminUser')

const functions = require('../../../services/functions')
const fs = require('fs');

// Lấy danh sách news
exports.listNews = async(req, res) => {
    try {
        let page = req.body.page
        let pageSize = req.body.pageSize
        page = page ? Number(page) : 1
        pageSize = pageSize ? Number(pageSize) : 30
        const id = req.body.id ? req.body.id : ''
        const title = req.body.title ? req.body.title : ''
        const admin_id = req.body.admin_id ? Number(req.body.admin_id) : null
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
                    'new_new': 1,
                    $expr: {
                        $cond: {
                            if: { $eq: [admin_id, null] },
                            then: true,
                            else: { $eq: ["$admin_id", admin_id] }
                        }
                    }
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
                $project: {
                    _id: 0,
                    'new_id': '$new_id',
                    'new_title': '$new_title',
                    'new_date': '$new_date',
                    'admin_id': '$admin.adm_name',
                    'new_hot': '$new_hot',
                    'new_active': '$new_active',
                    'new_title_rewrite': '$new_title_rewrite',
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
                    'new_new': 1,
                    $expr: {
                        $cond: {
                            if: { $eq: [admin_id, null] },
                            then: true,
                            else: { $eq: ["$admin_id", admin_id] }
                        }
                    }
                }
            },
            {
                $count: 'total'
            }
        ])
        const [list, total] = await Promise.all([listNews, totalNews])
        return await functions.success(res, "Danh sách", { list: list ? list : [], total: total[0]['total'] ? total[0]['total'] : 0 });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Lấy danh sách news liên quan
exports.listNewsLQ = async(req, res) => {
    try {
        const list = await PostsTV365.find({ new_new: 1, new_active: 1 }, {
            new_id: 1,
            new_title: 1,
            _id: 0
        }).lean()
        return await functions.success(res, "Danh sách", { list: list ? list : [] });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Lấy danh sách danh mục
exports.listCate = async(req, res) => {
    try {
        const list = await CategoryBlog.find({ active: 1 }, 'name').lean()
        return await functions.success(res, "Danh sách", { list: list ? list : [] });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Lấy danh sách adminUser
exports.listAdminUser = async(req, res) => {
    try {
        const list = await AdminUser.find({ adm_delete: 0 }, {
            _id: 0,
            adm_id: 1,
            adm_name: 1
        }).lean()
        return await functions.success(res, "Danh sách", { list: list ? list : [] });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Thêm mới news
exports.addNews = async(req, res) => {
    try {
        if (!req.body.new_title || !req.body.new_url_lq)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = await functions.getMaxIdByField(PostsTV365, 'new_id')
        const {
            admin_id,
            new_category_id,
            new_title,
            new_teaser,
            new_description,
            new_keyword,
            new_tt,
            new_des,
            new_url_lq,
            new_date,
            new_hot,
            new_active,
            new_new,
        } = req.body
        if (req.file) {
            const size = req.file.size / 1024
            if ((req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') && size < 300000) {
                const new_picture = req.file.destination.slice(-10) + '/' + req.file.filename
                await new PostsTV365({
                    new_id: id,
                    admin_id,
                    new_category_id,
                    new_title,
                    new_tt,
                    new_des,
                    new_url_lq,
                    new_teaser,
                    new_keyword,
                    new_picture,
                    new_date,
                    new_active,
                    new_new,
                    new_hot,
                    new_date,
                    new_description,
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
                new_category_id,
                new_title,
                new_tt,
                new_des,
                new_url_lq,
                new_teaser,
                new_keyword,
                new_date,
                new_active,
                new_new,
                new_hot,
                new_description,
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
exports.detailNews = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const news = await PostsTV365.findOne({ new_id: id }).lean()
        if (!news) return functions.setError(res, "Không tìm thấy thông tin news")
        return functions.success(res, "Chi tiết posts", { news })
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// Sửa news
exports.editNews = async(req, res) => {
    try {
        if (!req.body.new_title)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const now = functions.getTimeNow()
        const id = Number(req.body.id)
        const {
            new_admin_edit,
            new_category_id,
            new_title,
            new_teaser,
            new_description,
            new_keyword,
            new_tt,
            new_des,
            new_date_last_edit,
            new_hot,
            new_active,
            new_new,
        } = req.body

        if (req.file) {
            const size = req.file.size / 1024
            if ((req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') && size < 300000) {
                const new_picture = req.file.destination.slice(-10) + '/' + req.file.filename
                await PostsTV365.updateOne({ new_id: id }, {
                    new_admin_edit,
                    new_category_id,
                    new_title,
                    new_teaser,
                    new_picture,
                    new_description,
                    new_keyword,
                    new_tt,
                    new_des,
                    new_date_last_edit,
                    new_hot,
                    new_active,
                    new_new,
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
                new_title,
                new_teaser,
                new_description,
                new_keyword,
                new_tt,
                new_des,
                new_date_last_edit,
                new_hot,
                new_active,
                new_new,
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
exports.activeNews = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const news = await PostsTV365.findOne({ new_id: id })
        if (!news) return functions.setError(res, "Không tìm thấy thông tin news");
        if (news.new_active === 1) await PostsTV365.updateOne({ new_id: id }, { new_active: 0 })
        if (news.new_active === 0) await PostsTV365.updateOne({ new_id: id }, { new_active: 1 })
        return functions.success(res, "Thao tác thành công")
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// hot
exports.hotNews = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const news = await PostsTV365.findOne({ new_id: id })
        if (!news) return functions.setError(res, "Không tìm thấy thông tin news");
        if (news.new_hot === 1) await PostsTV365.updateOne({ new_id: id }, { new_hot: 0 })
        if (news.new_hot === 0) await PostsTV365.updateOne({ new_id: id }, { new_hot: 1 })
        return functions.success(res, "Thao tác thành công")
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// delete news
exports.deleteNews = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const news = await PostsTV365.findOne({ new_id: id }).lean();
        if (!news) return functions.setError(res, "Không tìm thấy thông tin news")
        await PostsTV365.deleteOne({ new_id: id })
        return functions.success(res, "Thao tác thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}