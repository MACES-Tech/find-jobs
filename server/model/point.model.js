module.exports = (sequelize, Sequelize) => {
    const Section =  require('../model/section.model.js')(sequelize, Sequelize);

	const Point = sequelize.define('point', {
        title: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    })
    Point.belongsTo(Section, {foreignKey: 'sectionId', targetKey: 'id', as : 'section'});
    return Point;
}