'use strict'
let turn;

document.addEventListener("DOMContentLoaded",async () => {
    const roomId = window.location.href.split('/')[window.location.href.split('/').length - 1];
    const body = await fetch(`/rooms/${roomId}`, {
        method: 'POST'
    }).then(res => res.json());
    if (!body.success) {
        window.location.href = 'http://127.0.0.1/game';
    } else {
        const socket = io.connect();
        socket.on('connect', () => {
            console.log(socket.id)
        });
        socket.on('gameStart', (data) => {
            console.log('gameStart!');
            console.log(data)
           if (data[0].socketId === socket.id) turn = data[0].turn;
           else if (data[1].socketId === socket.id) turn = data[1].turn;
           document.addEventListener('click', (event) => {
                if (event.target.className === 'button') {
                    socket.emit('turn', event.target.innerHTML);
                }
            });
        });
        socket.on('firstTurn', () => {
            console.log('firstTurn!')
            console.log(turn)
            if (turn === 1) {
                const buttons = document.getElementsByClassName('button');
                for (const button of buttons) button.removeAttribute('disabled');
            } else {
                const buttons = document.getElementsByClassName('button');
                for (const button of buttons) button.setAttribute('disabled', 'true');
            }
        });
        socket.on('secondTurn', () => {
            console.log('secondTurn!')
            if (turn === 2) {
                const buttons = document.getElementsByClassName('button');
                for (const button of buttons) button.removeAttribute('disabled');
            } else {
                const buttons = document.getElementsByClassName('button');
                for (const button of buttons) button.setAttribute('disabled', 'true');
            }
        });
        socket.on('turnInfo', (data) => {
            // TODO Fix class names and ids
            const element = document.getElementById(data.turn);
            if (data.socketId === socket.id) {
                element.innerHTML = 'X';
            } else {
                element.innerHTML = 'O';
            }
            element.classList.remove('button');
            element.setAttribute('disabled', 'true');
        });
        socket.on('disconnect', () => {
            console.log('disconnect!');
            // TODO Redirect to main page
        })
    }
});
// Remove all debug console.log after finishing