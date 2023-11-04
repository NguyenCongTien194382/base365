var express = require("express");
var router = express.Router();
var toolUser = require("../controllers/tools/user");
var toolTimviec365 = require("../controllers/tools/timviec365");
const formData = require("express-form-data");

// API quét data người dùng từ base chat
router.post("/addUserChat365", formData.parse(), toolUser.addUserChat365);
router.get("/addUserCompanyTimviec365", toolUser.addUserCompanyTimviec365);
router.get("/addUserCandidateTimviec365", toolUser.addUserCandidateTimviec365);
router.get("/deleteUser", toolUser.deleteUser);
router.get("/resetScan", toolUser.resetScan);
router.post("/addCompanyTv365", formData.parse(), toolUser.addCompanyTv365);
router.post("/updateAvatarTv365", formData.parse(), toolUser.updateAvatarTv365);
router.post("/addCandidateTv365", formData.parse(), toolUser.addCandidateTv365);
router.post("/addEmployee", formData.parse(), toolUser.addEmployee);
router.post("/addCtyQlc", formData.parse(), toolUser.addCtyQlc);
router.post('/addProfile', formData.parse(), toolUser.addProfile);
router.post('/addCvSaved', formData.parse(), toolUser.addCvSaved);
// api quét data keywork
router.get("/addKeyword", toolTimviec365.toolKeyword);

// api quét data admin user
router.get("/toolAddAdminUSer", toolTimviec365.toolAddAdminUSer);

// api quét data lĩnh vực
router.get("/toolLV", toolTimviec365.toolLV);

// api quét data newTV365
router.get("/toolNewTV365", toolTimviec365.toolNewTV365);

// api quét data newTV365
router.get("/toolNewMultiTV365", toolTimviec365.toolNewMultiTV365);

// api quét data newTV365
router.get("/toolNewMoney", toolTimviec365.toolNewMoney);

// api quét data mẫu cv
router.get("/toolCV", toolTimviec365.toolCV);

// api quét data category blog
router.get("/toolCategoryJob", toolTimviec365.toolCategoryJob);

// api quét data category blog
router.get("/toolCategoryBlog", toolTimviec365.toolCategoryBlog);

// api quét data category blog
router.post("/toolBlog", formData.parse(), toolTimviec365.toolBlog);

// api quét data danh sách ngành cv
router.get("/toolCVCategory", toolTimviec365.toolCVCategory);

// api quét data cv của ứng viên
router.get("/toolCVUV", toolTimviec365.toolCVUV);

// api quét data ngon ngu cv
router.get("/toolCVLang", toolTimviec365.toolCVLang);

// api quét data mẫu đơn xin việc
router.get("/toolApplication", toolTimviec365.toolApplication);

// api quét data đơn của UV
router.get("/toolApplicationUV", toolTimviec365.toolApplicationUV);

// api quét data thu của UV
router.get("/toolLetterUV", toolTimviec365.toolLetterUV);

// api quét data syll của UV
router.get("/toolResumeUV", toolTimviec365.toolResumeUV);

// api quét data mẫu thư
router.get("/toolLetter", toolTimviec365.toolLetter);

// api quét data mẫu syll
router.get("/toolResume", toolTimviec365.toolResume);

// api quét data thiết kế cv
router.get("/toolCVDesign", toolTimviec365.toolCVDesign);

// api quét data nhom cv
router.get("/toolCVGroup", toolTimviec365.toolCVGroup);

// api quét data bảng giá
router.get("/toolPriceList", toolTimviec365.toolPriceList);

// api quét data chuyên mục
router.get("/toolCVSection", toolTimviec365.toolCVSection);

// api quét data poincompany
router.get("/toolPoinCompany", toolTimviec365.toolPoinCompany);

// api quét data poincompany
router.post("/toolPoinCompany1", formData.parse(), toolTimviec365.toolPoinCompany1);

// api quét data PointUse
router.get("/toolPointUse", toolTimviec365.toolPointUse);

// api quét data nganh don
router.get("/toolNganhDon", toolTimviec365.toolNganhDon);

