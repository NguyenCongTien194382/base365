const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
const dotenv = require("dotenv");
// const AdminUser = require("../models/AdminUser");
const AdminUser = require("../models/Timviec365/Admin/AdminUser");
const functions = require("../services/functions");
dotenv.config();

exports.checkToken = (req, res, next) => {
    const token = req.headers["access-token"];
    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }
    jwt.verify(token, process.env.NODE_SERCET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.userId = decoded.data._id;
        next();
    });
};

exports.isCompany = (req, res, next) => {
    let userId = req.userId;
    const company = Users.find({ idQLC: userId });
    if (company) {
        next();
        return;
    }
    return res.status(403).json({ message: "is not company" });
}

exports.isAdmin = async (req, res, next) => {
    let userId = req.userId;
    let admin = await functions.getDatafindOne(AdminUser, { _id: userId });
    if (admin) return next();
    return res.status(403).json({ message: "is not admin" });
}

exports.checkUserRole = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const admin = await AdminUser.findOne({ adm_id: userId, adm_isadmin: 1 });
        if (admin) {
            // Nếu là admin, chuyển hướng đến getAllRoles
            req.isAdmin = true; // Thêm một thuộc tính isAdmin vào request
        } else {
            // Nếu không phải admin, không cần làm gì cả
            req.isAdmin = false; // Thêm một thuộc tính isAdmin vào request
        }
        // Sau đó gọi next() để chuyển hướng đến tầng xử lý tiếp theo
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

