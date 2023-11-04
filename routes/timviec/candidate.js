const express = require('express');
const candidate = require('../../controllers/timviec/candidate');
const formData = require('express-form-data');
const router = express.Router();
const { uploadFileUv, uploadFileTmp } = require('../../services/functions.js');
const functions = require('../../services/functions')

// const arrayInject = [];
const arrayInject = ['exe', 'UNION', 'CASE', 'echo', 'php', 'js', 'script', 'drop', 'SELECT', 'timviec365_tbtimviec', 'delete', 'lookup', 'select'];

const untiInjection = async(req, res, next) => {
    const body = req.body;
    const props = Object.getOwnPropertyNames(body);
    for (let i = 0; i < props.length; i++) {
        let data = String(body[props[i]]);
        for (let j = 0; j < arrayInject.length; j++) {
            if (data.includes(arrayInject[j])) {
                console.log("Du lieu spam", body)
                return res.status(500).json({ error: "Spam" });
            };
        }
    };
    return next();
};

// Lưu hồ sơ ứng viên từ site vệ tinh 
router.post('/AddHosoUngVien', formData.parse(), untiInjection, candidate.AddHosoUngVien);

// Lấy danh sách nhân viên có nội dung tệ
router.post('/TakeListUserBadContent', formData.parse(), candidate.TakeListUserBadContent);

// Cấm những user có nội dung không tốt
router.post('/BanUserUserBadContent', formData.parse(), candidate.BanUserUserBadContent);

router.post('/AddText', formData.parse(), candidate.AddText);
router.post('/DeleteText', formData.parse(), candidate.DeleteText);

// chấp nhận những user trong diện không tốt 
router.post('/AcceptUserBadContent', formData.parse(), candidate.AcceptUserBadContent);

// Check mail tồn tại
router.post('/checkAccountExist', formData.parse(), functions.checkTokenV2, candidate.checkAccountExist);

//api đăng kí b1
router.post('/RegisterB1', formData.parse(), untiInjection, candidate.RegisterB1);

// api đăng kí b2 bằng video
router.post('/RegisterB2VideoUpload', functions.checkToken, uploadFileUv.single('videoUpload'), untiInjection, candidate.RegisterB2VideoUpload);

// api đăng kí b2 bằng cv
router.post('/RegisterB2CvUpload', functions.checkToken, uploadFileUv.fields([
    { name: "cvUpload" },
    { name: "videoUpload" }
]), untiInjection, candidate.RegisterB2CvUpload);

//api đăng kí bước 2 bằng cách tạo cv trên site
router.post('/RegisterB2CvSite', functions.checkToken, untiInjection, candidate.RegisterB2CvSite);

router.post('/authentic', functions.checkToken, untiInjection, candidate.authentic);

//api đăng nhập ứng viên
router.post('/loginUv', formData.parse(), candidate.loginUv);

//api đăng nhập ứng viên cho app
router.post('/loginUvForApp', formData.parse(), candidate.loginUvForApp);

//api hiển thị trang qlc trong hoàn thiện hồ sơ
router.post('/completeProfileQlc', formData.parse(), functions.checkToken, candidate.completeProfileQlc);

//api hiển thị danh sách cv xin việc của ứng viên
router.post('/cvXinViec', formData.parse(), functions.checkToken, candidate.cvXinViec);

// api chọn cv đại diện
router.post('/chooseCv', formData.parse(), functions.checkToken, untiInjection, candidate.chooseCv);

// api xóa cv
router.post('/delfile', formData.parse(), functions.checkToken, candidate.delfile);

//api hiển thị danh sách đơn xin việc cảu ứng viên
router.post('/donXinViec', formData.parse(), untiInjection, functions.checkToken, candidate.donXinViec);

//api hiển thị danh sách thư xin việc của ứng viên
router.post('/thuXinViec', formData.parse(), functions.checkToken, candidate.thuXinViec);

//api hiển thị danh sách hồ sơ xin việc của ứng viên
router.post('/hosoXinViec', formData.parse(), functions.checkToken, candidate.hosoXinViec);

// api xóa cv, đơn, thư đã lưu
router.post('/deleteFile', formData.parse(), functions.checkToken, candidate.deleteFile);

//api hiển thị danh sách việc làm ứng viên đã ứng tuyển
router.post('/listJobCandidateApply', formData.parse(), functions.checkToken, candidate.listJobCandidateApply);

// Xóa tin tuyển dụng đã ứng tuyển
router.post('/deleteJobCandidateApply', formData.parse(), functions.checkToken, candidate.deleteJobCandidateApply);

//api hiển thị danh sách việc làm ứng viên đã lưu
router.post('/listJobCandidateSave', formData.parse(), functions.checkToken, candidate.listJobCandidateSave);

//api cập nhật thông tin liên hệ
router.post('/updateContactInfo', functions.checkToken, uploadFileUv.single('imageUpload'), candidate.updateContactInfo);

