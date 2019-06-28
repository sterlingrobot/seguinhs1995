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

		var placesSearch = function(loc) {
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
		};

		/*
		  createMapMarker(placeData) reads Google Places search results to create map pins.
		  placeData is the object returned from search results containing information
		  about a single location.
		  */
		var createMapMarker = function (user) {

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
		};

		var locationFinder = function() {
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
		};

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
	}
]);
