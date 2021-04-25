module.exports = {
    homePage(req, res) {
        return res.render('home', {
            username: req.session.user.nickname
        });
    },
    roomPage(req, res) {
        return res.render('room', {
            username: req.session.user.nickname
        });
    }
}