const db = require('../config/db.config.js');
const Job = db.job;
const JobTag = db.jobTag;
const JobSection = db.section
const JobPoint = db.point
const Op = db.sequelize.Op;

const jobStatus = {
    active:  "Active",
    pending: "Pending",
    expired: "Expired",
    deleted: "Deleted"
}
exports.create = (req, res, next) => {
    job = req.body;
    if (job.creator.role === "SUPER_ADMIN") {
        status = jobStatus.active;
    } else {
        status = jobStatus.pending;
    }
    jobObject = { title: job.title, jobtype: job.type, postedDate: job.postedDate, dueDate: job.expiredDate, address: job.address, status: status, creatorId: job.creator.id, organizationId: job.organization[0].id, cityId: JSON.parse(job.selectedCity).id }
    Job.create(jobObject).then(insertedjob => {
        for (let index = 0; index < job.tags.length; index++) {
            const element = job.tags[index];
            jobTagObject = { tagId: element.id, jobId: insertedjob.id }
            JobTag.create(jobTagObject).then(insertedjobTag => {

            }).catch(next);

        }

        for (let index = 0; index < job.sections.length; index++) {
            const element = job.sections[index];
            jobSectionObject = { title: element.title, description: element.description, jobId: insertedjob.id }
            JobSection.create(jobSectionObject).then(insertedJobSection => {

                for (let index = 0; index < element.points.length; index++) {
                    const point = element.points[index];
                    jobpointObject = { title: point.title, sectionId: insertedJobSection.id }
                    JobPoint.create(jobpointObject).then(insertedJobPoint => {

                    }).catch(next);
                }

            }).catch(next);
        }

        res.send(insertedjob);
    }).catch(next);
};
exports.getAllJobsForAdmin = (req, res, next) => {
    var pageNumber = req.query.pageNumber;
    var itemsPerPage = req.query.itemsPerPage;
    if (!pageNumber || pageNumber === "undefined") {
        pageNumber = 1;
    }
    if (!itemsPerPage || itemsPerPage === "undefined") {
        itemsPerPage = 8;
    }
    offset = (pageNumber - 1) * itemsPerPage
    var jsonResult = {};
    Job.count().then(count => {
        jsonResult.count = count;
        Job.findAll({ where:{status : {[Op.ne]: [jobStatus.deleted]} },
            include: [
                { model: db.users, as: 'creator' },
                { model: db.city, as: 'city' },
                { model: db.organization, as: 'organization' }
            ], offset: offset, limit: parseInt(itemsPerPage), order: [['createdAt', 'DESC']]
        }).then(jobs => {
            jsonResult.jobs = [];
            for (let index = 0; index < jobs.length; index++) {
                jsonResult.jobs.push(jobs[index].toJSON());
            }
            res.send(jsonResult);
        }).catch(next);

    }).catch(next);
}
exports.delete = (req, res, next) => {
    const id = req.params.jobId;
	Job.update( {status: jobStatus.deleted}, 
        { where: {id: id} }
      ).then(() => {
		// next()
	  res.status(200).send('deleted successfully a category with id = ' + id);
	}).catch(next);
};