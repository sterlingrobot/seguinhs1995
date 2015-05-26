'use strict';


angular.module('core').controller('RegisterController', ['$scope', '$window', '$log', '$timeout', 'Users', 'Authentication', 'Payments',
	function($scope, $window, $log, $timeout, Users, Authentication, Payments) {

		$scope.user               = Authentication.user;

		// Default CC info for test successful transaction
		$scope.number             = '4242 4242 4242 4242';
		$scope.expiry             = '12 / 19';
		$scope.cvc                = '999';

		$scope.price              = 3000;  // $30.00 - Stripe format uses smallest denomination (penny)
		$scope.guests             = $scope.user.registration ? parseInt($scope.user.registration.guests) : 1;
		$scope.showGuests         = false;
		$scope.error              = {};
		$scope.loading            = false;
		$scope.name		  		  = $scope.user.displayName;
		$scope.user.address		  = $scope.user.address || {};

		// If available populate address fields for credit card
		$scope.addressLine1       = $scope.user.address.street || '';
		$scope.addressCity        = $scope.user.address.city || '';
		$scope.addressState       = $scope.user.address.state || '';
		$scope.addressZip         = $scope.user.address.zip || '';

		// Define Stripe payments key
    	$window.Stripe.setPublishableKey('pk_test_KyPkT2u6Ags4pupzDmph9pC7');

    	var processCharge = function(token) {

	    	var payment = new Payments({
	    		user: $scope.user,
	    		amount: $scope.guests * $scope.price - $scope.paidToDate(),
	    		token: token,
	    		guests: parseInt($scope.guests)
	    	});

	    	payment.$charge(function(charge) {

				var user = new Users($scope.user);

				user.registration = user.registration || {};
				user.registration.registered = true;
				user.registration.guests = charge.metadata.guests;
				user.registration.payments = user.registration.payments || [];
				user.registration.payments.push(charge);
				user.registration.customer = charge.customer;

				user.$update(function(response) {

		    		// on success, update global user model
					$scope.user = Authentication.user = response;

					$scope.guests = parseInt($scope.user.registration.guests);
					$scope.error.message = 'Processed successfully. Thank you for your payment!';
					$scope.error.level = 'alert-success';

					$timeout(function() {
						$scope.error = {};
						$scope.loading = false;
					}, 5000);

				}, function(errorResponse) {

					$log.log(errorResponse);
					$scope.error.message = 'Error:' + errorResponse.data.message;
					$scope.error.level = 'alert-danger';

					$timeout(function() {
						$scope.error = {};
						$scope.loading = false;
					}, 5000);

				});

			}, function(errorResponse) {

				$log.log(errorResponse);
				$scope.error.message = errorResponse.data.message;
				$scope.error.level = 'alert-danger';
				$timeout(function() {
					$scope.error = {};
					$scope.loading = false;
				}, 5000);

			});

    	};

		// Stripe Response Handler
		$scope.stripeCallback = function (code, result) {

			$scope.loading = true;

			// First we get a token from the card details that created our customer
		    if (result.error) {

				$log.log(result);
				$scope.error.level = 'alert-warning';
				$scope.error.message = result.error.message;
				$timeout(function() { $scope.error = {}; }, 5000);

		    } else {


		    	// Assign address info to user before sending
		    	var user = new Users($scope.user);

				user.address.street = $scope.addressLine1;
				user.address.city   = $scope.addressCity;
				user.address.state  = $scope.addressState;
				user.address.zip    = $scope.addressZip;

				user.$update(function(response) {
					$scope.user = Authentication.user = response;
					processCharge(result.id);
				});

		    }
		};

		$scope.paidToDate = function() {
			var paid = 0;
		    if($scope.user.registration) {
		    	$scope.user.registration.payments.forEach(function(pmt) {
				  paid += pmt.amount;
				});
			}
			return paid;
		};
	}
]);