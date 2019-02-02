const db = require('../config/db.config.js');
const Degree = db.degree;

exports.create = (req, res, next) => {
    deg = req.body;
	Degree.create(deg).then(deg => {
		res.send(deg);
	}).catch(next);
};
 
exports.findAll = (req, res, next) => {
	Degree.findAll().then(cats => {
	  res.send(cats);
	}).catch(next);
};
 

 
exports.update = (req, res, next) => {
    const id = req.params.categoryId;
    cat = req.body;
	Degree.update( cat, 
					 { where: {id: id} }
				   ).then(() => {
						// next()
					 res.status(200).send("updated successfully a category with id = " + id);
				   }).catch(next);
};
 
exports.delete = (req, res, next) => {
    const id = req.params.categoryId;
	Degree.update( {active: false}, 
        { where: {id: id} }
      ).then(() => {
		// next()
	  res.status(200).send('deleted successfully a category with id = ' + id);
	}).catch(next);
};