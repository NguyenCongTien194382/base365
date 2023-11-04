var express = require('express');
var router = express.Router();
var company = require('../../controllers/timviec/company');
var newTV365 = require('../../controllers/timviec/newTV365');
var service = require('../../services/timviec365/company');
var formData = require('express-form-data');
const functions = require('../../services/functions');

// api check email đã được đăng ký hay chưa
router.post('/checkExistEmail', formData.parse(), company.checkExistEmail);

// api check tên công ty đã được đăng ký hay chưa
router.post('/checkExistName', formData.parse(), company.checkExistName);

// api đăng ký
router.post('/register', formData.parse(), company.register);

// api đăng nhập
router.post('/login', formData.parse(), company.login);

// api đăng ký khi thiếu dữ liệu
router.post('/registerfall', formData.parse(), company.registerFall);

// api gửi mã OTP qua gmail để xác minh tài khoản
router.post('/sendOTP', formData.parse(), company.sendOTP);

// api xác nhận OTP để xác minh tai khoản
router.post(
    '/verify',
    formData.parse(),
    functions.checkToken,
    newTV365.verifyNew,
    company.verify
);

// api api gửi mã OTP qua appChat (quên mật khẩu)
router.post(
    '/forgotPasswordCheckMail',
    formData.parse(),
    company.forgotPasswordCheckMail
);

// api check mã OTP đẻ (quên mật khẩu)
router.post(
    '/forgotPasswordCheckOTP',
    formData.parse(),
    company.forgotPasswordCheckOTP
);

// api đổi mật khẩu (quên mật khẩu)
router.post(
    '/updatePassword',
    formData.parse(),
    functions.checkToken,
    company.updatePassword
);

// api cập nhập thông tin nhà tuyển dụng
router.post(
    '/updateInfor',
    formData.parse(),
    functions.checkToken,
    company.updateInfor
);

// api cập nhập thông tin liên hệ nhà tuyển dụng
router.post(
    '/updateContactInfor',
    formData.parse(),
    functions.checkToken,
    company.updateContactInfo
);

// api cập nhập video hoặc link video nhà tuyển dụng
router.post(
    '/updateVideoOrLink',
    functions.checkToken,
    formData.parse(),
    company.updateVideoOrLink
);

// api gửi mã OTP qua appChat (dổi mật khẩu)
router.post(
    '/changePasswordSendOTP',
    functions.checkToken,
    company.changePasswordSendOTP
);

// api check mã OTP (đổi mật khẩu)
router.post(
    '/changePasswordCheckOTP',
    formData.parse(),
    functions.checkToken,
    company.changePasswordCheckOTP
);

// api đổi mật khẩu (đổi mật khẩu )
router.post(
    '/changePassword',
    formData.parse(),
    functions.checkToken,
    company.changePassword
);

// api cập nhập ảnh đại diện
router.post(
    '/uploadAvatar',
    functions.checkToken,
    formData.parse(),
    company.uploadAvatar
);

//api lấy dữ liệu nhà tuyển dụng
router.get('/getDataCompany', functions.checkToken, company.getDataCompany);

// api lấy danh sach UV
router.post(
    '/listUVApplyJob',
    formData.parse(),
    functions.checkToken,
    company.listUVApplyJob
);

// api lấy danh sach UV do chuyên viên gửi
router.post(
    '/listUVApplyJobStaff',
    formData.parse(),
    functions.checkToken,
    company.listUVApplyJobStaff
);

//api thống kê tin đăng
router.get('/postStatistics', functions.checkToken, company.postStatistics);

//api lấy danh sách lưu UV
router.post(
    '/listSaveUV',
    formData.parse(),
    functions.checkToken,
    company.listSaveUV
);

//api quản lý lọc điểm
router.get(
    '/manageFilterPoint',
    formData.parse(),
    functions.checkToken,
    company.manageFilterPoint
);

//api xem điểm uv
router.post(
    '/seenUVWithPoint',
    formData.parse(),
    functions.checkToken,
    company.seenUVWithPoint
);
router.post(
    '/seenUVWithPointV2',
    formData.parse(),
    functions.checkToken,
    company.seenUVWithPointV2
);

//api đánh giá ctv
router.post(
    '/submitFeedbackCtv',
    formData.parse(),
    functions.checkToken,
    company.submitFeedbackCtv
);

//api đánh giá web
router.post(
    '/submitFeedbackWeb',
    formData.parse(),
    functions.checkToken,
    company.submitFeedbackWeb
);

//api lấy ra dữ liệu kho ảnh
router.post(
    '/displayImages',
    formData.parse(),
    functions.checkToken,
    company.displayImages
);

//api upload ảnh trong kho ảnh
router.post(
    '/uploadImg',
    functions.checkToken,
    functions.uploadImgKhoAnh.array('comImages'),
    company.uploadImg
);

//api upload video trong kho ảnh
router.post(
    '/uploadVideo',
    functions.checkToken,
    functions.uploadVideoKhoAnh.array('comVideos'),
    company.uploadVideo
);

