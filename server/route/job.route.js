module.exports = function(app) {
    const auth = require('./auth.js');
    const JobController = require('../controller/job.controller.js');
    app.post('/api/job',auth.required, JobController.create);
    app.get('/api/job',auth.required, JobController.getAllJobsForAdmin);
}