module.exports = (sequelize, Sequelize) => {    
	const Country = sequelize.define('country', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        country_code: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        }
    })

    return Country;
}