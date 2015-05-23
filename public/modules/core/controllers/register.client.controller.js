'use strict';


angular.module('core').controller('RegisterController', ['$scope', '$window', '$log', '$timeout', 'Users', 'Authentication', 'Payments',
	function($scope, $window, $log, $timeout, Users, Authentication, Payments) {

		// Default CC info for test successful transaction
		$scope.number = '4242 4242 4242 4242';
		$scope.expiry = '12 / 19';
		$scope.cvc = '999';

		$scope.price = 3000;
		$scope.user = Authentication.user;
		$scope.registration = Authentication.user.registration;
		$scope.guests = Authentication.user.registration ? Authentication.user.registration.guests : 1;
		$scope.showGuests = false;
		$scope.additionalGuests = 1;
		$scope.error = {};

		$scope.name = $scope.user.displayName;
		$scope.addressLine1 = $scope.user.address.street;
		$scope.addressCity = $scope.user.address.city;
		$scope.addressState = $scope.user.address.state;
		$scope.addressZip = $scope.user.address.zip;


		// Define Stripe payments key
    	$window.Stripe.setPublishableKey('pk_test_KyPkT2u6Ags4pupzDmph9pC7');

		// Stripe Response Handler
		$scope.stripeCallback = function (code, result) {

			// First we get a token from the card details that created our customer
		    if (result.error) {
				$log.log(result);
				$scope.error.level = 'alert-warning';
				$scope.error.message = result.error.message;
				$timeout(function() { $scope.error = {}; }, 5000);

		    } else {

		    	// Update the user with address details if provided
				$scope.user.address.street = $scope.addressLine1;
				$scope.user.address.city = $scope.addressCity;
				$scope.user.address.state = $scope.addressState;
				$scope.user.address.zip = $scope.addressZip;

		    	var payment = new Payments({
		    		user: $scope.user,
		    		amount: $scope.guests * $scope.price - $scope.paidToDate(),
		    		token: result.id,
		    		guests: $scope.guests
		    	});
		    	payment.$charge(function(response) {
					Authentication.user = response;
					$scope.error.message = 'Processed successfully. Thank you for your payment!';
					$scope.error.level = 'alert-success';
					$timeout(function() { $scope.error = {}; }, 5000);
				}, function(errorResponse) {
					$log.log(errorResponse);
					$scope.error.message = errorResponse.data.message;
					$scope.error.level = 'alert-danger';
					$timeout(function() { $scope.error = {}; }, 5000);
				});
		    }
		};

		$scope.paidToDate = function() {
			return $scope.registration ?
		    	$scope.registration.payments.reduce(function(total, pmt) {
				  return total + pmt.amount;
				}) : 0;
		};
	}
]);