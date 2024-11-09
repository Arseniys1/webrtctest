const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId);
        });

        socket.on('offer', (offer, userId) => {
            socket.to(roomId).emit('offer', offer, userId);
        });

        socket.on('answer', (answer, userId) => {
            socket.to(roomId).emit('answer', answer, userId);
        });

        socket.on('ice-candidate', (candidate, userId) => {
            socket.to(roomId).emit('ice-candidate', candidate, userId);
        });
    });
});

server.listen(8443, '192.168.1.130', () => {
    console.log('listening on *:3000');
});