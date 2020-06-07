var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.status(401).send('Login failed');
});

module.exports = router;
