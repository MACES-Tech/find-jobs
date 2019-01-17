const db = require('../config/db.config.js');
const Tag = db.tag;
const JobTag = db.jobTag;

exports.create = (req, res, next) => {
    tag = req.body;
	Tag.create(tag).then(tag => {
		res.send(tag);
	}).catch(next);
};
 
exports.findAllPaging = (req, res, next) => {
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
		var sqlQuery = "SELECT tags.id, tags.name , \
		(select count(*) FROM tags";
		if(q && q != "undefined"){
			sqlQuery += " where tags.name LIKE '%" + q + "%'";
		}
		sqlQuery +="  ) as tagsCount,\
		(select count(*) FROM job_tags where job_tags.tagId = tags.id) as jobCount from tags \
		WHERE tags.active = true";
		if(q && q != "undefined"){
			sqlQuery += " AND tags.name LIKE '%" + q + "%'";
		}
		sqlQuery += " group by tags.id ORDER BY tags.createdAt DESC LIMIT "+offset+","+ itemsPerPage+";";
		db.sequelize.query(sqlQuery).spread((results, metadata) => {
			
			console.log(results);
			console.log(metadata);
			res.send(results);
		})
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