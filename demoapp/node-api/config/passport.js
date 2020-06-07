const jwtSecret = require('./jwtConfig');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

var users = [];

function findByEmail(email, fn) {
    console.log("inside find by email............");
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.email === email) {
            console.log(user.email);
            return fn(null, user);
        }
        return fn(null, user);
    }
    return fn(null, null);
}

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


passport.use(new SamlStrategy(
    {
        path: '/app/login/callback',
        entryPoint: 'https://login.microsoftonline.com/c643d250-0dd7-416f-889e-a93f0e4ef800/saml2',
        issuer: '27757783-5217-479e-b2f6-5e7b2b98d652'
    },
    function (profile, done) {
        console.log(profile)
        findByEmail(profile.email, function (err, user) {
            if (err) {
                console.log("Error.............");
                return done(err);
            }
            console.log("Returning..............");
            console.log(profile.nameID);
            return done(null, profile.nameID);
        });
    })
);

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: jwtSecret.secret,
};

passport.use(
    'jwt',
    new JWTstrategy(opts, (jwt_payload, done) => {
        try {
            User.findOne({
                where: {
                    id: jwt_payload.id,
                },
            }).then(user => {
                if (user) {
                    console.log('user found in db in passport');
                    done(null, user);
                } else {
                    console.log('user not found in db');
                    done(null, false);
                }
            });
        } catch (err) {
            done(err);
        }
    }),
);




