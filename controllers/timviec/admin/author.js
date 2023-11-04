const fs = require('fs');
const services = require('../../../services/timviec365/company');
const functions = require('../../../services/functions');
const NewAuthor = require('../../../models/Timviec365/Blog/NewAuthor')
const services_author = require('../../../services/timviec365/admin/author')
    //Thêm mới tác giả bài viết
exports.add = async(req, res) => {
    try {
        const data = req.body;
        const { author_type, adm_id } = data;
        const { mxh_facebook, mxh_vk, mxh_trello, mxh_medium, mxh_behance, mxh_twitter, mxh_instagram, author_content } = data;
        const file = req.files.author_img;
        let MaxIdAuthor = await NewAuthor.findOne({}).sort({ _id: -1 }).select('_id').lean();
        if (author_type == undefined || author_type == "" || adm_id == undefined || adm_id == "") {
            return functions.setError(res, "Missing data", 400);
        }

        let new_author = {
            _id: MaxIdAuthor._id + 1,
            author_type: author_type,
            adm_id: adm_id,

        };

        if (file) {
            if (file.size > 0) {
                let author_file = services_author.uploadImageAuthor(file);
                new_author.author_img = author_file.file_name;
            }
        }


        if (mxh_facebook) new_author.mxh_facebook = mxh_facebook;
        if (mxh_vk) new_author.mxh_vk = mxh_vk;
        if (mxh_trello) new_author.mxh_trello = mxh_trello;
        if (mxh_medium) new_author.mxh_medium = mxh_medium;
        if (mxh_behance) new_author.mxh_behance = mxh_behance;
        if (mxh_twitter) new_author.mxh_twitter = mxh_twitter;
        if (mxh_instagram) new_author.mxh_instagram = mxh_instagram;
        if (author_content) new_author.author_content = author_content;

        new_author = new NewAuthor(new_author);
        await new_author.save();

        return functions.success(res, 'Thêm mới thành công', { new_author });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Lấy danh sách tác giả bài viết
exports.getList = async(req, res) => {
    try {
        const data = req.body;
        const page = Number(req.body.page) || 1;
        const pageSize = Number(req.body.pageSize) || 30;
        const skip = (page - 1) * pageSize;
        condition = {};
        const list_author = await NewAuthor.aggregate([{
                $sort: { _id: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: pageSize
            },
            {
                $match: condition
            },
            {
                $project: {
                    _id: 1,
                    author_img: 1,
                    author_content: 1,
                    author_type: 1,
                }
            }
        ])

        list_author.map(item => {
            if (item.author_img) {
                item.author_img = services_author.getImageAuthor(item.author_img);
            }
            return item;
        })

        const count = await NewAuthor.countDocuments(condition);
        return functions.success(res, 'Lấy danh sách thành công', { list_author, count });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// Chỉnh sửa tác giả bài viết
exports.edit = async(req, res) => {
    try {
        const data = req.body;
        const { author_type, adm_id } = data;
        const { mxh_facebook, mxh_vk, mxh_trello, mxh_medium, mxh_behance, mxh_twitter, mxh_instagram, author_content } = data;
        const file = req.files.author_img;
        const _id = Number(req.body._id);
        //Check điều kiện đầu vào
        if (
            author_type == undefined || author_type == "" || adm_id == undefined || adm_id == "" || isNaN(_id)
        ) {
            return functions.setError(res, "Missing data", 400);
        }

        // Check tác giả tồn tại
        let edit_author = {}

        edit_author = await NewAuthor.findById({ _id: _id });
        if (edit_author == null) {
            return functions.setError(res, "Không tìm thấy tác giả", 400);
        }

        //Cập nhật tác giả
        edit_author.author_type = author_type;
        edit_author.adm_id = adm_id;

        if (mxh_facebook) edit_author.mxh_facebook = mxh_facebook;
        if (mxh_vk) edit_author.mxh_vk = mxh_vk;
        if (mxh_trello) edit_author.mxh_trello = mxh_trello;
        if (mxh_medium) edit_author.mxh_medium = mxh_medium;
        if (mxh_behance) edit_author.mxh_behance = mxh_behance;
        if (mxh_twitter) edit_author.mxh_twitter = mxh_twitter;
        if (mxh_instagram) edit_author.mxh_instagram = mxh_instagram;
        if (author_content) edit_author.author_content = author_content;

        if (file) {
            if (file.size > 0) {
                const delete_check = services_author.deleteImageAuthor(edit_author.author_img);
                if (delete_check == false) {
                    functions.setError(res, "Có lỗi xảy ra khi cập nhật file ảnh tác giả", 400);
                }
                let author_file = services_author.uploadImageAuthor(file);
                edit_author.author_img = author_file.file_name;
            }
        }

        edit_author = new NewAuthor(edit_author);
        await edit_author.save();

        return functions.success(res, 'Chỉnh sửa thành công', { edit_author });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.getDetail = async(req, res) => {
    try {
        let detail_author = {}
        const _id = Number(req.body._id);
        if (_id) {
            detail_author = await NewAuthor.findById({ _id: _id });
            if (detail_author && detail_author.author_img) {
                detail_author.author_img = services_author.getImageAuthor(detail_author.author_img);
            }
        } else {
            return functions.setError(res, "Missing data", 400);
        }
        return functions.success(res, 'Lấy thông tin tác giả thành công', { detail_author });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.deleteMany = async(req, res) => {
    try {
        const id = req.body.id;
        if (!id) {
            return functions.setError(res, 'Thông tin truyền lên không đầy đủ', 400);
        }

        if (id.length > 0) {
            let idArray = id.map(idItem => parseInt(idItem));
            await NewAuthor.deleteMany({ _id: { $in: idArray } });
        }

        return functions.success(res, 'Xóa thông tin tác giả thành công');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};