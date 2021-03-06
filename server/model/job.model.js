module.exports = (sequelize, Sequelize) => {
    const File =  require('../model/file.model.js')(sequelize, Sequelize);
    const City =  require('../model/city.model.js')(sequelize, Sequelize);
    const Degree =  require('../model/degree.model.js')(sequelize, Sequelize);    
    const Organization =  require('../model/organization.model.js')(sequelize, Sequelize);    
    const User =  require('../model/users.model.js')(sequelize, Sequelize);    
    const Tag =  require('../model/tag.model.js')(sequelize, Sequelize);    
    // const JobTag = require('../model/jobTag.model.js')(sequelize, Sequelize);

	const Job = sequelize.define('job', {
        title:{
            type: Sequelize.STRING,
            allowNull: true
        },
        jobtype:{
            type: Sequelize.STRING,
            allowNull: true
        },
        postedDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        dueDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        address:{
            type: Sequelize.STRING
        },
        jobUrl:{
            type: Sequelize.STRING
        },
        status:{
            type: Sequelize.STRING
        }

    })

    Job.belongsTo(User, {foreignKey : 'creatorId' , as :"creator"})
    Job.belongsTo(Organization, {foreignKey : 'organizationId' , as :"organization"})
    Job.belongsTo(Degree, {foreignKey : 'degreeId' , as :"degree"})
    // Job.belongsTo(Category, {foreignKey : 'categoryId' , as :"category"})
    Job.belongsTo(City, {foreignKey : 'cityId' , as :"city"})
    Job.belongsToMany(Tag, {
        through: 'job_tags',
        as: 'tags',
        foreignKey: 'jobId'
      });
    Tag.belongsToMany(Job, {
        through: 'job_tags',
        as: 'jobs',
        foreignKey: 'tagId'
      });
    return Job;
}