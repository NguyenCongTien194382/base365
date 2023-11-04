const { default: axios } = require('axios')
const FormData = require('form-data')

exports.DetectFace = async(req, res) => {

    const comp_id = req.body.company_id
    const image = req.body.image
    try {
        if (comp_id && image) {
            const resp = await axios.post(
                'http://43.239.223.147:5001/verify_web_company', [{
                    company_id: req.body.company_id,
                    image: req.body.image,
                }, ], {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            res.status(200).send({
                data: resp.data,
            })
        } else {
            res.status(500).send({
                message: 'Thiếu trường',
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: error,
        })
    }
}

exports.UpdateFace = async(req, res) => {
    const company_id = req.body.company_id
    const user_id = req.body.user_id
    const isAndroid = req.body.isAndroid
    const image = req.body.image
    try {
        if (company_id && user_id && image) {
            // const listImg = listImgs?.split(',')
            const fd = new FormData()
            fd.append('company_id', company_id)
            fd.append('user_id', user_id)
            fd.append('isAndroid', isAndroid)
            fd.append('image', image)

            const data = await axios.post(
                'http://43.239.223.147:5001/v2/face_register_app',
                fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            if (data.data.data.result) {
                res.status(200).send({
                    data: true,
                    message: 'Cập nhật khuôn mặt thành công',
                })
            } else {
                res.status(500).send({
                    message: 'Có lỗi khi cập nhật khuôn mặt',
                })
            }
        } else {
            res.status(500).send({
                message: 'Thieu truong',
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'Có lỗi xảy ra bên AI',
        })
    }
}