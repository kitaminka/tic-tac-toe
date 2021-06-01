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
            gameState = 2;
        }
        socket.on('turn', (data) => {
            if ((gameInfo[0].socketId === socket.id && gameInfo[0].turn === gameState) ||
                (gameInfo[1].socketId === socket.id && gameInfo[1].turn === gameState)) {
                io.emit('turnInfo', {
                    socketId: socket.id,
                    turn: data
                });
            }
            if (gameState === 1) {
                io.emit('firstTurn');
                gameState = 2;
            } else {
                io.emit('secondTurn');
                gameState = 1;
            }
        });
        socket.on('disconnect', () => {
            const room = Room.findByIdAndDelete(socket.request.roomId);
            console.log(room);
            // TODO Add room removing and user updating
        });
        // TODO Add win
    });
}