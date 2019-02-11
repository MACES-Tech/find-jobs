module.exports = (sequelize, Sequelize) => {
    const Country =  require('../model/country.model.js')(sequelize, Sequelize);    
	const City = sequelize.define('city', {
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
        },
        district: {
            type: Sequelize.STRING,
        }
    },{
        timestamps: false
    })
    City.belongsTo(Country, {foreignKey : 'countryId' , as :"country"})
    return City;
}