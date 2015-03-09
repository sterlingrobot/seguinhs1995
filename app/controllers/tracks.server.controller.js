'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Track = mongoose.model('Track'),
	_ = require('lodash');

/**
 * Create a track
 */
exports.create = function(req, res) {
	var track = new Track(req.body);
	track.user = req.user;

	track.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(track);
		}
	});
};

/**
 * Show the current track
 */
exports.read = function(req, res) {
	res.jsonp(req.track);
};

/**
 * Update a track
 */
exports.update = function(req, res) {
	var track = req.track;

	track = _.extend(track, req.body);

	track.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(track);
		}
	});
};

/**
 * Delete an track
 */
exports.delete = function(req, res) {
	var track = req.track;

	track.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(track);
		}
	});
};

/**
 * List of Tracks
 */
exports.list = function(req, res) {
	Track.find().sort('-created').populate('user', 'displayName').exec(function(err, tracks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tracks);
		}
	});
};

/**
 * Track middleware
 */
exports.trackByID = function(req, res, next, id) {
	Track.findById(id).populate('user', 'displayName').exec(function(err, track) {
		if (err) return next(err);
		if (!track) return next(new Error('Failed to load track ' + id));
		req.track = track;
		next();
	});
};

/**
 * Track authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.track.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};