$(function () {
    const socket = io();
    const receiveMsgEvent = `${window.location.pathname.split("/")[3]}_msg`;
    const sendMsgEvent = `_msg`;
    const streamEvent = `${window.location.pathname.split("/")[3]}_stream`;

    $('form').submit(function (e) {
        e.preventDefault();
        const input = $('#new_msg');
        const msg = {
            msg: input.val(),
            room: window.location.pathname.split("/")[3]
        };

        socket.emit(sendMsgEvent, msg);
        input.val('');
        return false;
    });
    socket.on(receiveMsgEvent, function (msg) {
        $('#messages').append($('<li>').text(msg));
    });

    socket.on(streamEvent, function (stream) {
        // const video = document.getElementById('video_player');
        // video.srcObject = stream;
        // video.play();

        var blob = new Blob([stream], {type: "video/webm"});
        const video = document.getElementById('video_player');
        video.src = window.URL.createObjectURL(blob);

    });
});