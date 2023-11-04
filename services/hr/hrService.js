// check ảnh và video
const fs = require('fs');
const PerUser = require('../../models/hr/PerUsers');
const Users = require('../../models/Users');
const CC365_TimeSheet = require('../../models/qlc/TimeSheets');
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

// tạo token
const jwt = require('jsonwebtoken');

const functions = require('../functions')
const https = require('https');

// giới hạn dung lượng video < 100MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
// danh sách các loại video cho phép
const allowedTypes = ['.mp4', '.mov', '.avi', '.wmv', '.flv'];
// giới hạn dung lượng ảnh < 2MB
const MAX_IMG_SIZE = 2 * 1024 * 1024;
// giới hạn dung lượng kho ảnh
exports.MAX_Kho_Anh = 300 * 1024 * 1024;
// giới hạn dung luong file < 2MB
const MAX_FILE_SIZE = 20 * 1024 * 1024;

dotenv.config();
const PermissionUser = require('../../models/hr/PermisionUser');

exports.HR_CheckTokenCompany = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }
    jwt.verify(token, process.env.NODE_SERCET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        if (user.data.role !== 0) {
            if (user.data.inForPerson.employee.com_id) {
                req.comId = user.data.inForPerson.employee.com_id;
                next();
            } else {
                return res.status(403).json({ message: "không tìm thấy id company" });
            }
        } else {
            return res.status(403).json({ message: "bạn không có quyền truy cập tính năng này" });
        }

    });
}

exports.HR_UploadFile = async(folder, id, file, allowedExtensions) => {

    let path1 = `../storage/base365/hr/${folder}/${id}/`;
    let filePath = `../storage/base365/hr/${folder}/${id}/` + file.name;

    let fileCheck = path.extname(filePath);
    if (allowedExtensions.includes(fileCheck.toLocaleLowerCase()) === false) {
        return false
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

exports.createLinkFileHR = (folder, id, name) => {
    let link = process.env.DOMAIN_RAO_NHANH + '/base365/hr/' + folder + '/' + id + '/' + name;
    return link;
}
exports.deleteFileHR = (folder, id, file) => {
    let filePath = '../storage/base365/hr/' + folder + '/' + id + '/' + file;
    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
    });
}

exports.checkPermissions = async(req, res, next, per, bar) => {
        //1. Quản lý tuyển dụng, 2. Quản lý thông tin nhân sự, 3. Thành tích - Vi phạm,5. Báo cáo nhân sự, 6. Dữ liệu đã xóa gần đây, 7. Tăng/giảm lương
        if (per === 'read') {
            per = 1
        } else if (per === 'create') {
            per = 2
        } else if (per === 'update') {
            per = 3
        } else if (per === 'delete') {
            per = 4
        }
        if (req.user.data.type === 0) {
            return functions.setError(res, 'Unauthorized', 401)
        }
        if (req.user.data.type === 2) {
            let check = await PerUser.findOne({ userId: req.user.data.idQLC, perId: per, barId: bar })
            if (!check) {
                return functions.setError(res, 'Unauthorized', 401)
            }
        }
    }
    // hàm check định dạng ảnh
let checkFile = async(filePath) => {
    const extname = path.extname(filePath).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.pdf', '.doc', '.docx', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'ods', 'odt', 'odp', 'rtf', 'sxc', 'sxi', 'txt'].includes(extname);
};

exports.createLinkFile = (folder, name) => {
    let link = process.env.DOMAIN_HR + '/base365/hr/upload/' + folder + '/' + name;
    return link;
}

exports.uploadFile = async(folder, id, file) => {
    let path1 = `../storage/base365/hr/${folder}/${id}/`;
    let filePath = `../storage/base365/hr/${folder}/${id}/` + file.name;
    if (!fs.existsSync(path1)) {
        fs.mkdirSync(path1, { recursive: true });
    }
    fs.readFile(file.path, (err, data) => {
        if (err) {
            console.log(err)
        }
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.log(err)
            }
        });
    });
    return true
}

exports.uploadFileCv = async(id, file) => {
    let random = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    let fileExtension = file.originalFilename.split('.').pop();
    let name = `cv_${random}.${fileExtension}`
    let filePath = `../storage/base365/hr/upload/cv/${id}/`;
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
    fs.readFile(file.path, (err, data) => {
        if (err) {
            console.log(err)
        }
        fs.writeFile(filePath + name, data, (err) => {
            if (err) {
                console.log(err)
            }
        });
    });
    return name;
}

