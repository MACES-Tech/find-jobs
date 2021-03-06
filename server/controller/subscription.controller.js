const db = require('../config/db.config.js');
const Subscription = db.subscription;

exports.create = (req, res, next) => {
	let sub = req.body;
	let obj = {type:sub.selecteSubscripetype.name.toLowerCase(),
		email:sub.email
	}
	if(sub.selectedDutyStation && sub.selectedDutyStation.id!= -1){
		obj.cityId= sub.selectedDutyStation.id
	}
	if(sub.SubselectedOrg && sub.SubselectedOrg.id!= -1){
		obj.organizationId= sub.SubselectedOrg.id
	}
	if(sub.selectedGradeFilter.id!= -1){
		obj.degreeId= sub.selectedGradeFilter.id
	}
	
	Subscription.create(obj).then(sub => {
		res.send(sub);
	}).catch(next);
};

exports.findAllPaging = (req, res, next) => {
	var pageNumber = req.query.pageNumber;
	var itemsPerPage = req.query.itemsPerPage;
	var q = req.query.q;

	if (!pageNumber || pageNumber === "undefined") {
		pageNumber = 1;
	}
	if (!itemsPerPage || itemsPerPage === "undefined") {
		itemsPerPage = 8;
	}
	offset = (pageNumber - 1) * itemsPerPage
	var jsonResult = {};
	Subscription.count({ where: { active: true } }).then(count => {
		jsonResult.count = count;
		Subscription.findAll({
			where: { active: true },
			include: [
				{ model: db.degree, as: 'grade' },
				{ model: db.city, as: 'city' },
				{ model: db.organization, as: 'Organization' }
			], offset: offset, limit: parseInt(itemsPerPage), order: [['createdAt', 'DESC']]
		}).then(subscriptions => {
			jsonResult.subscriptions = subscriptions;
			res.send(jsonResult);
		}).catch(next);

	}).catch(next);

}
exports.update = (req, res, next) => {
	const id = req.params.subscriptionId;
	sub = req.body;
	Subscription.update(sub,
		{ where: { id: id } }
	).then(() => {
		res.status(200).send("updated successfully a tag with id = " + id);
	}).catch(next);
};

exports.delete = (req, res, next) => {
	const id = req.params.subscriptionId;
	Subscription.destroy({ where: { id: id } }
	).then(() => {
		res.status(200).send('deleted successfully a tag with id = ' + id);
	}).catch(next);
};