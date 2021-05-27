'use strict'
document.addEventListener("DOMContentLoaded",async () => {
    const roomId = window.location.href.split('/')[window.location.href.split('/').length - 1];
    const result = await fetch(`/rooms/${roomId}`, {
        method: 'POST'
    }).then(res => res.json());
    if (!result.success) {
        window.location.href = 'http://127.0.0.1/game';
    } else {
        const socket = io.connect();
    }
});