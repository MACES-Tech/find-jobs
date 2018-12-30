const db = require('../config/db.config.js');
const Tag = db.tag;

exports.create = (req, res, next) => {
    tag = req.body;
	Tag.create(tag).then(tag => {
		res.send(tag);
	}).catch(next);
};
 
exports.findAll = (req, res, next) => {
	Tag.findAll({where:{active:true}, order:[['createdAt', 'DESC']]}).then(tags => {
	  res.send(tags);
	}).catch(next);
};
 

 
exports.update = (req, res, next) => {
    const id = req.params.tagId;
    tag = req.body;
	Tag.update( tag, 
					 { where: {id: id} }
				   ).then(() => {
						// next()
					 res.status(200).send("updated successfully a tag with id = " + id);
				   }).catch(next);
};
 
exports.delete = (req, res, next) => {
    const id = req.params.tagId;
	Tag.update( {active: false}, 
        { where: {id: id} }
      ).then(() => {
		// next()
	  res.status(200).send('deleted successfully a tag with id = ' + id);
	}).catch(next);
};