const cron = require('node-cron');
const time_stone = 1687315166; // thoi di?m b?t d?u ch?y tia s�t
const User = require('../../../../models/Users');
const NewTV365 = require('../../../../models/Timviec365/UserOnSite/Company/New');
const ApplyForJob = require('../../../../models/Timviec365/UserOnSite/Candicate/ApplyForJob');
const ManagePointHistory = require('../../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory');
const { saveHistory } = require('../utils');


const cronAnhSaoUv = async() => {
    console.log("Start cronAnhSaoUv");
    await User.updateMany({
        "inForPerson.candidate.anhsao_badge": 1
    }, {
        $set: {
            "inForPerson.candidate.anhsao_badge": 0
        }
    })
    let listUser = await User.aggregate([{
            $match: {
                idTimViec365: { $ne: 0 },
                type: { $ne: 1 },
                "inForPerson.candidate": { $ne: null }
            }
        },
        {
            $lookup: {
                from: 'Tv365ManagerPointHistory',
                localField: 'idTimViec365',
                foreignField: 'userId',
                as: 'Tv365ManagerPointHistory'
            }
        },
        {
            $match: {
                "Tv365ManagerPointHistory.point_to_change": { $gte: 30 } // ánh sao thường
            }
        },
        {
            $project: {
                _id: 1,
                idTimViec365: 1
            }
        }
    ]);

    let listidTimViec365 = [];
    for (let i = 0; i < listUser.length; i++) {
        listidTimViec365.push(listUser[i].idTimViec365)
    };
    console.log("Danh sách ứng viên được ánh sao");
    console.log("Bắt đầu cập nhật ánh sao");
    let temt_arr = [];
    for (let i = 0; i < listidTimViec365.length; i++) {
        let listManage = await ManagePointHistory.find({ userId: listidTimViec365[i], type: 0 }).lean();
        // listidTimViec365
        if (listManage.length == 1) {
            if (listManage[0].point_to_change > 30) {
                console.log("Rà soát", i, listidTimViec365[i]);
                temt_arr.push(listidTimViec365[i])
            }
        }
    };
    await User.updateMany({
        // type: { $ne: 1 },
        // idTimViec365: { $ne: 0 },
        "inForPerson.candidate": { $ne: null }
    }, {
        $set: {
            "inForPerson.candidate.anhsao_badge": 0
        }
    });
    await User.updateMany({
        idTimViec365: { $in: temt_arr },
        type: { $ne: 1 },
        //idTimViec365: { $ne: 0 },
        "inForPerson.candidate": { $ne: null }
    }, {
        $set: {
            "inForPerson.candidate.anhsao_badge": 1
        }
    });
    console.log("End cronAnhSaoUv")
    return true;
};


cron.schedule('0 12 * * *', async() => {
    try {
        await cronAnhSaoUv();
    } catch (e) {
        console.log(e);
        return false;
    }
});

cron.schedule('0 0 * * *', async() => {
    try {
        await cronAnhSaoUv();
    } catch (e) {
        console.log(e);
        return false;
    }
});





const Tool = async() => {
    try {
        //await cronAnhSaoUv();
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};
Tool();
console.log('Set');