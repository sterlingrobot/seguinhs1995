'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Photo Schema
 */
var PhotoSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	content: {
		type: String,
		default: '',
		trim: true,
		required: 'Photo cannot be blank'
	},
	title: {
		type: String,
		default: 'Untitled',
		trim: true
	},
	votes: {
		type: Number,
		default: 0
	},
	upvotes: {
		type: [Schema.ObjectId],
		default: []
	},
	downvotes: {
		type: [Schema.ObjectId],
		default: []
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Photo', PhotoSchema);