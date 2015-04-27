'use strict';


angular.module('core').controller('RegisterController', ['$scope', '$window', 'Authentication',
	function($scope, $window, Authentication) {

		$scope.user = Authentication.user;

		// Define Stripe payments key
    	$window.Stripe.setPublishableKey('pk_test_KyPkT2u6Ags4pupzDmph9pC7');

		$scope.register = 'Register';

		// Stripe Response Handler
		$scope.stripeCallback = function (code, result) {
		    if (result.error) {
		        $window.alert('it failed! error: ' + result.error.message);
		    } else {
		        $window.alert('success! token: ' + result.id);
		    }
		};
	}
]);