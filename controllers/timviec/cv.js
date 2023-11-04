const functions = require('../../services/functions');
const service = require('../../services/timviec365/cv');
const serviceCandi = require('../../services/timviec365/candidate');
const CV = require('../../models/Timviec365/CV/Cv365');
const Users = require('../../models/Users');
const Application = require('../../models/Timviec365/CV/Application');
const Letter = require('../../models/Timviec365/CV/Letter');
const Resume = require('../../models/Timviec365/CV/Resume');
const SaveCvCandi = require('../../models/Timviec365/UserOnSite/Candicate/SaveCvCandi');
const CategoryCv = require('../../models/Timviec365/CV/Category');
const CVGroup = require('../../models/Timviec365/CV/CVGroup');
const Cv365Like = require('../../models/Timviec365/CV/Like');
const TblModules = require('../../models/Timviec365/CV/TblModules');
const Cv365TblFooter = require('../../models/Timviec365/CV/TblFooter');
const Cv365Blog = require('../../models/Timviec365/CV/Blog');
const Cv365CustomHtml = require('../../models/Timviec365/CV/CustomHtml');
const CategoryLangCv = require('../../models/Timviec365/CV/CVLang');
const CvHistoryPoint = require('../../models/Timviec365/CV/HistoryPoint');
const City = require('../../models/City');
const Category = require('../../models/Timviec365/CategoryJob');
const CVPreview = require('../../models/Timviec365/CV/CVPreview');
const serviceDataAI = require('../../services/timviec365/dataAI');
const nl2br = require('nl2br');

const data = require('../data');
const FormData = require('form-data');
//mã hóa mật khẩu
const md5 = require('md5');

// uuid
const { v4: uuidv4 } = require('uuid');
// gọi api
const axios = require('axios');

const fs = require('fs');
const https = require('https');
const path = require('path');

// lấy tất cả danh sách mẫu CV
let data_backup_getList = [];
let footerNew_backup_getList = [];
exports.getList = async(req, res, next) => {
    try {
        const request = req.body;
        if (Object.keys(req.body) == 0) {
            let flagReturnAgain = false;
            if (data_backup_getList.length) {
                await functions.success(res, 'Lấy mẫu CV thành công', {
                    data: data_backup_getList,
                    footerNew: footerNew_backup_getList,
                });
            } else {
                flagReturnAgain = true;
            }
            let pageNumber = request.pageNumber || 1,
                pageSize = request.pageSize || 20,
                skip = (pageNumber - 1) * pageSize,
                lang = Number(request.lang),
                cate = Number(request.cate),
                designID = Number(request.designID),
                notEqualId = Number(request.notEqualId),
                notCvAI = Number(request.notCvAI) || 0,
                sortBy = request.sortBy || 'new',
                // condition = { type: type_cv },
                condition = {},
                sort = {};

            if (notCvAI == 1) {
                condition.type = 0;
            }
            if (lang) {
                condition.lang_id = lang;
            }
            if (cate) {
                condition.cate_id = cate;
            }
            if (designID) {
                condition.design_id = designID;
            }
            if (sortBy != 'new') {
                sort.download = -1;
            }
            if (notEqualId) {
                condition._id = { $ne: notEqualId };
            }
            sort.vip = -1;
            sort.thutu = -1;

            // Lấy data theo từng điều kiện
            let data;
            if (pageSize != 'all') {
                data = await CV.find(condition)
                    .select(
                        '_id alias url_alias image view love download price cid name colors design_id type'
                    )
                    .sort(sort)
                    .skip(skip)
                    .limit(pageSize)
                    .lean();
            } else {
                data = await CV.find(condition)
                    .select(
                        '_id alias url_alias image view love download price cid name colors design_id type'
                    )
                    .sort(sort)
                    .lean();
            }

            // Lấy thông tin người dùng
            const user = await functions.getTokenUser(req, res);

            // Lấy danh sách cv ứng viên đã thích
            let listCvLike = [];
            if (user && user != 1) {
                listCvLike = await Cv365Like.find({
                        uid: user.idTimViec365,
                        type: 1,
                    },
                    'id'
                ).lean();
            }

            // Cập nhật data theo vòng lặp
            for (let i = 0; i < data.length; i++) {
                var element = data[i];
                element.image = await functions.getPictureCv(element.image);
                if (listCvLike.find((cv) => cv.id == element._id)) {
                    element.isLike = 1;
                } else {
                    element.isLike = 0;
                }
            }

            // Lấy thông tin bài viết chân trang
            const footerNew = await Cv365TblFooter.findOne({}).select(
                'content'
            );
            data_backup_getList = data;
            footerNew_backup_getList = footerNew;
            if (flagReturnAgain) {
                await functions.success(res, 'Lấy mẫu CV thành công', {
                    data: data_backup_getList,
                    footerNew: footerNew_backup_getList,
                });
            }
            return true;
        } else {
            let pageNumber = request.pageNumber || 1,
                pageSize = request.pageSize || 20,
                skip = (pageNumber - 1) * pageSize,
                lang = Number(request.lang),
                cate = Number(request.cate),
                designID = Number(request.designID),
                notCvAI = Number(request.notCvAI) || 0,
                sortBy = request.sortBy || 'new',
                condition = {},
                sort = {};
            if (notCvAI == 1) {
                condition.type = 0;
            }
            if (lang) {
                condition.lang_id = lang;
            }
            if (cate) {
                condition.cate_id = cate;
            }
            if (designID) {
                condition.design_id = designID;
            }
            if (sortBy != 'new') {
                sort.download = -1;
            }
            sort.vip = -1;
            sort.thutu = -1;

            let data; // Lấy data theo từng điều kiện
            let user; // Lấy thông tin người dùng
            let footerNew;
            let listCvLike = []; // Lấy danh sách cv ứng viên đã thích
            await Promise.all(
                [1, 2, 3].map(async(index) => {
                    if (index == 1) {
                        // ------ block 1
                        // Lấy data theo từng điều kiện
                        if (pageSize != 'all') {
                            data = await CV.find(condition)
                                .select(
                                    '_id alias url_alias image view love download price cid name colors design_id type'
                                )
                                .sort(sort)
                                .skip(skip)
                                .limit(pageSize)
                                .lean();
                        } else {
                            data = await CV.find(condition)
                                .select(
                                    '_id alias url_alias image view love download price cid name colors design_id type'
                                )
                                .sort(sort)
                                .lean();
                        }
                    } else if (index == 2) {
                        // ------ block 2
                        // Lấy thông tin người dùng
                        user = await functions.getTokenUser(req, res);
                        // Lấy danh sách cv ứng viên đã thích
                        if (user && user != 1) {
                            listCvLike = await Cv365Like.find({
                                    uid: user.idTimViec365,
                                    type: 1,
                                },
                                'id'
                            ).lean();
                        }
                    } else if (index == 3) {
                        // ------ block 3
                        // Lấy thông tin bài viết chân trang
                        footerNew = await Cv365TblFooter.findOne({}).select(
                            'content'
                        );
                    }
                })
            );

            // Cập nhật data theo vòng lặp
            for (let i = 0; i < data.length; i++) {
                var element = data[i];
                element.image = await functions.getPictureCv(element.image);
                if (listCvLike.find((cv) => cv.id == element._id)) {
                    element.isLike = 1;
                } else {
                    element.isLike = 0;
                }
            }

            return await functions.success(res, 'Lấy mẫu CV thành công', {
                data,
                footerNew,
            });
        }
    } catch (err) {
        console.log(err);
        return functions.setError(res, err.message);
    }
};


