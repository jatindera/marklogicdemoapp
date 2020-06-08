function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
      console.log("========Authentication is successful=======");
      next();
    } else {
      res.redirect('/app/login')
    }
}

module.exports = checkAuthentication