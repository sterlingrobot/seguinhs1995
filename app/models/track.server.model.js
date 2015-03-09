'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Track Schema
 */
var TrackSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	artwork: {
		type: String,
		default: '',
		trim: true
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	artist: {
		type: String,
		default: '',
		trim: true
	},
	votes: {
		type: Number,
		default: 0
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Track', TrackSchema);