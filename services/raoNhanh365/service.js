// check ảnh và video
const fs = require('fs');

// upload file
const multer = require('multer')

// gửi mail
const nodemailer = require("nodemailer");
// tạo biến môi trường
const dotenv = require("dotenv");
// mã hóa mật khẩu
const crypto = require('crypto');
// gọi api
const axios = require('axios')

// check video
const path = require('path');
//check ảnh
const { promisify } = require('util');

const jwt = require('jsonwebtoken');
// giới hạn dung lượng video < 100MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
// danh sách các loại video cho phép
const allowedTypes = ['.mp4', '.mov', '.avi', '.wmv', '.flv'];
// giới hạn dung lượng ảnh < 2MB
const MAX_IMG_SIZE = 10 * 1024 * 1024;
// giới hạn dung lượng kho ảnh
exports.MAX_Kho_Anh = 300 * 1024 * 1024;

const functions = require('../functions');

// import model
const AdminUserRaoNhanh365 = require('../../models/Raonhanh365/Admin/AdminUser');
const AdminUserRight = require('../../models/Raonhanh365/Admin/AdminUserRight');
const Category = require('../../models/Raonhanh365/Category');
const CateDetail = require('../../models/Raonhanh365/CateDetail');
const Tags = require('../../models/Raonhanh365/Tags');
const CateVL = require('../../models/Raonhanh365/CateVl');
const User = require('../../models/Users');
const FormData = require('form-data');
dotenv.config();

// hàm tạo link title
exports.createLinkTilte = (input) => {
    input = input.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    str = input.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.toLowerCase();
    str = str.replaceAll(' ', '-')
    return str
}
exports.deleteFileRaoNhanh = (id, file) => {
    let filePath = `../storage/base365/raonhanh365/pictures/avt_tindangmua/${id}/` + file;
    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
    });
}
exports.checkNameCateRaoNhanh = async(data) => {
    switch (data) {
        case 'Đồ điện tử':
            return 'electroniceDevice'
        case 'Xe cộ':
            return 'vehicle'
        case 'Bất động sản':
            return 'realEstate'
        case 'Ship':
            return 'ship'
        case 'Thú cưng':
            return 'pet'
        case 'Việc làm':
            return 'job'
        case 'Thực phẩm, Đồ uống':
            return 'food'
        case 'Đồ gia dụng':
            return 'wareHouse'
        case 'Sức khỏe - Sắc đẹp':
            return 'beautifull'
        case 'Thể thao':
            return 'Thể thao'
        case 'Du lịch':
            return 'Du lịch'
        case 'Đồ dùng văn phòng, công nông nghiệp':
            return 'Đồ dùng văn phòng, công nông nghiệp'
    }
}

// // hàm tạo link file rao nhanh 365
// exports.createLinkFileRaonhanh = (folder, id, name) => {
//     let link = process.env.DOMAIN_RAO_NHANH + '/base365/raonhanh365/pictures/' + folder + '/' + id + '/' + name;
//     return link;
// }


exports.uploadFileRaoNhanh = async(folder, id, file, allowedExtensions) => {

    let path1 = `../storage/base365/raonhanh365/pictures/${folder}/${id}/`;
    let filePath = `../storage/base365/raonhanh365/pictures/${folder}/${id}/` + file.name;

    let fileCheck = path.extname(filePath);
    if (allowedExtensions.includes(fileCheck.toLocaleLowerCase()) === false) {
        return false
    }
    // const { size } = await promisify(fs.stat)(filePath);
    // if (size > MAX_IMG_SIZE) {
    //     return false;
    // }

    if (!fs.existsSync(path1)) {
        fs.mkdirSync(path1, { recursive: true });
    }
    fs.readFile(file.path, (err, data) => {
        if (err) {
            return false
        }
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                return false
            }
        });
    });
    return file.name
}

exports.uploadFileRN2 = (folder, file, allowedExtensions) => {
    let path1 = `../storage/base365/raonhanh365/pictures/${folder}/`;
    let filePath = `../storage/base365/raonhanh365/pictures/${folder}/` + file.name;
    let fileCheck = path.extname(filePath);
    if (allowedExtensions.includes(fileCheck.toLocaleLowerCase()) === false) {
        return false;
    }
    if (!fs.existsSync(path1)) {
        fs.mkdirSync(path1, { recursive: true });
    }
    fs.readFile(file.path, (err, data) => {
        if (err) {
            return false
        }
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                return false
            }
        });
    });
    return file.name
}
exports.uploadFileBase64RaoNhanh = async(folder, id, base64String, file) => {
    let path1 = `../storage/base365/raonhanh365/pictures/${folder}/${id}/`;
    // let filePath = `../storage/base365/raonhanh365/pictures/${folder}/${id}/` + file.name;
    if (!fs.existsSync(path1)) {
        fs.mkdirSync(path1, { recursive: true });
    }
    var matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches.length !== 3) {
        return false;
    }

    let type = matches[1];
    let data = Buffer.from(matches[2], 'base64');

    const imageName = `${Date.now()}.${type.split("/")[1]}`;
    fs.writeFile(path1 + imageName, data, (err) => {
        if (err) {
            console.log(err)
        }
    });
}

