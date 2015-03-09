'use strict';

angular.module('tracks').controller('TracksController', ['$scope', '$stateParams', '$location', '$timeout', 'Authentication', 'Spotify', 'Tracks',
	function($scope, $stateParams, $location, $timeout, Authentication, Spotify, Tracks) {
		$scope.authentication = Authentication;
		$scope.error = {};

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
			console.log(track);
			track.$update(function() {
				$location.path('tracks/' + track._id);
			}, function(errorResponse) {
				$scope.error.message = errorResponse.data.message;
				$scope.error.level = 'alert-warning';
			});
		};

		$scope.vote = function(trk, num) {
			var track = trk || $scope.track;
			track.votes += num;
			track.$update(function() {
				console.log(track);
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

			return Spotify.search(q, 'track', options).then(function (data) {
				console.log(data.tracks.items);
			  return data.tracks.items;
			  // .map(function(item) {
			  // 	return item.artists[0].name + ' - ' + item.name;
			  // });
			});
		};

		$scope.saveTrack = function($item) {
			console.log($item);
			var track = new Tracks({
				title: $item.name,
				artist: $item.artists[0].name,
				artwork: $item.album.images[1].url
			});
			track.$save(function(response) {
				console.log(response);
				$scope.find();
			}, function(errorResponse) {
				$scope.error.message = errorResponse.data.message;
				$scope.error.level = 'alert-warning';

			});
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