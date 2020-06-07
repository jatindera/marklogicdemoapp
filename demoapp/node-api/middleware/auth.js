function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
      console.log("===============Authentication is successfull");
      next();
    } else {
      console.log("================failed authentication===============");
      res.redirect('/app/login')
    }
}

module.exports = checkAuthentication