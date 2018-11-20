var Resource = require('resourcejs');

module.exports = function(app, route) {

	Resource(app, '', route, app.models.user).rest();

	return function(req, res, next) {
		next();
	};
};
