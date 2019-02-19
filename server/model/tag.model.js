module.exports = (sequelize, Sequelize) => {    
	const Tag = sequelize.define('tag', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    })
    return Tag;
}