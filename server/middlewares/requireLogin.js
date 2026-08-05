// TODO: Viết middleware requireLogin tại đây
module.exports = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/auth/login');
};