module.exports = (sequelize, Sequelize) => {
    const File =  require('../model/file.model.js')(sequelize, Sequelize);
    const City =  require('../model/city.model.js')(sequelize, Sequelize);    
    const Category =  require('../model/category.model.js')(sequelize, Sequelize);    
    
	const Organization = sequelize.define('organization', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        email:{
            type: Sequelize.STRING
        },
        phone:{
            type: Sequelize.STRING
        },
        website:{
            type: Sequelize.STRING
        },
        phone:{
            type: Sequelize.STRING
        },
        foundedDate:{
            type: Sequelize.STRING
        },
        description:{
            type: Sequelize.TEXT
        },
        address:{
            type: Sequelize.STRING
        },
        postcode :{
            type: Sequelize.STRING
        },
        lat: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        long: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        facebook:{
            type: Sequelize.STRING
        },
        twitter:{
            type: Sequelize.STRING
        },
        googlePlus:{
            type: Sequelize.STRING
        },
        youtube:{
            type: Sequelize.STRING
        },
        vimeo:{
            type: Sequelize.STRING
        },
        linkedin:{
            type: Sequelize.STRING
        },
        active: {
            type :Sequelize.BOOLEAN,
            defaultValue: true
        }
        
    })

    Organization.belongsTo(File, {foreignKey : 'mainImageId' , as :"mainImage"})
    Organization.belongsTo(City, {foreignKey : 'cityId' , as :"city"})
    Organization.belongsTo(Category, {foreignKey : 'categoryId' , as :"category"})
    return Organization;
}