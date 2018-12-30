const db = require('../config/db.config.js');
const Category = db.category;

exports.create = (req, res, next) => {
    cat = req.body;
	Category.create(cat).then(cat => {
		res.send(cat);
	}).catch(next);
};
 
exports.findAll = (req, res, next) => {
	Category.findAll({where:{active:true}, order:[['createdAt', 'DESC']]}).then(cats => {
	  res.send(cats);
	}).catch(next);
};
 

 
exports.update = (req, res, next) => {
    const id = req.params.categoryId;
    cat = req.body;
	Category.update( cat, 
					 { where: {id: id} }
				   ).then(() => {
						// next()
					 res.status(200).send("updated successfully a carBrand with id = " + id);
				   }).catch(next);
};
 
exports.delete = (req, res, next) => {
    const id = req.params.categoryId;
	Category.update( {active: false}, 
        { where: {id: id} }
      ).then(() => {
		// next()
	  res.status(200).send('deleted successfully a carBrand with id = ' + id);
	}).catch(next);
};