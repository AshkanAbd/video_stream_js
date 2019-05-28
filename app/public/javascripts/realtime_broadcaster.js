$(function () {
    const socket = io();
    $('#form').submit(function (e) {
        e.preventDefault();
        navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;

        // navigator.getMedia({
        //     video: true, audio: true
        // }, success, fails);

        var constraints = {video: true, audio: true};
        navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {

            const selectedUsers = [];
            $('#user_checkboxes input:checked').each(function () {
                selectedUsers.push($(this).attr('name'));
            });
            const title = $('#broadcast_title input:text').val();
            const msg = {title: title, invited: selectedUsers};
            socket.emit('invited_users', msg);

            socket.on('id', (_id) => {

                const streamEvent = `${_id}_stream`;
                const msgEvent = `${_id}_msg`;
                const closeEvent = `${_id}_close`;

                var mediaRecorder = new MediaRecorder(mediaStream);
                const videoPlayer = document.getElementById('video_player');
                videoPlayer.srcObject = mediaStream;
                mediaRecorder.onstart = function (e) {
                    this.chunks = [];
                };
                mediaRecorder.ondataavailable = function (e) {
                    this.chunks.push(e.data);
                };
                mediaRecorder.onstop = function (e) {
                    var blob = new Blob(this.chunks, {type: "video/webm"});
                    socket.emit(streamEvent, blob);
                };

                mediaRecorder.start();

                setInterval(function () {
                    mediaRecorder.stop();
                    mediaRecorder.start()
                }, 500);

                socket.on(msgEvent, function (msg) {
                    $('#messages').append($('<li>').text(msg));
                });

                $(window).bind('beforeunload', function () {
                    socket.emit(closeEvent);
                });

            });


        }).catch(fails);

        return false;
    });

    // function success(stream) {
    //     const selectedUsers = [];
    //     $('#user_checkboxes input:checked').each(function () {
    //         selectedUsers.push($(this).attr('name'));
    //     });
    //     const title = $('#broadcast_title input:text').val();
    //     const msg = {title: title, invited: selectedUsers};
    //     socket.emit('invited_users', msg);
    //
    //     socket.on('id', (_id) => {
    //         const videoPlayer = document.getElementById('video_player');
    //         videoPlayer.srcObject = stream;
    //         const mediaRecorder = new MediaStreamRecorder(stream);
    //         mediaRecorder.mimeType = 'video/mp4';
    //
    //         const streamEvent = `${_id}_stream`;
    //         const msgEvent = `${_id}_msg`;
    //         const closeEvent = `${_id}_close`;
    //
    //         mediaRecorder.ondataavailable = function (blob) {
    //             mediaRecorder.onStartedDrawingNonBlankFrames();
    //             socket.emit(streamEvent, blob);
    //         };
    //         mediaRecorder.start(500);
    //
    //         socket.on(msgEvent, function (msg) {
    //             $('#messages').append($('<li>').text(msg));
    //         });
    //
    //         $(window).bind('beforeunload', function () {
    //             socket.emit(closeEvent);
    //         });
    //     });
    // }

    function fails(err) {
        alert("Can't access media devices");
    }
});