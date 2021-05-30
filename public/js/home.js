'use strict'
async function updateProfile () {
    const result = await fetch('/users/update', {
        method: 'GET'
    }).then(res => res.json());
    if (result.success) return location.reload();
}
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
            roomList.innerHTML += `<li class="list__item"><a href="/game/${room._id}">Room ID: ${room._id} Owner: ${owner.nickname}</a></li>`
        }
    }
});