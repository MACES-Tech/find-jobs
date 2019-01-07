module.exports = function(app) {
 
    const auth = require('./auth.js');

    const userController = require('../controller/user.controller.js');
 
    app.post('/api/user',auth.required, userController.create);
    app.get('/api/user', auth.required,userController.findAll);
    app.put('/api/user/:userId',auth.required, userController.update);
    app.put('/api/reset_password/:userId',auth.required, userController.resetPassword);
    app.delete('/api/user/:userId',auth.required, userController.delete);
 
}