//api xóa ảnh trong kho ảnh
router.post(
    '/deleteImg',
    functions.checkToken,
    formData.parse(),
    company.deleteImg
);

//api xóa video trong kho ảnh
router.post(
    '/deleteVideo',
    functions.checkToken,
    formData.parse(),
    company.deleteVideo
);

//api gọi dữ liệu lĩnh vực
router.post('/getDataLV', company.getDataLV);

//api gọi dữ liệu lĩnh vực theo ngành nghề
router.post(
    '/getFieldsByIndustry',
    formData.parse(),
    company.getFieldsByIndustry
);

//api lưu uv
router.post('/saveUV', functions.checkToken, formData.parse(), company.luuUV);

//api lưu xóa ứng viên trong danh sách lưu
router.post(
    '/deleteUV',
    functions.checkToken,
    formData.parse(),
    company.deleteUV
);

//api danh sách điểm xem uv
router.post(
    '/listUVPoint',
    functions.checkToken,
    formData.parse(),
    company.listUVPoint
);

//api xóa ứng viên trong danh sách đùng điểm
router.post(
    '/listUVPoin',
    functions.checkToken,
    formData.parse(),
    company.deleteUVUsePoin
);

//api cập kết quả ứng viên ứng tuyển
router.post(
    '/updateUvApplyJob',
    functions.checkToken,
    formData.parse(),
    company.updateUvApplyJob
);

//api chi tiết công ty trước khi đăng nhập
router.post(
    '/getDetailInfoCompany',
    formData.parse(),
    company.getDetailInfoCompany
);

//api 10 mẫu CV
router.post('/formCV', formData.parse(), company.formCV);

//api hàm đánh giá uv
router.post(
    '/assessmentUV',
    functions.checkToken,
    formData.parse(),
    company.assessmentUV
);

//api cập nhập uv trong danh sách điểm lọc
router.post(
    '/updateUvWithPoint',
    functions.checkToken,
    formData.parse(),
    company.updateUvWithPoint
);

// api lấy danh sách bài post
router.post(
    '/listNews',
    formData.parse(),
    functions.checkToken,
    company.listNews
);

// api lấy danh sách tin tuyển dụng
router.post('/listJobByToken', functions.checkToken, company.listJobByToken);

// Cập nhật ứng viên ứng tuyển
router.post(
    '/update_uvut',
    formData.parse(),
    functions.checkToken,
    company.update_uvut
);

// api xóa ứng viên ứng tuyển
router.post(
    '/delete_hsut',
    formData.parse(),
    functions.checkToken,
    company.delete_hsut
);

//api xóa ứng viên trong danh sách đùng điểm
router.post(
    '/deleteUVUsePoint',
    functions.checkToken,
    formData.parse(),
    company.deleteUVUsePoint
);

//api cập nhập ứng viên point
router.post(
    '/updateUVPoint',
    functions.checkToken,
    formData.parse(),
    company.updateUVPoint
);

//api danh sách điểm xem uv ALL
router.post(
    '/listUVPointAll',
    functions.checkToken,
    formData.parse(),
    company.listUVPointAll
);
// api lấy danh sach UV ALL

router.post(
    '/listUVApplyJobAll',
    formData.parse(),
    functions.checkToken,
    company.listUVApplyJobAll
);

//api lấy danh sách lưu UV all
router.post(
    '/listSaveUVAll',
    formData.parse(),
    functions.checkToken,
    company.listSaveUVAll
);

//api xác thực tài khoản bằng OTP nhà mạng
router.post(
    '/verifyOTP',
    formData.parse(),
    functions.checkToken,
    company.verifyOTP
);

router.post('/vote', formData.parse(), functions.checkToken, company.vote);

router.post(
    '/getMyVote',
    formData.parse(),
    functions.checkToken,
    company.getMyVote
);

router.post('/getComVotes', formData.parse(), company.getComVotes);

router.post(
    '/updateInforV2',
    formData.parse(),
    functions.checkToken,
    company.updateInforV2
);

// hàm Thông báo NTD
router.post(
    '/notiForCom',
    formData.parse(),
    functions.checkToken,
    company.notiForCom
);

//Xóa tất cả thông báo NTD
router.post(
    '/delNotiForCom',
    formData.parse(),
    functions.checkToken,
    company.delNotiForCom
);

//Kiểm tra điểm nhà tuyển dụng xem ứng viên
router.post(
    '/CheckComUsePointYet',
    formData.parse(),
    functions.checkToken,
    company.CheckComUsePointYet
);

// Lấy danh sách tin tuyển dụng đã đăng cho app
router.post(
    '/listNewsApp',
    formData.parse(),
    functions.checkToken,
    company.listNewsApp
);

//api chi tiết công ty trước khi đăng nhập
router.post(
    '/getDetailInfoCompanyGeneral',
    formData.parse(),
    company.getDetailInfoCompanyGeneral
);

// danh sách ứng viên gợi ý cho nhà tuyển dụng
router.post(
    '/candidateAIForNew',
    formData.parse(),
    functions.checkTokenV2,
    company.candidateAIForNew
);

module.exports = router;