const mongoose = require('mongoose');
const axios = require('axios');
const FormData = require('form-data');

let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');
const UserSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        autoIncrement: true,
    },
    email: {
        // Email đăng nhập (nếu đối tượng đăng ký bằng email)
        type: String,
        default: null,
    },
    phoneTK: {
        // Sđt đăng nhập (nếu đối tượng đăng ký bằng sđt)
        type: String,
        default: null,
    },
    userName: {
        // Tên của đối tượng
        type: String,
        required: true,
    },
    alias: {
        // Phục vụ sinh ra url seo (slug)
        type: String,
        default: null,
    },
    phone: {
        // Sđt liên hệ
        type: String,
        default: null,
    },
    emailContact: {
        // Email của người liên hệ khi đăng ký
        type: String,
        default: null,
    },
    avatarUser: {
        // Ảnh đại diện
        type: String,
        default: null,
    },
    type: {
        // 0: Cá nhân, 1: Công ty, 2: Nhân viên
        type: Number,
        required: true,
    },
    password: {
        // Mật khẩu đăng nhập
        type: String,
        required: true,
    },
    city: {
        // Tỉnh thành của đối tượng khi đăng ký
        type: Number,
        default: null,
    },
    district: {
        // Quận huyện của đối tượng khi đăng ký
        type: Number,
        default: null,
    },
    address: {
        // Địa chỉ chi tiết của đối tượng khi đăng ký
        type: String,
        default: null,
    },
    otp: {
        // OTP xác thực khi thực hiện 1 chức năng nào đó (Đăng ký thành công, quên mật khẩu,...) mà cần otp
        type: String,
        default: null,
    },
    authentic: {
        // Tình trạng kích hoạt tài khoản hay chưa (0: Chưa kích hoạt, 1: Đã kích hoạt)
        type: Number,
        default: 0,
    },
    isOnline: {
        // Trạng thái online bên chat
        type: Number,
        default: 0,
    },
    fromWeb: {
        // Nguồn đăng ký từ site nào
        type: String,
        default: null,
    },
    fromDevice: {
        // Nguồn đăng ký từ thiết bị nào (tương đương trường "dk" của timviec365)
        type: Number,
        default: 0,
    },
    createdAt: {
        // Thời gian đăng ký
        type: Number,
        default: 0,
    },
    updatedAt: {
        // Thời gian cập nhật
        type: Number,
        default: 0,
    },
    lastActivedAt: {
        // Thời gian hoạt động gần nhất
        type: Date,
        default: new Date(),
    },
    time_login: {
        // Thời gian đăng nhập
        type: Number,
        default: 0,
    },
    role: {
        // Quyền thực hiện bên quản lý chung
        type: Number,
        default: 0,
    },
    latitude: {
        // Tọa độ lat
        type: String,
        default: null,
    },
    longtitude: {
        // Tọa độ long
        type: String,
        default: null,
    },
    idQLC: {
        // ID gốc lấy từ base chuyển đổi số
        type: Number,
        default: 0,
    },
    idTimViec365: {
        // ID gốc lấy từ base timviec365
        type: Number,
        default: 0,
    },
    idRaoNhanh365: {
        // ID gốc lấy từ base raonhanh365
        type: Number,
        default: 0,
    },
    chat365_secret: {
        // Mã chat
        type: String,
        default: null,
    },
    chat365_id: {
        //Chờ cập nhật
        type: Number,
        default: 0,
    },
    scan_base365: {
        //Chờ cập nhật
        type: Number,
        default: 0,
    },
    check_chat: {
        //Chờ cập nhật
        type: Number,
        default: 0,
    },
    sharePermissionId: [{
        type: Number,
    }, ],

    inForPerson: {
        type: {
            scan: {
                type: Number,
                default: 0,
            },
            account: {
                type: {
                    birthday: {
                        // Ngày sinh
                        type: Number,
                        default: null,
                    },
                    gender: {
                        // Giới tính
                        type: Number,
                        default: 0,
                    },
                    married: {
                        // Tình trạng hôn nhân
                        type: Number,
                        default: 0,
                    },
                    experience: {
                        // Kinh nghiệm làm việc trong thông tin liên hệ
                        type: Number,
                        default: 0,
                    },
                    education: {
                        // Học vấn
                        type: Number,
                        default: 0,
                    },
                },
                default: {
                    birthday: null,
                    gender: 0,
                    married: 0,
                    experience: 0,
                    education: 0,
                },
            },
            // Thông tin dành cho luồng chuyển đổi số
            employee: {
                type: {
                    com_id: {
                        // ID của công ty chủ quyền nếu là nhân viên (giá trị = 0 là cá nhân)
                        type: Number,
                        default: 0,
                    },
                    listOrganizeDetailId: [{
                        level: Number,
                        organizeDetailId: Number,
                        _id: false,
                    }, ],
                    organizeDetailId: {
                        type: Number,
                        default: 0,
                    },
                    dep_id: {
                        // ID của phòng ban nếu là nhân viên (giá trị = 0 là cá nhân)
                        type: Number,
                        default: 0,
                    },
                    start_working_time: {
                        // Thời gian bắt đầu làm việc
                        type: Number,
                        default: 0,
                    },
                    position_id: {
                        // Cấp bậc của nhân viên trong công ty
                        type: Number,
                        default: 0,
                    },
                    team_id: {
                        // ID của tổ nếu là nhân viên
                        type: Number,
                        default: 0,
                    },
                    group_id: {
                        // ID của nhóm nếu là nhân viên
                        type: Number,
                        default: 0,
                    },
                    time_quit_job: {
                        // Thời gian nghỉ việc
                        type: Number,
                        default: 0,
                    },
                    ep_description: {
                        // Mô tả chi tiết
                        type: String,
                        default: null,
                    },
                    ep_featured_recognition: {
                        // Chưa rõ nữa
                        type: String,
                        default: null,
                    },
                    ep_status: {
                        // Trạng thái của nhân viên (Active: Duyệt, Pending: chờ duyệt, Deny: Từ chối)
                        type: String,
                        default: 'Pending',
                    },
                    ep_signature: {
                        // Chữ ký
                        type: Number,
                        default: 0,
                    },
                    allow_update_face: {
                        // Cho phép cập nhật khuôn mặt chấm công
                        type: Number,
                        default: 0,
                    },
                    version_in_use: {
                        // Version dùng trên app
                        type: Number,
                        default: 0,
                    },
                    role_id: {
                        type: Number,
                        default: 0,
                    },
                },
                default: null,
            },
            candidate: {
                type: {
                    use_type: {
                        type: Number,
                        default: 0,
                    },
                    user_reset_time: {
                        type: Number,
                        default: 0,
                    },
                    use_view: {
                        type: Number,
                        default: 0,
                    },
                    use_noti: {
                        type: Number,
                        default: 2,
                    },
                    use_show: {
                        type: Number,
                        default: 1,
                    },
                    time_hide: {
                        type: Number,
                        default: 0
                    },
                    use_show_cv: {
                        type: Number,
                        default: 0,
                    },
                    use_active: {
                        type: Number,
                        default: 0,
                    },
                    use_td: {
                        type: Number,
                        default: 0,
                    },
                    use_check: {
                        type: Number,
                        default: 1,
                    },
                    use_test: {
                        type: Number,
                        default: 0,
                    },
                    use_badge: {
                        // Đánh dấu huy hiệu tia sét
                        type: Number,
                        default: 0,
                    },
                    point_time_active: {
                        type: Number,
                        default: 0,
                    },
                    cv_title: {
                        // Công việc mong muốn
                        type: String,
                        default: '',
                    },
                    cv_muctieu: {
                        // Mục tiêu làm việc
                        type: String,
                        default: null,
                    },
                    cv_kynang: {
                        // Kỹ năng
                        type: String,
                        default: null,
                    },
                    cv_giai_thuong: {
                        // Giải thưởng
                        type: String,
                        default: null,
                    },
                    cv_hoat_dong: {
                        // Hoạt động
                        type: String,
                        default: null,
                    },
                    cv_so_thich: {
                        // Sở thích
                        type: String,
                        default: null,
                    },
                    cv_city_id: {
                        // Tỉnh thành làm việc mong muốn
                        type: [Number],
                        default: [],
                        index: true,
                    },
                    cv_district_id: {
                        // Tỉnh thành làm việc mong muốn
                        type: [Number],
                        default: [],
                        index: true,
                    },
                    cv_address: {
                        // Địa điểm mong muốn
                        type: String,
                        default: null,
                    },
                    cv_cate_id: {
                        // Ngành nghề làm việc mong muốn
                        type: [Number],
                        default: [],
                        index: true,
                    },
                    cv_capbac_id: {
                        // Cấp bậc làm việc mong muốn
                        type: Number,
                        default: 0,
                    },
                    cv_money_id: {
                        // Mức lương mong muốn
                        type: Number,
                        default: 0,
                    },
                    cv_loaihinh_id: {
                        // Loại hình làm việc (fulltime, parttime,...)
                        type: Number,
                        default: 0,
                    },
                    cv_time: {
                        type: Number,
                        default: 1,
                    },
                    cv_time_dl: {
                        type: Number,
                        default: 0,
                    },
                    // cv_kynang: {
                    //     // Kỹ năng làm việc
                    //     type: String,
                    //     default: null
                    // },
                    um_type: {
                        // Mức lương mong muốn (thỏa thuận hoặc từ min đến max)
                        type: Number,
                        default: 0,
                    },
                    um_min_value: {
                        type: Number,
                        default: null,
                    },
                    um_max_value: {
                        type: Number,
                        default: null,
                    },
                    um_unit: {
                        // Mức lương mong muốn (vnd/usd)
                        type: Number,
                        default: 0,
                    },
                    cv_tc_name: {
                        // Tên người tham chiếu
                        type: String,
                        default: null,
                    },
                    cv_tc_cv: {
                        // Chức vụ của người tham chiếu
                        type: String,
                        default: null,
                    },
                    cv_tc_dc: {
                        // Địa chỉ của người tham chiếu
                        type: String,
                        default: null,
                    },
                    cv_tc_phone: {
                        // SĐT người tham chiếu
                        type: String,
                        default: null,
                    },
                    cv_tc_email: {
                        // Email người tham chiếu
                        type: String,
                        default: null,
                    },
                    cv_tc_company: {
                        // Công ty làm việc của người tham chiếu
                        type: String,
                        default: null,
                    },
                    cv_video: {
                        // Video khi ứng viên đăng ký tài khoản
                        type: String,
                        default: null,
                    },
                    cv_video_type: {
                        // 1: Video tự tải, 2: Video từ youtube, tiktok
                        type: Number,
                        default: 0,
                    },
                    cv_video_active: {
                        // Video được duyệt hay chưa (0: chưa duyệt, 1: được duyệt)
                        type: Number,
                        default: 0,
                    },
                    use_ip: {
                        // Video khi ứng viên đăng ký tài khoản
                        type: String,
                        default: null,
                    },
                    percents: {
                        type: Number,
                        default: 0,
                    },

                    vip: {
                        type: Number,
                        default: 0,
                    },
                    check_create_use: {
                        type: Number,
                        default: 0,
                    },
                    emp_id: {
                        type: Number,
                        default: 0,
                    },
                    profileDegree: [{
                        type: {
                            th_id: {
                                type: Number,
                                autoIncrement: true,
                            },
                            th_name: {
                                type: String,
                                default: null,
                            },
                            th_bc: {
                                type: String,
                                default: null,
                            },
                            th_cn: {
                                // Chuyên ngành
                                type: String,
                                default: null,
                            },
                            th_xl: {
                                type: Number,
                                default: 0,
                            },
                            th_bs: {
                                type: String,
                                default: null,
                            },
                            th_one_time: {
                                type: Number,
                                default: 0,
                            },
                            th_two_time: {
                                type: Number,
                                default: 0,
                            },
                        },
                        default: null,
                    }, ],
                    profileNgoaiNgu: [{
                        type: {
                            nn_id: {
                                type: Number,
                                autoIncrement: true,
                            },
                            nn_id_pick: {
                                // Ngôn ngữ học
                                type: Number,
                                default: 0,
                            },
                            nn_cc: {
                                // Chứng chỉ đạt được
                                type: String,
                                default: null,
                            },
                            nn_sd: {
                                // Số điểm đạt được
                                type: String,
                                default: null,
                            },
                        },
                        default: null,
                    }, ],
                    profileExperience: [{
                        type: {
                            kn_id: {
                                type: Number,
                                autoIncrement: true,
                            },
                            kn_name: {
                                type: String,
                                default: null,
                            },
                            kn_cv: {
                                type: String,
                                default: null,
                            },
                            kn_mota: {
                                type: String,
                                default: null,
                            },
                            kn_one_time: {
                                type: Number,
                                default: 0,
                            },
                            kn_two_time: {
                                type: Number,
                                default: 0,
                            },
                            kn_hien_tai: {
                                type: Number,
                                default: 0,
                            },
                            kn_duan: {
                                type: String,
                                default: null,
                            },
                        },
                        default: null,
                    }, ],
                    scan_audio: {
                        type: Number,
                        default: 0,
                    },
                    audio: {
                        type: String,
                        default: null,
                    },
                    scan_elastic: {
                        type: Number,
                        default: 0,
                    },
                    anhsao_badge: {
                        type: Number,
                        default: 0,
                    },
                    star3: {
                        type: Number,
                        default: 0,
                    },
                    time_active_star3: {
                        type: Number,
                        default: 0,
                    },
                },
                default: null,
            },
        },
        default: null,
    },
    inForCompany: {
        type: {
            scan: {
                type: Number,
                default: 0,
            },
            usc_kd: {
                // ID Kinh doanh phụ trách hỗ trợ
                type: Number,
                default: 0,
            },
            usc_kd_first: {
                type: Number,
                default: 0,
            },
            description: {
                // Mô tả công ty
                type: String,
                default: null,
            },
            com_size: {
                // Quy mô công ty
                type: Number,
                default: 0,
            },
            timviec365: {
                // Thông tin công ty luồng timviec365
                usc_name: {
                    // Tên người liên hệ
                    type: String,
                    default: null,
                },
                usc_name_add: {
                    // Địa chỉ người liên hệ
                    type: String,
                    default: null,
                },
                usc_name_phone: {
                    // SĐT người liên hệ
                    type: String,
                    default: null,
                },
                usc_name_email: {
                    // Email người liên hệ
                    type: String,
                    default: null,
                },
                usc_update_new: {
                    type: Number,
                    default: 0,
                },
                usc_canonical: {
                    // Mã sinh ra url phục vụ seo (canonical)
                    type: String,
                    default: null,
                },
                usc_md5: {
                    type: String,
                    default: null,
                },
                usc_redirect: {
                    type: String,
                },
                usc_type: {
                    type: Number,
                    default: 0,
                },
                usc_size: {
                    type: Number,
                    default: 0,
                },
                usc_website: {
                    // Website công ty
                    type: String,
                    default: null,
                },
                usc_view_count: {
                    // Tổng lượt xem
                    type: Number,
                    default: 0,
                },
                usc_active: {
                    // Tổng lượt xem
                    type: Number,
                    default: 0,
                },
                usc_show: {
                    type: Number,
                    default: 1,
                },
                usc_mail: {
                    type: Number,
                    default: 0,
                },
                usc_stop_mail: {
                    type: Number,
                    default: 0,
                },
                usc_utl: {
                    type: Number,
                    default: 0,
                },
                usc_ssl: {
                    type: Number,
                    default: 0,
                },
                usc_mst: {
                    // Mã số thuế
                    type: String,
                    default: null,
                },
                usc_security: {
                    type: String,
                    default: null,
                },
                usc_ip: {
                    // IP của công ty khi đăng ký
                    type: String,
                    default: null,
                },
                usc_loc: {
                    type: Number,
                    default: 0,
                },
                usc_mail_app: {
                    type: Number,
                    default: 0,
                },
                usc_video: {
                    type: String,
                    default: null,
                },
                usc_video_type: {
                    type: Number,
                    default: 1,
                },
                usc_video_active: {
                    type: Number,
                    default: 0,
                },
                usc_block_account: {
                    type: Number,
                    default: 0,
                },
                usc_stop_noti: {
                    type: Number,
                    default: 0,
                },
                otp_time_exist: {
                    type: Number,
                    default: 0,
                },
                usc_test: {
                    type: Number,
                    default: 0,
                },
                usc_badge: {
                    // Đánh dấu huy hiệu tia sét
                    type: Number,
                    default: 0,
                },
                // usc_star: {
                //     // Đánh giá sao
                //     type: Number,
                //     default: 0
                // },
                usc_vip: {
                    type: Number,
                    default: 0,
                },
                // usc_manager: {
                //     type: String,
                //     default: null
                // },
                // usc_license: {
                //     type: String,
                //     default: null
                // },
                // usc_active_license: {
                //     type: Number,
                //     default: 0
                // },
                usc_map: {
                    type: String,
                    default: null,
                },
                usc_dgc: {
                    type: String,
                    default: null,
                },
                usc_dgtv: {
                    type: String,
                    default: null,
                },
                usc_dg_time: {
                    type: Number,
                    default: 0,
                },
                usc_skype: {
                    type: String,
                    default: null,
                },
                usc_video_com: {
                    type: String,
                    default: null,
                },
                usc_lv: {
                    // Lĩnh vực của công ty
                    type: String,
                    default: null,
                },
                usc_zalo: {
                    //Zalo ntd
                    type: String,
                    default: null,
                },
                usc_star: {
                    //NTD có ánh sao(điểm lịch sử >= 70))
                    type: Number,
                    default: 0,
                },
                usc_cc365: {
                    type: Number,
                    default: 0,
                },
                usc_crm: {
                    type: Number,
                    default: 0,
                },
                usc_images: {
                    //kho ảnh ntd
                    type: String,
                    default: null,
                },
                usc_active_img: {
                    //0: chưa được duyệt; 1: đã duyệt
                    type: Number,
                    default: 0,
                },
                usc_manager: {
                    //tên giám đốc công ty
                    type: String,
                    default: null,
                },
                usc_license: {
                    //giấy phép kinh doanh ntd
                    type: String,
                    default: null,
                },
                usc_active_license: {
                    //1: xác nhận giấy phép kinh doanh ntd
                    type: Number,
                    default: 0,
                },
                usc_license_additional: {
                    type: Number,
                    default: 0,
                },
                usc_founded_time: {
                    //Thời gian công ty được thành lập
                    type: Number,
                    default: 0,
                },
                usc_branches: {
                    type: [{
                        usc_branch_cit: {
                            //tỉnh thành chi nhánh
                            type: Number,
                            default: 0,
                        },
                        usc_branch_qh: {
                            //quận huyện chi nhánh
                            type: Number,
                            default: 0,
                        },
                        usc_branch_address: {
                            //địa chỉ chi nhánh
                            type: String,
                            default: null,
                        },
                        usc_branch_time: {
                            //Thời gian tạo
                            type: Number,
                            default: 0,
                        },
                    }, ],
                    default: [],
                },
                usc_xacthuc_email: {
                    type: Number,
                    default: 0,
                },
                usc_note: {
                    type: String,
                    default: '',
                },
            },
            // Thông tin công ty luồng chuyển đổi số
            cds: {
                com_parent_id: {
                    type: Number,
                    default: null,
                },
                type_timekeeping: {
                    // 1: là khuôn mặt, 2: là QR, 3: là chấm công công ty, 4: là chấm công web, 5: là PC365, 6: là giới hạn IP nhân viên, 7 là giới hạn IP công ty; 8: chấm công trên app chat365; 9: chấm công qr app chat
                    type: String,
                    default: '1,2,3,4,5,8,9',
                },
                id_way_timekeeping: {
                    // Chưa rõ, cập nhật sau
                    type: String,
                    default: 1,
                },
                com_role_id: {
                    // Chưa rõ, cập nhật sau
                    type: Number,
                    default: 0,
                },
                com_qr_logo: {
                    type: String,
                    default: null,
                },
                enable_scan_qr: {
                    // Cho phép quét mã QR
                    type: Number,
                    default: 0,
                },
                com_vip: {
                    // Có phải là công ty vip hay không (1:VIP)
                    type: Number,
                    default: 0,
                },
                com_ep_vip: {
                    // Số lượng nhận viên đạt vip
                    type: Number,
                    default: 5,
                },
                com_vip_time: {
                    // Thời gian vip
                    type: Number,
                    default: 0,
                },
                ep_crm: {
                    type: Number,
                    default: 0,
                },
                ep_stt: {
                    type: Number,
                    default: 1,
                },
            },
        },
        default: null,
    },
    inforRN365: {
        type: {
            cccd: {
                //so cmnd/can cuoc cong dan
                type: String,
                default: null,
            },
            cccdFrontImg: {
                //anh truoc cccd
                type: String,
                default: null,
            },
            cccdBackImg: {
                //anh sau cccd
                type: String,
                default: null,
            },
            bankName: {
                //ten ngan hang
                type: String,
                default: null,
            },
            stk: {
                //so tai khoan
                type: String,
                default: null,
            },
            xacThucLienket: {
                type: Number,
                default: null,
            },
            store_name: {
                type: String,
                default: null,
            },
            store_phone: {
                type: String,
                default: null,
            },
            ownerName: {
                //ten chu tai khoan
                type: String,
                default: null,
            },
            time: {
                //thoi gian xac thuc
                type: Date,
                default: null,
            },
            active: {
                //admin da xac thuc hay chua(0: chua xac thuc)
                type: Number,
                default: 0,
            },
            money: {
                type: Number,
                default: 0,
            },
            usc_tax_code: {
                // mã số thuế
                type: Number,
                default: 0,
            },
            usc_des: {
                // mô tả
                type: String,
                default: null,
            },
            usc_note: {
                type: String,
                default: '',
            },
        },
        default: null,
    },
    configChat: {
        notificationAcceptOffer: {
            type: Number,
            default: 1,
        },
        notificationAllocationRecall: {
            type: Number,
            default: 1,
        },
        notificationChangeSalary: {
            type: Number,
            default: 1,
        },
        notificationCommentFromRaoNhanh: {
            type: Number,
            default: 1,
        },
        notificationCommentFromTimViec: {
            type: Number,
            default: 1,
        },
        notificationDecilineOffer: {
            type: Number,
            default: 1,
        },
        notificationMissMessage: {
            type: Number,
            default: 1,
        },
        notificationNTDExpiredPin: {
            type: Number,
            default: 1,
        },
        notificationNTDExpiredRecruit: {
            type: Number,
            default: 1,
        },
        notificationNTDPoint: {
            type: Number,
            default: 1,
        },
        notificationSendCandidate: {
            type: Number,
            default: 1,
        },
        notificationTag: {
            type: Number,
            default: 1,
        },
        HistoryAccess: [{
            IdDevice: {
                type: String,
                default: '',
            },
            IpAddress: {
                type: String,
                default: '',
            },
            NameDevice: {
                type: String,
                default: '',
            },
            Time: {
                type: Date,
                default: new Date(),
            },
            AccessPermision: {
                type: Boolean,
                default: false,
            },
        }, ],
        removeSugges: {
            type: [Number],
            default: [],
        },
        userNameNoVn: {
            type: String,
            default: '',
        },
        doubleVerify: {
            type: Number,
            default: 0,
        },
        active: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            default: '',
        },
        acceptMessStranger: {
            type: Number,
            default: 0,
        },
    },
    scan: {
        type: Number,
        default: 0,
    },
    // Có active nhận diện cảm xúc hay không -> chỉ dành cho tk công ty
    emotion_active: {
        type: Boolean,
        default: false,
    },
    scanElacticAdmin: {
        type: Number,
        default: 0,
    },
}, {
    collection: 'Users',
    versionKey: false,
    timestamp: true,
});

