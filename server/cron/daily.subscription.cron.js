var CronJob = require('cron').CronJob;
const db = require('../config/db.config.js');
const Job = db.job;
const Op = db.sequelize.Op;
const Subscription = db.subscription

//* * * * * * each second
//0 0 * * * each day at 00:00
console.log('daily subscription cron to send mails');

const job = new CronJob('0 0 * * *', function () {

    Subscription.findAll({ type: 'daily' }).then((subscriptionList, err) => {
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
                    if (subscription.degreeId) {
                        
                        searchObjectTag = " degreeId = "+ subscription.degreeId;
                    }
                    selectquery = "SELECT * FROM jobs ";
                    if(innertJoin.length > 0){
                        selectquery+=innertJoin;
                    }
                    selectquery+=" WHERE status = 'Active' AND postedDate = " + new Date().toLocaleDateString()
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

                        
                      })

                } loop(subscription);

            });
        }
    })
});

job.start();
