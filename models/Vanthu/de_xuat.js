const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Vanthu_de_xuat = new Schema({


    _id: {
        type: Number,

    },
    name_dx: {
        type: String,

    },
    type_dx: {
        type: Number,

    },
    noi_dung: {
        nghi_phep: {
            nd: [{
                bd_nghi: { //ngày bắt đầu nghỉ
                    type: String,
                    default: null,

                },
                kt_nghi: { // Ngày kết thúc nghỉ
                    type: String,
                    default: null,

                },
                ca_nghi: {
                    type: Number,
                    default: null,

                }
            }],
            loai_np: { // loại nghỉ phép
                type: Number,
                default: null,

            },
            ly_do: {
                type: String, // Lý do chung của mọi loại đề xuất
                default: null,

            },
        },

        doi_ca: {
            ngay_can_doi: { //chọn ngày ca cần đổi
                type: Number,
                default: null,

            },
            ca_can_doi: {
                type: Number,
                default: null,

            },

            ngay_muon_doi: { //chọn ngày ca được đỏi
                type: Number,
                default: null,


            },
            ca_muon_doi: {
                type: Number,
                default: null,

            },
            ly_do: {
                type: String, // Lý do chung của mọi loại đề xuất
                default: null,


            },


        },

        //Đề xuất tạm ứng
        tam_ung: {
            ngay_tam_ung: { //Ngày tạm ứng
                type: Number,
                default: null,

            },
            sotien_tam_ung: { //Số tiền tạm ứng
                type: Number,
                default: null,

            },
            ly_do: {
                type: String,
                default: null,
                // Lý do chung của mọi loại đề xuất
            },
        },

        //Đề xuất cấp phát tài sản
        cap_phat_tai_san: {
            danh_sach_tai_san: {
                type: String,
                default: null,

            },
            so_luong_tai_san: {
                type: Number,
                default: null,

            },
            ly_do: {
                type: String,
                default: null,
                // Lý do chung của mọi loại đề xuất
            },
        },

        //Đơn xin thôi việc
        thoi_viec: {
            ngaybatdau_tv: {
                type: Date,
                default: null,

            },
            ca_bdnghi: {
                type: Number,
                default: null,

            },
            ly_do: {
                type: String,
                default: null,
                // Lý do chung của mọi loại đề xuất
            },

        },

        //Đề xuất tăng lương
        tang_luong: {
            mucluong_ht: { //mức lương hiện tại
                type: Number,
                default: null,

            },
            mucluong_tang: {
                type: Number,
                default: null,

            },
            date_tang_luong: {
                type: Number,
                default: null,

            },
            ly_do: {
                type: String, // Lý do chung của mọi loại đề xuất
                default: null,

            },
        },

        //Đề xuất bổ nhiệm
        bo_nhiem: {
            thanhviendc_bn: { //thanhv vien duoc bo nhiẹm
                type: Number,
                default: null,

            },
            name_ph_bn: { // ten phong ban 
                type: String,
                default: null,

            },
            chucvu_hientai: {
                type: Number,
                default: null,

            },
            chucvu_dx_bn: { //chức vụ đề xuất bổ nhiệm 
                type: String,
                default: null,

            },
            phong_ban_moi: {
                type: String,
                default: null,

            },
            ly_do: {
                type: String, // Lý do chung của mọi loại đề xuất
                default: null,

            },
        },

        //Đề xuất luân chuyển công tác
        luan_chuyen_cong_tac: {
            cv_nguoi_lc: {
                type: String,
                default: null,

            },
            pb_nguoi_lc: {
                type: String,
                default: null,

            },
            noi_cong_tac: {
                type: String,
                default: null,

            },
            noi_chuyen_den: {
                type: String,
                default: null,

            },
            ly_do: {
                type: String,
                default: null,
                // Lý do chung của mọi loại đề xuất
            },

        },

        //Đề xuất tham gia dự án
        tham_gia_du_an: {
            cv_nguoi_da: {
                type: String,
                default: null,

            },
            pb_nguoi_da: {
                type: String,
                default: null,

            },
            dx_da: {
                type: String,
                default: null,

            },
            ly_do: {
                type: String,
                default: null,
                // Lý do chung của mọi loại đề xuất
            },
        },

        //Đề xuất xin tăng ca
        tang_ca: {
            time_tc: {
                type: Number,
                default: null,

            },
            shift_id: {
                type: Number
            },
            ly_do: {
                type: String,
                default: null,
                // Lý do chung của mọi loại đề xuất
            },
        },

        //Đề xuất xin nghỉ chế độ thai sản
        nghi_thai_san: {
            ngaybatdau_nghi_ts: {
                type: Number,
                default: null,

            },
            ngayketthuc_nghi_ts: {
                type: Number,
                default: null,

            },
            ly_do: {
                type: String,
                default: null,
                // Lý do chung của mọi loại đề xuất
            },
        },

        //Đề xuất đăng kí sử dụng phòng họp
        su_dung_phong_hop: {
            bd_hop: {
                type: Number,
                default: null,

            },
            end_hop: {
                type: Number,
                default: null,

            },
            ly_do: {
                type: String,
                default: null,
                // Lý do chung của mọi loại đề xuất
            },
        },

        // Đề xuất đăng ký sử dụng xe công
        su_dung_xe_cong: {
            bd_xe: {
                type: Number,
                default: null,

            },
            end_xe: {
                type: Number,
                default: null,

            },
            soluong_xe: {
                type: Number,
                default: null,

            },
            local_di: {
                type: String,
                default: null,

            },
            local_den: {
                type: String,
                default: null,

            },
            ly_do: {
                type: String // Lý do chung của mọi loại đề xuất
            },
        },

        //Đề xuất sửa chưa cơ sở vật chất
        sua_chua_co_so_vat_chat: {
            noi_dung: [{
                name_taisan: {
                    type: String,
                    default: null,
    
                },
    
                //Đề xuất thanh toán
                so_tien: {
                    type: Number,
                    default: null,
    
                },
                ly_do: {
                    type: String,
                    default: null,
                    // Lý do chung của mọi loại đề xuất
                },
            }],
            ly_do: {
                type: String // Lý do chung của mọi loại đề xuất
            },
        },

        // đề xuất xác nhận công
        xac_nhan_cong: {
            time_xnc: {
                type: Date,
                default: null,

            },
            time_vao_ca: {
                type: String
            },
            time_het_ca: {
                type: String
            },
            ca_xnc: {
                type: String,
                default: null,

            },
            id_ca_xnc: {
                type: Number,
                default: null,

            },
            ly_do: {
                type: String,
                default: null,
                // Lý do chung của mọi loại đề xuất
            },

        },

        lich_lam_viec: {
            lich_lam_viec: { //1-t2->t6 2.t2->t7 3.t2->CN
                type: Number,
                default: null,

            },
            thang_ap_dung: {
                type: Number,
                default: null,

            },
            ngay_bat_dau: { //ngay bat dau lam viec
                type: Number,
                default: null,

            },
            ca_la_viec: { //1-ca hanh chinh 2-ca sang 3-ca chieu
                type: String,
                default: null,

            },
            ngay_lam_viec: { //llich lamm viec hang ngay
                type: String,
                default: null,

            },
            ly_do: {
                type: String,
                default: null,
            }
        },

        hoa_hong: {
            chu_ky: {
                type: String,
                default: null,

            },
            time_hh: {
                type: String,
                default: null,

            },
            item_mdt_date: {
                type: String,
                default: null,

            },
            dt_money: { //tong doanh thu
                type: String,
                default: null,

            },
            name_dt: { //muc doanh thu
                type: String,
                default: null,

            },
            ly_do: {
                type: String,
                default: null,

            }
        },

        //Đề xuất khiếu nại
        khieu_nai: {
            ly_do: {
                type: String
            }
        },

        //Đề xuất thanh toán
        thanh_toan: {
            so_tien_tt: {
                type: Number,
                default: null,

            },
            ly_do: {
                type: String,
                default: null,

            }
        },

        thuong_phat: {
            so_tien_tp: {
                type: Number,
                default: null,

            },
            time_tp: {
                type: Date,
                default: null,

            },
            nguoi_tp: {
                type: String,
                default: null,

            },
            type_tp: {
                type: Number,
                default: null,

            },
            ly_do: {
                type: String,
                default: null,

            }
        },
        //Đề xuất đi muộn về sớm
        di_muon_ve_som: {
            time_batdau: {
                type: Number,
                default: null,
            },
            time_batdau_tomorrow: {
                type: Boolean,
                default: false,
            },
            time_ketthuc: {
                type: Number,
                default: null,
            },
            time_ketthuc_tomorrow: {
                type: Boolean,
                default: false,
            },
            ca_lam_viec: {
                type: String,
                default: null,
            },
            ly_do: {
                type: String,
                default: null, // Lý do chung của mọi loại đề xuất
            },

        },

        nghi_phep_ra_ngoai: {
            bd_nghi: { //ngày bắt đầu nghỉ
                type: Number,
                default: null,

            },
            kt_nghi: { // Ngày kết thúc nghỉ
                type: Number,
                default: null,
            },
            ca_nghi: {
                type: Number,
                default: null,
            },
            ly_do: {
                type: String, // Lý do chung của mọi loại đề xuất
                default: null,
            },
        },

        nhap_ngay_nhan_luong: {
            ngay_nhan_luong: { //ngày nhận lương
                type: Number,
                default: null,

            },
            ly_do: {
                type: String, // Lý do chung của mọi loại đề xuất
                default: null,
            },
        },

        xin_tai_tai_lieu: {
            ten_tai_lieu: {
                type: String,
                default: null,

            },
            ly_do: {
                type: String, // Lý do chung của mọi loại đề xuất
                default: null,
            },
        },
    },
    name_user: {
        type: String,

    },
    id_user: {
        type: Number,

    },
    com_id: {
        type: Number,

    },
    kieu_duyet: {
        type: Number,
        default: 0,
    },
    id_user_duyet: {
        type: String,

    },
    id_user_theo_doi: {
        type: String,

    },
    file_kem: {
        type: [{
            file: {
                type: String,
            }
        }]
    },
    type_duyet: {
        type: Number,
        default: 0

    },
    type_time: { //đề xuất nghỉ đột xuất or có kế hoạch
        type: Number,
        default: 0

    },
    time_start_out: {
        type: String,

    },
    time_create: {
        type: Number,
    },
    time_tiep_nhan: {
        type: Number,
        default: 0

    },
    time_duyet: {
        type: Number,
        default: 0

    },
    active: { // trạng thái duyệt
        type: Number, //'1: đã api bên 3 đồng ý; 2: bên 3 không đồng ý',
        default: 0
    },
    del_type: { // trạng thái xoa
        type: Number, //'1:active; 2 delete'
        default: 1
    },
    user_del: {
        type: Number,
      }
})
module.exports = mongoose.model("Vanthu_de_xuat", Vanthu_de_xuat);