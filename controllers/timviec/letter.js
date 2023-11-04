const functions = require('../../services/functions');
const serviceCV = require('../../services/timviec365/cv')
const Letter = require('../../models/Timviec365/CV/Letter');
const LetterCategory = require('../../models/Timviec365/CV/LetterCategory');
// Model này dùng chung cho cả cv, đơn, thư
const Cv365Like = require('../../models/Timviec365/CV/Like');
const LetterUV = require('../../models/Timviec365/CV/LetterUV');
const TblModules = require("../../models/Timviec365/CV/TblModules");
const TblFooter = require('../../models/Timviec365/CV/TblFooter');
const Users = require('../../models/Users');
const fs = require("fs");

// lấy danh sách mẫu thư
let LetterAll = [];
let count_backup = 0;
let seo_backup;
let footerNew_backup;
exports.list = async(req, res, next) => {
    try {
        const request = req.body,
            page = request.page || 1,
            pageSize = request.pageSize || 10,
            condition = {
                status: 1
            },
            sort = {
                vip: -1,
                _id: -1
            };
        if (LetterAll.length == 0) {
            LetterAll = await Letter.find(condition, "name alias cate_id price image view download love").sort(sort).lean();
        };
        let data = [];
        if (pageSize != "all") {
            if (LetterAll.length > 0) {
                let skip = (page - 1) * pageSize;
                let limit = pageSize;
                for (let i = 0; i < LetterAll.length; i++) {
                    if (i >= skip) {
                        if (data.length <= limit) {
                            const obj = LetterAll[i]
                            data.push(obj)
                        }
                    }
                }
            } else {
                data = await Letter.find(condition, "name alias cate_id price image view download love").skip((page - 1) * pageSize).sort(sort).limit(pageSize).lean();
            }

        } else {
            if (LetterAll.length > 0) {
                data = LetterAll;
            } else {
                data = await Letter.find(condition, "name alias cate_id price image view download love").sort(sort).lean();
                LetterAll = data;
            }
        }

        // Lấy thông tin người dùng
        const user = await functions.getTokenUser(req, res);

        // Lấy danh sách thư mà ứng viên đã like
        let listCvLike = [];
        if (user && user != 1) {
            listCvLike = await Cv365Like.find({
                uid: user.idTimViec365,
                type: 3
            }, "id").lean();
        }

        // Cập nhật data theo vòng lặp
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            element.image = !data[i].image.includes('http') ? functions.getPictureLetter(element.image) : element.image;
            if (listCvLike.find(cv => cv.id == element._id)) {
                element.isLike = 1;
            } else {
                element.isLike = 0;
            }
        }

        // Đếm tổng số thư
        let count = 0;
        if (count_backup == 0) {
            count = await functions.findCount(Letter, condition);
            count_backup = count;
        } else {
            count = count_backup;
        };

        // Lấy thông tin seo
        let seo;
        if (seo_backup) {
            seo = seo_backup
        } else {
            seo = await TblModules.findOne({
                module: 'mau-cover-letter-thu-xin-viec',
            }).lean();
            seo_backup = seo;
        }


        // Lấy thông tin bài viết chân trang
        let footerNew;
        if (footerNew_backup) {
            footerNew = footerNew_backup;
        } else {
            footerNew = await TblFooter.findOne({}).select(
                'content_thu'
            );
            footerNew_backup = footerNew;
        }
        //const footerNew = await TblFooter.findOne({}).select("content_thu");
        return await functions.success(res, 'Lấy mẫu thư thành công', { data, count, seo, footerNew });
    } catch (err) {
        functions.setError(res, err.message);
    };
};

