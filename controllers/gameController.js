module.exports = {
    homePage(req, res) {
        return res.render('home', {
            username: req.session.user.nickname
        });
    }
}