const db = require('../config/db.config.js');
var passport = require('passport');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var passportConfig = require('../config/passport.js');
var User = db.users;

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};


var setPassword = function(password){
  var salt = crypto.randomBytes(16).toString('hex');
  var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return {"salt":salt,"hash":hash};
};

var generateJwt = function(user) {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: user.id,
    email: user.email,
    name: user.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, passportConfig.jwtSettings.secret); // DO NOT KEEP YOUR SECRET IN THE CODE!
}


exports.register = function(req, res,next) {

  if(!req.body.name || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;
  user.phone = req.body.phone;
  user.role = req.body.role;

  var saltAndHash = setPassword(req.body.password);
  user.salt = saltAndHash.salt;
  user.hash = saltAndHash.hash;

  User.create(user.dataValues).then(user => {		
		return res.status(200).send({
      token: generateJwt(user),
      user: user
    });
	}).catch(next);
    
};

let _onPassportAuth = (req, res, error, user, info) => {
  if (error) {
      return res.serverError(error);
  }


  User.find({where:{email: req.body.email }}).then(user => {
    if (!user) {
        return res.send(401);
    } else {
      var hash = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64, 'sha512').toString('hex');
      if(user.hash != hash){
        return res.send(401);
      }
        return res.status(200).send({
            token: generateJwt(user),
            user: user
        });
    }
  }).catch(err => {
      return res.send(401);
  });
  
}

exports.login = function(req, res,next) {

    if(!req.body.email || !req.body.password) {
        return res.json({
            message: "something wrong in field"
        })
        
    }

  passport.authenticate('local', _onPassportAuth(req, res));

};