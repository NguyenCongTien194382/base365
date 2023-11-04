const path = require('path');
const fs = require('fs');

exports.getImageBD = (img) => {
    if (img != '' && img != null) {
        return `${process.env.cdn}/pictures/news/${img}`;
    }
    return '';
};

exports.uploadImageBD = (file) => {
    let time = this.convertDate(Date.now()/1000, true);
    var file_path = file.path;
    let path = this.geturlImageBD(time);
    let file_name = this.getTimeNow() + "_" + file.name;
    fs.rename(file_path, path + file_name, function (err) {
        if (err) return false;
    });
    return { file_name: `${time}/${file_name}` };
}

exports.deleteImageBD = (file_name) => {
    let path = '../storage/base365/timviec365/pictures/news/';
    fs.unlink(path + file_name, function (err) {
        if (err) return false;
    });
    return true;
}

exports.geturlImageBD = (time) => {
   
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