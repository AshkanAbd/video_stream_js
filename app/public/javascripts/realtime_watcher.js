$(function () {
    const socket = io();
    $('form').submit(function (e) {
        e.preventDefault();
        const input = $('#new_msg');
        const msg = {
            msg: input.val(),
            // auth: document.cookie
        };
        socket.emit(`${window.location.pathname.split("/")[3]}_msg`, msg);
        input.val('');
        return false;
    });
    socket.on(`${window.location.pathname.split("/")[3]}_msg`, function (msg) {
        $('#messages').append($('<li>').text(msg));
    });

    socket.on(`${window.location.pathname.split("/")[3]}_stream`, function (stream) {
        // const video = document.getElementById('video_player');
        // video.srcObject = stream;
        // video.play();

        var blob = new Blob([stream], {type: "video/webm"});
        const video = document.getElementById('video_player');
        video.src = window.URL.createObjectURL(blob);

    });
});