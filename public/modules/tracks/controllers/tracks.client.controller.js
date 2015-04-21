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