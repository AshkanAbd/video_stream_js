var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    if (req.auth != null) {
        res.redirect('/home');
        return;
    }
    res.render('index', {title: 'Home'});
});

module.exports = router;
