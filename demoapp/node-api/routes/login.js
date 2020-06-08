const express = require('express');
const router = express.Router();
var signToken = require('../helper/signToken');
var userADGroups = require('../helper/userADGroups');
const assignRoles = require('../helper/assignRoles');
const bodyParser = require('body-parser')
const passport = require('passport');


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
    if(samlToken===null || samlToken===""){
      res.status(401).send('Not a valid SAML Token. Please contact admin.');
    }
    // console.log(req.user);
    var user = req.user;
    var assertionToken = req.user.assertionxml;
    userADGroups = userADGroups(assertionToken);
    if(userADGroups.length<=0){
      res.status(401).send('User is not part of any AD group. Please contact admin.');
      return;
    }
    var userLevel = assignRoles(userADGroups);
    if(userLevel<=0){
      res.status(401).send('User is not part of any App specific AD group. Please contact admin.');
      return;
    }
    user.userADGroups = userADGroups;
    user.samlToken = samlToken;
    user.role = userLevel;
    var signedToken = signToken(user);
    // console.log(signedToken);
    res.redirect('/app');
  }
);

module.exports = router;
