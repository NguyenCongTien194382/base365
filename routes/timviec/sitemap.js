const express = require('express');
const router = express.Router();
const sitemap = require('../../controllers/timviec/sitemap');
const formData = require('express-form-data');

router.post('/bieu_mau', formData.parse(), sitemap.bieu_mau);
router.post('/blog', formData.parse(), sitemap.blog);
router.post('/cau_hoi_phong_van', formData.parse(), sitemap.cau_hoi_phong_van);
router.post('/categories_sitemap_job', formData.parse(), sitemap.categories_sitemap_job);
router.post('/city_sitemap_job', formData.parse(), sitemap.city_sitemap_job);
router.post('/city_cate_sitemap_job', formData.parse(), sitemap.city_cate_sitemap_job);
router.post('/keyword', formData.parse(), sitemap.keyword);
router.post('/category_company', formData.parse(), sitemap.category_company);
router.post('/company', formData.parse(), sitemap.company);

// CV, đơn, thư,...
router.post('/dm_nganhcv', formData.parse(), sitemap.dm_nganhcv);
router.post('/dm_nn_cv', formData.parse(), sitemap.dm_nn_cv);
router.post('/dm_nganhdon', formData.parse(), sitemap.dm_nganhdon);
router.post('/dm_nganhthu', formData.parse(), sitemap.dm_nganhthu);
router.post('/tbl_cv', formData.parse(), sitemap.tbl_cv);
router.post('/tbl_baiviet_cv', formData.parse(), sitemap.tbl_baiviet_cv);
router.post('/job', formData.parse(), sitemap.job);
router.post('/ssl', formData.parse(), sitemap.ssl);
router.post('/tbl_module', formData.parse(), sitemap.tbl_module);
router.post('/categories_multi', formData.parse(), sitemap.categories_multi);
router.post('/news_author', formData.parse(), sitemap.news_author);
router.post('/trang_vang', formData.parse(), sitemap.trang_vang);
router.post('/keyword_ssl', formData.parse(), sitemap.keyword_ssl);

module.exports = router;