var express = require('express');
var router = express.Router();

// Admin
var adminRouter = require('./timviec/admin');
var AdminCandidateRouter = require('./timviec/admin/candidate');
var AdminCompanyRouter = require('./timviec/admin/company');
var AccountRouter = require('./timviec/admin/account');
var AdminNewTV365Router = require('./timviec/admin/newTV365');
var AdminOrdersRouter = require('./timviec/admin/orders');
var AdminCV = require('./timviec/admin/cv');
var AdminManagerSaler = require("./timviec/admin/manager_saler");
var AdminAuthorRouter = require('./timviec/admin/author');
var AdminCategoryBlogRouter = require('./timviec/admin/category_blog')
var AdminBieumau = require('./timviec/admin/bm');
var AdminOffice = require('./timviec/admin/office');
var AdminTrangVangRouter = require('./timviec/admin/trang_vang');
var AdminPoint = require('./timviec/admin/point');
var AdminMoney = require('./timviec/admin/money');
var rolesRouter = require('./timviec/admin/roles');
var AdminBoDe = require("./timviec/admin/bode");
var AdminNews = require('./timviec/admin/news')
var AdminBlog = require('./timviec/admin/blog')
var AdminTagManager = require('./timviec/admin/tagManager');
var AdminTagAuto = require('./timviec/admin/tagAuto');
var AdminTagBlog = require('./timviec/admin/tagBlog')



// 
var candidateRouter = require('./timviec/candidate');
var companyRouter = require('./timviec/company');
var cvRouter = require('./timviec/cv');
var appliRouter = require('./timviec/jobApplication');
var letterRouter = require('./timviec/letter');
var syllRouter = require('./timviec/syll');
// var newTV365Router = require('./timviec/newTV365/newTV365');
var newTV365Router = require('./timviec/newTV365');
// verifypointRouter
var verifypointRouter = require('./timviec/verifypoint');
var blogRouter = require('./timviec/blog');
var bodeRouter = require('./timviec/bo_de');
var bieumauRouter = require('./timviec/bm');
var priceListRouter = require('./timviec/priceList');
var trangVangRouter = require('./timviec/trangVang');
var permistionNotifyRouter = require('./timviec/permistionNotify');
var mail365Router = require('./timviec/mail365');
var sslRouter = require('./timviec/ssl');
var accountRouter = require('./timviec/account');
var companyVipRouter = require('./timviec/company_vip');
var creditsRouter = require('./timviec/credits');
var ordersRouter = require('./timviec/orders');
var tools = require('../controllers/tools/timviec365');
var checkSpamNewRouter = require('./timviec/checkSpamNew');
var historyRouter = require('./timviec/history');
var campainListRouter = require('./timviec/campainList');
var vipRouter = require('./timviec/vip');
var sitemap = require('./timviec/sitemap');
var adminVideoManager = require('./timviec/admin/video');
var cvnewRouter = require('./timviec/cvnew');
var notification = require('./timviec/notification');
//APP
var candidateAppRouter = require('./timviec/app_chat/candidate');
var candidate_site_vt = require('./timviec/site_vt/candidate');

// ADMIN
router.use('/admin', adminRouter);
router.use('/admin/uv', AdminCandidateRouter);
router.use('/admin/company', AdminCompanyRouter);
router.use('/admin/account', AccountRouter);
router.use('/admin/new', AdminNewTV365Router);
router.use('/admin/order', AdminOrdersRouter);
router.use('/admin/cv', AdminCV);
router.use('/admin/manager_saler', AdminManagerSaler);
router.use('/admin/author', AdminAuthorRouter);
router.use('/admin/categoryBlog', AdminCategoryBlogRouter);
router.use('/admin/bm', AdminBieumau);
router.use('/admin/office', AdminOffice);
router.use('/admin/trangVang', AdminTrangVangRouter);
router.use('/admin/td', AdminPoint);
router.use('/admin/money', AdminMoney);
router.use('/admin/roles', rolesRouter);
router.use('/admin/bode', AdminBoDe);
router.use('/admin/news', AdminNews);
router.use('/admin/blog', AdminBlog);
router.use('/admin/tag', AdminTagManager);
router.use('/admin/vd', adminVideoManager);
router.use('/admin/auto', AdminTagAuto);
router.use('/admin/tagbl', AdminTagBlog);

router.use('/candidate', candidateRouter);
router.use('/new', newTV365Router);
router.use('/company', companyRouter);
router.use('/blog', blogRouter);
router.use('/chpv', bodeRouter);
router.use('/cv', cvRouter);
router.use('/appli', appliRouter);
router.use('/letter', letterRouter);
router.use('/syll', syllRouter);
router.use('/mail365', mail365Router);
router.use('/bm', bieumauRouter);
router.use('/permission', permistionNotifyRouter);
router.use('/trangVang', trangVangRouter);
router.use('/priceList', priceListRouter);
router.use('/campainList', campainListRouter);
router.use('/ssl', sslRouter);
router.use('/account', accountRouter);
router.use('/company/vip', companyVipRouter);
router.use('/credits', creditsRouter);
router.use('/order', ordersRouter);
router.get('/normalize/EPH', tools.normalizeExchangePointHistory);
router.get('/normalize/PL', tools.normalizePriceList);
router.use('/checkSpamNew', checkSpamNewRouter);
router.use('/history', historyRouter);
router.use('/vip', vipRouter);
router.use('/sitemap', sitemap);
router.use('/cvnew', cvnewRouter);
router.use('/verifypoint', verifypointRouter);
//APP
router.use('/candidate/app_chat', candidateAppRouter);
router.use('/candidate/site_vt', candidate_site_vt);
router.use('/notification', notification);
module.exports = router;