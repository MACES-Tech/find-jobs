module.exports = (sequelize, Sequelize) => {    
	const Category = sequelize.define('category', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        icon: {
            type: Sequelize.STRING,
            allowNull: true
        },
        numberOfJobs: {
            type :Sequelize.INTEGER,
            defaultValue: 0 
        },
        active: {
            type :Sequelize.BOOLEAN,
            defaultValue: true
        }
    })

    return Category;
}