

/**
 * Passport configuration file where you should configure strategies
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../config/db.config.js');
var crypto = require('crypto');

// var User =  require('../model/users.model.js')(sequelize, Sequelize);
const User = db.users;

var EXPIRES_IN_SECONS = 6 * 60 * 60 * 1;
var SECRET = process.env.tokenSecret || "4ukI0uIVnB3iI1yxj646fVXSE3ZVk4doZgz6fTbNg7jO41EAtl20J5F7Trtwe7OM";
var ALGORITHM = "HS256";
var ISSUER = "nozus.com";
var AUDIENCE = "nozus.com";
 
/**
 * Configuration object for local strategy
 */
var LOCAL_STRATEGY_CONFIG = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: false
};
 
/**
 * Configuration object for JWT strategy
 */
var JWT_STRATEGY_CONFIG = {
  jwtFromRequest: ExtractJwt.fromHeader(),
  secretOrKey: SECRET,
  issuer : ISSUER,
  audience: AUDIENCE,
  passReqToCallback: false
};
 
var validPassword = function(password,salt,originalHash) {
  var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return originalHash === hash;
};
/**
 * Triggers when user authenticates via local strategy
 */
function _onLocalStrategyAuth(email, password, next) {

  User.findAll({
    where: {
      email: email
    }
  }).then(user=>{
    if(user){
      if (!validPassword(password, user[0].salt,user[0].hash))
      return next(null, false, {
        code: 'E_WRONG_PASSWORD',
        message: 'Password is wrong'
      });
      return next(null, user[0], {});
    }else{
      return next(null, false, {
        code: 'E_USER_NOT_FOUND',
        message: email + ' is not found'
      });
    }
  }).catch(()=>{

  });
}
 
/**
 * Triggers when user authenticates via JWT strategy
 */
function _onJwtStrategyAuth(payload, next) {
  var user = payload.user;
  return next(null, user, {});
}
 
passport.use(
  new LocalStrategy(LOCAL_STRATEGY_CONFIG, _onLocalStrategyAuth));
passport.use(
  new JwtStrategy(JWT_STRATEGY_CONFIG, _onJwtStrategyAuth));
 
module.exports.jwtSettings = {
  expiresIn: EXPIRES_IN_SECONS,
  secret: SECRET,
  algorithm : ALGORITHM,
  issuer : ISSUER,
  audience : AUDIENCE
};