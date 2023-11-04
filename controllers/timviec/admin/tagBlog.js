const TagBlog = require('../../../models/Timviec365/Blog/TagBlog')

const xlsx = require('xlsx');
const functions = require('../../../services/functions')
const fs = require('fs');

// Lấy danh sách 
exports.listTagBlog = async(req, res) => {
    try {
        let page = req.body.page
        let pageSize = req.body.pageSize
        page = page?Number(page):1
        pageSize = pageSize?Number(pageSize):30
        const id = req.body.id?req.body.id:''
        const name = req.body.name?req.body.name:''
        const url = req.body.url?req.body.url:''
        const listTag = TagBlog.aggregate([
            {
                $addFields: {
                    tag_id_string: {$toString: '$_id'},

                }
            },
            {
                $match: {
                    'tag_id_string': {
                        $regex: id,
                        $options: 'i'
                    },
                    'tag_key': {
                        $regex: name,
                        $options: 'i'
                    },
                    'tag_url': {
                        $regex: url,
                        $options: 'i'
                    },
                }
            },
            {
                $project: {
                    'tag_key': '$tag_key',
                    'tag_url': '$tag_url',
                }
            },
            {
                $sort: {'_id': -1}
            },
            {
                $skip: (page-1)*pageSize
            },
            {
                $limit: pageSize
            },
        ])
        const totalTag = TagBlog.aggregate([
            {
                $addFields: {
                    tag_id_string: {$toString: '$_id'},

                }
            },
            {
                $match: {
                    'tag_id_string': {
                        $regex: id,
                        $options: 'i'
                    },
                    'tag_key': {
                        $regex: name,
                        $options: 'i'
                    },
                    'tag_url': {
                        $regex: url,
                        $options: 'i'
                    },
                }
            },
            {
                $count: 'total'
            }
        ])
        const [list,total] = await Promise.all([listTag, totalTag])
        return await functions.success(res, "Danh sách", { list: list?list:[], total: total[0]?total[0]['total']:0});
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}

// Thêm 
exports.addTagBlog = async (req, res) => {
    try {
        const tag_key = req.body.tag_key?req.body.tag_key:''
        const tag_url = req.body.tag_url?req.body.tag_url:''

        const _id = await functions.getMaxIdByField(TagBlog, '_id')
        const tag = new TagBlog({
            _id,
            tag_key,
            tag_url,
        })
        await tag.save()
        return await functions.success(res, "Thành công", {data: tag});
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}

// Sửa 
exports.editTagBlog = async (req, res) => {
    try {
        if(!req.body.id) return functions.setError(res, 'Thiếu dữ liệu truyền lên')
        const id = Number(req.body.id)
        const tag_key = req.body.tag_key?req.body.tag_key:''
        const tag_url = req.body.tag_url?req.body.tag_url:''

        const tag = await TagBlog.findOne({_id: id})
        if(!tag) return functions.setError(res, 'Không tìm thấy thông tin')
        await TagBlog.updateOne({_id: id}, {
            tag_key,
            tag_url,
        })
        return await functions.success(res, "Thành công");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}

// Detal
exports.detailTagBlog = async(req, res) => {
    try {
        if(!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const tag = await TagBlog.findOne({_id: id})
        if(!tag) return functions.setError(res, 'Không tìm thấy thông tin')
        return functions.success(res, "Thao tác thành công", {tag})
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Delete
exports.deleteTagBlog = async(req, res) => {
    try {
        if(!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const tag = await TagBlog.findOne({_id: id})
        if(!tag) return functions.setError(res, 'Không tìm thấy thông tin')
        await TagBlog.deleteOne({_id: id})
        return functions.success(res, "Thao tác thành công")
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Add excel
exports.addExcelTagBlog = async(req, res) => {
    try {
        if(!req.file) return functions.setError(res, 'Thiếu dữ liệu truyền lên')
        const filePath = req.file.path
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        // Mảng để lưu trữ dữ liệu từ cột A và B
        const data = [];

        // Lặp qua các ô trong cột A và B
        for (let i = 1; ; i++) {
            // Đọc giá trị từ ô A[i] và B[i]
            const cellA = worksheet[`A${i}`];
            const cellB = worksheet[`B${i}`];

            // Kiểm tra nếu cả hai ô đều trống, dừng vòng lặp
            if (!cellA && !cellB) {
                break;
            }

            // Lấy giá trị từ ô A[i] và B[i]
            const valueA = cellA ? cellA.v : '';
            const valueB = cellB ? cellB.v : '';

            // Thêm dữ liệu vào mảng
            data.push({ A: valueA, B: valueB });
        }
        for (let i = 0; i < data.length; i++) {
            const _id = await functions.getMaxIdByField(TagBlog, '_id')
            const tag_key = data[i].A
            const tag_url = data[i].B
            await new TagBlog({
                _id,
                tag_key,
                tag_url,
            }).save()
        }
        fs.unlinkSync(filePath);
        return functions.success(res, "Thao tác thành công")
    } catch (error) {
        const filePath = req.file.path
        fs.unlinkSync(filePath);
        return functions.setError(res, error.message);
    }
}