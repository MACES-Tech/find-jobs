const db = require('../config/db.config.js');
const Job = db.job;
const JobTag = db.jobTag;
const JobSection = db.section
const JobPoint = db.point
const Op = db.sequelize.Op;
const Organization = db.organization

const jobStatus = {
    active: "Active",
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
    var adminId = req.query.adminId;
    var q = req.query.q;

    searchobject = { status: { [Op.ne]: [jobStatus.deleted] } }
    countObject = {}
    if (adminId) {
        searchobject.creatorId = adminId;
        countObject.creatorId = adminId;
    }
    if(q && q != "undefined"){
        searchobject.title = { [Op.like]: '%' + q + '%'}
    }
    if (!pageNumber || pageNumber === "undefined") {
        pageNumber = 1;
    }
    if (!itemsPerPage || itemsPerPage === "undefined") {
        itemsPerPage = 8;
    }
    offset = (pageNumber - 1) * itemsPerPage
    var jsonResult = {};
    Job.count({ where: countObject }).then(count => {
        jsonResult.count = count;
        Job.findAll({
            where: searchobject,
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
    Job.update({ status: jobStatus.deleted },
        { where: { id: id } }
    ).then(() => {
        // next()
        res.status(200).send('deleted successfully a job with id = ' + id);
    }).catch(next);
};
exports.updateJob = (req, res, next) => {
    const id = req.params.jobId;
    job = req.body;
    Job.update(job,
        { where: { id: id } }
    ).then(() => {
        // next()
        res.status(200).send("updated successfully a job with id = " + id);
    }).catch(next);
};

exports.getJobById = (req, res, next) => {
    const id = req.params.jobId;
    db.sequelize.query("SELECT distinct  jobs.*,\
    sections.id as sectionId , sections.title as sectionTitle, sections.description as sectionDescription,\
    points.id as pointId, points.title as pointTitle,\
    cities.name as cityName, cities.lat, cities.long, countries.name as countryName,\
    organizations.name as organizationName,\
    files.path as mainImagePath, files.altValue as mainImageAltvalue,\
    tags.id as tagId, tags.name as tagName\
    FROM jobs\
    LEFT OUTER JOIN cities on jobs.cityId = cities.id \
    LEFT OUTER JOIN countries on cities.countryId = countries.id\
    INNER join organizations on jobs.organizationId = organizations.id\
    LEFT OUTER JOIN files on organizations.mainImageId = files.id\
    LEFT OUTER JOIN sections on sections.jobId = jobs.id\
    LEFT OUTER JOIN points on points.sectionId = sections.id\
    LEFT OUTER JOIN job_tags on job_tags.jobId = jobs.id\
    LEFT OUTER JOIN tags on job_tags.tagId = tags.id \
    WHERE jobs.id = ?;",
        { replacements: [id] }).spread((results, metadata) => {

            res.send(results);
        })
}

exports.getMorejobsByorganization = (req, res, next) => {
    orgId = req.query.orgId;
    jobId = req.params.jobId;
    Job.findAll({
        where: { id: { [Op.ne]: [jobId] }, organizationId: orgId, status: { [Op.eq]: ['Active'] } }, include: [{
            model: db.city, as: 'city'
        }
        ], offset: 0, limit: parseInt(5), order: [['createdAt', 'DESC']]
    }).then(jobs => {
        res.send(jobs);
    }).catch(next);
}