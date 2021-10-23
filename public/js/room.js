'use strict'
let move;

document.addEventListener("DOMContentLoaded",async () => {
    const roomId = window.location.href.split('/')[window.location.href.split('/').length - 1];
    let move = 0;
    const body = await fetch(`/rooms/${roomId}`, {
        method: 'POST'
    }).then(res => res.json());
    if (!body.success) {
        window.location.pathname = '/game';
    } else {
        const socket = io.connect();
        socket.on('gameStart', (roomInfo) => {
            if (roomInfo.roomId !== roomId) return;

            const nicknameElement = document.getElementById('nickname');
            const avatarElement = document.getElementById('avatar');

            if (roomInfo.xPlayer.socket === socket.id) {
                move = 1;
                if (roomInfo.oPlayer.avatar !== null) {
                    avatarElement.src = `https://cdn.discordapp.com/avatars/${roomInfo.oPlayer.id}/${roomInfo.oPlayer.avatar}`;
                    avatarElement.classList.add('user__avatar-circle');
                }
                nicknameElement.innerHTML = roomInfo.oPlayer.nickname;
            }
            else {
                move = 2;
                if (roomInfo.xPlayer.avatar !== null) {
                    avatarElement.src = `https://cdn.discordapp.com/avatars/${roomInfo.xPlayer.id}/${roomInfo.xPlayer.avatar}`;
                    avatarElement.classList.add('user__avatar-circle');
                }
                nicknameElement.innerHTML = roomInfo.xPlayer.nickname;
            }

            document.addEventListener('click', (event) => {
                if (event.target.className === 'field__button') {
                    socket.emit('move', Number(event.target.id));
                }
            });
        });
        socket.on('firstTurn', (roomInfo) => {
            if (roomInfo.roomId !== roomId) return;

            if (move === roomInfo.gameState) {
                const buttons = document.getElementsByClassName('field__button');
                for (const button of buttons) {
                    button.classList.add('field__button-active');
                    button.classList.remove('field__button-disabled');
                    button.removeAttribute('disabled');
                }
            } else {
                const buttons = document.getElementsByClassName('field__button');
                for (const button of buttons) {
                    button.classList.remove('field__button-active');
                    button.classList.add('field__button-disabled');
                    button.setAttribute('disabled', 'true');
                }
            }
        });
        socket.on('secondTurn', (roomInfo) => {
            if (roomInfo.roomId !== roomId) return;

            if (move === roomInfo.gameState) {
                const buttons = document.getElementsByClassName('field__button');
                for (const button of buttons) {
                    button.classList.add('field__button-active');
                    button.classList.remove('field__button-disabled');
                    button.removeAttribute('disabled');
                }
            } else {
                const buttons = document.getElementsByClassName('field__button');
                for (const button of buttons) {
                    button.classList.remove('field__button-active');
                    button.classList.add('field__button-disabled');
                    button.setAttribute('disabled', 'true');
                }
            }
        });
        socket.on('moveInfo', (moveInfo) => {
            const element = document.getElementById(moveInfo.move);
            if (moveInfo.roomId === roomId) {
                if (moveInfo.gameState === 1) {
                    element.innerHTML = 'X';
                } else {
                    element.innerHTML = 'O';
                }
                element.classList.remove('field__button-active');
                element.classList.add('field__button-disabled');
                element.setAttribute('disabled', 'true');
            }
        });
        socket.on('gameEnd', (endInfo) => {
           if (endInfo.winner === socket.id) {
               alert('You won!');
           } else {
               alert('You lose!');
           }
            window.location.pathname = '/game';
        });
        socket.on('disconnect', () => {
            window.location.pathname = '/game';
        });
    }
});