// change
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
UserSchema.pre('updateOne', function(next) {
    next();
    UpdateElastic(this.getQuery());
    //UpdateElastic_2("updateOne", this.getQuery());
    HandleUpdate(this.getQuery());
});
UserSchema.pre('updateMany', function(next) {
    next();
    UpdateElastic(this.getQuery());
    HandleUpdate(this.getQuery());
    //UpdateElastic_2("updateMany", this.getQuery());
});
UserSchema.pre('findOneAndUpdate', function(next) {
    next();
    UpdateElastic(this.getQuery());
    //UpdateElastic_2("findOneAndUpdate", this.getQuery());
});

UserSchema.pre('save', function(next) {
    next();
    HandleSave(this);
    // HandleSave_2(this);
    HandleSaveUser(this);
});
let Users = connection.model('Users', UserSchema);

function removeVietnameseTones(str) {
    if (str && str.trim() && str.trim() != '') {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
        str = str.replace(/Đ/g, 'D');
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        str = str.replace(/ + /g, ' ');
        str = str.trim();

        str = str.replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|{|}|\||\\/g, ' ');
        return str;
    } else {
        return '';
    }
}
const handle = (str) => {
    let result = removeVietnameseTones(str.toLowerCase());
    return result;
};
const UpdateElastic = async(condition) => {
    try {
        await sleep(1000);
        let listUser = await Users.find(condition).lean();
        for (let i = 0; i < listUser.length; i++) {
            let obj = listUser[i];
            let cv_cate_id = '';
            let cv_city_id = '';
            if (
                obj.inForPerson &&
                obj.inForPerson.candidate &&
                obj.inForPerson.candidate.cv_cate_id &&
                obj.inForPerson.candidate.cv_cate_id.length
            ) {
                let list_cate = obj.inForPerson.candidate.cv_cate_id;
                for (let i = 0; i < list_cate.length; i++) {
                    cv_cate_id = `${list_cate[i]},`;
                }
            }
            if (
                obj.inForPerson &&
                obj.inForPerson.candidate &&
                obj.inForPerson.candidate.cv_city_id &&
                obj.inForPerson.candidate.cv_city_id.length
            ) {
                let list_city = obj.inForPerson.candidate.cv_city_id;
                for (let i = 0; i < list_city.length; i++) {
                    cv_city_id = `${list_city[i]},`;
                }
            }
            obj = {
                ...obj,
                userName: handle(obj.userName),
                email: obj.email ? handle(obj.email) : '',
                'inForPerson.candidate.cv_title': obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_title ?
                    handle(obj.inForPerson.candidate.cv_title) : '',
                cv_cate_id: cv_cate_id,
                cv_city_id: cv_city_id,
            };
            // obj_2 = {
            //     idTimViec: obj.idTimViec,
            //     function:
            // }
            await axios({
                method: 'post',
                url: 'http://43.239.223.57:9001/updateuser',
                data: {
                    user: JSON.stringify(obj),
                },
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        }
    } catch (e) {
        return false;
    }
};

const HandleSave = async(obj_save) => {
    try {
        let obj = obj_save;
        let cv_cate_id = '';
        let cv_city_id = '';
        if (
            obj.inForPerson &&
            obj.inForPerson.candidate &&
            obj.inForPerson.candidate.cv_cate_id &&
            obj.inForPerson.candidate.cv_cate_id.length
        ) {
            let list_cate = obj.inForPerson.candidate.cv_cate_id;
            for (let i = 0; i < list_cate.length; i++) {
                cv_cate_id = `${list_cate[i]},`;
            }
        }
        if (
            obj.inForPerson &&
            obj.inForPerson.candidate &&
            obj.inForPerson.candidate.cv_city_id &&
            obj.inForPerson.candidate.cv_city_id.length
        ) {
            let list_city = obj.inForPerson.candidate.cv_city_id;
            for (let i = 0; i < list_city.length; i++) {
                cv_city_id = `${list_city[i]},`;
            }
        }
        obj = {
            ...obj,
            userName: handle(obj.userName),
            email: obj.email ? handle(obj.email) : '',
            'inForPerson.candidate.cv_title': obj.inForPerson && obj.inForPerson.candidate && obj.inForPerson.candidate.cv_title ?
                handle(obj.inForPerson.candidate.cv_title) : '',
            cv_cate_id: cv_cate_id,
            cv_city_id: cv_city_id,
        };
        await axios({
            method: 'post',
            url: 'http://43.239.223.57:9001/updateuser',
            data: {
                user: JSON.stringify(obj),
            },
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return true;
    } catch (e) {
        console.log('Lỗi khi lưu dữ liệu sang elasticsearch', e);
        return false;
    }
};

const HandleSaveUser = async(obj_save) => {
    try {
        if (obj_save.idTimViec365 != 0) {
            let data = new FormData();

            if (obj_save.type == 1) {
                data.append('usc_id', obj_save.idTimViec365 || '');
                data.append('usc_email', obj_save.email || '');

                data.append('usc_phone_tk', obj_save.phoneTK ? obj_save.phoneTK : '');
                data.append(
                    'usc_name',
                    obj_save.inForCompany &&
                    obj_save.inForCompany.timviec365 &&
                    obj_save.inForCompany.timviec365.usc_name ?
                    obj_save.inForCompany.timviec365.usc_name :
                    ''
                );
                data.append(
                    'usc_name_add',
                    obj_save.inForCompany &&
                    obj_save.inForCompany.timviec365 &&
                    obj_save.inForCompany.timviec365.usc_name_add ?
                    obj_save.inForCompany.timviec365.usc_name_add :
                    ''
                );
                data.append(
                    'usc_name_phone',
                    obj_save.inForCompany &&
                    obj_save.inForCompany.timviec365 &&
                    obj_save.inForCompany.timviec365.usc_name_phone ?
                    obj_save.inForCompany.timviec365.usc_name_phone :
                    ''
                );
                data.append(
                    'usc_name_email',
                    obj_save.inForCompany &&
                    obj_save.inForCompany.timviec365 &&
                    obj_save.inForCompany.timviec365.usc_name_email ?
                    obj_save.inForCompany.timviec365.usc_name_email :
                    ''
                );
                data.append('usc_canonical', '');
                data.append('usc_pass', '');
                data.append('usc_company', obj_save.userName || '');
                data.append('usc_alias', obj_save.alias || '');
                data.append('usc_md5', usc_md5);
                data.append(
                    'usc_redirect',
                    obj_save.inForCompany &&
                    obj_save.inForCompany.timviec365 &&
                    obj_save.inForCompany.timviec365.usc_redirect ?
                    obj_save.inForCompany.timviec365.usc_redirect :
                    ''
                );

                data.append('usc_address', obj_save.address || '');
                data.append('usc_phone', obj_save.phone || '');
                data.append('usc_logo', obj_save.avatarUser || '');
                data.append(
                    'usc_size',
                    obj_save.inForCompany &&
                    obj_save.inForCompany.timviec365 &&
                    obj_save.inForCompany.timviec365.usc_size ?
                    obj_save.inForCompany.timviec365.usc_size :
                    ''
                );
                data.append(
                    'usc_website',
                    obj_save.inForCompany &&
                    obj_save.inForCompany.timviec365 &&
                    obj_save.inForCompany.timviec365.usc_website ?
                    obj_save.inForCompany.timviec365.usc_website :
                    ''
                );
                data.append('usc_city', obj_save.city || '');
                data.append('usc_qh', obj_save.district || '');
                data.append('usc_create_time', obj_save.createdAt ? Number(obj_save.createdAt).toFixed(0) : '');
                data.append('usc_update_time', obj_save.updatedAt ? Number(obj_save.updatedAt).toFixed(0) : '');
                data.append(
                    'usc_update_new',
                    obj_save.inForCompany &&
                    obj_save.inForCompany.timviec365 &&
                    obj_save.inForCompany.timviec365.usc_update_new ?
                    obj_save.inForCompany.timviec365.usc_update_new :
                    ''
                );
                data.append('usc_view_count', '');
                data.append('usc_time_login', obj_save.time_login ? Number(obj_save.time_login).toFixed(0) : '');
                data.append(
                    'usc_active',
                    obj_save.inForCompany &&
                    obj_save.inForCompany.timviec365 &&
                    obj_save.inForCompany.timviec365.usc_active ?
                    obj_save.inForCompany.timviec365.usc_active :
                    ''
                );
                data.append(
                    'usc_show',
                    obj_save.inForCompany &&
                    obj_save.inForCompany.timviec365 &&
                    obj_save.inForCompany.timviec365.usc_show ?
                    obj_save.inForCompany.timviec365.usc_show :
                    ''
                );
                data.append('usc_mail', '');
                data.append('usc_stop_mail', '');
                data.append('usc_utl', '');
                data.append('usc_ssl', '');
                data.append('usc_mst', '');
                //console.log(obj_save.userName ? removeVietnameseTones(obj_save.userName) : "")
                data.append('usc_name_novn', obj_save.userName ? removeVietnameseTones(obj_save.userName) : '');
                data.append('usc_authentic', obj_save.authentic || '');
                data.append('usc_security', '');
                data.append('usc_lat', '');
                data.append('usc_long', '');
                data.append(
                    'usc_ip',
                    obj_save.inForCompany && obj_save.inForCompany.timviec365 && obj_save.inForCompany.timviec365.usc_ip ?
                    obj_save.inForCompany.timviec365.usc_ip :
                    ''
                );
                data.append('usc_loc', '');
                data.append(
                    'usc_kd',
                    obj_save.inForCompany && obj_save.inForCompany.timviec365 ? obj_save.inForCompany.usc_kd : ''
                );
                data.append(
                    'usc_kd_first',
                    obj_save.inForCompany && obj_save.inForCompany.timviec365 ? obj_save.inForCompany.usc_kd_first : ''
                );
                data.append('usc_mail_app', '');
                data.append('dk', obj_save.fromDevice || 0);
                data.append('usc_xac_thuc', obj_save.otp || '');
                data.append('usc_cc365', '');
                data.append('usc_crm', '');
                data.append('usc_video', '');
                data.append('usc_video_type', '');
                data.append('usc_video_active', '');
                data.append('usc_images', '');

                data.append(
                    'usc_active_img',
                    obj_save.inForCompany &&
                    obj_save.inForCompany.timviec365 &&
                    obj_save.inForCompany.timviec365.usc_active_img ?
                    obj_save.inForCompany.timviec365.usc_active_img :
                    ''
                );
                data.append('up_crm', '');
                data.append('chat365_id', obj_save.chat365_id || '');
                data.append('chat365_secret', obj_save.chat365_secret || '');
                data.append('usc_block_account', '');
                data.append('usc_stop_noti', '');
                data.append('otp_time_exist', '');
                data.append('id_qlc', obj_save.idQLC || '');
                data.append('use_test', '');
                data.append(
                    'usc_badge',
                    obj_save.inForCompany &&
                    obj_save.inForCompany.timviec365 &&
                    obj_save.inForCompany.timviec365.usc_badge ?
                    obj_save.inForCompany.timviec365.usc_badge :
                    ''
                );
                data.append(
                    'usc_star',
                    obj_save.inForCompany &&
                    obj_save.inForCompany.timviec365 &&
                    obj_save.inForCompany.timviec365.usc_star ?
                    obj_save.inForCompany.timviec365.usc_star :
                    ''
                );
                data.append('scan_base365', obj_save.scan_base365 || '');
                data.append('check_chat', obj_save.check_chat || '');
                data.append(
                    'usc_vip',
                    obj_save.inForCompany &&
                    obj_save.inForCompany.timviec365 &&
                    obj_save.inForCompany.timviec365.usc_vip ?
                    obj_save.inForCompany.timviec365.usc_vip :
                    ''
                );
                data.append('usc_xacthuc_email', '');
                data.append('usc_manager', '');
                data.append('usc_license', '');
                data.append('usc_active_license', '');
                data.append('usc_license_additional', '');
                data.append('raonhanh365_id', obj_save.idRaoNhanh365 || '');
                data.append('check_raonhanh_id', '');
                data.append('status_dowload_appchat', '');
                data.append('status_dowload_wfchat', '');
                data.append('usc_founding', '');
                data.append('scan_elastic', '');
                data.append('point', '');
                data.append('point_usc', '');
                data.append('day_reset_point', '');
                data.append('ngay_reset_diem_ve_0', '');
                data.append('point_bao_luu', '');
                data.append('chu_thich_bao_luu', '');
                data.append('table', 'Users');
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'http://43.239.223.57:9006/add_company',
                    data: data,
                };

                await axios.request(config);
                return true;
            } else {
                let percents =
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.percents ?
                    obj_save.inForPerson.candidate.percents :
                    0;
                if (obj_save.fromDevice == 8) {
                    percents = 50;
                }
                data.append('use_id', obj_save.idTimViec365 || '');
                data.append('cv_user_id', obj_save.idTimViec365 || '');
                data.append('use_email', obj_save.email || '');
                data.append('use_phone_tk', obj_save.phoneTK || '');
                data.append('use_first_name', obj_save.userName || '');
                data.append('use_pass', obj_save.password || '');
                data.append(
                    'use_type',
                    obj_save.inForPerson && obj_save.inForPerson.candidate ?
                    obj_save.inForPerson.candidate.use_type :
                    ''
                );
                data.append('use_create_time', obj_save.createdAt ? Number(obj_save.createdAt).toFixed(0) : '');
                data.append('use_update_time', obj_save.updatedAt ? Number(obj_save.updatedAt).toFixed(0) : '');

                data.append(
                    'user_reset_time',
                    obj_save.inForPerson && obj_save.inForPerson.candidate ?
                    obj_save.inForPerson.candidate.user_reset_time :
                    ''
                );
                data.append('use_logo', obj_save.avatarUser || '');
                data.append('use_phone', obj_save.phone || '');
                data.append('use_email_lienhe', obj_save.emailContact || '');
                data.append('use_gioi_tinh', obj_save.inForPerson.account.gender || '');
                data.append('use_birth_day', obj_save.inForPerson.account.birthday || '');
                data.append('use_birth_mail', '');
                data.append('use_city', obj_save.city || '');
                data.append('use_quanhuyen', obj_save.district || '');
                data.append('use_address', obj_save.address || '');
                data.append('use_fb', '');
                data.append('use_hon_nhan', obj_save.inForPerson.account.married || '');
                data.append(
                    'use_view',
                    obj_save.inForPerson && obj_save.inForPerson.candidate ?
                    obj_save.inForPerson.candidate.use_view :
                    ''
                );
                data.append(
                    'use_noti',
                    obj_save.inForPerson && obj_save.inForPerson.candidate ?
                    obj_save.inForPerson.candidate.use_noti :
                    ''
                );
                data.append(
                    'use_show',
                    obj_save.inForPerson && obj_save.inForPerson.candidate ?
                    obj_save.inForPerson.candidate.use_show :
                    ''
                );
                data.append(
                    'use_show_cv',
                    obj_save.inForPerson && obj_save.inForPerson.candidate ?
                    obj_save.inForPerson.candidate.use_show_cv :
                    ''
                );
                data.append(
                    'use_active',
                    obj_save.inForPerson && obj_save.inForPerson.candidate ?
                    obj_save.inForPerson.candidate.use_active :
                    ''
                );
                data.append('use_authentic', obj_save.authentic || '');
                data.append('use_lat', obj_save.latitude || '');
                data.append('use_long', obj_save.longtitude || '');
                data.append(
                    'use_td',
                    obj_save.inForPerson && obj_save.inForPerson.candidate ? obj_save.inForPerson.candidate.use_td : ''
                );
                data.append('send_vip_time', '');
                data.append('use_stop_mail', '');
                data.append('use_utl', '');
                data.append('use_ssl', '');
                data.append('use_mail_vt', '');
                data.append('use_qc', '');
                data.append(
                    'use_check',
                    obj_save.inForPerson && obj_save.inForPerson.candidate ?
                    obj_save.inForPerson.candidate.use_check :
                    ''
                );
                data.append('user_xac_thuc', obj_save.otp || '');
                data.append('dk', obj_save.fromDevice || '');
                data.append('chat365_id', obj_save.chat365_id || '');
                data.append('chat365_secret', obj_save.chat365_secret || '');
                data.append('use_delete', '');
                data.append('send_crm', '');
                data.append('otp_time_exist', '');
                data.append('id_qlc', obj_save.idQLC || '');
                data.append('scan_logo', '');
                data.append('use_test', '');
                data.append(
                    'point_time_active',
                    obj_save.inForPerson && obj_save.inForPerson.candidate ?
                    obj_save.inForPerson.candidate.point_time_active :
                    ''
                );
                data.append('scan_base365', '');
                data.append('time_send_vl', '');
                data.append(
                    'use_ip',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.use_ip ?
                    obj_save.inForPerson.candidate.use_ip :
                    ''
                );
                data.append('percents', percents);
                data.append(
                    'vip',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.percents ?
                    obj_save.inForPerson.candidate.vip :
                    ''
                );
                data.append('scan_AI', '');
                data.append('scan_AI_Lam', '');
                data.append('scan_AI_percents', '');
                data.append('check_create_usc', '');
                data.append(
                    'emp_id',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.emp_id ?
                    obj_save.inForPerson.candidate.emp_id :
                    ''
                );
                data.append('raonhanh365_id', obj_save.idRaoNhanh365 || '');
                data.append('check_account_raonhanh', '');
                data.append('check_account_qlc', '');
                data.append(
                    'scan_audio',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.scan_audio ?
                    obj_save.inForPerson.candidate.scan_audio :
                    ''
                );
                data.append('update_uv_ai', '');
                data.append('check_crm', '');
                data.append('scan_elastic', '');
                data.append('cv_id', '');

                data.append(
                    'cv_title',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.scan_audio ?
                    obj_save.inForPerson.candidate.cv_title :
                    ''
                );
                data.append(
                    'cv_hocvan',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.education ?
                    obj_save.inForPerson.account.education :
                    ''
                );
                data.append(
                    'cv_exp',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.experience ?
                    obj_save.inForPerson.account.experience :
                    ''
                );
                data.append(
                    'cv_muctieu',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_muctieu ?
                    obj_save.inForPerson.candidate.cv_muctieu :
                    ''
                );
                data.append(
                    'cv_cate_id',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_cate_id ?
                    obj_save.inForPerson.candidate.cv_cate_id.toString() :
                    ''
                );
                data.append(
                    'cv_city_id',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_city_id ?
                    obj_save.inForPerson.candidate.cv_city_id.toString() :
                    ''
                );
                data.append('cv_district_id', '');
                data.append('cv_address', '');
                data.append(
                    'cv_capbac_id',
                    obj_save.inForPerson &&
                    obj_save.inForPerson.candidate &&
                    obj_save.inForPerson.candidate.cv_capbac_id ?
                    obj_save.inForPerson.candidate.cv_capbac_id :
                    ''
                );
                data.append(
                    'cv_money_id',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_money_id ?
                    obj_save.inForPerson.candidate.cv_money_id :
                    ''
                );
                data.append(
                    'cv_loaihinh_id',
                    obj_save.inForPerson &&
                    obj_save.inForPerson.candidate &&
                    obj_save.inForPerson.candidate.cv_loaihinh_id ?
                    obj_save.inForPerson.candidate.cv_loaihinh_id :
                    ''
                );
                data.append(
                    'cv_time',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_time ?
                    obj_save.inForPerson.candidate.cv_time :
                    ''
                );
                data.append(
                    'cv_time_dl',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_time_dl ?
                    obj_save.inForPerson.candidate.cv_time_dl :
                    ''
                );

                data.append(
                    'cv_kynang',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_kynang ?
                    obj_save.inForPerson.candidate.cv_kynang :
                    ''
                );
                data.append(
                    'cv_giai_thuong',
                    obj_save.inForPerson &&
                    obj_save.inForPerson.candidate &&
                    obj_save.inForPerson.candidate.cv_giai_thuong ?
                    obj_save.inForPerson.candidate.cv_giai_thuong :
                    ''
                );
                data.append(
                    'cv_hoat_dong',
                    obj_save.inForPerson &&
                    obj_save.inForPerson.candidate &&
                    obj_save.inForPerson.candidate.cv_hoat_dong ?
                    obj_save.inForPerson.candidate.cv_hoat_dong :
                    ''
                );
                data.append(
                    'cv_so_thich',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_so_thich ?
                    obj_save.inForPerson.candidate.cv_so_thich :
                    ''
                );
                data.append(
                    'cv_tc_name',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_tc_name ?
                    obj_save.inForPerson.candidate.cv_tc_name :
                    ''
                );
                data.append(
                    'cv_tc_cv',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_tc_cv ?
                    obj_save.inForPerson.candidate.cv_tc_cv :
                    ''
                );
                data.append(
                    'cv_tc_dc',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_tc_dc ?
                    obj_save.inForPerson.candidate.cv_tc_dc :
                    ''
                );
                data.append(
                    'cv_tc_phone',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_tc_phone ?
                    obj_save.inForPerson.candidate.cv_tc_phone :
                    ''
                );
                data.append(
                    'cv_tc_email',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_tc_email ?
                    obj_save.inForPerson.candidate.cv_tc_email :
                    ''
                );
                data.append(
                    'cv_tc_company',
                    obj_save.inForPerson &&
                    obj_save.inForPerson.candidate &&
                    obj_save.inForPerson.candidate.cv_tc_company ?
                    obj_save.inForPerson.candidate.cv_tc_company :
                    ''
                );
                data.append(
                    'cv_video',
                    obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_video ?
                    obj_save.inForPerson.candidate.cv_video :
                    ''
                );
                data.append(
                    'cv_video_type',
                    obj_save.inForPerson &&
                    obj_save.inForPerson.candidate &&
                    obj_save.inForPerson.candidate.cv_video_type ?
                    obj_save.inForPerson.candidate.cv_video_type :
                    ''
                );
                data.append(
                    'cv_video_active',
                    obj_save.inForPerson &&
                    obj_save.inForPerson.candidate &&
                    obj_save.inForPerson.candidate.cv_video_active ?
                    obj_save.inForPerson.candidate.cv_video_active :
                    ''
                );

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'http://43.239.223.57:9005/add_candidate',
                    data: data,
                };

                await axios.request(config);
                return true;
            }
        }
        return false;
    } catch (error) {
        // console.log(error);
        return false;
    }
};

const HandleUpdate = async(condition) => {
    try {
        const list_obj_save = await Users.find(condition);
        for (let i = 0; i < list_obj_save.length; i++) {
            const obj_save = list_obj_save[i];
            if (obj_save) {
                let data = new FormData();
                if (obj_save.type == 1) {
                    data.append('usc_id', obj_save.idTimViec365 || '');
                    data.append('usc_email', obj_save.email || '');

                    data.append('usc_phone_tk', obj_save.phoneTK ? obj_save.phoneTK : '');
                    data.append(
                        'usc_name',
                        obj_save.inForCompany &&
                        obj_save.inForCompany.timviec365 &&
                        obj_save.inForCompany.timviec365.usc_name ?
                        obj_save.inForCompany.timviec365.usc_name :
                        ''
                    );
                    data.append(
                        'usc_name_add',
                        obj_save.inForCompany &&
                        obj_save.inForCompany.timviec365 &&
                        obj_save.inForCompany.timviec365.usc_name_add ?
                        obj_save.inForCompany.timviec365.usc_name_add :
                        ''
                    );
                    data.append(
                        'usc_name_phone',
                        obj_save.inForCompany &&
                        obj_save.inForCompany.timviec365 &&
                        obj_save.inForCompany.timviec365.usc_name_phone ?
                        obj_save.inForCompany.timviec365.usc_name_phone :
                        ''
                    );
                    data.append(
                        'usc_name_email',
                        obj_save.inForCompany &&
                        obj_save.inForCompany.timviec365 &&
                        obj_save.inForCompany.timviec365.usc_name_email ?
                        obj_save.inForCompany.timviec365.usc_name_email :
                        ''
                    );
                    data.append('usc_canonical', '');
                    data.append('usc_pass', '');
                    data.append('usc_company', obj_save.userName || '');
                    data.append('usc_alias', obj_save.alias || '');
                    data.append('usc_md5', usc_md5);
                    data.append(
                        'usc_redirect',
                        obj_save.inForCompany &&
                        obj_save.inForCompany.timviec365 &&
                        obj_save.inForCompany.timviec365.usc_redirect ?
                        obj_save.inForCompany.timviec365.usc_redirect :
                        ''
                    );

                    data.append('usc_address', obj_save.address || '');
                    data.append('usc_phone', obj_save.phone || '');
                    data.append('usc_logo', obj_save.avatarUser || '');
                    data.append(
                        'usc_size',
                        obj_save.inForCompany &&
                        obj_save.inForCompany.timviec365 &&
                        obj_save.inForCompany.timviec365.usc_size ?
                        obj_save.inForCompany.timviec365.usc_size :
                        ''
                    );
                    data.append(
                        'usc_website',
                        obj_save.inForCompany &&
                        obj_save.inForCompany.timviec365 &&
                        obj_save.inForCompany.timviec365.usc_website ?
                        obj_save.inForCompany.timviec365.usc_website :
                        ''
                    );
                    data.append('usc_city', obj_save.city || '');
                    data.append('usc_qh', obj_save.district || '');
                    data.append('usc_create_time', obj_save.createdAt ? Number(obj_save.createdAt).toFixed(0) : '');
                    data.append('usc_update_time', obj_save.updatedAt ? Number(obj_save.updatedAt).toFixed(0) : '');
                    data.append(
                        'usc_update_new',
                        obj_save.inForCompany &&
                        obj_save.inForCompany.timviec365 &&
                        obj_save.inForCompany.timviec365.usc_update_new ?
                        obj_save.inForCompany.timviec365.usc_update_new :
                        ''
                    );
                    data.append('usc_view_count', '');
                    data.append('usc_time_login', obj_save.time_login ? Number(obj_save.time_login).toFixed(0) : '');
                    data.append(
                        'usc_active',
                        obj_save.inForCompany &&
                        obj_save.inForCompany.timviec365 &&
                        obj_save.inForCompany.timviec365.usc_active ?
                        obj_save.inForCompany.timviec365.usc_active :
                        ''
                    );
                    data.append(
                        'usc_show',
                        obj_save.inForCompany &&
                        obj_save.inForCompany.timviec365 &&
                        obj_save.inForCompany.timviec365.usc_show ?
                        obj_save.inForCompany.timviec365.usc_show :
                        ''
                    );
                    data.append('usc_mail', '');
                    data.append('usc_stop_mail', '');
                    data.append('usc_utl', '');
                    data.append('usc_ssl', '');
                    data.append('usc_mst', '');
                    //console.log(obj_save.userName ? removeVietnameseTones(obj_save.userName) : "")
                    data.append('usc_name_novn', obj_save.userName ? removeVietnameseTones(obj_save.userName) : '');
                    data.append('usc_authentic', obj_save.authentic || '');
                    data.append('usc_security', '');
                    data.append('usc_lat', '');
                    data.append('usc_long', '');
                    data.append(
                        'usc_ip',
                        obj_save.inForCompany &&
                        obj_save.inForCompany.timviec365 &&
                        obj_save.inForCompany.timviec365.usc_ip ?
                        obj_save.inForCompany.timviec365.usc_ip :
                        ''
                    );
                    data.append('usc_loc', '');
                    data.append(
                        'usc_kd',
                        obj_save.inForCompany && obj_save.inForCompany.timviec365 ? obj_save.inForCompany.usc_kd : ''
                    );
                    data.append(
                        'usc_kd_first',
                        obj_save.inForCompany && obj_save.inForCompany.timviec365 ?
                        obj_save.inForCompany.usc_kd_first :
                        ''
                    );
                    data.append('usc_mail_app', '');
                    data.append('dk', obj_save.fromDevice || 0);
                    data.append('usc_xac_thuc', obj_save.otp || '');
                    data.append('usc_cc365', '');
                    data.append('usc_crm', '');
                    data.append('usc_video', '');
                    data.append('usc_video_type', '');
                    data.append('usc_video_active', '');
                    data.append('usc_images', '');

                    data.append(
                        'usc_active_img',
                        obj_save.inForCompany &&
                        obj_save.inForCompany.timviec365 &&
                        obj_save.inForCompany.timviec365.usc_active_img ?
                        obj_save.inForCompany.timviec365.usc_active_img :
                        ''
                    );
                    data.append('up_crm', '');
                    data.append('chat365_id', obj_save.chat365_id || '');
                    data.append('chat365_secret', obj_save.chat365_secret || '');
                    data.append('usc_block_account', '');
                    data.append('usc_stop_noti', '');
                    data.append('otp_time_exist', '');
                    data.append('id_qlc', obj_save.idQLC || '');
                    data.append('use_test', '');
                    data.append(
                        'usc_badge',
                        obj_save.inForCompany &&
                        obj_save.inForCompany.timviec365 &&
                        obj_save.inForCompany.timviec365.usc_badge ?
                        obj_save.inForCompany.timviec365.usc_badge :
                        ''
                    );
                    data.append(
                        'usc_star',
                        obj_save.inForCompany &&
                        obj_save.inForCompany.timviec365 &&
                        obj_save.inForCompany.timviec365.usc_star ?
                        obj_save.inForCompany.timviec365.usc_star :
                        ''
                    );
                    data.append('scan_base365', obj_save.scan_base365 || '');
                    data.append('check_chat', obj_save.check_chat || '');
                    data.append(
                        'usc_vip',
                        obj_save.inForCompany &&
                        obj_save.inForCompany.timviec365 &&
                        obj_save.inForCompany.timviec365.usc_vip ?
                        obj_save.inForCompany.timviec365.usc_vip :
                        ''
                    );
                    data.append('usc_xacthuc_email', '');
                    data.append('usc_manager', '');
                    data.append('usc_license', '');
                    data.append('usc_active_license', '');
                    data.append('usc_license_additional', '');
                    data.append('raonhanh365_id', obj_save.idRaoNhanh365 || '');
                    data.append('check_raonhanh_id', '');
                    data.append('status_dowload_appchat', '');
                    data.append('status_dowload_wfchat', '');
                    data.append('usc_founding', '');
                    data.append('scan_elastic', '');
                    data.append('point', '');
                    data.append('point_usc', '');
                    data.append('day_reset_point', '');
                    data.append('ngay_reset_diem_ve_0', '');
                    data.append('point_bao_luu', '');
                    data.append('chu_thich_bao_luu', '');
                    data.append('table', 'Users');
                    let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'http://43.239.223.57:9006/add_company',
                        data: data,
                    };

                    await axios.request(config);
                    return true;
                } else {
                    let percents =
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.percents ?
                        obj_save.inForPerson.candidate.percents :
                        0;
                    if (obj_save.fromDevice == 8) {
                        percents = 50;
                    }
                    data.append('use_id', obj_save.idTimViec365 || '');
                    data.append('cv_user_id', obj_save.idTimViec365 || '');
                    data.append('use_email', obj_save.email || '');
                    data.append('use_phone_tk', obj_save.phoneTK || '');
                    data.append('use_first_name', obj_save.userName || '');
                    data.append('use_pass', obj_save.password || '');
                    data.append(
                        'use_type',
                        obj_save.inForPerson && obj_save.inForPerson.candidate ?
                        obj_save.inForPerson.candidate.use_type :
                        ''
                    );
                    data.append('use_create_time', obj_save.createdAt ? Number(obj_save.createdAt).toFixed(0) : '');
                    data.append('use_update_time', obj_save.updatedAt ? Number(obj_save.updatedAt).toFixed(0) : '');

                    data.append(
                        'user_reset_time',
                        obj_save.inForPerson && obj_save.inForPerson.candidate ?
                        obj_save.inForPerson.candidate.user_reset_time :
                        ''
                    );
                    data.append('use_logo', obj_save.avatarUser || '');
                    data.append('use_phone', obj_save.phone || '');
                    data.append('use_email_lienhe', obj_save.emailContact || '');
                    data.append('use_gioi_tinh', obj_save.inForPerson.account.gender || '');
                    data.append('use_birth_day', obj_save.inForPerson.account.birthday || '');
                    data.append('use_birth_mail', '');
                    data.append('use_city', obj_save.city || '');
                    data.append('use_quanhuyen', obj_save.district || '');
                    data.append('use_address', obj_save.address || '');
                    data.append('use_fb', '');
                    data.append('use_hon_nhan', obj_save.inForPerson.account.married || '');
                    data.append(
                        'use_view',
                        obj_save.inForPerson && obj_save.inForPerson.candidate ?
                        obj_save.inForPerson.candidate.use_view :
                        ''
                    );
                    data.append(
                        'use_noti',
                        obj_save.inForPerson && obj_save.inForPerson.candidate ?
                        obj_save.inForPerson.candidate.use_noti :
                        ''
                    );
                    data.append(
                        'use_show',
                        obj_save.inForPerson && obj_save.inForPerson.candidate ?
                        obj_save.inForPerson.candidate.use_show :
                        ''
                    );
                    data.append(
                        'use_show_cv',
                        obj_save.inForPerson && obj_save.inForPerson.candidate ?
                        obj_save.inForPerson.candidate.use_show_cv :
                        ''
                    );
                    data.append(
                        'use_active',
                        obj_save.inForPerson && obj_save.inForPerson.candidate ?
                        obj_save.inForPerson.candidate.use_active :
                        ''
                    );
                    data.append('use_authentic', obj_save.authentic || '');
                    data.append('use_lat', obj_save.latitude || '');
                    data.append('use_long', obj_save.longtitude || '');
                    data.append(
                        'use_td',
                        obj_save.inForPerson && obj_save.inForPerson.candidate ?
                        obj_save.inForPerson.candidate.use_td :
                        ''
                    );
                    data.append('send_vip_time', '');
                    data.append('use_stop_mail', '');
                    data.append('use_utl', '');
                    data.append('use_ssl', '');
                    data.append('use_mail_vt', '');
                    data.append('use_qc', '');
                    data.append(
                        'use_check',
                        obj_save.inForPerson && obj_save.inForPerson.candidate ?
                        obj_save.inForPerson.candidate.use_check :
                        ''
                    );
                    data.append('user_xac_thuc', obj_save.otp || '');
                    data.append('dk', obj_save.fromDevice || '');
                    data.append('chat365_id', obj_save.chat365_id || '');
                    data.append('chat365_secret', obj_save.chat365_secret || '');
                    data.append('use_delete', '');
                    data.append('send_crm', '');
                    data.append('otp_time_exist', '');
                    data.append('id_qlc', obj_save.idQLC || '');
                    data.append('scan_logo', '');
                    data.append('use_test', '');
                    data.append(
                        'point_time_active',
                        obj_save.inForPerson && obj_save.inForPerson.candidate ?
                        obj_save.inForPerson.candidate.point_time_active :
                        ''
                    );
                    data.append('scan_base365', '');
                    data.append('time_send_vl', '');
                    data.append(
                        'use_ip',
                        obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.use_ip ?
                        obj_save.inForPerson.candidate.use_ip :
                        ''
                    );
                    data.append('percents', percents);
                    data.append(
                        'vip',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.percents ?
                        obj_save.inForPerson.candidate.vip :
                        ''
                    );
                    data.append('scan_AI', '');
                    data.append('scan_AI_Lam', '');
                    data.append('scan_AI_percents', '');
                    data.append('check_create_usc', '');
                    data.append(
                        'emp_id',
                        obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.emp_id ?
                        obj_save.inForPerson.candidate.emp_id :
                        ''
                    );
                    data.append('raonhanh365_id', obj_save.idRaoNhanh365 || '');
                    data.append('check_account_raonhanh', '');
                    data.append('check_account_qlc', '');
                    data.append(
                        'scan_audio',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.scan_audio ?
                        obj_save.inForPerson.candidate.scan_audio :
                        ''
                    );
                    data.append('update_uv_ai', '');
                    data.append('check_crm', '');
                    data.append('scan_elastic', '');
                    data.append('cv_id', '');

                    data.append(
                        'cv_title',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.scan_audio ?
                        obj_save.inForPerson.candidate.cv_title :
                        ''
                    );
                    data.append(
                        'cv_hocvan',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.education ?
                        obj_save.inForPerson.account.education :
                        ''
                    );
                    data.append(
                        'cv_exp',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.experience ?
                        obj_save.inForPerson.account.experience :
                        ''
                    );
                    data.append(
                        'cv_muctieu',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_muctieu ?
                        obj_save.inForPerson.candidate.cv_muctieu :
                        ''
                    );
                    data.append(
                        'cv_cate_id',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_cate_id ?
                        obj_save.inForPerson.candidate.cv_cate_id.toString() :
                        ''
                    );
                    data.append(
                        'cv_city_id',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_city_id ?
                        obj_save.inForPerson.candidate.cv_city_id.toString() :
                        ''
                    );
                    data.append('cv_district_id', '');
                    data.append('cv_address', '');
                    data.append(
                        'cv_capbac_id',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_capbac_id ?
                        obj_save.inForPerson.candidate.cv_capbac_id :
                        ''
                    );
                    data.append(
                        'cv_money_id',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_money_id ?
                        obj_save.inForPerson.candidate.cv_money_id :
                        ''
                    );
                    data.append(
                        'cv_loaihinh_id',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_loaihinh_id ?
                        obj_save.inForPerson.candidate.cv_loaihinh_id :
                        ''
                    );
                    data.append(
                        'cv_time',
                        obj_save.inForPerson && obj_save.inForPerson.candidate && obj_save.inForPerson.candidate.cv_time ?
                        obj_save.inForPerson.candidate.cv_time :
                        ''
                    );
                    data.append(
                        'cv_time_dl',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_time_dl ?
                        obj_save.inForPerson.candidate.cv_time_dl :
                        ''
                    );

                    data.append(
                        'cv_kynang',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_kynang ?
                        obj_save.inForPerson.candidate.cv_kynang :
                        ''
                    );
                    data.append(
                        'cv_giai_thuong',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_giai_thuong ?
                        obj_save.inForPerson.candidate.cv_giai_thuong :
                        ''
                    );
                    data.append(
                        'cv_hoat_dong',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_hoat_dong ?
                        obj_save.inForPerson.candidate.cv_hoat_dong :
                        ''
                    );
                    data.append(
                        'cv_so_thich',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_so_thich ?
                        obj_save.inForPerson.candidate.cv_so_thich :
                        ''
                    );
                    data.append(
                        'cv_tc_name',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_tc_name ?
                        obj_save.inForPerson.candidate.cv_tc_name :
                        ''
                    );
                    data.append(
                        'cv_tc_cv',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_tc_cv ?
                        obj_save.inForPerson.candidate.cv_tc_cv :
                        ''
                    );
                    data.append(
                        'cv_tc_dc',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_tc_dc ?
                        obj_save.inForPerson.candidate.cv_tc_dc :
                        ''
                    );
                    data.append(
                        'cv_tc_phone',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_tc_phone ?
                        obj_save.inForPerson.candidate.cv_tc_phone :
                        ''
                    );
                    data.append(
                        'cv_tc_email',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_tc_email ?
                        obj_save.inForPerson.candidate.cv_tc_email :
                        ''
                    );
                    data.append(
                        'cv_tc_company',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_tc_company ?
                        obj_save.inForPerson.candidate.cv_tc_company :
                        ''
                    );
                    data.append(
                        'cv_video',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_video ?
                        obj_save.inForPerson.candidate.cv_video :
                        ''
                    );
                    data.append(
                        'cv_video_type',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_video_type ?
                        obj_save.inForPerson.candidate.cv_video_type :
                        ''
                    );
                    data.append(
                        'cv_video_active',
                        obj_save.inForPerson &&
                        obj_save.inForPerson.candidate &&
                        obj_save.inForPerson.candidate.cv_video_active ?
                        obj_save.inForPerson.candidate.cv_video_active :
                        ''
                    );

                    let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'http://43.239.223.57:9005/add_candidate',
                        data: data,
                    };

                    await axios.request(config);
                    return true;
                }
            }
        }
        return false;
    } catch (error) {
        // console.log(error);
        return false;
    }
};

