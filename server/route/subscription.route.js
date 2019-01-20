module.exports = function(app) {
    const auth = require('./auth.js');

    const subscriptionController = require('../controller/subscription.controller.js');
    
    app.post('/api/subscription',auth.optional, subscriptionController.create);
    app.get('/api/subscription', auth.required,subscriptionController.findAllPaging);
    app.put('/api/subscription/:subscriptionId',auth.required, subscriptionController.update);
    app.delete('/api/subscription/:subscriptionId',auth.required, subscriptionController.delete);
}