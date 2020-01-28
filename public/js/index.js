var socket = io();

socket.on('connect',()=>{
    console.log("Connect to server") ;
});

socket.emit('createMessage',{
    from : 'Client',
    text : 'Message from client'
});

socket.on('newMessage',(message)=>{
    console.log('New Message',message);
});

socket.on('disconnect',()=>{
    console.log("Disconnected from server");
});