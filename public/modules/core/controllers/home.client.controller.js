'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Articles',
	function($scope, Authentication, Articles) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.emailSignup = false;

		$scope.counter = Math.ceil((new Date('10/9/2015') - new Date()) / (1000*60*60*24));

		$scope.toggleForm = function() {
			$scope.emailSignup = !$scope.emailSignup;
			$scope.error = '';

		};
		$scope.findRecent = function() {
			$scope.articles = Articles.query();
		};

	}
]);