exports.uploadFileSignature = async(file) => {
    let random = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    let fileExtension = file.originalFilename.split('.').pop();
    let name = `signature_${random}.${fileExtension}`
    let filePath = `../storage/base365/hr/upload/signature/`;
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
    fs.readFile(file.path, (err, data) => {
        if (err) {
            console.log(err)
        }
        fs.writeFile(filePath + name, data, (err) => {
            if (err) {
                console.log(err)
            }
        });
    });
    return name;
}

exports.uploadFileRoadMap = async(id, file) => {
    let random = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    let fileExtension = file.originalFilename.split('.').pop();
    let name = `roadmap_${random}.${fileExtension}`
    let filePath = `../storage/base365/hr/upload/roadmap/${id}/`;
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
    fs.readFile(file.path, (err, data) => {
        if (err) {
            console.log(err)
        }
        fs.writeFile(filePath + name, data, (err) => {
            if (err) {
                console.log(err)
            }
        });
    });
    return name;
}

exports.uploadFileNameRandom = async(folder, file) => {
    let random = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    let fileExtension = file.originalFilename.split('.').pop();
    let name = `${folder}_${random}.${fileExtension}`
    let filePath = `../storage/base365/hr/upload/${folder}/`;
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
    fs.readFile(file.path, (err, data) => {
        if (err) {
            console.log(err)
        }
        fs.writeFile(filePath + name, data, (err) => {
            if (err) {
                console.log(err)
            }
        });
    });
    return name;
}


exports.createLinkFileCv = async(folder, id, name) => {
    let link = process.env.DOMAIN_HR + '/base365/hr/' + folder + '/' + id + '/' + name;
    return link;
}

exports.deleteFileCv = (id) => {
    let filePath = '../storage/hr/upload/cv' + '/' + id;
    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
    });
}


exports.uploadFileBase64 = async(folder, id, base64String, file) => {
    let path1 = `../storage/base365/hr/pictures/${folder}/${id}/`;
    // let filePath = `../Storage/base365/raonhanh365/pictures/${folder}/${id}/` + file.name;
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

exports.getMaxId = async(model) => {
    let maxId = await model.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
    if (maxId) {
        maxId = Number(maxId.id) + 1;
    } else maxId = 1;
    return maxId;
}
exports.titleToSlug = title => {
    let slug;

    // convert to lower case
    slug = title.toLowerCase();

    //
    slug = toLowerCaseNonAccentVietnamese(slug);

    // remove special characters
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    // The /gi modifier is used to do a case insensitive search of all occurrences of a regular expression in a string

    // replace spaces with dash symbols
    slug = slug.replace(/ /gi, "-");

    // remove consecutive dash symbols 
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');

    // remove the unwanted dash symbols at the beginning and the end of the slug
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    return slug;
};

let toLowerCaseNonAccentVietnamese = (str) => {
    str = str.toLowerCase();
    //     We can also use this instead of from line 11 to line 17
    //     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
    //     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
    //     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
    //     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
    //     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
    //     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
    //     str = str.replace(/\u0111/g, "d");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}

// hàm check ảnh
exports.checkFile = async(filePath) => {
    if (typeof(filePath) !== 'string') {
        return false;
    }

    const { size } = await promisify(fs.stat)(filePath);
    if (size > MAX_FILE_SIZE) {
        return false;
    }

    const isFile = await checkFile(filePath);
    if (!isFile) {
        return false;
    }

    return true;
};

exports.checkRoleUser = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Missing token" });
        }
        jwt.verify(token, process.env.NODE_SERCET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }
            if (!user.data || !user.data.type || !user.data.idQLC || !user.data.userName) {
                return res.status(404).json({ message: "Token missing info!" });
            }
            var infoLogin = { type: user.data.type, id: user.data.idQLC, name: user.data.userName };
            if (user.data.type != 1) {
                if (user.data && user.data.com_id) {
                    infoLogin.comId = user.data.com_id;
                } else if (user.data.inForPerson && user.data.inForPerson.employee && user.data.inForPerson.employee.com_id) {
                    infoLogin.comId = user.data.inForPerson.employee.com_id;
                } else {
                    return res.status(404).json({ message: "Missing info inForPerson!" });
                }

            } else {
                infoLogin.comId = user.data.idQLC;
            }
            req.infoLogin = infoLogin;
            next();
        });
    } catch (err) {
        return functions.setError(res, err.massage, 500);
    }

}

