const functions = require("../../services/functions");
const SaveCvCandi = require("../../models/Timviec365/UserOnSite/Candicate/SaveCvCandi");
const Users = require("../../models/Users");
const Profile = require('../../models/Timviec365/UserOnSite/Candicate/Profile')

const fs = require("fs");

var mongoose = require('mongoose')


const DB_URL = 'mongodb://127.0.0.1:27017/api-base365';
mongoose.connect(DB_URL)
    .then(() => console.log('DB Connected!'))
    .catch(error => console.log('DB connection error:', error.message));
// //lưu và tải cv
// const resRenderCV = async(req, res, next) => {
//     try {
//         let listCV = await SaveCvCandi.find({ time_edit: { $gte: 1696833420 } }).lean();
//         for (item in listCV) {

//             let cvuv = listCV[item];
//             console.log(cvuv.uid);
//             let cvid = cvuv.cvid,
//                 userId = cvuv.uid,
//                 name_img = cvuv.name_img,
//                 name_img_hide = cvuv.name_img_hide;
//             const domain = "https://timviec365.vn";
//             let user = Users.findOne({ idTimViec365: userId, type: { $ne: 1 } }).lean();
//             if (cvid) {
//                 // Đường dẫn ảnh
//                 let dir = `/root/app/storage/base365/timviec365/pictures/cv/${functions.convertDate(user.createdAt, true)}`;

//                 // Kiểm tra xem đã tạo thư mục lưu ảnh chưa
//                 if (!fs.existsSync(dir)) {
//                     fs.mkdirSync(dir, { recursive: true });
//                 }

//                 // Đường dẫn tới nơi bạn muốn lưu ảnh
//                 const outputPath = `${dir}/${name_img}.png`;
//                 const outputPathHide = `${dir}/${name_img_hide}.png`;

//                 //Render ảnh cv, không sử dụng ảnh gửi lên
//                 let linkImg = `${domain}/cv365/site/xem_cv_nodejs_no_hide/${cvid}/${userId}`,
//                     linkImgHide = `${domain}/cv365/site/xem_cv_nodejs_hide/${cvid}/${userId}`;

//                 let resImage = await functions.renderImageFromUrl(linkImg);
//                 if (!resImage.result) {
//                     console.log("Lỗi link không che", linkImg)
//                     console.log(resImage.message);
//                     // return functions.setError(res, resImage.message, 500);
//                 }
//                 let base64String = resImage.file;
//                 // Giải mã chuỗi Base64 thành dữ liệu nhị phân
//                 const imageBuffer = Buffer.from(base64String, "base64");
//                 // Ghi dữ liệu nhị phân vào tệp ảnh
//                 fs.writeFile(outputPath, resImage.file, (error) => {
//                     if (error) {
//                         console.log(error);
//                     }
//                 });
//                 // console.log(outputPath);

//                 let resImageHide = await functions.renderImageFromUrl(linkImgHide);
//                 console.log("Link che", linkImgHide);
//                 if (!resImageHide.result) {
//                     // console.log("Lỗi link che ")
//                     console.log(resImageHide.message);
//                     // return functions.setError(res, resImageHide.message, 500);
//                 }
//                 let base64StringHide = resImageHide.file;
//                 // Giải mã chuỗi Base64 thành dữ liệu nhị phân
//                 const imageBufferHide = Buffer.from(base64StringHide, "base64");

//                 // Ghi dữ liệu nhị phân vào tệp ảnh
//                 fs.writeFile(outputPathHide, resImageHide.file, (error) => {
//                     if (error) {
//                         console.log(error);
//                     }
//                 });
//                 console.log("outputPathHide", outputPathHide)
//                 console.log(item, 'Thành công');
//             }
//         }

//     } catch (e) {
//         console.log(e);
//     }
// };

// resRenderCV();


const renderImageCV = async() => {
    let list_cv = await SaveCvCandi.find({ name_img: '' }).lean();
    console.log('update:', list_cv.length);
    for (key in list_cv) {
        let cv = list_cv[key];
        let name_img = `u_cv_${cv.uid}_${functions.getTimeNow()}`;
        await SaveCvCandi.updateOne({ id: cv.id }, { $set: { name_img: name_img } });
    }
    console.log('done: ', list_cv.count)

};
// renderImageCV();


const scan_err_cv = async() => {
    try {
        let timeNow = new Date().getTime();
        let date = new Date(timeNow - 86400000);
        let timeStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 1);
        let timeEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        timeStart = Math.floor(timeStart.getTime() / 1000);
        timeEnd = Math.floor(timeEnd.getTime() / 1000);
        console.log('start:', timeStart);
        console.log('end:', timeEnd);
        //Lấy danh sách UV đăng ký
        let listUV = await Users.find({ createdAt: { $gte: timeStart, $lte: timeEnd }, type: { $ne: 1 }, "inForPerson.candidate.percents": { $gte: 45 }, fromDevice: 0 });
        console.log(listUV.length);
        let listIdCandi = [];
        for (let i in listUV) {
            listIdCandi.push(listUV[i].idTimViec365);
        }

        //Lấy danh sách UV tạo CV
        let listCvCandi = await SaveCvCandi.find({ uid: { $in: listIdCandi }, cv: 1 });

        let listCvUpload = await Profile.find({ hs_use_id: { $in: listIdCandi } });

        let listCvErr = [];
        for (let i in listUV) {
            let checkCvSave = 0; //0:không tồn tại, 1:có CV, 2: có CV lỗi ảnh;
            let checkFileUpload = 0; //0:không tồn tại, 1:có CV, 2: Lỗi che CV,3: Không tồn tại file tải lên;
            let user = listUV[i];
            let checkCvCandi = listCvCandi.find((e) => e.uid == user.idTimViec365);
            if (checkCvCandi) {
                let img_hide = checkCvCandi.name_img_hide ? checkCvCandi.name_img_hide : checkCvCandi.name_img + '_h';
                let checkImageCv = functions.checkImageCv(user.createdAt, img_hide);
                if (checkImageCv) {
                    checkCvSave = 1;
                } else {
                    console.log(functions.imageCv(user.createdAt, img_hide));
                    checkCvSave = 2;

                }
            }
            let checkCvUpload = listCvUpload.find((e) => e.hs_use_id == user.idTimViec365);
            if (checkCvUpload) {
                if (!checkCvUpload.hs_link_hide || checkCvUpload.is_scan == 0) {
                    let checkFile = functions.checkCvUpload(user.createdAt, hs_link);
                    if (checkFile) {
                        checkFileUpload = 2;
                    } else {
                        checkFileUpload = 3;
                    }
                } else {
                    checkFileUpload = 1;
                }
            }
            let errMessage = '';

            if (checkCvSave == 0 && checkFileUpload == 0) {
                errMessage = "Không có CV";

            } else {
                if (checkCvSave == 2) {
                    message = "Lỗi CV đã tạo";
                } else if (checkFileUpload == 2) {
                    message = "Lỗi che CV";
                } else if (checkFileUpload == 3) {
                    message = "Lỗi file tải lên";
                }
                if (errMessage) {
                    errMessage += `, ${message}`;
                } else {
                    errMessage += message;
                }
            }
            if (errMessage) {
                const link_uv = `https://timviec365.vn/ung-vien/${functions.renderAlias(user.userName)}-uv${user.idTimViec365}.html`;
                listCvErr.push({ link: link_uv, errMessage });
            }
        }
        console.log(listCvErr.length);
        console.log(listCvErr);

    } catch (e) {
        console.log("Lỗi quét cv lỗi hằng ngày: ", e);
    }
};
// scan_err_cv();