const express = require('express');
const router = express.Router();
const checkAuthentication = require('./../middleware/auth');

router.get('/', checkAuthentication, (req, res, next) => {
  res.render('index',
    {
      title: "Welcome !"
    }
  )
});


module.exports = router;
