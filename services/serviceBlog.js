exports.hostBlog = async(title, id) => {
    const hostBlog = "https://timviec365.vn/blog"
    const link = `${hostBlog}/${title}-new${id}.html`;
    return link;
};