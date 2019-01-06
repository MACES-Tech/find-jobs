const db = require('../config/db.config.js');
const Organization = db.organization;

exports.create = (req, res, next) => {
    org = req.body;
	Organization.create(org).then(cat => {
		res.send(cat);
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
	Organization.count().then(count=>{
		jsonResult.count = count;
		Organization.findAll({where:{active:true},include: [
			{ model: db.file, as: 'mainImage'
		 	},{
				model: db.city, as: 'city'
			 }
		],offset: offset, limit: parseInt(itemsPerPage), order:[['createdAt', 'DESC']]}).then(orgs => {
			jsonResult.organizations = [];
			for (let index = 0; index < orgs.length; index++) {
				jsonResult.organizations.push(orgs[index].toJSON());
			}
			res.send(jsonResult);
		  }).catch(next);
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