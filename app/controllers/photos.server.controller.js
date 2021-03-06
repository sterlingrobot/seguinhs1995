'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Photo = mongoose.model('Photo'),
	_ = require('lodash');

/**
 * Create a photo
 */
exports.create = function(req, res) {
	var photo = new Photo(req.body);
	photo.user = req.user;

	photo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photo);
		}
	});
};

/**
 * Show the current photo
 */
exports.read = function(req, res) {
	res.jsonp(req.photo);
};

/**
 * Update a photo
 */
exports.update = function(req, res) {
	var photo = req.photo;

	photo = _.extend(photo, req.body);

	photo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photo);
		}
	});
};

/**
 * Delete an photo
 */
exports.delete = function(req, res) {
	var photo = req.photo;

	photo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photo);
		}
	});
};

/**
 * List of Photos
 */
exports.list = function(req, res) {
	Photo.find().sort('-created').populate('user', 'displayName').exec(function(err, photos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photos);
		}
	});
};

/**
 * Photo middleware
 */
exports.photoByID = function(req, res, next, id) {
	Photo.findById(id).populate('user', 'displayName').exec(function(err, photo) {
		if (err) return next(err);
		if (!photo) return next(new Error('Failed to load photo ' + id));
		req.photo = photo;
		next();
	});
};

/**
 * Photo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.photo.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};