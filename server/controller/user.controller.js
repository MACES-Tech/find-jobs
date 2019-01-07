const db = require('../config/db.config.js');
var crypto = require('crypto');
const Users = db.users;
 
exports.create = (req, res, next) => {
    user = req.body;
	Users.create(user).then(user => {
		res.send(user);
	}).catch(next);
};
 
exports.findAll = (req, res, next) => {
	var pageNumber = req.query.pageNumber;
	var itemsPerPage = req.query.itemsPerPage;
	if(!pageNumber || pageNumber === "undefined"){
		pageNumber = 1;
	}
	if(!itemsPerPage || itemsPerPage === "undefined"){
		itemsPerPage = 8;
	}
	offset = (pageNumber - 1) * itemsPerPage 
	var jsonResult ={};
	Users.count().then(count=>{
		jsonResult.count = count;
		Users.findAll({where:{active:true, role: 'ADMIN'},offset: offset, limit: parseInt(itemsPerPage), order:[['createdAt', 'DESC']]}).then(users => {
			jsonResult.users = [];
			for (let index = 0; index < users.length; index++) {
				jsonResult.users.push(users[index].toJSON());
			}
			res.send(jsonResult);
		  }).catch(next);
	}).catch(next);
};
 

 
exports.update = (req, res, next) => {
    const id = req.params.userId;
    user = req.body;
	Users.update( user, 
					 { where: {id: id} }
				   ).then(() => {
						// next()
					 res.status(200).send("updated successfully a user with id = " + id);
				   }).catch(next);
};

var setPassword = function(password){
	var salt = crypto.randomBytes(16).toString('hex');
	var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
	return {"salt":salt,"hash":hash};
};

exports.resetPassword = (req, res, next) => {
	const id = req.params.userId;
	
	var saltAndHash = setPassword(req.body.password);
	var user = {
		salt: saltAndHash.salt,
		hash: saltAndHash.hash
};

	Users.update( user, 
					 { where: {id: id} }
				   ).then(() => {
						// next()
					 res.status(200).send("updated successfully a user with id = " + id);
				   }).catch(next);
};
 
exports.delete = (req, res, next) => {
    const id = req.params.userId;
	Users.update( {active: false}, 
        { where: {id: id} }
      ).then(() => {
		// next()
	  res.status(200).send('deleted successfully a user with id = ' + id);
	}).catch(next);
};