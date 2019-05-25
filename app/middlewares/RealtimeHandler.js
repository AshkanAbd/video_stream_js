const jwt = require('jsonwebtoken');
const config = require('config');

function getCookie(name, cookie) {
    var found = cookie.split(';').filter(c => c.trim().split("=")[0] === name);
    return found.length > 0 ? found[0].split("=")[1] : null;
}

// Load socket IO and realtime chat
function init(io) {
    io.on('connection', (socket) => {
        socket.on('msg', (input) => {
            const cookies = socket.handshake.headers.cookie;
            const token = getCookie(config.get('auth_header'), cookies);
            if (!token) return;
            const result = jwt.verify(token, config.get('private_key'));
            if (!result) return;
            const msg = `${result.username}: ${input.msg}`;
            io.emit('msg', msg);
        });

        socket.on('live_stream', (stream) => {
            socket.broadcast.emit('live_stream', stream);
        })
    });
}

module.exports.inti = init;