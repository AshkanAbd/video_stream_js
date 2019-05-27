$(function () {
    const socket = io();
    $('#form').submit(function (e) {
        e.preventDefault();
        navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;

        navigator.getMedia({
            video: true, audio: true
        }, success, fails);

//         var constraints = {video: true, audio: true};
//         navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
//             var mediaRecorder = new MediaRecorder(mediaStream);
//             const videoPlayer = document.getElementById('video_player');
//             videoPlayer.srcObject = mediaStream;
//             mediaRecorder.onstart = function (e) {
//                 this.chunks = [];
//             };
//             mediaRecorder.ondataavailable = function (e) {
//                 this.chunks.push(e.data);
//             };
//             mediaRecorder.onstop = function (e) {
//                 var blob = new Blob(this.chunks, {type: "video/webm"});
//                 socket.emit('live_stream', blob);
//             };
//
// // Start recording
//             mediaRecorder.start();
//
// // Stop recording after 5 seconds and broadcast it to server
//             setInterval(function () {
//                 mediaRecorder.stop();
//                 mediaRecorder.start()
//             }, 1000);
//         });

        return false;
    });

    function success(stream) {
        const selectedUsers = [];
        $('#user_checkboxes input:checked').each(function () {
            selectedUsers.push($(this).attr('name'));
        });
        const title = $('#broadcast_title input:text').val();
        const msg = {title: title, invited: selectedUsers};
        socket.emit('invited_users', msg);

        socket.on('id', (_id) => {
            const videoPlayer = document.getElementById('video_player');
            videoPlayer.srcObject = stream;
            const mediaRecorder = new MediaStreamRecorder(stream);
            mediaRecorder.mimeType = 'video/mp4';
            mediaRecorder.ondataavailable = function (blob) {
                mediaRecorder.onStartedDrawingNonBlankFrames();
                socket.emit(`${_id}_stream`, blob);
            };
            mediaRecorder.start(500);

            socket.on(`${_id}_msg`, function (msg) {
                $('#messages').append($('<li>').text(msg));
            });
        });
    }

    function fails(err) {
        alert("Can't access media devices");
    }


});