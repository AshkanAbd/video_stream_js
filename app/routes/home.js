const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/AuthMiddleware');
const homeController = require('../controller/HomeController');
const Lives = require('../models/Lives');
const userModel = require('../models/User');

router.get('/broadcast', authMiddleware.auth, async (req, res) => {
    const users = await userModel.User.find().select({'username': 1});
    res.render('broadcast', {title: 'Broadcast', userList: users});
});

router.get('/watch/:live_id', authMiddleware.auth, async (req, res, next) => {
    let live;
    try {
        live = await Lives.findById(req.params.live_id);
        if (!live) {
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
        return res.render('finished', {title: 'Watch'});
    }
    res.render('watch', {title: 'Watch'});
});

router.get('/', authMiddleware.auth, (req, res) => homeController.index(req, res));

router.get('/invited', authMiddleware.auth, async (req, res) => {
    const username = req.user.username;
    const liveList = await Lives.find({"invited": username}).select({title: 1, owner: 1, finished: 1});
    const list = liveList.length !== 0 ? liveList : ['No Live for you'];
    res.render('invited', {title: 'Invited list', list: list});
});

module.exports = router;
