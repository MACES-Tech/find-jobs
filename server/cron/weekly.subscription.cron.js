var CronJob = require('cron').CronJob;
const db = require('../config/db.config.js');
const Job = db.job;
const Op = db.sequelize.Op;

//* * * * * * each second
//'0 0 * * 1 each week at 00:00
console.log('weekly subscription cron to send mails');
const job = new CronJob('0 0 * * 1', function() {
	var days = 7; // Days you want to subtract
var date = new Date();
var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));

    Subscription.findAll({ type: 'weekly' }).then((subscriptionList, err) => {
        if (!err) {
            subscriptionList.forEach(subscription => {
                function loop(subscription) {
                    searchObjectCity = "";
                    searchObjectorganization = "";
                    innertJoin = "";
                    searchObjectTag = "";
                    if (subscription.cityId) {
                        searchObjectCity = " cityId = " + subscription.cityId ;
                    }
                    if (subscription.organizationId) {
                        searchObjectorganization = " organizationId = " + subscription.organizationId ;
                    }
                    if (subscription.tagId) {
                        innertJoin = "INNER JOIN job_tags on jobs.id = job_tags.jobId "
                        searchObjectTag = " job_tags.tagId = "+ subscription.tagId;
                    }
                    selectquery = "SELECT * FROM jobs ";
                    if(innertJoin.length > 0){
                        selectquery+=innertJoin;
                    }
                    selectquery+=" WHERE status = 'Active' AND postedDate >= " + last.toLocaleDateString()
                    if(searchObjectCity.length > 0 ){
                        selectquery+= " AND " + searchObjectCity
                    }
                    if(searchObjectorganization.length > 0 ){
                        selectquery+= " AND " + searchObjectorganization
                    }
                    if(searchObjectTag.length > 0 ){
                        selectquery+= " AND " + searchObjectTag
                    }
                    db.sequelize.query(selectquery).spread((results, metadata) => {
                        // Results will be an empty array and metadata will contain the number of affected rows.
                        console.log(results);
                        console.log(metadata);

                        
                      })

                } loop(subscription);

            });
        }
    })
});
job.start();