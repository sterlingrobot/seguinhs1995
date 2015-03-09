'use strict';

// Configuring the Tracks module
angular.module('tracks').run(['Menus',
	function(Menus) {
		// Set top bar menu item
		Menus.addMenuItem('topbar', 'The\ Playlist', 'tracks', 'item');
	}
]);