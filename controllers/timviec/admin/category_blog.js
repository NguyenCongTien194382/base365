const fs = require('fs');
const services = require('../../../services/timviec365/company');
const functions = require('../../../services/functions');
const CategoryBlog = require('../../../models/Timviec365/Blog/Category')
    //Thêm mới danh mục blog
exports.add = async(req, res) => {
    try {
        const data = req.body;
        const { name } = data;
        const { link, title, description, keyword, admin_id } = data;

        let MaxIdCategoryBlog = await CategoryBlog.findOne({}).sort({ _id: -1 }).select('_id').lean();
        if (name == undefined || name == "") {
            return functions.setError(res, "Missing data", 400);
        }

        let new_category_blog = {
            _id: MaxIdCategoryBlog._id + 1,
            name: name,
            active: 0,
            show: 0,
            home: 0,
            order: 0
        };

        if (link) new_category_blog.link = link;
        if (title) new_category_blog.title = title;
        if (description) new_category_blog.description = description;
        if (keyword) new_category_blog.keyword = keyword;
        if (admin_id) new_category_blog.adminID = admin_id;

        new_category_blog = new CategoryBlog(new_category_blog);
        await new_category_blog.save();

        return functions.success(res, 'Thêm mới thành công', { new_category_blog });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

//Lấy danh sách danh mục blog
exports.getList = async(req, res) => {
    try {
        const data = req.body;
        const { _id, name } = data;
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;
        const skip = (page - 1) * pageSize;
        condition = {};
        if (_id) condition._id = Number(_id);
        if (name) condition.name = { $regex: new RegExp(name, 'i') };

        const list_category_blog = await CategoryBlog.aggregate([{
                $sort: { _id: -1 }
            },
            {
                $match: condition
            },
            {
                $skip: skip
            },
            {
                $limit: pageSize
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    active: 1,
                    order: 1,
                }
            }
        ])

        const count = await CategoryBlog.countDocuments(condition);
        return functions.success(res, 'Lấy danh sách thành công', { list_category_blog, count });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Chỉnh sửa danh mục blog
exports.edit = async(req, res) => {
    try {
        const data = req.body;
        const { name } = data;
        const { link, title, description, keyword, order, admin_id } = data;
        const _id = Number(req.body._id);
        //Check điều kiện đầu vào
        if (
            name == undefined || name == "" || isNaN(_id)
        ) {
            return functions.setError(res, "Missing data", 400);
        }

        // Check danh mục blog tồn tại
        let edit_category_blog = {}

        edit_category_blog = await CategoryBlog.findById({ _id: _id });
        if (edit_category_blog == null) {
            return functions.setError(res, "Không tìm thấy danh mục blog", 400);
        }

        //Cập nhật danh mục blog
        edit_category_blog.name = name;

        if (link) edit_category_blog.link = link;
        if (title) edit_category_blog.title = title;
        if (description) edit_category_blog.description = description;
        if (keyword) edit_category_blog.keyword = keyword;
        if (order) edit_category_blog.order = order;
        if (admin_id) edit_category_blog.adminID = admin_id;

        edit_category_blog = new CategoryBlog(edit_category_blog);
        await edit_category_blog.save();

        return functions.success(res, 'Chỉnh sửa thành công', { edit_category_blog });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

//Chi tiết danh mục blog
exports.getDetail = async(req, res) => {
    try {
        let detail_category_blog = {}
        const _id = Number(req.body._id);
        if (_id) {
            detail_category_blog = await CategoryBlog.findById({ _id: _id });
        } else {
            return functions.setError(res, "Missing data", 400);
        }
        return functions.success(res, 'Lấy thông tin tác giả thành công', { detail_category_blog });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

//Xóa danh mục blog
exports.deleteMany = async(req, res) => {
    try {
        const id = req.body.id;
        if (!id) {
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
        }

        if (id.length > 0) {
            let idArray = id.map(idItem => parseInt(idItem));
            await CategoryBlog.deleteMany({ _id: { $in: idArray } });
        }

        return functions.success(res, 'Xóa thông tin tác giả thành công');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

//Active danh mục blog
exports.active = async(req, res) => {
    try {
        let _id = req.body._id;
        let type = req.body.type;
        if (!_id || !type) {
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
        }
        if (isNaN(Number(_id)) || isNaN(Number(type))) {
            return functions.setError(res, 'Thông tin truyền lên sai định dạng', 400);
        }

        if (Number(type) == 0 || Number(type) == 1) {
            await CategoryBlog.findByIdAndUpdate({ _id: Number(_id) }, { active: Number(type) });
        } else {
            return functions.setError(res, 'Trạng thái active không đúng', 400);
        }


        return functions.success(res, 'Cập nhật active thông tin danh mục blog thành công');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};