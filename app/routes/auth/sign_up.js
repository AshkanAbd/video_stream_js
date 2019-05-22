const express = require('express');
const router = express.Router();
const userModel = require('../../models/user');

router.get("/", (req, res) => {
    if (req.get('auth') != null) {
        res.redirect('/home');
        return;
    }
    res.render('auth/sign_up', {title: 'Sign up'})
});

router.post('/', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const repassword = req.body.repassword;

    if (password.length < 6) {
        res.render('auth/sign_up', {title: 'Sign up', password_error: "Too short password"});
        return;
    }
    if (password !== repassword) {
        res.render('auth/sign_up', {title: 'Sign up', password_error: "Password and repeat deosn't match"});
        return;
    }

    const user = await userModel.createUser(username, email, password);

    res.auth = user;

    res.redirect('/home');
});

module.exports = router;