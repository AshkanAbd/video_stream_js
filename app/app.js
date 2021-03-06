const config = require('config');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const appDebugger = require('debug')('app:app');

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);
const chatSetup = require('./middlewares/RealtimeHandler');

// Load socket io
chatSetup.inti(io);

// Load routes
const rootRouter = require('./routes');
const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth/auth');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set middle wares
app.use(morgan(config.get("log_level")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Define routes
app.use('/', rootRouter);
app.use('/account', authRouter);
app.use('/home', homeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {title: 'Error', errorCode: `Error : ${err.status}`});
});

const port = config.get("port");
http.listen(port);
appDebugger(`Port: ${port}`);
console.log(`Check: http://localhost:${port}/`);
