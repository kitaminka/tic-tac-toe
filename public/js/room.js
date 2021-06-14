'use strict'
let turn;

document.addEventListener("DOMContentLoaded",async () => {
    const roomId = window.location.href.split('/')[window.location.href.split('/').length - 1];
    let turn = 0;
    const body = await fetch(`/rooms/${roomId}`, {
        method: 'POST'
    }).then(res => res.json());
    if (!body.success) {
        window.location.href = 'http://127.0.0.1/game';
    } else {
        const socket = io.connect();
        socket.on('connect', () => {
            console.log(socket.id);
        });
        socket.on('gameStart', (roomInfo) => {
            console.log('gameStart!');
            console.log(roomInfo)
            if (roomInfo.roomId !== roomId) return;

            if (roomInfo.xPlayer === socket.id) turn = 1;
            else turn = 2;

            document.addEventListener('click', (event) => {
                if (event.target.className === 'button') {
                    socket.emit('turn', event.target.innerHTML);
                }
            });
        });
        socket.on('firstTurn', (roomInfo) => {
            if (roomInfo.roomId !== roomId) return;
            console.log(turn);

            console.log('firstTurn!');
            if (turn === roomInfo.gameState) {
                const buttons = document.getElementsByClassName('button');
                for (const button of buttons) button.removeAttribute('disabled');
            } else {
                const buttons = document.getElementsByClassName('button');
                for (const button of buttons) button.setAttribute('disabled', 'true');
            }
        });
        socket.on('secondTurn', (roomInfo) => {
            if (roomInfo.roomId !== roomId) return;
            console.log(turn);
            console.log('secondTurn!');
            if (turn === roomInfo.gameState) {
                const buttons = document.getElementsByClassName('button');
                for (const button of buttons) button.removeAttribute('disabled');
            } else {
                const buttons = document.getElementsByClassName('button');
                for (const button of buttons) button.setAttribute('disabled', 'true');
            }
        });
        socket.on('turnInfo', (turnInfo) => {
            // TODO Fix class names and ids
            const element = document.getElementById(turnInfo.turn);
            if (turnInfo.roomId === roomId) {
                if (turnInfo.gameState === 1) {
                    element.innerHTML = 'X';
                } else {
                    element.innerHTML = 'O';
                }
                element.classList.remove('button');
                element.setAttribute('disabled', 'true');
            }
        });
        socket.on('gameEnd', (endInfo) => {
           if (endInfo.winner === socket.id) {
               alert('You won!');
           } else {
               alert('You lose!');
           }
        });
        socket.on('disconnect', () => {
            window.location.href = 'http://127.0.0.1/game';
        });
    }
});
// TODO Remove all debug console.log after finishing