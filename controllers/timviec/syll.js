const functions = require('../../services/functions');
const Resume = require('../../models/Timviec365/CV/Resume');
const ResumeUV = require('../../models/Timviec365/CV/ResumeUV');
const TblModules = require('../../models/Timviec365/CV/TblModules');
const TblFooter = require('../../models/Timviec365/CV/TblFooter');
const Users = require('../../models/Users');
const Cv365Like = require('../../models/Timviec365/CV/Like');
const fs = require('fs');
const https = require('https');
const path = require('path');

// lấy danh sách mẫu syll
let data_resume = [];
let seo_backup;
let footerNew_backup;
exports.list = async(req, res, next) => {
    try {
        let data = [];
        if (data_resume.length) {
            data = data_resume;
        } else {
            data = await Resume.find({})
                .sort('-_id')
                .select('price image name alias')
                .lean();
            data_resume = data;
        }


        // Cập nhật thông tin theo vòng lặp
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            element.image = !data[i].image.includes('http') ? functions.getPictureResume(element.image) : element.image;
        }

        // Lấy thông tin seo
        let seo;
        if (seo_backup) {
            seo = seo_backup;
        } else {
            seo = await TblModules.findOne({
                module: 'mau-so-yeu-ly-lich',
            }).lean();
            seo_backup = seo;
        }

        // Lấy thông tin bài viết chân trang
        let footerNew;
        if (footerNew_backup) {
            footerNew = footerNew_backup;
        } else {
            footerNew = await TblFooter.findOne({}).select('content_soyeu');
            footerNew_backup = footerNew;
        }

        if (data)
            return await functions.success(res, 'Lấy mẫu SYLL thành công', {
                data,
                seo,
                footerNew,
            });

        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        functions.setError(res, err.message);
    }
};

