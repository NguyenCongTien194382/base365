const functions = require("../../../services/functions");
const { saveHistory, userExists } = require("./utils");
const ManagePointHistory = require("../../../models/Timviec365/UserOnSite/ManageHistory/ManagerPointHistory");
const SaveVoteCandidate = require("../../../models/Timviec365/UserOnSite/ManageHistory/SaveVoteCandidate")

const arrPointStar = (star) => {
    let arr = [{
            star: 1,
            point: -10
        },
        {
            star: 2,
            point: -5
        },
        {
            star: 3,
            point: 0
        },
        {
            star: 4,
            point: 5
        },
        {
            star: 5,
            point: 10
        }
    ];
    if (star > 0 && star <= 5) {
        return arr[star - 1].point;
    } else {
        return 0;
    }
}


// hàm xử ý tính điểm khi đánh giá
// vote tin tuyển dụng 
module.exports = async(userId, userType, star, voteUserId, voteUserType) => {
    try {
        let checkUser1 = userExists(userId, userType);
        let checkUser2 = userExists(voteUserId, voteUserType);
        if (checkUser1&&checkUser2) {
            let time = functions.getTimeNow();
            let type = 'candidate';
            let type_create = 1;
            let hasVoted = await SaveVoteCandidate.find({
                userId: userId,
                user_type_vote: userType,
                id_be_vote: voteUserId,
                type_be_vote: voteUserType,
                type: type,
            });
            if (hasVoted) {
                if (hasVoted.length) {
                    await SaveVoteCandidate.updateOne({ id: hasVoted[0].id }, {
                        $set: {
                            star: star,
                            time: time
                        }
                    });
                } else {
                    let maxId = 0
                    const maxSaveVote = await SaveVoteCandidate.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
                    if (maxSaveVote) maxId = Number(maxSaveVote.id) + 1
                    await new SaveVoteCandidate({
                        id: maxId,
                        userId: userId,
                        user_type_vote: userType,
                        star: star,
                        id_be_vote: voteUserId,
                        type_be_vote: voteUserType,
                        type: type,
                        type_create: type_create,
                        time: time,
                    }).save();
                }

                const totalVote = await SaveVoteCandidate.aggregate([{
                        $match: {
                            id_be_vote: voteUserId,
                            user_type_vote: userType,
                            type_create: type_create
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            sum: { $sum: '$star' },
                            count: { $sum: 1 }
                        }
                    }
                ]);
                let sum = totalVote[0].sum;
                let count = totalVote[0].count;
                let avg = 1;
                avg = Math.floor(sum / count);
                if (avg < 1) {
                    avg = 1;
                }
                
                let point = arrPointStar(avg);
                let history = await ManagePointHistory.findOne({
                    userId: voteUserId,
                    type: voteUserType
                })
                if (history) {
                    history.point_vote_candidate = point;
                } else {
                    history = new ManagePointHistory({
                        userId: voteUserId,
                        type: voteUserType,
                        point_to_change: point,
                        point_vote_candidate: point,
                        sum: point
                    });
                }
                await saveHistory(history);
            } else {
                return false;
            }
        } else {
            return false;
        }

    } catch (e) {
        console.log(e);
        return false;
    }
}