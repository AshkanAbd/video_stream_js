$(function () {
    const namespace = window.location.pathname.split("/")[3];
    const socket = io(`/${namespace}`);

    $('form').submit(function (e) {
        e.preventDefault();
        const input = $('#new_msg');
        const msg = {
            msg: input.val(),
        };

        socket.emit('msg', msg);
        input.val('');
        return false;
    });
    socket.on('msg', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });

    socket.on('stream', function (stream) {
        var blob = new Blob([stream], {type: "video/webm"});
        const video = document.getElementById('video_player');
        video.src = window.URL.createObjectURL(blob);

    });
});