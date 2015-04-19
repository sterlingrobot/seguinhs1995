'use strict';

angular.module('tracks').controller('TracksController', ['$scope', '$log', '$stateParams', '$location', '$timeout', '$sce', 'Authentication', 'Spotify', 'Tracks',
	function($scope, $log, $stateParams, $location, $timeout, $sce, Authentication, Spotify, Tracks) {
		$scope.authentication = Authentication;
		$scope.error = {};
	    $scope.audio = new Audio();

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
				$scope.find();
			}, function(errorResponse) {
				$scope.error.message = errorResponse.data.message;
				$scope.error.level = 'alert-warning';

			});
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