'use strict';

// Configuring the Tracks module
angular.module('tracks').run(['Menus',
	function(Menus) {
		// Set top bar menu item
		Menus.addMenuItem('topbar', 'The\ Playlist', 'tracks', 'item');
	}
])
.config(['$sceDelegateProvider', function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
	    // Allow same origin resource loads.
	    'self',
	    // Allow loading iframes from spotify.
	    'https://embed.spotify.com/**'
	  ]);
	}
]);