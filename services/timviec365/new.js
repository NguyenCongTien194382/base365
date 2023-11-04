const New = require('../../models/Timviec365/UserOnSite/Company/New')
const HistoryNewPoint = require('../../models/Timviec365/HistoryNewPoint')
const LikePost = require('../../models/Timviec365/UserOnSite/LikePost')
const CommentPost = require('../../models/Timviec365/UserOnSite/CommentPost')
const PermissionNotify = require('../../models/Timviec365/PermissionNotify')
const axios = require('axios')
const functions = require('../../services/functions')
const SaveVote = require('../../models/Timviec365/SaveVote')
const NewTV365 = require('../../models/Timviec365/UserOnSite/Company/New')
const Campain = require('../../models/Timviec365/Campain/Campain')
const {
  userExists,
  saveHistory,
  getMaxID,
} = require('../../controllers/timviec/history/utils')
const ManagePointHistory = require('../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory')
const { promisify } = require('util')
const MbSize = 1024 * 1024
// giới hạn dung lượng ảnh < 2MB
const MAX_IMG_SIZE = 2 * MbSize
// check video
const path = require('path')

const fs = require('fs')

const array_kinh_nghiem = {
  0: 'Chưa có kinh nghiệm',
  1: '0 - 1 năm kinh nghiệm',
  2: 'Hơn 1 năm kinh nghiệm',
  3: 'Hơn 2 năm kinh nghiệm',
  4: 'Hơn 5 năm kinh nghiệm',
  5: 'Hơn 10 năm kinh nghiệm',
}

const array_capbac = {
  0: 'Chọn cấp bậc',
  1: 'Mới tốt nghiệp',
  6: 'Thực tập sinh',
  3: 'Nhân viên',
  5: 'Trưởng nhóm',
  10: 'Phó tổ trưởng',
  11: 'Tổ trưởng',
  7: 'Phó trưởng phòng',
  2: 'Trưởng phòng',
  12: 'Phó giám đốc',
  4: 'Giám đốc',
  13: 'Phó tổng giám đốc',
  14: 'Tổng giám đốc',
  8: 'Quản lý cấp trung',
  9: 'Quản lý cấp cao',
}

const array_hinh_thuc = {
  1: 'Toàn thời gian cố định',
  2: 'Toàn thời gian tạm thời',
  3: 'Bán thời gian',
  4: 'Bán thời gian tạm thời',
  5: 'Hợp đồng',
  7: 'Việc làm từ xa',
  6: 'Khác',
}

const array_hoc_van = {
  0: 'Không yêu cầu',
  7: 'Đại học trở lên',
  5: 'Cao đẳng trở lên',
  1: 'THPT trở lên',
  2: 'Trung học trở lên',
  3: 'Chứng chỉ',
  4: 'Trung cấp trở lên',
  6: 'Cử nhân trở lên',
  8: 'Thạc sĩ trở lên',
  9: 'Thạc sĩ Nghệ thuật',
  10: 'Thạc sĩ Thương mại',
  11: 'Thạc sĩ Khoa học',
  12: 'Thạc sĩ Kiến trúc',
  13: 'Thạc sĩ QTKD',
  14: 'Thạc sĩ Kỹ thuật ứng dụng',
  15: 'Thạc sĩ Luật',
  16: 'Thạc sĩ Y học',
  17: 'Thạc sĩ Dược phẩm',
  18: 'Tiến sĩ',
  19: 'Khác',
}

exports.checkExistTitle = async (comID, title, newID = null) => {
  let condition = {
    new_user_id: Number(comID),
    new_title: title,
  }

  if (newID) condition.new_id = { $ne: Number(newID) }

  const result = await New.findOne(condition).lean()
  if (result) {
    return false
  } else {
    return true
  }
}

exports.checkSpecalCharacter = async (title) => {
  var pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
  return pattern.test(title)
}

