module.exports = function(app) {
    const auth = require('./auth.js');

    const categoryController = require('../controller/category.controller.js');
 
    app.post('/api/category',auth.required, categoryController.create);
    app.get('/api/category', auth.required,categoryController.findAll);
    app.put('/api/category/:categoryId',auth.required, categoryController.update);
    app.delete('/api/category/:categoryId',auth.required, categoryController.delete);
}