// lấy danh sách ngành cv
let back_up_getNganhCV = [];
exports.getNganhCV = async(req, res, next) => {
    try {
        if (back_up_getNganhCV.length) {
            return functions.success(res, 'Danh sách ngành cv', {
                data: back_up_getNganhCV,
            });
        }
        back_up_getNganhCV = await CategoryCv.find()
            .select('_id name alias cId')
            .lean();
        return functions.success(res, 'Danh sách ngành cv', {
            data: back_up_getNganhCV,
        });
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

//xem trước CV
exports.previewCV = async(req, res, next) => {
    try {
        const _id = req.body._id;
        const data = await CV.findOne({ _id: _id }).select(
            '_id lang_id name image mota_cv colors view'
        );

        if (data) {
            let view = data.view + 1; // cập nhật số lượng xem
            await CV.updateOne({ _id: _id }, { view: view });
            data.image = functions.getPictureCv(data.image);
            return await functions.success(res, 'Lấy mẫu cv thành công', {
                data,
            });
        }
        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (e) {
        functions.setError(res, e.message);
    }
};

exports.listCvByCate = async(req, res, next) => {
    try {
        const alias = req.body.alias,
            cate_id = Number(req.body.cate_id) || 0,
            cvid = Number(req.body.cvid) || 0;
        let condition = {};
        if (alias != null) {
            condition.alias = alias;
        }
        if (cate_id) {
            condition = { _id: cate_id };
        }
        let CateCv = {};
        if (alias || cate_id) {
            CateCv = await CategoryCv.findOne(condition).lean();
        }
        let conditionCV = {};
        if (CateCv && CateCv._id) {
            conditionCV.cate_id = CateCv._id;
        }
        if (cvid) {
            conditionCV._id = { $ne: cvid };
        }
        // Lấy danh sách cv của ngành nghề đó
        const page = Number(req.body.page) || 1,
            pageSize = req.body.pageSize,
            listCv = await CV.find(
                conditionCV,
                "'_id alias url_alias image view love download price cid name colors design_id"
            )
            .sort({ vip: -1, _id: -1 })
            .lean();

        // Xử lý hình ảnh cho bài viết chân trang
        if (CateCv && CateCv.content) {
            CateCv.content = functions.renderCDNImage(CateCv.content);
        }

        for (let i = 0; i < listCv.length; i++) {
            const element = listCv[i];
            element.image = await functions.getPictureCv(element.image);
        }

        return functions.success(res, 'Danh sách cv theo ngành', {
            items: CateCv,
            listCv,
        });
    } catch (err) {
        console.log(err);
        return functions.setError(res, err.message);
    }
};

// chi tiết cv ( tạo cv)
exports.detail = async(req, res, next) => {
    try {
        const _id = req.body._id;
        const uid = req.body.uid;
        let data = await CV.findOne({ _id: _id }).lean();
        if (data) {
            // cập nhật số lượng xem
            let view = data.view + 1;
            CV.updateOne({ _id: _id }, { view: view }).catch((e) => {
                return false;
            });

            let user;
            /** Bổ sung luồng tải id ứng viên để check và lấy thông tin của ứng viên đó khi máy chủ gọi đến để lấy nội dung ảnh cv (Thanh Long làm) */
            if (uid) {
                const checkUser = await Users.findOne({ idTimViec365: uid, type: { $ne: 1 } }, { idTimViec365: 1 }).lean();
                if (checkUser) {
                    user = checkUser;
                }
            } else {
                user = await functions.getTokenUser(req, res);
            }

            /** Nếu có thông tin ứng viên đăng nhập hoặc có id ứng viên truyền lên và ứng viên tồn tại thì tìm xem ứng viên đó đã tạo cv hay chưa */
            if (user != null) {
                let getCv = await SaveCvCandi.findOne({
                    uid: user.idTimViec365,
                    delete_cv: 0,
                    cvid: _id,
                }).lean();
                if (getCv) {
                    getCv.html = getCv.html.replaceAll(/[\r\n]/gm, ' ');
                    const decodeHtml = getCv.html
                        .replace(/\\n/g, '')
                        .trim()
                        .replace(/\s+/g, ' ');
                    const jsonHtml = JSON.parse(decodeHtml);
                    getCv.linkImg = jsonHtml.avatar;
                    data.item_ur = getCv;
                }

                if (data && data.status == 0) {
                    SaveCvCandi.updateOne({
                        uid: user.idTimViec365,
                        cvid: _id,
                    }, {
                        $set: {
                            status: 1,
                            delete_cv: 0,
                        },
                    }).catch((e) => {});
                }
                let checkLiked = await Cv365Like.findOne({ uid: user.idTimViec365, id: _id, type: 1 }, "id").lean();
                data.save = checkLiked ? true : false;
            }
            return functions.success(res, 'Lấy CV thành công', { data });
        } else {
            await functions.setError(res, 'Không có dữ liệu', 404);
        }
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};

// chi tiết cv ( tạo cv)
exports.detailLastCV = async(req, res, next) => {
    try {
        const uid = req.body.uid;
        let user = await functions.getTokenUser(req, res);
        //Lấy CV uv tạo mới nhất
        if (user) {
            /** Nếu có thông tin ứng viên đăng nhập hoặc có id ứng viên truyền lên và ứng viên tồn tại thì tìm xem ứng viên đó đã tạo cv hay chưa */
            let data = await SaveCvCandi.find({
                    uid: user.idTimViec365,
                    delete_cv: 0,
                })
                .sort({ time_edit: -1 })
                .lean();
            if (data.length) {
                data = data[0];
            }
            data.html = data.html.replaceAll(/[\r\n]/gm, ' ');
            return functions.success(res, 'Lấy CV thành công', { data });
        }
        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.like = async(req, res, next) => {
    try {
        const { type, idcv } = req.body;
        const user = req.user.data;
        if (type && idcv) {
            // Check xem có tồn tại không
            let checkItem;
            if (type == 1) {
                checkItem = await CV.findOne({
                    _id: idcv,
                });
            } else if (type == 2) {
                checkItem = await Application.findOne({
                    _id: idcv,
                });
            } else if (type == 3) {
                checkItem = await Letter.findOne({
                    _id: idcv,
                });
            } else if (type == 4) {
                checkItem = await Resume.findOne({
                    _id: idcv,
                });
            }
            // Nếu cv tồn tại và type thuộc 1,2,3,4
            if (checkItem && [1, 2, 3, 4].indexOf(Number(type)) != -1) {
                // Kiểm tra xem đã lưu cv hay chưa
                const userLike = await Cv365Like.findOne({
                    id: idcv,
                    uid: Number(user.idTimViec365),
                    type: type,
                }).lean();

                // Nếu chưa like thì lưu lại vào bảng
                let result, message;
                if (!userLike) {
                    const item = new Cv365Like({
                        uid: user.idTimViec365,
                        id: idcv,
                        status: 1,
                        type: type,
                    });
                    await item.save().then(() => {
                        result = 'save';
                    });
                    await CV.updateOne({ _id: idcv }, { $inc: { love: 1 } });
                    message = 'Lưu thành công';
                    result = true;
                } else {
                    await Cv365Like.deleteOne({
                        _id: userLike._id,
                    });
                    message = 'Bỏ lưu thành công';
                    result = false;
                }
                return await functions.success(res, message, { result });
            }
            return await functions.setError(
                res,
                'Không tồn tại cv hoặc tham số hợp lệ'
            );
        }
        return await functions.setError(res, 'Thiếu tham số');
    } catch (error) {
        return await functions.setError(res, error.message);
    }
};

//lưu và tải cv
exports.saveCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        let pmKey = user._id,
            userId = user.idTimViec365,
            cvid = req.body.cvid,
            allowSendChat = req.body.allowSendChat,
            height_cv = req.body.height_cv,
            name_img = req.body.name_img,
            name_img_hide = req.body.name_img_hide,
            html = req.body.html,
            lang = req.body.lang;

        const storage = process.env.PORT_QLC;
        const domain = process.env.domain_tv365;
        if (cvid) {
            // Kiểm tra đã tạo cv hay chưa
            const checkSaveCv = await SaveCvCandi.findOne({
                uid: userId,
                cvid: cvid,
            }).lean();
            const findUser = await Users.findOne({ _id: pmKey }, {
                createdAt: 1,
                avatarUser: 1,
                fromDevice: 1,
            }).lean();

            // Đường dẫn ảnh
            let dir = `${process.env.storage_tv365}/pictures/cv/${functions.convertDate(user.createdAt, true)}`;
            let dirAvatar = `${process.env.storage_tv365}/cv365/upload/ungvien/uv_${user.idTimViec365}`;
            let dirUser = `${process.env.storage_tv365}/pictures/uv/${functions.convertDate(user.createdAt, true)}`;
            let dirCdn = `${process.env.cdn}/pictures/cv/${functions.convertDate(user.createdAt, true)}`;

            // Kiểm tra xem đã tạo thư mục lưu ảnh chưa
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            if (!fs.existsSync(dirAvatar)) {
                fs.mkdirSync(dirAvatar, { recursive: true });
            }
            if (!fs.existsSync(dirUser)) {
                fs.mkdirSync(dirUser, { recursive: true });
            }

            let arrHtml = JSON.parse(html);

            if (arrHtml.avatar.includes('cv365/tmp')) {
                let arrUrl = arrHtml.avatar.split('/');
                let fileName = arrUrl[arrUrl.length - 1];
                let oldPath = arrHtml.avatar.replace(
                    'https://storage.timviec365.vn/timviec365/',
                    process.env.storage_tv365
                );

                let newPath = `${dirAvatar}/${fileName}`;
                let avtUrlNew = `${process.env.PORT_QLC}cv365/upload/ungvien/uv_${user.idTimViec365}/${fileName}`;
                if (fs.existsSync(oldPath)) {
                    //Cập nhật ảnh đại diện user nếu chưa có
                    let linkAvatar = '';
                    if (!findUser.avatarUser) {
                        linkAvatar = `${dirUser}/${fileName}`;
                        await Users.updateOne({ _id: pmKey }, {
                            $set: {
                                avatarUser: fileName,
                            },
                        });
                    }
                    //Lưu ảnh đại diện trong CV
                    fs.rename(oldPath, newPath, function(err) {
                        if (err) throw err;
                        //Lưu ảnh đại diện user
                        if (linkAvatar) {
                            fs.copyFile(newPath, linkAvatar, (err) => {
                                if (err) throw err;
                            });
                        }
                    });
                    html = html.replace(arrHtml.avatar, avtUrlNew);
                }
            }

            const data = {
                uid: userId,
                cvid: cvid,
                html: html,
                lang: lang,
                time_edit: functions.getTimeNow(),
                height_cv: height_cv,
                cv: 1,
                status: 2,
                check_cv: 0,
                delete_cv: 0,
                delete_time: 0,
                scan: 0
            };
            // Nếu chưa tạo thì lưu vào
            if (!checkSaveCv) {
                let _id = 10000000;
                let latestCvCandi = await SaveCvCandi.findOne({}, { id: 1 }).sort({ id: -1 });
                if (latestCvCandi && Number(latestCvCandi.id) > 10000000) {
                    _id = latestCvCandi.id + 1;
                }
                data.id = _id;
                await SaveCvCandi.create(data);
            }
            // Nếu tạo rồi thì cập nhật đồng thời xóa cv cũ
            else {
                if (name_img && checkSaveCv.name_img != null) {
                    const filePath = `${dir}/${checkSaveCv.name_img}.png`;
                    await fs.access(filePath, fs.constants.F_OK, (error) => {
                        if (error) {} else {
                            // Tệp tin tồn tại
                            fs.unlink(filePath, (err) => {
                                if (err) throw err;
                            });
                        }
                    });
                }
                if (name_img_hide && checkSaveCv.name_img_hide != null) {
                    const filePath = `${dir}/${checkSaveCv.name_img_hide}.png`;
                    await fs.access(filePath, fs.constants.F_OK, (error) => {
                        if (error) {} else {
                            // Tệp tin tồn tại
                            fs.unlink(
                                `${dir}/${checkSaveCv.name_img_hide}.png`,
                                (err) => {
                                    if (err) throw err;
                                }
                            );
                        }
                    });
                }
                await SaveCvCandi.updateOne({
                    _id: checkSaveCv._id,
                }, {
                    $set: data,
                });
            }

            //Bỏ cv đại diện cũ
            await SaveCvCandi.updateMany({ uid: userId, cvid: { $ne: cvid } }, { $set: { cv: 0 } });

            //Cập nhật trạng thái hoàn thiện hồ sơ
            if (findUser.fromDevice == 4 || findUser.fromDevice == 7) {
                await Users.updateOne({ _id: findUser._id }, { $set: { fromDevice: 8 } });
            }

            // Đường dẫn tới nơi bạn muốn lưu ảnh
            const outputPath = `${dir}/${name_img}.png`;
            const outputPathHide = `${dir}/${name_img_hide}.png`;

            //Render ảnh cv, không sử dụng ảnh gửi lên
            let linkImg = `${domain}/cv365/site/xem_cv_nodejs_no_hide/${cvid}/${userId}`,
                linkImgHide = `${domain}/cv365/site/xem_cv_nodejs_hide/${cvid}/${userId}`;
            functions.renderImageFromUrl(linkImg).then((resImage) => {
                if (!resImage.result) {
                    console.log(resImage.message);
                    // return functions.setError(res, resImage.message, 500);
                }
                let base64String = resImage.file;
                // Giải mã chuỗi Base64 thành dữ liệu nhị phân
                const imageBuffer = Buffer.from(base64String, 'base64');
                // Ghi dữ liệu nhị phân vào tệp ảnh
                fs.writeFile(outputPath, imageBuffer, (error) => {
                    if (error) {
                        return functions.setError(res, 'Lỗi khi ghi tệp ảnh');
                    }
                });
            });

            functions.renderImageFromUrl(linkImgHide).then((resImageHide) => {
                if (!resImageHide.result) {
                    console.log(resImageHide.message);
                    // return functions.setError(res, resImageHide.message, 500);
                }
                let base64StringHide = resImageHide.file;
                // Giải mã chuỗi Base64 thành dữ liệu nhị phân
                const imageBufferHide = Buffer.from(base64StringHide, 'base64');

                // Ghi dữ liệu nhị phân vào tệp ảnh
                fs.writeFile(outputPathHide, imageBufferHide, (error) => {
                    if (error) {
                        return functions.setError(res, 'Lỗi khi ghi tệp ảnh');
                    }
                });
            });

            let link_cdn_img = `${dirCdn}/${name_img}.png`;
            let message = 'Lưu';

            await SaveCvCandi.updateOne({
                uid: userId,
                cvid: cvid,
            }, {
                $set: {
                    name_img: name_img,
                    name_img_hide: name_img_hide,
                },
            });

            if (allowSendChat == 1) {
                message += ',tải';
            }

            // Cập nhật phần trăm hoàn thiện hồ sơ
            const uvPercent = await serviceCandi.percentHTHS(userId);
            const name_in_cv = arrHtml.name;
            const position_in_cv = arrHtml.position;
            const phone_in_cv = arrHtml.menu[0].content.content.content.phone;
            const email_in_cv = arrHtml.menu[0].content.content.content.email;
            const address_in_cv = arrHtml.menu[0].content.content.content.address;
            let dataUpdateCandi = {
                'inForPerson.candidate.percents': uvPercent,
            }
            if (name_in_cv) {
                dataUpdateCandi.userName = name_in_cv;
            }
            if (phone_in_cv) {
                dataUpdateCandi.phone = phone_in_cv;
            }
            if (email_in_cv) {
                dataUpdateCandi.emailContact = email_in_cv;
            }
            if (address_in_cv) {
                dataUpdateCandi.address = address_in_cv;
            }
            await Users.updateOne({ _id: pmKey }, {
                $set: dataUpdateCandi,
            });

            // cập nhật số lượt download
            let checkCV = await CV.findOne({ _id: cvid }).lean();
            if (checkCV) {
                let download = checkCV.download ? checkCV.download : 0;
                await CV.updateOne({ _id: pmKey }, {
                    $set: {
                        download: Number(download) + 1,
                    },
                });
            }
            functions.success(res, `${message} thành công`, {
                linkImg: linkImg,
                linkCdnImg: link_cdn_img,
            });

            //Gửi Cv qua chat
            if (allowSendChat == 1) {
                let linkViewPDF = `${domain}/cv365/site/xem_cv_nodejs/${cvid}/${userId}`;
                const resPDF = await functions.renderPdfFromUrl(linkViewPDF);

                //Lưu file pdf
                if (!resPDF.result) {
                    return functions.setError(res, 'Lỗi render file pdf');
                }
                let base64PDF = resPDF.file;
                let id = await uuidv4();
                let dateNow = Math.ceil(new Date().getTime() / 1000);
                const dirPDF = `${
                    process.env.storage_tv365
                }/cv365/tmp/${functions.convertDate(dateNow, true)}`;
                // Kiểm tra xem đã tạo thư mục lưu PDF chưa
                if (!fs.existsSync(dirPDF)) {
                    fs.mkdirSync(dirPDF, { recursive: true });
                }
                const outputPathPDF = `${dirPDF}/pdf_${userId}_${id}.pdf`;
                // console.log('pdf: ', outputPathPDF);
                // Giải mã chuỗi Base64 thành dữ liệu nhị phân
                const pdfBuffer = Buffer.from(base64PDF, 'base64');

                // await fs.writeFile(outputPathPDF, pdfBuffer, (error) => {
                //     if (error) {
                //         return functions.setError(res, 'Lỗi khi ghi tệp PDF');
                //     }
                // });
                fs.writeFileSync(outputPathPDF, pdfBuffer)

                const linkImg = `${storage}pictures/cv/${functions.convertDate(
                    user.createdAt,
                    true
                )}/${name_img}.png`;
                const linkPDF = `${storage}cv365/tmp/${functions.convertDate(
                    dateNow,
                    true
                )}/pdf_${userId}_${id}.pdf`;
                const senderId = 1191; // ID chat của tài khoản tổng đài
                const text = '';
                let data = {
                    userId: pmKey,
                    senderId: senderId,
                    linkImg: linkImg,
                    linkPdf: linkPDF,
                    Title: text,
                };
                let response = await axios.post(
                    'http://210.245.108.202:9000/api/message/SendMessageCv',
                    data
                );
                // await fs.access(outputPathPDF, fs.constants.F_OK, (error) => {
                //     if (error) {} else {
                //         // Tệp tin tồn tại
                //         fs.unlink(
                //             outputPathPDF,
                //             (err) => {
                //                 if (err) throw err;
                //             }
                //         );
                //     }
                // });

                message += ',tải';
            }
            //Đẩy data sang AI
            let dataSearchAI = {
                use_id: userId,
                cv_update_time: functions.getTimeNow(),
                percents: uvPercent,
            };
            serviceDataAI.updateDataSearchCandi(dataSearchAI);
            return true;
        }
        return functions.setError(
            res,
            'Thông tin truyền lên không đầy đủ',
            404
        );
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message, 404);
    }
};

// xem CV viết sẵn
exports.viewAvailable = async(req, res, next) => {
    try {
        const cateId = req.params.cateId;
        const data = await CV.findOne({ cateId }).sort('-cvPoint').select('');
        if (!data)
            return await functions.setError(res, 'Không có dữ liệu', 404);
        return await functions.success(res, 'Thành công cv viết sẵn', data);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// tính điểm cv
exports.countPoints = async(req, res, next) => {
    try {
        const _id = req.query.id; // id cv
        const point = +req.query.p; // số point đc cộng
        const cv = await CV.findOne({ _id });
        if (cv) {
            const data = await CV.updateOne({ _id }, { $set: { cvPoint: cv.cvPoint + point } }).select('');
            if (data)
                return await functions.success(
                    res,
                    'Cập nhật điểm cv thành công'
                );
        }
        return await functions.setError(res, 'Không có dũ liệu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// tạo mới mẫu cv
exports.createCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập', 404);
        const data = req.body;

        let _id = 1;
        await functions.getMaxID(CV).then((res) => {
            if (res) {
                _id = res + 1;
            }
        });
        data._id = _id;
        await CV.create(data);
        return await functions.success(res, 'Tạo mới cv thành công');
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// lấy dữ liệu mẫu cv cũ
exports.findCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.params._id;
        const data = await CV.findOne({ _id: _id });

        if (data) return functions.success(res, 'Thành công', data);

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// update dữ liệu mẫu cv
exports.updateCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await CV.findOneAndUpdate({ _id: _id }, req.body);

        if (data) return functions.success(res, 'Cập nhật thành công');

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

//xóa mẫu cv
exports.deleteCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await CV.findOneAndDelete({ _id: _id });

        if (data) return functions.success(res, 'Đã xóa thành công');

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// thêm ngành cv vào danh sách NganhCV
exports.createNganhCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');
        const data = req.body;

        let _id = 1;
        await functions.getMaxID(NganhCV).then((res) => {
            if (res) {
                _id = res + 1;
            }
        });
        data._id = _id;
        await CategoryCv.create(data);
        return await functions.success(res, 'Tạo mới NganhcCV thành công');
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// lấy dữ liệu NganhCV cũ
exports.findNganhCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');

        const _id = req.params._id;
        const data = await CategoryCv.findOne({ _id: _id });

        if (data) return functions.success(res, 'Thành công', data);

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

// update NganhCV
exports.updateNganhCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await CategoryCv.findOneAndUpdate({ _id: _id }, req.body);

        if (data) return functions.success(res, 'Cập nhật thành công');

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

//xóa NganhCV
exports.deleteNganhCV = async(req, res, next) => {
    try {
        const user = req.user.data;
        if (user.role != 1)
            return await functions.setError(res, 'Chưa có quyền truy cập');
        const _id = req.params._id;
        const data = await CategoryCv.findOneAndDelete({ _id: _id });

        if (data) return functions.success(res, 'Đã xóa thành công');

        return functions.setError(res, 'Không có dữ liêu', 404);
    } catch (err) {
        return functions.setError(res, err.message);
    }
};

exports.uploadAvatarCV = async(req, res) => {
    try {
        const base64String = req.body.img;

        // Đường dẫn ảnh
        const dir = `${process.env.storage_tv365}/cv365/tmp`;

        // Xóa đầu mục của chuỗi Base64 (ví dụ: "data:image/png;base64,")
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

        // Giải mã chuỗi Base64 thành dữ liệu nhị phân
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const name_img = 'tmp_cv_' + functions.getTimeNow();
        // Ghi dữ liệu nhị phân vào tệp ảnh
        const outputPath = `${dir}/${name_img}.png`;
        await fs.writeFile(outputPath, imageBuffer, (error) => {
            if (error) {
                console.error('Lỗi khi ghi tệp ảnh');
                return functions.setError(res, 'Lỗi khi ghi tệp ảnh', 404);
            }
        });
        return functions.success(res, 'Hình ảnh', {
            img: `${process.env.PORT_QLC}/cv365/tmp/${name_img}.png`,
        });
    } catch (error) {
        return functions.setError(res, error);
    }
};

exports.module = async(req, res) => {
    try {
        const modulecv = req.body.module;
        if (modulecv) {
            const item = await TblModules.findOne({
                module: modulecv,
            }).lean();
            if (item) {
                return functions.success(res, 'Thông tin module', { item });
            }
            return functions.setError(res, 'Module không tồn tại');
        }
        return functions.setError(res, 'Chưa tải module');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.cv365 = async(req, res) => {
    try {
        const seo = await TblModules.findOne({
            module: 'cv365',
        }).lean();

        const blog = await Cv365Blog.find({
                status: 1,
            })
            .select('id alias title image')
            .sort({ id: -1 })
            .limit(4);

        for (let index = 0; index < blog.length; index++) {
            const element = blog[index];
            element.image = `${process.env.cdn}/cv365/upload/news/thumb/${element.image}`;
        }

        const custom_html = await Cv365CustomHtml.findOne({
                status: 1,
                sort: 2,
            })
            .select('html')
            .sort({ id: -1 })
            .limit(1)
            .lean();
        const footer = await Cv365TblFooter.findOne({}, { content_cv365: 1 }).lean();

        return functions.success(res, 'Danh sách', {
            seo,
            blog,
            custom_html,
            footer,
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.seo_dm_nn_cv = async(req, res) => {
    try {
        const lang_id = req.body.lang_id;
        if (lang_id) {
            const item = await CategoryLangCv.findOne({ id: lang_id });
            if (item) {
                item.content = functions.renderCDNImage(item.content);
                return functions.success(res, 'Thông tin seo của ngôn ngữ cv', {
                    item,
                });
            }
            return functions.setError(res, 'Không tồn tại ngôn ngữ');
        }
        return functions.setError(res, 'Chưa truyền id ngôn ngữ');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.cv_mau = async(req, res) => {
    try {
        const cid = req.body.cid;
        const time_get = functions.getTimeNow() - 86400 * 210;
        if (cid) {
            const HistoryPoint = await CvHistoryPoint.aggregate([{
                    $match: {
                        chp_cate_id: cid,
                        chp_created_at: { $gt: time_get },
                    },
                },
                {
                    $group: {
                        _id: '$chp_cv_id',
                        sum_point: { $sum: '$chp_point' },
                    },
                },
                { $sort: { sum_point: -1, _id: -1 } },
                { $limit: 1 },
            ]);

            let cv;
            if (HistoryPoint.length > 0) {
                cv = await CV.findOne({ _id: HistoryPoint.chp_cv_id })
                    .select('alias colors view cv_point')
                    .lean();
            } else {
                cv = await CV.findOne({ cid: cid })
                    .sort({ cv_point: -1 })
                    .select('alias colors view cv_point')
                    .lean();
            }
            if (cv) {
                const color = cv.colors.split(',');
                const link_image = `${process.env.cdn}/cv365/upload/cv/${cv.alias}/${color[1]}.jpg`;
                const data = {
                    time: Number(cv.cv_point) * 3,
                    view_count: cv.view,
                    link_image: link_image,
                };
                return functions.success(res, 'CV mẫu', { data });
            }
            return functions.setError(res, 'Cv không tồn tại');
        }
        return functions.setError(res, 'Chưa truyền id ngành nghề');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.update_point_cv = async(req, res) => {
    try {
        const cv_id = req.body.cv_id;
        if (cv_id) {
            const cv = await CV.findOne({ _id: cv_id }).lean();
            if (cv) {
                let cv_point = cv.cv_point ? Number(cv.cv_point) + 1 : 1;

                await CV.updateOne({ _id: cv._id }, {
                    $set: { cv_point: cv_point },
                });
                const max_chp = await CvHistoryPoint.findOne({}, { chp_id: 1 })
                    .sort({ chp_id: -1 })
                    .lean();
                const chp = new CvHistoryPoint({
                    chp_id: Number(max_chp.chp_id) + 1,
                    chp_cv_id: cv._id,
                    chp_cate_id: cv.cate_id,
                    chp_point: 1,
                    chp_created_at: functions.getTimeNow(),
                });
                await chp.save();
                return functions.success(res, 'Cập nhật thành công');
            }
            return functions.setError(res, 'Cv không tồn tại');
        }
        return functions.setError(res, 'Chưa truyền id cv');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.dataFromTimviec365 = async(req, res) => {
    try {
        const request = req.body;
        const data = {
            uid: request.uid,
            cvid: request.cvid,
            lang: request.lang,
            html: request.html,
            name_img: request.name_img,
            time_edit: request.time_edit,
            cv: request.cv,
            status: request.status,
            delete_cv: request.delete_cv,
            delete_time: request.delete_time,
            height_cv: request.height_cv,
            state: request.state,
        };
        const item = new SaveCvCandi(data);
        await item.save();
        return functions.success(res, 'Cập nhật thành công');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

exports.detailBlog = async(req, res) => {
    try {
        const { id } = req.body;
        if (id) {
            const item = await Cv365Blog.findOne({ id: id });
            return functions.success(res, 'Chi tiết bài viết', { item });
        }
        return functions.setError(res, 'Chưa truyền lên ID');
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

//Tạo CV bằng AI365
exports.createCvAi365 = async(req, res, next) => {
    try {
        if (req.file) {
            let docCVPath = `${process.env.cdn}/${req.file.path.replace('../storage/base365/timviec365/','')}`;
            let city = await City.find({}),
                dataCity = [],
                category = await Category.find({}),
                dataCategory = [];
            for (const element of city) {
                dataCity.push({
                    cit_id: element._id,
                    cit_name: element.name,
                });
            }
            dataCity = JSON.stringify(dataCity);

            for (const element of category) {
                dataCategory.push({
                    cat_id: element.cat_id,
                    cat_name: element.cat_name,
                });
            }
            dataCategory = JSON.stringify(dataCategory);

            const form = new FormData();
            form.append('link_doc', docCVPath);
            form.append('category', dataCategory);
            form.append('city', dataCity);

            let response = await axios.post(
                'http://43.239.223.19:8005/create_cv',
                form
            );
            response = response.data;
            if (response.data) {
                // Lấy thông tin người dùng
                const user = await functions.getTokenUser(req, res);

                // handle data from api ai
                let info = response.data.item;
                let account = info.Account,
                    userEmail = info.Email.trim(),
                    userPhone = info.Phone.trim(),
                    userName = info.Name.trim();
                account = account.replace(/\s/g, '');

                if (!user && (!account || !info.Pass)) {
                    return functions.setError(
                        res,
                        'Vui lòng điền đầy đủ tài khoản và mật khẩu'
                    );
                } else if (!user &&
                    !(await functions.checkPhoneNumber(account))
                ) {
                    return functions.setError(
                        res,
                        'Số điện thoại đăng nhập bạn điền trong file không đúng định dạng'
                    );
                } else if (!user && info.Pass != info.ConPass) {
                    return functions.setError(
                        res,
                        'Nhập lại mật khẩu không chính xác'
                    );
                } else if (!user &&
                    !(await functions.validatePass(info.Pass.trim()))
                ) {
                    return functions.setError(
                        res,
                        'Mật khẩu phải tối thiểu 6 kí tự, có ít nhất 1 chữ, 1 số và không chứa dấu cách'
                    );
                } else if (
                    userName == '' ||
                    info.Job.trim() == '' ||
                    userEmail == '' ||
                    userPhone == ''
                ) {
                    return functions.setError(
                        res,
                        'Bạn cần điền đầy đủ các trường có dấu *'
                    );
                } else if (info.Career == 0 || info.WorkSpace == 0) {
                    return functions.setError(
                        res,
                        'Thiếu thông tin hoặc thông tin ngành nghề, địa điểm làm việc không đúng'
                    );
                } else if (!(await functions.checkPhoneNumber(userPhone))) {
                    return functions.setError(
                        res,
                        'Số điện thoại liên hệ bạn điền trong file không đúng định dạng'
                    );
                } else if (!(await functions.checkEmail(userEmail))) {
                    return functions.setError(
                        res,
                        'Email đăng nhập bạn điền trong file không đúng định dạng'
                    );
                } else {
                    // create json html cv
                    let cvid = req.body.cvid ? Number(req.body.cvid) : 2137;
                    let html = await CV.findOne({ _id: cvid }).select(
                        'html_vi'
                    );
                    html = JSON.parse(html.html_vi);

                    let contact_info = {
                        address: info.Address,
                        birthday: info.Dob,
                        email: userEmail,
                        phone: userPhone,
                        sex: info.Gender,
                    };
                    html.menu[0].content.content.content = contact_info;

                    if (info.Objective.length != 0) {
                        let muc_tieu = '\n';
                        info.Objective.map((element) => {
                            muc_tieu = muc_tieu + '- ' + element + '<br>';
                        });
                        html.menu[1].content.content = muc_tieu;
                    } else {
                        html.menu[1] = '';
                    }

                    if (info.Skill.length != 0) {
                        let ky_nang = [];
                        info.Skill.map((element) => {
                            ky_nang.push({
                                name: element[0],
                                exp: element[1],
                            });
                        });
                        html.menu[2].content.content.skills = ky_nang;
                    } else {
                        html.menu[2] = '';
                    }

                    if (info.Award.length != 0) {
                        let giai_thuong = '\n';
                        info.Award.map((element) => {
                            giai_thuong = giai_thuong + element + '<br>';
                        });
                        html.menu[3].content.content = giai_thuong;
                    } else {
                        html.menu[3] = '';
                    }

                    if (info.Certificate.length != 0) {
                        let chung_chi = '\n';
                        info.Certificate.map((element) => {
                            chung_chi = chung_chi + element + '<br>';
                        });
                        html.menu[4].content.content = chung_chi;
                    } else {
                        html.menu[4] = '';
                    }

                    if (info.Hobbies.length != 0) {
                        let so_thich = '\n';
                        info.Hobbies.map((element) => {
                            so_thich = so_thich + element + '<br>';
                        });
                        html.menu[5].content.content = so_thich;
                    } else {
                        html.menu[5] = '';
                    }

                    if (info.Reference.length != 0) {
                        let tham_chieu = '\n';
                        info.Reference.map((element) => {
                            tham_chieu = tham_chieu + element + '<br>';
                        });
                        html.menu[6].content.content = tham_chieu;
                    } else {
                        html.menu[6] = '';
                    }

                    if (info.Education.length != 0) {
                        let hoc_van = [];
                        info.Education.map((element) => {
                            hoc_van.push({
                                title: element.University,
                                subtitle: element.Major,
                                date: element.Time,
                                content: element.Classification,
                            });
                        });
                        html.experiences[0].content.content = hoc_van;
                    } else {
                        html.experiences[0] = '';
                    }

                    if (info.Exp.length != 0) {
                        let kinh_nghiem = [];
                        info.Exp.map((element) => {
                            let job = '\n';
                            if (element.Job) {
                                element.Job.map((data) => {
                                    job = job + data + '<br>';
                                });
                            }
                            kinh_nghiem.push({
                                title: element.Company,
                                subtitle: 'Vị trí: ' + element.Position,
                                date: element.Time,
                                content: job,
                            });
                        });
                        html.experiences[1].content.content = kinh_nghiem;
                    } else {
                        html.experiences[1] = '';
                    }

                    if (info.Activities.length != 0) {
                        let hoat_dong = [];
                        info.Activities.map((element) => {
                            let job = '\n';
                            element.job.map((data) => {
                                job = job + data + '<br>';
                            });
                            hoat_dong.push({
                                title: element.NameActivity,
                                date: element.Time,
                                content: job,
                            });
                        });
                        html.experiences[2].content.content = hoat_dong;
                    } else {
                        html.experiences[2].content.content = hoat_dong;
                    }

                    if (info.Project.length != 0) {
                        let du_an = [];
                        info.Project.map((element) => {
                            let job = '\n';
                            if (element.Job) {
                                element.Job.map((data) => {
                                    job = job + data + '<br>';
                                });
                            }
                            du_an.push({
                                title: element.NameProject,
                                subtitle: 'Vai trò: ' + element.Position,
                                date: element.Time,
                                content: job,
                            });
                        });
                        html.experiences[3].content.content = du_an;
                    } else {
                        html.experiences[3] = '';
                    }

                    html.name = info.Name;
                    html.cv_title = 'Cv tạo bằng AI';
                    html.position = info.Job;
                    html.experiences.splice(4, 1);

                    // register if not exits account
                    const now = functions.getTimeNow();
                    let dataUser;
                    const password = md5(info.Pass.trim());
                    const city = 0;
                    const district = 0;
                    const address = info.Address;
                    const fromDevice = 0;
                    const fromWeb = 'timviec365.vn';
                    const cv_cate_id = info.Career;
                    const cv_city_id = info.WorkSpace;
                    const cv_title = info.Job;
                    if (!user) {
                        let findUser = await functions.getDatafindOne(Users, {
                            phoneTK: account,
                            type: { $ne: 1 },
                        });
                        if (
                            findUser &&
                            findUser.phoneTK &&
                            findUser.phoneTK == account
                        ) {
                            return functions.setError(
                                res,
                                'Số điện thoại này đã được đăng kí',
                                200
                            );
                        }

                        // Lấy id mới nhất
                        var getMaxUserID = await functions.getMaxUserID();
                        let data = {
                            _id: getMaxUserID._id,
                            phoneTK: account,
                            password: password,
                            userName: userName,
                            phone: userPhone,
                            type: 0,
                            emailContact: userEmail,
                            city: city,
                            district: district,
                            address: address,
                            fromWeb: fromWeb,
                            fromDevice: fromDevice,
                            idTimViec365: getMaxUserID._idTV365,
                            idRaoNhanh365: getMaxUserID._idRN365,
                            idQLC: getMaxUserID._idQLC,
                            chat365_secret: Buffer.from(
                                getMaxUserID._id.toString()
                            ).toString('base64'),
                            createdAt: now,
                            updatedAt: now,
                            inForPerson: {
                                candidate: {
                                    cv_city_id: cv_city_id,
                                    cv_cate_id: cv_cate_id,
                                    cv_title: cv_title,
                                },
                            },
                        };

                        let userCreate = new Users(data);

                        // lưu ứng viên
                        await userCreate.save();
                        dataUser = data;
                        // Tạo token
                        var token = await functions.createToken({
                                _id: getMaxUserID._id,
                                idTimViec365: getMaxUserID._idTV365,
                                idQLC: getMaxUserID._idQLC,
                                idRaoNhanh365: getMaxUserID._idRN365,
                                email: userEmail,
                                phoneTK: getMaxUserID.phoneTK,
                                createdAt: now,
                                type: 0,
                                com_id: 0,
                            },
                            '1d'
                        );
                    } else {
                        let cate_new =
                            user.inForPerson &&
                            user.inForPerson.candidate &&
                            user.inForPerson.candidate.cv_cate_id ?
                            user.inForPerson.candidate.cv_cate_id : [];
                        if (
                            cate_new &&
                            cate_new.length < 3 &&
                            cate_new.indexOf(cv_cate_id) == -1
                        ) {
                            cate_new.push(cv_cate_id);
                        }
                        let cit_new =
                            user.inForPerson &&
                            user.inForPerson.candidate &&
                            user.inForPerson.candidate.cv_city_id ?
                            user.inForPerson.candidate.cv_city_id : [];
                        if (
                            cit_new &&
                            cit_new.length < 3 &&
                            cit_new.indexOf(cv_city_id) == -1
                        ) {
                            cit_new.push(cv_city_id);
                        }
                        await Users.updateOne({ _id: user._id }, {
                            $set: {
                                'inForPerson.candidate.cv_cate_id': cate_new,
                                'inForPerson.candidate.cv_city_id': cit_new,
                            },
                        });
                    }

                    // create Cv
                    let name_img = 'cv_' + functions.getTimeNow() + '.png',
                        name_img_hide =
                        'cv_' + functions.getTimeNow() + '_h.png',
                        pmKey = '',
                        userId = '',
                        createdAt = '';
                    if (user) {
                        pmKey = user._id;
                        userId = user.idTimViec365;
                        createdAt = user.createdAt;
                    } else {
                        pmKey = getMaxUserID._id;
                        userId = getMaxUserID._idTV365;
                        createdAt = now;
                    }

                    const storage = process.env.PORT_QLC;
                    const domain = process.env.domain_tv365;

                    // Kiểm tra đã tạo cv hay chưa
                    const checkSaveCv = await SaveCvCandi.findOne({
                        uid: userId,
                        cvid: cvid,
                    }).lean();

                    const infoUser = await Users.findOne({ _id: pmKey }, {
                        createdAt: 1,
                    }).lean();

                    // Đường dẫn ảnh
                    let dir = `${
                        process.env.storage_tv365
                    }/pictures/cv/${functions.convertDate(createdAt, true)}`;
                    let dirAvatar = `${process.env.storage_tv365}/cv365/upload/ungvien/uv_${userId}`;
                    let dirUser = `${
                        process.env.storage_tv365
                    }/pictures/uv/${functions.convertDate(createdAt, true)}`;

                    // Kiểm tra xem đã tạo thư mục lưu ảnh chưa
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                    if (!fs.existsSync(dirAvatar)) {
                        fs.mkdirSync(dirAvatar, { recursive: true });
                    }
                    if (!fs.existsSync(dirUser)) {
                        fs.mkdirSync(dirUser, { recursive: true });
                    }

                    if (info.Avatar && info.Avatar != '') {
                        let avtName = userId + '_' + createdAt,
                            avtCv = `${process.env.PORT_QLC}cv365/upload/ungvien/uv_${userId}/${avtName}`;

                        // Giải mã chuỗi Base64 thành dữ liệu nhị phân
                        const imageAvt = Buffer.from(info.Avatar, 'base64');

                        //Cập nhật ảnh đại diện user nếu chưa có
                        if (!infoUser.avatarUser &&
                            infoUser.avatarUser !== ''
                        ) {
                            await fs.writeFile(
                                `${dirUser}/${avtName}`,
                                imageAvt,
                                (error) => {
                                    if (error) {
                                        return functions.setError(
                                            res,
                                            'Lỗi khi ghi tệp ảnh'
                                        );
                                    }
                                }
                            );
                            await Users.updateOne({ _id: pmKey }, {
                                $set: {
                                    avatarUser: avtName,
                                },
                            });
                        }

                        await fs.writeFile(
                            `${dirAvatar}/${avtName}`,
                            imageAvt,
                            (error) => {
                                if (error) {
                                    return functions.setError(
                                        res,
                                        'Lỗi khi ghi tệp ảnh'
                                    );
                                }
                            }
                        );

                        html.avatar = avtCv;
                    }

                    const data = {
                        uid: userId,
                        cvid: cvid,
                        html: JSON.stringify(html),
                        lang: 'vi',
                        time_edit: functions.getTimeNow(),
                        height_cv: 0,
                        cv: 1,
                        status: 2,
                        check_cv: 0,
                        delete_cv: 0,
                        delete_time: 0,
                    };
                    // Nếu chưa tạo thì lưu vào
                    if (!checkSaveCv) {
                        let _id = 1;
                        await SaveCvCandi.findOne({}, { id: 1 })
                            .sort({ id: -1 })
                            .then((res) => {
                                if (res) {
                                    _id = res.id + 1;
                                }
                            });
                        data.id = _id;
                        await SaveCvCandi.create(data);
                    }

                    // Nếu tạo rồi thì cập nhật đồng thời xóa cv cũ
                    else {
                        if (name_img && checkSaveCv.name_img != null) {
                            const filePath = `${dir}/${checkSaveCv.name_img}.png`;
                            await fs.access(
                                filePath,
                                fs.constants.F_OK,
                                (error) => {
                                    if (error) {} else {
                                        // Tệp tin tồn tại
                                        fs.unlink(filePath, (err) => {
                                            if (err) throw err;
                                        });
                                    }
                                }
                            );
                        }
                        if (
                            name_img_hide &&
                            checkSaveCv.name_img_hide != null
                        ) {
                            const filePath = `${dir}/${checkSaveCv.name_img_hide}.png`;
                            await fs.access(
                                filePath,
                                fs.constants.F_OK,
                                (error) => {
                                    if (error) {} else {
                                        // Tệp tin tồn tại
                                        fs.unlink(
                                            `${dir}/${checkSaveCv.name_img_hide}.png`,
                                            (err) => {
                                                if (err) throw err;
                                            }
                                        );
                                    }
                                }
                            );
                        }
                        await SaveCvCandi.updateOne({
                            _id: checkSaveCv._id,
                        }, {
                            $set: data,
                        });
                    }

                    //Bỏ cv đại diện cũ
                    await SaveCvCandi.updateMany({ uid: userId, cvid: { $ne: cvid } }, { $set: { cv: 0 } });

                    // Đường dẫn tới nơi bạn muốn lưu ảnh
                    const outputPath = `${dir}/${name_img}.png`;
                    const outputPathHide = `${dir}/${name_img_hide}.png`;

                    //Render ảnh cv, không sử dụng ảnh gửi lên
                    let linkImg = `${domain}/cv365/site/xem_cv_nodejs_no_hide/${cvid}/${userId}`,
                        linkImgHide = `${domain}/cv365/site/xem_cv_nodejs_hide/${cvid}/${userId}`;
                    const resImage = await functions.renderImageFromUrl(
                        linkImg
                    );
                    const resImageHide = await functions.renderImageFromUrl(
                        linkImgHide
                    );
                    if (!resImage.result) {
                        return functions.setError(res, resImage.message, 500);
                    }
                    if (!resImageHide.result) {
                        return functions.setError(
                            res,
                            resImageHide.message,
                            500
                        );
                    }
                    let base64String = resImage.file,
                        base64StringHide = resImageHide.file;

                    // Giải mã chuỗi Base64 thành dữ liệu nhị phân
                    const imageBuffer = Buffer.from(base64String, 'base64');
                    const imageBufferHide = Buffer.from(
                        base64StringHide,
                        'base64'
                    );

                    // Ghi dữ liệu nhị phân vào tệp ảnh
                    await fs.writeFile(outputPath, imageBuffer, (error) => {
                        if (error) {
                            return functions.setError(
                                res,
                                'Lỗi khi ghi tệp ảnh'
                            );
                        }
                    });

                    await fs.writeFile(
                        outputPathHide,
                        imageBufferHide,
                        (error) => {
                            if (error) {
                                return functions.setError(
                                    res,
                                    'Lỗi khi ghi tệp ảnh'
                                );
                            }
                        }
                    );

                    await SaveCvCandi.updateOne({
                        uid: userId,
                        cvid: cvid,
                    }, {
                        $set: {
                            name_img: name_img,
                            name_img_hide: name_img_hide,
                        },
                    });

                    // Cập nhật phần trăm hoàn thiện hồ sơ
                    const uvPercent = await serviceCandi.percentHTHS(userId);
                    await Users.updateOne({ _id: pmKey }, {
                        $set: {
                            'inForPerson.candidate.percents': uvPercent,
                            updatedAt: functions.getTimeNow()
                        },
                    });

                    //Gửi Cv qua chat
                    let linkViewPDF = `${domain}/cv365/site/xem_cv_nodejs/${cvid}/${userId}`;
                    const resPDF = await functions.renderPdfFromUrl(
                        linkViewPDF
                    );
                    //Lưu file pdf
                    if (!resPDF.result) {
                        return functions.setError(res, 'Lỗi render file pdf');
                    }
                    let base64PDF = resPDF.file;
                    let id = await uuidv4();
                    let dateNow = Math.ceil(new Date().getTime() / 1000);
                    const dirPDF = `${
                        process.env.storage_tv365
                    }/cv365/tmp/${functions.convertDate(dateNow, true)}`;
                    // Kiểm tra xem đã tạo thư mục lưu PDF chưa
                    if (!fs.existsSync(dirPDF)) {
                        fs.mkdirSync(dirPDF, { recursive: true });
                    }
                    const outputPathPDF = `${dirPDF}/pdf_${id}.pdf`;
                    // Giải mã chuỗi Base64 thành dữ liệu nhị phân
                    const pdfBuffer = Buffer.from(base64PDF, 'base64');
                    // save file
                    // await fs.writeFile(outputPathPDF, pdfBuffer, (error) => {
                    //     if (error) {
                    //         return functions.setError(
                    //             res,
                    //             'Lỗi khi ghi tệp PDF'
                    //         );
                    //     }
                    // });
                    fs.writeFileSync(outputPathPDF, pdfBuffer)
                    const linkImgSendMess = `${storage}pictures/cv/${functions.convertDate(
                        createdAt,
                        true
                    )}/${name_img}.png`;
                    const linkPDFSendMess = `${storage}cv365/tmp/${functions.convertDate(
                        dateNow,
                        true
                    )}/pdf_${id}.pdf`;
                    const senderId = 1191; // ID chat của tài khoản tổng đài
                    const text = '';
                    let dataSendMess = {
                        userId: pmKey,
                        senderId: senderId,
                        linkImg: linkImgSendMess,
                        linkPdf: linkPDFSendMess,
                        Title: text,
                    };
                    await axios.post(
                        'http://210.245.108.202:9000/api/message/SendMessageCv',
                        dataSendMess
                    );

                    if (!user) {
                        //Đẩy data sang AI
                        let dataSearchAI = {
                            use_id: dataUser.idTimViec365,
                            use_first_name: dataUser.userName,
                            use_create_time: dataUser.createdAt,
                            use_update_time: dataUser.updatedAt,
                            use_gioi_tinh: 0,
                            use_city: '',
                            use_quanhuyen: '',
                            use_address: '',
                            cv_title: cv_title,
                            cv_hocvan: 0,
                            cv_exp: 0,
                            cv_muctieu: '',
                            cv_cate_id: cv_cate_id ? cv_cate_id : '',
                            cv_city_id: cv_city_id ? cv_city_id : '',
                            cv_address: '',
                            cv_capbac_id: '',
                            cv_money_id: '',
                            cv_loaihinh_id: '',
                            cv_kynang: '',
                            use_show: 1,
                            dk: 0,
                            use_birth_day: '',
                            um_max_value: 0,
                            um_min_value: 0,
                            um_unit: 0,
                            um_type: 0,
                            percents: uvPercent,
                        };
                        let result = await serviceDataAI.createDataSearchCandi(
                            dataSearchAI
                        );
                        return functions.success(
                            res,
                            'Đăng kí và tạo Cv thành công', {
                                user_id: userId,
                                token_base365: token,
                                id_chat365: getMaxUserID._id,
                            }
                        );
                    } else {
                        //Đẩy data sang AI
                        let dataSearchAI = {
                            use_id: user.idTimViec365,
                            cv_update_time: now,
                            percents: uvPercent,
                        };
                        serviceDataAI.updateDataSearchCandi(dataSearchAI);
                        return functions.success(res, 'Ttạo Cv thành công');
                    }
                }
            } else {
                return functions.setError(res, response.error.message);
            }
        } else {
            return functions.setError(
                res,
                'Thông tin truyền lên không đầy đủ!'
            );
        }
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

//Lưu thông tin xem trước CV cho app
exports.updateCVPreview = async(req, res) => {
    try {
        const request = req.body;
        let id = request.id,
            lang = request.lang,
            css = request.css,
            cv_title = request.cv_title,
            avatar = '',
            name = request.name,
            position = request.position,
            menu = request.menu,
            experiences = request.experiences,
            now = functions.getTimeNow();
        if (id) {
            //Lưu ảnh
            if (request.file && request.file.fileName != 'no_avatar.jpg') {
                let file = request.file;
                var file_path = file.path;
                const path = `${process.env.storage_tv365}/cv365/upload/ungvien/uv_${id}/`;
                let file_name = `app_${now}.jpg`;
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path, { recursive: true });
                }
                fs.rename(file_path, path + file_name, function(err) {
                    if (err) throw err;
                });
                avatar = `upload/ungvien/uv_${id}/${file_name}`;
            }
            let arr = {
                css: JSON.parse(css),
                cv_title: cv_title,
                avatar: avatar,
                name: name,
                position: position,
                menu: '%menu%',
                experiences: '%experiences%',
            };
            html = JSON.stringify(arr);

            html = html.replaceAll(`\'`, "'");
            html = html.replaceAll(`\"`, '"');
            html = html.replaceAll(`\r`, '');
            html = html.replaceAll("'", "''");
            html = html.replaceAll(`"%menu%"`, nl2br(menu));
            html = html.replaceAll(`"%experiences%"`, nl2br(experiences));
            let check = await CVPreview.findOne({ _id: id }).lean();
            if (check) {
                let dataCV = {
                    html: html,
                    name_img: avatar,
                    time_update: now,
                };
                await CVPreview.updateOne({ _id: id }, {
                    $set: dataCV,
                });
                return functions.success(res, 'Cập nhật thông tin thành công');
            } else {
                let dataCV = {
                    _id: id,
                    lang: lang,
                    html: html,
                    name_img: avatar,
                    time_update: now,
                };
                dataCVPreview = new CVPreview(dataCV);
                await dataCVPreview.save();
                return functions.success(res, 'Thêm thông tin thành công');
            }
        }
        return functions.setError(res, 'Thiếu thông tin truyền lên');
    } catch (e) {
        console.log(e);
        return functions.setError(res, e);
    }
};

//Lưu thông tin xem trước CV cho web
exports.updateCVPreviewWeb = async(req, res) => {
    try {
        const request = req.body;
        let id = request.id,
            lang = request.lang,
            avatar = '',
            html = request.json_cv,
            now = functions.getTimeNow();
        if (id) {
            //Lưu ảnh
            if (request.file && request.file.fileName != 'no_avatar.jpg') {
                let file = request.file;
                var file_path = file.path;
                const path = `${process.env.storage_tv365}/cv365/upload/ungvien/uv_${id}/`;
                let file_name = `app_${now}.jpg`;
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path, { recursive: true });
                }
                fs.rename(file_path, path + file_name, function(err) {
                    if (err) throw err;
                });
                avatar = `upload/ungvien/uv_${id}/${file_name}`;
            }
            let check = await CVPreview.findOne({ _id: id }).lean();
            if (check) {
                let dataCV = {
                    html: html,
                    name_img: avatar,
                    time_update: now,
                };
                await CVPreview.updateOne({ _id: id }, {
                    $set: dataCV,
                });
                return functions.success(res, 'Cập nhật thông tin thành công');
            } else {
                let dataCV = {
                    _id: id,
                    lang: lang,
                    html: html,
                    name_img: avatar,
                    time_update: now,
                };
                dataCVPreview = new CVPreview(dataCV);
                await dataCVPreview.save();
                return functions.success(res, 'Thêm thông tin thành công');
            }
        }
        return functions.setError(res, 'Thiếu thông tin truyền lên');
    } catch (e) {
        console.log(e);
        return functions.setError(res, e);
    }
};

// lấy data xem trước CV
exports.detailCVPreview = async(req, res, next) => {
    try {
        const id = req.body.id;
        if (id) {
            /** Nếu có thông tin ứng viên đăng nhập hoặc có id ứng viên truyền lên và ứng viên tồn tại thì tìm xem ứng viên đó đã tạo cv hay chưa */
            let data = await CVPreview.findOne({
                _id: id,
            }).lean();
            if (data) {
                return functions.success(res, 'Lấy CV thành công', { data });
            }
            return functions.setError(res, 'Không có dữ liệu', 404);
        }
        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (e) {
        return functions.setError(res, e.message);
    }
};

exports.renderPreview = async(req, res) => {
    try {
        const request = req.body;
        let id = request.id,
            cvid = request.cvid,
            lang = request.lang,
            avatar = request.avatar,
            html = request.json_cv,
            now = functions.getTimeNow();
        if (id) {
            //Lưu ảnh
            if (
                avatar &&
                avatar.includes('https://storage.timviec365.vn/cv365/')
            ) {
                avatar = avatar.replaceAll(
                    'https://storage.timviec365.vn/cv365/',
                    ''
                );
            } else {
                avatar = '';
            }
            let check = await CVPreview.findOne({ _id: id }).lean();
            if (check) {
                let dataCV = {
                    html: html,
                    name_img: avatar,
                    time_update: now,
                };
                await CVPreview.updateOne({ _id: id }, {
                    $set: dataCV,
                });
            } else {
                let dataCV = {
                    _id: id,
                    lang: lang,
                    html: html,
                    name_img: avatar,
                    time_update: now,
                };
                dataCVPreview = new CVPreview(dataCV);
                await dataCVPreview.save();
            }
            //Render ảnh
            const domain = process.env.domain_tv365;
            let linkPreview = `${domain}/cv365/site/xem_cv_app/${cvid}/${id}/0`;
            const resImage = await functions.renderImageFromUrl(linkPreview);
            if (!resImage.result) {
                return functions.setError(res, resImage.message, 500);
            }
            let buffer = resImage.file;
            buffer = new Buffer.from(buffer, 'base64');
            let base64String = buffer.toString('base64');
            return functions.success(res, 'Thêm thông tin thành công', {
                image: base64String,
            });
        }

        return functions.setError(res, 'Thiếu thông tin truyền lên');
    } catch (e) {
        console.log(e);
        return functions.setError(res, e);
    }
};

let blog_backup = []
exports.getUrlCv365 = async(req, res) => {
    try {
        let blog = [];
        if (blog_backup.length == 0) {
            blog = await Cv365Blog.aggregate([{
                    $sort: { id: -1 },
                },
                {
                    $project: {
                        id: 1,
                        alias: 1,
                    },
                },
            ]);
            blog_backup = blog;
        } else {
            blog = blog_backup;
        }

        return functions.success(res, 'Danh sách', {
            data: {
                blog,
            },
        });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
};

// save Cv by Ai
exports.saveCvDrawAi = async(req, res, next) => {
    try {
        const user = await Users.findOne({ idTimViec365: req.body.user_id }, {
            createdAt: 1,
            avatarUser: 1,
            _id: 1,
            idTimViec365: 1,
        }).lean();

        let pmKey = user._id,
            userId = user.idTimViec365,
            cvid = req.body.cvid,
            allowSendChat = req.body.allowSendChat,
            name_img = req.body.name_img,
            name_img_hide = req.body.name_img_hide,
            html = req.body.html,
            lang = req.body.lang,
            height_cv = req.body.height_cv,
            width_cv = req.body.width_cv;

        const storage = process.env.PORT_QLC;
        const domain = process.env.domain_tv365;
        if (cvid) {
            // Kiểm tra đã tạo cv hay chưa
            const checkSaveCv = await SaveCvCandi.findOne({
                uid: userId,
                cvid: cvid,
            }).lean();

            // Đường dẫn ảnh
            let dir = `${
                process.env.storage_tv365
            }/pictures/cv/${functions.convertDate(user.createdAt, true)}`;
            let dirAvatar = `${process.env.storage_tv365}/cv365/upload/ungvien/uv_${user.idTimViec365}`;
            let dirUser = `${
                process.env.storage_tv365
            }/pictures/uv/${functions.convertDate(user.createdAt, true)}`;

            // Kiểm tra xem đã tạo thư mục lưu ảnh chưa
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            if (!fs.existsSync(dirAvatar)) {
                fs.mkdirSync(dirAvatar, { recursive: true });
            }
            if (!fs.existsSync(dirUser)) {
                fs.mkdirSync(dirUser, { recursive: true });
            }

            let arrHtml = JSON.parse(html);
            if (arrHtml.avatar.includes('cv365/tmp')) {
                let arrUrl = arrHtml.avatar.split('/');
                let fileName = arrUrl[arrUrl.length - 1];
                let oldPath = arrHtml.avatar.replace(
                    'https://storage.timviec365.vn/timviec365',
                    process.env.storage_tv365
                );
                let newPath = `${dirAvatar}/${fileName}`;
                let avtUrlNew = `${process.env.PORT_QLC}cv365/upload/ungvien/uv_${user.idTimViec365}/${fileName}`;
                if (fs.existsSync(oldPath)) {
                    //Cập nhật ảnh đại diện user nếu chưa có
                    let linkAvatar = '';
                    if (!user.avatarUser) {
                        linkAvatar = `${dirUser}/${fileName}`;
                        await Users.updateOne({ _id: pmKey }, {
                            $set: {
                                avatarUser: fileName,
                            },
                        });
                    }
                    //Lưu ảnh đại diện trong CV
                    fs.rename(oldPath, newPath, function(err) {
                        if (err) throw err;
                        //Lưu ảnh đại diện user
                        if (linkAvatar) {
                            fs.copyFile(newPath, linkAvatar, (err) => {
                                if (err) throw err;
                            });
                        }
                    });
                    html = html.replace(arrHtml.avatar, avtUrlNew);
                }
            }

            const data = {
                uid: userId,
                cvid: cvid,
                html: html,
                lang: lang,
                time_edit: functions.getTimeNow(),
                cv: 1,
                status: 2,
                check_cv: 0,
                delete_cv: 0,
                delete_time: 0,
                type_cv: 1,
                scan: 0
            };
            // Nếu chưa tạo thì lưu vào
            if (!checkSaveCv) {
                let _id = 1;
                await SaveCvCandi.findOne({ type_cv: 1 }, { id: 1 })
                    .sort({ id: -1 })
                    .then((res) => {
                        if (res) {
                            _id = res.id + 1;
                        }
                    });
                data.id = _id;
                await SaveCvCandi.create(data);
            }
            // Nếu tạo rồi thì cập nhật đồng thời xóa cv cũ
            else {
                if (name_img && checkSaveCv.name_img != null) {
                    const filePath = `${dir}/${checkSaveCv.name_img}.png`;
                    await fs.access(filePath, fs.constants.F_OK, (error) => {
                        if (error) {} else {
                            // Tệp tin tồn tại
                            fs.unlink(filePath, (err) => {
                                if (err) throw err;
                            });
                        }
                    });
                }
                if (name_img_hide && checkSaveCv.name_img_hide != null) {
                    const filePath = `${dir}/${checkSaveCv.name_img_hide}.png`;
                    await fs.access(filePath, fs.constants.F_OK, (error) => {
                        if (error) {} else {
                            // Tệp tin tồn tại
                            fs.unlink(
                                `${dir}/${checkSaveCv.name_img_hide}.png`,
                                (err) => {
                                    if (err) throw err;
                                }
                            );
                        }
                    });
                }
                await SaveCvCandi.updateOne({
                    _id: checkSaveCv._id,
                }, {
                    $set: data,
                });
            }

            //Bỏ cv đại diện cũ
            await SaveCvCandi.updateMany({ uid: userId, cvid: { $ne: cvid } }, { $set: { cv: 0 } });

            // Đường dẫn tới nơi bạn muốn lưu ảnh
            const outputPath = `${dir}/${name_img}.png`;
            const outputPathHide = `${dir}/${name_img_hide}.png`;

            //Render ảnh cv, không sử dụng ảnh gửi lên
            let linkImg = `${domain}/cv365/site/xem_cv_nodejs_no_hide_ai/${cvid}/${userId}`,
                linkImgHide = `${domain}/cv365/site/xem_cv_nodejs_hide_ai/${cvid}/${userId}`;
            const resImage = await functions.renderImageFromUrl_v2(
                linkImg,
                height_cv
            );
            const resImageHide = await functions.renderImageFromUrl_v2(
                linkImgHide,
                height_cv
            );
            if (!resImage.result) {
                return functions.setError(res, resImage.message, 500);
            }
            if (!resImageHide.result) {
                return functions.setError(res, resImageHide.message, 500);
            }
            let base64String = resImage.file,
                base64StringHide = resImageHide.file;

            // Giải mã chuỗi Base64 thành dữ liệu nhị phân
            const imageBuffer = Buffer.from(base64String, 'base64');
            const imageBufferHide = Buffer.from(base64StringHide, 'base64');

            // Ghi dữ liệu nhị phân vào tệp ảnh
            await fs.writeFile(outputPath, imageBuffer, (error) => {
                if (error) {
                    return functions.setError(res, 'Lỗi khi ghi tệp ảnh');
                }
            });

            await fs.writeFile(outputPathHide, imageBufferHide, (error) => {
                if (error) {
                    return functions.setError(res, 'Lỗi khi ghi tệp ảnh');
                }
            });
            let message = 'Lưu';

            await SaveCvCandi.updateOne({
                uid: userId,
                cvid: cvid,
            }, {
                $set: {
                    name_img: name_img,
                    name_img_hide: name_img_hide,
                },
            });
            // Cập nhật phần trăm hoàn thiện hồ sơ
            const uvPercent = await serviceCandi.percentHTHS(userId);
            await Users.updateOne({ _id: pmKey }, {
                $set: {
                    'inForPerson.candidate.percents': uvPercent,
                },
            });
            //Gửi Cv qua chat
            if (allowSendChat == 1) {
                let linkViewPDF = `${domain}/cv365/site/xem_cv_nodejs_no_hide_ai/${cvid}/${userId}`;
                const resPDF = await functions.renderPdfFromUrl(
                    linkViewPDF
                );

                //Lưu file pdf
                if (!resPDF.result) {
                    return functions.setError(res, 'Lỗi render file pdf');
                }
                let base64PDF = resPDF.file;
                let id = await uuidv4();
                let dateNow = Math.ceil(new Date().getTime() / 1000);
                const dirPDF = `${
                    process.env.storage_tv365
                }/cv365/tmp/${functions.convertDate(dateNow, true)}`;
                // Kiểm tra xem đã tạo thư mục lưu PDF chưa
                if (!fs.existsSync(dirPDF)) {
                    fs.mkdirSync(dirPDF, { recursive: true });
                }
                const outputPathPDF = `${dirPDF}/pdf_${id}.pdf`;
                console.log('pdf AI:', outputPathPDF);
                // Giải mã chuỗi Base64 thành dữ liệu nhị phân
                const pdfBuffer = Buffer.from(base64PDF, 'base64');

                await fs.writeFile(outputPathPDF, pdfBuffer, (error) => {
                    if (error) {
                        return functions.setError(res, 'Lỗi khi ghi tệp PDF');
                    }
                });

                const linkImg = `${storage}pictures/cv/${functions.convertDate(
                    user.createdAt,
                    true
                )}/${name_img}.png`;
                const linkPDF = `${storage}cv365/tmp/${functions.convertDate(
                    dateNow,
                    true
                )}/pdf_${id}.pdf`;
                const senderId = 1191; // ID chat của tài khoản tổng đài
                const text = '';
                let data = {
                    userId: pmKey,
                    senderId: senderId,
                    linkImg: linkImg,
                    linkPdf: linkPDF,
                    Title: text,
                };
                let response = await axios.post(
                    'http://210.245.108.202:9000/api/message/SendMessageCv',
                    data
                );

                message += ',tải';
            }
            return functions.success(res, `${message} thành công`);
        }
        return functions.setError(
            res,
            'Thông tin truyền lên không đầy đủ',
            404
        );
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message, 404);
    }
};

// get list Cv Ai
exports.getListCvAi = async(req, res, next) => {
    try {
        const request = req.body;
        let pageNumber = request.pageNumber || 1,
            pageSize = request.pageSize || 20,
            skip = (pageNumber - 1) * pageSize,
            condition = { type: 1, status: 1 },
            sort = { vip: -1, thutu: -1 };

        // Lấy data theo từng điều kiện
        let data = await CV.find(condition)
            .select(
                '_id alias url_alias image view love download price cid name colors'
            )
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .lean();

        return await functions.success(res, 'Lấy mẫu CV thành công', { data });
    } catch (err) {
        functions.setError(res, err.message);
    }
};

//lưu và tải cv
exports.downloadCV = async(req, res, next) => {
    try {
        let cvid = req.body.cvid,
            uid = req.body.uid;
        const domain = process.env.domain_tv365;
        if (cvid) {
            //Gửi Cv qua chat
            let linkViewPDF = `${domain}/cv365/site/xem_cv_nodejs/${cvid}/${uid}`;
            const resPDF = await functions.renderPdfFromUrl(linkViewPDF);

            if (!resPDF.result) {
                return functions.setError(res, resPDF.message, 500);
            }
            let buffer = resPDF.file;
            buffer = new Buffer.from(buffer, 'base64');
            let base64String = buffer.toString('base64');

            return functions.success(res, `Thành công`, { file: base64String });
        }
        return functions.setError(
            res,
            'Thông tin truyền lên không đầy đủ',
            404
        );
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message, 404);
    }
};

//Tải cv về chat NTD
exports.downloadCVNTD = async(req, res, next) => {
    try {
        let cvid = req.body.cvid,
            uid = req.body.uid,
            idChatNTD = 0;
        if (req.user && req.user.data) {
            idChatNTD = req.user.data._id
        }
        const domain = process.env.domain_tv365,
            storage = process.env.PORT_QLC;
        if (cvid && uid) {
            let user = await Users.findOne({
                idTimViec365: uid,
                type: { $ne: 1 },
            }).lean();
            let cv = await SaveCvCandi.findOne({ uid, cvid }).lean();
            if (user && cv) {
                let dir = `${
                    process.env.storage_tv365
                }/pictures/cv/${functions.convertDate(user.createdAt, true)}`;
                let name_img = cv.name_img;

                const outputPath = `${dir}/${name_img}.png`;
                if (!fs.existsSync(outputPath)) {
                    //Render ảnh cv, không sử dụng ảnh gửi lên
                    let linkCVView = `${domain}/cv365/site/xem_cv_nodejs_no_hide/${cvid}/${uid}`;
                    let resImage = await functions.renderImageFromUrl(
                        linkCVView
                    );
                    if (!resImage.result) {
                        // console.log(resImage.message);
                        // return functions.setError(res, resImage.message, 500);
                    }
                    let base64String = resImage.file;
                    // Giải mã chuỗi Base64 thành dữ liệu nhị phân
                    const imageBuffer = Buffer.from(base64String, 'base64');
                    // Ghi dữ liệu nhị phân vào tệp ảnh
                    fs.writeFile(outputPath, imageBuffer, (error) => {
                        if (error) {
                            return functions.setError(
                                res,
                                'Lỗi khi ghi tệp ảnh'
                            );
                        }
                    });
                }

                let linkViewPDF = `${domain}/cv365/site/xem_cv_nodejs/${cvid}/${uid}`;
                const resPDF = await functions.renderPdfFromUrl(linkViewPDF);

                if (!resPDF.result) {
                    return functions.setError(res, resPDF.message, 500);
                }
                let buffer = resPDF.file;
                buffer = new Buffer.from(buffer, 'base64');
                let base64StringPDF = buffer.toString('base64');

                //Lưu file pdf
                let base64PDF = resPDF.file;
                let id = await uuidv4();
                let dateNow = Math.ceil(new Date().getTime() / 1000);
                const dirPDF = `${
                    process.env.storage_tv365
                }/cv365/tmp/${functions.convertDate(dateNow, true)}`;
                // Kiểm tra xem đã tạo thư mục lưu PDF chưa
                if (!fs.existsSync(dirPDF)) {
                    fs.mkdirSync(dirPDF, { recursive: true });
                }
                const outputPathPDF = `${dirPDF}/pdf_${id}.pdf`;
                // Giải mã chuỗi Base64 thành dữ liệu nhị phân
                const pdfBuffer = Buffer.from(base64PDF, 'base64');

                // await fs.writeFile(outputPathPDF, pdfBuffer, (error) => {
                //     if (error) {
                //         return functions.setError(res, 'Lỗi khi ghi tệp PDF');
                //     }
                // });
                fs.writeFileSync(outputPathPDF, pdfBuffer)

                //Gửi Cv qua chat
                const linkImg = `${storage}pictures/cv/${functions.convertDate(
                    user.createdAt,
                    true
                )}/${name_img}.png`;
                const linkPDF = `${storage}cv365/tmp/${functions.convertDate(
                    dateNow,
                    true
                )}/pdf_${id}.pdf`;
                if (idChatNTD) {
                    const senderId = 1191; // ID chat của tài khoản tổng đài
                    const text = '';
                    let data = {
                        userId: idChatNTD,
                        senderId: senderId,
                        linkImg: linkImg,
                        linkPdf: linkPDF,
                        Title: text,
                    };
                    let response = await axios.post(
                        'http://210.245.108.202:9000/api/message/SendMessageCv',
                        data
                    );
                }
                // console.log('pdf:', linkPDF);

                return functions.success(res, `Thành công`, {
                    file: base64StringPDF,
                });
            }
            return functions.setError(res, 'Không có thông tin ứng viên');
        }
        return functions.setError(res, 'Thông tin truyền lên không đầy đủ');
    } catch (e) {
        console.log(e);
        return functions.setError(res, e.message);
    }
};