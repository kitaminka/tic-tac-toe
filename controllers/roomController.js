const Room = require('../models/room');
const userModule = require('../modules/userModule');

module.exports = {
    async createRoom(req, res) {
        try {
            await Room.create({
                owner: req.session.user.id,
                members: [req.session.user.id],
                private: req.query.private
            });
            return res.send({
                success: true,
                status: 'Room created'
            });
        } catch (err) {
            return res.send({
                success: false,
                error: 'Error occurred'
            });
        }
    },
    async getRooms(req, res) {
        return res.send(await Room.find({
            private: false
        }));
    },
    async joinRoom(req, res) {
        const user = await userModule.getUser(req.session.user.id);
        if (user.roomId) {
            return res.send({
                success: false,
                error: 'User already joined room'
            });
        }
        const room = await Room.findByIdAndUpdate(req.params.id, {
            $push: {
                members: req.session.user.id,
            }
        });
        if (room) {
            req.session.user.roomId = room._id;
            await userModule.updateUser(req.session.user);
            return res.send({
                success: true,
                status: 'User joined room'
            });
        } else {
            return res.send({
                success: false,
                error: 'Invalid room id'
            });
        }
    }
}