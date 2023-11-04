const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017/";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};
let array = [1111113063];
// idTimViec365
// 1111113063
const Tool = async() => {
    try {
        console.log("Bắt đầu");
        let db = await MongoClient.connect(url);
        let dbo = db.db("api-base365");
        let dbo2 = db.db("Chat365");
        while (true) {
            console.log(new Date());
            let usercheck = await dbo.collection("Users").find({ idTimViec365: { $in: array }, type: 1 }).toArray();
            if (usercheck.length == 0) {
                let userbackup = await dbo2.collection("Users").find({ idTimViec365: { $in: array }, type: 1 }).toArray();
                for (let i = 0; i < userbackup.length; i++) {
                    await dbo.collection("Users").insertOne(userbackup[i]);
                }
            };
            await sleep(10000);
        }
    } catch (e) {
        console.log(e);
        await Tool();
    }
};
Tool();