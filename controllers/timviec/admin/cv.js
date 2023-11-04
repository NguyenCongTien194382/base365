const CV = require("../../../models/Timviec365/CV/Cv365");
const CvGroup = require("../../../models/Timviec365/CV/CVGroup");
const CvCategory = require("../../../models/Timviec365/CV/Category");
const CvLang = require("../../../models/Timviec365/CV/CVLang");
const functions = require("../../../services/functions");
const CvDesign = require("../../../models/Timviec365/CV/CVDesign");
const fs = require('fs');
const path = require('path');

// create and edit Cv
exports.createCv = async(req, res, next) => {
    if (req.body.type) {
        try {
            const request = req.body;
            const data = {
                name: request.name,
                alias: request.alias,
                url_alias: request.url_alias,
                url_canonical: request.url_canonical,
                content: request.content,
                price: request.price,
                mota_cv: request.mota_cv,
                html_vi: request.html_vi,
                html_en: request.html_en,
                html_jp: request.html_jp,
                html_cn: request.html_cn,
                html_kr: request.html_kr,
                cate_id: request.cate_id,
                lang_id: request.lang_id,
                design_id: request.design_id,
                cid: request.cid,
                colors: request.colors,
                full: request.full,
                meta_title: request.meta_title,
                meta_key: request.meta_key,
                meta_des: request.meta_des,
                vip: request.vip,
                thutu: request.thutu,
                status: request.status,
                note: request.note,
                type_cv: request.type_cv
            };
            // handle save img
            if (req.files.image) {
                const fsPromises = fs.promises;

                const storagePath = path.join(__dirname, '../../../../storage/base365/timviec365/cv365/upload/cv/thumb');

                const imagePath = `${storagePath}/${req.files.image.name}`;

                try {
                    const isImageExists = await fsPromises.access(imagePath, fs.constants.F_OK)
                        .then(() => true)
                        .catch(() => false);

                    if (!isImageExists) {
                        await fsPromises.copyFile(req.files.image.path, imagePath);
                        await fsPromises.unlink(req.files.image.path);
                    }
                    data.image = req.files.image.name;
                } catch (e) {
                    return functions.setError(res, e.message);
                }
            }

            if (request.type == 0) {
                // add _id
                if (request.type_cv == 0) {
                    let _id = 1;
                    await CV.findOne({}, { _id: 1 }).sort({ _id: -1 }).then((res) => {
                        if (res) {
                            _id = res._id + 1;
                        }
                    })
                    data._id = _id;
                } else {
                    let _id = 100001;
                    await CV.findOne({}, { _id: 1 }).sort({ _id: -1 }).then((res) => {
                        if (res) {
                            _id = res._id + 1;
                        }
                    })
                    data._id = _id;
                }

                await CV.create(data);
                return functions.success(res, `Tạo thành công`);
            }
            // update Cv
            else {
                if (request.id) {
                    try {
                        await CV.updateOne({
                            _id: request.id
                        }, {
                            $set: data
                        })
                        return functions.success(res, `Chỉnh sửa Cv thành công`);
                    } catch (error) {
                        return functions.setError(res, `Lỗi khi chỉnh sửa Cv: ${error.message}`);
                    }
                } else {
                    return functions.setError(res, `Thiếu thông tin truyền lên`);
                }
            }
        } catch (e) {
            return functions.setError(res, e.message, 404);
        }
    } else {
        return functions.setError(res, `Thiếu thông tin truyền lên`);
    }
}


