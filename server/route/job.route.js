module.exports = function(app) {
    const auth = require('./auth.js');
    const JobController = require('../controller/job.controller.js');
    app.post('/api/job',auth.required, JobController.create);
    app.get('/api/job',auth.required, JobController.getAllJobsForAdmin);
    app.get('/api/job/:jobId',auth.required, JobController.getJobById);
    app.get('/api/job/:jobId/moreJobs',auth.required, JobController.getMorejobsByorganization);
    app.put('/api/job/:jobId',auth.required, JobController.updateJob);
    app.delete('/api/job/:jobId',auth.required, JobController.delete);

}