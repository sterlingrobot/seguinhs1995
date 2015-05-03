'use strict';

//Stripe payments service used for communicating with the Stripe REST endpoints
angular.module('core').factory('Payments', ['$resource',
	function($resource) {
		return $resource('register/:userId', {
			userId: '@_id'
		}, {
  			charge: {method:'POST', params:{charge:true}}
		});
	}
]);