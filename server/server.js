const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {generateMessage, generateLocationMessage} = require('./utils/message');

const port = process.env.PORT || 8080;
const publicpath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicpath));

io.on('connection', (socket) => {
    console.log("New user connected");

    socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'));

    socket.on('createMessage', (message,callback) => {
        console.log('createMessage', message);

        io.emit('newMessage', generateMessage(message.from,message.text));
        callback();
    });

    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('User',coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log("User was disconnected");
    });
});

server.listen(8080, () => {
    console.log(`Server is up on port ${port}`);
});