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
		meta = _.omit(user.address, 'geometry'),  // Invalid for Stripe metadata
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

	meta = _.omit(meta, 'allowMapPin');  // No need to store this in Stripe
	meta.phone = user.phone;

	if(chg.amount < 0) {
		return res.status(400).send({
			message: 'Please email us a seguinhs1995@gmail.com if you need a refund!'
		});
	}

	if(user.registration && typeof user.registration.customer !== 'undefined') {

		// User already has a Stripe customer id, assign it to this charge
		chg = _.extend(chg, { customer: user.registration.customer });

		stripe.charges.create(chg, function(err, charge) {

			if(err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				return res.jsonp(charge);
			}
		});

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

				chg = _.extend(chg, { customer: customer.id });

				stripe.charges.create(chg, function(err, charge) {

					if(err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						return res.jsonp(charge);
					}
				});
			}
		});
	}
};