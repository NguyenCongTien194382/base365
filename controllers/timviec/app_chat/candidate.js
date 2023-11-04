const Users = require('../../../models/Users');
const Profile = require('../../../models/Timviec365/UserOnSite/Candicate/Profile');
const serviceCandidate = require('../../../services/timviec365/candidate');
const serviceAi = require('../../../services/timviec365/dataAI');
const functions = require('../../../services/functions');

exports.update_infor = async(req, res) => {
    try {
        const user = req.user.data;
        let { category, cv_title, birthday, school, cv_rank, cv_exp, videoLink } = req.body;
        const fileUpload = req.files;
        const now = functions.getTimeNow();
        let dataUpload = {};

        if (category && cv_title && birthday && school && cv_rank && cv_exp) {
            let data = {
                updatedAt: now,
                "inForPerson.candidate.cv_cate_id": category.split(',').map(Number),
                "inForPerson.candidate.cv_title": cv_title,
                "inForPerson.account.birthday": birthday,
                "inForPerson.account.experience": cv_exp,
            };
            // Khai báo biến
            let cvUpload, videoUpload;
            if (fileUpload) {
                if (fileUpload.cvUpload) {
                    cvUpload = fileUpload.cvUpload;
                }
                if (fileUpload.videoUpload) {
                    videoUpload = fileUpload.videoUpload;
                    if (videoUpload.size > 100 * 1024 * 1024) {
                        return functions.setError(
                            res,
                            'dung lượng file vượt quá 100MB',
                            200
                        );
                    }
                }
                // Nếu ứng viên hoàn thiện hồ sơ bằng cách tải video
                if (videoUpload && !videoLink && !cvUpload) {
                    const videoType = !videoLink ? 1 : 2;
                    data["inForPerson.candidate.cv_video"] = videoUpload[0].filename;
                    data["inForPerson.candidate.cv_video_type"] = videoType;
                }
                // Nếu ứng viên hoàn thiện hồ sơ bằng cách tải hồ sơ dạng ảnh pdf, png,..
                if (!videoUpload && !videoLink && cvUpload) {
                    dataUpload = {
                        hs_use_id: user.idTimViec365,
                        hs_name: cvUpload[0].originalname,
                        hs_link: cvUpload[0].filename,
                        hs_create_time: now,
                    };
                }
            }

            // Cập nhật thông tin đẩy lên
            await Users.updateOne({ _id: user._id }, {
                $push: {
                    'inForPerson.candidate.profileDegree': {
                        th_id: 1,
                        th_name: school,
                        th_xl: cv_rank,
                    },
                },
                $set: data
            });

            // Lưu lại thông tin tải file
            if (dataUpload) {
                const getMaxIdProfile = await Profile.findOne({}, { hs_id: 1 })
                    .sort({ hs_id: -1 })
                    .limit(1)
                    .lean();
                dataUpload.hs_id = getMaxIdProfile.hs_id + 1;
                const profile = new Profile(dataUpload);
                await profile.save();
            }

            // Cập nhật phần trăm hoàn thiện hồ sơ
            const uvPercent = await serviceCandidate.percentHTHS(user.idTimViec365);
            await Users.updateOne({ _id: user._id }, {
                $set: {
                    'inForPerson.candidate.percents': uvPercent,
                },
            });

            await serviceAi.updateDataSearchCandi({
                use_id: user.idTimViec365,
                use_update_time: now,
                cv_title: cv_title,
                percents: uvPercent,
                cv_cate_id: category.replaceAll(',', ', '),
            });

            return functions.success(res, "Thành công");
        }
        return functions.setError(res, "Thiếu thông tin truyền lên");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}

exports.update_hstt = async(req, res) => {
    try {
        const user = req.user.data;
        let { cv_cate_id, cv_title, birthday, gender, married, cv_exp, cv_rank, cv_city_id, school, cv_money_id, cv_capbac_id, cv_muctieu, cv_kynang, cv_loaihinh_id } = req.body;
        if (cv_cate_id && cv_title && birthday && gender && married && cv_exp && cv_rank && cv_city_id && school && cv_money_id && cv_capbac_id && cv_muctieu && cv_kynang && cv_loaihinh_id) {
            const now = functions.getTimeNow();

            await Users.updateOne({ _id: user._id }, {
                $push: {
                    'inForPerson.candidate.profileDegree': {
                        th_id: 1,
                        th_name: school,
                        th_xl: cv_rank,
                    },
                },
                $set: {
                    updatedAt: now,
                    "inForPerson.candidate.cv_cate_id": cv_cate_id.split(',').map(Number),
                    "inForPerson.candidate.cv_title": cv_title,
                    "inForPerson.account.birthday": birthday,
                    "inForPerson.account.gender": gender,
                    "inForPerson.account.married": married,
                    "inForPerson.account.experience": cv_exp,
                    "inForPerson.candidate.cv_city_id": cv_city_id.split(',').map(Number),
                    "inForPerson.candidate.cv_money_id": cv_money_id,
                    "inForPerson.candidate.cv_loaihinh_id": cv_loaihinh_id,
                    "inForPerson.candidate.cv_capbac_id": cv_capbac_id,
                    "inForPerson.candidate.cv_muctieu": cv_muctieu,
                    "inForPerson.candidate.cv_kynang": cv_kynang,
                }
            });

            // Cập nhật phần trăm hoàn thiện hồ sơ
            const uvPercent = await serviceCandidate.percentHTHS(user.idTimViec365);
            await Users.updateOne({ _id: user._id }, {
                $set: {
                    'inForPerson.candidate.percents': uvPercent,
                },
            });

            await serviceAi.updateDataSearchCandi({
                use_id: user.idTimViec365,
                use_update_time: now,
                cv_title: cv_title,
                percents: uvPercent,
                cv_cate_id: cv_cate_id.replaceAll(',', ', '),
            });
            return functions.success(res, "Thành công");
        }
        return functions.setError(res, "Thiếu thông tin truyền lên");
    } catch (error) {
        console.log(error);
        return functions.setError(res, error.message);
    }
}