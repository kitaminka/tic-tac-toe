const Room = require('../models/room');
const User = require('../models/user');
const userModule = require('../modules/userModule');

module.exports = {
    async createRoom(req, res) {
        const user = await userModule.getUser(req.session.user.id);
        if (user.roomId) {
            return res.redirect('/game/');
        }
        try {
            const room = await Room.create({
                owner: req.session.user.id,
                private: req.body.private
            });

            return res.redirect(`/game/${room._id}`);
        } catch {
            return res.redirect('/game/');
        }
    },
    async getRooms(req, res) {
        return res.send({
            success: true,
            result: await Room.find({
                private: false
            })
        });
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
        if (members.length > 1) {
            return res.status(403).send({
                success: false,
                error: 'Room is full'
            });
        }
        try {
            const room = await Room.findByIdAndUpdate(req.params.id, {
                $push: {
                    members: req.session.user.id
                },
            });
            if (!room) {
                return res.send({
                    success: false,
                    error: 'Invalid room id'
                });
            }
            req.session.user.roomId = room._id;
            await userModule.updateUser(req.session.user);
            return res.send({
                success: true,
                status: 'User joined room'
            });
        } catch {
            return res.send({
                success: false,
                status: 'Error occurred'
            });
        }
    },
    async deleteRoom(req, res) {
        const roomInfo = await Room.findById(req.params.id);
        if (roomInfo.owner === req.session.user.id) {
            try {
                const roomInfo = await Room.findByIdAndDelete(req.params.id);
                if (!roomInfo) {
                    return res.send({
                        success: false,
                        error: 'Invalid room id'
                    });
                }
                for (const userId of roomInfo.members) {
                    await User.findOneAndUpdate({
                        id: userId
                    }, {
                        $set: {
                            roomId: null
                        }
                    });
                }
                return res.send({
                    success: true,
                    status: 'Room deleted'
                });
            } catch {
                return res.send({
                    success: false,
                    status: 'Error occurred'
                });
            }
        } else {
            return res.status(403).send({
                success: false,
                error: 'Forbidden'
            });
        }
    }
}