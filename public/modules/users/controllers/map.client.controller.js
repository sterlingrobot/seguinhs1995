'use strict';
angular.module('users').controller('MapController', ['$scope', '$log', 'uiGmapGoogleMapApi', 'Users',
    function($scope, $log, GoogleMapApi, Users) {
        var googlemaps,
            mapdiv,
            mapBounds,
            locations,
            currWindow;
        // Note: Some of the directives require at least something to be defined originally!
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
                        // locations is an array of location strings returned from locationFinder()
                        locations = locationFinder();
                        // pinPoster(locations) creates pins on the map for each location in
                        // the locations array
                        pinPoster(locations);
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

        function locationFinder() {
        	return ['Seguin, Texas', 'Bozeman, Montana', 'Australia'];
        }
        /*
		  createMapMarker(placeData) reads Google Places search results to create map pins.
		  placeData is the object returned from search results containing information
		  about a single location.
		  */
        function createMapMarker(placeData) {
            // The next lines save location data from the search result object to local variables
            var lat = placeData.geometry.location.lat(); // latitude from the place service
            var lon = placeData.geometry.location.lng(); // longitude from the place service
            var name = placeData.formatted_address; // name of the place from the place service
            // marker is an object with additional data about the pin for a single location
            var marker = new googlemaps.Marker({
                map: mapdiv,
                position: placeData.geometry.location,
                title: name
            });
            var infoWindow = new googlemaps.InfoWindow({
                content: '<h3>' + name + '</h3>',
                height: 200,
                maxWidth: 300
            });
            googlemaps.event.addListener(marker, 'click', function() {
                if (currWindow) currWindow.close(); // close any previously opened window
                infoWindow.open(mapdiv, this);
                currWindow = infoWindow;
            });
            // bounds.extend() takes in a map location object
            mapBounds.extend(new googlemaps.LatLng(lat, lon));
            // fit the map to the new marker
            mapdiv.fitBounds(mapBounds);
            // center the map
            // mapdiv.setCenter(new googlemaps.LatLng(mapBounds.getCenter())); //
        }
        /*
		  callback(results, status) makes sure the search returned results for a location.
		  If so, it creates a new map marker for that location.
		  */
        function callback(results, status) {
            if (status === googlemaps.places.PlacesServiceStatus.OK) {
                createMapMarker(results[0]);
            }
        }
        /*
		  pinPoster(locations) takes in the array of locations created by locationFinder()
		  and fires off Google place searches for each location
		  */
        function pinPoster(locations) {
            // creates a Google place search service object. PlacesService does the work of
            // actually searching for location data.
            var service = new googlemaps.places.PlacesService(mapdiv);
            // Iterates through the array of locations, creates a search object for each location
            for (var place in locations) {
                // the search request object
                var request = {
                    query: locations[place]
                };
                // Actually searches the Google Maps API for location data and runs the callback
                // function with the search results after each search.
                service.textSearch(request, callback);
            }
        }
    }
]);