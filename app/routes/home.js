var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    if (req.auth == null) {
        res.redirect('/');
        return;
    }
    res.render('home', {title: 'Home'});
});

module.exports = router;