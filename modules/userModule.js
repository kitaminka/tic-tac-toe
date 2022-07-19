const User = require('../models/userModel.js');

module.exports = {
    async getUser(id) {
        return User.findOne({
            id: id
        });
    },
    async updateUser(user) {
        return User.findOneAndUpdate({
            id: user.id,
        }, {
            $set: {
                nickname: user.nickname,
                avatar: user.avatar,
                roomId: user.roomId,
                accessToken: user.accessToken
            }
        });
    },
    async updateSession(req, res, next) {
        const user = await this.getUser(req.session.user.id);
        if (!user) {
            await req.session.destroy();
        } else {
            req.session.user.nickname = user.nickname;
            req.session.user.avatar = user.avatar;
            req.session.user.roomId = user.roomId;
        }
        return next();
    }
}