// api quét data nganh thu
router.get("/toolNganhThu", toolTimviec365.toolNganhThu);
router.get("/toolTagBlog", toolTimviec365.toolTagBlog);
router.get("/toolNewAuthor", toolTimviec365.toolNewAuthor);
router.get("/CateInterViewQuestion", toolTimviec365.CateInterViewQuestion);
router.get("/new_bo_de", toolTimviec365.new_bo_de);
router.get("/bieu_mau_tag", toolTimviec365.bieu_mau_tag);
router.get("/category_des", toolTimviec365.category_des);
router.get("/tbl_modules", toolTimviec365.tbl_modules);
router.get("/commentPost", toolTimviec365.commentPost);
router.get("/likePost", toolTimviec365.likePost);
router.get("/Cv365Like", toolTimviec365.Cv365Like);
router.get("/Cv365TblModules", toolTimviec365.Cv365TblModules);
router.get("/Cv365TblFooter", toolTimviec365.Cv365TblFooter);
router.get("/bieumau", toolTimviec365.bieumau);
router.get("/BieuMauNew", toolTimviec365.BieuMauNew);
router.get("/BieuMauTag", toolTimviec365.BieuMauTag);
router.get("/TrangVangCategory", toolTimviec365.TrangVangCategory);
router.get("/KeyWordSSL", toolTimviec365.KeyWordSSL);
router.get("/ApplyForJob", toolTimviec365.ApplyForJob);
router.post("/ApplyForJob1", formData.parse(), toolTimviec365.ApplyForJob1);
router.get("/PermissionNotify", toolTimviec365.PermissionNotify);
router.post("/Profile", formData.parse(), toolTimviec365.Profile);
router.get("/UserSavePost", toolTimviec365.UserSavePost);
router.get("/Notification", toolTimviec365.Notification);
router.get("/SaveVote", toolTimviec365.SaveVote);
router.get("/TblHistoryViewd", toolTimviec365.TblHistoryViewd);
router.get("/HistoryNewPoint", toolTimviec365.HistoryNewPoint);
router.get("/Evaluate", toolTimviec365.Evaluate);
router.get("/CompanyStorage", toolTimviec365.CompanyStorage);
router.get("/checkRegistry", toolTimviec365.checkRegistry);
router.get("/SaveCandidate", toolTimviec365.SaveCandidate);
router.get("/Mail365", toolTimviec365.Mail365);
router.get("/admin_module", toolTimviec365.admin_module);
router.get("/companyvip", toolTimviec365.CompanyVip);
router.get("/admin_menu_order", toolTimviec365.admin_menu_order);
router.get("/admin_translate", toolTimviec365.admin_translate);
router.get("/admin_user_language", toolTimviec365.admin_user_language);
router.get("/admin_user_right", toolTimviec365.admin_user_right);
router.get("/tags", toolTimviec365.tags);
router.get("/tbl_danhmuc_mail", toolTimviec365.tbl_danhmuc_mail);
router.get("/cv365blog", toolTimviec365.cv365blog);
router.get("/cv365customhtml", toolTimviec365.cv365customhtml);
router.get("/tblfooter", toolTimviec365.tblfooter);
router.get("/salarylevel", toolTimviec365.salarylevel);
router.get("/mailntd", toolTimviec365.mailntd);
router.get("/savemember", toolTimviec365.savemember);
router.get("/cv_history_point", toolTimviec365.cv_history_point);
router.post('/tbl_cv_uv', formData.parse(), toolTimviec365.tbl_cv_uv);
router.post('/tbl_bao_luu', formData.parse(), toolTimviec365.tbl_bao_luu);
router.post('/manage_point_history', formData.parse(), toolTimviec365.manage_point_history);

router.post("/toolHistoryLogin", formData.parse(), toolTimviec365.toolHistoryLogin);
router.post("/toolSaveAccountVip", formData.parse(), toolTimviec365.toolSaveAccountVip);
router.post("/toolSaveExchangePoint", formData.parse(), toolTimviec365.toolSaveExchangePoint);
router.post("/toolSaveExchangePointBuy", formData.parse(), toolTimviec365.toolSaveExchangePointBuy);
router.post("/toolSaveExchangePointOrder", formData.parse(), toolTimviec365.toolSaveExchangePointOrder);
router.post("/toolSaveNextPage", formData.parse(), toolTimviec365.toolSaveNextPage);
router.post("/toolSaveSeeNewByEm", formData.parse(), toolTimviec365.toolSaveSeeNewByEm);
router.post("/toolSaveSeeRequest", formData.parse(), toolTimviec365.toolSaveSeeRequest);
router.post("/toolSaveShareSocialNew", formData.parse(), toolTimviec365.toolSaveShareSocialNew);
router.post("/toolSaveShareSocialUser", formData.parse(), toolTimviec365.toolSaveShareSocialUser);
router.post("/toolSaveVote", formData.parse(), toolTimviec365.toolSaveVote);
router.post("/toolPointUsed", formData.parse(), toolTimviec365.toolPointUsed);
router.post("/toolHistoryPointPromotion", formData.parse(), toolTimviec365.toolHistoryPointPromotion);
router.post("/toolOrder", formData.parse(), toolTimviec365.toolOrder);
router.post("/toolOrderDetails", formData.parse(), toolTimviec365.toolOrderDetails);
router.post("/toolPriceLists", formData.parse(), toolTimviec365.toolPriceLists);
router.post("/toolUserCompanyUnset", formData.parse(), toolTimviec365.toolUserCompanyUnset);
router.post("/toolUserUnset", formData.parse(), toolTimviec365.toolUserUnset);
router.post("/MdtdCvUvVsNew", formData.parse(), toolTimviec365.MdtdCvUvVsNew);


module.exports = router;