// delete
const HandleDelete = async(id) => {
    try {
        await axios({
            method: 'post',
            url: 'http://43.239.223.57:9001/updateuser',
            data: {
                user: JSON.stringify({ _id: id }),
            },
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return true;
    } catch (e) {
        console.log('Lỗi khi call sang elasticsearch để xóa');
        return false;
    }
};

const HandleDelete_2 = async(functions, id) => {
    try {
        let obj_2 = {
            function: functions,
            table: 'Users',
            idTimViec365: id,
        };
        await axios({
            method: 'post',
            url: 'http://43.239.223.57:9004/updateuser_test',
            data: {
                user: JSON.stringify(obj_2),
            },
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return true;
    } catch (e) {
        console.log('Lỗi khi call sang elasticsearch để xóa');
        return false;
    }
};

const deleteCandidate = async(id) => {
    try {
        const check = await Users.findOne({ idTimViec365: id, type: 0 });
        if (check) {
            let data = new FormData();
            data.append('use_id', id);
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://43.239.223.57:9005/delete_candidate',
                data: data,
            };

            axios
                .request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                    console.log(error);
                });
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
};

UserSchema.pre('deleteOne', function(next) {
    // console.log("deleteOne" + this.getQuery())
    HandleDelete(this.getQuery()['_id']);
    HandleDelete_2('deleteOne', this.getQuery()['_id']);
    next();
});
UserSchema.pre('deleteMany', function(next) {
    HandleDelete(this.getQuery()['_id']);
    HandleDelete_2('deleteMany', this.getQuery()['_id']);
    next();
});

module.exports = Users;