// ham check admin rao nhanh 365
exports.isAdminRN365 = async(req, res, next) => {
    let user = req.user.data;

    let admin = await functions.getDatafindOne(AdminUserRaoNhanh365, { _id: user._id, active: 1 });
    if (admin && admin.active == 1) {
        req.infoAdmin = admin;
        return next();
    }
    return res.status(403).json({ message: "is not admin RN365 or not active" });
}

exports.checkRight = (moduleId, perId) => {
    return async(req, res, next) => {
        try {
            if (!moduleId || !perId) {
                return functions.setError(res, "Missing input moduleId or perId", 505);
            }
            let infoAdmin = req.infoAdmin;
            if (infoAdmin.isAdmin) return next();
            let permission = await AdminUserRight.findOne({ adminId: infoAdmin._id, moduleId: moduleId }, { add: 1, edit: 1, delete: 1 });
            if (!permission) {
                return functions.setError(res, "No right", 403);
            }
            if (perId == 1) return next();
            if (perId == 2 && permission.add == 1) return next();
            if (perId == 3 && permission.edit == 1) return next();
            if (perId == 4 && permission.delete == 1) return next();
            return functions.setError(res, "No right", 403);
        } catch (e) {
            return res.status(505).json({ message: e });
        }

    };
};

exports.checkTokenUser = async(req, res, next) => {
    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            return jwt.decode(token).data.idRaoNhanh365
        } else {
            return null;
        }
    } catch (error) {
        return null
    }

}
exports.checkFolderCateRaoNhanh = async(data) => {
        switch (data) {
            case 'Đồ điện tử':
                return 'do_dien_tu'
            case 'Xe cộ':
                return 'dangtin_xeco'
            case 'Dịch vụ - Giải trí':
                return 'dichvu_giaitri'
            case 'Bất động sản':
                return 'dangtin_bds'
            case 'Thời trang':
                return 'thoi_trang'
            case 'ship':
                return 'dangtin_ship'
            case 'Sức khỏe - Sắc đẹp':
                return 'dangtin_suckhoesacdep'
            case 'Nội thất - Ngoại thất':
                return 'noi_ngoai_that'
            case 'Khuyến mại - Giảm giá':
                return 'khuyen_mai'
            case 'Thể thao':
                return 'dtin_thethao'
            case 'Du lịch':
                return 'du_lich'
            case 'Đồ dùng văn phòng, công nông nghiệp':
                return 'dangtin_dodung'
            case 'Thực phẩm, Đồ uống':
                return 'thuc_pham'
            case 'Thú cưng':
                return 'dangtin_thucung'
            case 'Việc làm':
                return 'timviec'
            case 'Thực phẩm, Đồ uống':
                return 'thuc_pham'
            case 'Đồ gia dụng':
                return 'dangtin_dodung'
            case 'Mẹ và Bé':
                return 'dangtin_dodung'
            case 'Thủ công - Mỹ nghệ - Quà tặng':
                return 'dangtin_dodung'
        }
    }
    // lấy tên danh mục
exports.getNameCate = async(cateId, number) => {
        let danh_muc1 = null;
        let danh_muc2 = null;
        cate1 = await Category.findById(cateId).lean();
        if (!cate1) return null;
        if (cate1)
            danh_muc1 = cate1.name;
        if (cate1 && cate1.parentId !== 0) {
            cate2 = await Category.findById(cate1.parentId).lean();
            danh_muc2 = cate2.name;
        }
        let name = {};
        name.danh_muc1 = danh_muc1
        name.danh_muc2 = danh_muc2
        if (number === 2) {
            return name
        } else if (danh_muc2) {
            return danh_muc2
        } else if (danh_muc1) {
            return danh_muc1
        }
    }
    // lấy link file
exports.getLinkFile = async(userID, file, cateId, buySell) => {
    let nameCate = await this.getNameCate(cateId, 1);
    let folder = await this.checkFolderCateRaoNhanh(nameCate)
    let link = process.env.DOMAIN_RAO_NHANH + `/base365/raonhanh365/pictures/${folder}/${userID}/`;
    if (buySell == 1) link = process.env.DOMAIN_RAO_NHANH + `/base365/raonhanh365/pictures/avt_tindangmua/${userID}/`;
    let res = '';
    let arr = [];
    for (let i = 0; i < file.length; i++) {
        if (file[i].nameImg) {
            res = link + file[i].nameImg;
            arr.push({ nameImg: res })
        }
    }
    return arr;
}

// lấy avatar user
exports.getLinkAvatarUser = async(id, name) => {
    let link = process.env.DOMAIN_RAO_NHANH + `/base365/raonhanh365/pictures/avt_dangtin/${id}/` + name;
    return link;
}

