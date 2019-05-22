const express = require('express');
const router = express.Router();
const userModel = require('../../models/user');
const authMiddleware = require('../../middlewares/AuthMiddleware');
const bcrypt = require('bcrypt');
const config = require('config');

router.get('/', authMiddleware.guest, (req, res) => {
    res.render('auth/sign_in', {title: 'Sign in'})
});

router.post('/', authMiddleware.guest, async (req, res) => {
    const {error} = userModel.validatorSignIn(req.body);
    if (error) {
        res.render('auth/sign_in', {title: 'Sign in', total_error: error.details[0].message});
        return;
    }
    const email = req.body.email;
    const password = req.body.password;
    const user = await userModel.findUser(email);
    if (user === null) {
        res.render('auth/sign_in', {title: 'Sign in', email_not_exist: 'No such email'});
        return;
    }
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        res.render('auth/sign_in', {title: 'Sign in', invalid_password: 'Email or password is wrong'});
        return;
    }
    const token = user.addAuthToken();
    // const token = jwt.sign({_id: user.id, username: user.username}, config.get('private_key'));
    res.cookie(config.get('auth_header'), token, {expires: new Date(Date.now() + 60000), httpOnly: true});
    res.redirect('/home');
});

module.exports = router;