const New = require('../../models/Timviec365/UserOnSite/Company/New');
const ContentNew = require('../../models/Timviec365/UserOnSite/Company/ContentNew');
const functions = require('../../services/functions');
exports.trungtu = async(req, res) => {
    try {
        let new_id = Number(req.body.new_id);
        let percent = 0.6- 0.01;
        let news = await ContentNew.findOne({new_id:new_id}).lean();
        let content = news.new_description;
        let count_compare = content.length * percent;
        let max_limit = content.length / percent;
        let min_limit = content.length * percent;
        let datacheck = await ContentNew.aggregate([
            {
                "$match":{
                        "new_description":{"$in":content},
                        "new_id":{"$ne":new_id}
                }
            },
            {
                "$project":{
                    "new_description":1,
                    "new_id":1,
                    "size":{
                        "$size":"$new_description"
                    },
                    "sizeorigin":{
                        "$size":"$new_description"
                    }
                }
            },
            {
                "$match":{
                    "$and":[
                        {"size":{"$lte":max_limit}},
                        {"size":{"$gte":min_limit}}
                    ]
                }
            },

            {
                "$project":{
                        "new_description":{
                            "$filter":{
                                "input":"$new_description",
                                "as":"new_description",
                                "cond":{
                                    "$in":["$$new_description",content]
                                }
                            }
                        },
                        "new_id":1,
                        "sizeorigin":1
                }
            },
            {
                "$project":{
                        "new_id":1,
                        "sizeorigin":1,
                        "count":{
                            "$size":"$new_description"
                        }
                }
            },
            {
                "$match":{
                        "count":{
                            "$gte":count_compare
                        }
                }
            },
            {
                "$limit":10
            }
        ]);
        let final_arr = [];
        for(let i = 0; i < datacheck.length; i++){
            let a = datacheck[i];
            final_arr.push({
                new_id:a.new_id,
                count:a.count,
                sizeorigin:a.sizeorigin
            })
        };
        return functions.success(res, "", { final_arr });
    } catch (error) {
        console.log(error);
        return functions.setError(res, error);
    }
}