exports.foundKeywordHot = async (title) => {
  if (
    (title.indexOf('hot') ||
      title.indexOf('tuyển gấp') ||
      title.indexOf('cần gấp') ||
      title.indexOf('lương cao')) > -1
  )
    return false
  else return true
}

exports.recognition_tag_tin = async (cateID, title, description, require) => {
  let result
  try {
    let takeData = await axios({
      method: 'post',
      url: process.env.domain_ai_recommend + '/recognition_tag_tin',
      data: {
        key_cat_lq: cateID,
        new_title: title,
        new_mota: description,
        new_yeucau: require,
      },
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    result = takeData.data.data.items
  } catch (error) {
    result = ''
  }
  return result
}

exports.getMoney = (typeNewMoney, money, minValue, maxValue) => {
  switch (Number(typeNewMoney)) {
    case 1:
      maxValue = null
      minValue = null
      break
    case 2:
      for (const threshold of functions.thresholds) {
        if (minValue >= threshold.minValue && minValue < threshold.maxValue) {
          money = threshold.money
          break
        }
      }
      maxValue = null
      break
    case 3:
      for (const threshold of functions.thresholds) {
        if (maxValue > threshold.minValue && maxValue <= threshold.maxValue) {
          money = threshold.money
          break
        }
      }
      minValue = null
      break
    case 4:
      for (const threshold of functions.thresholds) {
        if (minValue >= threshold.minValue && maxValue <= threshold.maxValue) {
          money = threshold.money
          break
        }
      }
      break
    case 5:
      money = money
      break
    default:
      break
  }
  return { money, maxValue, minValue }
}

exports.suggest_vl_ut = async (
  new_id,
  pagination = 1,
  size = 12,
  ghim = 0,
  list_id_hide = ''
) => {
  let result
  try {
    let takeData = await axios({
      method: 'post',
      url: process.env.domain_ai_recommend_4001 + '/recommendation_ungvien_ut',
      data: {
        site: 'timviec365',
        new_id: new_id,
        pagination: pagination,
        size: size,
        find_new_ghim: ghim,
        hide_list_id: list_id_hide,
      },
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    result = takeData.data.data.items
  } catch (error) {
    result = ''
  }
  return result
}
exports.logHistoryNewPoint = async (new_id, point, type) => {
  const getMaxItem = await HistoryNewPoint.findOne({}, { nh_id: 1 })
      .sort({ nh_id: -1 })
      .limit(1)
      .lean(),
    itemHistory = new HistoryNewPoint({
      nh_id: Number(getMaxItem.nh_id) + 1,
      nh_new_id: new_id,
      nh_point: point,
      nh_type_point: type,
      nh_created_at: functions.getTimeNow(),
    })
  await itemHistory.save()
}

exports.inforLikeComment = async (new_id) => {
  let element = {}
  // Lấy danh sách thả cảm xúc
  let arr_likes_new = await LikePost.aggregate([
    {
      $match: {
        lk_new_id: Number(new_id),
        lk_type: { $ne: 8 },
        lk_for_comment: 0,
      },
    },
    {
      $lookup: {
        from: 'Users',
        localField: 'lk_user_idchat',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $skip: 0,
    },
    {
      $project: {
        lk_id: 1,
        lk_type: 1,
        lk_for_comment: 1,
        lk_user_name: '$user.userName',
        lk_user_avatar: '$user.avatarUser',
        lk_user_idchat: '$user._id',
      },
    },
  ])
  for (let i = 0; i < arr_likes_new.length; i++) {
    const element = arr_likes_new[i]
    element.lk_user_avatar = functions.getUrlLogoCompany(
      element.usc_create_time,
      element.lk_user_avatar
    )
  }
  element.arr_likes_new = arr_likes_new
  // lấy danh sách chia sẻ
  element.arr_share_new = await LikePost.aggregate([
    {
      $match: {
        lk_new_id: Number(new_id),
        lk_type: { $eq: 8 },
        lk_for_comment: 0,
      },
    },
    {
      $lookup: {
        from: 'Users',
        localField: 'lk_user_idchat',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $skip: 0,
    },
    {
      $project: {
        lk_id: 1,
        lk_type: 1,
        lk_for_comment: 1,
        lk_user_name: '$user.userName',
        lk_user_avatar: '$user.avatarUser',
        lk_user_idchat: '$user._id',
      },
    },
  ])
  // lấy tổng số bình luận
  element.count_comments = await CommentPost.countDocuments({
    cm_parent_id: 0,
    cm_new_id: Number(new_id),
  })

  return element
}

exports.inforCommentChild = async (new_id, parent) => {
  const list = await CommentPost.aggregate([
    {
      $match: {
        cm_new_id: new_id,
        cm_parent_id: parent,
      },
    },
    {
      $sort: {
        cm_time: 1,
      },
    },
    {
      $lookup: {
        from: 'Users',
        localField: 'cm_sender_idchat',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        cm_id: 1,
        cm_url: 1,
        cm_new_id: 1,
        cm_sender_name: '$user.userName',
        cm_sender_avatar: '$user.avatarUser',
        cm_sender_idchat: 1,
        cm_comment: 1,
        cm_img: 1,
        cm_ip: 1,
        cm_tag: 1,
        cm_time: 1,
      },
    },
  ])
  return list
}

exports.up_notify = async (
  arr_noti,
  pn_usc_id = 0,
  pn_use_id = 0,
  type = 0,
  id_new = 0
) => {
  if (arr_noti) {
    const array = JSON.parse(arr_noti)
    for (let index = 0; index < array.length; index++) {
      const element = array[index]
      const time = functions.getTimeNow()
      const pn = await PermissionNotify.findOne({}, { pn_id: 1 })
        .sort({ pn_id: -1 })
        .limit(1)
      const item = new PermissionNotify({
        pn_id: Number(pn.pn_id) + 1,
        pn_usc_id: pn_usc_id,
        pn_use_id: pn_use_id,
        pn_id_chat: element.id_chat,
        pn_id_new: id_new,
        pn_type: type,
        pn_type_noti: element.type_noti,
        pn_created_at: time,
      })
      await item.save()
    }
  }
}

exports.update_notify = async (
  arr_delete,
  arr_noti,
  pn_usc_id = 0,
  pn_use_id = 0,
  type = 0,
  id_new = 0
) => {
  if (arr_delete) {
    const arrayDelete = JSON.parse(arr_delete)
    for (let i = 0; i < arrayDelete.length; i++) {
      const element = arrayDelete[i]
      await PermissionNotify.deleteOne({
        pn_id_new: id_new,
        pn_id_chat: element,
        pn_usc_id: pn_usc_id,
      })
    }
  }

  if (arr_noti) {
    const array = JSON.parse(arr_noti)
    for (let index = 0; index < array.length; index++) {
      const element = array[index]
      const time = functions.getTimeNow()
      if (element.check == 1) {
        const pn = await PermissionNotify.findOne({}, { pn_id: 1 })
          .sort({ pn_id: -1 })
          .limit(1)
        const item = new PermissionNotify({
          pn_id: Number(pn.pn_id) + 1,
          pn_usc_id: pn_usc_id,
          pn_use_id: pn_use_id,
          pn_id_chat: element.id_chat,
          pn_id_new: id_new,
          pn_type: type,
          pn_type_noti: element.type_noti,
          pn_created_at: time,
        })
        await item.save()
      } else if (element.check == 0) {
        await PermissionNotify.updateOne(
          {
            pn_id_chat: element.id_chat,
            pn_id_new: id_new,
            pn_usc_id: pn_usc_id,
          },
          {
            $set: { pn_type_noti: element.type_noti },
          }
        )
      }
    }
  }
}

exports.renderBGName = (type) => {
  switch (type) {
    case '1':
      return 'box Hấp dẫn'
    case '4':
      return 'box Thương hiệu'
    case '5':
      return 'box Tuyển gấp'
    case '6':
      return 'Trang ngành'
    default:
      return ''
  }
}

// bài toán 7
// mảng điểm theo số sao đánh giá
const arrPointStar = (star) => {
  let arr = [
    {
      star: 1,
      point: -10,
    },
    {
      star: 2,
      point: -5,
    },
    {
      star: 3,
      point: 0,
    },
    {
      star: 4,
      point: 5,
    },
    {
      star: 5,
      point: 10,
    },
  ]
  if (star > 0 && star <= 5) {
    return arr[star - 1].point
  } else {
    return 0
  }
}

// hàm xử ý tính điểm khi đánh giá
// vote tin tuyển dụng
exports.handleCaculatePointVoteNew = async (userId, userType, star, newId) => {
  try {
    let checkUser = await userExists(userId, userType)
    if (checkUser) {
      let newTV365 = await NewTV365.findOne({ new_id: newId })
      if (newTV365) {
        let author = newTV365.new_user_id
        let time = new Date().getTime() / 1000
        let type = 'new'
        let type_create = 1
        // userId: người vote
        // user_type_vote: loại tài khoản của người vote
        // id_be_vote: id chủ thể được vote
        // type: loại đối tượng được vote
        // create_be_vote: người tạo ra đối tượng được vote
        // type_create: loại tài khoản của người tạo ra đối tượng
        let checkVote = await SaveVote.findOne({
          userId: userId,
          user_type_vote: userType,
          id_be_vote: newId,
          type: type,
        })
        if (checkVote) {
          await SaveVote.updateOne(
            {
              id: checkVote.id,
            },
            {
              $set: {
                star: star,
                time: time,
              },
            }
          )
        } else {
          await new SaveVote({
            id: await getMaxID(SaveVote),
            userId: userId,
            user_type_vote: userType,
            star: star,
            id_be_vote: newId,
            type: type,
            creater_be_vote: author,
            type_create: type_create,
            time: time,
          }).save()
        }
        let totalVote = await SaveVote.aggregate([
          {
            $match: {
              type: 'new',
              creater_be_vote: author,
              type_create: type_create,
            },
          },
          {
            $group: {
              _id: null,
              sum: { $sum: '$star' },
              count: { $sum: 1 },
            },
          },
        ])
        let sum = totalVote[0].sum
        let count = totalVote[0].count
        let avg = 1
        avg = Math.floor(sum / count)
        if (avg < 1) {
          avg = 1
        }

        let point = arrPointStar(avg)
        let history = await ManagePointHistory.findOne({
          userId: author,
          type: 1,
        })
        if (history) {
          history.point_vote = point
        } else {
          history = new ManagePointHistory({
            point_to_change: point,
            point_vote: point,
            sum: point,
          })
        }
        await saveHistory(history)
      } else {
        return false
      }
    } else {
      return false
    }
  } catch (e) {
    console.log(e)
    return false
  }
}
exports.timeElapsedString2 = (ptime, cre_time = '') => {
  let etime = ptime - Math.floor(Date.now() / 1000)

  if (cre_time !== '' && ptime - cre_time > 31556926) {
    return ''
  }

  if (etime < 1) {
    return ''
  }

  const a = {
    năm: 365 * 24 * 60 * 60,
    tháng: 30 * 24 * 60 * 60,
    ngày: 24 * 60 * 60,
    giờ: 60 * 60,
    phút: 60,
    giây: 1,
  }

  const a_plural = {
    năm: 'năm',
    tháng: 'tháng',
    ngày: 'ngày',
    giờ: 'giờ',
    phút: 'phút',
    giây: 'giây',
  }

  for (const [str, secs] of Object.entries(a)) {
    let d = Math.floor(etime / secs)
    if (d > 0) {
      let r = Math.round(d)
      return '(Còn ' + r + ' ' + (r > 1 ? a_plural[str] : str) + ')'
    }
  }
}
exports.getExperience = (index) => {
  return array_kinh_nghiem[index]
}

exports.getDegree = (index) => {
  return array_hoc_van[index]
}

exports.getPosition = (index) => {
  return array_capbac[index]
}

exports.getForm = (index) => {
  return array_hinh_thuc[index]
}

exports.uploadAudio = (id, base64String) => {
  let path1 = `${process.env.storage_tv365}/audio/new/${id}/`
  if (!fs.existsSync(path1)) {
    fs.mkdirSync(path1, { recursive: true })
  }
  let data = Buffer.from(base64String, 'base64')

  const audioName = `${Date.now()}.wav`
  fs.writeFile(path1 + audioName, data, (err) => {
    if (err) {
      console.log(err)
    }
  })

  return `${process.env.cdn}/audio/new/${id}/${audioName}`
}
exports.inforLikeChild = async (new_id, parent) => {
  // Lấy danh sách thả cảm xúc
  const arr_likes_new = await LikePost.aggregate([
    {
      $match: {
        lk_new_id: Number(new_id),
        lk_type: { $lt: 8 },
        lk_for_comment: Number(parent),
      },
    },
    {
      $sort: {
        lk_type: 1,
      },
    },
    {
      $skip: 0,
    },
    {
      $lookup: {
        from: 'Users',
        localField: 'lk_user_idchat',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        lk_id: 1,
        lk_new_id: 1,
        lk_type: 1,
        lk_for_comment: 1,
        lk_user_name: '$user.userName',
        lk_user_avatar: '$user.avatarUser',
        usc_create_time: '$user.createdAt',
        lk_user_idchat: '$user._id',
      },
    },
  ])
  for (let i = 0; i < arr_likes_new.length; i++) {
    const element = arr_likes_new[i]
    element.lk_user_avatar = functions.getUrlLogoCompany(
      element.usc_create_time,
      element.lk_user_avatar
    )
  }
  return arr_likes_new
}

exports.deleteFileNew = (cm_time, file) => {
  let date = 0
  if (cm_time) {
    date = new Date(cm_time * 1000)
  }
  if (file) {
    let filePath =
      `../storage/base365/timviec365/pictures/comment/${functions.convertDate(
        date.getTime() / 1000,
        true
      )}/` + file
    fs.unlink(filePath, (err) => {
      if (err) console.log(err)
    })
  }
}

exports.uploadCmt = async (
  old_file,
  old_time,
  file,
  allowedExtensions,
  cm_time = null
) => {
  var filename = file.name
  var arr_filename = filename.split('.')
  let date = new Date()
  let idrand = Math.floor(Math.random() * 900000) + 100000
  if (cm_time) {
    date = new Date(cm_time * 1000)
  }
  let namefile = 'cm_' + idrand + '.' + arr_filename[arr_filename.length - 1]
  let path1 = `../storage/base365/timviec365/pictures/comment/${functions.convertDate(
    date.getTime() / 1000,
    true
  )}/`
  let filePath =
    `../storage/base365/timviec365/pictures/comment/${functions.convertDate(
      date.getTime() / 1000,
      true
    )}/` + namefile
  //ktra xem có file cũ không thì xóa
  if (old_file) {
    let date = 0
    if (old_time) {
      date = new Date(old_time * 1000)
    }
    let filePath1 =
      `../storage/base365/timviec365/pictures/comment/${functions.convertDate(
        date.getTime() / 1000,
        true
      )}/` + old_file
    fs.unlink(filePath1, (err) => {
      if (err) {
        console.log(err)
        return false
      }
    })
  }
  //check size
  const { size } = await promisify(fs.stat)(file.path)
  if (size > MAX_IMG_SIZE) {
    console.log('Dung lượng file tải lên quá lớn , vui lòng chọn tệp khác')
    return false
  }
  //check đinh dang ảnh
  let fileCheck = path.extname(filePath)
  if (allowedExtensions.includes(fileCheck.toLocaleLowerCase()) === false) {
    return false
  }
  if (!fs.existsSync(path1)) {
    fs.mkdirSync(path1, { recursive: true })
  }
  fs.readFile(file.path, (err, data) => {
    if (err) {
      console.log(err)
    }
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.log(err)
      }
    })
  })
  return namefile
}

exports.getUrlIMGComment = (cm_time, file) => {
  try {
    if (file != null && file != '') {
      let date = 0
      if (cm_time) {
        date = new Date(cm_time * 1000)
      }
      return `${process.env.cdn}/pictures/comment/${functions.convertDate(
        date.getTime() / 1000,
        true
      )}/${file}`
    } else {
      return file
    }
  } catch (error) {
    console.log(error)
  }
}

exports.listNewCampaign = async (keyword, page = 1, limit = 6) => {
  try {
    let list_new = [],
      list_top = [],
      list_bot = []
    if (keyword) {
      page = Number(page)
      limit = Number(limit)
      let skip = limit * (page - 1),
        currentDate = functions.getTimeNow(),
        match = {
          cd_trangthai: 1,
          cd_step: { $eq: 4 },
          cd_timestart: { $lt: currentDate },
          $or: [{ cd_timeend: 0 }, { cd_timeend: { $gt: currentDate } }],
          $expr: {
            $lt: [
              { $add: ['$cd_cpm', '$cd_cpc', '$cd_chuyendoi'] },
              '$cd_ngansach',
            ],
          },
          cd_tukhoa: { $regex: keyword, $options: 'i' },
        }
      // if (keyword) { match['cd_tukhoa'] = { $regex: keyword, $options: 'i' } }
      let listCampaign = await Campain.aggregate([
        {
          $match: match,
        },
        {
          $sort: { cd_gpa: -1, cd_id: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: 'NewTV365',
            localField: 'cd_new_id',
            foreignField: 'new_id',
            as: 'new',
          },
        },
        {
          $unwind: '$new',
        },
        {
          $lookup: {
            from: 'Users',
            localField: 'new.new_user_id',
            foreignField: 'idTimViec365',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $match: {
            'user.type': 1,
          },
        },
        {
          $project: {
            _id: 0,
            cd_tuongtac: 1,
            cd_ngansach: 1,
            cd_luotnhap: 1,
            cd_luotungtuyen: 1,
            cd_cpm: 1,
            cd_id: 1,
            cd_chiphi: 1,
            new_id: '$new.new_id',
            new_title: '$new.new_title',
            new_money: '$new.new_money',
            new_user_id: '$new.new_user_id',
            new_city: '$new.new_city',
            new_cat_id: '$new.new_cat_id',
            new_create_time: '$new.new_create_time',
            new_update_time: '$new.new_update_time',
            new_view_count: '$new.new_view_count',
            new_alias: '$new.new_alias',
            new_ghim: '$new.new_ghim',
            new_hot: '$new.new_hot',
            new_cao: '$new.new_cao',
            new_gap: '$new.new_gap',
            new_nganh: '$new.new_nganh',
            new_active: '$new.new_active',
            new_han_nop: '$new.new_han_nop',
            new_yeucau: '$new.new_yeucau',
            new_quyenloi: '$new.new_quyenloi',
            new_bang_cap: '$new.new_bang_cap',
            nm_type: '$new.nm_type',
            nm_min_value: '$new.nm_min_value',
            nm_max_value: '$new.nm_max_value',
            new_exp: '$new.new_exp',
            nm_unit: '$new.nm_unit',
            nm_id: '$new.nm_id',
            usc_id: '$user.usc_id',
            usc_id: '$user.idTimViec365',
            usc_create_time: '$user.createdAt',
            usc_company: '$user.userName',
            usc_alias: '$user.alias',
            usc_logo: '$user.avatarUser',
            usc_time_login: '$user.time_login',
            usc_star: '$user.inForCompany.timviec365.usc_star',
            chat365_secret: '$user.chat365_secret',
            usc_city: '$user.city',
            chat365_id: '$user._id',
            isOnline: '$user.isOnline',
            saved: '',
            applied: '',
            views: '',
            new_badge: '$new.new_badge',
            new_qc: 'true',
          },
        },
      ])

      if (listCampaign.length > 0) {
        for (let i = 0; i < listCampaign.length; i++) {
          const element = listCampaign[i]

          const totalTuongTac = element.cd_tuongtac + 1
          const totalNganSach = element.cd_ngansach
          const totalLuotNhap = element.cd_luotnhap
          const totalLuotUngTuyen = element.cd_luotungtuyen
          const totalCPM = element.cd_cpm
          const cd_id = element.cd_id
          const totalchiphi = Number(element.cd_chiphi)

          // Tính giá trị trung bình cho cd_tile và cd_ngansach
          const tile =
            totalTuongTac === 0
              ? 0
              : (totalLuotNhap + totalLuotUngTuyen) / totalTuongTac
          const cd_ngansach = totalNganSach - totalCPM
          const cd_chiphi = totalchiphi + totalCPM

          // Cập nhật trường cd_tuongtac, cd_tile, và cd_ngansach cho các tài liệu đã tìm thấy
          await Campain.updateOne(
            { cd_id: cd_id },
            {
              $inc: { cd_tuongtac: 1 },
              $set: {
                cd_tile: tile,
                cd_ngansach: cd_ngansach,
                cd_chiphi: cd_chiphi,
              },
            }
          )

          list_new.push(element.new_id)

          if (i <= 2) {
            list_top.push(element)
          } else {
            list_bot.push(element)
          }
        }
      }
    }
    return { list_top, list_bot, listNew: list_new.join(',') }
  } catch (error) {
    console.log(error.message)
    return []
  }
}

exports.listNewCampaignApp = async (keyword, page = 1, limit = 6) => {
  try {
    let list_new = [],
      list_top = [],
      list_bot = []
    if (keyword) {
      page = Number(page)
      limit = Number(limit)
      let skip = limit * (page - 1),
        currentDate = functions.getTimeNow(),
        match = {
          cd_trangthai: 1,
          cd_step: { $eq: 4 },
          cd_timestart: { $lt: currentDate },
          $or: [{ cd_timeend: 0 }, { cd_timeend: { $gt: currentDate } }],
          $expr: {
            $lt: [
              { $add: ['$cd_cpm', '$cd_cpc', '$cd_chuyendoi'] },
              '$cd_ngansach',
            ],
          },
          cd_tukhoa: { $regex: keyword, $options: 'i' },
        }
      // if (keyword) { match['cd_tukhoa'] = { $regex: keyword, $options: 'i' } }
      let listCampaign = await Campain.aggregate([
        {
          $match: match,
        },
        {
          $sort: { cd_gpa: -1, cd_id: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: 'NewTV365',
            localField: 'cd_new_id',
            foreignField: 'new_id',
            as: 'new',
          },
        },
        {
          $unwind: '$new',
        },
        {
          $lookup: {
            from: 'Users',
            localField: 'new.new_user_id',
            foreignField: 'idTimViec365',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $match: {
            'user.type': 1,
          },
        },
        {
          $project: {
            _id: 0,
            cd_tuongtac: 1,
            cd_ngansach: 1,
            cd_luotnhap: 1,
            cd_luotungtuyen: 1,
            cd_cpm: 1,
            cd_id: 1,
            cd_chiphi: 1,
            new_id: 1,
            usc_id: '$new_user_id',
            new_title: 1,
            new_md5: 1,
            new_alias: 1,
            new_301: 1,
            new_cat_id: 1,
            new_real_cate: 1,
            new_city: 1,
            new_qh_id: 1,
            new_addr: 1,
            new_money: 1,
            new_cap_bac: 1,
            new_exp: 1,
            new_bang_cap: 1,
            new_gioi_tinh: 1,
            new_so_luong: 1,
            new_hinh_thuc: 1,
            new_user_id: 1,
            new_user_redirect: 1,
            new_do_tuoi: 1,
            new_create_time: 1,
            new_update_time: 1,
            new_vip_time: 1,
            new_vip: 1,
            new_cate_time: 1,
            new_active: 1,
            new_type: 1,
            new_over: 1,
            new_view_count: 1,
            new_han_nop: 1,
            new_post: 1,
            new_renew: 1,
            new_hot: 1,
            new_do: 1,
            new_cao: 1,
            new_gap: 1,
            new_nganh: 1,
            new_ghim: 1,
            new_thuc: 1,
            new_order: 1,
            new_ut: 1,
            send_vip: 1,
            new_hide_admin: 1,
            new_point: 1,
            new_test: 1,
            new_badge: 1,
            new_check_spam: 1,
            new_id_deplicate: 1,
            new_ho_so: 1,
            new_title_seo: 1,
            new_des_seo: 1,
            new_hoahong: 1,
            new_tgtv: 1,
            new_lv: 1,
            new_bao_luu: 1,
            time_bao_luu: 1,
            no_jobposting: 1,
            new_video: 1,
            new_video_type: 1,
            new_video_active: 1,
            new_images: 1,
            nm_id: 1,
            nm_type: 1,
            nm_min_value: 1,
            nm_max_value: 1,
            nm_unit: 1,
            usc_badge: '$user.inForCompany.timviec365.usc_badge',
            usc_id: '$user.idTimViec365',
            usc_company: '$user.userName',
            usc_alias: '$user.alias',
            chat365_id: '$user._id',
            usc_time_login: '$user.time_login',
            usc_create_time: '$user.createdAt',
            usc_logo: '$user.avatarUser',
            usc_star: '$user.inForCompany.timviec365.usc_star',
            isOnline: '$user.isOnline',
            new_qc: 'true',
          },
        },
      ])

      if (listCampaign.length > 0) {
        for (let i = 0; i < listCampaign.length; i++) {
          const element = listCampaign[i]

          const totalTuongTac = element.cd_tuongtac + 1
          const totalNganSach = element.cd_ngansach
          const totalLuotNhap = element.cd_luotnhap
          const totalLuotUngTuyen = element.cd_luotungtuyen
          const totalCPM = element.cd_cpm
          const cd_id = element.cd_id
          const totalchiphi = Number(element.cd_chiphi)

          // Tính giá trị trung bình cho cd_tile và cd_ngansach
          const tile =
            totalTuongTac === 0
              ? 0
              : (totalLuotNhap + totalLuotUngTuyen) / totalTuongTac
          const cd_ngansach = totalNganSach - totalCPM
          const cd_chiphi = totalchiphi + totalCPM

          // Cập nhật trường cd_tuongtac, cd_tile, và cd_ngansach cho các tài liệu đã tìm thấy
          await Campain.updateOne(
            { cd_id: cd_id },
            {
              $inc: { cd_tuongtac: 1 },
              $set: {
                cd_tile: tile,
                cd_ngansach: cd_ngansach,
                cd_chiphi: cd_chiphi,
              },
            }
          )

          list_new.push(element.new_id)

          if (i <= 2) {
            list_top.push(element)
          } else {
            list_bot.push(element)
          }
        }
      }
    }
    return { list_top, list_bot, listNew: list_new.join(',') }
  } catch (error) {
    console.log(error.message)
    return []
  }
}