// tìm thư theo ngành
exports.listByCate = async(req, res, next) => {
    try {
        const request = req.body,
            page = request.page || 1,
            pageSize = request.pageSize || 10,
            alias = request.alias;

        if (alias) {
            // Lấy thông tin của ngành nghề thư
            const category = await LetterCategory.findOne({ alias }).lean();

            if (category) {
                // Xử lý hình ảnh cho bài viết chân trang
                if (category.content) {
                    category.content = functions.renderCDNImage(category.content);
                }
                // Lấy thư theo id Ngành
                const data = await Letter.find({ cate_id: category._id }, "name alias cate_id price image view download love").skip((page - 1) * pageSize).limit(pageSize);
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    element.image = functions.getPictureLetter(element.image);
                }
                return functions.success(res, `Danh sách thư theo ngành`, { category, items: data });
            }
        }
        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// lấy danh sách ngành thư
let backup_letter = [];
exports.listCategory = async(req, res, next) => {
    try {
        let data = [];
        if (backup_letter.length) {
            data = backup_letter;
        } else {
            data = await LetterCategory.find().select('_id name alias');
            backup_letter = data;
        }

        return functions.success(res, 'Danh sách ngành thư xin việc', { data });

    } catch (err) {
        return functions.setError(res, err.message);
    };
};


// xem trước 
exports.preview = async(req, res, next) => {
    try {
        const _id = req.body._id;
        const user = req.user ? req.user.data : '';
        let data = await Letter.findOne({ _id: _id }).select('_id image alias view colors').lean();

        if (!data) return await functions.setError(res, 'Không có dữ liệu', 404);
        if (user) {
            let checkLiked = await Cv365Like.findOne({ uid: user.idTimViec365, id: _id, type: 3 }).lean();
            let isSaved = checkLiked ? true : false;
            data.save = isSaved;
        }
        let view = data.view + 1; // cập nhật số lượng xem 
        await Letter.updateOne({ _id: _id }, { view: view });


        return await functions.success(res, 'Lấy mẫu thư thanh công', { data });
    } catch (err) {
        return functions.setError(res, err.message);
    };
};


// xem chi tiết thư ( tạo)
exports.detail = async(req, res, next) => {
    try {
        const _id = Number(req.body.id);
        let uid = Number(req.body.uid);
        const user = await functions.getTokenUser(req, res);
        if (!uid) {
            uid = user.idTimViec365;
        }
        const data = await Letter.findOne({ _id: _id }).select('_id alias name html_vi html_cn html_jp html_kr html_en view colors lang_id').lean();
        let result = {}
        if (data) {
            let view = data.view + 1; // cập nhật số lượng xem 
            await Letter.updateOne({ _id: _id }, { view: view });
            result = {
                ...data,
                html_vi: JSON.parse(data.html_vi.replace(/\\t+|\\n+/g, '')),
                html_en: JSON.parse(data.html_en.replace(/\\t+|\\n+/g, '')),
                html_cn: JSON.parse(data.html_cn.replace(/\\t+|\\n+/g, '')),
                html_jp: JSON.parse(data.html_jp.replace(/\\t+|\\n+/g, '')),
                html_kr: JSON.parse(data.html_kr.replace(/\\t+|\\n+/g, '')),
                img_vi: "http://timviec365.vn/images/nn4.png",
                img_en: "http://timviec365.vn/images/nn0.png",
                img_cn: "http://timviec365.vn/images/nn1.png",
                img_jp: "http://timviec365.vn/images/nn2.png",
                img_kr: "http://timviec365.vn/images/nn3.png",
            }
            if (uid) {
                let getLetterUv = await LetterUV.findOne({
                    uid: uid,
                    tid: _id,
                }).lean()
                if (getLetterUv) {
                    const string = getLetterUv.html.replace(/\\n/g, '').trim().replace(/\s+/g, ' ')
                    getLetterUv.html = JSON.parse(string)
                    let arrHtml = getLetterUv.html;
                    getLetterUv.linkImg = arrHtml.avatar;
                    getLetterUv.html = arrHtml;

                    result.item_ur = getLetterUv
                }
            }
            return await functions.success(res, 'Chi tiết nội dung thư xin việc', { data: result });
        };
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err.message);
    };
};

