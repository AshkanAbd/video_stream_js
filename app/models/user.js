const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/video_stream');

const userScheme = {
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: String,
    date: {type: Date, default: Date.now()}
};

const User = mongoose.model('users', userScheme);


function findUser(email) {
    return User.findOne({email: email});
}

function createUser(username, email, password) {
    const user = new User({
        username: username,
        email: email,
        password: password
    });
    user.save();
}


module.exports = {User, findUser, createUser};
