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

    const textBox =$('[name=message]');

    socket.emit('createMessage',{
        from: 'User',
        text: textBox.val()
    },function () {
        return textBox.val('');
    });
});

const locationButton = $('#location');

locationButton.on('click',function () {
    if (!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled','disabled').text('Sending Location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        $('#location').removeAttr('disabled').text('Send Location');

        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    },function () {

        alert("Something wrong")
    });
});