const Room = require('../models/room');
const User = require('../models/user');
const userModule = require('../modules/userModule');

module.exports = {
    async createRoom(req, res) {
        const user = await userModule.getUser(req.session.user.id);
        if (user.roomId) {
            return res.status(409).send({
                success: false,
                error: 'User already joined room'
            });
        }
        const room = await Room.create({
            owner: req.session.user.id,
            members: [req.session.user.id],
            private: req.query.private
        });
        await User.findOneAndUpdate({
            id: req.session.user.id
        }, {
            $set: {
                roomId: room._id
            }
        });
        return res.send({
            success: true,
            status: 'Room created'
        });
    },
    async getRooms(req, res) {
        return res.send(await Room.find({
            private: false
        }));
    },
    async joinRoom(req, res) {
        const user = await userModule.getUser(req.session.user.id);
        if (user.roomId) {
            return res.status(409).send({
                success: false,
                error: 'User already joined room'
            });
        }
        const members = (await Room.findById(req.params.id)).members;
        if (members.length === 2) {
            return res.status(403).send({
                success: false,
                error: 'Room is full'
            });
        }
        try {
            const room = await Room.findByIdAndUpdate(req.params.id, {
                $push: {
                    members: req.session.user.id,
                }
            });
            req.session.user.roomId = room._id;
            await userModule.updateUser(req.session.user);
            return res.send({
                success: true,
                status: 'User joined room'
            });
        } catch (err) {
            return res.status(404).send({
                success: false,
                error: 'Invalid room id'
            });
        }
    },
    async deleteRoom(req, res) {
        const room = await Room.findById(req.params.id);
        if (room.owner === req.session.user.id) {
            try {
                await Room.findByIdAndDelete(req.params.id);
                return res.send({
                    success: true,
                    status: 'Room deleted'
                });
            } catch (err) {
                return res.send({
                    success: false,
                    status: 'Invalid room id'
                });
            }
        } else {
            return res.status(403).send('Forbidden');
        }
    }
}