// hàm chứa item serch của chi tiết tin
exports.searchItem = async(type) => {
    if (type === 1) {
        return searchitem = {
            _id: 1,
            title: 1,
            money: 1,
            endvalue: 1,
            city: 1,
            userID: 1,
            img: 1,
            cateID: 1,
            updateTime: 1,
            type: 1,
            active: 1,
            until: 1,
            address: 1,
            ward: 1,
            detailCategory: 1,
            district: 1,
            viewCount: 1,
            apartmentNumber: 1,
            com_city: 1,
            com_district: 1,
            com_ward: 1,
            com_address_num: 1,
            bidding: 1,
            tgian_kt: 1,
            tgian_bd: 1,
            name: 1,
            phone: 1,
            buySell: 1,
            video: 1,
            brand: 1,
            kich_co: 1,
            cateID: 1,
            title: 1,
            name: 1,
            city: 1,
            district: 1,
            ward: 1,
            apartmentNumber: 1,
            description: 1,
            status: 1,
            endvalue: 1,
            money: 1,
            until: 1,
            noidung_nhs: 1,
            com_city: 1,
            com_district: 1,
            com_ward: 1,
            com_address_num: 1,
            han_bat_dau: 1,
            han_su_dung: 1,
            tgian_bd: 1,
            tgian_kt: 1,
            donvi_thau: 1,
            phi_duthau: 1,
            phone: 1,
            email: 1,
            linkImage: 1,
            infoSell: 1,
            new_job_kind: 1,
            user: { _id: 1, idRaoNhanh365: 1, phone: 1, isOnline: 1, avatarUser: 1, inforRN365: 1, createdAt: 1, userName: 1, type: 1, chat365_secret: 1, email: 1, lastActivedAt: 1, time_login: 1 },
        };
    } else if (type === 2) {
        return searchitem = {
            _id: 1,
            title: 1,
            linkTitle: 1,
            free: 1,
            infoSell: 1,
            address: 1,
            money: 1,
            createTime: 1,
            cateID: 1,
            pinHome: 1,
            pinCate: 1,
            new_day_tin: 1,
            buySell: 1,
            email: 1,
            tgian_kt: 1,
            tgian_bd: 1,
            phone: 1,
            userID: 1,
            img: 1,
            updateTime: 1,
            user: { _id: 1, idRaoNhanh365: 1, isOnline: 1, phone: 1, avatarUser: 1, inforRN365: 1, userName: 1, type: 1, chat365_secret: 1, email: 1, lastActivedAt: 1, time_login: 1 },
            district: 1,
            ward: 1,
            description: 1,
            city: 1,
            brand: 1,
            islove: '1',
            until: 1,
            endvalue: 1,
            type: 1,
            detailCategory: 1,
            infoSell: 1,
            timePromotionStart: 1,
            timePromotionEnd: 1,
            quantitySold: 1,
            infoSell: 1,
            viewCount: 1,
            poster: 1,
            sold: 1,
            com_city: 1,
            video: 1,
            district: 1,
            ward: 1,
            com_address_num: 1,
            buySell: 1,
            totalSold: 1,
            quantityMin: 1,
            quantityMax: 1,
            productGroup: 1,
            productType: 1
        }
    }
}

// lấy tin tương tự cho chi tiết tin
exports.tinTuongTu = async(res, New, check, id_new, userId, LoveNews) => {
    try {
        let tintuongtu = await New.aggregate([
            { $match: { cateID: check.cateID, active: 1, sold: 0, _id: { $ne: id_new } } },
            { $sort: { createTime: -1 } },
            { $limit: 6 },
            {
                $lookup: {
                    from: 'Users',
                    foreignField: 'idRaoNhanh365',
                    localField: 'userID',
                    as: 'user'
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    linkTitle: 1,
                    free: 1,
                    address: 1,
                    money: 1,
                    createTime: 1,
                    cateID: 1,
                    pinHome: 1,
                    userID: 1,
                    img: 1,
                    updateTime: 1,
                    user: { _id: 1, avatarUser: 1, phone: 1, userName: 1, type: 1, chat365_secret: 1, 'inforRN365.xacThucLienket': 1, email: 1, 'inforRN365.store_name': 1, lastActivedAt: 1, time_login: 1 },
                    district: 1,
                    ward: 1,
                    city: 1,
                    dia_chi: 1,
                    islove: 1,
                    until: 1,
                    endvalue: 1,
                    active: 1,
                    type: 1,
                    sold: 1,
                    createTime: 1,
                    free: 1,
                    buySell: 1
                }
            }
        ]);
        if (tintuongtu.length !== 0) {
            for (let i = 0; i < tintuongtu.length; i++) {
                if (tintuongtu[i].user && tintuongtu[i].user.avatarUser) {
                    tintuongtu[i].user.avatarUser = await exports.getLinkAvatarUser(tintuongtu[i].user.idRaoNhanh365, tintuongtu[i].user.avatarUser);
                }
                if (tintuongtu[i].img) {
                    tintuongtu[i].img = await exports.getLinkFile(tintuongtu[i].img, tintuongtu[i].cateID, tintuongtu[i].buySell);
                    tintuongtu[i].soluonganh = tintuongtu[i].img.length;
                }
                tintuongtu[i].buySell == 1 ? tintuongtu[i].link = `https://raonhanh.vn/${tintuongtu[i].linkTitle}-ct${tintuongtu[i]._id}.html` : tintuongtu[i].link = `https://raonhanh.vn/${tintuongtu[i].linkTitle}-c${tintuongtu[i]._id}.html`
                if (userId) {
                    let dataLoveNew = await LoveNews.findOne({ id_user: userId, id_new: tintuongtu[i]._id });
                    if (dataLoveNew) tintuongtu[i].islove = 1;
                    else tintuongtu[i].islove = 0;
                } else {
                    tintuongtu[i].islove = 0;
                }
            }
        }
        return tintuongtu
    } catch (error) {
        return null
    }
}

