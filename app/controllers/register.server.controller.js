'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	ENV = require('../../config/env/' + process.env.NODE_ENV),
	stripe = require('stripe')(ENV.stripe.clientSecret),
	errorHandler = require('./errors'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');


exports.charge = function(req, res, next) {
	console.log(req);
	var user = req.user,
		meta = _.extend(user.address, {phone: user.phone}),
		chg = {
		  amount: req.body.amount,
		  currency: 'usd',
		  description: 'SHS Class of 1995 20 Year Reunion Registration',
		  statement_descriptor: 'SHS95 REUNION REGISTER',
		  receipt_email: user.email,
		  metadata: {
		  	name: user.displayName,
		  	email: user.email,
		  	guests: req.body.guests
		  }
		};

	stripe.customers.create({
		description: user.displayName,
		email: user.email,
		source: req.body.token,
		metadata: meta
	}, function(err, customer) {

		if (err) {
			return res.status(400).send(err);
		} else {

			chg = _.extend(chg, { customer: customer.id });
			stripe.charges.create(chg, function(err, charge) {

				if (err) {
					return res.status(400).send(err);
				} else {
					User.findOne({
						_id: req.user._id
					}, function(err, user) {
						if(user) {
							user.registration = charge;
							user.save(function(err) {
								if (err) {
									return res.status(400).send({
										message: errorHandler.getErrorMessage(err)
									});
								} else {
									return res.jsonp(user);
								}
							});
						} else {
							res.status(400).send({
								message: 'User id did not match any existing user'
							});
						}
					});
				}

			});
		}
	});



};