const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/AuthMiddleware');
const authController = require('../../controller/AuthController');

router.get('/sign_in', authMiddleware.guest, (req, res) => authController.signIn(req, res));

router.post('/sign_in', authMiddleware.guest, async (req, res) => authController.signInPost(req, res));

router.get('/sign_up', authMiddleware.guest, (req, res) => authController.signUp(req, res));

router.post('/sign_up', authMiddleware.guest, async (req, res) => authController.createUser(req, res));

router.get('/sign_out', authMiddleware.auth, (req, res) => authController.signOut(req, res));

module.exports = router;