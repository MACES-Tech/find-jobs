module.exports = function(app) {
    const auth = require('./auth.js');

    const degreeController = require('../controller/degree.controller.js');
 
    app.post('/api/degree',auth.required, degreeController.create);
    app.get('/api/degree', auth.optional,degreeController.findAll);
    app.put('/api/degree/:degreeId',auth.required, degreeController.update);
    app.delete('/api/degree/:degreeId',auth.required, degreeController.delete);
}