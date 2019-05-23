$(function () {
    const socket = io();
    socket.on('msg', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });
});