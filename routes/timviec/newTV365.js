const express = require('express');
const formData = require('express-form-data');
const router = express.Router();

const newTV365 = require('../../controllers/timviec/newTV365')
const company = require('../../controllers/timviec/company')
const functions = require('../../services/functions')

// lấy danh sách gợi ý của 1 user  
router.post('/TakeDataRecommendHobby', formData.parse(), newTV365.TakeDataRecommendHobby);

// đẩy dữ liệu gợi ý 
router.post('/PusHDataRecomendationNewBeforeLogin', formData.parse(), newTV365.PusHDataRecomendationNewBeforeLogin);

// api đăng tin tuyển dụng
router.post('/postNewTv365', functions.checkToken, formData.parse(), newTV365.postNewTv365);

// api sửa tin tuyển dụng
router.post('/updateNewTv365', functions.checkToken, formData.parse(), newTV365.updateNewTv365);

// api xóa tin
router.delete('/deleteNewTv365/:idNew', functions.checkToken, newTV365.deleteNewTv365);

//api lấy 1 bài viết để company cập nhập
router.get('/getDataPost', functions.checkToken, newTV365.getPost)

// api check đăng tin 10p/1 lần
router.post('/checkNew10p', functions.checkToken, newTV365.checkPostNew10p)

// api lấy tổng số tin theo thời gian
router.post('/getCountByTime', formData.parse(), functions.checkToken, newTV365.getCountByTime);

// api check mở mức đăng tin
router.post('/getNewCreateTime', formData.parse(), functions.checkToken, newTV365.getNewCreateTime);

// api lấy danh sách tin đăng của ntd
router.post('/getListTitleNew', formData.parse(), functions.checkToken, newTV365.getListTitleNew);

// api làm mới tin
router.get('/refreshNew', functions.checkToken, newTV365.refreshNew)

//api lấy 1 bài viết trước đăng nhập hoặc sau đăng nhập
router.post('/detail', functions.checkTokenV2, formData.parse(), newTV365.detail);

// api lấy danh sách bình luận của chi tiết tin
router.post('/listComment', formData.parse(), newTV365.listComment);

//ứng viên comment tin tuyển dụng
router.post('/comment', functions.checkToken, formData.parse(), newTV365.comment);

// ứng viên like tin tuyển dụng
router.post('/like', functions.checkToken, formData.parse(), newTV365.like);

// Mới
//trang chủ
router.post('/homePage', formData.parse(), newTV365.homePage)

// tìm kiếm ngành nghề + tỉnh thành
// listJobBySearchAI
router.post('/listJobBySearchAI', functions.checkTokenV2, formData.parse(), newTV365.listJobBySearchAI)
router.post('/listJobBySearch', functions.checkTokenV2, formData.parse(), newTV365.listJobBySearch)

// Trả ra thông tin để render ra url
router.post('/renderUrlSearch', formData.parse(), newTV365.renderUrlSearch);

// Lấy danh sách tag
router.post('/getDataTag', formData.parse(), newTV365.getDataTag);
router.post('/addNewFromTv365', formData.parse(), newTV365.addNewFromTv365);

// Cập nhật điểm cho tin tuyển dụng
router.post('/updatePointNew', formData.parse(), newTV365.updatePointNew);

// Lấy tin mẫu
router.post('/sampleJobPostings', formData.parse(), newTV365.sampleJobPostings);

// Nội dung page danh sách việc làm theo tags
router.post('/listTagByCate', formData.parse(), newTV365.listTagByCate);
// Lấy tin gợi ý từ AI
router.post('/listSuggestFromAI', formData.parse(), newTV365.listSuggestFromAI);

router.post('/tuDongGhimTin', formData.parse(), functions.checkToken, newTV365.tuDongGhimTin);

router.get('/getPinnedHistory/:new_id', formData.parse(), functions.checkToken, newTV365.getPinnedHistory);

// api đăng tin mà không cần đăng nhập
router.post('/postUnverifiedNewTv365', formData.parse(), newTV365.unverifiedUser, newTV365.postNewTv365);
// xác thực tin sau khi đăng nhập và lấy token
router.post('/verifyNewWithToken', formData.parse(), functions.checkToken, functions.checkAuthentic, newTV365.verifyNew, async(req, res) => functions.success(res, "Thành công!"));

router.post('/listNewsTiaSet', formData.parse(), newTV365.listNewsTiaSet);

router.post('/listNewsAnhSao', formData.parse(), newTV365.listNewsAnhSao);

// Đánh giá sao
router.post('/vote', formData.parse(), functions.checkToken, newTV365.vote);

// Nội dung page danh sách việc làm theo tags
router.post('/listTagByCate', formData.parse(), newTV365.listTagByCate);

// Lấy tin gợi ý từ AI
router.post('/listSuggestFromAI', formData.parse(), newTV365.listSuggestFromAI);

//gợi ý tin hết hạn hoặc ghim
router.post(
    '/suggestedNewForNewDueOrPin',
    formData.parse(),
    newTV365.suggestedFiveNewForDueNewOrPin
);

//danh sách tin theo tag
router.post('/listNewByTag', formData.parse(), newTV365.listNewByTag);

//danh sách tin tuyển dụng cho ứng viên gợi ý bởi AI
router.post(
    '/listSuggestNewForCandidateFromAI',
    formData.parse(),
    // functions.checkToken,
    newTV365.listSuggestNewForCandidateFromAI
);

//danh sách tin tương tự
router.post('/listSimulateNew', formData.parse(), newTV365.listSimulateNew);


router.post('/fitness', formData.parse(), newTV365.rankCandidate);


//Tìm kiếm việc làm bằng AI cho APP
router.post('/SearchCareer', formData.parse(), newTV365.SearchCareer);

router.post('/homePageApp', formData.parse(), newTV365.homePageApp);

router.post(
    '/editComment',
    formData.parse(),
    functions.checkToken,
    newTV365.editComment
);
router.post(
    '/deleteComment',
    formData.parse(),
    functions.checkToken,
    newTV365.deleteComment
);

router.post('/findByLanguage', formData.parse(), newTV365.findByLanguage);

router.post('/countApplyNews', formData.parse(), newTV365.countApplyNews);

//danh sách tin tương tự cho app
router.post('/listSimulateNewForApp', formData.parse(), newTV365.listSimulateNewForApp);

// danh sách Like tin tuyển dụng
router.post('/listLike', formData.parse(), newTV365.listLike);
module.exports = router;