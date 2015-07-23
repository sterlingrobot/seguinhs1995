'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	photos = require('../../app/controllers/photos');

module.exports = function(app) {
	// photo Routes
	app.route('/photos')
		.get(photos.list)
		.post(users.requiresLogin, photos.create);

	app.route('/photos/:photoId')
		.get(photos.read)
		.put(users.requiresLogin, photos.hasAuthorization, photos.update)
		.delete(users.requiresLogin, photos.hasAuthorization, photos.delete);

	// Finish by binding the photo middleware
	app.param('photoId', photos.photoByID);
};