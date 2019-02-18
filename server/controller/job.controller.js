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
    jobObject = {
        title: job.title,
        degreeId: job.degree,
        postedDate: job.postedDate,
        dueDate: job.expiredDate,
        address: job.address,
        status: status,
        creatorId: job.creator.id,
        organizationId: job.organization[0].id,
        jobUrl: job.jobUrl
    };
    if(job.selectedCity && job.selectedCity != undefined){
        jobObject.cityId = JSON.parse(job.selectedCity).id;
    }
    Job.create(jobObject).then(insertedjob => {
        if(job.tags != undefined && job.tags.length > 0){
            for (let index = 0; index < job.tags.length; index++) {
                const element = job.tags[index];
                jobTagObject = {
                    tagId: element.id,
                    jobId: insertedjob.id
                }
                JobTag.create(jobTagObject).then(insertedjobTag => {
    
                }).catch(next);
    
            }
        }
        

        for (let index = 0; index < job.sections.length; index++) {
            const element = job.sections[index];
            jobSectionObject = {
                title: element.title,
                description: element.description,
                jobId: insertedjob.id
            }
            JobSection.create(jobSectionObject).then(insertedJobSection => {

                for (let index = 0; index < element.points.length; index++) {
                    const point = element.points[index];
                    jobpointObject = {
                        title: point.title,
                        sectionId: insertedJobSection.id
                    }
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

    searchobject = {
        status: {
            [Op.ne]: [jobStatus.deleted]
        }
    }
    countObject = {}
    if (adminId) {
        searchobject.creatorId = adminId;
        countObject.creatorId = adminId;
    }
    if (q && q != "undefined") {
        searchobject.title = {
            [Op.like]: '%' + q + '%'
        }
        countObject.title = {
            [Op.like]: '%' + q + '%'
        }
    }
    if (!pageNumber || pageNumber === "undefined") {
        pageNumber = 1;
    }
    if (!itemsPerPage || itemsPerPage === "undefined") {
        itemsPerPage = 8;
    }
    offset = (pageNumber - 1) * itemsPerPage
    var jsonResult = {};
    Job.count({
        where: countObject
    }).then(count => {
        jsonResult.count = count;
        Job.findAll({
            where: searchobject,
            include: [{
                    model: db.users,
                    as: 'creator'
                },
                {
                    model: db.city,
                    as: 'city'
                },
                {
                    model: db.organization,
                    as: 'organization'
                }
            ],
            offset: offset,
            limit: parseInt(itemsPerPage),
            order: [
                ['createdAt', 'DESC']
            ]
        }).then(jobs => {
            jsonResult.jobs = [];
            for (let index = 0; index < jobs.length; index++) {
                jsonResult.jobs.push(jobs[index].toJSON());
            }
            res.send(jsonResult);
        }).catch(next);

    }).catch(next);
}

exports.getAllJobsForPublic = (req, res, next) => {
    var pageNumber = req.body.pageNumber;
    var itemsPerPage = req.body.numberOfitemPerPages;
    var orgs = req.body.organizations;
    var tags = req.body.tags;
    var cities = req.body.city;
    var grade = req.body.grade;
    var jobTitleQuery = req.body.job_title;
    // var q = req.query.q;

    var searchobject = {
        status: jobStatus.active,
        title: { [Op.like]: '%' + jobTitleQuery + '%'}
    }
    var filterByOrg = {};
    var filterByCity = {};
    var filterByDegree = {};
    var filterByTag = {};
    var degreeRequired = false;
    var cityRequired = false;
    if (orgs && orgs.length > 0) {
        filterByOrg.id = orgs;
    }
    if (tags && tags.length > 0) {
        filterByTag.id = tags;
    }
    if (cities) {
        filterByCity.id = cities;
        cityRequired = true;
    }
    if (grade) {
        filterByDegree.id = grade;
        degreeRequired = true;
    }
    // if(q && q != "undefined"){
    // searchobject.title = { [Op.like]: '%' + q + '%'}
    // countObject.title = { [Op.like]: '%' + q + '%'}
    // }

    if (!pageNumber || pageNumber === "undefined") {
        pageNumber = 1;
    }
    if (!itemsPerPage || itemsPerPage === "undefined") {
        itemsPerPage = 8;
    }
    offset = (pageNumber - 1) * itemsPerPage;
    var jsonResult = {};
    Job.count({
        where: searchobject,
        include: [{
                model: db.organization,
                as: 'organization',
                where: filterByOrg
            },
            {
                model: db.city,
                as: 'city',
                required: cityRequired,
                where: filterByCity
            },
            {
                model: db.degree,
                required: degreeRequired,
                as: 'degree',
                where: filterByDegree
            }
        ]
    }).then(count => {
        jsonResult.count = count;
        Job.findAll({
            attributes: ['id', 'title', 'postedDate', 'jobtype'],
            where: searchobject,
            include: [{
                    model: db.city,
                    as: 'city',
                    where: filterByCity,
                    required: cityRequired,
                    attributes: ['id', 'name'],
                    include: [{
                        model: db.country,
                        as: 'country',
                        attributes: ['id', 'name']
                    }]
                },
                {
                    model: db.organization,
                    as: 'organization',
                    where: filterByOrg,
                    attributes: ['id', 'name'],
                    include: [{
                        model: db.file,
                        as: 'mainImage',
                        attributes: ['id', 'path', 'altValue', 'type']
                    }]
                },
                {
                    model: db.degree,
                    as: 'degree',
                    where: filterByDegree,
                    required: degreeRequired,
                    attributes: ['id', 'name', 'color']
                }
            ],
            offset: offset,
            limit: parseInt(itemsPerPage),
            order: [
                ['createdAt', 'DESC']
            ]
        }).then(jobs => {
            jsonResult.jobs = [];
            for (let index = 0; index < jobs.length; index++) {
                jsonResult.jobs.push(jobs[index].toJSON());
            }
            res.send(jsonResult);
        }).catch(next);

    }).catch(next);
};

exports.delete = (req, res, next) => {
    const id = req.params.jobId;
    Job.update({
        status: jobStatus.deleted
    }, {
        where: {
            id: id
        }
    }).then(() => {
        // next()
        res.status(200).send('deleted successfully a job with id = ' + id);
    }).catch(next);
};
exports.updateJob = (req, res, next) => {
    const id = req.params.jobId;
    job = req.body;
    jobObject = {
        title: job.title,
        degreeId: job.degree,
        postedDate: job.postedDate,
        dueDate: job.expiredDate,
        address: job.address,
        organizationId: job.organization[0].id,
        jobUrl: job.jobUrl
    }
    if(job.selectedCity && job.selectedCity != undefined){
        jobObject.cityId = JSON.parse(job.selectedCity).id;
    }

    Job.update(jobObject, {
        where: {
            id: id
        }
    }).then(() => {
        // next()
        JobTag.destroy({
            where: {
                jobId: id
            }
        }).then(() => {
            for (let index = 0; index < job.tags.length; index++) {
                const element = job.tags[index];
                jobTagObject = {
                    tagId: element.id,
                    jobId: id
                }
                JobTag.create(jobTagObject).then(insertedjobTag => {

                }).catch(next);

            }
        }).catch(next);
        JobSection.destroy({
            where: {
                jobId: id
            }
        }).then(() => {
            for (let index = 0; index < job.sections.length; index++) {
                const element = job.sections[index];
                jobSectionObject = {
                    title: element.title,
                    description: element.description,
                    jobId: id
                }
                JobSection.create(jobSectionObject).then(insertedJobSection => {
                    JobPoint.destroy({
                        where: {
                            sectionId: null
                        }
                    })
                    for (let index = 0; index < element.points.length; index++) {
                        const point = element.points[index];
                        jobpointObject = {
                            title: point.title,
                            sectionId: insertedJobSection.id
                        }
                        JobPoint.create(jobpointObject).then(insertedJobPoint => {

                        }).catch(next);
                    }

                }).catch(next);
            }
        }).catch(next);
        res.status(200).send("updated successfully a job with id = " + id);
    }).catch(next);
};

exports.getJobById = (req, res, next) => {
    const id = req.params.jobId;
    db.sequelize.query("SELECT distinct  jobs.*,degrees.name as degree,\
    sections.id as sectionId , sections.title as sectionTitle, sections.description as sectionDescription,\
    points.id as pointId, points.title as pointTitle,\
    cities.name as cityName, cities.lat, cities.long, countries.name as countryName,\
    organizations.name as organizationName,\
    files.path as mainImagePath, files.altValue as mainImageAltvalue,\
    tags.id as tagId, tags.name as tagName\
    FROM jobs\
    LEFT OUTER JOIN cities on jobs.cityId = cities.id \
    LEFT OUTER JOIN degrees on jobs.degreeId = degrees.id \
    LEFT OUTER JOIN countries on cities.countryId = countries.id\
    INNER join organizations on jobs.organizationId = organizations.id\
    LEFT OUTER JOIN files on organizations.mainImageId = files.id\
    LEFT OUTER JOIN sections on sections.jobId = jobs.id\
    LEFT OUTER JOIN points on points.sectionId = sections.id\
    LEFT OUTER JOIN job_tags on job_tags.jobId = jobs.id\
    LEFT OUTER JOIN tags on job_tags.tagId = tags.id \
    WHERE jobs.id = ?;", {
        replacements: [id]
    }).spread((results, metadata) => {

        res.send(results);
    })
}

exports.getMorejobsByTags = (req, res, next) => {
    tags = req.query.tags;
    if (req.params.jobId)
        jobId = req.params.jobId;
    if (req.query.tag) {
        tags = req.query.tag;
        queryString = "SELECT cities.name as cityName, jobs.title as title, jobs.id as id, jobs.address as address,organizations.name as orgName ,organizations.id as orgId, \
        degrees.name as degreeName, degrees.color as degreeColor,files.path as mainImagePath FROM jobs\
        inner join job_tags on jobs.id = job_tags.id\
        inner join degrees on jobs.degreeId = degrees.id\
        inner join cities on cities.id = jobs.cityId\
        inner join organizations on jobs.organizationId = organizations.id\
        LEFT OUTER join files on files.id = organizations.mainImageId\
        where ";
        where = " status = 'Active' and (";
        tags.forEach((element, index) => {
            where += "job_tags.tagId=" + element;
            if (index < tags.length - 1)
                where += " or "
        });
        where += " ) group by jobs.id;"
        queryString += where;

        db.sequelize.query(queryString, {
            replacements: tags
        }).spread((results, metadata) => {
            res.send(results);
        }).catch(next)
    } else {
        res.send([]);
    }
}

exports.getMorejobsByorganization = (req, res, next) => {
    orgId = req.query.orgId;
    jobId = req.params.jobId;
    Job.findAll({
        where: {
            id: {
                [Op.ne]: [jobId]
            },
            organizationId: orgId,
            status: {
                [Op.eq]: ['Active']
            }
        },
        include: [{
            model: db.city,
            as: 'city'
        }],
        offset: 0,
        limit: parseInt(5),
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(jobs => {
        res.send(jobs);
    }).catch(next);
}