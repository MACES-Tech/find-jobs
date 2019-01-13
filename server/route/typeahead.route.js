module.exports = function(app) {
    const auth = require('./auth.js');

    const typeaheadController = require('../controller/typeahead.controller.js');
 
    app.get('/api/typeahead/organization',auth.optional, typeaheadController.typeaheadOrganiztions);
    app.get('/api/typeahead/tag',auth.optional, typeaheadController.typeaheadTags);
    app.get('/api/typeahead/admin',auth.optional, typeaheadController.typeaheadAdmins);
    app.get('/api/typeahead/job',auth.optional, typeaheadController.typeaheadJobs);
};