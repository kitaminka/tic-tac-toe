const fetch = require('node-fetch');
const User = require('../models/user');
const userModule = require('../modules/userModule');

module.exports = {
    async authUser(req, res) {
        // TODO Fix bug with authorization when user is not created
        const uri = 'http://127.0.0.1/users/auth/';

        const params = new URLSearchParams();
        params.append('client_id', process.env.CLIENT_ID);
        params.append('grant_type', 'authorization_code');
        params.append('client_secret', process.env.CLIENT_SECRET);
        params.append('code', req.query.code);
        params.append('redirect_uri', uri);

        const data = await fetch('https://discord.com/api/v8/oauth2/token', {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((res) => res.json());

        const user = await fetch(`https://discord.com/api/v8/users/@me`, {
            method: 'GET',
            headers: {
                'Authorization':`${data.token_type} ${data.access_token}`
            }
        }).then((res) => res.json());
        user.nickname = `${user.username}#${user.discriminator}`;
        req.session.user = await this.updateUser(req, res, user);
        return res.redirect('/game');
    },
    async updateUser(req, res, user) {
        const result = await userModule.updateUser(user);
        if (!result) return this.creteUser(req, res, user);
        else return result;
    },
    async creteUser(req, res, user) {
        return User.create({
            nickname: user.nickname,
            avatar: user.avatar,
            id: user.id,
            sessionId: req.sessionID
        });
    },
    async getUser(id) {
        return userModule.getUser(id);
    }
}