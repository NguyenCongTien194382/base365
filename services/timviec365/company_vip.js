exports.getUrlImage = (banner) => {
    return `${process.env.cdn}/pictures${banner}`;
}