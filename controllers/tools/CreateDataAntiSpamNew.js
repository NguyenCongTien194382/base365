const New = require('../../models/Timviec365/UserOnSite/Company/New');
const ContentNew = require('../../models/Timviec365/UserOnSite/Company/ContentNew');

const CreateData = async() => {
    try {
        let flag = true;
        let skip = 0;
        let limit = 1000;
        let count = 0;
        while (flag) {
            let listNew = await New.find({}, {
                new_id: 1,
                new_mota: 1,
                new_yeucau: 1,
                new_quyenloi: 1
            }).sort({ new_id: -1 }).skip(skip).limit(1000).lean();
            if (listNew && listNew.length) {
                if (count < 100000) {
                    skip = skip + limit;
                    for (let i = 0; i < listNew.length; i++) {
                        let news = listNew[i];
                        let final_arr = [];
                        let arr1_mota = news.new_mota.split("\r\n");
                        for (let j = 0; j < arr1_mota.length; j++) {
                            let arr2_mota = arr1_mota[j].split(" ");
                            for (let k = 0; k < arr2_mota.length; k++) {
                                let str_final = arr2_mota[k].replace(/\s/g, '').replace(/-/g, '').replace(/(<([^>]+)>)/ig, '');
                                if (str_final) {
                                    final_arr.push(str_final);
                                }
                            }
                        };

                        let arr1_yeucau = news.new_yeucau.split("\r\n");
                        for (let j = 0; j < arr1_yeucau.length; j++) {
                            let arr2_yeucau = arr1_yeucau[j].split(" ");
                            for (let k = 0; k < arr2_yeucau.length; k++) {
                                let str_final = arr2_yeucau[k].replace(/\s/g, '').replace(/-/g, '').replace(/(<([^>]+)>)/ig, '');
                                if (str_final) {
                                    final_arr.push(str_final);
                                }
                            }
                        };

                        let arr1_quyenloi = news.new_quyenloi.split("\r\n");
                        for (let j = 0; j < arr1_quyenloi.length; j++) {
                            let arr2_quyenloi = arr1_quyenloi[j].split(" ");
                            for (let k = 0; k < arr2_quyenloi.length; k++) {
                                let str_final = arr2_quyenloi[k].replace(/\s/g, '').replace(/-/g, '').replace(/(<([^>]+)>)/ig, '');
                                if (str_final) {
                                    final_arr.push(str_final);
                                }
                            }
                        };

                        let check = await ContentNew.find({ new_id: news.new_id }).lean();
                        if (check.length == 0) {
                            let newDoc = new ContentNew({
                                new_id: news.new_id,
                                new_description: final_arr
                            });
                            await newDoc.save();
                        } else {
                            await ContentNew.updateOne({ new_id: news.new_id }, { $set: { new_description: final_arr } })
                        }
                    }
                } else {
                    flag = false;
                    console.log("end ......")
                }
            } else {
                flag = false;
                console.log("end ....")
            }
        };
    } catch (e) {
        console.log(e)
    }

}

CreateData()