//lưu và tải thư
exports.saveThu = async(req, res, next) => {
    try {
        let pmKey = req.user.data._id,
            userId = req.user.data.idTimViec365,
            id = req.body.id,
            name_img = req.body.name_img,
            html = req.body.html,
            lang = req.body.lang;
        if (!name_img) {
            name_img = `thu_${userId}_${id}`;
        }
        let base64String = req.body.base64;
        if (id) {
            // Kiểm tra đã tạo hay chưa
            const checkSave = await LetterUV.findOne({
                uid: userId,
                tid: id
            }).lean();

            const checkUser = await Users.findOne({ idTimViec365: userId, type: { $ne: 1 } }).lean();

            // Đường dẫn ảnh
            const dir = `../storage/base365/timviec365/cv365/upload/ungvien/uv_${userId}`;
            const dirUser = `${process.env.storage_tv365}/pictures/uv/${functions.convertDate(checkUser.createdAt, true)}`;

            // Đường link trả về để download 
            const link = `https://cdn.timviec365.vn/cv365/upload/ungvien/uv_${userId}`;
            const linkUser = `${process.env.cdn}/pictures/uv/${functions.convertDate(checkUser.createdAt, true)}`;

            let link_web = `${process.env.domain_tv365}/cv365/appcv365/tao_thu_app/id_thu/${id}/id_user/${userId}/id_lang/${lang}/password/123456`;
            let link_view = `${process.env.domain_tv365}/cv365/download-cvpdf/thu.php?id=${id}&uid=${userId}&view=1&cvname=timviec365_thuxinviec`;
            let link_download = `${process.env.domain_tv365}/cv365/download-cvpdf/thu.php?id=${id}&uid=${userId}&cvname=timviec365_thuxinviec`;

            const data = {
                uid: userId,
                tid: id,
                html: html,
                lang: lang,
                name_img
            };



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


            let message = "Lưu";

            // Nếu chưa tạo thì lưu vào
            if (!checkSave) {
                let _id = 1;
                await LetterUV.findOne({}, { id: 1 }).sort({ id: -1 }).then((res) => {
                    _id = res.id + 1;
                })
                data.id = _id;
                await LetterUV.create(data);
            }
            // Nếu tạo rồi thì cập nhật đồng thời xóa cv cũ
            else {
                if (name_img && checkSave.name_img != null) {
                    const filePath = `${dir}/${checkSave.name_img}.png`;
                    await fs.access(filePath, fs.constants.F_OK, (error) => {
                        if (error) {} else {
                            // Tệp tin tồn tại
                            console.log("Tệp tin đã tồn tại")
                            fs.unlink(filePath, (err) => {
                                if (err) throw err;
                            });
                        }
                    });
                }

                await LetterUV.updateOne({
                    _id: checkSave._id
                }, {
                    $set: data
                });
            }

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
            return res.json({
                data: {
                    result: true,
                    message: "Lưu thành công",
                    outputPath,
                    data: req.user.data,
                    outputlink,
                    data: {
                        link_web,
                        link_view,
                        link_download
                    }
                },
                error: null
            })
        }
        return functions.setError(res, "Thông tin truyền lên không đầy đủ", 404);
    } catch (e) {
        console.log(e);
        return functions.setError(res, "Đã có lỗi xảy ra", 404);
    }
};

// thêm mới NganhThu
exports.createNganhThu = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const data = req.body;

        let _id = 1;
        await functions.getMaxID(NganhThu)
            .then(res => {
                if (res) {
                    _id = res + 1;
                }
            });
        data._id = _id;
        await NganhLetter.create(data);
        return await functions.success(res, 'Tạo mới NganhcDon thành công', );
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// lấy dữ liệu NganhThu cũ
exports.findNganhThu = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.params._id;
        const data = await NganhLetter.findOne({ _id: _id });

        if (data) return functions.success(res, 'Thành công', data);

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// update NganhThu
exports.updateNganhThu = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await NganhLetter.findOneAndUpdate({ _id: _id }, req.body);

        if (data) return functions.success(res, 'Cập nhật thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

//xóa NganhThu
exports.deleteNganhThu = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await NganhLetter.findOneAndDelete({ _id: _id });

        if (data) return functions.success(res, 'Đã xóa thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// tạo mới mẫu Thu
exports.createThu = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập', 404);
        const data = req.body;

        let _id = 1;
        await functions.getMaxID(Thu)
            .then(res => {
                if (res) {
                    _id = res + 1;
                }
            });
        data._id = _id;
        await Letter.create(data);
        return await functions.success(res, 'Tạo mới Thu thành công', );
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// lấy dữ liệu mẫu Thu cũ
exports.findThu = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.params._id;
        const data = await Letter.findOne({ _id: _id });

        if (data) return functions.success(res, 'Thành công', data);

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

// update dữ liệu mẫu Thu
exports.updateThu = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await Letter.findOneAndUpdate({ _id: _id }, req.body);

        if (data) return functions.success(res, 'Cập nhật thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};

//xóa mẫu Thu
exports.deleteThu = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1) return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await Letter.findOneAndDelete({ _id: _id });

        if (data) return functions.success(res, 'Đã xóa thành công', );

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    };
};
// lấy ra thông tin ứng viên đã lưu trong thu
exports.detailUserThu = async(req, res) => {
    try {
        let user = req.user.data;
        let userid = user.idTimViec365;
        let id = req.body.id;
        if (userid && id) {
            let data = await LetterUV.aggregate([{
                $match: { uid: Number(userid), tid: Number(id) }
            }]);
            return await functions.success(res, 'Lấy thông tin thành công', { data });
        }
        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err.message)
    }
}