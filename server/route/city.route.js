module.exports = function(app) {
    const auth = require('./auth.js');

    const cityController = require('../controller/city.controller.js');
 
    app.get('/api/city/filter',auth.optional, cityController.getCitiesFilter);
    // app.get('/api/typeahead/tag',auth.optional, typeaheadController.typeaheadTags);
    // app.get('/api/typeahead/admin',auth.optional, typeaheadController.typeaheadAdmins);
    // app.get('/api/typeahead/job',auth.optional, typeaheadController.typeaheadJobs);
};