//api cập nhật công việc mong muốn
router.post('/updateDesiredJob', formData.parse(), untiInjection, functions.checkToken, candidate.updateDesiredJob);

//cập nhật mục tiêu nghề nghiệp
router.post('/updateCareerGoals', formData.parse(), untiInjection, functions.checkToken, candidate.updateCareerGoals);

//api cập nhật kỹ năng bản thân
router.post('/updateSkills', formData.parse(), untiInjection, functions.checkToken, candidate.updateSkills);

//api cập nhật thông tin người tham chiếu
router.post('/updateReferencePersonInfo', formData.parse(), untiInjection, functions.checkToken, candidate.updateReferencePersonInfo);

//api làm mới hồ sơ
router.post('/RefreshProfile', formData.parse(), functions.checkToken, candidate.RefreshProfile);

//api cập nhật video giới thiệu
router.post('/updateIntroVideo', functions.checkToken, uploadFileUv.single('videoUpload'), candidate.updateIntroVideo);

//api cập nhật ảnh đại diện
router.post('/updateAvatarUser', functions.checkToken, functions.uploadAvatar.single('AvatarUser'), candidate.updateAvatarUser);

//api cập nhật hồ sơ
router.post('/upLoadHoSo', functions.checkToken, formData.parse(), untiInjection, candidate.upLoadHoSo);

//api lấy hồ sơ đã tải lên
router.post('/listProfileUploaded', functions.checkToken, formData.parse(), candidate.listProfileUploaded);

//api thêm sửa xóa bằng cấp chứng chỉ
router.post('/addDegree', formData.parse(), functions.checkToken, candidate.addDegree);
router.post('/updateDegree', formData.parse(), functions.checkToken, untiInjection, candidate.updateDegree);
router.post('/deleteDegree', formData.parse(), functions.checkToken, candidate.deleteDegree);

//api thêm sửa xóa ngoại ngữ tin học
router.post('/addNgoaiNgu', formData.parse(), functions.checkToken, candidate.addNgoaiNgu);
router.post('/updateNgoaiNgu', formData.parse(), functions.checkToken, untiInjection, candidate.updateNgoaiNgu);
router.post('/deleteNgoaiNgu', formData.parse(), functions.checkToken, candidate.deleteNgoaiNgu);

//api thêm sửa xóa kinh nghiệm làm việc
router.post('/addExp', formData.parse(), functions.checkToken, candidate.addExp);
router.post('/updateExp', formData.parse(), functions.checkToken, untiInjection, candidate.updateExp);
router.post('/deleteExp', formData.parse(), functions.checkToken, candidate.deleteExp);

//api danh sách ứng viên ngẫu nhiên, theo ngành nghề, vị trí
router.post('/selectiveUv', formData.parse(), functions.checkToken, candidate.selectiveUv);

//api danh sách ứng viên tương tự được AI gợi ý
// router.post('/candidateAI', formData.parse(), candidate.candidateAI);
router.post('/candidateSimulateAI', formData.parse(), candidate.candidateAI);

// quên mật khẩu
router.post('/sendOTP', formData.parse(), candidate.sendOTP);
router.post('/forgotPassConfirmOTP', formData.parse(), candidate.forgotPassConfirmOTP);
router.post('/forgotPassChangePassword', formData.parse(), candidate.forgotPassChangePassword);

router.post('/confirmOTP', formData.parse(), functions.checkToken, candidate.confirmOTP); // kiểm tra token( có + còn thời gian) -> xác nhận otp

router.post('/changePassword', formData.parse(), functions.checkToken, candidate.changePassword); // kiểm tra token( có + còn thời gian) -> đổi mật khẩu

//đổi mật khẩu
router.post('/sendOTPChangePass', formData.parse(), functions.checkToken, candidate.sendOTPChangePass); //phần gửi otp khác với quên mật khẩu, còn phần xác nhận otp với phần đổi mật khẩu thì giống nhau

// Danh sách ứng viên theon vùng miến 
router.post('/list_vungmien', formData.parse(), functions.checkTokenV2, candidate.list_vungmien);

// Danh sách ứng viên
router.post('/list', formData.parse(), functions.checkTokenV2, candidate.list);

// Danh sách ứng viên AI
router.post('/listAI', formData.parse(), functions.checkTokenV2, candidate.listAI);

//Thông tin chi tiết ứng viên
router.post('/infoCandidate', formData.parse(), functions.checkTokenV2, candidate.infoCandidate);

// Tăng lượt view cho ứng viên
router.post('/upView', formData.parse(), candidate.upView);

//ứng viên ứng tuyển 
router.post('/candidateApply', formData.parse(), functions.checkToken, candidate.candidateApply);

//ứng viên ứng tuyển nhiều tin
router.post('/candidateApplyList', formData.parse(), functions.checkToken, untiInjection, candidate.candidateApplyList);

//ứng viên gửi thư ứng tuyển 
router.post('/candidateSendLetterApply', formData.parse(), functions.checkToken, untiInjection, candidate.candidateSendLetterApply);

