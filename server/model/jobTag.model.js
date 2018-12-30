module.exports = (sequelize, Sequelize) => {
    const Tag =  require('../model/tag.model.js')(sequelize, Sequelize);    
    const Job =  require('../model/job.model.js')(sequelize, Sequelize);    

	const JobTag = sequelize.define('job_tag', {
        
    })
    JobTag.belongsTo(Tag, {foreignKey : 'tagId' , as :"tag"})
    JobTag.belongsTo(Job, {foreignKey : 'jobId' , as :"job"})

    return JobTag;
}