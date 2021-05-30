const Room = require('../models/room');
const User = require('../models/user.js');
const userModule = require('../modules/userModule');

const connections = [];
let gameState = 0;

module.exports = (io) => {
    io.sockets.on('connection', (socket) => {
        if (connections.length === 2) socket.disconnect;
        connections.push(socket);
        if (connections.length === 2) gameState = 1;
        if (gameState === 1) io.emit('gameStart', [
            {
                socketId: connections[0].id,
                turn: 1
            },
            {
                socketId: connections[1].id,
                turn: 2
            }
        ]);
        io.emit('firstTurn');
    });
    io.sockets.on('disconnect', () => {
        for (const socket of connections) socket.disconnect;
    });
}