'use strict';

//Tracks service used for communicating with the tracks REST endpoints
angular.module('tracks').factory('Tracks', ['$resource',
	function($resource) {
		return $resource('tracks/:trackId', {
			trackId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);