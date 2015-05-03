'use strict';

/**
 * Module dependencies.
 */
var register = require('../../app/controllers/register'),
	users = require('../../app/controllers/users');

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core');
	app.route('/').get(core.index);

	app.route('/register')
		.post(users.requiresLogin, register.charge);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);

};