'use strict'
document.addEventListener("DOMContentLoaded",async () => {
    const roomList = document.getElementById('roomList');
    const rooms = await fetch('/rooms/', {
        method: 'GET'
    }).then(res => res.json());
    for (const room of rooms) {
        if (room.members.length < 2) {
            const owner = await fetch(`/users/${room.owner}`, {
                method: 'GET'
            }).then(res => res.json());
            roomList.innerHTML += `<li><a href="/game/${room._id}">Room ID: ${room._id} Owner: ${owner.nickname}</a></li>`
        }
    }
});