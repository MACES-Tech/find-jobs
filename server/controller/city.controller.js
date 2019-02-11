const db = require('../config/db.config.js');
const City = db.city;
const Op = db.sequelize.Op;

// const Tag = db.tag;
// const User = db.users;
// const Job = db.job;
// const Op = db.sequelize.Op;
// const jobStatus = {
//     active:  "Active",
//     pending: "Pending",
//     expired: "Expired",
//     deleted: "Deleted"
// }

exports.getCitiesFilter = (req, res, next) => {
    // { model: db.city, as: 'city', where: filterByCity, attributes:['id', 'name'],include: [
    //     {model: db.country, as: 'country', attributes:['id', 'name']}    
    // ]}
    var keyword = req.query.q;
    if (!keyword)
        keyword = "";
    City.findAll({
        attributes: ['id', 'name', 'district'],
        include: [{
            model: db.country,
            as: 'country',
            attributes: ['name']
        }],
        where: {
            [Op.or]: [
                db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('city.name')), {
                    [Op.like]: keyword.toLowerCase() + '%'
                }),
                db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('country.name')), {
                    [Op.like]: keyword.toLowerCase() + '%'
                }), db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('city.district')), {
                    [Op.like]: keyword.toLowerCase() + '%'
                })
            ]
        },
        offset: 0,
        limit: 10
    }).then(cities => {
        var r = [];
        for (var i in cities) {
            r.push({
                id: cities[i].id,
                name: cities[i].name + ', ' + cities[i].country.name
            });
        }
        res.send(r);
    }).catch(next);
};