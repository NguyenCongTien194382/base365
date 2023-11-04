const functions = require('../../services/functions');
const DonXinViec = require('../../models/Timviec365/CV/Application');
const ApplicationCategory = require('../../models/Timviec365/CV/ApplicationCategory');
const SaveAppli = require('../../models/Timviec365/CV/ApplicationUV');
const TblModules = require('../../models/Timviec365/CV/TblModules');
const Cv365TblFooter = require('../../models/Timviec365/CV/TblFooter');
const serviceCV = require('../../services/timviec365/cv');
const fs = require('fs');
const Cv365Like = require('../../models/Timviec365/CV/Like');
const Users = require('../../models/Users');
// lấy danh sách mẫu đơn
let DonXinViecAll = [];
let count_backup = 0;
let seo_backup;
let footerNew_backup;
exports.list = async(req, res, next) => {
    try {

        const request = req.body,
            page = request.page || 1,
            pageSize = request.pageSize || 10,
            condition = { status: 1 },
            sort = { vip: -1, _id: -1 };
        if (DonXinViecAll.length == 0) {
            DonXinViecAll = await DonXinViec.find(
                    condition,
                    'name alias cate_id price image view download love'
                )
                .skip((page - 1) * pageSize)
                .sort(sort).lean();
        }
        // Lấy dữ liệu theo điều kiện
        let data = [];
        if (pageSize != 'all') {
            if (DonXinViecAll.length) {
                let skip = (page - 1) * pageSize;
                let limit = pageSize;
                for (let i = 0; i < DonXinViecAll.length; i++) {
                    if (i >= skip) {
                        if (data.length <= limit) {
                            const obj = DonXinViecAll[i]
                            data.push(obj)
                        }
                    }
                }
            } else {
                data = await DonXinViec.find(
                        condition,
                        'name alias cate_id price image view download love'
                    )
                    .skip((page - 1) * pageSize)
                    .sort(sort)
                    .limit(pageSize).lean();
            }

        } else {
            if (DonXinViecAll.length) {
                data = DonXinViecAll;
            } else {
                data = await DonXinViec.find(
                        condition,
                        'name alias cate_id price image view download love'
                    )
                    .skip((page - 1) * pageSize)
                    .sort(sort).lean();
            }
        }

        // Lấy thông tin người dùng
        const user = await functions.getTokenUser(req, res);

        // Lấy danh sách đơn mà ứng viên đã like
        let listCvLike = [];
        if (user && user != 1) {
            listCvLike = await Cv365Like.find({
                    uid: user.idTimViec365,
                    type: 2,
                },
                'id'
            ).lean();
        }
        // Cập nhật data theo vòng lặp
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            element.image = !data[i].image.includes('http') ? functions.getPictureAppli(element.image) : element.image;
            if (listCvLike.find((cv) => cv.id == element._id)) {
                data[i].isLike = 1;
            } else {
                data[i].isLike = 0;
            }
        }

        // Đếm số đơn hiện có
        let count = 0;
        if (count_backup == 0) {
            count = await functions.findCount(DonXinViec, condition);
            count_backup = count;
        } else {
            count = count_backup;
        }


        // Lấy thông tin seo
        let seo;
        if (seo_backup) {
            seo = seo_backup
        } else {
            seo = await TblModules.findOne({
                module: 'mau-don-xin-viec',
            }).lean();
            seo_backup = seo;
        }


        // Lấy thông tin bài viết chân trang
        let footerNew;
        if (footerNew_backup) {
            footerNew = footerNew_backup;
        } else {
            footerNew = await Cv365TblFooter.findOne({}).select(
                'content_don'
            );
            footerNew_backup = footerNew;
        }


        return await functions.success(res, 'Lấy mẫu đơn thành công', {
            items: data,
            count,
            seo,
            footerNew,
        });
    } catch (err) {
        functions.setError(res, err.message);
    }
};

