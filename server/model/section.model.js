module.exports = (sequelize, Sequelize) => {
    const Job =  require('../model/job.model.js')(sequelize, Sequelize);

	const Section = sequelize.define('section', {
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        body: {
            type: Sequelize.TEXT
        }
    })
    Section.belongsTo(Job, {foreignKey : 'jobId' , as :"job"})

    return Section;
}