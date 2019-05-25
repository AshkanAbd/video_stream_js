$(function () {
    const socket = io();
    socket.on('msg', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });
    $('#form').submit(function (e) {
        e.preventDefault();
        navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;

        const videoPlayer = document.getElementById('video_player');

        navigator.getMedia({
            video: true, audio: true
        }, function (stream) {
            videoPlayer.srcObject = stream;
            videoPlayer.play()
        }, function (err) {
            alert("Can't access media devices");
        });

        return false;
    })
});