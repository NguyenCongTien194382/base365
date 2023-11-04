const mongoose = require('mongoose');

let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');
const UserSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        autoIncrement: true
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
        default: null
    },
    phone: {
        // Sđt liên hệ
        type: String,
        default: null
    },
    emailContact: {
        // Email của người liên hệ khi đăng ký
        type: String,
        default: null
    },
    avatarUser: {
        // Ảnh đại diện
        type: String,
        default: null
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
        default: null
    },
    authentic: {
        // Tình trạng kích hoạt tài khoản hay chưa (0: Chưa kích hoạt, 1: Đã kích hoạt)
        type: Number,
        default: 0
    },
    isOnline: {
        // Trạng thái online bên chat
        type: Number,
        default: 0
    },
    fromWeb: {
        // Nguồn đăng ký từ site nào
        type: String,
        default: null
    },
    fromDevice: {
        // Nguồn đăng ký từ thiết bị nào (tương đương trường "dk" của timviec365)
        type: Number,
        default: 0
    },
    createdAt: {
        // Thời gian đăng ký
        type: Number,
        default: 0
    },
    updatedAt: {
        // Thời gian cập nhật
        type: Number,
        default: 0
    },
    lastActivedAt: {
        // Thời gian hoạt động gần nhất
        type: Date,
        default: new Date()
    },
    time_login: {
        // Thời gian đăng nhập
        type: Number,
        default: 0
    },
    role: {
        // Quyền thực hiện bên quản lý chung
        type: Number,
        default: 0
    },
    latitude: {
        // Tọa độ lat
        type: String,
        default: null
    },
    longtitude: {
        // Tọa độ long
        type: String,
        default: null
    },
    idQLC: {
        // ID gốc lấy từ base chuyển đổi số
        type: Number,
        default: 0
    },
    idTimViec365: {
        // ID gốc lấy từ base timviec365
        type: Number,
        default: 0
    },
    idRaoNhanh365: {
        // ID gốc lấy từ base raonhanh365
        type: Number,
        default: 0
    },
    chat365_secret: {
        // Mã chat
        type: String,
        default: null
    },
    chat365_id: {
        //Chờ cập nhật
        type: Number,
        default: 0
    },
    scan_base365: {
        //Chờ cập nhật
        type: Number,
        default: 0
    },
    check_chat: {
        //Chờ cập nhật
        type: Number,
        default: 0
    },
    sharePermissionId: [{
        type: Number
    }],

    inForPerson: {
        type: {
            scan: {
                type: Number,
                default: 0
            },
            account: {
                type: {
                    birthday: {
                        // Ngày sinh
                        type: Number,
                        default: null
                    },
                    gender: {
                        // Giới tính
                        type: Number,
                        default: 0
                    },
                    married: {
                        // Tình trạng hôn nhân
                        type: Number,
                        default: 0
                    },
                    experience: {
                        // Kinh nghiệm làm việc trong thông tin liên hệ
                        type: Number,
                        default: 0
                    },
                    education: {
                        // Học vấn
                        type: Number,
                        default: 0
                    },
                },
                default: {
                    birthday: null,
                    gender: 0,
                    married: 0,
                    experience: 0,
                    education: 0
                }
            },
            // Thông tin dành cho luồng chuyển đổi số
            employee: {
                type: {
                    com_id: {
                        // ID của công ty chủ quyền nếu là nhân viên (giá trị = 0 là cá nhân)
                        type: Number,
                        default: 0
                    },
                    listOrganizeDetailId: [{
                        level: Number,
                        organizeDetailId: Number,
                        _id: false
                    }],
                    organizeDetailId: {
                        type: Number,
                        default: 0
                    },
                    dep_id: {
                        // ID của phòng ban nếu là nhân viên (giá trị = 0 là cá nhân)
                        type: Number,
                        default: 0
                    },
                    start_working_time: {
                        // Thời gian bắt đầu làm việc
                        type: Number,
                        default: 0
                    },
                    position_id: {
                        // Cấp bậc của nhân viên trong công ty
                        type: Number,
                        default: 0
                    },
                    team_id: {
                        // ID của tổ nếu là nhân viên
                        type: Number,
                        default: 0
                    },
                    group_id: {
                        // ID của nhóm nếu là nhân viên 
                        type: Number,
                        default: 0
                    },
                    time_quit_job: {
                        // Thời gian nghỉ việc
                        type: Number,
                        default: 0
                    },
                    ep_description: {
                        // Mô tả chi tiết
                        type: String,
                        default: null
                    },
                    ep_featured_recognition: {
                        // Chưa rõ nữa
                        type: String,
                        default: null
                    },
                    ep_status: {
                        // Trạng thái của nhân viên (Active: Duyệt, Pending: chờ duyệt, Deny: Từ chối)
                        type: String,
                        default: "Pending"
                    },
                    ep_signature: {
                        // Chữ ký
                        type: Number,
                        default: 0
                    },
                    allow_update_face: {
                        // Cho phép cập nhật khuôn mặt chấm công
                        type: Number,
                        default: 0
                    },
                    version_in_use: {
                        // Version dùng trên app
                        type: Number,
                        default: 0
                    },
                    role_id: {
                        type: Number,
                        default: 0
                    }
                },
                default: null

            },
            candidate: {
                type: {
                    use_type: {
                        type: Number,
                        default: 0
                    },
                    user_reset_time: {
                        type: Number,
                        default: 0
                    },
                    use_view: {
                        type: Number,
                        default: 0
                    },
                    use_noti: {
                        type: Number,
                        default: 2
                    },
                    use_show: {
                        type: Number,
                        default: 1
                    },
                    use_show_cv: {
                        type: Number,
                        default: 0
                    },
                    use_active: {
                        type: Number,
                        default: 0
                    },
                    use_td: {
                        type: Number,
                        default: 0
                    },
                    use_check: {
                        type: Number,
                        default: 1
                    },
                    use_test: {
                        type: Number,
                        default: 0
                    },
                    use_badge: {
                        // Đánh dấu huy hiệu tia sét
                        type: Number,
                        default: 0
                    },
                    point_time_active: {
                        type: Number,
                        default: 0
                    },
                    cv_title: {
                        // Công việc mong muốn
                        type: String,
                        default: ""
                    },
                    cv_muctieu: {
                        // Mục tiêu làm việc
                        type: String,
                        default: null
                    },
                    cv_kynang: {
                        // Kỹ năng
                        type: String,
                        default: null
                    },
                    cv_giai_thuong: {
                        // Giải thưởng
                        type: String,
                        default: null
                    },
                    cv_hoat_dong: {
                        // Hoạt động
                        type: String,
                        default: null
                    },
                    cv_so_thich: {
                        // Sở thích
                        type: String,
                        default: null
                    },
                    cv_city_id: {
                        // Tỉnh thành làm việc mong muốn
                        type: [Number],
                        default: [],
                        index: true
                    },
                    cv_district_id: {
                        // Tỉnh thành làm việc mong muốn
                        type: [Number],
                        default: [],
                        index: true
                    },
                    cv_address: {
                        // Địa điểm mong muốn
                        type: String,
                        default: null
                    },
                    cv_cate_id: {
                        // Ngành nghề làm việc mong muốn
                        type: [Number],
                        default: [],
                        index: true
                    },
                    cv_capbac_id: {
                        // Cấp bậc làm việc mong muốn
                        type: Number,
                        default: 0
                    },
                    cv_money_id: {
                        // Mức lương mong muốn
                        type: Number,
                        default: 0
                    },
                    cv_loaihinh_id: {
                        // Loại hình làm việc (fulltime, parttime,...)
                        type: Number,
                        default: 0
                    },
                    cv_time: {
                        type: Number,
                        default: 1
                    },
                    cv_time_dl: {
                        type: Number,
                        default: 0
                    },
                    // cv_kynang: {
                    //     // Kỹ năng làm việc
                    //     type: String,
                    //     default: null
                    // },
                    um_type: {
                        // Mức lương mong muốn (thỏa thuận hoặc từ min đến max)
                        type: Number,
                        default: 0
                    },
                    um_min_value: {
                        type: Number,
                        default: null
                    },
                    um_max_value: {
                        type: Number,
                        default: null
                    },
                    um_unit: {
                        // Mức lương mong muốn (vnd/usd)
                        type: Number,
                        default: 0
                    },
                    cv_tc_name: {
                        // Tên người tham chiếu
                        type: String,
                        default: null
                    },
                    cv_tc_cv: {
                        // Chức vụ của người tham chiếu
                        type: String,
                        default: null
                    },
                    cv_tc_dc: {
                        // Địa chỉ của người tham chiếu
                        type: String,
                        default: null
                    },
                    cv_tc_phone: {
                        // SĐT người tham chiếu
                        type: String,
                        default: null
                    },
                    cv_tc_email: {
                        // Email người tham chiếu
                        type: String,
                        default: null
                    },
                    cv_tc_company: {
                        // Công ty làm việc của người tham chiếu
                        type: String,
                        default: null
                    },
                    cv_video: {
                        // Video khi ứng viên đăng ký tài khoản
                        type: String,
                        default: null
                    },
                    cv_video_type: {
                        // 1: Video tự tải, 2: Video từ youtube, tiktok
                        type: Number,
                        default: 0
                    },
                    cv_video_active: {
                        // Video được duyệt hay chưa (0: chưa duyệt, 1: được duyệt)
                        type: Number,
                        default: 0
                    },
                    use_ip: {
                        // Video khi ứng viên đăng ký tài khoản
                        type: String,
                        default: null
                    },
                    percents: {
                        type: Number,
                        default: 0
                    },

                    vip: {
                        type: Number,
                        default: 0
                    },
                    check_create_use: {
                        type: Number,
                        default: 0
                    },
                    emp_id: {
                        type: Number,
                        default: 0
                    },
                    profileDegree: [{
                        type: {
                            th_id: {
                                type: Number,
                                autoIncrement: true
                            },
                            th_name: {
                                type: String,
                                default: null
                            },
                            th_bc: {
                                type: String,
                                default: null
                            },
                            th_cn: {
                                // Chuyên ngành
                                type: String,
                                default: null
                            },
                            th_xl: {
                                type: Number,
                                default: 0
                            },
                            th_bs: {
                                type: String,
                                default: null
                            },
                            th_one_time: {
                                type: Number,
                                default: 0
                            },
                            th_two_time: {
                                type: Number,
                                default: 0
                            },
                        },
                        default: null
                    }],
                    profileNgoaiNgu: [{
                        type: {
                            nn_id: {
                                type: Number,
                                autoIncrement: true
                            },
                            nn_id_pick: {
                                // Ngôn ngữ học
                                type: Number,
                                default: 0
                            },
                            nn_cc: {
                                // Chứng chỉ đạt được
                                type: String,
                                default: null
                            },
                            nn_sd: {
                                // Số điểm đạt được
                                type: String,
                                default: null
                            }
                        },
                        default: null
                    }],
                    profileExperience: [{
                        type: {
                            kn_id: {
                                type: Number,
                                autoIncrement: true
                            },
                            kn_name: {
                                type: String,
                                default: null
                            },
                            kn_cv: {
                                type: String,
                                default: null
                            },
                            kn_mota: {
                                type: String,
                                default: null
                            },
                            kn_one_time: {
                                type: Number,
                                default: 0
                            },
                            kn_two_time: {
                                type: Number,
                                default: 0
                            },
                            kn_hien_tai: {
                                type: Number,
                                default: 0
                            },
                            kn_duan: {
                                type: String,
                                default: null
                            },
                        },
                        default: null
                    }],
                    scan_audio: {
                        type: Number,
                        default: 0
                    },
                    audio: {
                        type: String,
                        default: null
                    },
                    scan_elastic: {
                        type: Number,
                        default: 0
                    },
                    anhsao_badge: {
                        type: Number,
                        default: 0
                    },
                    star3: {
                        type: Number,
                        default: 0
                    },
                    time_active_star3: {
                        type: Number,
                        default: 0
                    }
                },
                default: null
            }
        },
        default: null
    },
    inForCompany: {
        type: {
            scan: {
                type: Number,
                default: 0
            },
            usc_kd: {
                // ID Kinh doanh phụ trách hỗ trợ
                type: Number,
                default: 0
            },
            usc_kd_first: {
                type: Number,
                default: 0
            },
            description: {
                // Mô tả công ty
                type: String,
                default: null
            },
            com_size: {
                // Quy mô công ty
                type: Number,
                default: 0
            },
            timviec365: {
                // Thông tin công ty luồng timviec365
                usc_name: {
                    // Tên người liên hệ
                    type: String,
                    default: null
                },
                usc_name_add: {
                    // Địa chỉ người liên hệ
                    type: String,
                    default: null
                },
                usc_name_phone: {
                    // SĐT người liên hệ
                    type: String,
                    default: null
                },
                usc_name_email: {
                    // Email người liên hệ
                    type: String,
                    default: null
                },
                usc_update_new: {
                    type: Number,
                    default: 0
                },
                usc_canonical: {
                    // Mã sinh ra url phục vụ seo (canonical)
                    type: String,
                    default: null
                },
                usc_md5: {
                    type: String,
                    default: null
                },
                usc_redirect: {
                    type: String
                },
                usc_type: {
                    type: Number,
                    default: 0
                },
                usc_size: {
                    type: Number,
                    default: 0
                },
                usc_website: {
                    // Website công ty
                    type: String,
                    default: null
                },
                usc_view_count: {
                    // Tổng lượt xem
                    type: Number,
                    default: 0
                },
                usc_active: {
                    // Tổng lượt xem
                    type: Number,
                    default: 0
                },
                usc_show: {
                    type: Number,
                    default: 1
                },
                usc_mail: {
                    type: Number,
                    default: 0
                },
                usc_stop_mail: {
                    type: Number,
                    default: 0
                },
                usc_utl: {
                    type: Number,
                    default: 0
                },
                usc_ssl: {
                    type: Number,
                    default: 0
                },
                usc_mst: {
                    // Mã số thuế
                    type: String,
                    default: null
                },
                usc_security: {
                    type: String,
                    default: null
                },
                usc_ip: {
                    // IP của công ty khi đăng ký
                    type: String,
                    default: null
                },
                usc_loc: {
                    type: Number,
                    default: 0
                },
                usc_mail_app: {
                    type: Number,
                    default: 0
                },
                usc_video: {
                    type: String,
                    default: null
                },
                usc_video_type: {
                    type: Number,
                    default: 1
                },
                usc_video_active: {
                    type: Number,
                    default: 0
                },
                usc_block_account: {
                    type: Number,
                    default: 0
                },
                usc_stop_noti: {
                    type: Number,
                    default: 0
                },
                otp_time_exist: {
                    type: Number,
                    default: 0
                },
                usc_test: {
                    type: Number,
                    default: 0
                },
                usc_badge: {
                    // Đánh dấu huy hiệu tia sét
                    type: Number,
                    default: 0
                },
                // usc_star: {
                //     // Đánh giá sao
                //     type: Number,
                //     default: 0
                // },
                usc_vip: {
                    type: Number,
                    default: 0
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
                    default: null
                },
                usc_dgc: {
                    type: String,
                    default: null
                },
                usc_dgtv: {
                    type: String,
                    default: null
                },
                usc_dg_time: {
                    type: Number,
                    default: 0
                },
                usc_skype: {
                    type: String,
                    default: null
                },
                usc_video_com: {
                    type: String,
                    default: null
                },
                usc_lv: {
                    // Lĩnh vực của công ty
                    type: String,
                    default: null
                },
                usc_zalo: {
                    //Zalo ntd
                    type: String,
                    default: null
                },
                usc_star: {
                    //NTD có ánh sao(điểm lịch sử >= 70))
                    type: Number,
                    default: 0
                },
                usc_cc365: {
                    type: Number,
                    default: 0
                },
                usc_crm: {
                    type: Number,
                    default: 0
                },
                usc_images: {
                    //kho ảnh ntd
                    type: String,
                    default: null
                },
                usc_active_img: {
                    //0: chưa được duyệt; 1: đã duyệt
                    type: Number,
                    default: 0
                },
                usc_manager: {
                    //tên giám đốc công ty
                    type: String,
                    default: null
                },
                usc_license: {
                    //giấy phép kinh doanh ntd
                    type: String,
                    default: null
                },
                usc_active_license: {
                    //1: xác nhận giấy phép kinh doanh ntd
                    type: Number,
                    default: 0
                },
                usc_founded_time: {
                    //Thời gian công ty được thành lập
                    type: Number,
                    default: 0
                },
                usc_branches: {
                    type: [{
                        usc_branch_cit: {
                            //tỉnh thành chi nhánh
                            type: Number,
                            default: 0
                        },
                        usc_branch_qh: {
                            //quận huyện chi nhánh
                            type: Number,
                            default: 0
                        },
                        usc_branch_address: {
                            //địa chỉ chi nhánh
                            type: String,
                            default: null
                        },
                        usc_branch_time: {
                            //Thời gian tạo
                            type: Number,
                            default: 0
                        },
                    }],
                    default: [],
                },
                usc_xacthuc_email: {
                    type: Number,
                    default: 0
                },
                usc_note: {
                    type: String,
                    default: ""
                }
            },
            // Thông tin công ty luồng chuyển đổi số
            cds: {
                com_parent_id: {
                    type: Number,
                    default: null
                },
                type_timekeeping: {
                    // 1: là khuôn mặt, 2: là QR, 3: là chấm công công ty, 4: là chấm công web, 5: là PC365, 6: là giới hạn IP nhân viên, 7 là giới hạn IP công ty; 8: chấm công trên app chat365; 9: chấm công qr app chat
                    type: String,
                    default: "1,2,3,4,5,8,9"
                },
                id_way_timekeeping: {
                    // Chưa rõ, cập nhật sau
                    type: String,
                    default: 1
                },
                com_role_id: {
                    // Chưa rõ, cập nhật sau
                    type: Number,
                    default: 0
                },
                com_qr_logo: {
                    type: String,
                    default: null
                },
                enable_scan_qr: {
                    // Cho phép quét mã QR
                    type: Number,
                    default: 0
                },
                com_vip: {
                    // Có phải là công ty vip hay không (1:VIP)
                    type: Number,
                    default: 0
                },
                com_ep_vip: {
                    // Số lượng nhận viên đạt vip
                    type: Number,
                    default: 5
                },
                com_vip_time: {
                    // Thời gian vip
                    type: Number,
                    default: 0
                },
                ep_crm: {
                    type: Number,
                    default: 0
                },
                ep_stt: {
                    type: Number,
                    default: 1
                },

            }
        },
        default: null
    },
    inforRN365: {
        type: {
            cccd: {
                //so cmnd/can cuoc cong dan
                type: String,
                default: null
            },
            cccdFrontImg: {
                //anh truoc cccd
                type: String,
                default: null
            },
            cccdBackImg: {
                //anh sau cccd
                type: String,
                default: null
            },
            bankName: {
                //ten ngan hang
                type: String,
                default: null
            },
            stk: {
                //so tai khoan
                type: String,
                default: null
            },
            xacThucLienket: {
                type: Number,
                default: null
            },
            store_name: {
                type: String,
                default: null
            },
            store_phone: {
                type: String,
                default: null
            },
            ownerName: {
                //ten chu tai khoan
                type: String,
                default: null
            },
            time: {
                //thoi gian xac thuc
                type: Date,
                default: null
            },
            active: {
                //admin da xac thuc hay chua(0: chua xac thuc)
                type: Number,
                default: 0
            },
            money: {
                type: Number,
                default: 0
            },
            usc_tax_code: {
                // mã số thuế 
                type: Number,
                default: 0
            },
            usc_des: {
                // mô tả 
                type: String,
                default: null
            },
            usc_note: {
                type: String,
                default: ""
            }
        },
        default: null
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
                default: "",
            },
            IpAddress: {
                type: String,
                default: "",
            },
            NameDevice: {
                type: String,
                default: "",
            },
            Time: {
                type: Date,
                default: new Date(),
            },
            AccessPermision: {
                type: Boolean,
                default: false,
            },
        }],
        removeSugges: {
            type: [Number],
            default: [],
        },
        userNameNoVn: {
            type: String,
            default: ""
        },
        doubleVerify: {
            type: Number,
            default: 0,
        },
        active: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            default: ''
        },
        acceptMessStranger: {
            type: Number,
            default: 0
        }
    },
    scan: {
        type: Number,
        default: 0
    },
    // Có active nhận diện cảm xúc hay không -> chỉ dành cho tk công ty
    emotion_active: {
        type: Boolean,
        default: false
    },
    scanElacticAdmin: {
        type: Number,
        default: 0
    },
    deleteTime: {
        type: Number,
        default: 0
    }
}, {
    collection: 'UsersDeleted',
    versionKey: false,
    timestamp: true
})
let Users = connection.model("UsersDeleted", UserSchema);


module.exports = Users;