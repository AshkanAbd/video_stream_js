const userModel = require('../models/User');
const bcrypt = require('bcrypt');
const config = require('config');

async function signInPost(req, res) {
    const {error} = userModel.validatorSignIn(req.body);
    if (error) {
        res.render('auth/sign_in', {title: 'Sign in', total_error: error.details[0].message});
        return;
    }
    const email = req.body.email;
    const password = req.body.password;
    const user = await userModel.User.findOne({email: email});
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
    const options = {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30
    };
    res.cookie(config.get('auth_header'), token, options);
    res.redirect('/home');
}

async function createUser(req, res) {
    const {error} = userModel.validatorSignUp(req.body);
    if (error) {
        res.render('auth/sign_up', {title: 'Sign in', total_error: error.details[0].message});
        return;
    }

    const username = req.body.username;
    const email = req.body.email;
    let password = req.body.password;
    const repassword = req.body.repassword;

    let user = await userModel.User.findOne({email: email});

    if (user) {
        res.render('auth/sign_up', {title: 'Sign up', email_exist: "Email exist in database"});
        return;
    }

    user = await userModel.User.findOne({username: username});

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

    const options = {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30
    };
    res.cookie(config.get('auth_header'), token, options);
    res.redirect('/home');
}

function signIn(req, res) {
    res.render('auth/sign_in', {title: 'Sign in'})
}

function signUp(req, res) {
    res.render('auth/sign_up', {title: 'Sign up'})
}

function signOut(req, res) {
    res.clearCookie(config.get('auth_header'));
    res.redirect('/');
}

module.exports = {signIn, signInPost, createUser, signUp, signOut};