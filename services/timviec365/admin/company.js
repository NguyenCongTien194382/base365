const fs = require('fs');
const path = require('path');

exports.getUrlLogoNTD = (fileName, _id) => {
    return `${process.env.cdn}/ntd/logo/${_id}/${fileName}`;
}

exports.uploadLogoNTD = async(logo, createdAt, _id) => {
    const destination = '../storage/base365/timviec365/ntd'
    const userDestination = `${destination}/logo/${_id}`; // Tạo đường dẫn đến thư mục của người dùng
    var fileName = ""
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (allowedTypes.includes(logo.type)) 
    {
        if (!fs.existsSync(userDestination)) 
        { // Nếu thư mục chưa tồn tại thì tạo mới
            fs.mkdirSync(userDestination, { recursive: true });
        }
        const uniqueSuffix = createdAt;

        fileName = "logo" + '_' + uniqueSuffix + '.' + logo.originalFilename.split('.').pop();

        fs.readFile(logo.path, (err, data) => {
            if (err) 
            {
                console.log( err );
                return;
            }
            
            const serverImagePath = path.join(userDestination, fileName);
          
            fs.writeFile(serverImagePath, data, (err) => {
                if (err)
                {
                    console.log( err );
                    return "Upload failed";
                }
            });
        });
    } 
    else 
    {
        return "Upload failed";
    }
    return fileName;
}