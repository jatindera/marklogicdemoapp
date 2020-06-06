var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
session = require('express-session')

var passport = require('passport');
var saml = require('passport-saml').Strategy;
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors');
var userProfile;
const expiration = process.env.DB_ENV === 'testing' ? 100 : 604800000;

var fs = require('fs');
var express = require('express');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(cookieParser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// saml strategy for passport
var strategy = new saml(
    {
        entryPoint: "https://login.microsoftonline.com/c643d250-0dd7-416f-889e-a93f0e4ef800/saml2",
        issuer: "27757783-5217-479e-b2f6-5e7b2b98d652",
        protocol: "http",
        logoutUrl: "https://127.0.0.1:5000/logout"
    },
    (profile, done) => {
        userProfile = profile;
        done(null, userProfile);
    }
);

passport.use(strategy);

var redirectToLogin = (req, res, next) => {
    if (!req.isAuthenticated() || userProfile == null) {
        return res.redirect('https://myapps.microsoft.com/signin/appserver-water/27757783-5217-479e-b2f6-5e7b2b98d652?tenantId=c643d250-0dd7-416f-889e-a93f0e4ef800');
    }
    next();
};

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.get('/app', redirectToLogin, (req, res) => {
    const samlToken = req.cookies.samlToken || '';
    try {
        if (!samlToken) {
            return res.status(401).json('Unable to fetch token from cookies')
        }
    } catch (err) {
        return res.status(500).json(err.toString());
    }
    res.render('index', {
        title: 'Express Web Application',
        heading: samlToken
    });
});

// app.get(
//     '/app/login',
//     passport.authenticate('saml', {
//         successRedirect: '/app',
//         failureRedirect: '/app/login'
//     })
// );


app.get('/app/logout', (req, res) => {
    if (req.user == null) {
        return res.redirect('/app/home');
    }

    return strategy.logout(req, (err, uri) => {
        req.logout();

        userProfile = null;
        return res.redirect(uri);
    });
});

app.get('/app/failed', (req, res) => {
    res.status(401).send('Login failed');
});

app.post(
    '/app/login',
    passport.authenticate('saml', {
        failureRedirect: '/app/failed',
        failureFlash: true
    }),
    (req, res) => {

        // saml assertion extraction from saml response
        var samlToken = res.req.body.SAMLResponse;
        console.log(samlToken);
        // var decoded = base64decode(samlResponse);
        // var assertion =
        // 	('<saml2:Assertion' + decoded.split('<saml2:Assertion')[1]).split(
        // 		'</saml2:Assertion>'
        // 	)[0] + '</saml2:Assertion>';
        // var urlEncoded = base64url(assertion);
        // success redirection to /app
        res.cookie('samlToken', samlToken, {
            expires: new Date(Date.now() + expiration),
            secure: true, // set to true if your using https
            httpOnly: true,
        });
        return res.redirect('/app');
    }
);

app.post('/app/home', (req, res) => {
    res.render('home', {
        title: 'Express Web Application',
        heading: 'Express Web Application'
    });
});

app.get('/app/home', (req, res) => {
    res.render('home', {
        title: 'Express Web Application',
        heading: 'Express Web Application'
    });
});
module.exports = app;
