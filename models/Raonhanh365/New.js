const mongoose = require('mongoose');
const newSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    userID: {
        // id người đăng
        type: Number,
        required: true
    },
    title: {
        // tiêu đề
        type: String,
        default: null
    },
    linkTitle: {
        // link tiêu đề
        type: String,
        default: 0
    },
    money: {
        // giá tiền đăng
        type: String,
        default: "",
    },
    endvalue: {
        // Giá sàn kết thúc
        type: Number,
        default: 0
    },
    downPayment: {
        // tiền đặt cọc
        type: Number,
        default: 0
    },
    dc_unit: {
        type: Number,
        default: 0
    },
    until: {
        // loại tiền
        type: Number,
        default: 1
    },
    cateID: {
        // danh mục của bài đăng
        type: Number,
        default: 0
    },
    type: {
        // 1 công ty 0 là cá nhân
        type: Number,
        default: 0
    },
    chat_lieu: {
        type: String
    },
    video: {
        // video của bài viết
        type: String,
        default: null
    },
    buySell: {
        // 1 là tin mua 2 là tin bán
        type: Number,
        default: 0
    },
    createTime: {
        // Thời gian tạo
        type: Date,
        default: null
    },
    updateTime: {
        // Thời gian cập nhập
        type: Date,
        default: null
    },
    active: {
        // kích hoạt
        type: Number,
        default: 1
    },
    detailCategory: {
        // chi tiết danh mục
        type: Number,
        default: 0
    },
    viewCount: {
        // số view
        type: Number,
        default: 0
    },
    name: {
        // tên người mua/bán
        type: String,
        default: null
    },
    phone: {
        // số điện thoại người mua/bán
        type: String,
        default: null
    },
    email: {
        // email người mua/bán
        type: String,
        default: null
    },
    address: [{
        // địa chỉ người mua/bán
        type: String,
        default: null
    }],
    city: {
        // mã thành phố
        type: Number,
        default: 0
    },
    district: {
        // quận huyện
        type: Number,
        default: 0
    },
    ward: {
        // phường xã
        type: Number,
        default: 0
    },
    apartmentNumber: {
        // số nhà
        type: String,
        default: 0
    },
    status: {
        // tình trạng  0 đã tìm ứng viên, 1 tìm ứng viên
        type: Number,
        default: 0
    },
    the_tich: {
        type: Number,
        default: 0
    },
    warranty: {
        // bảo hành
        type: Number,
        default: 0
    },
    free: {
        // cho tặng miễn phí
        type: Number,
        default: 0
    },
    sold: {
        // đã bán
        type: Number,
        default: 0
    },
    timeSell: {
        // thời gian bán
        type: Date,
        default: null
    },
    pinHome: {
        // Ghim tin trên trang chủ 
        type: Number,
        default: 0
    },
    pinCate: {
        // ghim tin trên Trang ngày
        type: Number,
        default: 0
    },
    pushHome: {
        type: Number,
        default: 0
    },
    refresh_new_home: {
        type: Number,
        default: 0
    },
    timePushNew: {
        // thời gian đẩy tin 
        type: Date,
        default: null
    },
    new_day_tin: {
        type: String,
        default: null
    },
    timeStartPinning: {
        // thời gian bắt đầu ghim
        type: Number,
        default: null
    },
    dayStartPinning: {
        // ngày bắt đầu ghim
        type: Number,
        default: null
    },
    dayEndPinning: {
        // ngày kết thúc ghim
        type: Number,
        default: null
    },
    numberDayPinning: {
        // số ngày ghim
        type: Number,
        default: 0
    },
    timePinning: {
        // thời gian ghim
        type: Number,
        default: 0
    },
    moneyPinning: {
        // tiền ghim
        type: Number,
        default: 0
    },
    countRefresh: {
        // số lần làm mới trong ngày
        type: Number,
        default: 0
    },
    authen: {
        // xac thuc
        type: Number,
        default: 0
    },
    pinCount: {
        // số lượng tin ghim
        type: Number,
        default: 0
    },
    refreshTime: {
        // thời gian làm mới
        type: Number,
        default: 0
    },
    timeHome: {
        // thời gian ghim trên trang chủ
        type: Number,
        default: 0
    },
    timeCate: {
        // thời gian ghim tren trang ngày
        type: Number,
        default: 0
    },
    quantitySold: {
        // số lượng đã bán
        type: Number,
        default: 0
    },
    totalSold: {
        // tổng số lượng
        type: Number,
        default: 0
    },
    quantityMin: {
        // sô lượng nhỏ nhất
        type: Number,
        default: 0
    },
    quantityMax: {
        // sô lượng lớn nhất
        type: Number,
        default: 0
    },
    com_city: {
        type: Number,
        default: 0
    },
    com_district: {
        type: Number,
        default: 0
    },
    com_ward: {
        type: Number,
        default: 0
    },
    com_address_num: {
        type: Number,
        default: 0
    },
    timePromotionStart: {
        // thời gian khuyến mãi bắt đầu
        type: Number,
        default: 0
    },
    timePromotionEnd: {
        // thời gian khuyến mãi kết thúc
        type: Number,
        default: 0
    },
    productType: {
        // loại sản phẩm 
        type: Number,
        default: 0
    },
    productGroup: {
        // nhóm sản phẩm
        type: Number,
        default: 0
    },
    poster: {
        // 0 là cá nhân 1 là môi giới 
        type: Number,
        default: 0
    },
    img: [{
        // danh sách ảnh
        _id: Number,
        nameImg: {
            type: String,
            default: null
        },
    }],
    // chi tiết sản phẩm mua/bán
    description: {
        // mô tả
        type: String,
        default: null
    },
    hashtag: {
        // 
        type: String,
        default: null
    },
    order: {
        type: Number
    },
    kiem_duyet: {
        type: Number,
        default: 0
    },
    duplicate: {
        type: String,
        default: ""
    },
    brand: {
        // hãng
        type: String,
        default: 0
    },
    kich_co: {
        type: String,
        default: 0
    },
    mon_the_thao: {
        type: String,
        default: 0
    },
    // đô điện tử
    electroniceDevice: {
        microprocessor: {
            // bộ vi xử lý
            type: String,
            default: 0
        },
        ram: {
            // ram 
            type: String,
            default: 0
        },
        hardDrive: {
            // ở cứng
            type: String,
            default: 0
        },
        typeHardrive: {
            // loại ổ cứng
            type: String,
            default: 0
        },
        screen: {
            // màn hình
            type: String,
            default: 0
        },
        size: {
            // kích cỡ
            type: String,
            default: 0
        },

        machineSeries: {
            // dòng máy
            type: String,
            default: 0
        },
        device: {
            type: String,
            default: 0
        },
        capacity: {
            type: String,
            default: 0
        },
        sdung_sim: {
            type: String,
            default: 0
        },
        phien_ban: {
            type: String,
            default: 0
        },
        knoi_internet: {
            type: String,
            default: 0
        },
        do_phan_giai: {
            type: String,
            default: 0
        },
        cong_suat: {
            type: String,
            default: 0
        }
    },
    // xe cộ
    vehicle: {
        loai_xe: {
            type: String,
            default: 0
        },
        xuat_xu: {
            type: String,
            default: 0
        },
        mau_sac: {
            type: String,
            default: 0
        },
        chat_lieu_khung: {
            type: String,
            default: 0
        },
        dong_xe: {
            type: String,
            default: 0
        },
        nam_san_xuat: {
            type: String,
            default: 0
        },
        dung_tich: {
            type: Number,
            default: 0
        },
        td_bien_soxe: {
            type: String,
            default: 0
        },
        phien_ban: {
            type: String,
            default: 0
        },
        hop_so: {
            type: String,
            default: 0
        },
        nhien_lieu: {
            type: String,
            default: 0
        },
        kieu_dang: {
            type: String,
            default: 0
        },
        so_cho: {
            type: String,
            default: 0
        },
        trong_tai: {
            type: String,
            default: 0
        },
        loai_linhphu_kien: {
            type: String,
            default: 0
        },
        so_km_da_di: {
            type: String,
            default: 0
        },
        loai_noithat: {
            type: String,
            default: 0
        },

    },
    // bất động sản
    realEstate: {
        ten_toa_nha: {
            type: String,
            default: null
        },
        td_macanho: {
            type: String,
            default: null
        },
        ten_phan_khu: {
            type: String,
            default: null
        },
        td_htmch_rt: {
            // Hiển thị mã căn hộ rao tin
            type: String,
            default: 0
        },
        so_pngu: {
            type: String,
            default: 0
        },
        so_pve_sinh: {
            type: String,
            default: 0
        },
        tong_so_tang: {
            type: String,
            default: 0
        },
        huong_chinh: {
            type: String,
            default: 0
        },
        giay_to_phap_ly: {
            type: String,
            default: 0
        },
        tinh_trang_noi_that: {
            type: String,
            default: 0
        },
        dac_diem: {
            type: String,
            default: 0
        },
        dien_tich: {
            type: String,
            default: 0
        },
        dientichsd: {
            type: String,
            default: 0
        },
        chieu_dai: {
            type: String,
            default: 0
        },
        chieu_rong: {
            type: String,
            default: 0
        },
        tinh_trang_bds: {
            type: String,
            default: 0
        },
        td_block_thap: {
            type: String,
            default: null
        },
        tang_so: {
            type: String,
            default: 0
        },
        loai_hinh_canho: {
            type: String,
            default: 0
        },
        loaihinh_vp: {
            type: String,
            default: 0
        },
        loai_hinh_dat: {
            type: String,
            default: 0
        },
        kv_thanhpho: {
            type: String,
            default: 0
        },
        kv_quanhuyen: {
            type: String,
            default: 0
        },
        kv_phuongxa: {
            type: String,
            default: 0
        },
        can_ban_mua: {
            type: Number,
            default: 0
        },
        dia_chi: {
            type: String,
            default: 0
        },
        huong_ban_cong: {
            type: String,
            default: 0
        },
        cangoc: {
            type: String,
            default: 0
        }
    },
    //ship
    ship: {
        product: {
            // Loại hàng hóa giao
            type: Number,
            default: 0
        },
        timeStart: {
            // thời gian bắt đâu
            type: Date,
            default: null
        },
        timeEnd: {
            // thời gian kết thúc
            type: Date,
            default: null
        },
        allDay: {
            // Cả ngày
            type: Number,
            default: 0
        },
        vehicleType: {
            // loại xe
            type: Number,
            default: 0
        },
    },
    // sức khoẻ - sắc đẹp
    beautifull: {
        loai_hinh_sp: {
            type: String,
            default: 0
        },
        han_su_dung: {
            type: String,
            default: 0
        },
    },
    // đồ gia dụng
    wareHouse: {
        loai_thiet_bi: {
            type: String,
            default: 0
        },
        cong_suat: {
            type: String,
            default: 0
        },
        dung_tich: {
            type: String,
            default: 0
        },
        khoiluong: {
            type: String,
            default: 0
        },
        loai_chung: {
            type: String,
            default: 0
        },
    },
    // thú cưng
    pet: {
        kindOfPet: {
            // loại thú cưng
            type: String,
            default: null
        },
        age: {
            // độ tuổi
            type: String,
            default: null
        },
        gender: {
            // giới tính
            type: String,
            default: null
        },
        weigth: {
            // khối lượng
            type: String,
            default: null
        },
    },
    // tìm việc
    Job: {
        jobType: {
            // ngành nghề
            type: String,
            default: 0
        },
        jobDetail: {
            // chi thiet cong việc
            type: String,
            default: 0
        },

        jobKind: {
            // hình thức làm việc
            type: String,
            default: 0
        },
        minAge: {
            // tuổi nhỏ nhất
            type: String,
            default: 0
        },
        maxAge: {
            // tuổi lớn nhất
            type: String,
            default: 0
        },
        salary: {
            // luong
            type: String,
            default: 0
        },
        gender: {
            // luong
            type: Number,
            default: 0
        },
        exp: {
            // kinh nghiệm
            type: String,
            default: 0
        },
        level: {
            // chứng chỉ
            type: String,
            default: 0
        },
        degree: {
            // bang cap
            type: String,
            default: 0
        },
        skill: {
            // kỹ năng 
            type: String,
            default: 0
        },
        quantity: {
            // số lượng tuyển
            type: String,
            default: 0
        },
        city: {
            // thành phố
            type: String,
            default: 0
        },
        district: {
            // quận huyện
            type: String,
            default: 0
        },
        ward: {
            type: String,
            default: 0
        },
        addressNumber: {
            // số nhà
            type: String,
            default: 0
        },
        payBy: {
            // hình thức trả lương
            type: String,
            default: 0
        },

        benefit: {
            // quyền lợi
            type: String,
            default: 0
        },
        cv: {
            type: String,
            default: 0
        }
    },
    noiThatNgoaiThat: {
        hinhdang: {
            type: String,
            default: 0
        },
    },
    // thông tin bán hàng
    infoSell: {
        groupType: {
            // nhóm phân loại
            type: String,
            default: null
        },
        // phân loại 
        classify: {
            type: String,
            default: null
        },
        loai: {
            type: String,
            default: null
        },
        numberWarehouses: {
            // số lượng kho
            type: String,
            default: null
        },
        promotionType: {
            // loại khuyến mãi
            type: Number,
            default: 0,
        },
        promotionValue: {
            // giá trị khuyến mãi
            type: Number,
            default: null
        },
        transport: {
            // vận chuyển
            type: Number,
            default: 0
        },
        transportFee: {
            // phí vận chuyển
            type: String,
            default: null
        },
        productValue: {
            //  giá tiền theo từng sản phẩm 
            type: String,
            default: null,
        },
        untilMoney: {
            // đơn vị tiền theo từng loại sản phẩm
            type: String,
            default: null
        },
        untilTranpost: {
            // đơn vị tiền vận chuyển
            type: Number,
            default: 0
        },
        tgian_bd: {
            type: Date,
            default: null
        },
        tgian_kt: {
            type: Date,
            default: null
        },
        dia_chi: {
            type: String
        }
    },
    bidding: {
        han_bat_dau: {
            type: Date,
            default: null
        },
        han_su_dung: {
            type: Date,
            default: null
        },
        new_job_kind: {
            type: Number,
            default: null
        },
        new_file_dthau: {
            type: String,
            default: null
        },
        noidung_nhs: {
            type: String,
            default: null
        },
        new_file_nophs: {
            type: String,
            default: null
        },
        noidung_chidan: {
            type: String,
            default: null
        },
        new_file_chidan: {
            type: String,
            default: null
        },
        donvi_thau: {
            type: String,
            default: null
        },
        phi_duthau: {
            type: String,
            default: null
        },
        file_mota: {
            type: String,
            default: null
        },
        file_thutuc: {
            type: String,
            default: null
        },
        file_hoso: {
            type: String,
            default: null
        }
    }

}, {
    collection: 'RN365_News',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("RN365_News", newSchema);