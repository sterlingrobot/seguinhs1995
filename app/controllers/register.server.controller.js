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

	if(user.registration && typeof user.registration.customer !== 'undefined') {

		// User already has a Stripe customer id, assign it to this charge
		chg = _.extend(chg, { customer: user.registration.customer });
		processCharge();

	} else {

		stripe.customers.create({
			description: user.displayName,
			email: user.email,
			source: req.body.token,
			metadata: meta
		}, function(err, customer) {

				if (err) {
					return res.status(400).send(err);
				} else {
					// Update user data with address info if provided
					User.findOne({
						_id: req.user._id
					}, function(err, user) {
						if(user) {
							user.address = user.address || {};
							user.phone = user.phone || '';
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

					chg = _.extend(chg, { customer: customer.id });
					processCharge();

				}
			}
		);
	}

	function processCharge() {

		stripe.charges.create(chg, function(err, charge) {

			if (err) {
				return res.status(400).send(err);
			} else {
				User.findOne({
					_id: req.user._id
				}, function(err, user) {
					if(user) {
						user.registration = user.registration || {};
						user.registration.registered = true;
						user.registration.guests = charge.metadata.guests;
						user.registration.payments = user.registration.payments || [];
						user.registration.payments.push(charge);
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


};