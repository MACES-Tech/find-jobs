const db = require('../config/db.config.js');
const Organization = db.organization;

exports.create = (req, res, next) => {
    org = req.body;
	Organization.create(org).then(cat => {
		res.send(cat);
	}).catch(next);
};
 
exports.findAll = (req, res, next) => {
	Organization.findAll({where:{active:true}, order:[['createdAt', 'DESC']]}).then(orgs => {
	  res.send(orgs);
	}).catch(next);
};
 

 
exports.update = (req, res, next) => {
    const id = req.params.organizationId;
    org = req.body;
	Organization.update( org, 
					 { where: {id: id} }
				   ).then(() => {
						// next()
					 res.status(200).send("updated successfully a organization with id = " + id);
				   }).catch(next);
};
 
exports.delete = (req, res, next) => {
    const id = req.params.organizationId;
	Organization.update( {active: false}, 
        { where: {id: id} }
      ).then(() => {
		// next()
	  res.status(200).send('deleted successfully a organization with id = ' + id);
	}).catch(next);
};