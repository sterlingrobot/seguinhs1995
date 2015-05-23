'use strict';


angular.module('core').controller('EventController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

	}
]);