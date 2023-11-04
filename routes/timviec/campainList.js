const express = require('express');
const router = express.Router();
const campainList = require('../../controllers/timviec/campainList');
const formData = require('express-form-data');

// nạp điểm
router.post('/addPoint', formData.parse(), campainList.addPoint);

// danh sách điểm nạp
router.post('/getPointList', formData.parse(), campainList.getPointList);

// danh sách chiến dịch
router.post('/getcampainList', formData.parse(), campainList.getcampainList);

// thêm chiến dịch
router.post('/addCampain', formData.parse(), campainList.addCampain);

// chỉnh sửa chiến dịch
router.post('/editCampain', formData.parse(), campainList.editCampain);

// xem chi tiết chiến dịch
router.post('/detailCampain', formData.parse(), campainList.detailCampain);

// xóa chiến dịch
router.delete('/deleteCampain', formData.parse(), campainList.deleteCampain);

// tìm kiếm từ khóa mở rộng
router.post('/findCampain', formData.parse(), campainList.findCampain);

// tìm kiếm từ khóa chính xác
router.post('/findexactCampain', formData.parse(), campainList.findexactCampain);

// tăng lượt nhấp chuột
router.post('/addClickCampain', formData.parse(), campainList.addClickCampain);

// tăng lượt ứng tuyển
router.post('/addApplyCampain', formData.parse(), campainList.addApplyCampain);

// cập nhật trạng thái chiến dịch - bình viết
router.post('/updateStatusCampain', formData.parse(), campainList.updateStatusCampain);

// cập nhật thời gian bắt đầu, kết thúc chiến dịch
router.post('/updateDateCampain', formData.parse(), campainList.updateDateCampain);

// cập nhật giá thầu chiến dịch
router.post('/updateGpaCampain', formData.parse(), campainList.updateGpaCampain);

// cập nhật ngân sách chiến dịch
router.post('/updateNganSachCampain', formData.parse(), campainList.updateNganSachCampain);

// tạo chiến dịch bước 1
router.post('/createCampaignB1', formData.parse(), campainList.createCampaignB1);

// tạo chiến dịch bước 2
router.post('/createCampaignB2', formData.parse(), campainList.createCampaignB2);

// tạo chiến dịch bước 3
router.post('/createCampaignB3', formData.parse(), campainList.createCampaignB3);

// tạo chiến dịch bước 4
router.post('/createCampaignB4', formData.parse(), campainList.createCampaignB4);

// check gpa chiến dịch lớn nhất của hệ thống
router.post('/gpaCampainMax', formData.parse(), campainList.gpaCampainMax);

// lấy danh sách các tin tuyển dụng đang thực hiện = chưa tạo xong
router.post('/listCampaignProcessing', formData.parse(), campainList.listCampaignProcessing);

// thống kê số liệu 
router.post('/getStatisticCampain', formData.parse(), campainList.getStatisticCampain);

// Lấy 6 tin tuyển dụng có quảng cáo
router.post('/listNewCampaign', formData.parse(), campainList.listNewCampaign);

module.exports = router;