var CronJob = require('cron').CronJob;
const db = require('../config/db.config.js');
const Job = db.job;
const Op = db.sequelize.Op;
console.log('daily expiration cron to expire jobs');
//* * * * * * each second
//0 0 * * * each day at 00:00
const job = new CronJob('0 0 * * * *', function() {
    dateObject = new Date();
    Job.update({status:'Expired'},
        { where: { dueDate: { [Op.lt]: dateObject.toJSON() } } }
    ).then(() => {

    })
    
});

job.start();