// lấy like comment cho chi tiết tin
exports.getComment = async(res, Comments, LikeRN, url, sort, cm_start, cm_limit) => {
    try {
        let ListComment = [];
        if (sort == 1) {
            ListComment = await Comments.find({ url, parent_id: 0 }).sort({ _id: -1 }).skip(cm_start).limit(cm_limit).lean();
        } else {
            ListComment = await Comments.find({ url, parent_id: 0 }).sort({ _id: 1 }).skip(cm_start).limit(cm_limit).lean();
        }
        for (let i = 0; i < ListComment.length; i++) {

            if (ListComment[i].sender_idchat) {

                let checkuser = await User.findOne({ idRaoNhanh365: ListComment[i].sender_idchat }, { idRaoNhanh365: 1, avatarUser: 1, userName: 1 }).lean();

                if (checkuser) {
                    if (checkuser.avatarUser) {
                        let avatar = await this.getLinkAvatarUser(checkuser.idRaoNhanh365, checkuser.avatarUser)
                        ListComment[i].avatar = avatar;
                    }
                    ListComment[i].name = checkuser.userName;
                } else {
                    ListComment[i].avatar = null;
                    ListComment[i].name = null;
                }
            } else {
                ListComment[i].avatar = null;
                ListComment[i].name = null;
            }
        }
        // let NumberCommentChild = await Comments.countDocuments({ url, parent_id: { $ne: 0 } });
        let ListReplyComment = [];
        let ListLikeComment = [];
        let ListLikeCommentChild = [];
        if (ListComment.length !== 0) {
            for (let i = 0; i < ListComment.length; i++) {
                ListLikeComment = await LikeRN.find({ forUrlNew: url, type: { $lt: 8 }, commentId: ListComment[i]._id }, {}, { type: 1 })
                ListReplyComment = await Comments.find({ url, parent_id: ListComment[i]._id }, {}, { time: -1 }).limit(3).lean();
                let NumberCommentChild = await Comments.countDocuments({ url, parent_id: ListComment[i]._id });
                // lấy lượt like của từng trả lời
                if (ListReplyComment && ListReplyComment.length > 0) {
                    for (let j = 0; j < ListReplyComment.length; j++) {
                        ListLikeCommentChild = await LikeRN.find({ forUrlNew: url, type: { $lt: 8 }, commentId: ListReplyComment[j]._id }, {}, { type: 1 })
                        let checkuser = await User.findOne({ idRaoNhanh365: ListReplyComment[i].sender_idchat }, { idRaoNhanh365: 1, avatarUser: 1, userName: 1 }).lean();
                        if (checkuser && checkuser.avatarUser) {
                            let avatar = await this.getLinkAvatarUser(checkuser.idRaoNhanh365, checkuser.avatarUser)
                            ListReplyComment[i].avatar = avatar;
                            ListReplyComment[i].name = checkuser.userName;
                        }
                        ListReplyComment[j].ListLikeCommentChild = ListLikeCommentChild
                        if (ListReplyComment[j].img) {
                            ListReplyComment[j].img = process.env.DOMAIN_RAO_NHANH + '/' + ListReplyComment[j].img
                        }
                        ListReplyComment[j].NumberLikeCommentChild = ListLikeCommentChild.length
                    }
                }
                ListComment[i].ListLikeComment = ListLikeComment
                ListComment[i].ListReplyComment = ListReplyComment
                ListComment[i].NumberCommentChild = NumberCommentChild
                ListComment[i].NumberLikeComment = ListLikeComment.length
                if (ListComment[i].img) {
                    ListComment[i].img = process.env.DOMAIN_RAO_NHANH + '/' + ListComment[i].img
                }
            }
        }
        return ListComment
    } catch (error) {
        return null
    }
}

