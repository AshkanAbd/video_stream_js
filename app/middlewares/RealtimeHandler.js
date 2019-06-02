import jwt from 'jsonwebtoken';
import config from 'config';
import Lives from '../models/Lives';

function getCookie(name, cookie) {
    const found = cookie.split(';').filter(c => c.trim().split("=")[0] === name);
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

            const namespaceSocket = io.of(`/${lives._id}`);

            namespaceSocket.on('connection', function (socket1) {
                const cookies = socket1.handshake.headers.cookie;
                const token = getCookie(config.get('auth_header'), cookies);
                if (!token) return;
                const result = jwt.verify(token, config.get('private_key'));
                if (!result) return;

                socket1.broadcast.emit('msg', `${result.username} connected`);

                socket1.on('stream', (stream) => {
                    socket1.broadcast.emit('stream', stream);
                });

                socket1.on('close', async () => {
                    lives.finished = true;
                    await lives.save();
                });

                socket1.on('msg', (input) => {
                    const msg = `${result.username}: ${input.msg}`;
                    namespaceSocket.emit('msg', msg);
                });

                socket1.on('disconnect', () => {
                    socket1.broadcast.emit('msg', `${result.username} disconnected`);
                });
            });

            socket.emit('id', lives._id);
        });
    });
}

module.exports.inti = init;