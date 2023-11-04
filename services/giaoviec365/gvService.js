const fs = require('fs');
const user = require('../../models/Users');

// upload file
const multer = require('multer');

// gửi mail
// const nodemailer = require('nodemailer');
// tạo biến môi trường
const dotenv = require('dotenv');
// mã hóa mật khẩu
// const crypto = require('crypto');
// gọi api
// const axios = require('axios');

// check video
// const path = require('path');
//check ảnh
// const { promisify } = require('util');

// tạo token
const jwt = require('jsonwebtoken');

const functions = require('../functions');
// const https = require('https');

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
const TblPhanquyenNew = require('../../models/giaoviec365/tbl_phanquyen_new');
const TblVaitro = require('../../models/giaoviec365/tbl_vaitro');
const ProcessRoleStaffs = require('../../models/giaoviec365/process_role_staffs');
const ProjectRoleStaffs = require('../../models/giaoviec365/project_role_staffs');

exports.createLinkFile = (folder, name) => {
	let link =
		process.env.DOMAIN_GV + '/base365/gv/upload/' + folder + '/' + name;
	return link;
};

exports.deleteFile = (folder, comId, fileName, id) => {
	let filePath =
		`../storage/base365/giaoviec365/${folder}/${comId}/` +
		id +
		'_' +
		(fileName ? fileName : '');
	console.log(filePath);
	if (!fs.existsSync(filePath)) {
		return false;
	} else {
		fs.unlink(filePath, (err) => {
			if (err) return false;
		});
		return true;
	}
};

exports.checkLinkFile = (folder, comId, fileName, id) => {
	let filePath =
		`../storage/base365/giaoviec365/${folder}/${comId}/` +
		id +
		'_' +
		(fileName ? fileName : '');
	if (!fs.existsSync(filePath)) {
		return false;
	} else {
		return filePath;
	}
};

exports.uploadFile = async (folder, comId, file, id) => {
	let path1 = `../storage/base365/giaoviec365/${folder}/${comId}/`;
	let filePath =
		`../storage/base365/giaoviec365/${folder}/${comId}/` +
		id +
		'_' +
		(file.name ? file.name : '');
	if (!fs.existsSync(path1)) {
		fs.mkdirSync(path1, { recursive: true });
	}
	fs.readFile(file.path, (err, data) => {
		if (err) {
			return false;
		}
		fs.writeFile(filePath, data, (err) => {
			if (err) {
				return false;
			}
		});
	});
	return file.name;
};

//lấy các thông tin đăng nhập trả về qua req.infoLogin
exports.checkRoleUser = (req, res, next) => {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		if (!token) {
			return res.status(401).json({ message: 'Missing token' });
		}
		jwt.verify(token, process.env.NODE_SERCET, (err, user) => {
			if (err) {
				return res.status(403).json({ message: 'Invalid token' });
			}
			if (
				!user.data ||
				!user.data.type ||
				!user.data.idQLC ||
				!user.data.userName
			) {
				return res.status(404).json({ message: 'Token missing info!' });
			}
			var infoLogin = {
				type: user.data.type,
				id: user.data.idQLC,
				name: user.data.userName,
			};
			if (user.data.type != 1) {
				if (user.data && user.data.com_id) {
					infoLogin.comId = user.data.com_id;
				} else if (
					user.data.inForPerson &&
					user.data.inForPerson.employee &&
					user.data.inForPerson.employee.com_id
				) {
					infoLogin.comId = user.data.inForPerson.employee.com_id;
				} else {
					return res.status(404).json({ message: 'Missing info inForPerson!' });
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
};

//lay ra vaitro_id cua nguoi dung la nhan hay quan ly
exports.checkRoleQLOrNV = async (id) => {
	//check is manager or employee
	const checkRoleStaff = await TblPhanquyenNew.findOne({
		id_user: id,
	});
	let role = checkRoleStaff['vaitro_id'];
	if (role == '') role = 2;
	return role;
};

// danh  sach vai tro lay quan ly hay nhan vien va cong ty
exports.listRole = async (role_id, com_id) => {
	const roleStaff = await TblVaitro.findOne({
		$and: [{ id: role_id }, { $or: [{ com_id: com_id }, { com_id: '' }] }],
	});
	return roleStaff;
};

// danh  sach vai tro cua quy trinh lay quan ly hay nhan vien va cong ty
exports.listRoleProcess = async (role_id, com_id) => {
	const roleProcess = await ProcessRoleStaffs.findOne({
		role_id: role_id,
		com_id: com_id,
	});
	return roleProcess;
};

// danh  sach vai tro cua du an lay quan ly hay nhan vien va cong ty
exports.listRoleProject = async (role_id, com_id) => {
	const roleProject = await ProjectRoleStaffs.findOne({
		com_id,
		role_id,
	});
	return roleProject;
};

exports.checkDue = (date, time, comparison) => {
	const currentTimestamp = Date.now();
	const timeStart = date + ' ' + time;
	const timeLimitStart = new Date(timeStart).getTime();
	if (comparison == '<') {
		return timeLimitStart < currentTimestamp;
	} else if (comparison == '>') {
		return timeLimitStart > currentTimestamp;
	} else {
		return false;
	}
};

exports.checkTokenCompany = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) {
		return res.status(401).json({ message: 'Missing token' });
	}
	jwt.verify(token, process.env.NODE_SERCET, (err, user) => {
		if (err) {
			return res.status(403).json({ message: 'Invalid token' });
		}
		if (user.data.role !== 0) {
			if (user.data.inForPerson.employee.com_id) {
				req.comId = user.data.inForPerson.employee.com_id;
				next();
			} else {
				return res.status(403).json({ message: 'không tìm thấy id company' });
			}
		} else {
			return res
				.status(403)
				.json({ message: 'bạn không có quyền truy cập tính năng này' });
		}
	});
};

exports.m_check_ip = () => {
	if (document.cookie.includes('acc_token')) {
		const token = document.cookie.match(/acc_token=([^;]+)/)[1];
		//get ip from client
		const ip = async () => {
			const response = await fetch('https://api.ipify.org?format=json');
			const data = await response.json();
			return data.ip;
		};
		ip().then((clientIP) => {
			// send request to check ip
			fetch('https://chamcong.24hpay.vn/service/check_ip_access.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + token,
				},
				body: JSON.stringify({ from: 'giaoviec365', ip: clientIP }),
			})
				.then((response) => response.text())
				.then((response) => {
					if (response === '0') {
						// Nếu phản hồi là 0, chuyển hướng đến trang lỗi
						window.location.href =
							'https://quanlychung.timviec365.vn/loi-truy-cap.html';
					}
				})
				.catch((error) => console.error('Lỗi trong quá trình yêu cầu:', error));
		});
	}
};

