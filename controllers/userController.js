const fetch = require('node-fetch');
const User = require('../models/user');
const userModule = require('../modules/userModule');

module.exports = {
    async authUser(req, res) {
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
        }).then(res => res.json());

        const userInfo = await fetch(`https://discord.com/api/v8/users/@me`, {
            method: 'GET',
            headers: {
                'Authorization':`${data.token_type} ${data.access_token}`
            }
        }).then((res) => res.json());
        userInfo.nickname = `${userInfo.username}#${userInfo.discriminator}`;
        userInfo.accessToken = `${data.token_type} ${data.access_token}`;
        req.session.user = await this.updateUser(req, res, userInfo);
        return res.redirect('/game');
    },
    async updateUser(req, res, user) {
        const result = await userModule.updateUser(user);
        if (!result) return this.creteUser(req, res, user);
        else return result;
    },
    async updateUserInfo(req, res) {
        const user = await User.findOne({
            id: req.session.user.id
        });
        const userInfo = await fetch(`https://discord.com/api/v8/users/@me`, {
            method: 'GET',
            headers: {
                'Authorization': user.accessToken
            }
        }).then((res) => res.json());
        try {
            await User.findOneAndUpdate({
                id: req.session.user.id
            }, {
                $set: {
                    nickname: `${userInfo.username}#${userInfo.discriminator}`,
                    avatar: userInfo.avatar
                }
            });
            return res.send({
                success: true,
                status: 'User updated'
            });
        } catch {
            return res.send({
                success: false,
                status: 'Error occurred'
            });
        }
    },
    async creteUser(req, res, user) {
        return User.create({
            nickname: user.nickname,
            avatar: user.avatar,
            id: user.id,
            accessToken: user.accessToken
        });
    },
    async signOut(req, res) {
        req.session.destroy();
        return res.send({
            success: true,
        });
    },
    async getUser(req, res) {
        const user = await userModule.getUser(req.params.id);
        if (!user) return res.status(404).send({
            success: false,
            error: 'Invalid user id'
        });
        else return res.send({
            success: false,
            result: user
        });
    }
}