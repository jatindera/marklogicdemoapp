const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtSecret = require('./../config/jwtConfig');
const decoder = require('saml-encoder-decoder-js');
const bodyParser = require('body-parser')
const passport = require('passport');
parseString = require("xml2js").parseString,
stripPrefix = require("xml2js").processors.stripPrefix;
const expiration = process.env.DB_ENV === 'testing' ? 100 : '24h';


router.get('/',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  (req, res) => {
    res.redirect('/app');
  }
);

router.post('/callback',
  bodyParser.urlencoded({ extended: false }),
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  (req, res) => {
    const samlToken = req.body.SAMLResponse;
    console.log(samlToken);
    decoder.decodeSamlPost(samlToken, (err, samlToken) => {
      if (err) {
        throw new Error(err);
      } else {
        parseString(samlToken, { tagNameProcessors: [stripPrefix] }, function (err, result) {
          if (err) {
            throw err;
          } else {
            //sign token
            token = jwt.sign({ id: "nameID", samlToken: samlToken }, jwtSecret.secret, {
              expiresIn: expiration //other configuration options
            });
            console.log(token);
          }
        });
      }
    })

    res.redirect('/app');
  }
);



module.exports = router;
