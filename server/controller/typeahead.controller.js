const db = require('../config/db.config.js');
const Organization = db.organization;
const Tag = db.tag;
const User = db.users;
const Job = db.job;
const Op = db.sequelize.Op;
const jobStatus = {
    active:  "Active",
    pending: "Pending",
    expired: "Expired",
    deleted: "Deleted"
}

exports.typeaheadOrganiztions = (req, res, next) => {
    var keyword = req.query.q;
    Organization.findAll({
        attributes: ['id', 'name'],
        where: {
            [Op.and]: [
                { active: 1 },
                db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('name')),
                    {
                        [Op.like]: keyword.toLowerCase() + '%'
                    })
            ]
        }
    }).then(organizations => {
        res.send(organizations);
    }).catch(next);
};

exports.typeaheadTags = (req, res, next) => {
    var keyword = req.query.q;
    Tag.findAll({
        attributes: ['id', 'name'],
        where: {
            [Op.and]: [
                { active: 1 },
                db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('name')),
                    {
                        [Op.like]: keyword.toLowerCase() + '%'
                    })
            ]
        }
    }).then(tags => {
        res.send(tags);
    }).catch(next);
};

exports.typeaheadAdmins = (req, res, next) => {
    var keyword = req.query.q;
    User.findAll({
        attributes: ['id', 'name'],
        where: {
            [Op.and]: [
                { active: 1 },
                db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('name')),
                    {
                        [Op.like]: keyword.toLowerCase() + '%'
                    })
            ]
        }
    }).then(admins => {
        res.send(admins);
    }).catch(next);
};

exports.typeaheadJobs = (req, res, next) => {
    var keyword = req.query.q;
    Job.findAll({
        attributes: ['id', 'title'],
        where: {
            [Op.and]: [
                { status : {[Op.ne]: [jobStatus.deleted]} },
                db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('title')),
                    {
                        [Op.like]: keyword.toLowerCase() + '%'
                    })
            ]
        }
    }).then(admins => {
        res.send(admins);
    }).catch(next);
};