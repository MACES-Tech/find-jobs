module.exports = (sequelize, Sequelize) => {
    const Degree = sequelize.define('degree', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        color: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },{
        timestamps: false
    })
    return Degree;

}