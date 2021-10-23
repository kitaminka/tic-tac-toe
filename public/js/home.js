'use strict'
async function updateProfile () {
    const body = await fetch('/users/update', {
        method: 'GET'
    }).then(res => res.json());
    if (body.success) return location.reload();
}
function joinRoom(roomId) {
    location.href = `/game/${roomId}`;
}
async function signOut() {
    const body = await fetch('/users/signout', {
        method: 'GET'
    }).then(res => res.json());
    if (body.success) return location.reload();
}
document.addEventListener("DOMContentLoaded",async () => {
    const roomList = document.getElementById('roomList');
    const body = await fetch('/rooms/', {
        method: 'GET'
    }).then(res => res.json());
    for (const room of body.result) {
        if (room.members.length < 2) {
            const body = await fetch(`/users/${room.owner}`, {
                method: 'GET'
            }).then(res => res.json());
            const owner = body.result;
            roomList.innerHTML += `<div class="room-list__room" onclick="joinRoom('${room._id}')"><p class="room__info">Room ID: ${room._id}<br>Owner: ${owner.nickname}</p></div>`;
        }
    }
});