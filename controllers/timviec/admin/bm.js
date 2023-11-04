const functions = require('../../../services/functions'),
    BieuMau = require('../../../models/Timviec365/Blog/BieuMau'),
    BieuMauTag = require('../../../models/Timviec365/Blog/BieuMauTag'),
    BieuMauNew = require('../../../models/Timviec365/Blog/BieuMauNew');
const fs = require('fs');

// Lấy danh sách danh mục
exports.cate = async(req, res) => {
    try {
        let page = req.body.page
        let pageSize = req.body.pageSize
        const keywords = req.body.keywords ? req.body.keywords : ''
        page = page ? Number(page) : 1
        pageSize = pageSize ? Number(pageSize) : 30
        const listCate = BieuMau.find({
            bm_cate: { $regex: keywords, $options: 'i' }
        }).sort({ _id: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean();
        const totalCate = BieuMau.find().count()
        const [list, total] = await Promise.all([listCate, totalCate])
        return await functions.success(res, "Thông tin danh mục biểu mẫu", { list: list ? list : [], total: total ? total : total });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Thêm mới danh mục
exports.addCate = async(req, res) => {
    try {
        if (!req.body.bm_cate || !req.body.bm_order || !req.body.bm_footer_order)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = await functions.getMaxIdByField(BieuMau, '_id')
        const {
            bm_cate,
            bm_order,
            bm_footer_order,
            bm_title,
            bm_description,
            bm_keyword,
            bm_mota,
        } = req.body
        await new BieuMau({
            _id: id,
            bm_cate,
            bm_order,
            bm_footer_order,
            bm_title,
            bm_description,
            bm_keyword,
            bm_mota,
        }).save()
        return functions.success(res, "Thêm thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// Sửa danh mục
exports.editCate = async(req, res) => {
    try {
        if (!req.body.bm_cate || !req.body.bm_order || !req.body.bm_footer_order || !req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const {
            bm_cate,
            bm_order,
            bm_footer_order,
            bm_title,
            bm_description,
            bm_keyword,
            bm_mota,
        } = req.body
        const cate = await BieuMau.findOne({ _id: id })
        if (!cate) return functions.setError(res, "Không tìm thấy thông tin danh mục");
        await BieuMau.updateOne({ _id: id }, {
            bm_cate,
            bm_order,
            bm_footer_order,
            bm_title,
            bm_description,
            bm_keyword,
            bm_mota,
        })
        return functions.success(res, "Sửa thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// Xóa danh mục
exports.deleteCate = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const cate = await BieuMau.findOne({ _id: id })
        if (!cate) return functions.setError(res, "Không tìm thấy thông tin danh mục");
        await BieuMau.deleteOne({ _id: id })
        return functions.success(res, "Xóa thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// Lấy danh sách tag
exports.tag = async(req, res) => {
    try {
        let page = req.body.page
        let pageSize = req.body.pageSize
        const keywords = req.body.keywords ? req.body.keywords : ''
        page = page ? Number(page) : 1
        pageSize = pageSize ? Number(pageSize) : 30
        const listBM = BieuMauTag.find({
            bmt_name: { $regex: keywords, $options: 'i' }
        }).sort({ _id: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean();
        const totalBM = BieuMauTag.find().count()
        const [
            list,
            total,
        ] = await Promise.all([listBM, totalBM])
        return await functions.success(res, "Thông tin biểu mẫu", { list: list ? list : [], total });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Thêm mới tag
exports.addTag = async(req, res) => {
    try {
        if (!req.body.bmt_name || !req.body.bmt_active)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = await functions.getMaxIdByField(BieuMauTag, '_id')
        const {
            bmt_name,
            bmt_active,

        } = req.body
        await new BieuMauTag({
            _id: id,
            bmt_name,
            bmt_active,
        }).save()
        return functions.success(res, "Thêm thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// Sửa tag
exports.editTag = async(req, res) => {
    try {
        if (!req.body.bmt_name || !req.body.bmt_active || !req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const {
            bmt_name,
            bmt_title,
            bmt_des,
            bmt_key,
            bmt_active,
        } = req.body
        const tag = await BieuMauTag.findOne({ _id: id })
        if (!tag) return functions.setError(res, "Không tìm thấy thông tin tag");
        await BieuMauTag.updateOne({ _id: id }, {
            bmt_name,
            bmt_title,
            bmt_des,
            bmt_key,
            bmt_active,
        })
        return functions.success(res, "Sửa thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// Active tag
exports.activeTag = async(req, res) => {
    try {
        if (!req.body.bmt_active || !req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const {
            bmt_active,
        } = req.body
        const tag = await BieuMauTag.findOne({ _id: id })
        if (!tag) return functions.setError(res, "Không tìm thấy thông tin tag");
        await BieuMauTag.updateOne({ _id: id }, {
            bmt_active,
        })
        return functions.success(res, "Thao tác thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// Xóa tag
exports.deleteTag = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const tag = await BieuMauTag.findOne({ _id: id })
        if (!tag) return functions.setError(res, "Không tìm thấy thông tin tag");
        await BieuMauTag.deleteOne({ _id: id })
        return functions.success(res, "Xóa thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// chi tiết tag
exports.detailTag = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const tag = await BieuMauTag.findOne({ _id: id }).lean()
        if (!tag) return functions.setError(res, "Không tìm thấy thông tin tag")
        return functions.success(res, "Chi tiết tag", { tag })
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// Lấy danh sách biểu mẫu
exports.form = async(req, res) => {
    try {
        let page = req.body.page
        let pageSize = req.body.pageSize
        const keywords = req.body.keywords ? req.body.keywords : ''
        page = page ? Number(page) : 1
        pageSize = pageSize ? Number(pageSize) : 30
        const listBM = BieuMauNew.find({
            bmn_name: { $regex: keywords, $options: 'i' }
        }).sort({ _id: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean();
        const totalBM = BieuMauNew.find().count()
        const [
            list,
            total,
        ] = await Promise.all([listBM, totalBM])
        await list.forEach(value => {
            value['bmn_avatar'] = functions.getUrlImageNews(value['bmn_avatar'])
        })
        return await functions.success(res, "Thông tin biểu mẫu", { list: list ? list : [], total });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Thêm mới biểu mẫu
exports.addForm = async(req, res) => {
    try {
        if (!req.body.bmn_name || !req.body.bmn_cate_id || !req.body.bmn_tag_id || !req.body.bmn_teaser || !req.body.bmn_sapo)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = await functions.getMaxIdByField(BieuMauNew, '_id')
        const {
            bmn_name,
            bmn_cate_id,
            bmn_tag_id,
            bmn_file,
            bmn_title,
            bmn_url,
            bmn_cate_url,
            bmn_teaser,
            bmn_sapo,
            bmn_description,
        } = req.body
        if (req.file) {
            const size = req.file.size / 1024
            if ((req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') && size < 300000) {
                const bmn_avatar = req.file.destination.slice(-10) + '/' + req.file.filename
                const bmn_time = new Date()
                await new BieuMauNew({
                    _id: id,
                    bmn_name,
                    bmn_cate_id,
                    bmn_tag_id,
                    bmn_avatar,
                    bmn_file,
                    bmn_title,
                    bmn_url,
                    bmn_cate_url,
                    bmn_teaser,
                    bmn_sapo,
                    bmn_description,
                    bmn_time
                }).save()
                return functions.success(res, "Thêm thành công")
            } else {
                fs.unlink(req.file.path, (e) => {
                    null
                })
                return functions.setError(res, 'Chỉ được chọn ảnh có kích thước nhỏ hơn 300000Kb')
            }
        } else {
            await new BieuMauNew({
                _id: id,
                bmn_name,
                bmn_cate_id,
                bmn_tag_id,
                bmn_file,
                bmn_title,
                bmn_url,
                bmn_cate_url,
                bmn_teaser,
                bmn_sapo,
                bmn_description,
            }).save()
            return functions.success(res, "Thêm thành công")
        }

    } catch (e) {
        fs.unlink(req.file.path, (e) => {
            null
        })
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// Sửa biểu mẫu
exports.editForm = async(req, res) => {
    try {
        if (!req.body.bmn_name || !req.body.bmn_cate_id || !req.body.bmn_tag_id || !req.body.bmn_teaser || !req.body.bmn_sapo || !req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const {
            bmn_name,
            bmn_cate_id,
            bmn_tag_id,
            bmn_file,
            bmn_title,
            bmn_url,
            bmn_cate_url,
            bmn_teaser,
            bmn_sapo,
            bmn_description,
        } = req.body
        if (req.file) {
            const size = req.file.size / 1024
            if ((req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg') && size < 300000) {
                const bmn_avatar = req.file.destination.slice(-10) + '/' + req.file.filename
                const bmn_time = new Date()
                await BieuMauNew.updateOne({ _id: id }, {
                    _id: id,
                    bmn_name,
                    bmn_cate_id,
                    bmn_tag_id,
                    bmn_avatar,
                    bmn_file,
                    bmn_title,
                    bmn_url,
                    bmn_cate_url,
                    bmn_teaser,
                    bmn_sapo,
                    bmn_description,
                    bmn_time
                })
                return functions.success(res, "Sửa thành công")
            } else {
                fs.unlink(req.file.path, (e) => {
                    null
                })
                return functions.setError(res, 'Chỉ được chọn ảnh có kích thước nhỏ hơn 300000Kb')
            }
        } else {
            await BieuMauNew.updateOne({ _id: id }, {
                _id: id,
                bmn_name,
                bmn_cate_id,
                bmn_tag_id,
                bmn_file,
                bmn_title,
                bmn_url,
                bmn_cate_url,
                bmn_teaser,
                bmn_sapo,
                bmn_description,
            })
            return functions.success(res, "Sửa thành công")
        }

    } catch (e) {
        fs.unlink(req.file.path, (e) => {
            null
        })
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// Ghim biểu mẫu
exports.pinForm = async(req, res) => {
    try {
        if (!req.body.bmn_ghim || !req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const {
            bmn_ghim,
        } = req.body
        const form = await BieuMauNew.findOne({ _id: id })
        if (!form) return functions.setError(res, "Không tìm thấy thông tin biểu mẫu");
        await BieuMauNew.updateOne({ _id: id }, {
            bmn_ghim,
        })
        return functions.success(res, "Thao tác thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// Xóa biểu mẫu
exports.deleteForm = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const form = await BieuMauNew.findOne({ _id: id })
        if (!form) return functions.setError(res, "Không tìm thấy thông tin biểu mẫu");
        await BieuMauNew.deleteOne({ _id: id })
        return functions.success(res, "Xóa thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// chi tiết biểu mẫu
exports.detailForm = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const form = await BieuMauNew.findOne({ _id: id }).lean()
        if (!form) return functions.setError(res, "Không tìm thấy thông tin biểu mẫu")
        return functions.success(res, "Chi tiết biểu mẫu", { form })
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

exports.tagAllBM = async(req, res) => {
    const listNews = await BieuMauTag.find({}).sort({ _id: -1 }).lean();
    const count = await BieuMauTag.countDocuments();
    return await functions.success(res, 'Danh sách Tag', {
        data: {
            listNews,
            count,
        },
    });
};

exports.detailDMBM = async(req, res) => {
    try {
        let id = req.body.id;
        if (id) {
            let checkdata = await BieuMau.findOne({ _id: id })
            if (checkdata) {
                const [list] = await BieuMau.aggregate([
                    { $match: { _id: Number(id) } },
                    {
                        $project: {
                            bm_id: "$_id",
                            bm_cate: "$bm_cate",
                            bm_order: "$bm_order",
                            bm_footer_order: "$bm_footer_order",
                            bm_description: "$bm_description",
                            bm_h1: "$bm_h1",
                            bm_keyword: "$bm_keyword",
                            bm_title: "$bm_title",
                            bm_mota: "$bm_mota",
                        }
                    }
                ]);

                return functions.success(res, "Chi tiết danh mục biểu mẫu", {
                    data: {
                        list
                    }
                });
            } else {
                return functions.success(res, 'Không tìm thấy chi tiết danh mục biểu mẫu')
            }
        }
    } catch (error) {
        console.log(error)
        return functions.setError(res, error)
    }
};