// lấy thông tin đấu thầu nếu là tin mua
exports.getDataBidding = async(res, Bidding, id_new, Evaluate, sort) => {
    try {
        let dataBidding = await Bidding.aggregate([
            { $match: { newId: id_new } },
            { $sort: { _id: sort } },
            {
                $lookup: {
                    from: "Users",
                    localField: 'userID',
                    foreignField: 'idRaoNhanh365',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    user: { _id: 1, idRaoNhanh365: 1, phone: 1, avatarUser: 1, 'inforRN365.xacThucLienket': 1, createdAt: 1, userName: 1, type: 1, chat365_secret: 1, email: 1 },
                    _id: 1,
                    userName: 1,
                    userIntro: 1,
                    userFile: 1,
                    userProfile: 1,
                    userProfileFile: 1,
                    productName: 1,
                    productDesc: 1,
                    productLink: 1,
                    price: 1,
                    priceUnit: 1,
                    promotion: 1,
                    promotionFile: 1,
                    status: 1,
                    createTime: 1,
                    note: 1,
                    updatedAt: 1,
                    status: 1
                }
            }
        ])
        if (dataBidding.length !== 0) {
            for (let i = 0; i < dataBidding.length; i++) {
                if (dataBidding[i].user && dataBidding[i].user.avatarUser) {
                    dataBidding[i].user.avatarUser = await exports.getLinkAvatarUser(dataBidding[i].user.idRaoNhanh365, dataBidding[i].user.avatarUser);
                }
                if (dataBidding[i].userFile) {
                    dataBidding[i].userFile = process.env.DOMAIN_RAO_NHANH + '/base365/raonhanh365/pictures/avt_tindangmua/' + dataBidding[i].userFile;
                }
                if (dataBidding[i].userProfileFile) {
                    dataBidding[i].userProfileFile = process.env.DOMAIN_RAO_NHANH + '/base365/raonhanh365/pictures/avt_tindangmua/' + dataBidding[i].userProfileFile;
                }
                if (dataBidding[i].promotionFile) {
                    dataBidding[i].promotionFile = process.env.DOMAIN_RAO_NHANH + '/base365/raonhanh365/pictures/avt_tindangmua/' + dataBidding[i].promotionFile;
                }
                dataBidding[i].user.thongTinSao = await this.getInfoEnvaluate(res, Evaluate, dataBidding[i].user.idRaoNhanh365)
            }
        }
        return dataBidding
    } catch (error) {
        return null
    }
}

// lấy thông tin sao của user
exports.getInfoEnvaluate = async(res, Evaluate, userID) => {
    try {
        let cousao = await Evaluate.find({ blUser: userID }).count();
        let sumsao = await Evaluate.aggregate([
            { $match: { blUser: userID, } },
            {
                $group: {
                    _id: null,
                    count: { $sum: "$stars" }
                }
            }
        ]);
        let thongTinSao = {};
        if (sumsao && sumsao.length !== 0) {
            thongTinSao.cousao = cousao;
            thongTinSao.sumsao = sumsao[0].count;
        }
        return thongTinSao;
    } catch (error) {
        return null
    }
}
const jobKind = [
    { _id: 1, name: 'Toàn thời gian' },
    { _id: 2, name: 'Bán thời gian' },
    { _id: 3, name: 'Giờ hành chính' },
    { _id: 4, name: 'Ca sáng' },
    { _id: 5, name: 'Ca chiều' },
    { _id: 6, name: 'Ca đêm' },
];

const payBy = [
    { _id: 1, name: 'Theo giờ' },
    { _id: 2, name: 'Theo ngày' },
    { _id: 3, name: 'Theo tuần' },
    { _id: 4, name: 'Theo tháng' },
    { _id: 5, name: 'Theo năm' },
];

const degree = [
    { _id: 1, name: 'Cần bán' },
    { _id: 2, name: 'Cao đăng' },
    { _id: 3, name: 'Lao động phổ thông' },
];

const can_ban_mua = [
    { _id: 1, name: 'Đại học' },
    { _id: 2, name: 'Cho thuê' },
    { _id: 3, name: 'Cần mua' },
    { _id: 4, name: 'Cần thuê' },
];

const giay_to_phap_ly = [
    { _id: 1, name: 'Đã có sổ' },
    { _id: 2, name: 'Đang chờ sổ' },
    { _id: 3, name: 'Giấy tờ khác' },
];

const tinh_trang_noi_that = [
    { _id: 1, name: 'Nội thất cao cấp' },
    { _id: 2, name: 'Nội thất đầy đủ' },
    { _id: 3, name: 'Hoàn thiện cơ bản' },
    { _id: 4, name: 'Bàn giao thô' },

];

