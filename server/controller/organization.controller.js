const db = require('../config/db.config.js');
const Organization = db.organization;
const Job = db.job;
const Op = db.sequelize.Op;
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
	// Organization.count().then(count=>{
	// 	jsonResult.count = count;
	// 	Organization.findAll({where:{active:true},include: [
	// 		{ model: db.file, as: 'mainImage'
	// 		},{
	// 			model: db.city, as: 'city'
	// 		 }
	// 	],offset: offset, limit: parseInt(itemsPerPage), order:[['createdAt', 'DESC']]}).then(orgs => {
	// 		jsonResult.organizations = [];
	// 		for (let index = 0; index < orgs.length; index++) {
	// 			(function(org, index){
	// 				Job.count({where:{organizationId:orgs[index].id}}).then(count =>{
	// 					org.jobCount = count;
	// 					jsonResult.organizations.push(org);
	
	// 					if(index == orgs.length - 1){
	// 						res.send(jsonResult);
	// 					}
	// 				});
	// 			})(orgs[index].toJSON(), index);
	// 		}
	// 	  }).catch(next);
	// }).catch(next);

	db.sequelize.query("SELECT organizations.id, organizations.name , organizations.industry,organizations.address,\
	city.name as cityName, country.name as countryName,mainImage.path,mainImage.altValue,\
	(select count(*) FROM organizations  ) as organizationsCount,\
	(select count(*) FROM jobs WHERE organizationId=organizations.id ) as jobCount from organizations \
	LEFT OUTER JOIN jobs on jobs.organizationId = organizations.id\
	LEFT OUTER JOIN files AS mainImage ON organizations.mainImageId = mainImage.id \
	LEFT OUTER JOIN cities AS city ON organizations.cityId = city.id\
	INNER  JOIN countries AS country ON city.countryId = country.id  \
	WHERE organizations.active = true group by organizations.id ORDER BY organizations.createdAt DESC LIMIT "+offset+","+ itemsPerPage+";").spread((results, metadata) => {
		// Results will be an empty array and metadata will contain the number of affected rows.
		console.log(results);
		console.log(metadata);
		res.send(results);
		
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

exports.findById = (req, res, next) => {	
	const id = req.params.orginzationId;
	// const adminId = req.params.adminId;
	searchObejct = {active:true,id:id}
	// if(adminId){
	// 	searchObejct.creatorId
	// }
	Organization.findAll({where:searchObejct,include: [
		{ model: db.file, as: 'mainImage'
		},{
			model: db.city, as: 'city'
		 }
		]}).then(org => {
			orgRsult = {};
			if(org.length > 0){
				orgRsult = org[0].toJSON();
				Job.findAll({ where:{organizationId:orgRsult.id,status : {[Op.eq]: ['Active']}},include: [{
						model: db.city, as: 'city'
					}
					],offset: 0, limit: parseInt(5),order:[['createdAt', 'DESC']]}).then(jobs =>{
						orgRsult.jobs = jobs;
					res.send(orgRsult);
				})
			}else{
				res.send(orgRsult);
			}
		}).catch(next);
};