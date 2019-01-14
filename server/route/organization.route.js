module.exports = function(app) {
    const auth = require('./auth.js');

    const organizationController = require('../controller/organization.controller.js');
 
    app.post('/api/organization',auth.required, organizationController.create);
    app.get('/api/organization', auth.required,organizationController.findAll);

    app.get('/api/organizationNames', auth.required,organizationController.findAllOrganizationName);
    app.get('/api/organization/:orginzationId', auth.required,organizationController.findById);
    app.put('/api/organization/:organizationId',auth.required, organizationController.update);
    app.delete('/api/organization/:organizationId',auth.required, organizationController.delete);
}