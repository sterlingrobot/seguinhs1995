'use strict';

angular.module('photos').controller('PhotosController', ['$scope', '$log', '$stateParams', '$location', '$anchorScroll', '$timeout', '$sce', 'angularFileUpload', 'Authentication','Photos',
	function($scope, $log, $stateParams, $location, $anchorScroll, $timeout, $sce, angularFileUpload, Authentication, Photos) {

		var canvasPhoto;
		$scope.authentication = Authentication;
		$scope.error = {};
		$scope.topLine = '';
		$scope.bottomLine = '';

	    $scope.redrawMeme = function(image) {
	      // Get Canvas2DContext
	      var canvas = document.getElementById('memeCanvas');
	      var ctx = canvas.getContext('2d');

		  var topLine = $scope.topLine;
		  var bottomLine = $scope.bottomLine;
		  var tpl = topLine.length || 0;
		  var btl = bottomLine.length || 0;

	      var fontSize1 = Math.min(Math.max( canvas.width * 1.5 / tpl, 24 ), 90);
	      var fontSize2 = Math.min(Math.max( canvas.width * 1.5 / btl, 24 ), 90);
	      var topLineText, bottomLineText;

	      canvas.width = 500;
	      canvas.height = 500;

	      if (image)
	          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

	      // Text attributes
	      ctx.textAlign = 'center';
	      ctx.strokeStyle = 'black';
	      ctx.lineWidth = 2;
	      ctx.fillStyle = 'white';

	      if (topLine !== null) {
	      	  topLineText = topLine.replace(/\n/g, '<br>');
	          ctx.font =  fontSize1 + 'pt Impact';
	          ctx.fillText(topLine, canvas.width / 2, fontSize1 + 10);
	          ctx.strokeText(topLine, canvas.width / 2, fontSize1 + 40);
	      }

	      if (bottomLine !== null) {
	      	  bottomLineText = bottomLine.replace(/\n/g, '<br>');
	          ctx.font =  fontSize2 + 'pt Impact';
	          ctx.fillText(bottomLineText, canvas.width / 2, canvas.height - 20);
	          ctx.strokeText(bottomLineText, canvas.width / 2, canvas.height - 20);
	      }
	    };


		$scope.saveFile = function() {

	      window.open(document.querySelector('canvas').toDataURL());

	    };

	    $scope.handleFileSelect = function($files) {

	      var canvasWidth = 500;
	      var canvasHeight = 500;
	      var file = $files[0];
	      var reader = new FileReader();

	      reader.onload = function(fileObject) {

	          var data = fileObject.target.result;
	          console.log(data);

	          // Create an image object
	          var image = new Image();
	          image.onload = function() {
	            canvasPhoto = this;
	            $scope.redrawMeme(canvasPhoto, null, null);
      		  };

	          // Set image data to background image.
	          image.src = data;
	          console.log(fileObject.target.result);
	      };

	      reader.readAsDataURL(file);

	    };

		$scope.savePhoto = function($item) {
			console.log($item);
			var photo = new Photos({
				spotifyId: $item.id,
				title: $item.name,
				artist: $item.artists[0].name,
				artwork: $item.album.images[1].url,
				preview_url: $item.preview_url
			});
			photo.$save(function(response) {
				console.log(response);
				$scope.photos.push(response);
			}, function(errorResponse) {
				$log.log(errorResponse);
				var spotifyId = errorResponse.config.data.spotifyId,
					trkId = 'photo_' + spotifyId;
				$scope.error.message = errorResponse.data.message;
				$scope.error.level = 'alert-warning';
				$timeout(function() { $scope.error = {}; }, 5000);
				$location.hash(trkId);
				$log.log($scope.lookup[spotifyId]);
			});
		};

		$scope.remove = function(photo) {
			if (photo) {
				photo.$remove(function() {
					for (var i in $scope.photos) {
						if ($scope.photos[i] === photo) {
							$scope.photos.splice(i, 1);
						}
					}

				}, function(errorResponse) {
					if(errorResponse.status === 403) {
						$scope.error.message = 'You can only trash photos you\'ve added.';
						$scope.error.level = 'alert-info';
						$timeout(function() { $scope.error = {}; }, 3000);
					}
				});
			}
		};

		$scope.update = function(photo) {
			photo.$update(function() {
				$location.path('photos/' + photo._id);
			}, function(errorResponse) {
				$scope.error.message = errorResponse.data.message;
				$scope.error.level = 'alert-warning';
			});
		};

		$scope.upvote = function(trk) {
			var photo = trk || $scope.photo;
			if(photo.upvotes.indexOf(Authentication.user._id) > -1) {
				$scope.error.message = 'You\'ve already upvoted ' + photo.title;
				$scope.error.level = 'alert-info';
				$timeout(function() { $scope.error = {}; }, 3000);
				return;
			}
			photo.votes++;
			photo.upvotes.push(Authentication.user._id);
			photo.downvotes.splice(photo.downvotes.indexOf(Authentication.user._id), 1);
			$log.log(photo);
			photo.$update(function() {

				}, function(errorResponse) {
					$scope.error.message = errorResponse.data.message;
					$scope.error.level = 'alert-warning';
			});
		};
		$scope.downvote = function(trk) {
			var photo = trk || $scope.photo;
			if(photo.downvotes.indexOf(Authentication.user._id) > -1) {
				$scope.error.message = 'You\'ve already downvoted ' + photo.title;
				$scope.error.level = 'alert-info';
				$timeout(function() { $scope.error = {}; }, 3000);
				return;
			}
			photo.votes--;
			photo.downvotes.push(Authentication.user._id);
			photo.upvotes.splice(photo.upvotes.indexOf(Authentication.user._id), 1);
			$log.log(photo);
			photo.$update(function() {

				}, function(errorResponse) {
					$scope.error.message = errorResponse.data.message;
					$scope.error.level = 'alert-warning';
			});
		};

		$scope.getAllPhotos = function() {
			// return $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:photoset:PREFEREDTITLE:3u9fHuAtjMY1RW2mZfO4Cf');
			var idArray = [];
			if($scope.photos) {
				idArray = $scope.photos.map(function(photo) {
					return photo.spotifyId;
				});
			}
				// $log.log(idArray);
				return $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:photoset:Reunion Playlist:' + idArray.join(','));
		};

		$scope.playPreview = function(photo) {
			$scope.photos.forEach(function(trk) { trk.isPlaying = false; });
			photo.isPlaying = true;
            $scope.audio.src = photo.preview_url;
            $scope.audio.play();
		};

		$scope.pausePreview = function(photo) {
			photo.isPlaying = false;
            $scope.audio.pause();
		};

		$scope.find = function() {
			$scope.photos = Photos.query();
		};

		$scope.findOne = function() {
			$scope.photo = Photos.get({
				photoId: $stateParams.photoId
			});
		};
	}
]);