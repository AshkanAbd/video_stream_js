const express = require('express');
const authMiddleware = require('../middlewares/AuthMiddleware');

const router = express.Router();

router.get('/', authMiddleware.guest, (req, res) => {
    res.render('index', {title: 'Home'});
});

module.exports = router;
