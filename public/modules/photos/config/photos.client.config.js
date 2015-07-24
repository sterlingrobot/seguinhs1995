'use strict';

// Configuring the Photos module
angular.module('photos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'The Memes', 'photos');
	}
]);