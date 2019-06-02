import mongoose from 'mongoose';
import config from 'config';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

mongoose.connect('mongodb://localhost/video_stream', {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, minlength: 4, maxlength: 50, require: true},
    email: {type: String, unique: true, minlength: 4, maxlength: 255, require: true, email: true},
    password: {type: String, require: true, minlength: 6, maxlength: 1024}
});

const signUpSchema = {
    username: Joi.string().min(4).max(50).required(),
    email: Joi.string().min(4).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
    repassword: Joi.string().min(5).max(255).required(),
};

const signInSchema = {
    email: Joi.string().min(4).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
};

userSchema.methods.addAuthToken = function () {
    return jwt.sign({_id: this.id, username: this.username}, config.get('private_key'));
};

userSchema.methods.signUpValidator = (user) => {
    return Joi.validate(user, signUpSchema);
};

userSchema.methods.signInValidator = function (user) {
    return Joi.validate(user, signInSchema);
};

const User = mongoose.model('users', userSchema);

module.exports = User;
