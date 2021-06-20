'use strict'
let move;

document.addEventListener("DOMContentLoaded",async () => {
    const roomId = window.location.href.split('/')[window.location.href.split('/').length - 1];
    let move = 0;
    const body = await fetch(`/rooms/${roomId}`, {
        method: 'POST'
    }).then(res => res.json());
    if (!body.success) {
        window.location.href = 'http://127.0.0.1/game';
    } else {
        const socket = io.connect();
        socket.on('gameStart', (roomInfo) => {
            if (roomInfo.roomId !== roomId) return;

            if (roomInfo.xPlayer === socket.id) move = 1;
            else move = 2;

            document.addEventListener('click', (event) => {
                if (event.target.className === 'button') {
                    socket.emit('move', Number(event.target.innerHTML));
                }
            });
        });
        socket.on('firstTurn', (roomInfo) => {
            if (roomInfo.roomId !== roomId) return;

            if (move === roomInfo.gameState) {
                const buttons = document.getElementsByClassName('button');
                for (const button of buttons) button.removeAttribute('disabled');
            } else {
                const buttons = document.getElementsByClassName('button');
                for (const button of buttons) button.setAttribute('disabled', 'true');
            }
        });
        socket.on('secondTurn', (roomInfo) => {
            if (roomInfo.roomId !== roomId) return;

            if (move === roomInfo.gameState) {
                const buttons = document.getElementsByClassName('button');
                for (const button of buttons) button.removeAttribute('disabled');
            } else {
                const buttons = document.getElementsByClassName('button');
                for (const button of buttons) button.setAttribute('disabled', 'true');
            }
        });
        socket.on('moveInfo', (moveInfo) => {
            // TODO Fix class names and ids
            const element = document.getElementById(moveInfo.move);
            if (moveInfo.roomId === roomId) {
                if (moveInfo.gameState === 1) {
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
            window.location.href = 'http://127.0.0.1/game';
        });
        socket.on('disconnect', () => {
            window.location.href = 'http://127.0.0.1/game';
        });
    }
});