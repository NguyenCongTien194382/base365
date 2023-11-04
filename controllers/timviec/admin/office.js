const functions = require('../../../services/functions')
const PostsTV365 = require('../../../models/Timviec365/Blog/Posts')

const fs = require('fs');

// Lấy danh sách
exports.posts = async(req, res) => {
    try {
        let page = req.body.page
        let pageSize = req.body.pageSize
        page = page ? Number(page) : 1
        pageSize = pageSize ? Number(pageSize) : 30
        const id = req.body.id ? req.body.id : ''
        const title = req.body.title ? req.body.title : ''
        const listPosts = PostsTV365.aggregate([{
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
                    'new_category_id': 133,
                    'new_new': { $in: [0, null] },
                }
            },
            {
                $sort: { 'new_id': -1 }
            },
            {
                $skip: (page - 1) * pageSize
            },
            {
                $limit: pageSize
            },
        ])
        const totalPosts = PostsTV365.aggregate([{
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
                    'new_category_id': 133,
                    'new_new': 0,
                }
            },
            {
                $count: 'total'
            }
        ])
        const [list, total] = await Promise.all([listPosts, totalPosts])
        await list.forEach(value => {
            value['new_picture'] = functions.getUrlImageNews(value['new_picture'])
        })
        return await functions.success(res, "Danh sách", { list: list ? list : [], total: total[0]['total'] ? total[0]['total'] : 0 });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Thêm mới posts
exports.addPosts = async(req, res) => {
    try {
        if (!req.body.new_category_id || !req.body.new_title || !req.body.new_title_rewrite)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const now = functions.getTimeNow()
        const id = await functions.getMaxIdByField(PostsTV365, 'new_id')
        const {
            admin_id,
            new_category_id,
            new_title,
            new_title_rewrite,
            new_tt,
            new_des,
            new_tag_cate,
            new_teaser,
            new_keyword,
            new_date,
            new_active,
            new_new,
            new_hot,
            new_description,
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
                    new_title_rewrite,
                    new_tt,
                    new_des,
                    new_tag_cate,
                    new_teaser,
                    new_keyword,
                    new_picture,
                    new_date,
                    new_active,
                    new_new,
                    new_hot,
                    new_date: now,
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
                new_title_rewrite,
                new_tt,
                new_des,
                new_tag_cate,
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

// chi tiết posts
exports.detailPosts = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const form = await PostsTV365.findOne({ new_id: id }).lean()
        if (!form) return functions.setError(res, "Không tìm thấy thông tin posts")
        return functions.success(res, "Chi tiết posts", { form })
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// Sửa posts
exports.editPosts = async(req, res) => {
    try {
        if (!req.body.new_category_id || !req.body.new_title || !req.body.new_title_rewrite || !req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const now = functions.getTimeNow()
        const id = Number(req.body.id)
        const {
            new_admin_edit,
            new_category_id,
            new_title,
            new_title_rewrite,
            new_tt,
            new_des,
            new_tag_cate,
            new_teaser,
            new_keyword,
            new_date,
            new_active,
            new_new,
            new_hot,
            new_description,
        } = req.body

        if (req.file) {
            const size = req.file.size / 1024
            if ((req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') && size < 300000) {
                const new_picture = req.file.destination.slice(-10) + '/' + req.file.filename
                await PostsTV365.updateOne({ new_id: id }, {
                    new_admin_edit,
                    new_category_id,
                    new_title,
                    new_title_rewrite,
                    new_tt,
                    new_des,
                    new_tag_cate,
                    new_teaser,
                    new_keyword,
                    new_picture,
                    new_date,
                    new_active,
                    new_new,
                    new_hot,
                    new_description,
                    new_date_last_edit: now,
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
                new_title_rewrite,
                new_tt,
                new_des,
                new_tag_cate,
                new_teaser,
                new_keyword,
                new_date,
                new_active,
                new_new,
                new_hot,
                new_description,
                new_date_last_edit: now,
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
exports.activePosts = async(req, res) => {
    try {
        if (!req.body.new_active || !req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const {
            new_active,
        } = req.body
        const post = await PostsTV365.findOne({ new_id: id })
        if (!post) return functions.setError(res, "Không tìm thấy thông tin post");
        await PostsTV365.updateOne({ new_id: id }, {
            new_active,
        })
        return functions.success(res, "Thao tác thành công")
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// mail
exports.mailPosts = async(req, res) => {
    try {
        if (!req.body.new_mail || !req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const {
            new_mail,
        } = req.body
        const post = await PostsTV365.findOne({ new_id: id })
        if (!post) return functions.setError(res, "Không tìm thấy thông tin post");
        await PostsTV365.updateOne({ new_id: id }, {
            new_mail,
        })
        return functions.success(res, "Thao tác thành công")
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// hot
exports.hotPosts = async(req, res) => {
    try {
        if (!req.body.new_hot || !req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const {
            new_hot,
        } = req.body
        const post = await PostsTV365.findOne({ new_id: id })
        if (!post) return functions.setError(res, "Không tìm thấy thông tin post");
        await PostsTV365.updateOne({ new_id: id }, {
            new_hot,
        })
        return functions.success(res, "Thao tác thành công")
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// xóa posts
exports.deletePosts = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const post = await PostsTV365.findOne({ new_id: id }).lean()
        if (!post) return functions.setError(res, "Không tìm thấy thông tin post")
        await PostsTV365.deleteOne({ new_id: id })
        return functions.success(res, "Thao tác thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}