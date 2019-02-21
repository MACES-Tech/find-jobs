module.exports = function(app) {
    const auth = require('./auth.js');
    const JobController = require('../controller/job.controller.js');
    app.post('/api/job',auth.required, JobController.create);
    app.put('/api/job/approve',auth.required, JobController.approveJobPost);
    app.get('/api/job',auth.required, JobController.getAllJobsForAdmin);
    app.post('/api/job/filter',auth.optional, JobController.getAllJobsForPublic);
    app.get('/api/job/:jobId',auth.optional, JobController.getJobById);
    app.get('/api/job/:jobId/moreJobs',auth.optional, JobController.getMorejobsByorganization);

    app.get('/api/jobSearch',auth.optional, JobController.getMorejobsByTags);
    
    app.put('/api/job/:jobId',auth.required, JobController.updateJob);
    app.delete('/api/job/:jobId',auth.required, JobController.delete);

}