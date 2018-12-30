module.exports = (sequelize, Sequelize) => {
	const File = sequelize.define('file', {
        path: {
			type: Sequelize.STRING
		},
	    altValue: {
			type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        }
	});
	
	return File;
}