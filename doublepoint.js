const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017/api-base365";
let db;
let dbo
let connect = async() => {
    db = await MongoClient.connect(url);
    dbo = db.db("api-base365");
};

// Tv365PointCompanyOld
// Tv365PointCompany
// 907 
const Tool = async() => {
    await connect();
    let flag = true;
    let skip = 0;
    let limit = 100;
    let count = 0;
    while (flag) {
        let listobj = await dbo
            .collection('Tv365PointCompany')
            .find({ point_usc: { $ne: 0 } }).sort({ _id: 1 }).skip(skip).limit(limit)
            .toArray();
        if (listobj.length) {
            for (let i = 0; i < listobj.length; i++) {
                let obj = listobj[i];
                let newpoint = 2 * Number(obj.point_usc);
                await dbo.collection('Tv365PointCompany').updateOne({
                    usc_id: Number(obj.usc_id)
                }, {
                    $set: {
                        point_usc: 2 * Number(obj.point_usc)
                    }
                });
                count = count + 1;
                console.log("Update thành công", count, obj.usc_id, newpoint, obj.point_usc);
            };
            skip = skip + limit;
        } else {
            flag = false;
            return false;
        }
    }
};
Tool()