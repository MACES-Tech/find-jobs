const env = require('./env.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
  logging: env.logging,
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.file = require('../model/file.model.js')(sequelize, Sequelize);
db.users = require('../model/users.model.js')(sequelize, Sequelize);
db.category = require('../model/category.model.js')(sequelize, Sequelize);
db.city = require('../model/city.model.js')(sequelize, Sequelize);
db.country = require('../model/country.model.js')(sequelize, Sequelize);
db.job = require('../model/job.model.js')(sequelize, Sequelize);
db.organization = require('../model/organization.model.js')(sequelize, Sequelize);
db.point = require('../model/point.model.js')(sequelize, Sequelize);
db.section = require('../model/section.model.js')(sequelize, Sequelize);
db.tag = require('../model/tag.model.js')(sequelize, Sequelize);
db.jobTag =  require('../model/jobTag.model.js')(sequelize, Sequelize);
db.subscription =  require('../model/subscription.model.js')(sequelize, Sequelize);
db.degree =  require('../model/degree.model.js')(sequelize, Sequelize);
module.exports = db;