const huong_chinh = [
    { _id: 1, name: 'Đông' },
    { _id: 2, name: 'Tây' },
    { _id: 3, name: 'Nam' },
    { _id: 4, name: 'Bắc' },
    { _id: 5, name: 'Đông bắc' },
    { _id: 6, name: 'Đông nam' },
    { _id: 7, name: 'Tây bắc' },
    { _id: 8, name: 'Tây nam' },
];

const huong_ban_cong = [
    { _id: 1, name: 'Đông' },
    { _id: 2, name: 'Tây' },
    { _id: 3, name: 'Nam' },
    { _id: 4, name: 'Bắc' },
    { _id: 5, name: 'Đông bắc' },
    { _id: 6, name: 'Đông nam' },
    { _id: 7, name: 'Tây bắc' },
    { _id: 8, name: 'Tây nam' },
];

const loai_hinh_dat = [
    { _id: 1, name: 'Đất thổ cư' },
    { _id: 2, name: 'Đất nền dự án' },
    { _id: 3, name: 'Đất công nghiệp' },
    { _id: 4, name: 'Đất nông nghiệp' },
];

const loaihinh_vp = [
    { _id: 1, name: 'Mặt bằng kinh doanh' },
    { _id: 2, name: 'Văn phòng' },
    { _id: 3, name: 'Shophouse' },
    { _id: 4, name: 'Officetel' },
];

const tinh_trang_bds = [
    { _id: 1, name: 'Đã bàn giao' },
    { _id: 2, name: 'Chưa bàn giao' },
];

const cangoc = [
    { _id: 1, name: 'Có' },
    { _id: 2, name: 'Không' },
];

const dac_diem = [
    { _id: 1, name: 'Xe hơi' },
    { _id: 2, name: 'Nở hậu' },
    { _id: 3, name: 'Mặt tiền' },
];

const hop_so = [
    { _id: 1, name: 'Tự động' },
    { _id: 2, name: 'Số sàn' },
    { _id: 3, name: 'Bán tự động' },
]

const nhien_lieu = [
        { _id: 1, name: 'xăng' },
        { _id: 2, name: 'dầu' },
        { _id: 3, name: 'Động cơ Hybird' },
        { _id: 4, name: 'điện' },
    ]
    // hàm xửl lý tên mặt hàng cho danh mục
