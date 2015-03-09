'use strict';

// Setting up route
angular.module('tracks').config(['$stateProvider',
	function($stateProvider) {
		// Tracks state routing
		$stateProvider.
		state('listTracks', {
			url: '/tracks',
			templateUrl: 'modules/tracks/views/list-tracks.client.view.html'
		});
	}
]);