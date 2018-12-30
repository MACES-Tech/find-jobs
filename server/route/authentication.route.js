module.exports = function(app) {
    const auth = require('./auth.js');

    const authentication = require('../controller/authentication.js');
    
    app.post('/api/register', auth.optional, authentication.register);
    
    app.post('/api/login', auth.optional, authentication.login);

}