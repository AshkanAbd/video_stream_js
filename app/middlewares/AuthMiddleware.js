const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

function auth(req, res, next) {
    const token = req.cookies[config.get('auth_header')];
    if (!token) {
        res.redirect('/');
        return;
    }
    try {
        const result = jwt.verify(token, config.get('private_key'));
        req.user = new User({_id: result._id, username: result.username});
        next();
    } catch (e) {
        res.redirect('/');
    }
}

function guest(req, res, next) {
    const token = req.cookies[config.get('auth_header')];
    if (!token) {
        next();
        return;
    }
    try {
        const result = jwt.verify(token, config.get('private_key'));
        req.user = new User({_id: result._id, username: result.username});
        res.redirect('/home');
    } catch (e) {
        next();
    }
}

module.exports = {auth, guest};
