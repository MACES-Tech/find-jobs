module.exports = (sequelize, Sequelize) => {    
	const User = sequelize.define('users', {
	  name: {
            type: Sequelize.STRING,
            allowNull: false
		},
		email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
		},
		phone: {
            type: Sequelize.STRING,
			allowNull: false
            
        },
        role:{
            type: Sequelize.STRING,
			allowNull: false
        },
		hash: {
            type: Sequelize.STRING,
            allowNull: false
        },
        salt: {
            type: Sequelize.STRING,
            allowNull: false
		},
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    });
    
	return User;
}