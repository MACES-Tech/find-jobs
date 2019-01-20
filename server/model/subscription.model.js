module.exports = (sequelize, Sequelize) => {
    const City =  require('../model/city.model.js')(sequelize, Sequelize);
    const Organization =  require('../model/organization.model.js')(sequelize, Sequelize);    
    const Tag =  require('../model/tag.model.js')(sequelize, Sequelize);    
    const Subscription = sequelize.define('subscription', {
        type: {
            type:   Sequelize.ENUM,
            values: ['daily', 'weekly', 'instantly'],
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    })
    Subscription.belongsTo(City, {foreignKey : 'cityId' , as :"city"})
    Subscription.belongsTo(Organization, {foreignKey : 'organizationId' , as :"Organization"})
    Subscription.belongsTo(Tag, {foreignKey : 'tagId' , as :"tag"})

    return Subscription;
}