const db = require('../config/db.config.js');
const Users = db.users;
 

exports.findAll = (req, res, next) => {
	Users.findAll().then(users => {
	//   next()
	  res.send(users);
	}).catch(next);
};
 
// Update user
exports.update = (req, res, next) => {
	Users.update(req.body, 
					 { where: {id: req.body.id} }
				   ).then(() => {
						// next()
					 res.status(200).send("user updated successfully");
				   }).catch(next);
};
 