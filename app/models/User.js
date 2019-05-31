const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

mongoose.connect('mongodb://localhost/video_stream', {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, minlength: 4, maxlength: 50, require: true},
    email: {type: String, unique: true, minlength: 4, maxlength: 255, require: true, email: true},
    password: {type: String, require: true, minlength: 6, maxlength: 1024}
});

userSchema.methods.addAuthToken = function () {
    return jwt.sign({_id: this.id, username: this.username}, config.get('private_key'));
};

const User = mongoose.model('users', userSchema);

async function createUser(username, email, password) {
    const user = new User({
        username: username,
        email: email,
        password: password
    });
    await user.save();
    return user;
}

function validatorSignUp(user) {
    const schema = {
        username: Joi.string().min(4).max(50).required(),
        email: Joi.string().min(4).max(255).email().required(),
        password: Joi.string().min(5).max(255).required(),
        repassword: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(user, schema);
}

function validatorSignIn(user) {
    const schema = {
        email: Joi.string().min(4).max(255).email().required(),
        password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(user, schema);
}

module.exports = {User, createUser, validatorSignIn, validatorSignUp};
