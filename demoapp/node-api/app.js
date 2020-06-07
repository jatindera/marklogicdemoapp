const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session')
const bodyParser = require('body-parser');
const passport = require('passport');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const searchRouter = require('./routes/search');
const cors = require('cors');
require('./config/passport');
const express = require('express');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//following three lines should be in sequence
app.use(session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//Routers
app.use('/app', indexRouter);
app.use('/app/users', usersRouter);
app.use('/app/login', loginRouter);
app.use('/app/logout', logoutRouter);
app.use('/app/search', searchRouter);

module.exports = app;
