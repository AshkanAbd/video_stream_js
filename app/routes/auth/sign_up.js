const express = require('express');
const router = express.Router();
const userModel = require('../../models/user');
const authMiddleware = require('../../middlewares/AuthMiddleware');
const bcrypt = require('bcrypt');
const config = require('config');


router.get('/', authMiddleware.guest, (req, res) => {
    res.render('auth/sign_up', {title: 'Sign up'})
});

router.post('/', authMiddleware.guest, async (req, res) => {
    const {error} = userModel.validatorSignUp(req.body);
    if (error) {
        res.render('auth/sign_up', {title: 'Sign in', total_error: error.details[0].message});
        return;
    }

    const username = req.body.username;
    const email = req.body.email;
    let password = req.body.password;
    const repassword = req.body.repassword;

    let user = await userModel.findUser(email);

    if (user) {
        res.render('auth/sign_up', {title: 'Sign up', email_exist: "Email exist in database"});
        return;
    }

    user = await userModel.findUserByUsername(username);

    if (user) {
        res.render('auth/sign_up', {title: 'Sign up', username_exist: "Username exist in database"});
        return;
    }


    if (password !== repassword) {
        res.render('auth/sign_up', {title: 'Sign up', password_error: "Password and repeat doesn't match"});
        return;
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user = await userModel.createUser(username, email, password);

    const token = user.addAuthToken();

    res.cookie(config.get('auth_header'), token, {expires: new Date(Date.now() + 60000), httpOnly: true});
    res.redirect('/home');
});

module.exports = router;