module.exports = (sequelize, Sequelize) => {    
	const Country = sequelize.define('country', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            primaryKey:true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    },{
        timestamps: false
    })

    return Country;
}