const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
require('dotenv').config();
const fs = require('fs');
var user = {};

function configure(profile, fn) {
    user = {
        assertionxml: profile.getAssertionXml(),
        email: profile.nameID
    }
    return fn(null, user);
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
        issuer: '27757783-5217-479e-b2f6-5e7b2b98d652',
        cert: fs.readFileSync('./certs/appserver-water-64.cer', 'utf-8')
    },
    function (profile, done) {
        configure(profile, function (err, user) {
            if (err) {
                console.log("Error.............");
                return done(err);
            }
            return done(null, user);
        });
    })
);

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: process.env.JWT_SECRET,
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




