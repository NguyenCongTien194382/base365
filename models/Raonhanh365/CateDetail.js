const mongoose = require('mongoose');
const CateDetailRaonhanh365Schema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        default: null,
    },
    
    productGroup: {
        // nhóm sản phẩm
        type: [{
            _id: Number,
            name: String,
        }],
        default: null,
    },
    productShape: {
        // nhóm sản phẩm có hình dạng
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
            parent: {
                type: Number
            },
        }],
        default: null,
    },
    productMaterial: {
        // nhóm sản phẩm có chất liệu
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
            parent: {
                type: Number
            },
        }],
        default: null,
    },
    petPurebred: {
        // giống thú cưng
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
            parent: {
                type: Number
            },
        }],
        default: null,
    },
    petInfo: {
        // thông tin thú cưng
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
            type: {
                // phân loại theo : 1.Độ tuổi 2.Kích cỡ 3.Giống( đực|| cái)
                type: Number
            }
        }],
        default: null,
    },
    origin: {
        // xuất xứ
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
            parent: {
                type: Number
            },
        }],
        default: null,
    },
    capacity: {
        //dung lượng đối với sản phẩm điện tử
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
            type: {
                // phân loại: 1. Ram 2.Ổ cứng 3.Dung tích xe
                type: Number
            },
            parent: {
                type: Number
            }
        }],
        default: null,
    },
    screen: {
        //màn hình
        type: [{
            _id: {
                type: Number,
            },
            name: {
                type: String,
            },
            type: {
                // phân loại: 1: card, 2: kích cỡ, 3: kích thước khung
                type: Number,
            },
            parent: {
                type: Number
            }
        }],
        default: null,
    },
    warranty: {
        //bảo hành
        type: [{
            _id: {
                type: Number
            },
            warrantyTime: {
                //thời gian bảo hành
                type: String
            },
            parent: {
                type: Number
            },
        }],
        default: null,
    },
    processor: {
        //bộ vi xử lý
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
        }],
        default: null,
    },
    yearManufacture: {
        //năm sản xuất
        type: [{
            _id: {
                type: Number
            },
            year: {
                type: String
            },
            parent: {
                type: Number
            }
        }],
        default: null,
    },
    colors: {
        // màu sắc 
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
            parent: {
                type: Number
            }
        }],
        default: null,
    },
    brand: {
        //hãng của sp
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
            parent: {
                type: Number
            },
            line: {

                // dòng sp
                type: [{
                    _id: {
                        type: Number
                    },
                    name: {
                        type: String
                    },
                }],
                default: null,

            }
        }],
        default: null,
    },
    storyAndRoom: {
        // số tầng, phòng của nhà
        type: [{
            _id: {
                type: Number
            },
            quantity: {
                //số lượng- String
                type: String
            },
            type: {
                // loại: 1.tầng 2.Phòng ngủ 3.Nhà vệ sinh
                type: Number
            },
        }],
        default: null,
    },
    sport: {
        // môn thể thao
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
            type: {
                //phân loại
                type: Number
            }
        }],
        default: null,
    },
    allType: {
        // loai_chung: chưa hiểu...
        type: [{
            _id: {
                type: Number
            },
            name: {
                type: String
            },
            parent: {
                type: Number
            }
        }],
        default: null,
    },
}, {
    collection: 'RN365_CateDetail',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('RN365_CateDetail', CateDetailRaonhanh365Schema);