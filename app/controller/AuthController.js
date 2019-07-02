const User = require('../models/User');
const bcrypt = require('bcrypt');
const config = require('config');

async function signInPost(req, res) {
    const {error} = User.signInValidator(req.body);
    if (error) {
        res.render('index', {sign_in_total_error: error.details[0].message});
        return;
    }
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({email: email});
    if (user === null) {
        res.render('index', {sign_in_email_not_exist: 'No such email'});
        return;
    }
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        res.render('index', {sign_in_invalid_password: 'Email or password is wrong'});
        return;
    }
    const token = user.addAuthToken();
    const options = {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30
    };
    res.cookie(config.get('auth_header'), token, options);
    res.redirect('/home');
}

async function createUser(req, res) {
    const {error} = User.signUpValidator(req.body);
    if (error) {
        res.render('index', {sign_up_total_error: error.details[0].message});
        return;
    }

    const username = req.body.username;
    const email = req.body.email;
    let password = req.body.password;
    const repassword = req.body.repassword;

    let user = await User.findOne({email: email});

    if (user) {
        res.render('index', {sign_up_email_exist: "Email exist in database"});
        return;
    }

    user = await User.findOne({username: username});

    if (user) {
        res.render('index', {sign_up_username_exist: "Username exist in database"});
        return;
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user = new User({username: username, email: email, password: password});
    await user.save();

    const token = user.addAuthToken();

    const options = {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30
    };
    res.cookie(config.get('auth_header'), token, options);
    res.redirect('/home');
}

function signOut(req, res) {
    res.clearCookie(config.get('auth_header'));
    res.redirect('/');
}

module.exports = {signInPost, createUser, signOut};