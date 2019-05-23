$(function () {
    const socket = io();
    $('form').submit(function (e) {
        e.preventDefault();
        const input = $('#new_msg');
        const msg = {
            msg: input.val(),
            // auth: document.cookie
        };
        socket.emit('msg', msg);
        input.val('');
        return false;
    });
    socket.on('msg', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });
});