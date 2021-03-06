const db = require('../config/db.config.js');
var crypto = require('crypto');
const Users = db.users;
const Op = db.sequelize.Op;

exports.create = (req, res, next) => {
	user = req.body;
	var saltAndHash = setPassword(req.body.password);
	user.salt = saltAndHash.salt;
	user.hash = saltAndHash.hash;
	Users.create(user).then(user => {
		res.send(user);
	}).catch(next);
};
 
exports.findAll = (req, res, next) => {
	var pageNumber = req.query.pageNumber;
	var itemsPerPage = req.query.itemsPerPage;
	var q = req.query.q;

	if(!pageNumber || pageNumber === "undefined"){
		pageNumber = 1;
	}
	if(!itemsPerPage || itemsPerPage === "undefined"){
		itemsPerPage = 8;
	}
	offset = (pageNumber - 1) * itemsPerPage 
	var jsonResult ={};
	countObject={};
	if(q && q != "undefined"){
		countObject.name = { [Op.like]: '%' + q + '%'}
	}
	Users.count({ where: countObject }).then(count=>{
		jsonResult.count = count;
		var whereCluase = {active:true, role: 'ADMIN'};
		if(q && q != "undefined"){
			whereCluase.name = { [Op.like]: '%' + q + '%'}
		}
		Users.findAll({where:whereCluase,offset: offset, limit: parseInt(itemsPerPage), order:[['createdAt', 'DESC']]}).then(users => {
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
	if(req.body.password !== undefined && req.body.password !== ''){
		var saltAndHash = setPassword(req.body.password);
		user.salt = saltAndHash.salt;
		user.hash = saltAndHash.hash;
	}
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

	Users.find({where:{id: id }}).then(user => {
		if (!user) {
			return res.send(401);
		} else {
			var hash = crypto.pbkdf2Sync(req.body.oldPassword, user.salt, 1000, 64, 'sha512').toString('hex');
			if(user.hash != hash){
				return res.status(401).send("Old password is not correct");
			}
			var saltAndHash = setPassword(req.body.password);
			var user = {
				salt: saltAndHash.salt,
				hash: saltAndHash.hash
			};
			Users.update( user, { where: {id: id} })
			.then(() => {
				res.status(200).send("updated successfully a user with id = " + id);
			}).catch(next);
		
		}
	  }).catch(err => {
		  return res.send(401);
	  });
};
 
exports.delete = (req, res, next) => {
    const id = req.params.userId;
		Users.update( {active:false}, 
			{ where: {id: id} }
			).then(() => {
			 // next()
			res.status(200).send("updated successfully a user with id = " + id);
			}).catch(next);
};