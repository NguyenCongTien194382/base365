const functions = require('../../services/functions')
const Group = require('../../models/qlc/Group')
const Users = require('../../models/Users')

//tìm kiếm danh sách nhom
exports.getListGroupByFields = async (req, res) => {
  try {
    let com_id = req.body.com_id
    let gr_id = req.body.gr_id
    let dep_id = req.body.dep_id
    let team_id = req.body.team_id
    if (com_id) {
      const page = req.body.page || 1,
        pageSize = req.body.pageSize || 10
      let condition = { com_id: Number(com_id) }

      if (gr_id) condition.gr_id = Number(gr_id)
      if (dep_id) condition.dep_id = Number(dep_id)
      if (team_id) condition.team_id = Number(team_id)

      const data = await Group.aggregate([
        { $match: condition },
        { $sort: { gr_id: -1 } },
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
        {
          $lookup: {
            from: 'QLC_Deparments',
            foreignField: 'dep_id',
            localField: 'dep_id',
            as: 'deparment',
          },
        },
        { $unwind: '$deparment' },
        {
          $lookup: {
            from: 'QLC_Teams',
            foreignField: 'team_id',
            localField: 'team_id',
            as: 'team',
          },
        },
        { $unwind: '$team' },
        {
          $project: {
            _id: 0,
            gr_id: 1,
            gr_name: 1,
            team_id: '$team.team_id',
            team_name: '$team.team_name',
            dep_id: '$deparment.dep_id',
            dep_name: '$deparment.dep_name',
          },
        },
      ])

      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        element.total_emp = await Users.countDocuments({
          'inForPerson.employee.com_id': com_id,
          'inForPerson.employee.group_id': element.gr_id,
          // type: 4,
          'inForPerson.employee.ep_status': 'Active',
        })

        const manager = await Users.findOne(
          {
            'inForPerson.employee.com_id': com_id,
            'inForPerson.employee.group_id': element.gr_id,
            type: 20,
            'inForPerson.employee.ep_status': 'Active',
            'inForPerson.employee.position_id': 6,
          },
          { userName: 1 }
        )
        element.manager = manager ? manager.userName : ''

        const deputy = await Users.findOne(
          {
            'inForPerson.employee.com_id': com_id,
            'inForPerson.employee.dep_id': element.dep_id,
            type: 2,
            'inForPerson.employee.ep_status': 'Active',
            'inForPerson.employee.position_id': 5,
          },
          { userName: 1 }
        )
        element.deputy = deputy ? deputy.userName : ''
      }
      return functions.success(res, 'Lấy thành công', { data })
    }
    return functions.setError(res, 'Chưa truyền id công ty')
  } catch (err) {
    return functions.setError(res, err.message)
  }
}
//Tạo mới dữ liệu của một nhom
exports.createGroup = async (req, res) => {
  try {
    const type = req.user.data.type
    const com_id = req.user.data.com_id
    // const com_id = req.body.com_id
    const { dep_id, team_id, gr_name } = req.body
    if (type == 1) {
      if (dep_id && com_id && team_id && gr_name) {
        let max =
          (await Group.findOne(
            {},
            { gr_id: 1 },
            { sort: { gr_id: -1 } }
          ).lean()) || 0
        const data = new Group({
          gr_id: Number(max.gr_id) + 1 || 1,
          dep_id: dep_id,
          com_id: com_id,
          team_id: team_id,
          gr_name: gr_name,
        })
        await data.save()
        return functions.success(res, 'Tạo thành công', { data })
      }
      return functions.setError(res, 'nhập thiếu trường')
    }
    return functions.setError(res, 'Tài khoản không phải Công ty')
  } catch (e) {
    return functions.setError(res, e.message)
  }
}
//API thay đổi thông tin của một nhóm
exports.editGroup = async (req, res) => {
  try {
    const type = req.user.data.type
    const com_id = req.user.data.com_id
    // const com_id = req.body.com_id
    const gr_id = req.body.gr_id
    if (type == 1) {
      const { dep_id, team_id, gr_name } = req.body
      const data = await functions.getDatafindOne(Group, {
        com_id: com_id,
        dep_id: dep_id,
        team_id: team_id,
        gr_id: gr_id,
      })
      if (data) {
        await functions.getDatafindOneAndUpdate(
          Group,
          { com_id: com_id, dep_id: dep_id, team_id: team_id, gr_id: gr_id },
          {
            dep_id: dep_id,
            gr_name: gr_name,
            team_id: team_id,
          }
        )
        return functions.success(res, 'Sửa thành công', { data })
      }
      return functions.setError(res, 'Nhóm không tồn tại ')
    }
    return functions.setError(res, 'Tài khoản không phải Công ty')
  } catch (e) {
    return functions.setError(res, e.message)
  }
}
//API Xóa một nhóm theo id
exports.deleteGroup = async (req, res) => {
  try {
    const { gr_id } = req.body
    const type = req.user.data.type
    const com_id = req.user.data.com_id
    // const com_id = req.body.com_id
    if (type == 1) {
      if (com_id && gr_id) {
        await Users.updateOne(
          {
            'inForPerson.employee.com_id': com_id,
            'inForPerson.employee.gr_id': gr_id,
          },
          { $set: { 'inForPerson.employee.gr_id': 0 } }
        )
        const data = await functions.getDatafindOne(Group, {
          com_id: com_id,
          gr_id: gr_id,
        })
        if (data) {
          functions.getDataDeleteOne(Group, { com_id: com_id, gr_id: gr_id })
          return functions.success(res, 'Xóa thành công', { data })
        }
        return functions.setError(res, 'Nhóm không tồn tại ', 610)
      }
      return functions.setError(res, 'Nhập thiếu trường gr_id ', 502)
    }
    return functions.setError(res, 'Tài khoản không phải Công ty', 604)
  } catch (e) {
    return functions.setError(res, e.message)
  }
}
