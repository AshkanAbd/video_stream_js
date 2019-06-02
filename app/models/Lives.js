import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/video_stream', {useNewUrlParser: true});

const Lives = mongoose.model('lives', new mongoose.Schema({
    title: {type: String, require: true},
    owner: {type: String, require: true},
    invited: {type: Array, require: true},
    finished: {type: Boolean, require: true}
}));

module.exports = Lives;