exports.getDataNewDetail = async(data_object, cate) => {
    try {
        let check = await CateDetail.findOne({ _id: cate }).lean();

        // job và bất động sản
        if (data_object.Job && data_object.Job.jobKind) {
            let data = jobKind.find(item => item._id == data_object.Job.jobKind)
            if (data) data_object.Job.jobKind = data.name.replace('\r', '')
        }

        if (data_object.Job && data_object.Job.payBy) {
            let data = payBy.find(item => item._id == data_object.Job.payBy)
            if (data) data_object.Job.payBy = data.name.replace('\r', '')
        }

        if (data_object.Job && data_object.Job.degree) {
            let data = degree.find(item => item._id == data_object.Job.degree)
            if (data) data_object.Job.degree = data.name.replace('\r', '')
        }

        if (data_object.realEstate && data_object.realEstate.can_ban_mua) {
            let data = can_ban_mua.find(item => item._id == data_object.realEstate.can_ban_mua)
            if (data) data_object.realEstate.can_ban_mua = data.name.replace('\r', '')
        }

        if (data_object.realEstate && data_object.realEstate.giay_to_phap_ly) {
            let data = giay_to_phap_ly.find(item => item._id == data_object.realEstate.giay_to_phap_ly)
            if (data) data_object.realEstate.giay_to_phap_ly = data.name.replace('\r', '')
        }

        if (data_object.realEstate && data_object.realEstate.tinh_trang_noi_that) {
            let data = tinh_trang_noi_that.find(item => item._id == data_object.realEstate.tinh_trang_noi_that)
            if (data) data_object.realEstate.tinh_trang_noi_that = data.name.replace('\r', '')
        }

        if (data_object.realEstate && data_object.realEstate.huong_chinh) {
            let data = huong_chinh.find(item => item._id == data_object.realEstate.huong_chinh)
            if (data) data_object.realEstate.huong_chinh = data.name.replace('\r', '')
        }

        if (data_object.realEstate && data_object.realEstate.huong_ban_cong) {
            let data = huong_ban_cong.find(item => item._id == data_object.realEstate.huong_ban_cong)
            if (data) data_object.realEstate.huong_ban_cong = data.name.replace('\r', '')
        }

        if (data_object.realEstate && data_object.realEstate.loai_hinh_dat) {
            let data = loai_hinh_dat.find(item => item._id == data_object.realEstate.loai_hinh_dat)
            if (data) data_object.realEstate.loai_hinh_dat = data.name.replace('\r', '')
        }

        if (data_object.realEstate && data_object.realEstate.loaihinh_vp) {
            let data = loaihinh_vp.find(item => item._id == data_object.realEstate.loaihinh_vp)
            if (data) data_object.realEstate.loaihinh_vp = data.name.replace('\r', '')
        }

        if (data_object.realEstate && data_object.realEstate.tinh_trang_bds) {
            let data = tinh_trang_bds.find(item => item._id == data_object.realEstate.tinh_trang_bds)
            if (data) data_object.realEstate.tinh_trang_bds = data.name.replace('\r', '')
        }

        if (data_object.realEstate && data_object.realEstate.cangoc) {
            let data = cangoc.find(item => item._id == data_object.realEstate.cangoc)
            if (data) data_object.realEstate.cangoc = data.name.replace('\r', '')
        }

        if (data_object.realEstate && data_object.realEstate.dac_diem) {
            let data = dac_diem.find(item => item._id == data_object.realEstate.dac_diem)
            if (data) data_object.realEstate.dac_diem = data.name.replace('\r', '')
        }

        if (data_object.brand) {
            let data = check.brand.find(item => item._id == data_object.brand)
            if (data) data_object.brand = data.name.replace('\r', '')
        }

        if (data_object.electroniceDevice && data_object.electroniceDevice.machineSeries) {
            let data = check.allType.find(item => item._id == data_object.electroniceDevice.machineSeries)
            if (data) data_object.electroniceDevice.machineSeries = data.name.replace('\r', '')
        }

        if (data_object.vehicle && data_object.vehicle.dong_xe) {
            let checkk = await CateDetail.findOne({ _id: 2 }).lean();
            let data = checkk.allType.find(item => item._id == data_object.vehicle.dong_xe)
            if (data) data_object.vehicle.dong_xe = data.name.replace('\r', '')
        }
        if (data_object.vehicle && data_object.vehicle.loai_xe) {
            let checkk = await CateDetail.findOne({ _id: 2 }).lean();
            let data = checkk.allType.find(item => item._id == data_object.vehicle.loai_xe)
            if (data) data_object.vehicle.loai_xe = data.name.replace('\r', '')
        }

        if (data_object.electroniceDevice && data_object.electroniceDevice.microprocessor) {
            let data = check.processor.find(item => item._id == data_object.electroniceDevice.microprocessor)
            if (data) data_object.electroniceDevice.microprocessor = data.name.replace('\r', '')
        }

        if (data_object.electroniceDevice && data_object.electroniceDevice.ram) {
            let data = check.capacity.find(item => item._id == data_object.electroniceDevice.ram)
            if (data) data_object.electroniceDevice.ram = data.name.replace('\r', '')
        }

        if (data_object.electroniceDevice && data_object.electroniceDevice.hardDrive) {
            let data = check.capacity.find(item => item._id == data_object.electroniceDevice.hardDrive)
            if (data) data_object.electroniceDevice.hardDrive = data.name.replace('\r', '')
        }

        if (data_object.electroniceDevice && data_object.electroniceDevice.screen) {
            let data = check.screen.find(item => item._id == data_object.electroniceDevice.screen)
            if (data) data_object.electroniceDevice.screen = data.name.replace('\r', '')
        }

        if (cate == 36 && data_object.productType) {
            let data = check.allType.find(item => item._id == data_object.productType)
            if (data) data_object.productType = data.name.replace('\r', '')
        }


        if (data_object.electroniceDevice && data_object.electroniceDevice.screen) {
            let data = check.capacity.find(item => item._id == data_object.electroniceDevice.screen)
            if (data) data_object.electroniceDevice.screen = data.name.replace('\r', '')
        }

        if (data_object.electroniceDevice && data_object.electroniceDevice.size) {
            let data = check.screen.find(item => item._id == data_object.electroniceDevice.size)
            if (data) data_object.electroniceDevice.size = data.name.replace('\r', '')
        }

        if (data_object.electroniceDevice && data_object.electroniceDevice.device) {
            let data = check.productGroup.find(item => item._id == data_object.electroniceDevice.device)
            if (data) data_object.electroniceDevice.device = data.name.replace('\r', '')
        }

        if (data_object.warranty) {
            let cate1 = await Category.findById(cate).lean();
            let cate2 = null;
            let cate3;
            if (cate1) {
                if (cate1.parentId !== 0) { cate2 = await Category.findById({ _id: cate1.parentId }).lean(); }
                cate2 ? cate3 = cate2._id : cate3 = cate1._id;
                checkcate = await CateDetail.findOne({ _id: cate3 }).lean();
                let data = checkcate.warranty.find(item => item._id == data_object.warranty)
                if (data) data_object.warranty = data.warrantyTime.replace('\r', '')
            }
        }

        if (cate == 99 && data_object.electroniceDevice && data_object.electroniceDevice.device) {
            let data = check.allType.find(item => item._id == data_object.electroniceDevice.device)
            if (data) data_object.electroniceDevice.device = data.name.replace('\r', '')
        }

        if (cate == 99 && data_object.brand && data_object.electroniceDevice && data_object.electroniceDevice.machineSeries) {
            let brand = check.brand.find(item => item._id == data_object.brand)
            let data = brand.line.find(item => item._id == data_object.electroniceDevice.machineSeries);
            if (data) data_object.electroniceDevice.machineSeries = data.name.replace('\r', '')
        }

        if (data_object.productGroup) {
            let data = check.productGroup.find(item => item._id == data_object.productGroup)
            if (data) data_object.productGroup = data.name.replace('\r', '')
        }

        if (data_object.productType) {
            let data = check.allType.find(item => item._id == data_object.productType)
            if (data) data_object.productType = data.name.replace('\r', '')
        }

        if (data_object.ship && data_object.ship.vehicleType) {
            let data = check.allType.find(item => item._id == data_object.ship.vehicleType)
            if (data) data_object.ship.vehicleType = data.name.replace('\r', '')
        }

        if (data_object.vehicle && data_object.vehicle.hop_so) {
            let data = hop_so.find(item => item._id == data_object.vehicle.hop_so)
            if (data) data_object.vehicle.hop_so = data.name.replace('\r', '')
        }

        if (data_object.vehicle && data_object.vehicle.nhien_lieu) {
            let data = nhien_lieu.find(item => item._id == data_object.vehicle.nhien_lieu)
            if (data) data_object.vehicle.nhien_lieu = data.name.replace('\r', '')
        }

        if (data_object.mon_the_thao) {
            checkcate = await CateDetail.findOne({ _id: 74 }).lean();
            let data = checkcate.find(item => item._id == data_object.mon_the_thao)
            if (data) data_object.mon_the_thao = data.name.replace('\r', '')
        }

        if (data_object.detailCategory) {
            let data = await Tags.findOne({ cateId: data_object.detailCategory }).lean();
            if (data) data_object.detailCategory = data.name.replace('\r', '')
        }

        if (data_object.Job && data_object.Job.jobType) {
            let data = await CateVL.findOne({ _id: data_object.Job.jobType }).lean();
            if (data) data_object.Job.jobType = data.name.replace('\r', '')
        }
        return data_object
    } catch (error) {
        return null
    }
}