exports.checkRole = async(infoLogin, barId, perId) => {
    if (infoLogin.type == 1) return true;
    let permission = await PermissionUser.findOne({ userId: infoLogin.id, barId: barId, perId: perId });
    // console.log(permission);
    if (permission) return true;
    return false;
}

exports.checkRight = (barId, perId) => {
    return async(req, res, next) => {
        let infoLogin = req.infoLogin;
        if (infoLogin.type == 1) return next();
        let checkDirector = await Users.findOne({
            idQLC: infoLogin.id,
            type: { $ne: 1 },
            'inForPerson.employee.position_id': { $in: [7, 8, 14, 16, 21, 22] }
        });
        if (checkDirector) return next();
        let permission = await PermissionUser.findOne({ userId: infoLogin.id, barId: barId, perId: perId });
        if (permission) return next();
        return functions.setError(res, "no right", 403);
    };
};

exports.checkIsInteger = (data) => {

    for (let i = 0; i < data.length; i++) {
        if (isNaN(data[i])) {
            return false;
        }
        var x = parseFloat(data[i]);
        return (x | 0) === x;
    }
    return true;
}

exports.sendChat = async(id_user, status, ep_id, new_com_id, new_update_position, new_update_dep_id, created_at, type) => {

    const data = {
        SenderId: id_user,
        Status: status,
        EmployeeId: ep_id,
        ListReceive: '[' + ep_id + ']',
        NewCompanyId: new_com_id,
        Position: new_update_position,
        Department: new_update_dep_id,
        CreateAt: created_at,
        // Type: 'Appoint',
        Type: type,
        CompanyId: new_com_id,
    };

    axios.post('https://mess.timviec365.vn/Notification/NotificationPersonnelChange', data)
        .then(response => {
            // Xử lý phản hồi thành công
            console.log(response.data);
        })
        .catch(error => {
            // Xử lý lỗi
            console.error(error);
        });
}

exports.sendChat2 = async(to, subject, content, url) => {
    try {
        const data = {
            SenderId: id_user,
            Status: status,
            EmployeeId: ep_id,
            ListReceive: '[' + ep_id + ']',
            NewCompanyId: new_com_id,
            Position: new_update_position,
            Department: new_update_dep_id,
            CreateAt: created_at,
            // Type: 'Appoint',
            Type: type,
            CompanyId: new_com_id,
        };
        axios.post(url, data)
            .then(response => {
                // Xử lý phản hồi thành công
                console.log(response.data);
            })
            .catch(error => {
                // Xử lý lỗi
                console.error(error);
            });
    } catch (e) {
        console.log(e);
    }
}

const storageFile = (destination) => {
    return multer.diskStorage({
        destination: function(req, file, cb) {
            let userDestination = " "
            if (req.user) {
                req.user.data._id; // Lấy id người dùng từ request
                const d = new Date(),
                    day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate(),
                    month = d.getMonth() < 10 ? "0" + Number(d.getMonth() + 1) : d.getMonth(),
                    year = d.getFullYear();
                userDestination = `${destination}`; // Tạo đường dẫn đến thư mục của người dùng

                if (!fs.existsSync(userDestination)) { // Nếu thư mục chưa tồn tại thì tạo mới
                    fs.mkdirSync(userDestination, { recursive: true });
                }
            } else {
                userDestination = 'public/company'
                if (!fs.existsSync(userDestination)) { // Nếu thư mục chưa tồn tại thì tạo mới
                    fs.mkdirSync(userDestination, { recursive: true });
                }
            }
            cb(null, userDestination);
        },
        filename: function(req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
        },
        fileFilter: function(req, file, cb) {
            // const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm', 'video/quicktime'];
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Only .jpeg, .png, .jpg format allowed!'));
            }
        }
    });
};
//hàm upload file ứng viên
exports.uploadSignature = multer({ storage: storageFile('../storage/hr/upload/signature') })

// hàm cấu hình mail
const transport = nodemailer.createTransport({
    host: process.env.NODE_MAILER_HOST,
    port: Number(process.env.NODE_MAILER_PORT),
    service: process.env.NODE_MAILER_SERVICE,
    secure: true,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
});

exports.sendEmailtoCandidate = async(email, subject, data) => {
    let options = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: subject,
        html: data
    }
    transport.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' + info.response);
        }
    })
};

