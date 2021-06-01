'use strict'
async function updateProfile () {
    const body = await fetch('/users/update', {
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
            roomList.innerHTML += `<li class="list__item"><a href="/game/${room._id}">Room ID: ${room._id} Owner: ${owner.nickname}</a></li>`
        }
    }
});