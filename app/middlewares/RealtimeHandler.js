const jwt = require('jsonwebtoken');
const config = require('config');
const Lives = require('../models/Lives');

function getCookie(name, cookie) {
    var found = cookie.split(';').filter(c => c.trim().split("=")[0] === name);
    return found.length > 0 ? found[0].split("=")[1] : null;
}

// Load socket IO and realtime chat
function init(io) {
    io.on('connection', (socket) => {
        socket.on('invited_users', async (msg) => {
            const cookies = socket.handshake.headers.cookie;
            const token = getCookie(config.get('auth_header'), cookies);
            if (!token) return;
            const result = jwt.verify(token, config.get('private_key'));
            if (!result) return;

            const lives = new Lives({owner: result.username, title: msg.title, invited: msg.invited, finished: false});
            await lives.save();

            socket.emit('id', lives._id);

            socket.on(`${lives._id}_stream`, (stream) => {
                socket.broadcast.emit(`${lives._id}_stream`, stream);
            });

            socket.on(`${lives._id}_msg`, (input) => {
                const cookies = socket.handshake.headers.cookie;
                const token = getCookie(config.get('auth_header'), cookies);
                if (!token) return;
                const result = jwt.verify(token, config.get('private_key'));
                if (!result) return;
                const msg = `${result.username}: ${input.msg}`;
                io.emit(`${lives._id}_msg`, msg);
            });
        });
    });
}

module.exports.inti = init;