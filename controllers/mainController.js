module.exports = {
    authPage(req, res){
        res.render('auth');
    },
    homePage(req, res) {
        res.render('home', {
            username: req.session.username
        });
    }
}