const path = require('path');
const fs = require('fs');

exports.getImageAuthor = (author_img) => {
    if (author_img != '' && author_img != null) {
        return `${process.env.cdn}/images/${author_img}`;
    }
    return '';
};

exports.uploadImageAuthor = (file) => {
    var file_path = file.path;
    let path = this.geturlImage();
    let file_name = this.getTimeNow() + "_" + file.name;
    fs.rename(file_path, path + file_name, function(err) {
        if (err) return false;
    });
    return { file_name: `kd/${file_name}` };
}

exports.deleteImageAuthor = (file_name) => {
    let path = '../storage/base365/timviec365/images/';
    fs.unlink(path + file_name, function(err) {
        if (err) return false;
    });
    return true;
}

exports.geturlImage = (time) => {
    let path = `../storage/base365/timviec365/images/kd/`; // Tạo đường dẫn đến thư mục của người dùng

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