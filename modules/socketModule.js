const Room = require('../models/roomModel');
const User = require('../models/userModel.js');

const rooms = new Map;
const winPositions = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];

async function checkWin(turns, winPositions) {
    let correctTurns = 0;

    for (const winPositionsArr of winPositions) {
        for (const winPosition of winPositionsArr) {
            for (const move of turns) {
                if (winPosition === move) correctTurns++;
            }
        }
        if (correctTurns === winPositionsArr.length) {
            return true;
        }
        correctTurns = 0;
    }

    return false;
}

module.exports = async (io) => {
    io.sockets.on('connection', async (socket) => {
        if (!rooms.get(socket.request.session.user.roomId)) {
            rooms.set(socket.request.session.user.roomId, {
                gameState: 0,
                xTurns: [],
                oTurns: [],
                roomId: socket.request.session.user.roomId,
                xPlayer: {
                    socket: socket.id,
                    id: socket.request.session.user.id,
                    nickname: socket.request.session.user.nickname,
                    avatar: socket.request.session.user.avatar
                }
            });
        } else {
            let roomInfo = rooms.get(socket.request.session.user.roomId);

            if (roomInfo.oPlayer) return socket.disconnect;

            roomInfo.oPlayer = {
                socket: socket.id,
                id: socket.request.session.user.id,
                nickname: socket.request.session.user.nickname,
                avatar: socket.request.session.user.avatar
            };
            roomInfo.gameState = 1;
        }

        let roomInfo = rooms.get(socket.request.session.user.roomId);

        if (roomInfo.gameState === 1) {
            io.emit('gameStart', roomInfo);
            io.emit('firstTurn', roomInfo);
        }

        socket.on('move', async (moveInfo) => {
            const user = await User.findOne({
                id: socket.request.session.user.id
            });
            if (user.roomId !== roomInfo.roomId) {
                roomInfo.winner = roomInfo.xPlayer.socket === socket.id ? roomInfo.oPlayer.socket : roomInfo.xPlayer.socket;
                return io.emit('gameEnd', {
                    roomId: roomInfo.roomId,
                    winner: roomInfo.winner,
                    disconnected: socket.id
                });
            }

            if (![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(moveInfo)) return;
            if (socket.request.session.user.id !== roomInfo.xPlayer.id && socket.request.session.user.id !== roomInfo.oPlayer.id) return;
            if (roomInfo.xTurns.includes(moveInfo) || roomInfo.oTurns.includes(moveInfo)) return;
            if ((roomInfo.gameState === 1 && roomInfo.oPlayer.socket === socket.id) || (roomInfo.gameState === 2 && roomInfo.xPlayer.socket === socket.id)) return;

            if (roomInfo.gameState === 1) roomInfo.xTurns.push(moveInfo);
            else roomInfo.oTurns.push(moveInfo);

            io.emit('moveInfo', {
                move: moveInfo,
                gameState: roomInfo.gameState,
                roomId: socket.request.session.user.roomId
            });

            if (await checkWin(roomInfo.xTurns, winPositions)) {
                roomInfo.winner = roomInfo.xPlayer.socket;
                return io.emit('gameEnd', {
                    roomId: roomInfo.roomId,
                    winner: roomInfo.winner,
                    loser: socket.id
                });
            } else if (await checkWin(roomInfo.oTurns, winPositions)) {
                roomInfo.winner = roomInfo.oPlayer.socket;
                return io.emit('gameEnd', {
                    roomId: roomInfo.roomId,
                    winner: roomInfo.winner,
                    loser: socket.id
                });
            } else if (roomInfo.oTurns.length + roomInfo.xTurns.length === 9) {
                roomInfo.winner = roomInfo.oPlayer.socket;
                return io.emit('gameEnd', {
                    roomId: roomInfo.roomId,
                    winner: roomInfo.winner,
                    loser: socket.id
                });
            }

            if (roomInfo.gameState === 1) {
                roomInfo.gameState = 2;
                return io.emit('secondTurn', roomInfo);
            } else {
                roomInfo.gameState = 1;
                return io.emit('firstTurn', roomInfo);
            }
        });

        socket.on('disconnect', async () => {
            if (!roomInfo.winner && roomInfo.oPlayer) {
                let winner;

                if (roomInfo.xPlayer.socket === socket.id) {
                    winner = roomInfo.oPlayer.socket;
                } else {
                    winner = roomInfo.xPlayer.socket;
                }

                io.emit('gameEnd', {
                    roomId: roomInfo.roomId,
                    winner: winner,
                    disconnected: socket.id
                });
            }
            const room = await Room.findByIdAndRemove(socket.request.session.user.roomId);
            if (!room) return;

            for (const member of room.members) {
                const user = await User.findOne({
                    id: member
                });

                if (user.roomId === roomInfo.roomId) {
                    await User.findOneAndUpdate({
                        id: member
                    }, {
                        $set: {
                            roomId: null
                        }
                    });
                }
            }
        });
    });
}