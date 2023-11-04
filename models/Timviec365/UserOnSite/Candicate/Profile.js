// hồ sơ
const mongoose = require('mongoose');
const axios = require('axios');
let connection = mongoose.createConnection('mongodb://127.0.0.1:27017/api-base365');
const Tv365ProfileSchema = new mongoose.Schema({
    hs_id: {
        type: Number,
        require: true,
        unique: true,
        autoIncrement: true
    },
    hs_use_id: {
        type: Number,
        require: true,
    },
    hs_name: {
        // Tên của file được lưu lại
        type: String,
        default: null
    },
    hs_link: {
        // Đường dẫn cv không che thông tin
        type: String,
        default: null
    },
    hs_cvid: {
        // Đường dẫn cv và đường dẫn cv che thông tin email,sđt khi tạo cv
        type: Number,
        default: 0
    },
    hs_create_time: {
        type: Number,
        default: 0
    },
    hs_active: {
        type: Number,
        default: 0
    },
    hs_link_hide: {
        type: String,
        default: null
    },
    is_scan: {
        type: Number,
        default: 0
    },
    hs_link_error: {
        type: String,
        default: null
    },
    state: {
        type: Number,
        default: 0
    },
    mdtd_state: {
        type: Number,
        default: 0
    },
    scan_cv: {
        type: Number,
        default: 0
    }
}, {
    collection: 'Tv365Profile',
    versionKey: false
});

// change 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
Tv365ProfileSchema.pre('updateOne', function(next) {
    next();
    UpdateElastic(this.getQuery());
});
Tv365ProfileSchema.pre('updateMany', function(next) {
    next();
    UpdateElastic(this.getQuery());
});
Tv365ProfileSchema.pre('findOneAndUpdate', function(next) {
    next();
    UpdateElastic(this.getQuery());
});
let Profile = connection.model("Tv365ProfileSchema", Tv365ProfileSchema);

function removeVietnameseTones(str) {
    if (str && (str.trim()) && (str.trim() != "")) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        str = str.replace(/ + /g, " ");
        str = str.trim();

        str = str.replace(/!|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\:|{|}|\||\\/g, " ");
        return str;
    } else {
        return ""
    }
}
const handle = (str) => {
    let result = removeVietnameseTones(str.toLowerCase());
    return result;
}
const UpdateElastic = async(condition) => {
    try {
        await sleep(1000);
        let listUser = await Profile.find(condition).lean();
        for (let i = 0; i < listUser.length; i++) {
            let obj = listUser[i];

            obj = {
                hs_id: obj.hs_id,
                hs_use_id: obj.hs_use_id,
                hs_cvid: obj.hs_cvid,
                hs_create_time: obj.hs_create_time,
                hs_active: obj.hs_active,
                is_scan: obj.is_scan,
                state: obj.state,
                mdtd_state: obj.mdtd_state,
                scan_cv: obj.scan_cv,
                hs_name: obj.hs_name ? handle(obj.hs_name) : "",
                hs_link: obj.hs_link ? handle(obj.hs_link) : "",
                hs_link_hide: obj.hs_link_hide ? handle(obj.hs_link_hide) : "",
                hs_link_error: obj.hs_link_error ? handle(obj.hs_link_error) : "",
                deleted: 0,
                table: "profile"
            }

            await axios({
                method: "post",
                url: "http://43.239.223.57:9001/updateuser_2",
                data: {
                    user: JSON.stringify(obj)
                },
                headers: { "Content-Type": "multipart/form-data" }
            });
        };
    } catch (e) {
        return false;
    }
}

// save 
const HandleSave = async(obj_save) => {
    try {
        let obj = obj_save;
        obj = {
            ...obj,
            hs_name: obj.hs_name ? handle(obj.hs_name) : "",
            hs_link: obj.hs_link ? handle(obj.hs_link) : "",
            hs_link_hide: obj.hs_link_hide ? handle(obj.hs_link_hide) : "",
            deleted: 0,
            table: "profile"
        }

        await axios({
            method: "post",
            url: "http://43.239.223.57:9001/updateuser_2",
            data: {
                user: JSON.stringify(obj)
            },
            headers: { "Content-Type": "multipart/form-data" }
        });

        return true;
    } catch (e) {
        console.log('Lỗi khi lưu dữ liệu sang elasticsearch', e);
        return false;
    }
}
Tv365ProfileSchema.pre('save', function(next) {
    next();
    HandleSave(this);
});

// delete 
const HandleDelete = async(id) => {
    try {
        await axios({
            method: "post",
            url: "http://43.239.223.57:9001/updateuser_2",
            data: {
                user: JSON.stringify({ hs_id: id, deleted: 1, table: "profile" })
            },
            headers: { "Content-Type": "multipart/form-data" }
        });

        return true;
    } catch (e) {
        console.log('Lỗi khi call sang elasticsearch để xóa');
        return false;
    }
}
Tv365ProfileSchema.pre('deleteOne', function(next) {
    HandleDelete(this.getQuery()["hs_id"]);
    next();
});
Tv365ProfileSchema.pre('deleteMany', function(next) {
    HandleDelete(this.getQuery()["hs_id"]);
    next();
});

module.exports = Profile;