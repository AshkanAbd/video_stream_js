const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/AuthMiddleware');
const homeController = require('../controller/HomeController');

router.get('/broadcast', authMiddleware.auth, (req, res) => {
    res.render('broadcast', {title: 'Broadcast'});
});

router.get('/watch', authMiddleware.auth, (req, res) => {
    res.render('watch', {title: 'Watch'});
});

router.get('/', authMiddleware.auth, (req, res) => homeController.index(req, res));

module.exports = router;
