const jwt = require("jsonwebtoken");
const expiration = process.env.DB_ENV === 'testing' ? 100 : '24h';
require('dotenv').config();

function signToken(user) {
    var email = user.email;
    var samlToken = user.samlToken;
    var role = user.role;
    signedToken = jwt.sign({ id: email, samlToken: samlToken, role: role }, process.env.JWT_SECRET, {
        expiresIn: expiration //other configuration options
    });
    return signedToken;
}

module.exports = signToken