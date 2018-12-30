module.exports = (sequelize, Sequelize) => {
    const File =  require('../model/file.model.js')(sequelize, Sequelize);
    const City =  require('../model/city.model.js')(sequelize, Sequelize);
    const Category =  require('../model/category.model.js')(sequelize, Sequelize);    
    const Organization =  require('../model/organization.model.js')(sequelize, Sequelize);    
    
	const Job = sequelize.define('Job', {
        dueDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        salary: {
            type: Sequelize.STRING,
            allowNull: true
        },
        careerLevel: {
            type: Sequelize.STRING,
            allowNull: true
        },
        experince: {
            type: Sequelize.STRING,
            allowNull: true
        },
        gender: {
            type: Sequelize.STRING,
            allowNull: true
        },
        industry: {
            type: Sequelize.STRING,
            allowNull: true
        },
        qualification: {
            type: Sequelize.STRING,
            allowNull: true
        }

    })

    Job.belongsTo(Organization, {foreignKey : 'organizationId' , as :"organization"})
    Job.belongsTo(Category, {foreignKey : 'categoryId' , as :"category"})
    Job.belongsTo(City, {foreignKey : 'cityId' , as :"city"})
    return Job;
}