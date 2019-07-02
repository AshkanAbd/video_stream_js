$(function () {
    const socket = io();
    $('#form').submit(function (e) {
        e.preventDefault();
        const title = $('#broadcast_title input:text').val();
        if (title === '') {
            alert('Title is empty!!!')
            return false;
        }
        navigator.getMedia = navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.moxGetUserMedia
            || navigator.mozGetUserMedia || navigator.msGetUserMedia;

        try {
            var constraints = {
                audio: true,
                video: {optional: [{Height: 540}, {minWidth: 960}]}
            };
            // navigator.getMedia(constraints, success, fails);
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
        $('.stream_info').remove();
        $('.watchers_chat').css({'visibility': 'visible'});
        socket.emit('invited_users', msg);
        let counter = 1;
        socket.on('id', (_id) => {

            const namespaceSocket = io(`/${_id}`);

            const mediaRecorder = new MediaRecorder(mediaStream);
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
            }, 100);

            namespaceSocket.on('msg', function (msg) {
                if (counter %2 === 1){
                    $('#messages').append($('<li class="broadcast_msg" style="color:green">').text(msg));
                }else{
                    $('#messages').append($('<li class="broadcast_msg" style="color:red">').text(msg));
                }
                counter++;
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
        alert("Browser doesn't support");
    }
});