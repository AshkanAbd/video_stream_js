const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/AuthMiddleware');
const authController = require('../../controller/AuthController');

router.get('/', authMiddleware.guest, (req, res) => authController.signUp(req, res));

router.post('/', authMiddleware.guest, async (req, res) => authController.createUser(req, res));

module.exports = router;