// xem trước
exports.preview = async(req, res, next) => {
    try {
        const _id = req.body._id;
        const user = req.user ? req.user.data : '';
        const data = await Resume.findOne({ _id: _id }).lean();

        if (!data) return functions.setError(res, 'Không có dữ liệu', 404);
        // cập nhật số lượng xem
        await Resume.updateOne({ _id: _id }, { $set: { view: data.view + 1 } });

        let img = [];
        // Cập nhật hình ảnh
        for (let i = 1; i <= 4; i++) {
            img.push(
                `${process.env.cdn}/cv365/upload/hoso/${data.alias}/syll_${i}.jpg`
            );
        }
        data.img = img;
        if (user) {
            let checkLiked = await Cv365Like.findOne({ uid: user.idTimViec365, id: _id, type: 4 }, "id").lean();
            data.save = checkLiked ? true : false;
        }
        return functions.success(res, 'Lấy mẫu SYLL thành công', { data });
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// xem chi tiết
exports.detail = async(req, res, next) => {
    try {
        // console.log(req.user);
        // let findUser = Users.findOne({ _id: req.user.data._id }).lean();
        // console.log(findUser);
        // let avatarUser=functions.getImageUv(findUser.createdAt);

        const _id = Number(req.body._id);
        let uid = Number(req.body.uid);
        const user = await functions.getTokenUser(req, res);
        if (!uid && user) {
            uid = user.idTimViec365;
        }
        if (_id) {
            const data = await Resume.findOne({ _id: _id }).lean();
            if (data) {
                data.img_vi = 'https://timviec365.vn/images/nn4.png';
                data.img_en = 'https://timviec365.vn/images/nn0.png';
                data.img_cn = 'https://timviec365.vn/images/nn1.png';
                data.img_jp = 'https://timviec365.vn/images/nn2.png';
                data.img_kr = 'https://timviec365.vn/images/nn3.png';
                data.html = JSON.parse(data.html);
                data.html.avatar = `${process.env.cdn}/cv365/${data.html.avatar}`;

                // cập nhật số lượng xem
                await Resume.updateOne({ _id: _id }, { $set: { view: data.view + 1 } });

                if (uid) {
                    let row_user = await ResumeUV.findOne({
                        tid: _id,
                        uid: uid,
                    }).lean();
                    let ur = {};
                    array_img = {
                        en: 0,
                        cn: 1,
                        jp: 2,
                        kr: 3,
                        vi: 4,
                    };
                    if (row_user) {
                        ur['lang'] = row_user['lang'];
                        data['img'] = `${process.env.cdn}/images/nn${
                            array_img[row_user.lang]
                        }.png`;
                        const string = row_user['html']
                            .replace(/\\n/g, '')
                            .trim()
                            .replace(/\s+/g, ' ');
                        ur['html'] = JSON.parse(string);
                        // ur['html'] = json_decode(
                        //     row_user['html'],
                        //     JSON_UNESCAPED_UNICODE
                        // );
                        if (ur.html) {
                            ur.name_img = ur.html.avatar;
                        }
                        ur.status = row_user.status;
                    }
                    data.item_user = ur;
                }

                return await functions.success(res, 'Lấy SYLL thành công', {
                    data,
                });
            }
        }
        return await functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        console.log(err);
        return functions.setError(res, err.message);
    }
};

//lưu và tải syll
exports.save = async(req, res, next) => {
    try {
        let pmKey = req.user.data._id,
            userId = req.user.data.idTimViec365,
            id = Number(req.body.id),
            name_img = req.body.name_img,
            html = req.body.html,
            lang = req.body.lang;
        if (!name_img) {
            name_img = `syll_${userId}_${id}`;
        }
        let base64String = req.body.base64;
        if (id) {
            // Kiểm tra đã tạo hay chưa
            const checkSave = await ResumeUV.findOne({
                uid: userId,
                tid: id,
            }).lean();
            const checkUser = await Users.findOne({ idTimViec365: userId, type: { $ne: 1 } }).lean();
            // Đường dẫn ảnh
            const dir = `${process.env.storage_tv365}/cv365/upload/ungvien/uv_${userId}`;
            const dirUser = `${process.env.storage_tv365}/pictures/uv/${functions.convertDate(checkUser.createdAt, true)}`;

            // Đường link trả về để download 
            const link = `https://cdn.timviec365.vn/cv365/upload/ungvien/uv_${userId}`;
            const linkUser = `${process.env.cdn}/pictures/uv/${functions.convertDate(checkUser.createdAt, true)}`;

            let data = {
                uid: userId,
                tid: id,
                html: html,
                lang: lang,
                name_img
            };



            // Kiểm tra xem đã tạo thư mục lưu ảnh chưa
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            // Kiểm tra xem đã tạo thư mục lưu ảnh chưa
            if (!fs.existsSync(dirUser)) {
                fs.mkdirSync(dirUser, { recursive: true });
            }

            // Đường dẫn tới nơi bạn muốn lưu ảnh
            let outputPath = `${dirUser}/${name_img}.png`;
            let name_avatar = `avatar_syll_${id}`;
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
            console.log(outputlink);
            let message = 'Lưu';
            // Nếu chưa tạo thì lưu vào
            if (!checkSave) {
                let _id = 1;
                await ResumeUV.findOne({}, { id: 1 })
                    .sort({ id: -1 })
                    .then((res) => {
                        _id = res.id + 1;
                    });
                data.id = _id;
                await ResumeUV.create(data);
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

                await ResumeUV.updateOne({ _id: checkSave._id }, { $set: data });
            }
            let link_web = `${process.env.domain_tv365}/cv365/appcv365/tao_hoso_app/id_hoso/${id}/id_user/${userId}/id_lang/${lang}/password/123456`;
            let link_view = `${process.env.domain_tv365}/cv365/download-cvpdf/hoso.php?id=${id}&uid=${userId}&view=1&cvname=timviec365_syll`;
            let link_download = `${process.env.domain_tv365}/cv365/download-cvpdf/hoso.php?id=${id}&uid=${userId}&cvname=timviec365_syll`;

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

            return functions.success(res, `${message} thành công`, {
                data: {
                    outputPath,
                    user: await ResumeUV.findOne({ tid: data.tid }).lean(),
                    link_web,
                    link_view,
                    link_download,
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

// tạo mới mẫSYLL
exports.createSYLL = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập', 404);
        const data = req.body;

        let _id = 1;
        await functions.getMaxID(HoSo).then((res) => {
            if (res) {
                _id = res + 1;
            }
        });
        data._id = _id;
        await Resume.create(data);
        return await functions.success(res, 'Tạo mới SYLL thành công');
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// lấy dữ liệu mẫu SYLL cũ
exports.findSYLL = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.params._id;
        const data = await Resume.findOne({ _id: _id });

        if (data) return functions.success(res, 'Thành công', data);

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// update dữ liệu mẫu SYLL
exports.updateSYLL = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await Resume.findOneAndUpdate({ _id: _id }, req.body);

        if (data) return functions.success(res, 'Cập nhật thành công');

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

//xóa mẫu SYLL
exports.deleteSYLL = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await Resume.findOneAndDelete({ _id: _id });

        if (data) return functions.success(res, 'Đã xóa thành công');

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// lấy ra thông tin ứng viên đã lưu trong thu
exports.detailUserHoso = async(req, res) => {
    try {
        let user = req.user.data;
        let userid = user.idTimViec365;
        let id = req.body.id;
        if (userid && id) {
            let data = await ResumeUV.aggregate([{
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