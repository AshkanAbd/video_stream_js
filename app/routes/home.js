const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/AuthMiddleware');

router.get('/', authMiddleware.auth, (req, res) => {
    res.render('home', {title: 'Home'});
});

module.exports = router;