// tìm đơn theo ngành
exports.listByCate = async(req, res, next) => {
    try {
        const request = req.body,
            page = request.page || 1,
            pageSize = request.pageSize || 20,
            alias = req.body.alias;

        if (alias) {
            const cate = await ApplicationCategory.find({ alias }).lean();
            if (cate && cate.length > 0) {
                cate[0].content = functions.renderCDNImage(cate[0].content);
                const condition = { status: 1, cate_id: cate[0]._id };
                // tìm theo id Ngành
                const data = await DonXinViec.find(condition)
                    .select('name alias cate_id price image view download love')
                    .skip((page - 1) * 20)
                    .sort({
                        vip: -1,
                        _id: -1,
                    })
                    .limit(pageSize)
                    .lean();

                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    element.image = functions.getPictureAppli(element.image);
                }
                const count = await functions.findCount(DonXinViec, condition);

                return functions.success(res, `Danh sách đơn theo ngành`, {
                    cate,
                    items: data,
                    count,
                });
            }
        }
        return functions.setError(res, 'Không đầy đủ thông tin');
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// lấy danh sách ngành đơn
let backup_category = [];
exports.category = async(req, res, next) => {
    try {
        let data = [];
        if (backup_category.length) {
            data = backup_category;
        } else {
            data = await ApplicationCategory.find()
                .select('_id name alias')
                .lean();
        }

        return functions.success(res, 'Danh sách ngành DON', { data });
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// xem trước
exports.preview = async(req, res, next) => {
    try {
        const _id = req.body._id;
        const user = req.user ? req.user.data : '';
        const data = await DonXinViec.findOne({ _id: _id })
            .select('_id image alias view')
            .lean();
        if (!data)
            return await functions.setError(res, 'Không có dữ liệu', 404);
        let view = data.view + 1; // cập nhật số lượng xem
        await DonXinViec.updateOne({ _id: _id }, { view: view });

        // Cập nhật hình ảnh bằng cdn
        data.image = functions.getPictureAppli(data.image);
        if (user) {
            let checkLiked = await Cv365Like.findOne({ uid: user.idTimViec365, id: _id, type: 2 }).lean();
            data.save = checkLiked ? true : false;
        }
        return await functions.success(res, 'Lấy mẫu DON thanh công', { data });
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// xem chi tiết ( tạo)
exports.detail = async(req, res, next) => {
    try {
        const _id = Number(req.body._id);
        let uid = Number(req.body.uid);
        const user = await functions.getTokenUser(req, res);
        if (!uid) {
            uid = user.idTimViec365;
        }
        let result = {};
        if (_id) {
            const data = await DonXinViec.findOne({ _id: _id })
                .select(
                    '_id name alias html_vi html_cn html_jp html_kr html_en view colors'
                )
                .lean();
            if (data) {
                let view = data.view + 1; // cập nhật số lượng xem
                await DonXinViec.updateOne({ _id: _id }, { view: view });
                result = {
                    ...data,
                    html_vi: JSON.parse(data.html_vi.replace(/\\t+|\\n+/g, '')),
                    html_en: JSON.parse(data.html_en.replace(/\\t+|\\n+/g, '')),
                    html_cn: JSON.parse(data.html_cn.replace(/\\t+|\\n+/g, '')),
                    html_jp: JSON.parse(data.html_jp.replace(/\\t+|\\n+/g, '')),
                    html_kr: JSON.parse(data.html_kr.replace(/\\t+|\\n+/g, '')),
                    img_vi: 'http://timviec365.vn/images/nn4.png',
                    img_en: 'http://timviec365.vn/images/nn0.png',
                    img_cn: 'http://timviec365.vn/images/nn1.png',
                    img_jp: 'http://timviec365.vn/images/nn2.png',
                    img_kr: 'http://timviec365.vn/images/nn3.png',
                };
                const countries = ['vi', 'en', 'cn', 'jp', 'kr'];
                countries.forEach((country) => {
                    result[`html_${country}`].profile.birthday =
                        functions.formatAppliDate(
                            result[`html_${country}`].profile.birthday
                        );
                });
                if (uid) {
                    let getDonUv = await SaveAppli.findOne({
                        uid: uid,
                        tid: _id,
                    }).lean();
                    if (getDonUv) {
                        const string = getDonUv.html
                            .replace(/\\n/g, '')
                            .trim()
                            .replace(/\s+/g, ' ');
                        getDonUv.html = JSON.parse(string);
                        result.item_ur = getDonUv;
                    }
                }
                return await functions.success(res, 'Lấy DON thành công', {
                    data: result,
                });
            }
        }
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err.message);
    }
};

//lưu và tải đơn
exports.save = async(req, res, next) => {
    try {
        let pmKey = req.user.data._id,
            userId = req.user.data.idTimViec365,
            id = req.body.id,
            name_img = req.body.name_img,
            html = req.body.html,
            lang = req.body.lang;
        if (!name_img) {
            name_img = `don_${userId}_${id}`;
        }
        let base64String = req.body.base64;
        if (id) {
            // Kiểm tra đã tạo hay chưa
            const checkSave = await SaveAppli.findOne({
                uid: userId,
                tid: id,
            }).lean();
            const checkUser = await Users.findOne({ idTimViec365: userId, type: { $ne: 1 } }).lean();
            // Đường dẫn ảnh
            const dir = `../storage/base365/timviec365/cv365/upload/ungvien/uv_${userId}`;
            const dirUser = `${process.env.storage_tv365}/pictures/uv/${functions.convertDate(checkUser.createdAt, true)}`;

            // Đường link trả về để download 
            const link = `https://cdn.timviec365.vn/cv365/upload/ungvien/uv_${userId}`;
            const linkUser = `${process.env.cdn}/pictures/uv/${functions.convertDate(checkUser.createdAt, true)}`;

            const data = {
                uid: userId,
                tid: id,
                html: html,
                lang: lang,
                name_img
            };

            // Nếu chưa tạo thì lưu vào
            if (!checkSave) {
                let _id = 1;
                await SaveAppli.findOne({}, { id: 1 })
                    .sort({ id: -1 })
                    .then((res) => {
                        _id = res.id + 1;
                    });
                data.id = _id;
                await SaveAppli.create(data);
            }
            // Nếu tạo rồi thì cập nhật đồng thời xóa cv cũ
            else {
                if (name_img && checkSave.name_img != null) {
                    const filePath = `${dir}/${checkSave.name_img}.png`;
                    await fs.access(filePath, fs.constants.F_OK, (error) => {
                        if (error) {} else {
                            // Tệp tin tồn tại
                            fs.unlink(filePath, (err) => {
                                if (err) throw err;
                            });
                        }
                    });
                }

                await SaveAppli.updateOne({
                    _id: checkSave._id,
                }, {
                    $set: data,
                });
            }

            // Kiểm tra xem đã tạo thư mục lưu ảnh chưa
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            // Kiểm tra xem đã tạo thư mục lưu ảnh chưa
            if (!fs.existsSync(dirUser)) {
                fs.mkdirSync(dirUser, { recursive: true });
            }

            // Đường dẫn tới nơi bạn muốn lưu ảnh
            let outputPath = `${dirUser}/${name_img}.png`;
            let name_avatar = `avatar_letter_${id}`;
            let outputPathAvatar = `${dir}/${name_avatar}.png`

            // Đường dẫn ảnh download 
            let outputlink = `${linkUser}/${name_img}.png`
            let outputlinkAvatar = `${link}/${name_avatar}.png`

            //Xử lý Avatar
            if (base64String) {
                // Xóa đầu mục của chuỗi Base64 (ví dụ: "data:image/png;base64,")
                const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

                // Giải mã chuỗi Base64 thành dữ liệu nhị phân
                const imageBuffer = Buffer.from(base64Data, "base64");

                // Ghi dữ liệu nhị phân vào tệp ảnh
                await fs.writeFile(outputPathAvatar, imageBuffer, (error) => {
                    if (error) {
                        console.error("Lỗi khi ghi tệp ảnh");
                        return functions.setError(res, "Lỗi khi ghi tệp ảnh", 404);
                    }
                });
                const checkImage = await functions.checkImage(outputPathAvatar);
                if (checkImage) {
                    let dataHtml = JSON.parse(html);
                    dataHtml.avatar = outputlinkAvatar;
                    data.html = JSON.stringify(dataHtml);
                };
            }

            let message = 'Lưu';
            let link_web = `${process.env.domain_tv365}/cv365/appcv365/tao_don_app/id_don/${id}/id_user/${userId}/id_lang/${lang}/password/123456`;
            let link_view = `${process.env.domain_tv365}/cv365/download-cvpdf/don.php?id=${id}&uid=${userId}&view=1&cvname=timviec365_donxinviec`;
            let link_download = `${process.env.domain_tv365}/cv365/download-cvpdf/don.php?id=${id}&uid=${userId}&cvname=timviec365_donxinviec`;

            //Xử lý ảnh xem trước
            const resImage = await functions.renderImageFromUrl(
                link_web
            );
            if (!resImage.result) {
                return functions.setError(res, resImage.message, 500);
            }
            let base64StringPreview = resImage.file;

            // Giải mã chuỗi Base64 thành dữ liệu nhị phân
            const imageBufferPreview = Buffer.from(base64StringPreview, 'base64');

            // Ghi dữ liệu nhị phân vào tệp ảnh
            await fs.writeFile(outputPath, imageBufferPreview, (error) => {
                if (error) {
                    return functions.setError(
                        res,
                        'Lỗi khi ghi tệp ảnh'
                    );
                }
            });
            console.log('link_img', outputlink);

            return await functions.success(res, `${message} thành công`, {
                data: {
                    link_web,
                    link_view,
                    link_download
                },
            });
        }
        return functions.setError(
            res,
            'Thông tin truyền lên không đầy đủ',
            404
        );
    } catch (e) {
        console.log(e);
        return functions.setError(res, 'Đã có lỗi xảy ra', 404);
    }
};

// thêm mới NganhDon
exports.createNganhDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');
        const data = req.body;

        let _id = 1;
        await functions.getMaxID(NganhDon).then((res) => {
            if (res) {
                _id = res + 1;
            }
        });
        data._id = _id;
        await NganhDon.create(data);
        return await functions.success(res, 'Tạo mới NganhcDon thành công');
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// lấy dữ liệu NganhDon cũ
exports.findNganhDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.params._id;
        const data = await NganhDon.findOne({ _id: _id });

        if (data) return functions.success(res, 'Thành công', data);

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// update NganhDon
exports.updateNganhDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await NganhDon.findOneAndUpdate({ _id: _id }, req.body);

        if (data) return functions.success(res, 'Cập nhật thành công');

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

//xóa NganhDon
exports.deleteNganhDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await NganhDon.findOneAndDelete({ _id: _id });

        if (data) return functions.success(res, 'Đã xóa thành công');

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// tạo mới mẫu DonXinViec
exports.createDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập', 404);
        const data = req.body;

        let _id = 1;
        await functions.getMaxID(DonXinViec).then((res) => {
            if (res) {
                _id = res + 1;
            }
        });
        data._id = _id;
        await DonXinViec.create(data);
        return await functions.success(res, 'Tạo mới DonXinViec thành công');
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// lấy dữ liệu mẫu DonXinViec cũ
exports.findDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.params._id;
        const data = await DonXinViec.findOne({ _id: _id });

        if (data) return functions.success(res, 'Thành công', data);

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// update dữ liệu mẫu DonXinViec
exports.updateDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await DonXinViec.findOneAndUpdate({ _id: _id }, req.body);

        if (data) return functions.success(res, 'Cập nhật thành công');

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

//xóa mẫu DonXinViec
exports.deleteDon = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await DonXinViec.findOneAndDelete({ _id: _id });

        if (data) return functions.success(res, 'Đã xóa thành công');

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// lấy ra thông tin ứng viên đã lưu trong đơn
exports.detailUserDon = async(req, res) => {
    try {
        let user = req.user.data;
        let userid = user.idTimViec365;
        let id = req.body.id;
        if (userid && id) {
            let data = await SaveAppli.aggregate([{
                $match: { uid: Number(userid), tid: Number(id) },
            }, ]);
            return await functions.success(res, 'Lấy thông tin thành công', {
                data,
            });
        }
        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err.message);
    }
};