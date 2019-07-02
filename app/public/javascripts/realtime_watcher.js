$(function () {
    const namespace = window.location.pathname.split("/")[3];
    const socket = io(`/${namespace}`);
    let counter = 1;

    $('form').submit(function (e) {
        e.preventDefault();
        const input = $('#new_msg');
        if (input.val() === ''){
            return false;
        }
        const msg = {
            msg: input.val(),
        };

        socket.emit('msg', msg);
        input.val('');
        return false;
    });
    socket.on('msg', function (msg) {
        if (counter %2 === 1){
            $('#messages_watch').append($('<li class="broadcast_msg" style="color:green">').text(msg));
        }else{
            $('#messages_watch').append($('<li class="broadcast_msg" style="color:red">').text(msg));
        }
        counter++;
    });

    socket.on('stream', function (stream) {
        var blob = new Blob([stream], {type: "video/webm"});
        const video = document.getElementById('video_player');
        video.src = window.URL.createObjectURL(blob);

    });
});