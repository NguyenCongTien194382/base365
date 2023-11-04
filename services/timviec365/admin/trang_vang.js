const path = require('path');
const fs = require('fs');

exports.getImageCate = (img_cate) => {
    if (img_cate != '' && img_cate != null) {
        return `${process.env.cdn}/pictures/news/${img_cate}`;
    }
    return '';
};

exports.uploadImageCate = (file) => {
    var file_path = file.path;
    const now = this.convertDate(this.getTimeNow(), true);
    let path = this.geturlImage(now);
    let file_name = this.getTimeNow() + "_" + file.name;
    fs.rename(file_path, path + file_name, function(err) {
        if (err) return false;
    });
    return { file_name: `${now}/${file_name}` };
}

exports.deleteImageCate = (file_name) => {
    let path = '../storage/base365/timviec365/pictures/news/';
    fs.unlink(path + file_name, function(err) {
        if (err) return false;
    });
    return true;
}

exports.geturlImage = (time) => {
    let path = `../storage/base365/timviec365/pictures/news/${time}/`; // Tạo đường dẫn đến thư mục của người dùng

    if (!fs.existsSync(path)) { // Nếu thư mục chưa tồn tại thì tạo mới
        fs.mkdirSync(path, { recursive: true });
    }
    return path;
}

exports.getTimeNow = () => {
    return Math.floor(Date.now() / 1000);
}

exports.convertDate = (time = null, revert = false) => {
    let date;
    if (time != null) {
        date = new Date(time * 1000)
    } else {
        date = new Date();
    }
    const y = date.getFullYear();
    let d = date.getDate();
    d = d < 10 ? "0" + d : d;
    let m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    if (!revert) {
        return `${d}/${m}/${y}`;
    } else {
        return `${y}/${m}/${d}`;
    }

}