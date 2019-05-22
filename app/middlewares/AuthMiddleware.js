const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');

function auth(req, res, next) {
    const token = req.cookies[config.get('auth_header')];
    if (!token) {
        res.redirect('/');
        return;
    }
    try {
        const result = jwt.verify(token, config.get('private_key'));
        // const user = ;
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
        // const user = ;
        res.redirect('/home');
    } catch (e) {
        next();
    }
}

module.exports.auth = auth;
module.exports.guest = guest;
