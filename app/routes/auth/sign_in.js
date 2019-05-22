const express = require('express');
const router = express.Router();
const userModel = require('../../models/user');

router.get("/", (req, res) => {
    if (req.get('auth') != null) {
        res.redirect('/home');
        return;
    }
    res.render('auth/sign_in', {title: 'Sign in'})
});

router.post('/', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findUser(email);

    if (user === null) {
        res.render('auth/sign_in', {title: 'Sign in', email_not_exist: 'No such email'});
        return;
    }
    if (user.password === password) {
        res.auth = user;

        res.redirect('/home');
        return;
    }
    res.render('auth/sign_in', {title: 'Sign in', invalid_password: 'Email or password is wrong'})
});

module.exports = router;