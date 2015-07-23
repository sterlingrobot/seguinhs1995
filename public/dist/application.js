'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'shs';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ui.utils', 'spotify', 'uiGmapgoogle-maps', 'ngCkeditor', 'angularPayments'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';
	//Fixing google bug with redirect
	// if (window.location.hash === '#') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('tracks', ['spotify']);
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Posts', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'See All Posts', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Post', 'articles/create');
	}
]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.editorOptions = {
			skin: 'kama',
			pasteFilter: 'p h1 h2; a[!href]',
		    uiColor: '#aaa'
		};

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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
'use strict';


angular.module('core').controller('EventController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
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
'use strict';


angular.module('core').controller('RegisterController', ['$scope', '$window', '$log', '$timeout', 'Users', 'Authentication', 'Payments',
	function($scope, $window, $log, $timeout, Users, Authentication, Payments) {

		$scope.user               = Authentication.user;

		// Default CC info for test successful transaction
		// $scope.number             = '4242 4242 4242 4242';
		// $scope.expiry             = '12 / 19';
		// $scope.cvc                = '999';

		$scope.price              = 2500;  // $25.00 - Stripe format uses smallest denomination (penny)
		$scope.guests             = $scope.user.registration ? parseInt($scope.user.registration.guests) : 1;
		$scope.showForm			  = false;
		// $scope.payNow			  = false;
		$scope.showGuests         = false;
		$scope.error              = {};
		$scope.loading            = false;
		$scope.name		  		  = $scope.user.displayName;
		$scope.user.address		  = $scope.user.address || {};

		// If available populate address fields for credit card
		$scope.addressLine1       = $scope.user.address.street || '';
		$scope.addressCity        = $scope.user.address.city || '';
		$scope.addressState       = $scope.user.address.state || '';
		$scope.addressZip         = $scope.user.address.zip || '';

		// Define Stripe payments key
    	$window.Stripe.setPublishableKey('pk_live_oyRzRBuqYlM57kEhO95t7TZX');

    	var processCharge = function(token) {

    		var amount = $scope.guests * $scope.price - $scope.paidToDate();

    		if(amount < 0) {
				$scope.loading = false;
				$scope.error.message = '<h4>Please email us a <a href="mailto:seguinhs1995@gmail.com?Subject=Refund+Request+for+20th+Reunion">seguinhs1995@gmail.com</a> for refunds or assistance changing your reservation.<br>Thank you!</h4>';
				$scope.error.level = 'alert-info';
				return;
    		}

	    	var payment = new Payments({
	    		user: $scope.user,
	    		amount: amount,
	    		token: token,
	    		guests: parseInt($scope.guests)
	    	});

	    	payment.$charge(function(charge) {

				var user = new Users($scope.user);

				user.registration = user.registration || {};
				user.registration.registered = true;
				user.registration.guests = charge.metadata.guests;
				user.registration.payments = user.registration.payments || [];
				user.registration.payments.push(charge);
				user.registration.customer = charge.customer;

				user.$update(function(response) {

		    		// on success, update global user model
					$scope.user = Authentication.user = response;

					$scope.guests = parseInt($scope.user.registration.guests);
					$scope.error.message = 'Your payment has been processed successfully. <h4>Thank you for registering!</h4><p>You will receive a receipt by email!</p>';
					$scope.error.level = 'alert-success';

					$timeout(function() {
						$scope.error = {};
						$scope.loading = false;
						$scope.showForm = false;
					}, 5000);

				}, function(errorResponse) {

					$log.log(errorResponse);
					$scope.error.message = 'Error:' + errorResponse.data.message;
					$scope.error.level = 'alert-danger';

					$timeout(function() {
						$scope.error = {};
						$scope.loading = false;
					}, 5000);

				});

			}, function(errorResponse) {

				$log.log(errorResponse);
				$scope.error.message = errorResponse.data.message;
				$scope.error.level = 'alert-danger';
				$timeout(function() {
					$scope.error = {};
					$scope.loading = false;
				}, 5000);

			});

    	};

		// Stripe Response Handler
		$scope.stripeCallback = function (code, result) {

			$scope.loading = true;

			// First we get a token from the card details that created our customer
		    if (result.error) {

				$log.log(result);
				$scope.error.level = 'alert-warning';
				$scope.error.message = result.error.message;
				$timeout(function() { $scope.error = {}; $scope.loading = false; }, 5000);

		    } else {

		    	// Assign address info to user before sending
		    	var user = new Users($scope.user);

				user.address.street = $scope.addressLine1;
				user.address.city   = $scope.addressCity;
				user.address.state  = $scope.addressState;
				user.address.zip    = $scope.addressZip;

				user.$update(function(response) {
					$scope.user = Authentication.user = response;
					processCharge(result.id);
				});

		    }
		};

		$scope.processRSVP = function() {

			$scope.loading = true;

    		var amount = $scope.guests * $scope.price - $scope.paidToDate();

    		if(amount < 0) {
				$scope.loading = false;
				$scope.error.message = '<h4>Please email us a <a href="mailto:seguinhs1995@gmail.com?Subject=Refund+Request+for+20th+Reunion">seguinhs1995@gmail.com</a> for refunds or assistance changing your reservation.<br>Thank you!</h4>';
				$scope.error.level = 'alert-info';
				return;
    		}
	    	// Assign address info to user before sending
	    	var user = new Users($scope.user);

			user.address.street = $scope.addressLine1;
			user.address.city   = $scope.addressCity;
			user.address.state  = $scope.addressState;
			user.address.zip    = $scope.addressZip;
			user.registration = user.registration || {};
			user.registration.registered = true;
			user.registration.guests = parseInt($scope.guests);

			user.$update(function(response) {
				$scope.user = Authentication.user = response;
				$scope.guests = $scope.user.registration.guests;
				$scope.showForm = false;
				$scope.error.level = 'alert-success';
				$scope.error.message = '<h4>Thank you for registering!</h4><br>We can\'t wait to see you there!';
				$timeout(function() { $scope.error = {}; $scope.loading = false; }, 5000); });

		};


		$scope.paidToDate = function() {
			var paid = 0;
		    if($scope.user.registration &&
		    	$scope.user.registration.payments) {
			    	$scope.user.registration.payments.forEach(function(pmt) {
					  paid += pmt.amount;
				});
			}
			return paid;
		};
	}
]);
'use strict';


angular.module('core').controller('SwagController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
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
'use strict';

// Configuring the Tracks module
angular.module('tracks').run(['Menus',
	function(Menus) {
		// Set top bar menu item
	}
]);
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
'use strict';

angular.module('tracks').controller('TracksController', ['$scope', '$log', '$stateParams', '$location', '$anchorScroll', '$timeout', '$sce', 'Authentication', 'Spotify', 'Tracks',
	function($scope, $log, $stateParams, $location, $anchorScroll, $timeout, $sce, Authentication, Spotify, Tracks) {

		$scope.authentication = Authentication;
		$scope.error = {};
	    $scope.audio = new Audio();
		$scope.lookup = {};

		$scope.saveTrack = function($item) {
			console.log($item);
			var track = new Tracks({
				spotifyId: $item.id,
				title: $item.name,
				artist: $item.artists[0].name,
				artwork: $item.album.images[1].url,
				preview_url: $item.preview_url
			});
			track.$save(function(response) {
				console.log(response);
				$scope.tracks.push(response);
			}, function(errorResponse) {
				$log.log(errorResponse);
				var spotifyId = errorResponse.config.data.spotifyId,
					trkId = 'track_' + spotifyId;
				$scope.error.message = errorResponse.data.message;
				$scope.error.level = 'alert-warning';
				$timeout(function() { $scope.error = {}; }, 5000);
				$location.hash(trkId);
				$log.log($scope.lookup[spotifyId]);
			});
		};

		$scope.remove = function(track) {
			if (track) {
				track.$remove(function() {
					for (var i in $scope.tracks) {
						if ($scope.tracks[i] === track) {
							$scope.tracks.splice(i, 1);
						}
					}

				}, function(errorResponse) {
					if(errorResponse.status === 403) {
						$scope.error.message = 'You can only trash tracks you\'ve added.';
						$scope.error.level = 'alert-info';
						$timeout(function() { $scope.error = {}; }, 3000);
					}
				});
			}
		};

		$scope.update = function(track) {
			track.$update(function() {
				$location.path('tracks/' + track._id);
			}, function(errorResponse) {
				$scope.error.message = errorResponse.data.message;
				$scope.error.level = 'alert-warning';
			});
		};

		$scope.upvote = function(trk) {
			var track = trk || $scope.track;
			if(track.upvotes.indexOf(Authentication.user._id) > -1) {
				$scope.error.message = 'You\'ve already upvoted ' + track.title;
				$scope.error.level = 'alert-info';
				$timeout(function() { $scope.error = {}; }, 3000);
				return;
			}
			track.votes++;
			track.upvotes.push(Authentication.user._id);
			track.downvotes.splice(track.downvotes.indexOf(Authentication.user._id), 1);
			$log.log(track);
			track.$update(function() {

				}, function(errorResponse) {
					$scope.error.message = errorResponse.data.message;
					$scope.error.level = 'alert-warning';
			});
		};
		$scope.downvote = function(trk) {
			var track = trk || $scope.track;
			if(track.downvotes.indexOf(Authentication.user._id) > -1) {
				$scope.error.message = 'You\'ve already downvoted ' + track.title;
				$scope.error.level = 'alert-info';
				$timeout(function() { $scope.error = {}; }, 3000);
				return;
			}
			track.votes--;
			track.downvotes.push(Authentication.user._id);
			track.upvotes.splice(track.upvotes.indexOf(Authentication.user._id), 1);
			$log.log(track);
			track.$update(function() {

				}, function(errorResponse) {
					$scope.error.message = errorResponse.data.message;
					$scope.error.level = 'alert-warning';
			});
		};

		$scope.searchTracks = function(val) {
			var q = val,
				options = {
					limit: 10,
					offset: 0
				};

			return Spotify.search(q, 'track', options).then(function(data) {
			  	return data.tracks.items;
			});
		};

		$scope.getAllTracks = function() {
			// return $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:3u9fHuAtjMY1RW2mZfO4Cf');
			var idArray = [];
			if($scope.tracks) {
				idArray = $scope.tracks.map(function(track) {
					return track.spotifyId;
				});
			}
				// $log.log(idArray);
				return $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:Reunion Playlist:' + idArray.join(','));
		};

		$scope.playPreview = function(track) {
			$scope.tracks.forEach(function(trk) { trk.isPlaying = false; });
			track.isPlaying = true;
            $scope.audio.src = track.preview_url;
            $scope.audio.play();
		};

		$scope.pausePreview = function(track) {
			track.isPlaying = false;
            $scope.audio.pause();
		};

		$scope.find = function() {
			$scope.tracks = Tracks.query();
		};

		$scope.findOne = function() {
			$scope.track = Tracks.get({
				trackId: $stateParams.trackId
			});
		};
	}
]);
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
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
])
.config(["uiGmapGoogleMapApiProvider", function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCYtSsxmAc8maGMVwWmeJI7ia2CkY_bBzw',
        v: '3.17',
        libraries: 'weather,geometry,visualization,places'
    });
}]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('map', {
			url: '/map',
			templateUrl: 'modules/users/views/map/map.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController',
	['$scope', '$http', '$location', '$timeout', 'Authentication',
	function($scope, $http, $location, $timeout, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
				$timeout(function() { $scope.error = ''; }, 3000);
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
				$timeout(function() { $scope.error = ''; }, 3000);
			});
		};
	}
]);
'use strict';
angular.module('users').controller('MapController', ['$scope', '$log', '$location', '$http', 'uiGmapGoogleMapApi', 'Users', 'Authentication',
    function($scope, $log, $location, $http, GoogleMapApi, Users, Authentication) {
        var googlemaps,
            service,
            mapdiv,
            mapBounds,
            locations = [],
            pinsPosted = false,
            currWindow;
        // Note: Some of the directives require at least something to be defined originally!
        $scope.user = Authentication.user;
        $scope.markers = [];
        $scope.map = {
            control: {},
            center: {
                latitude: 29.5744,
                longitude: -97.9653
            },
            zoom: 5,
            events: {
	            tilesloaded: function(map) {
		            $scope.$apply(function () {
                        mapdiv = map;
                        // creates a Google place search service object. PlacesService does the work of
                        // actually searching for location data.
                        service = new googlemaps.places.PlacesService(mapdiv);
                        if(!pinsPosted) {
                            locationFinder();
                        }
                    });
		        }
		    }
        };
        // uiGmapGoogleMapApi is a promise.
        // The "then" callback function provides the maps object.
        GoogleMapApi.then(function(maps) {
            googlemaps = maps;
            // Sets the boundaries of the map based on pin locations
            mapBounds = new googlemaps.LatLngBounds();
        });

        $scope.addLocation = function(locationData) {

        };

        $scope.allowPin = function(allow) {
            var user = new Users($scope.user);
            var allowed = user.address ? user.address.allowMapPin : false;
            if(allow && !user.address.city) {
                $location.path('/settings/profile');
            } else {
                user.address = user.address || {};
                user.address.allowMapPin = allow;
                user.$update(function(response) {
                    if(user.address.allowMapPin) {
                        $scope.marker = createMapMarker(user);
                        $scope.map.zoom = 5;
                    }
                    if(allowed && !user.address.allowMapPin) {
                        $scope.marker.setMap(null);
                        delete $scope.marker;
                        // reset map center and zoom
                        $scope.map.zoom = 5;
                        $scope.map.center = {
                            latitude: 29.5744,
                            longitude: -97.9653
                        };

                    }
                    $scope.error = {};
                });
            }
        };

        function locationFinder() {
            var users = Users.query();
            return users.$promise.then(function(data) {
                data.forEach(function(user) {
                    if(user._id === $scope.user._id) {
                        if(user.address && user.address.allowMapPin) $scope.marker = createMapMarker(user);
                        if(typeof user.address === 'undefined' ||
                            typeof user.address.allowMapPin === 'undefined')  {
                            $scope.error = {
                                level: 'info',
                                message: '<h4>Put your city on the map?</h4>' +
                                            '<p>Don\'t worry, your exact address will <b>not</b> be shown</p>'
                            };
                        }
                    } else {
                        if(user.address && user.address.allowMapPin) createMapMarker(user);

                    }
                });
                pinsPosted = true;
            });

        }
        /*
		  createMapMarker(placeData) reads Google Places search results to create map pins.
		  placeData is the object returned from search results containing information
		  about a single location.
		  */
        function createMapMarker(user) {

            // if we haven't looked up lat and lng yet, do it now
            if(!user.address.geometry) {
                placesSearch([user.address.city, user.address.state].join(', '))
                    .then(function(data) {
                        // var user = new Users(user);
                        user.address.geometry = {
                            lat: data.geometry.location.lat(),
                            lng: data.geometry.location.lng()
                        };
                        user.$update(function() {
                            if(user._id === $scope.user._id) $scope.marker = createMapMarker(user);
                            else createMapMarker(user);
                        });
                    });
                return;
            }


            var lat = user.address.geometry.lat; // latitude stored from the place service
            var lng = user.address.geometry.lng; // longitude stored from the place service
            var name = '<h4>' + user.displayName + '</h4>';
            var city = '<p>' + user.address.city + ', ' + user.address.state + '</p>';
            // marker is an object with additional data about the pin for a single location
            var marker = new googlemaps.Marker({
                map: mapdiv,
                position: new googlemaps.LatLng(lat, lng),
                title: user.displayName
            });
            var infoWindow = new googlemaps.InfoWindow({
                content: [name, city].join(''),
                maxWidth: 300
            });
            googlemaps.event.addListener(marker, 'click', function() {
                if (currWindow) currWindow.close(); // close any previously opened window
                infoWindow.open(mapdiv, this);
                currWindow = infoWindow;
            });
            // bounds.extend() takes in a map location object
            mapBounds.extend(new googlemaps.LatLng(lat, lng));
            // fit the map to the new marker
            mapdiv.fitBounds(mapBounds);

            return marker;
        }

        function placesSearch(loc) {

            // Actually searches the Google Maps API for location data and runs the callback
            // function with the search results after each search.
            return new Promise(function(resolve, reject) {
                service.textSearch({ query: loc }, function(results, status) {
                    $log.log(results, status);
                    if (status === googlemaps.places.PlacesServiceStatus.OK) {
                        resolve(results[0]);
                    } else {
                        reject(Error('Could not find place data'));
                    }
                });
            });

        }
    }
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);