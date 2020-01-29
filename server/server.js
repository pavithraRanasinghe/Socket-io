const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users');

const port = process.env.PORT || 8080;
const publicpath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicpath));

io.on('connection', (socket) => {
    console.log("New user connected");

    socket.on('join',(param,callback)=>{
        if (!isRealString(param.name) || !isRealString(param.room)){
            return callback('Name & Room name are required');
        }

        socket.join(param.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,param.name,param.room);

        io.to(param.room).emit('updateUserList',users.getUserList(param.room));
        socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));
        socket.broadcast.to(param.room).emit('newMessage', generateMessage('Admin',`${param.name} joined to room: ${param.room}`));

        callback();
    });

    socket.on('createMessage', (message,callback) => {
        var user = users.getUser(socket.id);

        if (user &&  isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name,message.text));
        }

        callback();
    });

    socket.on('createLocationMessage',(coords)=>{
        var user = users.getUser(socket.id);

        if (user){
            io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if (user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
        }
    });
});

server.listen(8080, () => {
    console.log(`Server is up on port ${port}`);
});