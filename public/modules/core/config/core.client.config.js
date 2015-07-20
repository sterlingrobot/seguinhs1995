'use strict';

angular.module('core').config(function() {


	}
)
.run(['Menus',
	function(Menus) {
		// Set top bar menu item
		Menus.addMenuItem('topbar', 'The\ Event', 'event', 'item');
		Menus.addMenuItem('topbar', 'The\ Playlist', 'tracks', 'item');
		Menus.addMenuItem('topbar', 'The\ Map', 'map', 'item');
		Menus.addMenuItem('topbar', 'The\ SWAG', 'swag', 'item');
	}
]);