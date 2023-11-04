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

// tạo token
const jwt = require('jsonwebtoken');
const Users = require('../../models/Users');

// giới hạn dung lượng video < 100MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
// danh sách các loại video cho phép
const allowedTypes = ['.mp4', '.mov', '.avi', '.wmv', '.flv'];
// giới hạn dung lượng ảnh < 2MB
const MAX_IMG_SIZE = 2 * 1024 * 1024;
// giới hạn dung lượng kho ảnh
exports.MAX_Kho_Anh = 300 * 1024 * 1024;

//gioi han file
const MAX_FILE_SIZE = 20 * 1024 * 1024;

dotenv.config();

const functions = require('../../services/functions');

//QLC
exports.uploadAvaComQLC = async(file, allowedExtensions) => {
    // const namefiles = req.files.name
    let date = new Date();
    let namefile = 'app' + Math.round(date.getTime() / 1000) + "_" + file.name;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let path1 = `../storage/base365/qlc/upload/company/logo/${year}/${month}/${day}/`;
    let filePath = `../storage/base365/qlc/upload/company/logo/${year}/${month}/${day}/` + namefile;
    let fileCheck = path.extname(filePath);
    if (allowedExtensions.includes(fileCheck.toLocaleLowerCase()) === false) {
        return false
    }
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
    return namefile
}
exports.uploadAvaEmpQLC = async(id, file, allowedExtensions) => {
    let namefile = "app_" + file.name;
    let path1 = `../storage/base365/qlc/upload/employee/ep${id}/`;
    let filePath = `../storage/base365/qlc/upload/employee/ep${id}/` + namefile;
    let fileCheck = path.extname(filePath);
    if (allowedExtensions.includes(fileCheck.toLocaleLowerCase()) === false) {
        return false
    }
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
    return namefile
}
exports.uploadErrQLC = async(token, id, file, allowedExtensions) => {
        const paths = (token !== 1 ? "ep_" + id : "com_" + id)
        let namefile = file.name;
        let path1 = `../storage/base365/qlc/upload/error/` + paths + '/';
        let filePath = `../storage/base365/qlc/upload/error/` + paths + '/' + namefile;
        let fileCheck = path.extname(filePath);
        if (allowedExtensions.includes(fileCheck.toLocaleLowerCase()) === false) {
            return false
        }
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
        return namefile
    }
    // hàm tạo link file QLC
exports.createAvatarQLC = (namefiles) => {
    let link = namefiles;
    return link;
}
exports.createLinkFileErrQLC = (token, id, file) => {
    if (file != null && file != '') {
        const paths = (token !== 1 ? "ep_" + id : "com_" + id)
        let link = `${process.env.cdn}/upload/error/${paths}/${file}`;
        return link;
    }
    return "";

}
exports.createLinkFileComQLC = (createAt, file) => {
    if (file != null && file != '') {
        return `${process.env.cdn}/upload/company/logo/${functions.convertDate(createAt,true)}/${file}`;
    } else {
        return "";
    }
}
exports.createLinkFileEmpQLC = (id, file) => {
    if (file != null && file != '') {
        return `${process.env.cdn}/upload/employee/ep${id}/${file}`;
    } else {
        return "";
    }
}

exports.deleteFileQLC = (folder, timestamp, file) => {
    let filePath = `../storage/base365/QLC/upload/${folder}/${timestamp}/` + file;
    fs.unlink(filePath, (err) => {
        if (err) console.log(err);
    });
}