exports.getListEmployee = (off_set, rowPerPage) => {
	const infoLogin = this.m_checkInfoLogin();
	const access_token = infoLogin['token'];
	const header = {
		Authorization: access_token,
		'User-Agent': 'giaoviec',
	};
	const com_id = infoLogin['com_id'];
	const url =
		'https://chamcong.24hpay.vn/service/get_list_employee_from_company.php?filter_by[active]=true&off_set=' +
		off_set +
		'&length=' +
		rowPerPage +
		'&id_com=' +
		com_id;
	fetch(url, {
		method: 'GET',
		headers: header,
		agent: new (require('https').Agent)({
			rejectUnauthorized: false, //bỏ kiểm SSL
		}),
		l,
	});
};

exports.checkInfoLogin = () => {
	let info_login;
	if (sessionStorage.getItem('company')) {
		info_login = sessionStorage.getItem('company');
	} else if (sessionStorage.getItem('employee')) {
		info_login = sessionStorage.getItem('employee');
	}
	console.log(info_login);
	return info_login;
};

exports.m_checkInfoLogin = () => {
	let info_login = null;
	if (sessionStorage.getItem('company')) {
		info_login = JSON.parse(sessionStorage.getItem('company'));
	} else if (sessionStorage.getItem('employee')) {
		info_login = JSON.parse(sessionStorage.getItem('employee'));
	}

	let id = '';
	let login_type = '';
	let token = '';
	let name = '';
	// let com_name = '';
	let com_id = '';
	let id_nv = '';

	if (info_login) {
		id = info_login.id;
		login_type = info_login.type;
		token = info_login.token;

		if (login_type == 1) {
			name = info_login.name;
			com_id = id;
		} else {
			name = info_login.name;
			// com_name = info_login.com_name;
			com_id = info_login.com_id;
			id_nv = info_login.id;
		}
	}

	return {
		login_type: login_type,
		id_nv: id_nv,
		token: token,
		id: id,
		com_id: com_id,
		name: name,
	};
};

// exports.getListAllEmployee = () => {
// 	const infoLogin = this.checkInfoLogin();
// 	const access_token = infoLogin['token'];
// 	const header = {
// 		Authorization: access_token,
// 		'User-Agent': 'giaoviec',
// 	};
// 	const id_com = infoLogin['com_id'];
// 	const url =
// 		'https://chamcong.24hpay.vn/service/list_all_employee_of_company.php?filter_by[active]=true&id_com=' +
// 		id_com;
// 	fetch(url, {
// 		method: 'GET',
// 		headers: header,
// 		agent: new (require('https').Agent)({
// 			rejectUnauthorized: false, //bỏ kiểm SSL
// 		}),
// 	})
// 		.then((response) => response.json())
// 		.then((data) => {
// 			return data;
// 		})
// 		.catch((error) => {
// 			console.error('Lỗi truy vấn', error);
// 		});
// };

//list by group
exports.showNestByIdDep = (com_id) => {
	if (com_id == 0) {
		return {
			result: false,
		};
	} else {
		const url =
			'https://chamcong.24hpay.vn/service/detail_company.php?id_com=' + com_id;
		fetch(url, {
			method: 'GET',
			headers: {
				'User-Agent': 'https://phanmemnhansu.timviec365.vn/',
			},
			agent: new (require('https').Agent)({
				rejectUnauthorized: false, //bỏ kiểm SSL
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				return data;
			})
			.catch((error) => {
				console.error('Lỗi truy vấn:', error);
			});
	}
};

exports.findByName = async (page, model, field, keyword, object = {}) => {
	if(page === -1){
		return await model.find({
			...object,
			[field]: {$regex: keyword, $options: 'i'}
		}).lean()
	}else {
		return await model.find({
			...object,
			[field]: {$regex: keyword, $options: 'i'}
		}).skip(10*page - 10).limit(10).lean()
	}
}

exports.pathFolderMeeting = async (req, res, next) => {
	req.params.folder = 'Meeting'
	next()
}

exports.pathFolderJob = async (req, res, next) => {
	req.params.folder = 'Job'
	next()
}

exports.pathFolderProject = async (req, res, next) => {
	req.params.folder = 'Project'
	next()
}