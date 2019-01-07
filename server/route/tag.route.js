module.exports = function(app) {
    const auth = require('./auth.js');

    const tagController = require('../controller/tag.controller.js');
 
    app.post('/api/tag',auth.required, tagController.create);
    app.get('/api/tag', auth.required,tagController.findAllPaging);
    app.get('/api/tags', auth.required,tagController.findAll);
    app.put('/api/tag/:tagId',auth.required, tagController.update);
    app.delete('/api/tag/:tagId',auth.required, tagController.delete);
}