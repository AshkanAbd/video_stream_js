const express = require('express');
const authMiddleware = require('../middlewares/AuthMiddleware');
const homeController = require('../controller/HomeController');

const router = express.Router();

router.get('/broadcast', authMiddleware.auth, async (req, res) => homeController.broadcast(req, res));

router.get('/watch/:live_id', authMiddleware.auth, async (req, res, next) => homeController.watchLive(req, res, next));

router.get('/', authMiddleware.auth, (req, res) => homeController.home(req, res));

router.get('/invited', authMiddleware.auth, async (req, res) => homeController.invited(req, res));

module.exports = router;
