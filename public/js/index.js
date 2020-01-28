var socket = io();

socket.on('connect',()=>{
    console.log("Connect to server") ;
});

socket.on('newMessage',(message)=>{
    console.log('New Message',message);

    var li = $('<li></li>');
    li.text(`${message.from} : ${message.text}`);
    $('#messages').append(li);
});

socket.on('newLocationMessage',(message)=>{
    var li = $('<li></li>');
    var a = $('<a target="_blank">My current location</a>')

    li.text(`${message.from}:`);
    a.attr('href',message.url);
    li.append(a);
    $('#messages').append(li);
});

socket.on('disconnect',()=>{
    console.log("Disconnected from server");
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage',{
        from: 'User',
        text: $('[name=message]').val()
    },function () {

    });
});

$('#location').on('click',function () {
    if (!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);

        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    },function () {
        alert("Something wrong")
    });
});