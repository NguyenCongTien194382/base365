const fnc = require('../../services/functions');
const New = require('../../models/Raonhanh365/New');
const Category = require('../../models/Raonhanh365/Category');
const axios = require('axios');
const FormData = require('form-data');
const CateDetail = require('../../models/Raonhanh365/CateDetail');
const PriceList = require('../../models/Raonhanh365/PriceList');
const CityRN = require('../../models/Raonhanh365/City');
const LikeRN = require('../../models/Raonhanh365/Like');
const History = require('../../models/Raonhanh365/History');
const ApplyNews = require('../../models/Raonhanh365/ApplyNews');
const Comments = require('../../models/Raonhanh365/Comments');
const OrderRN = require('../../models/Raonhanh365/Order');
const TagsIndex = require('../../models/Raonhanh365/TagIndex');
const AdminUserRight = require('../../models/Raonhanh365/Admin/AdminUserRight');
const Bidding = require('../../models/Raonhanh365/Bidding')
const dotenv = require("dotenv");
dotenv.config();
const AdminUser = require('../../models/Raonhanh365/Admin/AdminUser');
const AdminTranslate = require('../../models/Raonhanh365/Admin/AdminTranslate');
const AdminMenuOrder = require('../../models/Raonhanh365/Admin/AdminMenuOrder');
const Module = require('../../models/Raonhanh365/Admin/Module');
const Evaluate = require('../../models/Raonhanh365/Evaluate');
const Cart = require('../../models/Raonhanh365/Cart');
const Tags = require('../../models/Raonhanh365/Tags');
const Contact = require('../../models/Raonhanh365/Contact');
const RegisterFail = require('../../models/Raonhanh365/RegisterFail');
const Search = require('../../models/Raonhanh365/Search');
const TblTags = require('../../models/Raonhanh365/TblTag');
const PushNewsTime = require('../../models/Raonhanh365/PushNewsTime');
const Blog = require('../../models/Raonhanh365/Admin/Blog');
const loveNew = require('../../models/Raonhanh365/LoveNews');
const NetworkOperator = require('../../models/Raonhanh365/NetworkOperator');
const CateVl = require('../../models/Raonhanh365/CateVl');
const Keyword = require('../../models/Raonhanh365/Keywords');
const ImageDeplicate = require('../../models/Raonhanh365/ImageDeplicate');
const BaoCao = require('../../models/Raonhanh365/BaoCao');
const User = require('../../models/Users');

