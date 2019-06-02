const Lives = require('../models/Lives');
const User = require('../models/User');

async function broadcast(req, res) {
    const username = req.user.username;
    const users = await User.find({username: {$ne: username}}).select({'username': 1});
    res.render('broadcast', {title: 'Broadcast', userList: users, username: username});
}

async function watchLive(req, res, next) {
    const username = req.user.username;
    let live;
    try {
        live = await Lives.findById(req.params.live_id);
        if (!live) {
            res.status(404);
            next();
            return;
        }
        if (live.invited.indexOf(req.user.username) === -1) {
            res.status(404);
            next();
            return;
        }
    } catch (e) {
        res.status(404);
        next();
        return;
    }
    if (live.finished) {
        return res.render('finished', {title: 'Watch', username: username});
    }
    res.render('watch', {title: 'Watch', username: username});
}

async function invited(req, res) {
    const username = req.user.username;
    const liveList = await Lives.find({"invited": username}).select({title: 1, owner: 1, finished: 1});
    res.render('invited', {title: 'Invited list', list: liveList, error: 'No live video for you', username: username});
}

function home(req, res) {
    const username = req.user.username;
    res.render('home', {title: 'Home', username: username});
}

module.exports = {broadcast, watchLive, invited, home};
