var socket = io();

socket.on('connect',()=>{
    console.log("Connect to server") ;
});

socket.on('newMessage',(message)=>{
    const formattedTime = moment(message.createdAt).format('hh:mm:a');
    const template = $('#message-template').html();
    const html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    $('#messages').append(html);
});

socket.on('newLocationMessage',(message)=>{
    const formattedTime = moment(message.createdAt).format('hh:mm:a');
    const template = $('#location-message-template').html();
    const html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    $('#messages').append(html);

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