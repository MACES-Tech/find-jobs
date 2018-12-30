const jwt = require('express-jwt');
var passportConfig = require('../config/passport.js');

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;

  if(authorization && (authorization.split(' ')[0] === 'Token' || authorization.split(' ')[0] === 'Bearer')) {
    return authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: passportConfig.jwtSettings.secret,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: passportConfig.jwtSettings.secret,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

module.exports = auth;