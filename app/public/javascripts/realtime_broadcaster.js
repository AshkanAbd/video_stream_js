$(function () {
    const socket = io();
    $('#form').submit(function (e) {
        e.preventDefault();
        navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;

        // navigator.getMedia({
        //     video: true, audio: true
        // }, success, fails);

        try {
            var constraints = {video: true, audio: true};
            navigator.mediaDevices.getUserMedia(constraints).then(success).catch(fails);
        } catch (e) {
            browserError();
        }
        return false;
    });

    function success(mediaStream) {
        const selectedUsers = [];
        $('#user_checkboxes input:checked').each(function () {
            selectedUsers.push($(this).attr('name'));
        });
        const title = $('#broadcast_title input:text').val();
        const msg = {title: title, invited: selectedUsers};
        socket.emit('invited_users', msg);

        socket.on('id', (_id) => {

            const namespaceSocket = io(`/${_id}`);

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
                namespaceSocket.emit('stream', blob);
            };

            mediaRecorder.start();

            setInterval(function () {
                mediaRecorder.stop();
                mediaRecorder.start()
            }, 500);

            namespaceSocket.on('msg', function (msg) {
                $('#messages').append($('<li>').text(msg));
            });

            $(window).bind('beforeunload', function () {
                namespaceSocket.emit('close');
            });

        });
    }

    function fails(err) {
        alert("Can't access media devices");
    }

    function browserError() {
        alert("Browser does'nt support");
    }
});