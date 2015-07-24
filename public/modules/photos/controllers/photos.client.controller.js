'use strict';

angular.module('photos').controller('PhotosController', ['$scope', '$log', '$stateParams', '$location', '$anchorScroll', '$timeout', '$sce', 'Authentication','Photos',
	function($scope, $log, $stateParams, $location, $anchorScroll, $timeout, $sce, Authentication, Photos) {

		$scope.photos = [];
		$scope.canvasPhoto = null;
		$scope.authentication = Authentication;
		$scope.error = {};
		$scope.topLine = '';
		$scope.bottomLine = '';

	    $scope.redrawMeme = function(image) {
	      // Get Canvas2DContext
	      var canvas = document.getElementById('memeCanvas');
	      var ctx = canvas.getContext('2d');

      	  var topTextArray = $scope.topLine.split('\n');
      	  var btmTextArray = $scope.bottomLine.split('\n');
		  var tpl = topTextArray.reduce(function (a, b) { return a.length > b.length ? a : b; }).length;
		  var btl = btmTextArray.reduce(function (a, b) { return a.length > b.length ? a : b; }).length;

	      var fontSize1 = Math.min(Math.max( canvas.width * 1.5 / tpl, 24 ), 90);
	      var fontSize2 = Math.min(Math.max( canvas.width * 1.5 / btl, 24 ), 90);
	      var topLineText, bottomLineText;

	      canvas.width = 500;
	      canvas.height = 500;

	      if (image)
	          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	      else ctx.drawImage($scope.canvasPhoto, 0, 0, canvas.width, canvas.height);

	      // Text attributes
	      ctx.textAlign = 'center';
	      ctx.strokeStyle = 'black';
	      ctx.lineWidth = 2;
	      ctx.fillStyle = 'white';

	      if (topTextArray[0].length > 0) {
	      	  for(var i = 0; i < topTextArray.length; i++) {
				  fontSize1 = Math.min(Math.max( canvas.width * 1.5 / topTextArray[i].length, 24 ), 90);
				  var h = fontSize1 * i;
	          	  ctx.font =  fontSize1 + 'pt Impact';
		          ctx.fillText(topTextArray[i], canvas.width / 2, h + fontSize1 + 10);
		          ctx.strokeText(topTextArray[i], canvas.width / 2, h + fontSize1 + 10);
	      	  }
	      }

	      if (btmTextArray[0].length > 0) {
	      	  for(var j = btmTextArray.length - 1; j > -1; j--) {
				  fontSize2 = Math.min(Math.max( canvas.width * 1.5 / btmTextArray[j].length, 24 ), 90);
				  var h2 = fontSize2 * j;
	          	  ctx.font =  fontSize2 + 'pt Impact';
				  ctx.fillText(btmTextArray[j], canvas.width / 2, canvas.height - h2 - 20);
		          ctx.strokeText(btmTextArray[j], canvas.width / 2, canvas.height - h2 - 20);
	          }
	      }
	    };

		$scope.savePhoto = function(data) {

			var photo = new Photos({
				content: document.querySelector('canvas').toDataURL(),
				title: $scope.topLine.trim() + ' ' + $scope.bottomLine.trim()
			});
			photo.$save(function(response) {
				console.log(response);
				$scope.photos.push(response);
			}, function(errorResponse) {
				$log.log(errorResponse);
				$scope.error.message = errorResponse.data.message;
				$scope.error.level = 'alert-warning';
				$timeout(function() { $scope.error = {}; }, 5000);
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

		$scope.upvote = function($photo) {
			var photo = $photo || $scope.photo;
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
		$scope.downvote = function($photo) {
			var photo = $photo || $scope.photo;
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

angular.module('photos').directive('file', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function($scope, el, attrs, ngModel){

            el.bind('change', function(event){
            	console.log(event);
                var files = event.target.files;
                var file = files[0];

                ngModel.$setViewValue(file);
                $scope.$apply();


				var reader = new FileReader();

				reader.onload = function(fileObject) {

				  var data = fileObject.target.result;
				  console.log(data);

				  // Create an image object
				  var image = new Image();
				  image.onload = function() {
				  	$scope.canvasPhoto = this;
				    $scope.redrawMeme($scope.canvasPhoto, null, null);
				  };

				  // Set image data to background image.
				  image.src = data;
				  console.log(fileObject.target.result);
				};

				reader.readAsDataURL(file);
				});
        }
    };
});