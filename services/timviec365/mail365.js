exports.getUrlImage = (image) => {
    return `${process.env.cdn}/mail365/upload/mail/thumb/${image}`;
}

exports.getUrlImageReview = (image) => {
    return `${process.env.cdn}/mail365/upload/mail/${image}`;
}