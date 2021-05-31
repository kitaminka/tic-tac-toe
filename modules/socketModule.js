const Room = require('../models/room');
const User = require('../models/user.js');
const userModule = require('../modules/userModule');

const connections = [];
let gameState = 0;

module.exports = (io) => {
    io.sockets.on('connection', (socket) => {
        console.log(`--${socket.id}`) // Remove this
        if (connections.length === 2) socket.disconnect;
        connections.push(socket);
        if (connections.length === 2) gameState = 1;
        if (gameState === 1) {
            io.emit('gameStart', [
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
            gameState = 2;
        }
        socket.on('turn', (data) => {
            io.emit('turnInfo', {
                socketId: socket.id,
                turn: data
            });
            if (gameState === 1) {
                io.emit('firstTurn');
                gameState = 2;
            } else {
                io.emit('secondTurn');
                gameState = 1;
            }
        });
        socket.on('disconnect', () => {
            connections.splice(connections.indexOf(socket), 1);
            // TODO Add room removing and user updating
        });
        // TODO Add win
    });
}