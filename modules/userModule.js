const User = require('../models/user.js');

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
                roomId: user.roomId
            }
        });
    }
}