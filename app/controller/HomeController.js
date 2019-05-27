function index(req, res) {
    res.render('home', {title: 'Home'});
}

function watch(req, res) {
    res.render('watch', {title: 'Watch'});
}

function broadcast(req, res) {
    res.render('broadcast', {title: 'Broadcast'});
}


module.exports = {index, watch, broadcast};
