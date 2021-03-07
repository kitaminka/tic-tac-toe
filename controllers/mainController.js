module.exports = {
    auth(req, res){
        if (!req.session.username) return res.render('auth');
        else res.send(`Authorized as ${req.session.username}`);
    }
}