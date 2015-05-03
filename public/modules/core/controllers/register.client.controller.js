'use strict';


angular.module('core').controller('RegisterController', ['$scope', '$window', '$log', '$timeout', 'Authentication', 'Payments',
	function($scope, $window, $log, $timeout, Authentication, Payments) {

		var price = 3000;
		$scope.guests = 1;
		$scope.user = Authentication.user;
		$scope.registration = Authentication.user.registration;
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
			$log.log(code, result);
		    if (result.error) {
				$scope.error.level = 'alert-warning';
				$scope.error.message = result.error.message;
				$timeout(function() { $scope.error = {}; }, 5000);
		    } else {
		    	var payment = new Payments({
		    		user: $scope.user,
		    		amount: $scope.guests * price,
		    		token: result.id,
		    		guests: $scope.guests
		    	});
		    	payment.$charge(function(response) {
					console.log(response);
					$scope.user.address = $scope.user.address || {};
					$scope.user.address.street = $scope.addressLine1;
					$scope.user.address.city = $scope.addressCity;
					$scope.user.address.state = $scope.addressState;
					$scope.user.address.zip = $scope.addressZip;
				}, function(errorResponse) {
					$log.log(errorResponse);
					$scope.error.message = errorResponse.data.message;
					$scope.error.level = 'alert-danger';
					$timeout(function() { $scope.error = {}; }, 5000);
				});
		    }
		};
	}
]);