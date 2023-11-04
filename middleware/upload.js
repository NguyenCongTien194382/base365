const multer = require('multer');
const fc = require('../services/functions')

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const folder = req.params.folder
        callback(null, `../storage/base365/giaoviec365/${folder}`);
    },
    filename: (req, file, callback) => {
        const filename = `${fc.getTimeNow()}_${file.originalname}`
        callback(null, filename);
    }
})

const upload = multer({ storage: storage });

module.exports = upload