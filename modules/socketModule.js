const Room = require('../models/room');
const User = require('../models/user.js');
const userModule = require('../modules/userModule');

const connections = [];
let gameState = 0;
let gameInfo;

module.exports = (io) => {
    io.sockets.on('connection', (socket) => {
        if (connections.length === 2) socket.disconnect;
        connections.push(socket);
        if (connections.length === 2) gameState = 1;
        if (gameState === 1) {
            gameInfo = [
                {
                    socketId: connections[0].id,
                    turn: 1
                },
                {
                    socketId: connections[1].id,
                    turn: 2
                }
            ];
            io.emit('gameStart', gameInfo);
            io.emit('firstTurn');
        }
        socket.on('turn', (data) => {
            if ((gameInfo[0].socketId === socket.id && gameInfo[0].turn === gameState) ||
                (gameInfo[1].socketId === socket.id && gameInfo[1].turn === gameState)) {
                console.log(1)
                io.emit('turnInfo', {
                    socketId: socket.id,
                    turn: data
                });
                if (gameState === 1) {
                    gameState = 2;
                    io.emit('secondTurn');
                } else {
                    gameState = 1;
                    io.emit('firstTurn');
                }
            }
        });
        socket.on('disconnect', async () => {
            await io.emit('gameEnd');
            const room = await Room.findByIdAndDelete(socket.request.session.user.roomId);
            await User.findOneAndUpdate({
                id: room.members[0]
            }, {
                $set: {
                    roomId: null
                }
            });
            await User.findOneAndUpdate({
                id: room.members[1]
            }, {
                $set: {
                    roomId: null
                }
            });
        });
        // TODO Add win
    });
}