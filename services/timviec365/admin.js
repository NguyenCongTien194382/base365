const functions = require("../functions");
const Users = require('../../models/Users');
const multer = require('multer')
const fs = require('fs');
exports.removeAccent = async(title) => {
    var fromChars = "áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ";
    var toChars = "aaaaaaaaaaaaaaaaadeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyy";

    for (var i = 0; i < fromChars.length; i++) {
        title = title.replace(new RegExp(fromChars.charAt(i), "g"), toChars.charAt(i));
    }

    return title;
}

exports.replaceTitle = async(title) => {
    title = await exports.removeAccent(title);
    var arrStr = ["&lt;", "&gt;", "/", "\\", "&apos;", "&quot;", "&amp;", "lt;", "gt;", "apos;", "quot;", "amp;", "&lt", "&gt", "&apos", "&quot", "&amp", "&#34;", "&#39;", "&#38;", "&#60;", "&#62;"];
    title = title.replace(new RegExp(arrStr.join("|"), "g"), " ");
    title = title.replace(/[^0-9a-zA-Z\s]+/g, " ");
    title = title.replace(/ {2,}/g, " ");
    title = title.trim().replace(/ /g, "-");
    title = encodeURIComponent(title);
    var arrayAfter = ["%0D%0A", "%", "&"];
    title = title.replace(new RegExp(arrayAfter.join("|"), "g"), "-");
    title = title.toLowerCase();
    return title;
}

const storageMain = (destination) => {
    return multer.diskStorage({
        destination: async function(req, file, cb) {
            let idTimViec365 = req.body.idTimViec365
            let findUser = await Users.findOne({ idTimViec365 })
            const userId = findUser._id; // Lấy id người dùng từ request
            let userDestination
            if (file.fieldname === 'avatarUser') {
                userDestination = `${destination}/uv/${userId}`; // Tạo đường dẫn đến thư mục của người dùng
            } else if (file.fieldname === 'cv') {
                userDestination = `${destination}/cv/${userId}`; // Tạo đường dẫn đến thư mục của người dùng
            }
            if (!fs.existsSync(userDestination)) { // Nếu thư mục chưa tồn tại thì tạo mới
                fs.mkdirSync(userDestination, { recursive: true });
            }
            cb(null, userDestination);
        },
        filename: function(req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

            cb(null, file.fieldname + uniqueSuffix + '.' + file.originalname.split('.').pop())
        }
    })
};
//hàm upload file ứng viên
exports.uploadFileUv = multer({ storage: storageMain('../storage/base365/timviec365/pictures') });


const storageFileLogoNTD = (destination) => {
    return multer.diskStorage({
        destination: async function(req, file, cb) {
            let userDestination = " "
            var getMaxUserID = await functions.getMaxUserID();
            var getMaxUserID = getMaxUserID._id;

            userDestination = `${destination}/logo/${getMaxUserID}`; // Tạo đường dẫn đến thư mục của người dùng
            if (!fs.existsSync(userDestination)) { // Nếu thư mục chưa tồn tại thì tạo mới
                fs.mkdirSync(userDestination, { recursive: true });
            }
            cb(null, userDestination);
        },
        fileFilter: function(req, file, cb) {
            const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm', 'video/quicktime'];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Only .jpeg, .png, .mp4, .webm and .mov format allowed!'));
            }
        },
        filename: function(req, file, cb) {
            const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9)

            cb(null, file.fieldname + '_' + uniqueSuffix + '.' + file.originalname.split('.').pop())
        }
    });
};

const storageInsertXlsx = (destination) => {
    return multer.diskStorage({
        destination: async function(req, file, cb) {

            let userDestination

            if (file.fieldname === 'fileXlsx') {
                userDestination = `${destination}/xlsx`;
            }
            if (!fs.existsSync(userDestination)) { // Nếu thư mục chưa tồn tại thì tạo mới
                fs.mkdirSync(userDestination, { recursive: true });
            }
            cb(null, userDestination);
        },
        filename: function(req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

            cb(null, file.fieldname + uniqueSuffix + '.' + file.originalname.split('.').pop())
        }
    })
};

//hàm upload file ảnh logo nhà tuyển dụng mới
exports.uploadFileLogoNTD = multer({ storage: storageFileLogoNTD('../storage/base365/timviec365/ntd') });

const storageInsert = (destination) => {
    return multer.diskStorage({
        destination: async function(req, file, cb) {
            const getMaxIdChat = await Users.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean()
            const userId = getMaxIdChat._id; // Lấy id người dùng từ request
            let userDestination
            if (file.fieldname === 'avatarUser') {
                userDestination = `${destination}/uv/${userId}`; // Tạo đường dẫn đến thư mục của người dùng
            } else if (file.fieldname === 'cv') {
                userDestination = `${destination}/cv/${userId}`; // Tạo đường dẫn đến thư mục của người dùng
            }
            if (!fs.existsSync(userDestination)) { // Nếu thư mục chưa tồn tại thì tạo mới
                fs.mkdirSync(userDestination, { recursive: true });
            }
            cb(null, userDestination);
        },
        filename: function(req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

            cb(null, file.fieldname + uniqueSuffix + '.' + file.originalname.split('.').pop())
        }
    })
};

exports.uploadFileUvInsert = multer({ storage: storageInsert('../storage/base365/timviec365/pictures') });
//hàm upload file ứng viên site vệ tinh
exports.uploadFileXlsx = multer({ storage: storageInsertXlsx('../storage/base365/timviec365') });