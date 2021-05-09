module.exports = (io) => {
    io.sockets.on('connection', (socket) => {
        console.log('Connected!');
        console.log(socket.id);
        console.log(socket.request.session);
    });
}