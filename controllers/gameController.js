module.exports = {
    homePage(req, res) {
        return res.render('home', {
            nickname: req.session.user.nickname,
            avatar: req.session.user.avatar,
            id: req.session.user.id
        });
    },
    roomPage(req, res) {
        return res.render('room', {
            nickname: req.session.user.nickname,
            avatar: req.session.user.avatar,
            id: req.session.user.id
        });
    }
}