const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/AuthMiddleware');

router.get('/', authMiddleware.guest, (req, res) => {
    res.render('index', {title: 'Home'});
});

module.exports = router;