//ứng viên lưu tin 
router.post('/candidateSavePost', formData.parse(), functions.checkToken, untiInjection, candidate.candidateSavePost);

// Đánh giá NTD qua tin tuyển dụng
router.post('/evaluateCompany', formData.parse(), functions.checkToken, candidate.evaluateCompany);
router.post('/list_tag_involved', formData.parse(), candidate.list_tag_involved);
router.post('/list_keyword_involved', formData.parse(), candidate.list_keyword_involved);

// Cập nhật cho phép NTD tìm kiếm ứng viên hay không?
router.post('/setting_display', functions.checkToken, candidate.setting_display);

// Upload hồ sơ nhanh tại page tải hồ sơ
router.post('/fastUploadProfile', formData.parse(), candidate.fastUploadProfile);

// Cập nhật hiển thị hồ sơ
router.post('/activeProfile', functions.checkToken, formData.parse(), candidate.activeProfile);

// Xóa hồ sơ đã tải lên
router.post('/deleteProfile', functions.checkToken, formData.parse(), candidate.deleteProfile);

// Cập nhật phân quyền ứng viên
router.post('/updatePermissions', functions.checkToken, formData.parse(), untiInjection, candidate.updatePermissions);

//api đăng kí UV bằng 1 bước
router.post('/RegisterOneStep', formData.parse(), untiInjection, candidate.RegisterOneStep);

//api check ứng viên đã được đánh giá
router.post('/checkReviewCandi', functions.checkToken, candidate.checkReviewCandi);
//Vote ứng viên
router.post('/vote', functions.checkToken, formData.parse(), candidate.vote);

router.post('/getVote', formData.parse(), candidate.getVote);

router.post('/getMyVote', functions.checkToken, formData.parse(), candidate.getMyVote);

//Gửi OTP nhà mạng
router.post('/sendOTPFee', formData.parse(), functions.checkTokenV2, candidate.sendOTPFee);

//Xác thực tài khoản sử dụng OTP nhà mạng
router.post('/authenticOTP', functions.checkToken, formData.parse(), candidate.authenticOTP);

//api upload ảnh trong kho ảnh
router.post('/uploadImg', functions.checkToken, uploadFileUv.fields([
    { name: "video" },
    { name: "images" }
]), candidate.uploadImg);

//api check tổng dung lượng ảnh + video UV
router.post('/checkFileSize', functions.checkToken, candidate.checkFileSize);

//api lấy danh sách ảnh của UV
router.post('/getListImage', functions.checkToken, candidate.getListImage);

//api danh sách ứng viên tương tự được AI gợi ý
// router.post('/candidateAI', formData.parse(), candidate.candidateAI);
router.post('/candidateSimulateAI', formData.parse(), candidate.candidateAI);

// danh sách ứng viên gợi ý cho nhà tuyển dụng
router.post(
    '/candidateAIForNew',
    formData.parse(),
    // functions.checkToken,
    candidate.candidateAIForNew
);
//xóa tài khoản
router.post('/deleteAccount', functions.checkToken, formData.parse(), candidate.deleteAccount);

//Đăng ký lỗi
router.post('/RegisterFail', formData.parse(), candidate.RegisterFail);

//Danh sách ứng viên tia sét
router.post('/listBadge', formData.parse(), functions.checkTokenV2, candidate.listBadge);

//danh sách tag cho app màn tìm kiếm 
router.post(
    '/listTagHot',
    formData.parse(),
    candidate.listTagHot
);

//Xác thực OTP quên mật khẩu cho app
router.post('/checkOtpNotLogin', formData.parse(), candidate.checkOtpNotLogin);

//danh sách tin ứng tuyển ứng viên đã ứng tuyển cho app
router.post(
    '/listJobCandidateApplyForApp',
    functions.checkToken,
    formData.parse(),
    candidate.listJobCandidateApplyForApp
);
//danh sách tin ứng viên đã lưu cho app
router.post(
    '/listJobCandidateSaveforApp',
    functions.checkToken,
    formData.parse(),
    candidate.listJobCandidateSaveforApp
);

router.post('/forgetPassUvApp', formData.parse(), candidate.forgetPassUvApp);

//Render lại ảnh CV nếu bị lỗi
router.post('/renderImageCvErr', formData.parse(), candidate.renderImageCvErr);

router.post('/changePasswordSendOTP', formData.parse(), functions.checkToken, candidate.changePasswordSendOTP);

router.post('/EvaluateCandi', formData.parse(), candidate.EvaluateCandi);
router.post('/test_admin', formData.parse(), candidate.test_admin);
router.post('/changePasswordCheckOTP', formData.parse(), functions.checkToken, candidate.changePasswordCheckOTP);

//api đăng kí UV bên CV
router.post('/RegisterCV', formData.parse(), functions.checkTokenV2, candidate.RegisterCV);
module.exports = router;