// copy folder image
exports.copyFolder = async(imgOld, folderNew) => {
    let fileOld = imgOld.replace(`${process.env.DOMAIN_RAO_NHANH}`, '')
    let folderOld = fileOld.split('/').reverse()[2]
    let id = fileOld.split('/').reverse()[1]
    let fileNew = fileOld.replace(`${folderOld}`, folderNew)
    let path = `../storage/base365/raonhanh365/pictures/${folderNew}/${id}`;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
    fs.copyFile(`../storage/${fileOld}`, `../storage/${fileNew}`, (err) => {
        if (err) {
            console.error(err)
            return false
        }
    });
    return true
}

// send chat
exports.sendChat = async(id_nguoigui, id_nguoinhan, noidung, Link, Type, Title) => {
    let data = new FormData();
    if (!Link) Link = "";
    if (!Type) Type = "text";
    if (!Title) Title = "";
    data.append('UserId', id_nguoinhan);
    data.append('SenderId', id_nguoigui);
    data.append('Message', noidung);
    data.append('Type', Type);
    data.append('Title', Title);
    data.append('Link', Link);

    let checksend = await axios({
        method: "post",
        url: `${process.env.API_SendChat}/api/V2/Notification/SendNewNotification_v2`,
        data
    });

    return true
}

// api check ảnh spam 
exports.checkImageSpam = async(New, userId, listImg, folder) => {
    try {

        let khoAnh = [];

        let data = await New.find({ userID: userId }, { img: 1, buySell: 1, cateID: 1, userID: 1 });

        if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].img) {
                    let img = await this.getLinkFile(data[i].userID, data[i].img, data[i].cateID, data[i].buySell)
                    for (let j = 0; j < img.length; j++) {
                        khoAnh.push(img[j].nameImg)
                    }
                }
            }
        }

        data = [];
        for (let i = 0; i < khoAnh.length; i++) {
            let img = khoAnh[i].split('/').reverse()[0];
            if (!data.find(item => item.split('/').reverse()[0] == img)) data.push(khoAnh[i]);
        }
        let str_new_img = '';
        let str_img = '';

        if (data.length > 0) {
            listImg.split(',').map(item => {
                str_new_img += `${process.env.DOMAIN_RAO_NHANH}/base365/raonhanh365/pictures/${folder}/${userId}/${item}` + ','
            })
        }
        khoAnh.map(item => { str_img += item + ','; });
        str_img = str_img.slice(0, -1);
        str_new_img = str_new_img.slice(0, -1);

        return true
    } catch (error) {
        return null
    }
}

// api check tin spam
exports.checkNewSpam = async(id) => {
    try {
        let data = new FormData();
        data.append('new_id', id);
        await axios({
            method: "post",
            url: `${process.env.API_CHECK_SPAM_RAO_NHANH}/check/spam`,
            data
        });
        return true
    } catch (error) {
        return null
    }
}