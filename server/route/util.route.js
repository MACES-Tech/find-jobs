module.exports = function(app) {
    const auth = require('./auth.js');

    const utilController = require('../controller/util.controller.js');
 
    app.get('/api/country', auth.required,utilController.getAllCountries);
    app.get('/api/country/:countryId/city', auth.required,utilController.getAllCities);

 
}