// danh mục sản phẩm
exports.toolCategory = async (req, res, next) => {
    try {
        const element = req.body;
        await Category.findOneAndUpdate({ _id: element.cat_id }, {
            _id: element.cat_id,
            adminId: element.admin_id,
            name: element.cat_name,
            parentId: element.cat_parent_id,
            order: element.cat_order,
            type: element.cat_type,
            hasChild: element.cat_has_child,
            active: element.cat_active,
            show: element.cat_show,
            langId: element.lang_id,
            description: element.cat_description,
            md5: element.cat_md5,
            isCheck: element.phan_loai,
        }, { upsert: true, new: true });


        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolNewRN = async (req, res, next) => {
    try {
        let new_file_dthau = null;
        let new_file_nophs = null;
        let new_file_chidan = null;
        let images = '';
        let element = req.body;
        if (element.new_image) {
            images = element.new_image.split(";").map((image, index) => {
                const parts = image.split("/");
                const filename = parts[parts.length - 1];
                return {
                    nameImg: filename
                };
            });

        }
        if (element.new_file_dthau && element.new_file_dthau != 0) {
            new_file_dthau = element.new_file_dthau.split('/')[1];
        }
        if (element.new_file_nophs && element.new_file_nophs != 0) {
            new_file_nophs = element.new_file_nophs.split('/')[1];

        }
        if (element.new_file_chidan && element.new_file_chidan != 0) {
            new_file_chidan = element.new_file_chidan.split('/')[1];
        }
        await New.findOneAndUpdate({ _id: Number(element.new_id) }, {
            _id: element.new_id,
            userID: element.new_user_id,
            title: element.new_title,
            linkTitle: element.link_title,
            money: element.new_money,
            endvalue: element.gia_kt,
            downPayment: element.datcoc,
            until: element.new_unit,
            cateID: element.new_cate_id,
            type: element.new_type,
            city: element.new_city,
            buySell: element.new_buy_sell,
            viewCount: element.new_view_count,
            name: element.new_name,
            active: element.new_active,
            detailCategory: element.new_ctiet_dmuc,
            createTime: new Date(element.new_create_time * 1000),
            updateTime: new Date(element.new_update_time * 1000),
            phone: element.new_phone,
            email: element.new_email,
            address: element.dia_chi,
            district: element.quan_huyen,
            ward: element.phuong_xa,
            apartmentNumber: element.new_sonha,
            status: element.new_tinhtrang,
            electroniceDevice: {
                warranty: element.new_baohanh
            },
            refresh_new_home: element.refresh_new_home,
            free: element.chotang_mphi,
            sold: element.da_ban,
            timeSell: new Date(element.tgian_ban * 1000),
            pinHome: element.new_pin_home,
            pinCate: element.new_pin_cate,
            timePushNew: element.new_gap,
            timeStartPinning: element.thoigian_bdghim,
            dayStartPinning: element.ngay_bdghim,
            dayEndPinning: element.ngay_ktghim,
            timePinning: element.tgian_ban,
            numberDayPinning: element.so_ngay_ghim,
            moneyPinning: element.tien_ghim,
            countRefresh: element.new_count_refresh,
            authen: element.new_authen,
            pinCount: element.new_pin_count,
            refreshTime: element.refresh_time,
            timeHome: element.new_time_home,
            timeCate: element.timeCate,
            baohanh: element.new_baohanh,
            quantitySold: element.sluong_daban,
            totalSold: element.tong_sluong,
            quantityMin: element.soluong_min,
            quantityMax: element.soluong_max,
            timePromotionStart: element.thoigian_kmbd,
            timePromotionEnd: element.thoigian_kmkt,
            img: images,
            video: element.new_video,
            new_day_tin: element.new_day_tin,
            dia_chi: element.dia_chi,
            duplicate: element.new_duplicate,
            'brand': element.hang,
            'han_su_dung': element.han_su_dung,
            'poster': element.canhan_moigioi,
            'description': element.new_description,
            'productType': element.loai_sanpham,
            'hashtag': element.new_hsashtag,
            'electroniceDevice.microprocessor': element.bovi_xuly,
            'electroniceDevice.ram': element.ram,
            'electroniceDevice.hardDrive': element.o_cung,
            'electroniceDevice.typeHarđrive': element.loai_o_cung,
            'electroniceDevice.screen': element.man_hinh,
            'electroniceDevice.size': element.kich_co,
            'electroniceDevice.brand': element.hang,
            'electroniceDevice.machineSeries': element.hang_vattu,
            'electroniceDevice.device': element.thiet_bi,
            'electroniceDevice.capacity': element.dung_luong,
            'electroniceDevice.sdung_sim': element.sdung_sim,
            'electroniceDevice.phien_ban': element.phien_ban,
            'vehicle.hang': element.hang,
            'vehicle.loai_xe': element.loai_xe,
            'vehicle.xuat_xu': element.xuat_xu,
            'vehicle.mau_sac': element.mau_sac,
            'vehicle.kich_co': element.kich_co,
            'vehicle.chat_lieu_khung': element.chat_lieu_khung,
            'vehicle.baohanh': element.baohanh,
            'vehicle.hang': element.hang,
            'vehicle.dong_xe': element.dong_xe,
            'vehicle.nam_san_xuat': element.nam_san_xuat,
            'vehicle.dung_tich': element.dung_tich,
            'vehicle.td_bien_soxe': element.td_bien_soxe,
            'vehicle.phien_ban': element.phien_ban,
            'vehicle.hop_so': element.hop_so,
            'vehicle.nhien_lieu': element.nhien_lieu,
            'vehicle.kieu_dang': element.kieu_dang,
            'vehicle.so_cho': element.so_cho,
            'vehicle.trong_tai': element.trong_tai,
            'vehicle.loai_linhphu_kien': element.loai_linhphu_kien,
            'vehicle.km': element.so_km_da_di,
            'realEstate.ten_toa_nha': element.ten_toa_nha,
            'realEstate.td_macanho': element.td_macanho,
            'realEstate.ten_phan_khu': element.ten_phan_khu,
            'realEstate.td_htmch_rt': element.td_htmch_rt,
            'realEstate.so_pngu': element.so_pngu,
            'realEstate.so_pve_sinh': element.so_pve_sinh,
            'realEstate.tong_so_tang': element.tong_so_tang,
            'realEstate.huong_chinh': element.huong_chinh,
            'realEstate.giay_to_phap_ly': element.giay_to_phap_ly,
            'realEstate.tinh_trang_noi_that': element.tinh_trang_noi_that,
            'realEstate.dac_diem': element.dac_diem,
            'realEstate.dien_tich': element.dien_tich,
            'realEstate.dientichsd': element.dientichsd,
            'realEstate.chieu_dai': element.chieu_dai,
            'realEstate.chieu_rong': element.chieu_rong,
            'realEstate.tinh_trang_bds': element.tinh_trang_bds,
            'realEstate.td_block_thap': element.td_block_thap,
            'realEstate.tang_so': element.tang_so,
            'realEstate.loai_hinh_canho': element.loai_hinh_canho,
            'realEstate.loaihinh_vp': element.loaihinh_vp,
            'realEstate.loai_hinh_dat': element.loai_hinh_dat,
            'realEstate.kv_thanhpho': element.kv_thanhpho,
            'realEstate.kv_quanhuyen': element.kv_quanhuyen,
            'realEstate.kv_phuongxa': element.kv_phuongxa,
            'ship.product': element.loai_hinh_sp,
            'ship.timeStart': element.tgian_bd,
            'ship.timeEnd': element.tgian_kt,
            'ship.allDay': element.ca_ngay,
            'ship.vehicloType': element.loai_xe,
            'beautifull.loai_hinh_sp': element.loai_hinh_sp,
            'beautifull.han_su_dung': element.han_su_dung,
            'beautifull.hang_vattu': element.hang_vattu,
            'wareHouse.loai_thiet_bi': element.loai_thiet_bi,
            'wareHouse.hang': element.hang,
            'wareHouse.cong_suat': element.cong_suat,
            'wareHouse.dung_tich': element.dung_tich,
            'wareHouse.khoiluong': element.khoiluong,
            'wareHouse.loai_chung': element.loai_chung,
            'pet.kindOfPet': element.giong_thu_cung,
            'pet.age': element.do_tuoi,
            'pet.gender': element.gioi_tinh,
            'pet.weigth': element.khoiluong,
            'health.brand': element.hang,
            'Job.jobType': element.new_job_type,
            'Job.jobKind': element.new_job_kind,
            'Job.maxAge': element.new_min_age,
            'Job.minAge': element.new_max_age,
            'Job.exp': element.new_exp,
            'Job.level': element.new_level,
            'Job.skill': element.new_skill,
            'Job.quantity': element.new_quantity,
            'Job.city': element.com_city,
            'Job.district': element.com_district,
            'Job.ward': element.com_ward,
            'Job.addressNumber': element.com_address_num,
            'Job.payBy': element.new_pay_by,
            'Job.benefit': element.quyen_loi,
            'food.typeFood': element.nhom_sanpham,
            'food.expiry': element.han_su_dung,
            'addressProcedure': element.com_address_num,
            'productGroup': element.nhom_sanpham,
            'com_city': element.com_city,
            'com_district': element.com_district,
            'com_ward': element.com_ward,
            'com_address_num': element.com_address_num,
            'bidding.han_bat_dau': element.han_bat_dau,
            'bidding.han_su_dung': element.han_su_dung,
            'tgian_bd': element.tgian_bd,
            'tgian_kt': element.tgian_kt,
            'bidding.new_job_kind': element.new_job_kind,
            'bidding.new_file_dthau': new_file_dthau,
            'bidding.noidung_nhs': element.noidung_nhs,
            'bidding.new_file_nophs': new_file_nophs,
            'bidding.noidung_chidan': element.noidung_chidan,
            'bidding.new_file_chidan': new_file_chidan,
            'bidding.donvi_thau': element.donvi_thau,
            'bidding.phi_duthau': element.phi_duthau,
            'bidding.file_mota': element.file_mota,
            'bidding.file_thutuc': element.file_thutuc,
            'bidding.file_hoso': element.file_hoso,
            'infoSell.groupType': element.nhom_phan_loai,
            'infoSell.classify': element.phan_loai,
            'infoSell.numberWarehouses': element.so_luong_kho,
            'infoSell.promotionType': element.loai_khuyenmai,
            'infoSell.promotionValue': element.giatri_khuyenmai,
            'infoSell.transport': element.van_chuyen,
            'infoSell.transportFee': element.phi_van_chuyen,
            'infoSell.productValue': element.gia_sanpham_xt,
            'infoSell.untilMoney': element.donvi_tien_xt,
            'infoSell.untilTranpost': element.donvi_tien_vc,
        }, { upsert: true, new: true });
        await fnc.success(res, 'thành công');

    } catch (err) {
        console.log(err);
        return fnc.setError(res, err.message)
    }
}
exports.updateNewDescription = async (req, res, next) => {
    try {
        const element = req.body;
        let idnew = Number(element.new_id)

        let new_file_dthau = null;
        let new_file_nophs = null;
        let new_file_chidan = null;
        if (element.new_file_dthau && element.new_file_dthau != 0) {
            new_file_dthau = element.new_file_dthau.split('/')[1];
        }
        if (element.new_file_nophs && element.new_file_nophs != 0) {
            new_file_nophs = element.new_file_nophs.split('/')[1];

        }
        if (element.new_file_chidan && element.new_file_chidan != 0) {
            new_file_chidan = element.new_file_chidan.split('/')[1];

        }
        let check = await New.findById(idnew).lean();
        if (check) {
            await New.findOneAndUpdate({ _id: idnew }, {
                $set: {
                    'brand': element.hang,
                    'han_su_dung': element.han_su_dung,
                    'poster': element.canhan_moigioi,
                    'description': element.new_description,
                    'productType': element.loai_sanpham,
                    'hashtag': element.new_hsashtag,
                    'electroniceDevice.microprocessor': element.bovi_xuly,
                    'electroniceDevice.ram': element.ram,
                    'electroniceDevice.hardDrive': element.o_cung,
                    'electroniceDevice.typeHarđrive': element.loai_o_cung,
                    'electroniceDevice.screen': element.man_hinh,
                    'electroniceDevice.size': element.kich_co,
                    'electroniceDevice.brand': element.hang,
                    'electroniceDevice.machineSeries': element.hang_vattu,
                    'electroniceDevice.device': element.thiet_bi,
                    'electroniceDevice.capacity': element.dung_luong,
                    'electroniceDevice.sdung_sim': element.sdung_sim,
                    'electroniceDevice.phien_ban': element.phien_ban,
                    'vehicle.hang': element.hang,
                    'vehicle.loai_xe': element.loai_xe,
                    'vehicle.xuat_xu': element.xuat_xu,
                    'vehicle.mau_sac': element.mau_sac,
                    'vehicle.kich_co': element.kich_co,
                    'vehicle.chat_lieu_khung': element.chat_lieu_khung,
                    'vehicle.baohanh': element.baohanh,
                    'vehicle.hang': element.hang,
                    'vehicle.dong_xe': element.dong_xe,
                    'vehicle.nam_san_xuat': element.nam_san_xuat,
                    'vehicle.dung_tich': element.dung_tich,
                    'vehicle.td_bien_soxe': element.td_bien_soxe,
                    'vehicle.phien_ban': element.phien_ban,
                    'vehicle.hop_so': element.hop_so,
                    'vehicle.nhien_lieu': element.nhien_lieu,
                    'vehicle.kieu_dang': element.kieu_dang,
                    'vehicle.so_cho': element.so_cho,
                    'vehicle.trong_tai': element.trong_tai,
                    'vehicle.loai_linhphu_kien': element.loai_linhphu_kien,
                    'vehicle.km': element.so_km_da_di,
                    'realEstate.ten_toa_nha': element.ten_toa_nha,
                    'realEstate.td_macanho': element.td_macanho,
                    'realEstate.ten_phan_khu': element.ten_phan_khu,
                    'realEstate.td_htmch_rt': element.td_htmch_rt,
                    'realEstate.so_pngu': element.so_pngu,
                    'realEstate.so_pve_sinh': element.so_pve_sinh,
                    'realEstate.tong_so_tang': element.tong_so_tang,
                    'realEstate.huong_chinh': element.huong_chinh,
                    'realEstate.giay_to_phap_ly': element.giay_to_phap_ly,
                    'realEstate.tinh_trang_noi_that': element.tinh_trang_noi_that,
                    'realEstate.dac_diem': element.dac_diem,
                    'realEstate.dien_tich': element.dien_tich,
                    'realEstate.dientichsd': element.dientichsd,
                    'realEstate.chieu_dai': element.chieu_dai,
                    'realEstate.chieu_rong': element.chieu_rong,
                    'realEstate.tinh_trang_bds': element.tinh_trang_bds,
                    'realEstate.td_block_thap': element.td_block_thap,
                    'realEstate.tang_so': element.tang_so,
                    'realEstate.loai_hinh_canho': element.loai_hinh_canho,
                    'realEstate.loaihinh_vp': element.loaihinh_vp,
                    'realEstate.loai_hinh_dat': element.loai_hinh_dat,
                    'realEstate.kv_thanhpho': element.kv_thanhpho,
                    'realEstate.kv_quanhuyen': element.kv_quanhuyen,
                    'realEstate.kv_phuongxa': element.kv_phuongxa,
                    'ship.product': element.loai_hinh_sp,
                    'ship.timeStart': element.tgian_bd,
                    'ship.timeEnd': element.tgian_kt,
                    'ship.allDay': element.ca_ngay,
                    'ship.vehicloType': element.loai_xe,
                    'beautifull.loai_hinh_sp': element.loai_hinh_sp,
                    'beautifull.han_su_dung': element.han_su_dung,
                    'beautifull.hang_vattu': element.hang_vattu,
                    'wareHouse.loai_thiet_bi': element.loai_thiet_bi,
                    'wareHouse.hang': element.hang,
                    'wareHouse.cong_suat': element.cong_suat,
                    'wareHouse.dung_tich': element.dung_tich,
                    'wareHouse.khoiluong': element.khoiluong,
                    'wareHouse.loai_chung': element.loai_chung,
                    'pet.kindOfPet': element.giong_thu_cung,
                    'pet.age': element.do_tuoi,
                    'pet.gender': element.gioi_tinh,
                    'pet.weigth': element.khoiluong,
                    'health.typeProduct': element,
                    'health.kindCosmetics': element,
                    'health.expiry': element.han_su_dung,
                    'health.brand': element,
                    'Job.jobType': element.new_job_type,
                    'Job.jobKind': element.new_job_kind,
                    'Job.maxAge': element.new_min_age,
                    'Job.minAge': element.new_max_age,
                    'Job.exp': element.new_exp,
                    'Job.level': element.new_level,
                    'Job.skill': element.new_skill,
                    'Job.quantity': element.new_quantity,
                    'Job.city': element.com_city,
                    'Job.district': element.com_district,
                    'Job.ward': element.com_ward,
                    'Job.addressNumber': element.com_address_num,
                    'Job.payBy': element.new_pay_by,
                    'Job.benefit': element.quyen_loi,
                    'food.typeFood': element.nhom_sanpham,
                    'food.expiry': element.han_su_dung,
                    'addressProcedure': element.com_address_num,
                    'productGroup': element.nhom_sanpham,
                    'com_city': element.com_city,
                    'com_district': element.com_district,
                    'com_ward': element.com_ward,
                    'com_address_num': element.com_address_num,
                    'bidding.han_bat_dau': element.han_bat_dau,
                    'bidding.han_su_dung': element.han_su_dung,
                    'tgian_bd': element.tgian_bd,
                    'tgian_kt': element.tgian_kt,
                    'bidding.new_job_kind': element.new_job_kind,
                    'bidding.new_file_dthau': new_file_dthau,
                    'bidding.noidung_nhs': element.noidung_nhs,
                    'bidding.new_file_nophs': new_file_nophs,
                    'bidding.noidung_chidan': element.noidung_chidan,
                    'bidding.new_file_chidan': new_file_chidan,
                    'bidding.donvi_thau': element.donvi_thau,
                    'bidding.phi_duthau': element.phi_duthau,
                    'bidding.file_mota': element.file_mota,
                    'bidding.file_thutuc': element.file_thutuc,
                    'bidding.file_hoso': element.file_hoso,
                }
            });
            await fnc.success(res, 'thành công');
        }
        return fnc.setError(res, 'Không tìm thấy tin')
    } catch (err) {
        console.log(err);
        return fnc.setError(res, err)
    }
}


exports.toolCateDetail = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);

            //1. nhóm sp
            // const response = await axios.post('https://raonhanh365.vn/api/select_ds_nhomsp.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });

            // let data = response.data.data.items;
            // if (data.length) {

            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].id,
            //             name: data[i].name,
            //         };
            //         await CateDetail.findOneAndUpdate({ _id: data[i].id_danhmuc }, { $addToSet: { productGroup: newItem } }, { upsert: true },)
            //     }
            //     page++;
            // } else {
            //     result = false;
            // }


            // 2.nhóm chất liệu
            // const response = await axios.post('https://raonhanh365.vn/api/select_ds_nspchatlieu.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // let data = response.data.data.items;
            // if (data.length) {

            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].id,
            //             name: data[i].name,
            //             parent: data[i].id_cha,
            //         };
            //         if (data[i].id_danhmuc == 0) {
            //             await CateDetail.findOneAndUpdate({ _id: data[i].id_cha }, { $addToSet: { productMaterial: newItem } }, { upsert: true },)
            //         } else {
            //             await CateDetail.findOneAndUpdate({ _id: data[i].id_danhmuc }, { $addToSet: { productMaterial: newItem } }, { upsert: true },)
            //         }
            //     }
            //     page++;
            // } else {
            //     result = false;
            // }


            // 3. nhóm sp hìn dạng
            // const response = await axios.post('https://raonhanh365.vn/api/select_ds_nsphinhdang.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // let data = response.data.data.items;
            // if (data.length) {

            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].id,
            //             name: data[i].name,
            //             parent: data[i].id_cha,
            //         };
            //         if (data[i].id_danhmuc == 0) {
            //             await CateDetail.findOneAndUpdate({ _id: data[i].id_cha }, { $addToSet: { productShape: newItem } }, { upsert: true },)
            //         } else {
            //             await CateDetail.findOneAndUpdate({ _id: data[i].id_danhmuc }, { $addToSet: { productShape: newItem } }, { upsert: true },)
            //         }
            //     }
            //     page++;
            // } else {
            //     result = false;
            // }

            //4. giống pet
            // const response = await axios.post('https://raonhanh365.vn/api/select_ds_giongthucung.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // let data = response.data.data.items;
            // if (data.length) {

            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].id,
            //             name: data[i].giong_thucung,
            //             parent: data[i].id_cha,
            //         };

            //         await CateDetail.findOneAndUpdate({ _id: data[i].id_danhmuc }, { $addToSet: { petPurebred: newItem } }, { upsert: true },)

            //     }
            //     page++;
            // } else {
            //     result = false;
            // }

            //5. thông tin pet
            // const response = await axios.post('https://raonhanh365.vn/api/select_ds_ttthucung.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // let data = response.data.data.items;
            // if (data.length) {

            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].id,
            //             name: data[i].contents_name,
            //             type: data[i].type,
            //         };
            //         await CateDetail.findOneAndUpdate({ _id: data[i].id_danhmuc }, { $addToSet: { petInfo: newItem } }, { upsert: true },)
            //     }
            //     page++;
            // } else {
            //     result = false;
            // }
            // 6. xuất sứ
            // const response = await axios.post('https://raonhanh365.vn/api/select_ds_xuatxu.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // let data = response.data.data.items;
            // if (data.length) {

            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].id_xuatxu,
            //             name: data[i].noi_xuatxu,
            //             parent: data[i].id_parents,
            //         };
            //          await CateDetail.findOneAndUpdate({ _id: data[i].id_danhmuc }, { $addToSet: { origin: newItem } }, { upsert: true },)

            //     }
            //     page++;
            // } else {
            //     result = false;
            // }

            //7. dung lượng
            // let response = await axios.post('https://raonhanh365.vn/api/select_ds_dungluong.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // let data = response.data.data.items;
            // if (data.length) {
            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].id_dl,
            //             name: data[i].ten_dl,
            //             type: data[i].phan_loai,
            //             parent: data[i].id_cha,
            //         };
            //         await CateDetail.findOneAndUpdate({ _id: data[i].id_danhmuc }, { $addToSet: { capacity: newItem } }, { upsert: true },)
            //     }
            //     page++;
            // } else {
            //     result = false;
            // }

            // 8.màn hình 
            // const response = await axios.post('https://raonhanh365.vn/api/select_ds_manhinh.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // let data = response.data.data.items;
            // if (data.length) {

            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].id_manhinh,
            //             name: data[i].ten_manhinh,
            //             type: data[i].phan_loai,
            //             parent: data[i].id_cha,
            //         };
            //         await CateDetail.findOneAndUpdate({ _id: data[i].id_danhmuc }, { $addToSet: { screen: newItem } }, { upsert: true },)

            //     }
            //     page++;
            // } else {
            //     result = false;
            // }

            //9. bảo hành
            // const response = await axios.post('https://raonhanh365.vn/api/select_tbl_baohanh.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // let data = response.data.data.items;
            // if (data.length) {

            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].id_baohanh,
            //             warrantyTime: data[i].tgian_baohanh,
            //             parent: data[i].id_parents,
            //         };
            //         await CateDetail.findOneAndUpdate({ _id: data[i].id_danhmuc }, { $addToSet: { warranty: newItem } }, { upsert: true }, )
            //     }
            //     page++;
            // } else {
            //     result = false;
            // }

            //10.bộ vi xl
            // const response = await axios.post(' https://raonhanh365.vn/api/select_tbl_bovixuly.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // let data = response.data.data.items;
            // if (data.length) {

            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].bovi_id,
            //             name: data[i].bovi_ten,
            //         };
            //         await CateDetail.findOneAndUpdate({ _id: data[i].bovi_id_danhmuc }, { $addToSet: { processor: newItem } }, { upsert: true }, )

            //     }
            //     page++;
            // } else {
            //     result = false;
            // }

            // 11. năm sản xuất
            // const response = await axios.post('https://raonhanh365.vn/api/select_tbl_namsanxuat.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // let data = response.data.data.items;
            // if (data.length) {

            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].id,
            //             year: data[i].nam_san_xuat,
            //             parent: data[i].id_cha,
            //         };
            //         await CateDetail.findOneAndUpdate({ _id: data[i].id_danhmuc }, { $addToSet: { yearManufacture: newItem } }, { upsert: true }, )
            //     }
            //     page++;
            // } else {
            //     result = false;
            // }

            // 12. mau sac
            // const response = await axios.post(' https://raonhanh365.vn/api/select_tbl_mausac.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // let data = response.data.data.items;
            // if (data.length) {

            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].id_color,
            //             name: data[i].mau_sac,
            //             parent: data[i].id_parents,
            //         };
            //         await CateDetail.findOneAndUpdate({ _id: data[i].id_dm }, { $addToSet: { colors: newItem } }, { upsert: true }, )
            //     }
            //     page++;
            // } else {
            //     result = false;
            // }

            // 13.hãng
            // const response = await axios.post('https://raonhanh365.vn/api/select_tbl_hang.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // let data = response.data.data.items;
            // if (data.length) {

            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].id,
            //             name: data[i].ten_hang,
            //             parent: data[i].id_parent,
            //         };
            //         if (data[i].id_parent == 150 ||
            //             data[i].id_parent == 152 ||
            //             data[i].id_parent == 153 ||
            //             data[i].id_parent == 154) {
            //             await CateDetail.findOneAndUpdate({ _id: 61 }, { $addToSet: { brand: newItem } }, { upsert: true },)
            //         }else if(data[i].id_danhmuc == 0){
            //             await CateDetail.findOneAndUpdate({ _id: data[i].id_parent }, { $addToSet: { brand: newItem } }, { upsert: true },)
            //         }else{
            //             await CateDetail.findOneAndUpdate({ _id: data[i].id_danhmuc }, { $addToSet: { brand: newItem } }, { upsert: true },)
            //         }
            //     }
            //     page++;
            // } else {
            //     result = false;
            // }

            //14. dòng ( dòng của hãng)
            // const response = await axios.post('https://raonhanh365.vn/api/select_tbl_dong.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });

            // let data = response.data.data.items;
            // if (data.length) {
            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].id,
            //             name: data[i].ten_dong,
            //         };
            //         await CateDetail.findOneAndUpdate({ "brand": { $elemMatch: { "_id": data[i].id_hang } } }, { $push: { "brand.$.line": newItem } }, { new: true });

            //     }
            //     page++;
            // } else {
            //     result = false;
            // }

            // 15. tầng phòng
            // const response = await axios.post('https://raonhanh365.vn/api/select_tbl_tangphong.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // let data = response.data.data.items;
            // if (data.length) {

            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].id,
            //             quantity: data[i].so_luong,
            //             type: data[i].type_zoom,
            //         };
            //         await CateDetail.findOneAndUpdate({ _id: data[i].id_danhmuc }, { $addToSet: { storyAndRoom: newItem } }, { upsert: true }, )
            //     }
            //     page++;
            // } else {
            //     result = false;
            // }

            //16. Thể thao
            // const response = await axios.post('https://raonhanh365.vn/api/select_tbl_monthethao.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // let data = response.data.data.items;
            // if (data.length) {

            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].id,
            //             name: data[i].ten_mon,
            //             type: data[i].phan_loai,
            //         };
            //         await CateDetail.findOneAndUpdate({ _id: 74 }, { $addToSet: { sport: newItem } }, { upsert: true }, )
            //     }
            //     page++;
            // } else {
            //     result = false;
            // }


            //17. loại chung
            // const response = await axios.post('https://raonhanh365.vn/api/select_tbl_loaichung.php', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // let data = response.data.data.items;
            // if (data.length) {

            //     for (let i = 0; i < data.length; i++) {
            //         const newItem = {
            //             _id: data[i].id,
            //             name: data[i].ten_loai,
            //             parent: data[i].id_cha,
            //         };
            //         await CateDetail.findOneAndUpdate({ _id: data[i].id_danhmuc }, { $addToSet: { allType: newItem } }, { upsert: true },)
            //     }
            //     page++;
            // } else {
            //     result = false;
            // }

            console.log(page);
        } while (result);

        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message,)
    }
};


