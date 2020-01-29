var socket = io();

function scrollToBottom() {
    const messages = $('#messages');
    const newMessage = messages.children('li:last-child');

    const clientHeight = messages.prop('clientHeight');
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    if (scrollTop + clientHeight + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', () => {
    const param = $.deparam(window.location.search);

    socket.emit('join',param,function (err) {
       if (err){
            alert(err);
            window.location.href = './';
       }else{
            console.log('No error');
       }
    });
});

socket.on('updateUserList',(users)=>{
    const ol = $('<ol></ol>');

    users.forEach((user)=>{
       ol.append($('<li></li>').text(user));
    });
    $('#users').html(ol);
});

socket.on('newMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('hh:mm:a');
    const template = $('#message-template').html();
    const html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('hh:mm:a');
    const template = $('#location-message-template').html();
    const html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
});

socket.on('disconnect', () => {
    console.log("Disconnected from server");
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();

    const textBox = $('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: textBox.val()
    }, function () {
        return textBox.val('');
    });
});

const locationButton = $('#location');

locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending Location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        $('#location').removeAttr('disabled').text('Send Location');

        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {

        alert("Something wrong")
    });
});