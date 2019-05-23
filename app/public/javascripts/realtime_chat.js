$(function () {
    const socket = io();
    $('form').submit(function (e) {
        e.preventDefault();
        const msg_input = $('#new_msg');
        socket.emit('msg', msg_input.val());
        msg_input.val('');
        return false;
    });
    socket.on('msg', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });
});