'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	tracks = require('../../app/controllers/tracks');

module.exports = function(app) {
	// Article Routes
	app.route('/tracks')
		.get(tracks.list)
		.post(users.requiresLogin, tracks.create);

	app.route('/tracks/:trackId')
		.get(tracks.read)
		.put(users.requiresLogin, tracks.update)
		.delete(users.requiresLogin, tracks.hasAuthorization, tracks.delete);

	// Finish by binding the article middleware
	app.param('trackId', tracks.trackByID);
};