module.exports = (sequelize, Sequelize) => {    
	const Country = sequelize.define('country', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        lat: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        long: {
            type: Sequelize.STRING,
            allowNull: true,
		}
    })

    return Country;
}