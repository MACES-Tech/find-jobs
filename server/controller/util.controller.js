const db = require('../config/db.config.js');
const Country = db.country;
const City = db.city;
 

exports.getAllCountries = (req, res, next) => {
	Country.findAll().then(countries => {
	  res.send(countries);
	}).catch(next);
};

exports.getAllCities = (req, res, next) => {
    const countryIdParam = req.params.countryId;
    if(countryIdParam){
        City.findAll({where:{countryId:countryIdParam}}).then(cities => {
            res.send(cities);
          }).catch(next);
    }else{res.send([])}

};