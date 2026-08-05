// TODO: Viết middleware requireAdmin tại đây
module.exports = (req, res, next) => {
    if (req.session && req.session.userId && req.session.role === 'admin') {
        return next();
    }


    res.status(403).render('error', {
        title: '403 Forbidden',
        message: ' Bạn không có quyền thực hiện chức năng này (Chỉ dành cho Admin)! '
    });

}