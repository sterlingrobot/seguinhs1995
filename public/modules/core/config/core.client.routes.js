'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		})
		.state('event', {
			url: '/event',
			templateUrl: 'modules/core/views/event.client.view.html'
		})
		.state('register', {
			url: '/register',
			templateUrl: 'modules/core/views/register.client.view.html'
		})
		.state('swag', {
			url: '/swag',
			templateUrl: 'modules/core/views/swag.client.view.html'
		});
	}
]);