exports.getLinkFile = async(data, folder, id) => {
    if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].file) {
                data[i].file = process.env.DOMAIN_HR + '/base365/hr/' + folder + '/' + id + '/' + data[i].file;
            }
        }
    }
    return data
}

const positionNames = {
    19: 'Chủ tịch hội đồng quản trị',
    18: 'Phó chủ tịch hội đồng quản trị',
    17: 'Thành viên hội đồng quản trị',
    21: 'Tổng giám đốc tập đoàn',
    22: 'Phó tổng giám đốc tập đoàn',
    16: 'Tổng giám đốc',
    14: 'Phó tổng giám đốc',
    8: 'Giám đốc',
    7: 'Phó giám đốc',
    6: 'Trưởng phòng',
    5: 'Phó trưởng phòng',
    13: 'Tổ trưởng',
    12: 'Phó tổ trưởng',
    4: 'Trưởng nhóm',
    20: 'Nhóm Phó',
    11: 'Trưởng ban dự án',
    10: 'Phó ban dự án',
    3: 'Nhân viên chính thức',
    2: 'Nhân viên thử việc',
    9: 'Nhân viên Part time',
    1: 'Sinh viên thực tập'
};

exports.positionNames = positionNames;

exports.thoigian = (from_date, to_date, type) => {
    if (!to_date) {
        to_date = new Date()
    } else {
        to_date = new Date(to_date)
    }
    if (type === 3 && !from_date) from_date = new Date(to_date.getTime() - 15 * 24 * 60 * 60 * 1000)

    let songay = 0;
    let from = new Date(from_date).getTime();
    let to = new Date(to_date).getTime();
    if (type === 3) {
        songay = (to - from) / (1000 * 60 * 60 * 24);
    } else if (type === 2) {
        songay = (to - from) / (1000 * 60 * 60 * 24 * 30);
    } else {
        songay = (to - from) / (1000 * 60 * 60 * 24 * 365);
    }
    return songay
}

// hàm khi thành công
exports.success = (res, messsage = "", data = []) => {
    return res.status(200).json({ result: true, code: 200, success: { data, message: messsage, }, error: null, })
};

// hàm thực thi khi thất bại
exports.setError = (res, message, code = 500) => {
    return res.status(code).json({ result: false, code, success: null, error: { message } })
};

// hàm chuyển giờ
exports.getTime = async(time) => {
    try {
        let date = new Date(time).toISOString().split('T')[0];
        date = date + ' ' + time.getHours().toString() + ':' + time.getMinutes().toString() + ':' + time.getSeconds().toString();
        return date
    } catch (error) {
        return null
    }
}

// chuyển ngày tháng năm
exports.getDate = async(time) => {
    try {
        let date = new Date(time).toISOString().split('T')[0];
        return date
    } catch (error) {
        return null
    }
}

// get link
exports.getLinkCv = async(file) => {
    try {
        let cv = process.env.DOMAIN_HR + '/base365/hr/upload' + file;
        return cv
    } catch {
        return null
    }
}

exports.listEmployeeTimekeepers = async(com_id) => {
    const today = new Date().toISOString().slice(0, 10);
    const check_time_now = new Date();
    const time_k1_start = new Date(`${today} 00:00:00`);
    const time_k1_end = new Date(`${today} 13:00:00`);

    let condition_sheet_total = {
        ts_com_id: com_id,
        is_success: 1,
    };

    if (time_k1_start < check_time_now && check_time_now < time_k1_end) {
        condition_sheet_total.at_time = { $gt: new Date(`${today} 00:00:00`), $lt: new Date(`${today} 23:59:59`) }
    } else {
        condition_sheet_total.at_time = { $gt: new Date(`${today} 13:00:00`), $lt: new Date(`${today} 23:59:59`) }
    }

    const qr_sheet_total = await CC365_TimeSheet.aggregate([
        { $match: condition_sheet_total },
        {
            $group: {
                _id: "$ep_id"
            }
        },
        {
            $lookup: {
                from: "Users",
                localField: "_id",
                foreignField: "idQLC",
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $match: {
                "user.type": 2,
                'user.inForPerson.employee.ep_status': "Active"
            }
        },
        {
            $project: {
                ep_id: "$_id",
                inForPerson: "$user.inForPerson"
            }
        }
    ]);

    return qr_sheet_total;
}