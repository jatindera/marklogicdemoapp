var express = require('express');
var router = express.Router();

router.get('/app/logout', (req, res) => {
  if (req.user == null) {
     return res.redirect('/app/home');
  }

  return strategy.logout(req, (err, uri) => {
      req.logout();
      userProfile = null;
      return res.redirect(uri);
  });
});

module.exports = router;
