var express = require('express');
var router = express.Router();

router.get('/',  (req, res, next) => {
  res.render('error',
    {
      msg: ""
    }
  )
});

module.exports = router;
