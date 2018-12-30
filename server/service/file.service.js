const db = require('../config/db.config.js');
const File = db.file;

exports.create = (file, cb) => {
          File.create(file).then(cb).catch(cb)
}