// create danh muc Cv
exports.createDanhMucCv = async(req, res, next) => {
    try {
        const request = req.body;
        const _id = await functions.getMaxIdByField(CvGroup, '_id')
        const data = {
            name: request.name,
            alias: request.alias,
            shortName: request.short_name,
            content: request.content,
            sapo: request.sapo,
            menu: request.menu,
            sort: request.sort,
            metaTitle: request.meta_title,
            metaKey: request.meta_key,
            metaDes: request.meta_des,
            status: request.status,
        }
        if (req.file) {
            const size = req.file.size / 1024
            if ((req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg')) {
                const image = req.file.destination.slice(-10) + '/' + req.file.filename
                await new CvGroup({
                    ...data,
                    _id,
                    image,

                }).save()
                return functions.success(res, "Tạo thành công")
            } else {
                if (req.file)
                    fs.unlink(req.file.path, (e) => {
                        null
                    })
                return functions.setError(res, 'Chỉ được chọn ảnh')
            }
        } else {
            await new CvGroup({
                ...data,
                _id,
            }).save()
            return functions.success(res, "Tạo thành công")
        }
    } catch (e) {
        if (req.file)
            fs.unlink(req.file.path, (e) => {
                null
            })
        return functions.setError(res, e.message, 404);
    }
}

// update status Cv
exports.updateStatusCv = async(req, res, next) => {
    try {
        let type = req.body.type,
            id_cv = req.body.id_cv,
            status = req.body.status;
        if (type && id_cv) {
            let data = {};
            switch (Number(type)) {
                case 1:
                    data.design_id = status;
                    break;
                case 2:
                    data.cv_index = status;
                    break;
                case 3:
                    data.vip = status;
                    break;
                case 4:
                    data.status = status;
                    break;
                default:
                    break;
            }
            try {
                const isExits = await CV.findOne({ _id: id_cv });
                if (isExits) {
                    await CV.updateOne({
                        _id: id_cv
                    }, {
                        $set: data
                    })
                    return functions.success(res, `Cập nhật Cv thành công`);
                } else {
                    return functions.setError(res, 'Không tìm thấy Cv tương ứng');
                }
            } catch (error) {
                return functions.setError(res, `Lỗi khi chỉnh sửa Cv: ${error.message}`);
            }
        } else {
            return functions.setError(res, 'Thiếu thông tin truyền lên');
        }
    } catch (e) {
        return functions.setError(res, e.message, 404);
    }
}

// delete Cv
exports.deleteCv = async(req, res, next) => {
    let id_cv = req.body.id_cv
    if (id_cv) {
        try {
            const isExits = await CV.findOne({ _id: id_cv });
            if (isExits) {
                await CV.deleteOne({
                    _id: id_cv
                });
                return functions.success(res, 'Xóa Cv thành công');
            } else {
                return functions.setError(res, 'Không tìm thấy Cv tương ứng');
            }
        } catch (error) {
            return functions.setError(res, 'Lỗi khi xóa Cv: ' + error.message);
        }
    } else {
        return functions.setError(res, 'Thiếu thông tin truyền lên')
    }
}

// get list Cv
exports.listCv = async(req, res, next) => {
    try {
        const request = req.body;

        let key_word = request.key_word,
            cate_id = request.cate_id,
            cv_index = request.index,
            vip = request.vip,
            page = request.page || 1,
            pageSize = request.pageSize || 10,
            type_cv = request.type_cv || 0;

        const skip = (page - 1) * pageSize;

        if (key_word || cate_id || cv_index || vip) {

            const searchConditions = [
                { type: type_cv }
            ];

            if (cate_id) {
                searchConditions.push({ cate_id: cate_id });
            }
            if (cv_index) {
                searchConditions.push({ cv_index: cv_index });
            }
            if (vip) {
                searchConditions.push({ vip: vip });
            }

            const orConditions = [];

            if (key_word) {
                orConditions.push({ name: { $regex: key_word, $options: 'i' } }, { note: { $regex: key_word, $options: 'i' } });
                if (!isNaN(key_word)) {
                    orConditions.push({ _id: key_word }, );
                }
            }

            if (orConditions.length > 0) {
                searchConditions.push({ $or: orConditions });
            }

            const total = await CV.countDocuments({ $and: searchConditions });
            const data = await CV
                .find({ $and: searchConditions })
                .skip(skip)
                .limit(Number(pageSize))
                .select("_id name url_alias alias cv_index vip status cate_id cid design_id lang_id note image")
                .sort({ _id: -1 });

            return functions.success(res, "Danh sách cv", { data, total: total });
        } else {
            const total = await CV.countDocuments({
                type: type_cv
            });
            const data = await CV.find({
                    type: type_cv
                })
                .skip(skip)
                .limit(Number(pageSize))
                .select("_id name url_alias cv_index vip status cate_id cid design_id lang_id note image")
                .sort({ _id: -1 });

            return functions.success(res, "Danh sách cv", { data, total: total });
        }
    } catch (e) {
        functions.setError(res, e.message);
    }
}

// detail Cv
exports.detailCv = async(req, res, next) => {
    let id_cv = req.body.id_cv
    if (id_cv) {
        try {
            data = await CV.findOne({
                _id: id_cv
            });
            if (data) {
                return functions.success(res, 'Lấy Cv thành công', { data });
            } else {
                return functions.setError(res, 'Không tìm thấy cv tương ứng');
            }
        } catch (error) {
            return functions.setError(res, error.message);
        }
    } else {
        return functions.setError(res, 'Thiếu thông tin truyền lên')
    }
}

// delete danh muc Cv
exports.deleteDanhMucCv = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const _id = Number(req.body.id)
        const DanhMucCV = await CvGroup.findOne({ _id }).lean()
        if (!DanhMucCV) return functions.setError(res, "Không tìm thấy thông tin danh mục")
        await CvGroup.deleteOne({ _id })
        return functions.success(res, "Thao tác thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// detail danh muc Cv
exports.detailDanhMucCv = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const _id = Number(req.body.id)
        const data = await CvGroup.findOne({ _id }).lean()
        if (!data) return functions.setError(res, "Không tìm thấy thông tin danh mục")
        data['image'] = data['image'] ? functions.getUrlImageCV(data['image']) : ''
        return functions.success(res, "Thao tác thành công", { data })
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// create danh muc Cv
exports.updateDanhMucCv = async(req, res, next) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const _id = Number(req.body.id)
        const request = req.body;
        const data = {
            name: request.name,
            alias: request.alias,
            shortName: request.short_name,
            content: request.content,
            sapo: request.sapo,
            menu: request.menu,
            sort: request.sort,
            metaTitle: request.meta_title,
            metaKey: request.meta_key,
            metaDes: request.meta_des,
            status: request.status,
        }
        if (req.file) {
            if ((req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg')) {
                const image = req.file.destination.slice(-10) + '/' + req.file.filename
                await CvGroup.updateOne({ _id }, {
                    ...data,
                    image,

                })
                return functions.success(res, "Cập nhật thành công")
            } else {
                if (req.file)
                    fs.unlink(req.file.path, (e) => {
                        null
                    })
                return functions.setError(res, 'Chỉ được chọn ảnh')
            }
        } else {
            await CvGroup.updateOne({ _id }, {
                ...data,
            })
            return functions.success(res, "Cập nhật thành công")
        }
    } catch (e) {
        if (req.file)
            fs.unlink(req.file.path, (e) => {
                null
            })
        return functions.setError(res, e.message, 404);
    }
}

// updateStatus danh muc Cv
exports.updateStatusDanhMucCv = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const _id = Number(req.body.id)
        const data = await CvGroup.findOne({ _id }).lean()
        if (!data) return functions.setError(res, "Không tìm thấy thông tin danh mục")
        const status = data.status ? data.status : 0
        if (status) await CvGroup.updateOne({ _id }, { status: 0 })
        else await CvGroup.updateOne({ _id }, { status: 1 })
        return functions.success(res, "Thao tác thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// list danh muc Cv
exports.listDanhMucCv = async(req, res, next) => {
    try {
        let page = req.body.page
        let pageSize = req.body.pageSize
        page = page ? Number(page) : 1
        pageSize = pageSize ? Number(pageSize) : 30
        const dataPromise = CvGroup.find({})
            .select("_id name shortName alias menu sort status")
            .sort({ sort: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();
        const totalPromise = CvGroup.find({}).count()
        const [data, total] = await Promise.all([dataPromise, totalPromise])
        return functions.success(res, "Danh sách ngành cv", { data, total });
    } catch (err) {
        return functions.setError(res, err.message);
    }
}

// list danh muc Cv design
exports.listDanhMucCvDesign = async(req, res, next) => {
    try {
        let page = req.body.page
        let pageSize = req.body.pageSize
        page = page ? Number(page) : 1
        pageSize = pageSize ? Number(pageSize) : 30
        const keywords = req.body.keywords ? req.body.keywords : ''
        const dataPromise = CvDesign.aggregate([{
                $match: {
                    'name': {
                        $regex: keywords,
                        $options: 'i'
                    }
                }
            },
            {
                $sort: { '_id': -1 }
            },
            {
                $skip: (page - 1) * pageSize
            },
            {
                $limit: pageSize
            },
        ])
        const totalPromise = CvDesign.aggregate([{
                $match: {
                    'name': {
                        $regex: keywords,
                        $options: 'i'
                    }
                }
            },
            {
                $count: 'total'
            }
        ])
        const [data, totalArr] = await Promise.all([dataPromise, totalPromise])
        const total = totalArr[0] ? totalArr[0].total : 0
        return functions.success(res, "Danh sách ngành cv theo thiết kế", { data, total });
    } catch (err) {
        return functions.setError(res, err.message);
    }
}

// updateStatus danh muc Cv design
exports.updateStatusDanhMucCvDesign = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const _id = Number(req.body.id)
        const data = await CvDesign.findOne({ _id }).lean()
        if (!data) return functions.setError(res, "Không tìm thấy thông tin danh mục")
        const status = data.status ? data.status : 0
        if (status) await CvDesign.updateOne({ _id }, { status: 0 })
        else await CvDesign.updateOne({ _id }, { status: 1 })
        return functions.success(res, "Thao tác thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// create danh muc Cv design
exports.createDanhMucCvDesign = async(req, res, next) => {
    try {
        const request = req.body;
        const _id = await functions.getMaxIdByField(CvDesign, '_id')
        const data = {
            name: request.name,
            alias: request.alias,
            content: request.content,
            metaH1: request.metaH1,
            metaTitle: request.metaTitle,
            metaKey: request.metaKey,
            metaDes: request.metaDes,
            status: request.status,
        }
        await new CvDesign({
            _id,
            ...data,
        }).save()
        return functions.success(res, 'Thao tác thành công')
    } catch (e) {
        return functions.setError(res, e.message, 404);
    }
}

// delete danh muc Cv design
exports.deleteDanhMucCvDesign = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const _id = Number(req.body.id)
        const data = await CvDesign.findOne({ _id }).lean()
        if (!data) return functions.setError(res, "Không tìm thấy thông tin danh mục")
        await CvDesign.deleteOne({ _id })
        return functions.success(res, "Thao tác thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// detail danh muc CvDesign
exports.detailDanhMucCvDesign = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const _id = Number(req.body.id)
        const data = await CvDesign.findOne({ _id }).lean()
        if (!data) return functions.setError(res, "Không tìm thấy thông tin danh mục")
        return functions.success(res, "Thao tác thành công", { data })
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// create danh muc Cv design
exports.updateDanhMucCvDesign = async(req, res, next) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const _id = Number(req.body.id)
        const cv = await CvDesign.findOne({ _id }).lean()
        if (!cv) return functions.setError(res, "Không tìm thấy thông tin danh mục")
        const request = req.body;
        const data = {
            name: request.name,
            alias: request.alias,
            content: request.content,
            metaH1: request.metaH1,
            metaTitle: request.metaTitle,
            metaKey: request.metaKey,
            metaDes: request.metaDes,
            status: request.status,
        }
        await CvDesign.updateOne({ _id }, data)
        return functions.success(res, 'Thao tác thành công')
    } catch (e) {
        return functions.setError(res, e.message, 404);
    }
}

exports.listDanhMucCvLang = async(req, res, next) => {
    try {
        let page = req.body.page
        let pageSize = req.body.pageSize
        page = page ? Number(page) : 1
        pageSize = pageSize ? Number(pageSize) : 30
        const keywords = req.body.keywords ? req.body.keywords : ''
        const dataPromise = CvLang.aggregate([{
                $match: {
                    'name': {
                        $regex: keywords,
                        $options: 'i'
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    'name': '$name',
                    'meta_h1': '$meta_h1',
                    'alias': '$alias',
                    'status': '$status',
                    'id': '$id',
                }
            },
            {
                $sort: { 'id': -1 }
            },
            {
                $skip: (page - 1) * pageSize
            },
            {
                $limit: pageSize
            },
        ])
        const totalPromise = CvLang.aggregate([{
                $match: {
                    'name': {
                        $regex: keywords,
                        $options: 'i'
                    }
                }
            },
            {
                $count: 'total'
            },
        ])
        const [data, totalArr] = await Promise.all([dataPromise, totalPromise])
        const total = totalArr[0] ? totalArr[0].total : 0

        return functions.success(res, "Danh sách ngành cv theo ngôn ngữ", { data, total });
    } catch (err) {
        return functions.setError(res, err.message);
    }
}

// updateStatus danh muc Cv lang
exports.updateIndexDanhMucCvLang = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const data = await CvLang.findOne({ id }).lean()
        if (!data) return functions.setError(res, "Không tìm thấy thông tin danh mục")
        const status = data.status ? data.status : 0
        if (status) await CvLang.updateOne({ id }, { status: 0 })
        else await CvLang.updateOne({ id }, { status: 1 })
        return functions.success(res, "Thao tác thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// create danh muc Cv lang
exports.createDanhMucCvLang = async(req, res, next) => {
    try {
        const request = req.body;
        const id = await functions.getMaxIdByField(CvLang, 'id')
        const data = {
            name: request.name,
            alias: request.alias,
            meta_h1: request.metaH1,
            content: request.content,
            meta_title: request.metaTitle,
            meta_key: request.metaKey,
            meta_des: request.metaDes,
            status: request.status,
        }
        await new CvLang({
            id,
            ...data,
        }).save()
        return functions.success(res, 'Thao tác thành công')
    } catch (e) {
        return functions.setError(res, e.message, 404);
    }
}

// delete danh muc Cv lang
exports.deleteDanhMucCvLang = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const data = await CvLang.findOne({ id }).lean()
        if (!data) return functions.setError(res, "Không tìm thấy thông tin danh mục")
        await CvLang.deleteOne({ id })
        return functions.success(res, "Thao tác thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// detail danh muc Cv lang
exports.detailDanhMucCvLang = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const data = await CvLang.findOne({ id }).lean()
        if (!data) return functions.setError(res, "Không tìm thấy thông tin danh mục")
        return functions.success(res, "Thao tác thành công", { data })
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// create danh muc Cv lang
exports.updateDanhMucCvLang = async(req, res, next) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const id = Number(req.body.id)
        const cv = await CvLang.findOne({ id }).lean()
        if (!cv) return functions.setError(res, "Không tìm thấy thông tin danh mục")
        const request = req.body;
        const data = {
            name: request.name,
            alias: request.alias,
            meta_h1: request.metaH1,
            content: request.content,
            meta_title: request.metaTitle,
            meta_key: request.metaKey,
            meta_des: request.metaDes,
            status: request.status,
        }
        await CvLang.updateOne({ id }, data)
        return functions.success(res, 'Thao tác thành công')
    } catch (e) {
        return functions.setError(res, e.message, 404);
    }
}

// list danh muc Cv category
exports.listDanhMucCvCate = async(req, res, next) => {
    try {
        let page = req.body.page
        let pageSize = req.body.pageSize
        page = page ? Number(page) : 1
        pageSize = pageSize ? Number(pageSize) : 30
        const keywords = req.body.keywords ? req.body.keywords : ''
        const dataPromise = CvCategory.aggregate([{
                $match: {
                    'name': {
                        $regex: keywords,
                        $options: 'i'
                    }
                }
            },
            {
                $project: {
                    'name': '$name',
                    'meta_h1': '$meta_h1',
                    'alias': '$alias',
                    'status': '$status',
                    '_id': '$_id',
                }
            },
            {
                $sort: { '_id': -1 }
            },
            {
                $skip: (page - 1) * pageSize
            },
            {
                $limit: pageSize
            },
        ])
        const totalPromise = CvCategory.aggregate([{
                $match: {
                    'name': {
                        $regex: keywords,
                        $options: 'i'
                    }
                }
            },
            {
                $count: 'total'
            }
        ])
        const [data, totalArr] = await Promise.all([dataPromise, totalPromise])
        const total = totalArr[0] ? totalArr[0].total : 0

        return functions.success(res, "Danh sách ngành cv theo ngôn ngữ", { data, total });
    } catch (err) {
        return functions.setError(res, err.message);
    }
}

// updateStatus danh muc Cv category
exports.updateStatusDanhMucCvCate = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const _id = Number(req.body.id)
        const data = await CvCategory.findOne({ _id }).lean()
        if (!data) return functions.setError(res, "Không tìm thấy thông tin danh mục")
        const status = data.status ? data.status : 0
        if (status) await CvCategory.updateOne({ _id }, { status: 0 })
        else await CvCategory.updateOne({ _id }, { status: 1 })
        return functions.success(res, "Thao tác thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// create danh muc Cv category
exports.createDanhMucCvCate = async(req, res, next) => {
    try {
        const request = req.body;
        const _id = await functions.getMaxIdByField(CvCategory, '_id')
        const data = {
            name: request.name,
            cid: request.cid,
            alias: request.alias,
            meta_h1: request.metaH1,
            content: request.content,
            status: request.status,
            meta_title: request.metaTitle,
            meta_key: request.metaKey,
            meta_des: request.metaDes,
        }
        await new CvCategory({
            _id,
            ...data,
        }).save()
        return functions.success(res, 'Thao tác thành công')
    } catch (e) {
        return functions.setError(res, e.message, 404);
    }
}

// delete danh muc Cv category
exports.deleteDanhMucCvCate = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const _id = Number(req.body.id)
        const data = await CvCategory.findOne({ _id }).lean()
        if (!data) return functions.setError(res, "Không tìm thấy thông tin danh mục")
        await CvCategory.deleteOne({ _id })
        return functions.success(res, "Thao tác thành công")
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// detail danh muc Cv category
exports.detailDanhMucCvCate = async(req, res) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const _id = Number(req.body.id)
        const data = await CvCategory.findOne({ _id }).lean()
        if (!data) return functions.setError(res, "Không tìm thấy thông tin danh mục")
        return functions.success(res, "Thao tác thành công", { data })
    } catch (e) {
        console.log(e)
        return functions.setError(res, e.message);
    }
}

// create danh muc Cv category
exports.updateDanhMucCvCate = async(req, res, next) => {
    try {
        if (!req.body.id)
            return functions.setError(res, "Thiếu dữ liệu truyền lên");
        const _id = Number(req.body.id)
        const cv = await CvCategory.findOne({ _id }).lean()
        if (!cv) return functions.setError(res, "Không tìm thấy thông tin danh mục")
        const request = req.body;
        const data = {
            name: request.name,
            cid: request.cid,
            alias: request.alias,
            meta_h1: request.metaH1,
            content: request.content,
            meta_title: request.metaTitle,
            meta_key: request.metaKey,
            meta_des: request.metaDes,
            status: request.status,
        }
        await CvCategory.updateOne({ _id }, data)
        return functions.success(res, 'Thao tác thành công')
    } catch (e) {
        return functions.setError(res, e.message, 404);
    }
}

exports.listPointCv = async(req, res, next) => {
    try {
        let page = req.body.page
        let pageSize = req.body.pageSize
        page = page ? Number(page) : 1
        pageSize = pageSize ? Number(pageSize) : 30
        const keywords = req.body.keywords ? req.body.keywords : ''
        const dataPromise = CV.aggregate([{
                $match: {
                    'name': {
                        $regex: keywords,
                        $options: 'i'
                    }
                }
            },
            {
                $project: {
                    '_id': '$_id',
                    'image': '$image',
                    'name': '$name',
                    'alias': '$url_alias',
                    'cate_id': '$cate_id',
                    'cid': '$cid',
                    'thutu': '$thutu',
                    'design_id': '$design_id',
                    'lang_id': '$lang_id',
                    'cv_point': '$cv_point',
                }
            },
            {
                $sort: { 'cv_point': -1 }
            },
            {
                $skip: (page - 1) * pageSize
            },
            {
                $limit: pageSize
            },
        ])
        const totalPromise = CV.aggregate([{
                $match: {
                    'name': {
                        $regex: keywords,
                        $options: 'i'
                    }
                }
            },
            {
                $count: 'total'
            },
        ])
        const [data, totalArr] = await Promise.all([dataPromise, totalPromise])
        const total = totalArr[0] ? totalArr[0] : 0
        await data.forEach(value => {
            value['image'] = `${process.env.cdn}/cv365/upload/cv/thumb/${value['image']}`
        })
        return functions.success(res, 'Danh sách điểm CV', { data, total })
    } catch (e) {
        return functions.setError(res, e.message, 404);
    }
}

// list language
exports.listLangCv = async(req, res, next) => {
    try {
        const data = await CvLang.find({}).select("id name status");
        return functions.success(res, "Danh sách ngoôn ngữ cv", { data });
    } catch (err) {
        return functions.setError(res, err.message);
    }
}