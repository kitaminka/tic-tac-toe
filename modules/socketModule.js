const Room = require('../models/room');
const User = require('../models/user.js');
require('../modules/userModule');
const rooms = new Map;

module.exports = (io) => {
    io.sockets.on('connection', (socket) => {
        console.log(rooms)
        if (!rooms.get(socket.request.session.user.roomId)) {
            rooms.set(socket.request.session.user.roomId, {
                gameState: 0,
                turns: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                roomId: socket.request.session.user.roomId,
                xTurn: socket.id
            });
        } else {
            let roomInfo = rooms.get(socket.request.session.user.roomId);

            if (roomInfo.oTurn) return socket.disconnect;

            roomInfo.oTurn = socket.id;
            roomInfo.gameState = 1
        }

        let roomInfo = rooms.get(socket.request.session.user.roomId);

        if (roomInfo.gameState === 1) {
            io.emit('gameStart', roomInfo);
            io.emit('firstTurn', roomInfo);
        }
        socket.on('turn', (turnInfo) => {
            if ((roomInfo.gameState === 1 && roomInfo.xTurn === socket.id) || (roomInfo.gameState === 2 && roomInfo.oTurn === socket.id)) {
                roomInfo.turns[turnInfo] = roomInfo.gameState;
                io.emit('turnInfo', {
                    turn: turnInfo,
                    gameState: roomInfo.gameState,
                    roomId: socket.request.session.user.roomId
                });
                if (roomInfo.gameState === 1) {
                    roomInfo.gameState = 2;
                    io.emit('secondTurn', roomInfo);
                } else {
                    roomInfo.gameState = 1;
                    io.emit('firstTurn', roomInfo);
                }
            }
        });
        socket.on('disconnect', async () => {
            let winner;

            if (roomInfo.xTurn === socket.id) {
                winner = roomInfo.oTurn;
            } else {
                winner = roomInfo.xTurn;
            }

            io.emit('gameEnd', {
                winner: winner,
                loser: socket.id
            });
            const room = await Room.findByIdAndDelete(socket.request.session.user.roomId);
            if (room.members[0] === socket.request.session.user.id) {
                await User.findOneAndUpdate({
                    id: room.members[1]
                }, {
                    $set: {
                        roomId: null
                    }
                });
            } else {
                await User.findOneAndUpdate({
                    id: room.members[0]
                }, {
                    $set: {
                        roomId: null
                    }
                });
            }
        });
        // TODO Add win
    });
}