// bang gia
exports.toolPriceList = async (req, res, next) => {
    try {
        const element = req.body;
        await PriceList.findOneAndUpdate({ _id: Number(element.bg_id) }, {
            _id: element.bg_id,
            time: element.bg_thoigian,
            unitPrice: element.bg_dongia,
            discount: element.bg_chietkhau,
            intoMoney: element.bg_thanhtien,
            vat: element.bg_vat,
            intoMoneyVat: element.bg_ttien_vat,
            type: element.bg_type,
            cardGift: element.quatangthecao,
            newNumber: element.sotin
        }, { upsert: true, new: true });
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

// city
exports.toolCity = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post('https://raonhanh365.vn/api/select_city2.php', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const city = new CityRN({
                        _id: data[i].cit_id,
                        name: data[i].cit_name,
                        order: data[i].cit_order,
                        type: data[i].cit_type,
                        count: data[i].cit_count,
                        parentId: data[i].cit_parent
                    });
                    await CityRN.create(city);
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);

        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};


exports.toolLike = async (req, res, next) => {
    try {
        const element = req.body;
        await LikeRN.findOneAndUpdate({ _id: Number(element.lk_id) }, {
            _id: element.lk_id,
            forUrlNew: element.lk_for_url,
            type: element.lk_type,
            commentId: element.lk_for_comment,
            userName: element.lk_user_name,
            userAvatar: element.lk_user_avatar,
            userIdChat: element.lk_user_idchat,
            ip: element.lk_ip,
            time: element.lk_time,
        }, { upsert: true, new: true });
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};
//lich su nap the
exports.toolHistory = async (req, res, next) => {
    try {
        const element = req.body;
        await History.findOneAndUpdate({ _id: Number(element.his_id) }, {
            _id: element.his_id,
            userId: element.his_user_id,
            seri: element.his_seri,
            cardId: element.his_mathe,
            tranId: element.his_tranid,
            price: element.his_price,
            priceSuccess: element.his_price_suc,
            time: element.his_time,
            networkOperatorName: element.his_nhamang,
            bank: element.his_bank,
            bankNumber: element.his_bank_number,
            cardHolder: element.his_cardholder,
            type: element.his_type,
            status: element.his_status,
            content: element.noi_dung,
            countGetMoney: element.count_ntien,
            distinguish: element.his_pb,
        }, { upsert: true, new: true });


        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};
//tin ung tuyen
exports.toolApplyNew = async (req, res, next) => {
    try {
        const element = req.body;
        await ApplyNews.findOneAndUpdate({ _id: Number(element.id) }, {
            _id: element.id,
            uvId: element.uv_id,
            newId: element.new_id,
            time: Date(element.apply_time),
            status: element.status,
            note: element.note,
            isDelete: element.is_delete,
        }, { upsert: true, new: true });

        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};
// exports.toolComment = async (req, res, next) => {
//     try {
//         let page = 1;
//         let result = true;
//         await Comments.deleteMany({});
//         do {
//             const form = new FormData();
//             form.append('page', page);
//             const response = await axios.post('https://raonhanh365.vn/api/select_cm_comment.php', form, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             let data = response.data.data.items;
//             if (data.length > 0) {
//                 for (let i = 0; i < data.length; i++) {
//                     const cmt = new Comments({
//                         _id: data[i].cm_id,
//                         url: data[i].cm_url,
//                         parent_id: data[i].cm_parent_id,
//                         content: data[i].cm_comment,
//                         img: data[i].cm_img,
//                         sender_idchat: data[i].cm_sender_idchat,
//                         tag: data[i].cm_tag,
//                         ip: data[i].cm_ip,
//                         time: data[i].cm_time,
//                         active: data[i].cm_active,
//                         pb: data[i].cm_pb,
//                         id_dh: data[i].id_dh,
//                         unit: data[i].cm_unit,
//                         id_new: data[i].id_new,
//                     });
//                     await Comments.create(cmt);
//                 }
//                 page++;
//             } else {
//                 result = false;
//             }
//             console.log(page);
//         } while (result);

//         return fnc.success(res, "Thành công");
//     } catch (error) {
//         return fnc.setError(res, error.message);
//     }
// };

//tag index
// exports.toolTagsIndex = async (req, res, next) => {
//     try {
//         let page = 1;
//         let result = true;
//         do {
//             const form = new FormData();
//             form.append('page', page);
//             const response = await axios.post('https://raonhanh365.vn/api/select_history.php', form, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             let data = response.data.data.items;
//             if (data.length > 0) {
//                 for (let i = 0; i < data.length; i++) {
//                     const history = new History({
//                         _id: data[i].his_id,
//                         userId: data[i].his_user_id,
//                         seri: data[i].his_seri,
//                         cardId: data[i].his_mathe,
//                         tranId: data[i].his_tranid,
//                         price: data[i].his_price,
//                         priceSuccess: data[i].his_price_suc,
//                         time: data[i].his_time,
//                         networkOperatorName: data[i].his_nhamang,
//                         bank: data[i].his_bank,
//                         bankNumber: data[i].his_bank_number,
//                         cardHolder: data[i].his_cardholder,
//                         type: data[i].his_type,
//                         status: data[i].his_status,
//                         content: data[i].noi_dung,
//                         countGetMoney: data[i].count_ntien,
//                         distinguish: data[i].his_pb,
//                     });

//                     await History.create(history);
//                 }
//                 page++;
//             } else {
//                 result = false;
//             }
//             console.log(page);
//         } while (result);

//         return fnc.success(res, "Thành công");
//     } catch (error) {
//         return fnc.setError(res, error.message);
//     }
// };
exports.toolApplyNew = async (req, res, next) => {
    try {
        const element = req.body;
        await ApplyNews.findOneAndUpdate({ _id: Number(element.id) }, {
            _id: element.id,
            uvId: element.uv_id,
            newId: element.new_id,
            time: element.apply_time,
            status: element.status,
            note: element.note,
            isDelete: element.is_delete,
        }, { upsert: true, new: true });


        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};
exports.toolComment = async (req, res, next) => {
    try {
        const element = req.body;
        await Comments.findOneAndUpdate({ _id: Number(element.cm_id) }, {
            _id: element.cm_id,
            url: element.cm_url,
            parent_id: element.cm_parent_id,
            content: element.cm_comment,
            img: element.cm_img,
            sender_idchat: element.cm_sender_idchat,
            tag: element.cm_tag,
            ip: element.cm_ip,
            time: element.cm_time,
            active: element.cm_active,
            pb: element.cm_pb,
            id_dh: element.id_dh,
            unit: element.cm_unit,
            id_new: element.id_new,
        }, { upsert: true, new: true });


        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.updateInfoSell = async (req, res, next) => {
    try {
        const element = req.body;
        let check = await New.findOneAndUpdate({ _id: Number(element.id_new) }, {
            $set: {
                'infoSell.groupType': element.nhom_phan_loai,
                'infoSell.classify': element.phan_loai,
                'infoSell.numberWarehouses': element.so_luong_kho,
                'infoSell.promotionType': element.loai_khuyenmai,
                'infoSell.promotionValue': element.giatri_khuyenmai,
                'infoSell.transport': element.van_chuyen,
                'infoSell.transportFee': element.phi_van_chuyen,
                'infoSell.productValue': element.gia_sanpham_xt,
                'infoSell.untilMoney': element.donvi_tien_xt,
                'infoSell.untilTranpost': element.donvi_tien_vc,
            }
        });
        if (!check) return fnc.setError(res, 'Không tìm thấy tin', 404)
        await fnc.success(res, 'thành công');
    } catch (err) {
        console.log(err);
        return fnc.setError(res, err)
    }
}

// danh mục sản phẩm
exports.toolPriceList = async (req, res, next) => {
    try {
        const element = req.body;
        await PriceList.findOneAndUpdate({ _id: Number(element.bg_id) }, {
            _id: element.bg_id,
            time: element.bg_thoigian,
            unitPrice: element.bg_dongia,
            discount: element.bg_chietkhau,
            intoMoney: element.bg_thanhtien,
            vat: element.bg_vat,
            intoMoneyVat: element.bg_ttien_vat,
            type: element.bg_type,
            cardGift: element.bg_type,
            langId: element.quatangthecao,
            newNumber: element.sotin
        }, { upsert: true, new: true });
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolTagsIndex = async (req, res, next) => {
    try {
        const element = req.body;
        await TagsIndex.findOneAndUpdate({ _id: element.id }, {
            _id: element.id,
            link: element.duong_dan,
            cateId: element.id_cate,
            tags: element.tags,
            city: element.city,
            district: element.dis_id,
            tagsVL: element.tags_vl,
            job: element.job,
            time: element.thoi_gian,
            active: element.di_active,
            classify: element.phan_loai
        }, { upsert: true, new: true });


        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};


exports.toolAdminUserRight = async (req, res, next) => {
    try {
        const element = req.body;
        let check = await AdminUserRight.findOne({
            adminId: element.adu_admin_id,
            moduleId: element.adu_admin_module_id
        }).lean();
        if (!check) var id = await fnc.getMaxID(AdminUserRight) + 1 || 1;
        else var id = check._id;
        await AdminUserRight.findOneAndUpdate(
            {
                adminId: element.adu_admin_id,
                moduleId: element.adu_admin_module_id
            },
            {
                _id: id,
                adminId: element.adu_admin_id,
                moduleId: element.adu_admin_module_id,
                add: element.adu_add,
                edit: element.adu_edit,
                delete: element.adu_delete
            }, { upsert: true, new: true });


        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};


exports.toolBidding = async (req, res, next) => {
    try {
        const element = req.body;
        let _id = element.id;
        let newId = element.new_id;
        let userID = element.user_id;
        let userName = element.user_name;
        let userIntro = element.user_intro;
        let userFile = element.user_file;
        let userProfile = element.user_profile;
        let userProfileFile = element.user_profile_file;
        let productName = element.product_name;
        let productDesc = element.product_desc;
        let productLink = element.product_link;
        let price = element.price;
        let priceUnit = element.price_unit;
        let promotion = element.promotion;
        let promotionFile = element.promotion_file;
        let status = element.status;
        let createTime = element.create_time;
        let note = element.note;

        await Bidding.findOneAndUpdate({ _id: Number(element.id) },
            {
                _id,
                newId,
                userID,
                userName,
                userIntro,
                userFile,
                userProfile,
                userProfileFile,
                productName,
                productDesc,
                productLink,
                price,
                priceUnit,
                promotion,
                promotionFile,
                status,
                createTime,
                note
            }, { upsert: true, new: true });
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};


exports.toolAdminMenuOrder = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        let id = 1;
        await AdminMenuOrder.deleteMany({});
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post('https://raonhanh365.vn/api/select_admin_menu_order.php', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            let data = response.data.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const adminMenuOrder = new AdminMenuOrder({
                        _id: id++,
                        adminId: element.amo_admin,
                        moduleId: data[i].amo_module,
                        order: data[i].amo_order
                    });
                    await AdminMenuOrder.create(adminMenuOrder);
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);

        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolModule = async (req, res, next) => {
    try {
        const element = req.body;
        await Module.findOneAndUpdate({ _id: Number(element.mod_id) }, {
            _id: element.mod_id,
            name: element.mod_name,
            path: element.mod_path,
            listName: element.mod_listname,
            listFile: element.mod_listfile,
            order: element.mod_order,
            help: element.mod_help,
            langId: element.lang_id,
            checkLoca: element.mod_checkloca,
        }, { upsert: true, new: true });
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolOrder = async (req, res, next) => {
    try {
        const element = req.body;
        await OrderRN.findOneAndUpdate({ _id: Number(element.dh_id) }, {
            _id: element.dh_id,
            sellerId: element.id_nguoi_ban,
            buyerId: element.id_nguoi_dh,
            name: element.hoten_nm,
            phone: element.sdt_lienhe,
            paymentMethod: element.phuongthuc_tt,
            deliveryAddress: element.dia_chi_nhanhang,
            newId: element.id_spham,
            codeOrder: element.ma_dhang,
            quantity: element.so_luong,
            classify: element.phan_loai,
            unitPrice: element.don_gia,
            promotionType: element.loai_km,
            promotionValue: element.giatri_km,
            shipType: element.van_chuyen,
            shipFee: element.phi_vanchuyen,
            note: element.ghi_chu,
            paymentType: element.loai_ttoan,
            bankName: element.ten_nganhang,
            amountPaid: element.tien_ttoan,
            totalProductCost: element.tong_tien_sp,
            buyTime: new Date(element.tgian_xacnhan * 1000),
            status: element.trang_thai,
            sellerConfirmTime: element.tgian_xnbh,
            deliveryStartTime: element.tgian_giaohang,
            totalDeliveryTime: element.tgian_dagiao,
            buyerConfirm: element.xnhan_nmua,
            buyerConfirmTime: element.tgian_nmua_nhhang,
            deliveryEndTime: element.tgian_htat,
            deliveryFailedTime: element.tgian_ghthatbai,
            deliveryFailureReason: element.lydo_ghtbai,
            cancelerId: element.id_nguoihuy,
            orderCancellationTime: element.tgian_huydhang,
            orderCancellationReason: element.ly_do_hdon,
            buyerCancelsDelivered: element.nguoimua_huydh,
            buyerCancelsDeliveredTime: element.tgian_nmua_huy,
            orderActive: element.dh_active,
            distinguish: element.phan_biet
        }, { upsert: true, new: true });


        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolEvaluate = async (req, res, next) => {
    try {
        const element = req.body;
        await Evaluate.findOneAndUpdate({ _id: Number(element.eva_id) }, {
            _id: element.eva_id,
            newId: element.new_id,
            userId: element.user_id,
            blUser: element.bl_user,
            parentId: element.eva_parent_id,
            stars: element.eva_stars,
            comment: element.eva_comment,
            time: element.eva_comment_time,
            active: element.eva_active,
            showUsc: element.eva_show_usc,
            csbl: element.da_csbl,
            csuaBl: element.eva_csua_bl,
            tgianHetcs: element.tgian_hetcs
        }, { upsert: true, new: true });
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolCart = async (req, res, next) => {
    try {
        const element = req.body;
        await Cart.findOneAndUpdate({ _id: Number(element.id) }, {
            _id: element.id,
            userId: element.user_id,
            newsId: element.new_id,
            type: element.phan_loai,
            quantity: element.so_luong,
            unit: element.don_gia,
            tick: element.da_chon,
            total: element.tongtien_sp,
            date: element.ngay_dathang,
            status: element.trang_thai
        }, { upsert: true, new: true });


        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolTags = async (req, res, next) => {
    try {
        const element = req.body;
        await Tags.findOneAndUpdate({ _id: Number(element.tags_id) }, {
            _id: element.tags_id,
            name: element.ten_tags,
            parentId: element.id_parent,
            typeTags: element.type_tags,
            cateId: element.id_danhmuc,
            type: element.type
        }, { upsert: true, new: true });
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolContact = async (req, res, next) => {
    try {
        const element = req.body;
        await Contact.findOneAndUpdate({ _id: Number(element.lienhe_id) }, {
            _id: element.lienhe_id,
            name: element.lienhe_name,
            address: element.lienhe_diachi,
            phone: element.lienhe_phone,
            email: element.lienhe_email,
            content: element.lienhe_noidung,
            date: Date(element.lienhe_date),
            type: element.lienhe_type,
        }, { upsert: true, new: true });
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolRegisterFail = async (req, res, next) => {
    try {
        const element = req.body;
        await RegisterFail.findOneAndUpdate({ _id: Number(element.id) }, {
            _id: element.id,
            phone: element.so_dthoai,
            email: element.email,
            emailHt: element.email_ht,
            name: element.ho_ten,
            mk: element.mat_khau,
            time: new Date(element.tgian_dky * 1000),
            err: element.loi_dky,
            type: element.type
        }, { upsert: true, new: true });
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolSearch = async (req, res, next) => {
    try {
        const element = req.body;
        await Search.findOneAndUpdate({ _id: Number(element.id) }, {
            _id: element.id,
            keySearch: element.key_search,
            userId: element.user_id,
            createdAt: element.created_at,
            count: element.count_search,
            buySell: element.buy_sell
        }, { upsert: true, new: true });
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolTblTags = async (req, res, next) => {
    try {
        const element = req.body;
        await TblTags.findOneAndUpdate({ _id: element.tag_id }, {
            _id: element.tag_id,
            keyword: element.tag_keyword,
            link: element.tag_link,
        }, { upsert: true, new: true });


        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolPushNewsTime = async (req, res, next) => {
    try {
        const element = req.body;
        await PushNewsTime.findOneAndUpdate({ _id: Number(element.id) }, {
            _id: element.id,
            time: element.thoi_gian
        }, { upsert: true, new: true });
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};


exports.toolBlog = async (req, res, next) => {
    try {
        const element = req.body;
        await Blog.findOneAndUpdate({ _id: Number(element.new_id) }, {
            _id: element.new_id,
            adminId: element.admin_id,
            langId: element.lang_id,
            title: element.new_title,
            url: element.new_url,
            titleRewrite: element.new_title_rewrite,
            image: element.new_picture,
            imageWeb: element.new_picture_web,
            teaser: element.new_teaser,
            keyword: element.new_keyword,
            sapo: element.new_sapo,
            des: element.new_description,
            sameId: element.new_same_id,
            search: element.new_search,
            source: element.new_source,
            cache: element.new_cache,
            link: element.new_link,
            linkMd5: element.new_link_md5,
            categoryId: element.new_category_id,
            vgId: element.new_vg_id,
            status: element.new_stt,
            date: element.new_date,
            adminEdit: element.new_admin_edit,
            dateLastEdit: element.new_date_last_edit,
            order: element.new_order,
            totalVoteYes: element.news_total_vote_yes,
            totalVoteNo: element.news_total_vote_no,
            hit: element.new_hits,
            active: element.new_active,
            hot: element.new_hot,
            new: element.new_new,
            toc: element.new_toc,
            auto: element.new_auto,
            titleRelate: element.title_relate,
            contentRelate: element.content_relate,
        }, { upsert: true, new: true });

        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
}

exports.toolAdminUser = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.adm_id);
        await AdminUser.findOneAndUpdate({ _id: id }, {
            _id: element.adm_id,
            loginName: element.adm_loginname,
            password: element.adm_password,
            name: element.adm_name,
            email: element.adm_email,
            address: element.adm_address,
            phone: element.adm_phone,
            mobile: element.adm_mobile,
            accessModule: element.adm_access_module,
            accessCategory: element.adm_access_category,
            date: element.adm_date,
            isAdmin: element.adm_isadmin,
            active: element.adm_active,
            langId: element.lang_id,
            delete: element.adm_delete,
            allCategory: element.adm_all_category,
            editAll: element.adm_edit_all,
            adminId: element.admin_id,
            department: element.adm_bophan,
            empId: element.emp_id,
            employer: element.adm_ntd,
        }, { upsert: true, new: true });

        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

exports.toolAdminTranslate = async (req, res, next) => {
    try {
        const element = req.body;
        let id = 0;
        let check = await AdminTranslate.findOne({ tra_keyword: element.tra_keyword }).lean();
        if (check) id = check.id;
        else id = await fnc.getMaxID(AdminTranslate) + 1 || 1;
        await AdminTranslate.findOneAndUpdate({ tra_keyword: element.tra_keyword }, {
            _id: id,
            tra_keyword: element.tra_keyword,
            tra_text: element.tra_text,
            langId: element.lang_id,
            tra_source: element.tra_source,
        }, { upsert: true, new: true });
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
};

// exports.toolBaoHanh = async (req, res, next) => {
//     try {
//         let page = 1;
//         let result = true;
//         let id = 1;
//         await AdminTranslate.deleteMany({});
//         do {
//             const form = new FormData();
//             form.append('page', page);
//             const response = await axios.post('https://raonhanh365.vn/api/select_admin_translate.php', form, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             let data = response.data.data.items;
//             if (data.length > 0) {
//                 for (let i = 0; i < data.length; i++) {
//                     await AdminTranslate.findOneAndUpdate({
//                         _id: i++,
//                         tra_keyword: data[i].tra_keyword,
//                         tra_text: data[i].tra_text,
//                         langId: data[i].lang_id,
//                         tra_source: data[i].tra_source,
//                     });
//                     await AdminTranslate1.save();
//                 }
//                 page++;
//             } else {
//                 result = false;
//             }
//             console.log(page);
//         } while (result);

//         return fnc.success(res, "Thành công");
//     } catch (error) {
//         return fnc.setError(res, error.message);
//     }
// }

exports.toolLoveNew = async (req, res, next) => {
    try {
        const element = req.body;
        await loveNew.findOneAndUpdate({ _id: Number(element.id) }, {
            _id: element.id,
            id_new: element.new_id,
            id_user: element.user_id,
            usc_type: element.usc_type,
            createdAt: element.tgian_thich,
        }, { upsert: true, new: true });


        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
}

exports.toolCateVl = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.cat_id);
        await CateVl.findOneAndUpdate({ _id: id }, {
            _id: element.cat_id,
            name: element.cat_name,
            lq: element.cat_lq,
            ut: element.cat_ut,
            active: element.cat_active,
        }, { upsert: true, new: true });


        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
}
exports.toolPhuongXa = async (req, res, next) => {
    try {
        let page = 1;
        let result = true;
        let id = 1;
        await PhuongXa.deleteMany({});
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post('https://raonhanh365.vn/api/select_tbl_phuong_xa.php', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            let data = response.data.data.items;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const loveNew1 = new PhuongXa({
                        _id: data[i].id,
                        name: data[i].name,
                        prefix: data[i].prefix,
                        province_id: data[i].province_id,
                        district_id: data[i].district_id,
                    });
                    await loveNew1.save();
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);

        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
}

exports.toolbanggiacknt = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        await NetworkOperator.findOneAndUpdate({ _id: id }, {
            _id: element.id,
            operator: element.nha_mang,
            operatorName: element.ten_nhmang,
            discount: element.chiet_khau,
            active: element.bg_active,
        }, { upsert: true, new: true });

        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
}

exports.toolkeyword = async (req, res, next) => {
    try {
        const element = req.body;
        await Keyword.findOneAndUpdate({ key_id: element.key_id }, {
            key_id: element.key_id,
            key_name: element.key_name,
            key_lq: element.key_lq,
            key_cate_id: element.key_cate_id,
            key_city_id: element.key_city_id,
            key_qh_id: element.key_qh_id,
            key_city_id: element.key_city_id,
            key_cb_id: element.key_cb_id,
            key_teaser: element.key_teaser,
            key_type: element.key_type,
            key_err: element.key_err,
            key_qh_kcn: element.key_qh_kcn,
            key_cate_lq: element.key_cate_lq,
            key_tit: element.key_tit,
            key_desc: element.key_desc,
            key_key: element.key_key,
            key_h1: element.key_h1,
            key_time: element.key_time,
            key_301: element.key_301,
            key_index: element.key_index,
            key_bao_ham: element.key_bao_ham,
            key_tdgy: element.key_tdgy,
            key_ndgy: element.key_ndgy,
        }, { upsert: true, new: true });

        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
}

exports.imageDeplicate = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        await ImageDeplicate.findOneAndUpdate({ id }, {
            id: element.id,
            usc_id: element.usc_id,
            img_check: element.img_check,
            list_img_dep: element.list_img_dep,
            new_id: element.new_id,
            create_time: element.create_time,
            active: element.active,
        }, { upsert: true, new: true });
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
}

exports.baoCao = async (req, res, next) => {
    try {
        const element = req.body;
        let id = Number(element.id);
        await BaoCao.findOneAndUpdate({ _id: id }, {
            _id: element.id,
            new_baocao: element.new_baocao,
            user_baocao: element.user_baocao,
            new_user: element.new_user,
            tgian_baocao: element.tgian_baocao,
            van_de: element.van_de,
            mo_ta: element.mo_ta,
            da_xuly: element.da_xuly,
        }, { upsert: true, new: true });
        return fnc.success(res, "Thành công");
    } catch (error) {
        return fnc.setError(res, error.message);
    }
}

exports.idRaoNhanh365 = async (req, res, next) => {
    try {
        const element = req.body;

        let check = await User.findById(element.idchat).lean();
        if (check) {
            await User.findByIdAndUpdate(element.idchat, {
                idRaoNhanh365: element.idRaoNhanh365,
                inforRN365: {
                    cccd: element.cccd,
                    cccdFrontImg: element.cccdFrontImg,
                    cccdBackImg: element.cccdBackImg,
                    bankName: element.bankName,
                    stk: element.stk,
                    xacThucLienket: element.xacThucLienket,
                    store_name: element.store_name,
                    store_phone: element.store_phone,
                    ownerName: element.ownerName,
                    time: element.time,
                    active: element.active,
                    money: element.money,
                    usc_tax_code: element.usc_tax_code,
                    usc_des: element.usc_des,
                }
            })
            return fnc.success(res, `Cập nhật id rao nhanh 365 vào user ${element.idchat} thành công`)
        }
        return fnc.setError(res, 'Không tìm thấy id chat');

    } catch (error) {
        return fnc.setError(res, error.message);
    }
};